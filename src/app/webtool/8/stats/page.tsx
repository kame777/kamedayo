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
                badge={
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        Statistics
                    </span>
                }
                title="統計"
                subtitle="最近の作業記録を確認"
            />

            <div className="appShell">
                <main className="pageContent">
                    <StatsView stats={stats} isLoading={isLoading} />
                </main>

                <Navigation />
            </div>
        </>
    );
}
