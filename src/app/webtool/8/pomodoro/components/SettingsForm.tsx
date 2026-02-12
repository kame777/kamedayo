'use client';

import React, { useState, useEffect } from 'react';
import { UserSettings, DEFAULT_SETTINGS } from '../types';
import { useNotification } from '../hooks/useNotification';
import styles from './SettingsForm.module.css';

interface SettingsFormProps {
    settings: UserSettings;
    onUpdate: (partial: Partial<UserSettings>) => void;
    onTestSound?: () => void;
}

export default function SettingsForm({ settings, onUpdate, onTestSound }: SettingsFormProps) {
    const { requestPermission, isSupported } = useNotification();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleNumberChange = (
        key: keyof UserSettings,
        value: string,
        min: number,
        max: number
    ) => {
        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= min && num <= max) {
            onUpdate({ [key]: num });
        }
    };

    const handleBrowserNotificationToggle = async () => {
        if (!settings.browser_notification) {
            // Turning on: request permission first
            const granted = await requestPermission();
            if (granted) {
                onUpdate({ browser_notification: true });
            }
        } else {
            onUpdate({ browser_notification: false });
        }
    };

    return (
        <div className={styles.container}>
            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>⏱️ タイマー設定</h3>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="work-duration">
                        作業時間（分）
                    </label>
                    <input
                        id="work-duration"
                        type="number"
                        className={styles.numberInput}
                        value={settings.work_duration}
                        onChange={(e) =>
                            handleNumberChange('work_duration', e.target.value, 1, 60)
                        }
                        min={1}
                        max={60}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="short-break">
                        短い休憩（分）
                    </label>
                    <input
                        id="short-break"
                        type="number"
                        className={styles.numberInput}
                        value={settings.short_break_duration}
                        onChange={(e) =>
                            handleNumberChange('short_break_duration', e.target.value, 1, 30)
                        }
                        min={1}
                        max={30}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="long-break">
                        長い休憩（分）
                    </label>
                    <input
                        id="long-break"
                        type="number"
                        className={styles.numberInput}
                        value={settings.long_break_duration}
                        onChange={(e) =>
                            handleNumberChange('long_break_duration', e.target.value, 1, 60)
                        }
                        min={1}
                        max={60}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="long-break-interval">
                        長い休憩までの回数
                    </label>
                    <input
                        id="long-break-interval"
                        type="number"
                        className={styles.numberInput}
                        value={settings.long_break_interval}
                        onChange={(e) =>
                            handleNumberChange('long_break_interval', e.target.value, 1, 10)
                        }
                        min={1}
                        max={10}
                    />
                </div>
            </section>

            <section className={styles.section}>
                <h3 className={styles.sectionTitle}>🔔 通知設定</h3>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="auto-start">
                        自動開始
                    </label>
                    <button
                        id="auto-start"
                        className={`${styles.toggle} ${settings.auto_start ? styles.toggleOn : ''
                            }`}
                        onClick={() => onUpdate({ auto_start: !settings.auto_start })}
                        role="switch"
                        aria-checked={settings.auto_start}
                    >
                        <span className={styles.toggleThumb} />
                    </button>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="browser-notification">
                        ブラウザ通知
                        {mounted && !isSupported && (
                            <span className={styles.hint}>（非対応ブラウザ）</span>
                        )}
                    </label>
                    <button
                        id="browser-notification"
                        className={`${styles.toggle} ${settings.browser_notification ? styles.toggleOn : ''
                            }`}
                        onClick={handleBrowserNotificationToggle}
                        disabled={!isSupported}
                        role="switch"
                        aria-checked={settings.browser_notification}
                    >
                        <span className={styles.toggleThumb} />
                    </button>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="sound-notification">
                        サウンド通知
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {onTestSound && (
                            <button
                                className={styles.testButton}
                                onClick={onTestSound}
                                type="button"
                            >
                                🔊 テスト再生
                            </button>
                        )}
                        <button
                            id="sound-notification"
                            className={`${styles.toggle} ${settings.sound_notification ? styles.toggleOn : ''
                                }`}
                            onClick={() =>
                                onUpdate({ sound_notification: !settings.sound_notification })
                            }
                            role="switch"
                            aria-checked={settings.sound_notification}
                        >
                            <span className={styles.toggleThumb} />
                        </button>
                    </div>
                </div>
            </section>

            <button
                className={styles.resetSettingsButton}
                onClick={() => {
                    if (confirm('設定を初期状態に戻しますか？')) {
                        onUpdate(DEFAULT_SETTINGS);
                    }
                }}
                type="button"
            >
                🔄 設定をデフォルトに戻す
            </button>
        </div>
    );
}
