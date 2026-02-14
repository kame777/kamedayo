'use client';

import { useStats } from '../hooks/useStats';
import styles from './SessionStatus.module.css';

export default function SessionStatus() {
    const { stats, isLoading } = useStats();

    if (isLoading) {
        return <div className={styles.container} style={{ opacity: 0.5 }}>...</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.item}>
                <span className={styles.value}>{stats.total_count}</span>
                <span className={styles.label}>累計</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.item}>
                <span className={styles.value}>{stats.today_count}</span>
                <span className={styles.label}>今日</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.item}>
                <span className={styles.value}>{stats.streak_days}日</span>
                <span className={styles.label}>連続</span>
            </div>
        </div>
    );
}
