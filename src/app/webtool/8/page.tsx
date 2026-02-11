'use client';

import { useTimer } from '@/app/webtool/8/pomodoro/hooks/useTimer';
import { useSettings } from '@/app/webtool/8/pomodoro/hooks/useSettings';
import TimerDisplay from '@/app/webtool/8/pomodoro/components/TimerDisplay';
import TimerControls from '@/app/webtool/8/pomodoro/components/TimerControls';
import Navigation from '@/app/webtool/8/pomodoro/components/Navigation';
import AuthButton from '@/app/webtool/8/pomodoro/components/AuthButton';
import { TimerPhase } from '@/app/webtool/8/pomodoro/types';
import { PHASE_LABELS } from '@/app/webtool/8/pomodoro/utils/constants';
import HeroBanner from '@/app/components/HeroBanner';
import { useEffect } from 'react';

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

  // Update document title with timer
  useEffect(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.title = status === 'running'
      ? `${timeStr} - ${PHASE_LABELS[phase]} | ポモドーロ`
      : 'ポモドーロタイマー';
  }, [remainingSeconds, status, phase]);

  return (
    <>
      <HeroBanner
        badge="🍅 Pomodoro"
        title="ポモドーロ"
        subtitle="作業と休憩を管理して集中力を高める"
      >
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <AuthButton />
        </div>
      </HeroBanner>

      <div className="appShell">
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
        </main>

        <Navigation />
      </div>
    </>
  );
}
