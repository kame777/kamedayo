import type { ReactNode } from 'react';
import styles from './HeroBanner.module.css';

type HeroBannerProps = {
  badge: ReactNode;
  title: string;
  subtitle: string;
};

export default function HeroBanner({ badge, title, subtitle }: HeroBannerProps) {
  return (
    <section className={styles.heroBanner}>
      <div className={styles.heroBg} aria-hidden="true" />
      <div className={styles.heroContent}>
        <span className={styles.heroBadge}>{badge}</span>
        <h1 className={styles.heroTitle}>{title}</h1>
        <p className={styles.heroSubtitle}>{subtitle}</p>
      </div>
    </section>
  );
}
