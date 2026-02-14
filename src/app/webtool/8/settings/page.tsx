'use client';

import { useSettings } from '@/app/webtool/8/pomodoro/hooks/useSettings';
import { useTimer } from '@/app/webtool/8/pomodoro/hooks/useTimer';
import SettingsForm from '@/app/webtool/8/pomodoro/components/SettingsForm';

export default function SettingsPage() {
    const { settings, updateSettings } = useSettings();
    const { testSound, testNotification } = useTimer();

    return (
        <main className="pageContent">
             <SettingsForm settings={settings} onUpdate={updateSettings} onTestSound={testSound} onTestNotification={testNotification} />
        </main>
    );
}
