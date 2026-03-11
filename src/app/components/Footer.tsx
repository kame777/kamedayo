import Link from 'next/link';
import styles from './Footer.module.css';
import Donate from './Donate';
import { ArrowUpRightIcon } from './Icons';

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
            <li><a data-no-external="true" href="/about#:~:text=%F0%9F%94%97-,%E5%90%84%E7%A8%AE%E3%83%AA%E3%83%B3%E3%82%AF%E9%A1%9E,-%E5%90%84%E7%A8%AE%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88" rel="noopener noreferrer">各種リンク類</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>サイト</h4>
          <ul>
            <li><Link href="/contact">お問い合わせ</Link></li>
            <li><a className={styles.extLink} href={`/external?url=${encodeURIComponent('https://status.kamedayo.com/')}`} target="_blank" rel="noopener noreferrer" data-no-external="true">サイトステータス<ArrowUpRightIcon size={12} /></a></li>
            <li><a className={styles.extLink} href={`/external?url=${encodeURIComponent('https://github.com/kame777/kamedayo/')}`} target="_blank" rel="noopener noreferrer" data-no-external="true">ソースコード<ArrowUpRightIcon size={12} /></a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>Webツール</h4>
          <ul>
            <li><Link href="/webtool">Webツール一覧</Link></li>
            <li><Link href="/webtool/1">文字数カウンター</Link></li>
            <li><Link href="/webtool/2">パスワード生成ツール</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2026 kame777. All rights reserved.</p>
      </div>
    </footer>
  );
}