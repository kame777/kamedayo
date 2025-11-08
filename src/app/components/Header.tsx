'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Header.module.css';
import { useLocale } from './useLocale';
import LocaleSwitcher from './LocaleSwitcher';
import { useDictionary } from './useDictionary';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const locale = useLocale();
  const dict = useDictionary();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={`/${locale}`} className={styles.logo}>
          kameテスト用サイト
        </Link>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav id="primary-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="メインメニュー">
          <Link href={`/${locale}`}>{dict.nav.home}</Link>
          <Link href={`/${locale}/about`}>{dict.nav.about}</Link>
          <Link href={`/${locale}/services`}>{dict.nav.services}</Link>
          <Link href={`/${locale}/contact`}>{dict.nav.contact}</Link>
        </nav>

        <div className={styles.rightControls}>
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}