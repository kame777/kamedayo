'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MarkdownEditor from '../../components/MarkdownEditor';
import styles from '../../../blog/new/NewPost.module.css';

export default function EditPostClient({ params }: { params: { slug: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [initialMarkdown, setInitialMarkdown] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!session) return;
    const owner = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER ?? '';
    const repo = process.env.NEXT_PUBLIC_GITHUB_REPO_NAME ?? '';
    fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/content/blog/${params.slug}.md`,
      { cache: 'no-store' }
    )
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.text();
      })
      .then(setInitialMarkdown)
      .catch(() => {
        setLoadError(true);
        setInitialMarkdown('');
      });
  }, [session, params.slug]);

  if (status === 'loading') {
    return <div className={styles.loading}>読み込み中...</div>;
  }

  if (!session) {
    return (
      <div className={styles.loginPrompt}>
        <p>この機能はオーナーのみ利用できます。</p>
        <button className={styles.loginBtn} onClick={() => signIn('github', { callbackUrl: `/blog/edit/${params.slug}` })}>
          GitHubでログイン
        </button>
      </div>
    );
  }

  if (initialMarkdown === null) {
    return <div className={styles.loading}>記事を読み込み中...</div>;
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
    router.push(`/blog/${slug}`);
  };

  const handleDelete = async () => {
    const res = await fetch('/api/blog/delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: params.slug }),
    });
    if (!res.ok) {
      const data = await res.json() as { error?: string };
      throw new Error(data.error ?? 'Delete failed');
    }
    router.push('/blog');
  };

  return (
    <>
      {loadError && (
        <p style={{ padding: '0.5rem 1rem', color: 'var(--error)', fontSize: '0.85rem', background: 'rgba(220,38,38,0.08)' }}>
          GitHubから記事を読み込めませんでした。内容は空になっています。
        </p>
      )}
      <MarkdownEditor
        initialSlug={params.slug}
        initialMarkdown={initialMarkdown}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </>
  );
}
