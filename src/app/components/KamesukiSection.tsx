'use client';

import Image from 'next/image';
import styles from './Kamesuki.module.css';
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
            <Image src="/misskey-icon.webp" alt="かめすきー" width={48} height={48} className={styles.icon} />
          </div>
          <h2 className={styles.title}>かめすきー</h2>
          <p className={styles.tagline}>Misskey インスタンス</p>

          <div className={styles.eosNotice}>
            <svg className={styles.eosIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <div className={styles.eosText}>
              <strong>サービス終了のお知らせ</strong>
              <p>かめすきーは 2026年3月31日 をもってサービスを終了致しました。長らくのご利用ありがとうございました。</p>
            </div>
          </div>

          <a
            href="https://kamedayo.com/contact"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.visitBtn}
            data-no-external="true"
          >
            お問い合わせ
            <span className={styles.visitArrow}>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
