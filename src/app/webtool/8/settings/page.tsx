'use client';

import { useSettings } from '@/app/webtool/8/pomodoro/hooks/useSettings';
import { useTimer } from '@/app/webtool/8/pomodoro/hooks/useTimer';
import SettingsForm from '@/app/webtool/8/pomodoro/components/SettingsForm';
import Navigation from '@/app/webtool/8/pomodoro/components/Navigation';
import AuthButton from '@/app/webtool/8/pomodoro/components/AuthButton';

import HeroBanner from '@/app/components/HeroBanner';

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const { testSound, testNotification } = useTimer();

    return (
        <>
            <HeroBanner
                badge={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                        Settings
                    </span>
                }
                title="設定"
                subtitle="タイマーの動作を自分好みにカスタマイズ"
            />

            <div className="appShell">
                <main className="pageContent">
                    <SettingsForm settings={settings} onUpdate={updateSettings} onTestSound={testSound} onTestNotification={testNotification} />
                </main>

                <Navigation />
            </div>
        </>
    );
}
