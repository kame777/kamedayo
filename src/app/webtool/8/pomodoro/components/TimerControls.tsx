'use client';

import { TimerStatus } from '../types';
import styles from './TimerControls.module.css';

interface TimerControlsProps {
    status: TimerStatus;
    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
    onSkip: () => void;
}

export default function TimerControls({
    status,
    onStart,
    onPause,
    onReset,
    onSkip,
}: TimerControlsProps) {
    return (
        <div className={styles.controls}>
            <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={onReset}
                id="timer-reset-btn"
                aria-label="リセット"
                title="リセット"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                </svg>
            </button>

            {status === 'running' ? (
                <button
                    className={`${styles.btn} ${styles.btnPause}`}
                    onClick={onPause}
                    id="timer-pause-btn"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                    一時停止
                </button>
            ) : (
                <button
                    className={`${styles.btn} ${styles.btnStart}`}
                    onClick={onStart}
                    id="timer-start-btn"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="6,4 20,12 6,20" />
                    </svg>
                    {status === 'paused' ? '再開' : '開始'}
                </button>
            )}

            <button
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={onSkip}
                id="timer-skip-btn"
                aria-label="スキップ"
                title="スキップ"
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,4 15,12 5,20" />
                    <rect x="17" y="4" width="2" height="16" />
                </svg>
            </button>
        </div>
    );
}
