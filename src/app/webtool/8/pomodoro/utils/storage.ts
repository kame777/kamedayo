import { UserSettings, DEFAULT_SETTINGS } from '../types';

const SETTINGS_STORAGE_KEY = 'pomodoro-settings';
const SESSIONS_STORAGE_KEY = 'pomodoro-sessions-local';

/**
 * Save settings to localStorage
 */
export function saveSettingsLocal(settings: UserSettings): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

/**
 * Load settings from localStorage
 */
export function loadSettingsLocal(): UserSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
        const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
        if (!stored) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
        return DEFAULT_SETTINGS;
    }
}

/**
 * Minimal local session record for guest mode
 */
export interface LocalSession {
    id: string;
    session_type: 'work' | 'short_break' | 'long_break';
    duration: number;
    completed_at: string;
}

/**
 * Save a completed session to localStorage (guest mode)
 */
export function saveSessionLocal(session: LocalSession): void {
    if (typeof window === 'undefined') return;
    try {
        const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
        const sessions: LocalSession[] = stored ? JSON.parse(stored) : [];
        sessions.push(session);
        // Keep only last 500 sessions locally
        if (sessions.length > 500) {
            sessions.splice(0, sessions.length - 500);
        }
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch {
        // ignore
    }
}

/**
 * Load local sessions from localStorage
 */
export function loadSessionsLocal(): LocalSession[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Clear local sessions (after merged to cloud)
 */
export function clearSessionsLocal(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSIONS_STORAGE_KEY);
}

/**
 * Generate a simple UUID v4
 */
export function generateId(): string {
    return crypto.randomUUID();
}
