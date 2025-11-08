"use client";

import { usePathname, useRouter } from 'next/navigation';
import React, { useMemo } from 'react';

export default function LocaleSwitcher() {
  const pathname = usePathname() || '/ja';
  const router = useRouter();

  const current = useMemo(() => {
    const seg = pathname.split('/')[1];
    return seg === 'en' ? 'en' : 'ja';
  }, [pathname]);

  const nextLocale = current === 'ja' ? 'en' : 'ja';

  const switchLocale = () => {
    const parts = pathname.split('/');
    if (parts[1] === 'ja' || parts[1] === 'en') {
      parts[1] = nextLocale;
    } else {
      parts.splice(1, 0, nextLocale);
    }
    const nextPath = parts.join('/') || `/${nextLocale}`;
    router.push(nextPath);
  };

  return (
    <button
      onClick={switchLocale}
      aria-label="言語切替"
      title={current === 'ja' ? 'Switch to English' : '日本語に切替'}
      style={{
        padding: '0.4rem 0.7rem',
        borderRadius: 8,
        border: '1px solid rgba(0,0,0,0.1)',
        background: 'white',
        color: '#333'
      }}
    >
      {current.toUpperCase()}
    </button>
  );
}



