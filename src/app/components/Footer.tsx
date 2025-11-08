"use client";

import Link from 'next/link';
import { useLocale } from './useLocale';
import { useDictionary } from './useDictionary';
import styles from './Footer.module.css';

export default function Footer() {
  const locale = useLocale();
  const dict = useDictionary();
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.section}>
          <h4>SNS</h4>
          <ul>
            <li><a href="https://url.kamedayo.com/twitter" target='_blank' rel="noopener noreferrer">X(旧Twitter)</a></li>
            <li><a href="https://misskey.kamedayo.com/@kame777" target='_blank' rel="noopener noreferrer">かめすきー</a></li>
            <li><a href="https://url.kamedayo.com/profile" target='_blank' rel="noopener noreferrer">プロフィール・リンク集</a></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>{dict.footer.site}</h4>
          <ul>
            <li><Link href={`/${locale}/about`}>{dict.footer.about}</Link></li>
            <li><Link href={`/${locale}/contact`}>{dict.footer.contact}</Link></li>
          </ul>
        </div>
        <div className={styles.section}>
          <h4>{dict.footer.tools}</h4>
          <ul>
            <li><Link href={`/${locale}/services`}>{dict.footer.list}</Link></li>
            <li><Link href={`/${locale}/webtool/1`}>{dict.footer.textCounter}</Link></li>
            <li><Link href={`/${locale}/webtool/2`}>{dict.footer.passwordGen}</Link></li>
          </ul>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>&copy; 2025 kame777. All rights reserved.</p>
      </div>
    </footer>
  );
}