'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { createClient } from '@/lib/supabase/client';
import { Stats, PomodoroSession } from '../types';
import { loadSessionsLocal } from '../utils/storage';
import { getStartOfToday, getStartOfWeek, getStartOfMonth } from '../utils/formatTime';

const EMPTY_STATS: Stats = {
    today_count: 0,
    today_minutes: 0,
    week_count: 0,
    month_count: 0,
    total_count: 0,
    total_minutes: 0,
    streak_days: 0,
    recent_sessions: [],
};

export function useStats() {
    const { user } = useAuthStore();
    const [stats, setStats] = useState<Stats>(EMPTY_STATS);
    const [isLoading, setIsLoading] = useState(true);

    const calculateLocalStats = useCallback((): Stats => {
        const sessions = loadSessionsLocal();
        const workSessions = sessions.filter((s) => s.session_type === 'work');

        const today = getStartOfToday();
        const weekStart = getStartOfWeek();
        const monthStart = getStartOfMonth();

        const todaySessions = workSessions.filter(
            (s) => new Date(s.completed_at) >= today
        );
        const weekSessions = workSessions.filter(
            (s) => new Date(s.completed_at) >= weekStart
        );
        const monthSessions = workSessions.filter(
            (s) => new Date(s.completed_at) >= monthStart
        );

        const totalMinutes = Math.round(
            workSessions.reduce((sum, s) => sum + s.duration, 0) / 60
        );
        const todayMinutes = Math.round(
            todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60
        );

        // Calculate streak
        const streak = calculateStreak(workSessions.map((s) => s.completed_at));

        // Recent sessions (last 20)
        const recentSessions: PomodoroSession[] = sessions
            .slice(-20)
            .reverse()
            .map((s) => ({
                ...s,
                user_id: 'local',
                created_at: s.completed_at,
            }));

        return {
            today_count: todaySessions.length,
            today_minutes: todayMinutes,
            week_count: weekSessions.length,
            month_count: monthSessions.length,
            total_count: workSessions.length,
            total_minutes: totalMinutes,
            streak_days: streak,
            recent_sessions: recentSessions,
        };
    }, []);

    const fetchCloudStats = useCallback(async (): Promise<Stats> => {
        if (!user) return EMPTY_STATS;

        const supabase = createClient();
        const today = getStartOfToday().toISOString();
        const weekStart = getStartOfWeek().toISOString();
        const monthStart = getStartOfMonth().toISOString();

        // Fetch all work sessions for totals
        const { data: allSessions } = await supabase
            .from('pomodoro_sessions')
            .select('*')
            .eq('user_id', user.id)
            .eq('session_type', 'work')
            .order('completed_at', { ascending: false });

        if (!allSessions) return EMPTY_STATS;

        const todaySessions = allSessions.filter(
            (s) => s.completed_at >= today
        );
        const weekSessions = allSessions.filter(
            (s) => s.completed_at >= weekStart
        );
        const monthSessions = allSessions.filter(
            (s) => s.completed_at >= monthStart
        );

        const totalMinutes = Math.round(
            allSessions.reduce((sum, s) => sum + s.duration, 0) / 60
        );
        const todayMinutes = Math.round(
            todaySessions.reduce((sum, s) => sum + s.duration, 0) / 60
        );

        const streak = calculateStreak(allSessions.map((s) => s.completed_at));

        // Recent sessions (last 20, all types)
        const { data: recentData } = await supabase
            .from('pomodoro_sessions')
            .select('*')
            .eq('user_id', user.id)
            .order('completed_at', { ascending: false })
            .limit(20);

        return {
            today_count: todaySessions.length,
            today_minutes: todayMinutes,
            week_count: weekSessions.length,
            month_count: monthSessions.length,
            total_count: allSessions.length,
            total_minutes: totalMinutes,
            streak_days: streak,
            recent_sessions: (recentData as PomodoroSession[]) || [],
        };
    }, [user]);

    const refreshStats = useCallback(async () => {
        setIsLoading(true);
        try {
            if (user) {
                const cloudStats = await fetchCloudStats();
                setStats(cloudStats);
            } else {
                const localStats = calculateLocalStats();
                setStats(localStats);
            }
        } catch {
            // fallback to local
            const localStats = calculateLocalStats();
            setStats(localStats);
        }
        setIsLoading(false);
    }, [user, fetchCloudStats, calculateLocalStats]);

    useEffect(() => {
        refreshStats();
    }, [refreshStats]);

    return { stats, isLoading, refreshStats };
}

/**
 * Calculate streak days from an array of ISO date strings
 */
function calculateStreak(completedDates: string[]): number {
    if (completedDates.length === 0) return 0;

    // Get unique dates (local timezone)
    const uniqueDates = new Set<string>();
    completedDates.forEach((dateStr) => {
        const d = new Date(dateStr);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        uniqueDates.add(key);
    });

    const sortedDates = Array.from(uniqueDates).sort().reverse();

    // Check if today or yesterday is in the list
    const now = new Date();
    const todayKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${yesterday.getMonth()}-${yesterday.getDate()}`;

    if (sortedDates[0] !== todayKey && sortedDates[0] !== yesterdayKey) {
        return 0;
    }

    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
        // Check if this date is exactly 1 day before the previous
        const parts = sortedDates[i - 1].split('-').map(Number);
        const prevDate = new Date(parts[0], parts[1], parts[2]);
        prevDate.setDate(prevDate.getDate() - 1);
        const expectedKey = `${prevDate.getFullYear()}-${prevDate.getMonth()}-${prevDate.getDate()}`;

        if (sortedDates[i] === expectedKey) {
            streak++;
        } else {
            break;
        }
    }

    return streak;
}
