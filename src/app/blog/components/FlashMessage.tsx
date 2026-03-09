'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import styles from './FlashMessage.module.css';

type FlashType = 'created' | 'updated' | 'deleted';

const FLASH_CONFIG: Record<FlashType, { message: string; colorClass: string }> = {
  created: { message: '記事を投稿しました', colorClass: 'toastGreen' },
  updated: { message: '記事を更新しました', colorClass: 'toastBlue' },
  deleted: { message: '記事を削除しました', colorClass: 'toastRed' },
};

export default function FlashMessage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [config, setConfig] = useState<{ message: string; colorClass: string } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const flash = searchParams.get('flash') as FlashType | null;
    if (!flash || !FLASH_CONFIG[flash]) return;

    setConfig(FLASH_CONFIG[flash]);
    setVisible(true);

    // URLからflashパラメータを除去
    const params = new URLSearchParams(searchParams.toString());
    params.delete('flash');
    const newUrl = params.size > 0 ? `${pathname}?${params}` : pathname;
    router.replace(newUrl, { scroll: false });

    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!config) return null;

  return (
    <div className={`${styles.toast} ${styles[config.colorClass]} ${visible ? styles.toastVisible : styles.toastHidden}`}>
      <span className={styles.checkIcon}>✓</span>
      {config.message}
    </div>
  );
}
