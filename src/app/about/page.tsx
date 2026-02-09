import styles from './About.module.css';
import Link from 'next/link';

export default function About() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.avatar}>k</div>
          <div className={styles.meta}>
            <p className={styles.byline}>kame</p>
          </div>
        </div>

        <h1 className={styles.title}>私について</h1>

        <p className={styles.subtitle}>
          こちらのページをご覧ください（そのうちこのページに移植します！）
        </p>

        <div className={styles.buttons}>
          <Link href="https://url.kamedayo.com/profile" className={styles.primaryBtn}>
            kame777リンク集
          </Link>
        </div>
      </div>
    </section>
  );
}