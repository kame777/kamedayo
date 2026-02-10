import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className={styles.main}>
        {/* Background shapes */}
        <div className={styles.bgShapes} aria-hidden="true">
          <div className={`${styles.shape} ${styles.shape1}`} />
          <div className={`${styles.shape} ${styles.shape2}`} />
          <div className={`${styles.shape} ${styles.shape3}`} />
        </div>

        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1 className={styles.title}>ページが見つかりません</h1>
          <p className={styles.description}>
            お探しのページは存在しないか、移動した可能性があります。
          </p>

          <div className={styles.buttons}>
            <Link href="/" className={styles.primaryBtn}>
              ホームに戻る
            </Link>
            <Link href="/webtool" className={styles.secondaryBtn}>
              ツール一覧を見る
            </Link>
          </div>

          {/* Quick links */}
          <div className={styles.quickLinks}>
            <p className={styles.quickLinksTitle}>よく訪問されるページ</p>
            <div className={styles.linkGrid}>
              <Link href="/about" className={styles.linkCard}>
                <span className={styles.linkIcon}>👤</span>
                <span>私について</span>
              </Link>
              <Link href="/webtool/1" className={styles.linkCard}>
                <span className={styles.linkIcon}>📝</span>
                <span>文字数カウンター</span>
              </Link>
              <Link href="/webtool/2" className={styles.linkCard}>
                <span className={styles.linkIcon}>🔐</span>
                <span>パスワード生成</span>
              </Link>
              <Link href="/contact" className={styles.linkCard}>
                <span className={styles.linkIcon}>✉️</span>
                <span>お問い合わせ</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
  );
}
