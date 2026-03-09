'use client';

import type { ReactNode } from 'react';
import { useTabIndicator } from '../../hooks/useTabIndicator';
import styles from './TabSelector.module.css';

type Props = {
  activeKey: string;
  children: ReactNode;
  className?: string;
};

export default function TabSelector({ activeKey, children, className = '' }: Props) {
  const { containerRef, indicatorStyle } = useTabIndicator(activeKey);
  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      <div className={styles.indicator} style={indicatorStyle} />
      {children}
    </div>
  );
}
