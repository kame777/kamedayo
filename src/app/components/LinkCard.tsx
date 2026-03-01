import Link from 'next/link';
import styles from './LinkCard.module.css';
import type { LinkItem } from '../data/about';

export default function LinkCard({ label, domain, href }: LinkItem) {
  const isExternal = href.startsWith('http');
  const iconSrc = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  return (
    <Link
      href={href}
      className={styles.linkCard}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-no-external="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={iconSrc} alt="" width={20} height={20} className={styles.icon} />
      <span className={styles.label}>{label}</span>
    </Link>
  );
}
