'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from '../new/NewPost.module.css';

export default function BlogLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace('/blog');
    }
  }, [session, router]);

  if (status === 'loading') {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (session) {
    return <div className={styles.loading}>リダイレクト中...</div>;
  }

  return (
    <div className={styles.loginPrompt}>
      <p>この機能はオーナーのみ利用できます。</p>
      <button
        className={styles.loginBtn}
        onClick={() => signIn('github', { callbackUrl: '/blog' })}
      >
        GitHubでログイン
      </button>
    </div>
  );
}
