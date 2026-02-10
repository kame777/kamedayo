'use client';

import styles from '../kamesuki/Kamesuki.module.css';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function KamesukiSection() {
  const sectionRef = useScrollReveal<HTMLElement>(
    `.${styles.card}`,
    styles.visible,
    { threshold: 0.2 },
  );

  return (
    <section className={styles.kamesuki} ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.cardAccent} aria-hidden="true" />
          <div className={styles.iconWrap}>
            <span className={styles.icon}>🐢</span>
          </div>
          <h2 className={styles.title}>かめすきー</h2>
          <p className={styles.tagline}>Misskey インスタンス</p>

          <div className={styles.info}>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>🔒</span>
              <div>
                <strong>招待制</strong>
                <p>原則として一般開放していません。参加を希望される方はX(旧Twitter)またはMisskeyのDMでご連絡ください。</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoIcon}>⚠️</span>
              <div>
                <strong>注意事項</strong>
                <p>個人管理のため、予期せぬ障害やデータ消失が発生する可能性があります。データの保証はできません。</p>
              </div>
            </div>
          </div>

          <a
            href="https://misskey.kamedayo.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visitBtn}
            data-no-external="true"
          >
            かめすきーを見る
            <span className={styles.visitArrow}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
