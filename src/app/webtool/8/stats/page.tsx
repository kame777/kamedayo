'use client';

import { useStats } from '@/app/webtool/8/pomodoro/hooks/useStats';
import { useSettings } from '@/app/webtool/8/pomodoro/hooks/useSettings';
import StatsView from '@/app/webtool/8/pomodoro/components/StatsView';

export default function StatsPage() {
    // Initialize settings (needed for auth sync)
    useSettings();
    const { stats, isLoading } = useStats();

    return (
        <main className="pageContent">
            <StatsView stats={stats} isLoading={isLoading} />
        </main>
    );
}
