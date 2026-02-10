'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * 数値が0からカウントアップするアニメーション用フック。
 * IntersectionObserver で要素が見えたときに開始する。
 */
export function useCountUp(
  end: number,
  duration: number = 1500,
  delay: number = 0,
) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timerId: ReturnType<typeof setTimeout>;
    let rafId: number;

    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !started.current) {
        started.current = true;

        timerId = setTimeout(() => {
          const startTime = performance.now();

          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * end));

            if (progress < 1) {
              rafId = requestAnimationFrame(animate);
            }
          };

          rafId = requestAnimationFrame(animate);
        }, delay);
      }
    }, { threshold: 0.3 });

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timerId);
      cancelAnimationFrame(rafId);
    };
    // end, duration, delay は定数なので再実行されない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, duration, delay]);

  return { count, ref };
}
