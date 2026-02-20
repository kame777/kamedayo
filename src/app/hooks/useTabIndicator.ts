'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * タブセレクターのスライディングインジケーター用フック。
 * アクティブなボタンの位置をトラッキングして、背景をスムーズにスライドさせる。
 */
export function useTabIndicator<T>(activeKey: T, persistenceKey?: string) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ transform: string; width: string }>(() => {
    if (typeof window !== 'undefined' && persistenceKey) {
      try {
        const saved = sessionStorage.getItem(`tab-indicator-${persistenceKey}`);
        if (saved) return JSON.parse(saved);
      } catch (e) {
        // ignore error
      }
    }
    return {
      transform: 'translateX(0)',
      width: '0',
    };
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // activeKey に対応するボタンを検索（data-active="true" を使う）
    const activeBtn = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (!activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const newStyle = {
      transform: `translateX(${btnRect.left - containerRect.left}px)`,
      width: `${btnRect.width}px`,
    };

    setStyle(newStyle);

    if (persistenceKey) {
      sessionStorage.setItem(`tab-indicator-${persistenceKey}`, JSON.stringify(newStyle));
    }
  }, [activeKey, persistenceKey]);

  return { containerRef, indicatorStyle: style };
}
