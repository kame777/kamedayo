import styles from '../components/Hero.module.css';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Hero() {
  return (
    <>
      <Header />
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
          こちらのページをご覧ください（面倒くさくなった）
        </p>

        <div className={styles.buttons}>
          <Link href="https://url.kamedayo.com/profile">
            <button className={styles.primaryBtn}>kame777リンク集</button>
          </Link>
        </div>

      </div>
      
      </section>
      <Footer />
    </>
  );
}