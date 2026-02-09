'use client';

import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Services.module.css';
import { useEffect, useRef } from 'react';

const projects = [
  {
    id: 1,
    icon: '📝',
    title: '文字数カウンター',
    desc: '文字数・単語数・行数をリアルタイムでカウント。レポートやSNS投稿の文字数管理に。',
    category: '公開中',
    status: 'live',
    url: '/webtool/1/',
  },
  {
    id: 2,
    icon: '🔐',
    title: 'パスワードジェネレーター',
    desc: '大文字・小文字・数字・記号を組み合わせた安全なパスワードをワンクリック生成。',
    category: '公開中',
    status: 'live',
    url: '/webtool/2/',
  },
  {
    id: 3,
    icon: '🔍',
    title: '文章比較ツール',
    desc: '2つの文章を並べて差分をハイライト表示。コードレビューや原稿チェックに。',
    category: '開発中',
    status: 'soon',
    url: '/webtool/3/',
  },
];

export default function Page() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

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

    const cards = grid.querySelectorAll(`.${styles.card}`);
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />

      {/* Hero banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>🧰 Webツール</span>
          <h1 className={styles.heroTitle}>ツール一覧</h1>
          <p className={styles.heroSubtitle}>
            軽量・シンプル・実用的。すべて無料で使えます。
          </p>
        </div>
      </section>

      <main className={styles.container}>
        <div className={styles.grid} ref={gridRef}>
          {projects.map((p, index) => (
            <Link key={p.id} href={p.url} className={styles.linkReset}>
              <article
                className={styles.card}
                style={{ '--delay': `${index * 120}ms` } as React.CSSProperties}
              >
                <div className={styles.cardGlow} />

                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>{p.icon}</div>
                  <span className={`${styles.statusBadge} ${p.status === 'live' ? styles.statusLive : styles.statusSoon}`}>
                    <span className={styles.statusDot} />
                    {p.category}
                  </span>
                </div>

                <h3 className={styles.cardTitle}>{p.title}</h3>
                <p className={styles.cardDesc}>{p.desc}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.cardLink}>
                    {p.status === 'live' ? '使ってみる' : '詳細を見る'}
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

      <Footer />
    </>
  );
}
