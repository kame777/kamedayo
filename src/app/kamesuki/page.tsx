import Link from 'next/link';
import styles from '../components/Hero.module.css';

export default function Kamesuki() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.content}>
          <div className={styles.headerRow}>
            <div className={styles.avatar}>k</div>
            <div className={styles.meta}>
              <p className={styles.byline}>kame</p>
            </div>
          </div>

          <h1 className={styles.title}>かめすきー紹介</h1>

          <p className={styles.subtitle}>
          Misskeyインスタンスは原則として一般開放しない方針です。参加を希望される方は、X(旧Twitter)またはMisskeyのDMでご連絡ください。
          <br />
          注意: データの保証はできません。インスタンス運営は個人管理のため、予期せぬ障害やデータ消失が発生する可能性があります。
          <br />
          インスタンスごと吹っ飛ばしたらごめんなさい！
          </p>
        </div>
      </section>
    </>
  );
}