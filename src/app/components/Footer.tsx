import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h4>SNS</h4>
          <ul>
            <li><a href="https://url.kamedayo.com/twitter" target='_blank'>X(旧Twitter)</a></li>
            <li><a href="https://misskey.kamedayo.com/@kame777" target='_blank'>かめすきー</a></li>
            <li><a href="https://url.kamedayo.com/profile" target='_blank'>プロフィール・リンク集</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>サイト</h4>
          <ul>
            <li><a href="./about">私について</a></li>
            <li><a href="./contact">お問い合わせ</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>Webツール</h4>
          <ul>
            <li><a href="../services">Webツール一覧</a></li>
            <li><a href="../webtool/1">文字数カウンター</a></li>
            <li><a href="../webtool/2">パスワードジェネレーター</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2025 kame777. All rights reserved.</p>
      </div>
    </footer>
  );
}