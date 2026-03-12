'use client';

import Image from 'next/image';
import styles from './Kamesuki.module.css';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { AlertIcon, ArrowUpRightIcon } from './Icons';

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
            <span className={styles.eosIcon}><AlertIcon size={20} /></span>
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
            <span className={styles.visitArrow}><ArrowUpRightIcon size={14} /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
