'use client';

import { useTimer } from '@/app/webtool/8/pomodoro/hooks/useTimer';
import { useSettings } from '@/app/webtool/8/pomodoro/hooks/useSettings';
import TimerDisplay from '@/app/webtool/8/pomodoro/components/TimerDisplay';
import TimerControls from '@/app/webtool/8/pomodoro/components/TimerControls';
import { TimerPhase } from '@/app/webtool/8/pomodoro/types';
import SessionStatus from '@/app/webtool/8/pomodoro/components/SessionStatus';

export default function HomePage() {
  const { settings } = useSettings();
  const {
    phase,
    status,
    remainingSeconds,
    currentSession,
    totalSessions,
    start,
    pause,
    resetTimer,
    skip,
  } = useTimer();

  // Get total duration for current phase
  const getTotalSeconds = (p: TimerPhase): number => {
    switch (p) {
      case 'work':
        return settings.work_duration * 60;
      case 'short_break':
        return settings.short_break_duration * 60;
      case 'long_break':
        return settings.long_break_duration * 60;
    }
  };


  return (
    <main className="appContent">
      <TimerDisplay
        phase={phase}
        remainingSeconds={remainingSeconds}
        totalSeconds={getTotalSeconds(phase)}
        currentSession={currentSession}
        totalSessions={totalSessions}
      />

      <TimerControls
        status={status}
        onStart={start}
        onPause={pause}
        onReset={resetTimer}
        onSkip={skip}
      />

      <SessionStatus />
    </main>
  );
}
