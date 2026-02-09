'use client';

import Link from 'next/link';
import HeroBanner from '../components/HeroBanner';
import styles from './Services.module.css';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { tools } from '../data/tools';

export default function Page() {
  const gridRef = useScrollReveal<HTMLDivElement>(
    `.${styles.card}`,
    styles.visible,
    { threshold: 0.1 },
  );

  return (
    <>
      <HeroBanner
        badge="🧰 Webツール"
        title="ツール一覧"
        subtitle="軽量・シンプル・実用的。すべて無料で使えます。"
      />

      <main className={styles.container}>
        <div className={styles.grid} ref={gridRef}>
          {tools.map((t, index) => (
            <Link key={t.id} href={t.url} className={styles.linkReset}>
              <article
                className={styles.card}
                style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}
              >
                <div className={styles.cardGlow} />

                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>{t.icon}</div>
                  <span className={`${styles.statusBadge} ${t.status === 'live' ? styles.statusLive : styles.statusSoon}`}>
                    <span className={styles.statusDot} />
                    {t.category}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{t.title}</h3>
                <p className={styles.cardDesc}>{t.description}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.cardLink}>
                    {t.status === 'live' ? '使ってみる' : '詳細を見る'}
                    <span className={styles.cardArrow}>→</span>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* CTA section */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>欲しいツールがありますか？</h2>
          <p className={styles.ctaDesc}>リクエストやフィードバックをお待ちしています。</p>
          <Link href="/contact" className={styles.ctaBtn}>
            リクエストを送る
          </Link>
        </div>
      </main>
    </>
  );
}
