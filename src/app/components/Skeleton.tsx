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
