'use client';

import { Stats } from '../types';
import { formatDate, formatMinutes } from '../utils/formatTime';
import { PHASE_LABELS } from '../utils/constants';
import styles from './StatsView.module.css';

interface StatsViewProps {
    stats: Stats;
    isLoading: boolean;
}

export default function StatsView({ stats, isLoading }: StatsViewProps) {
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loading}>読み込み中...</div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.grid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.today_count}</div>
                    <div className={styles.statLabel}>今日のポモドーロ</div>
                    <div className={styles.statSub}>{formatMinutes(stats.today_minutes)}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.week_count}</div>
                    <div className={styles.statLabel}>今週</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.month_count}</div>
                    <div className={styles.statLabel}>今月</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.total_count}</div>
                    <div className={styles.statLabel}>累計</div>
                    <div className={styles.statSub}>{formatMinutes(stats.total_minutes)}</div>
                </div>

                <div className={`${styles.statCard} ${stats.streak_days > 0 ? styles.streakCard : ''}`}>
                    <div className={styles.statValue}>{stats.streak_days}</div>
                    <div className={styles.statLabel}>
                        {stats.streak_days > 0 && <span className={styles.streakIcon}>🔥</span>} 連続日数
                    </div>
                </div>
            </div>

            <div className={styles.recentSection}>
                <h3 className={styles.recentTitle}>最近のセッション</h3>
                {stats.recent_sessions.length === 0 ? (
                    <p className={styles.emptyMessage}>まだセッションがありません</p>
                ) : (
                    <ul className={styles.sessionList}>
                        {stats.recent_sessions.map((session) => (
                            <li key={session.id} className={styles.sessionItem}>
                                <span className={styles.sessionDate}>
                                    {formatDate(session.completed_at)}
                                </span>
                                <span className={styles.sessionType}>
                                    {PHASE_LABELS[session.session_type]}
                                </span>
                                <span className={styles.sessionDuration}>
                                    {Math.round(session.duration / 60)}分
                                </span>
                                <span className={styles.sessionCheck}>✅</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
