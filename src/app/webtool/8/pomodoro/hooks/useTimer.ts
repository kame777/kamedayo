'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useTimerStore } from '../stores/timerStore';
import { useSettingsStore } from '../stores/settingsStore';
import { TimerPhase, TimerStatus } from '../types';
import { saveSessionLocal, generateId } from '../utils/storage';
import { useAuthStore } from '../stores/authStore';
import { createClient } from '@/lib/supabase/client';

export function useTimer() {
    const {
        phase,
        status,
        remainingSeconds,
        currentSession,
        totalSessions,
        setPhase,
        setStatus,
        setRemainingSeconds,
        tick,
        setCurrentSession,
        setTotalSessions,
        reset,
    } = useTimerStore();

    const { settings } = useSettingsStore();
    const { user } = useAuthStore();
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isSyncingRef = useRef(false);


    // --- Utility: Get duration ---
    const getDuration = useCallback(
        (p: TimerPhase): number => {
            switch (p) {
                case 'work': return settings.work_duration * 60;
                case 'short_break': return settings.short_break_duration * 60;
                case 'long_break': return settings.long_break_duration * 60;
                default: return 25 * 60;
            }
        },
        [settings]
    );

    // --- Cloud Sync: Push state to Supabase ---
    const syncToCloud = useCallback(async (overrides: any = {}, force = false) => {
        if (!user) return;
        if (isSyncingRef.current && !force) return;

        const supabase = createClient();
        const state = useTimerStore.getState();

        const payload = {
            user_id: user.id,
            phase: overrides.phase || state.phase,
            status: overrides.status || state.status,
            remaining_seconds: overrides.remainingSeconds !== undefined ? overrides.remainingSeconds : state.remainingSeconds,
            current_session: overrides.currentSession || state.currentSession,
            last_updated_at: new Date().toISOString(),
        };

        try {
            isSyncingRef.current = true;
            const { error } = await supabase
                .from('timer_state')
                .upsert(payload, { onConflict: 'user_id' });

            if (error) console.error('Timer sync error:', error.message);
        } finally {
            isSyncingRef.current = false;
        }
    }, [user]);

    const hasPulledRef = useRef(false);
    const prevSettingsRef = useRef(settings);

    // Watch for setting changes to durations or interval, and force a reset if they change
    useEffect(() => {
        // Initially, set initial values from settings only for guest mode
        if (!hasPulledRef.current) {
            prevSettingsRef.current = settings;

            // For guest mode, initialize from settings
            if (!user) {
                const nextSeconds = settings.work_duration * 60;
                const nextSession = 1;
                const nextPhase = 'work';
                const nextStatus = 'idle';

                useTimerStore.setState({
                    phase: nextPhase,
                    remainingSeconds: nextSeconds,
                    currentSession: nextSession,
                    totalSessions: settings.long_break_interval,
                    status: nextStatus
                });

                hasPulledRef.current = true;
            } else {
                // For authenticated users, only set totalSessions and wait for DB pull
                setTotalSessions(settings.long_break_interval);
            }
            return;
        }

        const s = settings;
        const ps = prevSettingsRef.current;

        const durableSettingsChanged = 
            s.work_duration !== ps.work_duration ||
            s.short_break_duration !== ps.short_break_duration ||
            s.long_break_duration !== ps.long_break_duration ||
            s.long_break_interval !== ps.long_break_interval;

        if (durableSettingsChanged) {
            const nextSeconds = s.work_duration * 60;
            const nextSession = 1;
            const nextPhase = 'work';
            const nextStatus = 'idle';

            // Reset both local store and ensure cloud is in sync
            useTimerStore.setState({
                phase: nextPhase,
                remainingSeconds: nextSeconds,
                currentSession: nextSession,
                totalSessions: s.long_break_interval,
                status: nextStatus
            });

            syncToCloud({
                phase: nextPhase,
                remainingSeconds: nextSeconds,
                currentSession: nextSession,
                status: nextStatus
            }, true);

            prevSettingsRef.current = settings;
        } else {
            // Even if not a "reset" change, keep totalSessions in sync
            setTotalSessions(settings.long_break_interval);
        }
    }, [settings, setTotalSessions, syncToCloud]);

    // --- Cloud Sync: Pull initial state & Subscribe ---
    useEffect(() => {
        if (!user) return;

        const supabase = createClient();

        // 1. Initial Pull
        const fetchInitialState = async () => {
            // Already pulled in this session or timer is active
            if (hasPulledRef.current) return;
            
            const currentGlobalStatus = useTimerStore.getState().status;
            // If timer is already running (e.g. from a previous page view), don't overwrite with old DB state
            if (currentGlobalStatus === 'running') {
                hasPulledRef.current = true;
                return;
            }

            const { data } = await supabase
                .from('timer_state')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (data) {
                // Double check status before applying to avoid race conditions
                if (useTimerStore.getState().status !== 'running') {
                    setPhase(data.phase as TimerPhase);
                    setStatus(data.status as TimerStatus);
                    setRemainingSeconds(data.remaining_seconds);
                    setCurrentSession(data.current_session);
                }
            }
            hasPulledRef.current = true;
        };
        fetchInitialState();

        // 2. Realtime Subscribe
        const channel = supabase
            .channel(`timer-sync-${user.id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'timer_state', filter: `user_id=eq.${user.id}` },
                (payload) => {
                    // 送信中のフラグが立っている間は自分自身のイベントを無視するが、
                    // forceフラグなしの通常同期のみ無視するロジック
                    if (isSyncingRef.current) return;

                    const newData = payload.new as any;
                    if (!newData) return;

                    // 自分が「実行中」なら、他のデバイス/タブからの更新であっても上書きを慎重にする
                    // (基本的には自分のローカルタイマーを優先)
                    const currentStatus = useTimerStore.getState().status;
                    if (currentStatus === 'running' && newData.status !== 'running') {
                        // 自分が走っているのに、DBから「停止」が降ってきた場合は無視するか検討が必要
                        // ここでは、自分が走っている間は秒数の大幅な巻き戻りを防ぐため同期をスキップ
                        return;
                    }

                    // サーバーからの値でストアを更新
                    useTimerStore.setState({
                        phase: newData.phase,
                        status: newData.status,
                        remainingSeconds: newData.remaining_seconds,
                        currentSession: newData.current_session
                    });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, setPhase, setStatus, setRemainingSeconds, setCurrentSession]);

    // --- Notifications ---
    const playSound = useCallback(() => {
        if (!settings.sound_notification) return;
        try {
            const audio = new Audio('/sounds/complete.mp3');
            audio.volume = 0.5;
            audio.play().catch(e => {
                // Autoplay policy might block it if no user gesture yet
                console.warn('Audio play failed (waiting for user gesture?):', e);
            });
        } catch (e) {
            console.error('Audio initialization error:', e);
        }
    }, [settings.sound_notification]);

    const showNotification = useCallback((title: string, body: string) => {
        if (!settings.browser_notification || typeof window === 'undefined' || !('Notification' in window)) return;
        
        if (Notification.permission === 'granted') {
            new Notification(title, { 
                body,
                icon: '/logo192.png',
                silent: false // Sound is handled by playSound()
            });
        }
    }, [settings.browser_notification]);

    // --- Timer Core logic ---
    const handleComplete = useCallback(async () => {
        playSound();

        let nextPhase: TimerPhase;
        let nextSession = currentSession;

        if (phase === 'work') {
            showNotification('作業完了！', '休憩しましょう');
            nextPhase = currentSession >= totalSessions ? 'long_break' : 'short_break';
        } else {
            showNotification('休憩終了！', '作業を再開しましょう');
            nextPhase = 'work';
            nextSession = phase === 'long_break' ? 1 : currentSession + 1;
        }

        const nextSeconds = getDuration(nextPhase);
        const nextStatus = settings.auto_start ? 'running' : 'idle';

        // Local Update: set all fields atomically with idle status first.
        // React 18 batches synchronous Zustand updates into one render, so
        // reset(idle) + setStatus(running) would both land as "running" and
        // useEffect([status]) would never re-fire to restart the interval.
        // By always committing idle first, the effect detects running→idle,
        // then setTimeout triggers idle→running in the next tick.
        useTimerStore.setState({
            remainingSeconds: nextSeconds,
            phase: nextPhase,
            currentSession: nextSession,
            status: 'idle',
        });
        if (nextStatus === 'running') {
            setTimeout(() => setStatus('running'), 0);
        }

        // Sync (handleComplete は重要なので force 同期)
        await syncToCloud({
            phase: nextPhase,
            currentSession: nextSession,
            remainingSeconds: nextSeconds,
            status: nextStatus
        }, true);

        // Save Stat
        if (phase === 'work') {
            const activeTodoId = useTimerStore.getState().activeTodoId;

            const sessionData = {
                id: generateId(),
                session_type: phase,
                duration: getDuration(phase),
                completed_at: new Date().toISOString(),
                todo_id: activeTodoId || undefined
            };

            if (user) {
                const supabase = createClient();
                await supabase.from('pomodoro_sessions').insert({ user_id: user.id, ...sessionData });

                // Update todo time in cloud
                if (activeTodoId) {
                    // Fetch current todo
                    const { data: todo } = await supabase
                        .from('todos')
                        .select('total_time_spent')
                        .eq('id', activeTodoId)
                        .single();

                    if (todo) {
                        await supabase
                            .from('todos')
                            .update({
                                total_time_spent: todo.total_time_spent + sessionData.duration,
                                updated_at: new Date().toISOString()
                            })
                            .eq('id', activeTodoId);
                    }
                }
            } else {
                saveSessionLocal(sessionData);

                // Update todo time locally
                if (activeTodoId) {
                    const { loadTodosLocal, saveTodosLocal } = await import('../utils/storage');
                    const todos = loadTodosLocal();
                    const updated = todos.map(t =>
                        t.id === activeTodoId
                            ? { ...t, total_time_spent: t.total_time_spent + sessionData.duration, updated_at: new Date().toISOString() }
                            : t
                    );
                    saveTodosLocal(updated);
                }
            }
        }
    }, [phase, currentSession, totalSessions, settings, getDuration, playSound, showNotification, setPhase, setCurrentSession, setStatus, reset, syncToCloud, user]);

    // Store callbacks in refs to avoid recreating interval
    const tickRef = useRef(tick);
    const handleCompleteRef = useRef(handleComplete);
    const syncToCloudRef = useRef(syncToCloud);

    useEffect(() => {
        tickRef.current = tick;
        handleCompleteRef.current = handleComplete;
        syncToCloudRef.current = syncToCloud;
    }, [tick, handleComplete, syncToCloud]);

    useEffect(() => {
        // 既存のインターバルをクリア
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        if (status === 'running') {
            intervalRef.current = setInterval(() => {
                const currentSeconds = useTimerStore.getState().remainingSeconds;
                if (currentSeconds <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    handleCompleteRef.current();
                } else {
                    tickRef.current();
                    // 定期同期
                    if (currentSeconds % 10 === 0) syncToCloudRef.current();
                }
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [status]);

    // --- Handlers ---
    const start = useCallback(() => {
        setStatus('running');
        syncToCloud({ status: 'running' }, true);
    }, [setStatus, syncToCloud]);

    const pause = useCallback(() => {
        setStatus('paused');
        syncToCloud({ status: 'paused' }, true);
    }, [setStatus, syncToCloud]);

    const resetTimer = useCallback(async () => {
        const dur = getDuration(phase);
        // ストアを直接更新して反映を確実にする
        useTimerStore.setState({
            remainingSeconds: dur,
            status: 'idle'
        });
        // 強制同期
        await syncToCloud({
            status: 'idle',
            remainingSeconds: dur,
            phase: phase
        }, true);
    }, [getDuration, phase, syncToCloud]);

    const skip = useCallback(async () => {
        let nextPhase: TimerPhase;
        let nextSession = currentSession;
        if (phase === 'work') {
            nextPhase = currentSession >= totalSessions ? 'long_break' : 'short_break';
        } else {
            nextPhase = 'work';
            nextSession = phase === 'long_break' ? 1 : currentSession + 1;
        }
        const dur = getDuration(nextPhase);

        useTimerStore.setState({
            phase: nextPhase,
            currentSession: nextSession,
            remainingSeconds: dur,
            status: 'idle'
        });

        await syncToCloud({
            phase: nextPhase,
            currentSession: nextSession,
            remainingSeconds: dur,
            status: 'idle'
        }, true);
    }, [phase, currentSession, totalSessions, getDuration, syncToCloud]);

    return { phase, status, remainingSeconds, currentSession, totalSessions, start, pause, resetTimer, skip, testSound: playSound, testNotification: () => showNotification('テスト通知', 'これは通知のテストです') };
}
