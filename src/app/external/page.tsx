'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import styles from './page.module.css';
import { ArrowUpRightIcon } from '../components/Icons';

function ExternalContent() {
  const params = useSearchParams();
  const router = useRouter();
  const raw = params.get('url') ?? '';

  // http / https のみ許可
  let destination = '';
  try {
    const parsed = new URL(raw);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      destination = parsed.href;
    }
  } catch {
    // 不正なURLは空のまま
  }

  const displayHost = destination
    ? new URL(destination).hostname
    : '';

  return (
    <main className={styles.main}>
      <div className={styles.bgShapes} aria-hidden="true">
        <div className={`${styles.shape} ${styles.shape1}`} />
        <div className={`${styles.shape} ${styles.shape2}`} />
        <div className={`${styles.shape} ${styles.shape3}`} />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>外部サイトへ移動します</h1>

        {destination ? (
          <>
            <p className={styles.description}>
              以下の外部サイトへ移動しようとしています。<br />
              信頼できるサイトであることを確認してから続行してください。
            </p>

            <div className={styles.urlBox}>
              <span className={styles.urlHost}>{displayHost}</span>
              <span className={styles.urlFull}>{destination}</span>
            </div>

            <div className={styles.buttons}>
              <a
                href={destination}
                data-no-external="true"
                className={styles.primaryBtn}
              >
                このまま続ける
                <ArrowUpRightIcon size={14} />
              </a>
              <button
                onClick={() => window.close()}
                className={styles.secondaryBtn}
              >
                タブを閉じる
              </button>
            </div>
          </>
        ) : (
          <>
            <p className={styles.description}>
              移動先のURLが無効です。
            </p>
            <div className={styles.buttons}>
              <button
                onClick={() => router.back()}
                className={styles.primaryBtn}
              >
                戻る
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default function ExternalPage() {
  return (
    <Suspense>
      <ExternalContent />
    </Suspense>
  );
}
