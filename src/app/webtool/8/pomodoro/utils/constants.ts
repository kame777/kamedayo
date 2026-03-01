import { TimerPhase } from '../types';

export const PHASE_LABELS: Record<TimerPhase, string> = {
    work: '作業中',
    short_break: '短い休憩',
    long_break: '長い休憩',
};

export const PHASE_COLORS: Record<TimerPhase, string> = {
    work: 'var(--color-work)',
    short_break: 'var(--color-short-break)',
    long_break: 'var(--color-long-break)',
};
