'use client';

import Link from 'next/link';
import styles from './Features.module.css';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { tools } from '../data/tools';

export default function Features() {
  const sectionRef = useScrollReveal<HTMLElement>(
    `.${styles.card}`,
    styles.visible,
    { threshold: 0.1 },
  );

  const liveTools = tools.filter((t) => t.status === 'live');

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
          {liveTools.map((tool) => (
            <Link href={tool.url} key={tool.id} className={styles.card}>
              <div className={styles.cardIcon}>{tool.icon}</div>
              <h3 className={styles.cardTitle}>{tool.title}</h3>
              <p className={styles.cardDesc}>{tool.description}</p>
              <span className={styles.cardLink}>
                使ってみる <span className={styles.cardArrow}>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
