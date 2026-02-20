'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import HeroBanner from '@/app/components/HeroBanner';
import Navigation from '@/app/webtool/8/pomodoro/components/Navigation';
import TodoPanel from '@/app/webtool/8/pomodoro/components/TodoPanel';
import SettingsModal from '@/app/webtool/8/pomodoro/components/SettingsModal';
import StatsModal from '@/app/webtool/8/pomodoro/components/StatsModal';
import { useAuth } from '@/app/webtool/8/pomodoro/hooks/useAuth';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  useAuth(); // Initialize auth state globally on page load
  const pathname = usePathname();
  const isHomePage = pathname === '/webtool/8';

  // Modal states
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTodoPanelOpen, setIsTodoPanelOpen] = useState(false);

  // Load panel state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pomodoro-todo-panel-open');
    if (saved) {
      setIsTodoPanelOpen(saved === 'true');
    }
  }, []);

  // Determine HeroBanner props based on current path
  const getHeroProps = () => {
    if (pathname === '/webtool/8/stats') {
      return {
        badge: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            Statistics
          </span>
        ),
        title: "統計",
        subtitle: "最近の作業記録を確認"
      };
    } else if (pathname === '/webtool/8/settings') {
      return {
        badge: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            Settings
          </span>
        ),
        title: "設定",
        subtitle: "タイマーの動作を自分好みにカスタマイズ"
      };
    } else {
      // Default to Home/Pomodoro
      return {
        badge: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Pomodoro
          </span>
        ),
        title: "ポモドーロタイマー",
        subtitle: "作業と休憩を管理して集中力を高める"
      };
    }
  };

  const heroProps = getHeroProps();

  return (
    <>
      <HeroBanner {...heroProps} />

      <div className="appShell">
        {children}
        <Navigation
          onTasksClick={() => setIsTodoPanelOpen(!isTodoPanelOpen)}
          onStatsClick={() => setIsStatsOpen(true)}
          onSettingsClick={() => setIsSettingsOpen(true)}
          isStatsActive={isStatsOpen}
          isSettingsActive={isSettingsOpen}
        />
      </div>

      {isHomePage && (
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
      )}

      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <TodoPanel isOpen={isTodoPanelOpen} onToggle={() => setIsTodoPanelOpen(!isTodoPanelOpen)} />
    </>
  );
}
