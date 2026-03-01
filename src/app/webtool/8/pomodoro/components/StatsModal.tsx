'use client';

import { useEffect } from 'react';
import { useStats } from '../hooks/useStats';
import StatsView from './StatsView';
import styles from './SettingsModal.module.css';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const { stats, isLoading } = useStats();

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
          <h2 className={styles.title}>統計</h2>
          <button onClick={onClose} className={styles.closeBtn} aria-label="閉じる">
            ×
          </button>
        </div>
        <div className={styles.content}>
          <StatsView stats={stats} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
