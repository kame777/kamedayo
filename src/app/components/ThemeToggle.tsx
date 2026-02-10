'use client';

import { useEffect, useState } from 'react';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 初回マウント時に localStorage またはシステム設定からテーマを取得
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) {
      setTheme(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggle = () => {
    // テーマ切替トランジションを有効化
    document.documentElement.setAttribute('data-theme-transition', '');
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    // トランジション完了後に属性を除去（パフォーマンス対策）
    setTimeout(() => {
      document.documentElement.removeAttribute('data-theme-transition');
    }, 500);
  };

  // SSR 中はレンダリングしない（FOUC 防止）
  if (!mounted) return null;

  return (
    <button
      className={styles.toggle}
      onClick={toggle}
      aria-label={theme === 'light' ? 'ダークモードに切替' : 'ライトモードに切替'}
      title={theme === 'light' ? 'ダークモードに切替' : 'ライトモードに切替'}
    >
      <span className={styles.icon} key={theme}>
        {theme === 'light' ? (
          /* 月アイコン */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          /* 太陽アイコン */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </span>
    </button>
  );
}
