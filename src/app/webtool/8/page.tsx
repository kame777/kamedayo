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
    <>
      <HeroBanner
        badge={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pomodoro
          </span>
        }
        title="ポモドーロタイマー"
        subtitle="作業と休憩を管理して集中力を高める"
      />

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

          <SessionStatus />
        </main>

        <Navigation />
      </div>

      <div className="infoBox">
        <h3 className="infoTitle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.09 14.15C16.59 12.8 17.5 10.95 17.5 9a6 6 0 1 0-11 0c0 1.95.91 3.8 2.41 5.15" />
          </svg>
          使い方
        </h3>
        <ul className="infoList">
          <li className="infoItem">
            GitHubアカウントでログインすると、設定や統計データがクラウドに同期されます
          </li>
          <li className="infoItem">
            他のデバイスやブラウザでも、同じ設定でタイマーを利用できるようになります
          </li>
          <li className="infoItem">
            作業時間や休憩時間を変更すると、タイマーは自動的にリセットされます
          </li>
        </ul>
      </div>
    </>
  );
}
