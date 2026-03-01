import { UserSettings, DEFAULT_SETTINGS } from '../types';

const SETTINGS_STORAGE_KEY = 'pomodoro-settings';
const SESSIONS_STORAGE_KEY = 'pomodoro-sessions-local';
const TODOS_STORAGE_KEY = 'pomodoro-todos-local';
const SELECTED_TODO_KEY = 'pomodoro-selected-todo';

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
    todo_id?: string;
}

/**
 * Local todo record for guest mode
 */
export interface LocalTodo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    total_time_spent: number;
    estimated_pomodoros?: number;
    created_at: string;
    updated_at: string;
    order_index: number;
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
 * Save todos to localStorage
 */
export function saveTodosLocal(todos: LocalTodo[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        console.error('Failed to save todos:', error);
    }
}

/**
 * Load todos from localStorage
 */
export function loadTodosLocal(): LocalTodo[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(TODOS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Save selected todo ID to localStorage
 */
export function saveSelectedTodoLocal(todoId: string | null): void {
    if (typeof window === 'undefined') return;
    if (todoId === null) {
        localStorage.removeItem(SELECTED_TODO_KEY);
    } else {
        localStorage.setItem(SELECTED_TODO_KEY, todoId);
    }
}

/**
 * Load selected todo ID from localStorage
 */
export function loadSelectedTodoLocal(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(SELECTED_TODO_KEY);
}

/**
 * Clear todos from localStorage
 */
export function clearTodosLocal(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TODOS_STORAGE_KEY);
    localStorage.removeItem(SELECTED_TODO_KEY);
}

/**
 * Generate a simple UUID v4
 */
export function generateId(): string {
    return crypto.randomUUID();
}
