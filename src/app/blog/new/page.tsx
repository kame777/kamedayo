'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '../components/MarkdownEditor';
import styles from './NewPost.module.css';

export default function NewPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className={styles.loginPrompt}>
        <p>この機能はオーナーのみ利用できます。</p>
        <button className={styles.loginBtn} onClick={() => signIn('github', { callbackUrl: '/blog/new' })}>
          GitHubでログイン
        </button>
      </div>
    );
  }

  const handleSave = async (slug: string, markdown: string) => {
    const res = await fetch('/api/blog/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, markdown }),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      throw new Error(data.error ?? 'Save failed');
    }
    router.push('/blog');
  };

  return <MarkdownEditor onSave={handleSave} />;
}
