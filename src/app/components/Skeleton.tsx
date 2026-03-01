import styles from './Skeleton.module.css';

export function FeaturesSkeleton() {
  return (
    <div className={styles.featuresWrap}>
      <div className={styles.featuresHeader}>
        <div className={`${styles.skeleton} ${styles.featuresHeaderBadge}`} />
        <div className={`${styles.skeleton} ${styles.featuresHeaderTitle}`} />
        <div className={`${styles.skeleton} ${styles.featuresHeaderSub}`} />
      </div>
      <div className={styles.featuresGrid}>
        {[1, 2, 3].map((i) => (
          <div key={i} className={`${styles.skeleton} ${styles.featureCard}`} />
        ))}
      </div>
    </div>
  );
}

export function NewsSkeleton() {
  return (
    <div className={styles.newsWrap}>
      <div className={`${styles.skeleton} ${styles.newsCard}`} />
    </div>
  );
}

export function KamesukiSkeleton() {
  return (
    <div className={styles.kamesukiWrap}>
      <div className={`${styles.skeleton} ${styles.kamesukiCard}`} />
    </div>
  );
}

export function WebToolSkeleton() {
  return (
    <div className={styles.webToolWrap}>
      <div className={styles.webToolHero}>
        <div className={`${styles.skeleton} ${styles.webToolHeroBadge}`} />
        <div className={`${styles.skeleton} ${styles.webToolHeroTitle}`} />
        <div className={`${styles.skeleton} ${styles.webToolHeroSub}`} />
      </div>
      <div className={styles.webToolGrid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={styles.webToolCard}>
            <div className={styles.webToolCardHeader}>
              <div className={`${styles.skeleton} ${styles.webToolIcon}`} />
              <div className={`${styles.skeleton} ${styles.webToolBadge}`} />
            </div>
            <div className={styles.webToolCardBody}>
              <div className={`${styles.skeleton} ${styles.webToolTitle}`} />
              <div className={`${styles.skeleton} ${styles.webToolDesc1}`} />
              <div className={`${styles.skeleton} ${styles.webToolDesc2}`} />
              <div className={`${styles.skeleton} ${styles.webToolFooterLine}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
