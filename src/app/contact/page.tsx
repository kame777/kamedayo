import HeroBanner from '../components/HeroBanner';
import FaqList from './FaqList';
import { MailIcon, XIcon, ArrowUpRightIcon } from '../components/Icons';
import styles from './Contact.module.css';
export const metadata = {
  title: 'お問い合わせ',
};

export default function Contact() {
  return (
    <>
      <HeroBanner
        badge={<><MailIcon size={15} /> Contact</>}
        title="お問い合わせ"
        subtitle="ご質問・ツールのリクエスト・バグ報告など、お気軽にどうぞ。"
      />

      <main className={styles.container}>
        <div className={styles.grid}>
          {/* DM card */}
          <div className={styles.card}>
            <div className={styles.cardIcon}><XIcon size={32} /></div>
            <h2 className={styles.cardTitle}>X (旧Twitter) DM</h2>
            <p className={styles.cardDesc}>
              一番早く返信できます。お気軽にDMをお送りください。
            </p>
            <a
              href="https://url.kamedayo.com/twitter"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardBtn}
              data-no-external="true"
            >
              Xでメッセージを送る
              <span className={styles.cardArrow}><ArrowUpRightIcon size={14} /></span>
            </a>
            <p className={styles.cardNote}>※ 返信にお時間をいただく場合があります</p>
          </div>

        </div>

        {/* FAQ section */}
        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>よくある質問</h2>
          <FaqList />
        </div>
      </main>
    </>
  );
}