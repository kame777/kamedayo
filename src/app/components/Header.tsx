'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Header.module.css';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // ルート変更時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          kameテスト用サイト
        </Link>

        <nav id="primary-nav" className={`${styles.nav} ${menuOpen ? styles.navOpen : ''}`} aria-label="メインメニュー">
          <Link href="/" onClick={() => setMenuOpen(false)}>ホーム</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>私について</Link>
          <Link href="/webtool" onClick={() => setMenuOpen(false)}>Webツール</Link>
          <Link href="/contact" onClick={() => setMenuOpen(false)}>お問い合わせ</Link>
          <ThemeToggle />
        </nav>

        <button
          className={`${styles.menuToggle} ${menuOpen ? styles.menuToggleOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="メニュー"
          aria-expanded={menuOpen}
          aria-controls="primary-nav"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}