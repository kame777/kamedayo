import Link from 'next/link';
import styles from './Footer.module.css';
import Donate from './Donate';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Donate />
      <div className={styles.container}>
        <div className={styles.section}>
          <h4>SNS</h4>
          <ul>
            <li><a data-no-external="true" href="https://url.kamedayo.com/twitter" target='_blank' rel="noopener noreferrer">X(旧Twitter)</a></li>
            <li><a data-no-external="true" href="https://misskey.kamedayo.com/@kame777" target='_blank' rel="noopener noreferrer">かめすきー</a></li>
            <li><a data-no-external="true" href="https://url.kamedayo.com/profile" target='_blank' rel="noopener noreferrer">プロフィール・リンク集</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>サイト</h4>
          <ul>
            <li><Link href="/about">私について</Link></li>
            <li><Link href="/contact">お問い合わせ</Link></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>Webツール</h4>
          <ul>
            <li><Link href="/webtool">Webツール一覧</Link></li>
            <li><Link href="/webtool/1">文字数カウンター</Link></li>
            <li><Link href="/webtool/2">パスワードジェネレーター</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2025 kame777. All rights reserved.</p>
      </div>
    </footer>
  );
}