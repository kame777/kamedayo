'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * タブセレクターのスライディングインジケーター用フック。
 * アクティブなボタンの位置をトラッキングして、背景をスムーズにスライドさせる。
 */
export function useTabIndicator<T>(activeKey: T) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<{ transform: string; width: string }>({
    transform: 'translateX(0)',
    width: '0',
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // activeKey に対応するボタンを検索（data-active="true" を使う）
    const activeBtn = container.querySelector('[data-active="true"]') as HTMLElement | null;
    if (!activeBtn) return;

    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();
    setStyle({
      transform: `translateX(${btnRect.left - containerRect.left}px)`,
      width: `${btnRect.width}px`,
    });
  }, [activeKey]);

  return { containerRef, indicatorStyle: style };
}
