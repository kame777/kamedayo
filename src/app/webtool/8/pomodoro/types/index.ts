// ===== Timer Types =====

export type TimerPhase = 'work' | 'short_break' | 'long_break';

export type TimerStatus = 'idle' | 'running' | 'paused';

export interface TimerState {
  phase: TimerPhase;
  status: TimerStatus;
  remainingSeconds: number;
  currentSession: number; // 1-indexed, which pomodoro we're on
  totalSessions: number;  // how many pomodoros before long break
}

// ===== Settings Types =====

export interface UserSettings {
  work_duration: number;       // minutes
  short_break_duration: number; // minutes
  long_break_duration: number;  // minutes
  long_break_interval: number;  // number of pomodoros before long break
  auto_start: boolean;
  browser_notification: boolean;
  sound_notification: boolean;
}

export const DEFAULT_SETTINGS: UserSettings = {
  work_duration: 25,
  short_break_duration: 5,
  long_break_duration: 15,
  long_break_interval: 4,
  auto_start: false,
  browser_notification: false,
  sound_notification: false,
};

// ===== Session / Stats Types =====

export interface PomodoroSession {
  id: string;
  user_id: string;
  session_type: TimerPhase;
  duration: number; // seconds
  completed_at: string; // ISO 8601
  created_at: string;
}

export interface Stats {
  today_count: number;
  today_minutes: number;
  week_count: number;
  month_count: number;
  total_count: number;
  total_minutes: number;
  streak_days: number;
  recent_sessions: PomodoroSession[];
}

// ===== Auth Types =====

export interface UserProfile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}
