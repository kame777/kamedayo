'use client';

import { formatTime } from '../utils/formatTime';
import { TimerPhase } from '../types';
import { PHASE_LABELS, PHASE_COLORS } from '../utils/constants';
import styles from './TimerDisplay.module.css';

interface TimerDisplayProps {
    phase: TimerPhase;
    remainingSeconds: number;
    totalSeconds: number;
    currentSession: number;
    totalSessions: number;
}

export default function TimerDisplay({
    phase,
    remainingSeconds,
    totalSeconds,
    currentSession,
    totalSessions,
}: TimerDisplayProps) {
    const progress = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
    const circumference = 2 * Math.PI * 140;
    const dashOffset = circumference * (1 - progress);
    const phaseColor = PHASE_COLORS[phase];

    return (
        <div className={styles.container}>
            <div className={styles.phaseLabel} style={{ color: phaseColor }}>
                {PHASE_LABELS[phase]}
            </div>

            <div className={styles.timerRing}>
                <svg viewBox="0 0 300 300" className={styles.svg}>
                    {/* Background ring */}
                    <circle
                        cx="150"
                        cy="150"
                        r="140"
                        fill="none"
                        stroke="var(--ring-bg)"
                        strokeWidth="6"
                    />
                    {/* Progress ring */}
                    <circle
                        cx="150"
                        cy="150"
                        r="140"
                        fill="none"
                        stroke={phaseColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        className={styles.progressRing}
                        transform="rotate(-90 150 150)"
                    />
                </svg>
                <div className={styles.timeDisplay}>
                    {formatTime(remainingSeconds)}
                </div>
            </div>

            <div className={styles.sessionIndicator}>
                {Array.from({ length: totalSessions }, (_, i) => (
                    <span
                        key={i}
                        className={`${styles.dot} ${i < currentSession ? styles.dotActive : ''}`}
                        style={{
                            backgroundColor: i < currentSession ? phaseColor : undefined,
                        }}
                    />
                ))}
                <span className={styles.sessionText}>
                    {currentSession} / {totalSessions}
                </span>
            </div>
        </div>
    );
}
