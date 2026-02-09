'use client';

import Link from 'next/link';
import styles from './Features.module.css';
import { useEffect, useRef } from 'react';

const features = [
  {
    icon: '📝',
    title: '文字数カウンター',
    description: 'テキストの文字数・単語数・行数をリアルタイムでカウント。',
    href: '/webtool/1',
    color: '#059669',
  },
  {
    icon: '🔐',
    title: 'パスワードジェネレーター',
    description: '安全なランダムパスワードをワンクリックで生成。',
    href: '/webtool/2',
    color: '#10b981',
  },
  {
    icon: '🚀',
    title: 'さらに追加予定',
    description: '新しいツールを開発中。リクエストも受付中です！',
    href: '/contact',
    color: '#34d399',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = section.querySelectorAll(`.${styles.card}`);
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.features} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionBadge}>Webツール</span>
          <h2 className={styles.sectionTitle}>公開中のツール</h2>
          <p className={styles.sectionSubtitle}>
            すべて無料・登録不要で使えます
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, i) => (
            <Link href={feature.href} key={i} className={styles.card} style={{ '--card-color': feature.color } as React.CSSProperties}>
              <div className={styles.cardGlow} />
              <div className={styles.cardIcon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDesc}>{feature.description}</p>
              <span className={styles.cardLink}>
                詳しく見る <span className={styles.cardArrow}>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
