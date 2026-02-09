'use client';

import { useEffect, useRef } from 'react';

/**
 * IntersectionObserver を使ったスクロール表示アニメーション用カスタムフック。
 * 指定セレクタにマッチする子要素が viewport に入ると `visibleClass` を付与する。
 *
 * @param selector - 監視対象の CSS セレクタ（CSS Modules のクラス名を渡す）
 * @param visibleClass - viewport に入ったとき付与するクラス名
 * @param options - IntersectionObserver のオプション
 */
export function useScrollReveal<T extends HTMLElement = HTMLElement>(
  selector: string,
  visibleClass: string,
  options: IntersectionObserverInit = { threshold: 0.1 },
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(visibleClass);
          }
        });
      },
      options,
    );

    const targets = container.querySelectorAll(selector);
    targets.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [selector, visibleClass, options]);

  return ref;
}
