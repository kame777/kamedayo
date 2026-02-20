'use client';

import { useEffect, useCallback } from 'react';
import { useSettings } from '../hooks/useSettings';
import SettingsForm from './SettingsForm';
import styles from './SettingsModal.module.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();

  const testSound = useCallback(() => {
    if (!settings.sound_notification) return;
    try {
      const audio = new Audio('/sounds/complete.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => {
        console.warn('Audio play failed:', e);
      });
    } catch (e) {
      console.error('Audio initialization error:', e);
    }
  }, [settings.sound_notification]);

  const testNotification = useCallback(() => {
    if (!settings.browser_notification || typeof window === 'undefined' || !('Notification' in window)) return;

    if (Notification.permission === 'granted') {
      new Notification('テスト通知', {
        body: 'これは通知のテストです',
        icon: '/logo192.png',
        silent: false
      });
    }
  }, [settings.browser_notification]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>設定</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="閉じる">
            ×
          </button>
        </div>
        <div className={styles.content}>
          <SettingsForm
            settings={settings}
            onUpdate={updateSettings}
            onTestSound={testSound}
            onTestNotification={testNotification}
          />
        </div>
      </div>
    </>
  );
}
