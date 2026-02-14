import HeroBanner from '../components/HeroBanner';
import styles from './Contact.module.css';
export const metadata = {
  title: 'お問い合わせ',
};

export default function Contact() {
  return (
    <>
      <HeroBanner
        badge="✉️ Contact"
        title="お問い合わせ"
        subtitle="ご質問・ツールのリクエスト・バグ報告など、お気軽にどうぞ。"
      />

      <main className={styles.container}>
        <div className={styles.grid}>
          {/* DM card */}
          <div className={styles.card}>
            <div className={styles.cardIcon}>💬</div>
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
              <span className={styles.cardArrow}>↗</span>
            </a>
            <p className={styles.cardNote}>※ 返信にお時間をいただく場合があります</p>
          </div>

        </div>

        {/* FAQ section */}
        <div className={styles.faq}>
          <h2 className={styles.faqTitle}>よくある質問</h2>
          <div className={styles.faqList}>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>ツールのリクエストはできますか？</summary>
              <p className={styles.faqAnswer}>はい！XのDMでお気軽にリクエストしてください。技術的に可能な範囲で対応します。</p>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>バグを見つけた場合はどうすればいいですか？</summary>
              <p className={styles.faqAnswer}>XのDMまたはGitHub Issuesで報告していただけると助かります。可能であればスクリーンショットもお願いします。</p>
            </details>
            <details className={styles.faqItem}>
              <summary className={styles.faqQuestion}>返信までどのくらいかかりますか？</summary>
              <p className={styles.faqAnswer}>通常1〜3日以内に返信します。お急ぎの場合はその旨をお伝えください。</p>
            </details>
          </div>
        </div>
      </main>
    </>
  );
}
