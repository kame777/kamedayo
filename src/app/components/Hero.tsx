import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.headerRow}>
          <div className={styles.avatar}>ka</div>
          <div className={styles.meta}>
            <p className={styles.byline}>運営: kame</p>
          </div>
        </div>

        <h1 className={styles.title}>kameのツール箱へようこそ</h1>

        <p className={styles.subtitle}>
          日常のちょっとした作業を楽にする、自作Webツールをまとめています。困ったらツール一覧をどうぞ。
        </p>

        <div className={styles.buttons}>
          <Link href="/services">
            <button className={styles.primaryBtn}>ツール一覧を見る</button>
          </Link>
          <Link href="/about">
            <button className={styles.secondaryBtn}>kameについて</button>
          </Link>
        </div>

        <h2>近況報告</h2>

        <p>11/15:メインページリニューアルしました！</p>
        
      </div>
      
    </section>
  );
}