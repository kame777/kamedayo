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
                badge="⚙️ Settings"
                title="設定"
                subtitle="タイマーの動作を自分好みにカスタマイズ"
            >
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <AuthButton />
                </div>
            </HeroBanner>

            <div className="appShell">
                <main className="pageContent">
                    <SettingsForm settings={settings} onUpdate={updateSettings} onTestSound={testSound} onTestNotification={testNotification} />
                </main>

                <Navigation />
            </div>
        </>
    );
}
