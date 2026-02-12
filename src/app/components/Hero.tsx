'use client';

import styles from './Hero.module.css';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { tools } from '../data/tools';
import { useCountUp } from '../hooks/useCountUp';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const liveTools = tools.filter((t) => t.status === 'live');
  const { count: toolCount, ref: toolCountRef } = useCountUp(liveTools.length, 1200, 400);
  const { count: freeCount, ref: freeCountRef } = useCountUp(100, 1500, 600);

  // パララックス効果
  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (bgRef.current) {
          const scrollY = window.scrollY;
          bgRef.current.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // タッチデバイス（モバイル・タブレット）または画面幅が 1024px 未満の場合は
    // パフォーマンスとユーザー体験向上のためポインター追従を無効化
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    const isSmallScreen = window.innerWidth < 1024;
    
    if (isTouchDevice || isSmallScreen) return;

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
      <div className={styles.bgShapes} aria-hidden="true" ref={bgRef}>
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
            <span className={styles.statNumber} ref={toolCountRef}>{toolCount}+</span>
            <span className={styles.statLabel}>公開ツール</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>Next.js</span>
            <span className={styles.statLabel}>フレームワーク</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber} ref={freeCountRef}>{freeCount}%</span>
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