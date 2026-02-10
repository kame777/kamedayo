'use client';

import styles from './Hero.module.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { tools } from '../data/tools';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let rafId = 0;

    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        hero.style.setProperty('--mouse-x', `${x}%`);
        hero.style.setProperty('--mouse-y', `${y}%`);
      });
    };

    hero.addEventListener('mousemove', handleMouseMove);
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section className={styles.hero} ref={heroRef}>
      {/* Animated background shapes */}
      <div className={styles.bgShapes} aria-hidden="true">
        <div className={`${styles.shape} ${styles.shape1}`} />
        <div className={`${styles.shape} ${styles.shape2}`} />
        <div className={`${styles.shape} ${styles.shape3}`} />
        <div className={`${styles.shape} ${styles.shape4}`} />
        <div className={`${styles.shape} ${styles.shape5}`} />
      </div>

      {/* Glow that follows mouse */}
      <div className={styles.mouseGlow} />

      <div className={styles.content}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          個人開発プロジェクト
        </div>

        <h1 className={styles.title}>
          <span className={styles.titleLine}>kameの</span>
          <span className={styles.titleGradient}>ツール箱</span>
          <span className={styles.titleLine}>へようこそ</span>
        </h1>

        <p className={styles.subtitle}>
          日常のちょっとした作業を楽にする、自作Webツールを公開中。
          <br />
          他に欲しいツールがあればお気軽にDMください！
        </p>

        <div className={styles.buttons}>
          <Link href="/webtool" className={styles.primaryBtn}>
            <span className={styles.btnIcon}>⚡</span>
            ツール一覧を見る
            <span className={styles.btnArrow}>→</span>
          </Link>
          <Link href="/about" className={styles.secondaryBtn}>
            kameについて
          </Link>
        </div>

        {/* Stats row */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{tools.length}+</span>
            <span className={styles.statLabel}>公開ツール</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>Next.js</span>
            <span className={styles.statLabel}>フレームワーク</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>無料</span>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator}>
        <div className={styles.scrollMouse}>
          <div className={styles.scrollDot} />
        </div>
        <span>Scroll</span>
      </div>
    </section>
  );
}