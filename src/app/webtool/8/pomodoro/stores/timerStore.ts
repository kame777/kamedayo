import { create } from 'zustand';
import { TimerPhase, TimerStatus } from '../types';

interface TimerStore {
    phase: TimerPhase;
    status: TimerStatus;
    remainingSeconds: number;
    currentSession: number;
    totalSessions: number;

    // Actions
    setPhase: (phase: TimerPhase) => void;
    setStatus: (status: TimerStatus) => void;
    setRemainingSeconds: (seconds: number) => void;
    tick: () => void;
    setCurrentSession: (session: number) => void;
    setTotalSessions: (total: number) => void;
    reset: (durationSeconds: number) => void;
}

export const useTimerStore = create<TimerStore>((set) => ({
    phase: 'work',
    status: 'idle',
    remainingSeconds: 25 * 60,
    currentSession: 1,
    totalSessions: 4,

    setPhase: (phase) => set({ phase }),
    setStatus: (status) => set({ status }),
    setRemainingSeconds: (seconds) => set({ remainingSeconds: seconds }),
    tick: () =>
        set((state) => ({
            remainingSeconds: Math.max(0, state.remainingSeconds - 1),
        })),
    setCurrentSession: (session) => set({ currentSession: session }),
    setTotalSessions: (total) => set({ totalSessions: total }),
    reset: (durationSeconds) =>
        set({
            remainingSeconds: durationSeconds,
            status: 'idle',
        }),
}));
