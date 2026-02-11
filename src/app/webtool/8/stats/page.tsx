'use client';

import { useStats } from '@/app/webtool/8/pomodoro/hooks/useStats';
import { useSettings } from '@/app/webtool/8/pomodoro/hooks/useSettings';
import StatsView from '@/app/webtool/8/pomodoro/components/StatsView';
import Navigation from '@/app/webtool/8/pomodoro/components/Navigation';
import AuthButton from '@/app/webtool/8/pomodoro/components/AuthButton';

import HeroBanner from '@/app/components/HeroBanner';

export default function StatsPage() {
    // Initialize settings (needed for auth sync)
    useSettings();
    const { stats, isLoading } = useStats();

    return (
        <>
            <HeroBanner
                badge="📊 Statistics"
                title="統計"
                subtitle="最近の作業記録を確認"
            >
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <AuthButton />
                </div>
            </HeroBanner>

            <div className="appShell">
                <main className="pageContent">
                    <StatsView stats={stats} isLoading={isLoading} />
                </main>

                <Navigation />
            </div>
        </>
    );
}
