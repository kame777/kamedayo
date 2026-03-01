'use client';

import styles from './Navigation.module.css';
import { useTodoStore } from '../stores/todoStore';

interface NavigationProps {
    onTasksClick?: () => void;
    onStatsClick?: () => void;
    onSettingsClick?: () => void;
    isStatsActive?: boolean;
    isSettingsActive?: boolean;
}

export default function Navigation({
    onTasksClick,
    onStatsClick,
    onSettingsClick,
    isStatsActive = false,
    isSettingsActive = false
}: NavigationProps) {
    const { todos } = useTodoStore();
    const activeTodoCount = todos.filter(t => !t.completed).length;

    return (
        <nav className={styles.nav} id="main-navigation">
            {/* Stats */}
            {onStatsClick && (
                <button
                    className={`${styles.navItem} ${isStatsActive ? styles.navItemActive : ''}`}
                    onClick={onStatsClick}
                    aria-label="統計"
                >
                    <span className={styles.navIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                    </span>
                    <span className={styles.tooltip}>統計</span>
                </button>
            )}

            {/* Settings */}
            {onSettingsClick && (
                <button
                    className={`${styles.navItem} ${isSettingsActive ? styles.navItemActive : ''}`}
                    onClick={onSettingsClick}
                    aria-label="設定"
                >
                    <span className={styles.navIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                        </svg>
                    </span>
                    <span className={styles.tooltip}>設定</span>
                </button>
            )}

            {/* Tasks */}
            {onTasksClick && (
                <button
                    className={styles.navItem}
                    onClick={onTasksClick}
                    aria-label="タスク"
                >
                    <span className={styles.navIcon}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="8" y1="6" x2="21" y2="6" />
                            <line x1="8" y1="12" x2="21" y2="12" />
                            <line x1="8" y1="18" x2="21" y2="18" />
                            <line x1="3" y1="6" x2="3.01" y2="6" />
                            <line x1="3" y1="12" x2="3.01" y2="12" />
                            <line x1="3" y1="18" x2="3.01" y2="18" />
                        </svg>
                        {activeTodoCount > 0 && (
                            <span className={styles.badge}>{activeTodoCount}</span>
                        )}
                    </span>
                    <span className={styles.tooltip}>タスク</span>
                </button>
            )}
        </nav>
    );
}
