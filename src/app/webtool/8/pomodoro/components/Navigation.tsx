'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './Navigation.module.css';

const NAV_ITEMS = [
    { href: '/webtool/8', label: 'タイマー', icon: '⏱️' },
    { href: '/webtool/8/stats', label: '統計', icon: '📊' },
    { href: '/webtool/8/settings', label: '設定', icon: '⚙️' },
];

import { useTabIndicator } from '@/app/hooks/useTabIndicator';

export default function Navigation() {
    const pathname = usePathname();
    const { containerRef, indicatorStyle } = useTabIndicator(pathname);

    return (
        <nav className={styles.nav} id="main-navigation" ref={containerRef}>
            <div className={styles.indicator} style={indicatorStyle} />
            {NAV_ITEMS.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    scroll={false}
                    className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''
                        }`}
                    data-active={pathname === item.href ? 'true' : undefined}
                >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                </Link>
            ))}
        </nav>
    );
}
