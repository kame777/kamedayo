import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <>
      <Header />

      {/* Hero banner */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBg} aria-hidden="true" />
        <div className={styles.heroContent}>
          <span className={styles.heroBadge}>✉️ Contact</span>
          <h1 className={styles.heroTitle}>お問い合わせ</h1>
          <p className={styles.heroSubtitle}>
            ご質問・ツールのリクエスト・バグ報告など、お気軽にどうぞ。
          </p>
        </div>
      </section>

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

      <Footer />
    </>
  );
}
