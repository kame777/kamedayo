'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './Post.module.css';

export default function DraftBanner() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const username = (session as { githubUsername?: string } | null)?.githubUsername;
  const isOwner = username === process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER;

  useEffect(() => {
    if (status === 'loading') return;
    if (!isOwner) router.replace('/blog');
  }, [status, isOwner, router]);

  if (status === 'loading' || !isOwner) return null;

  return (
    <div className={styles.draftBanner}>
      下書き — 公開されていません
    </div>
  );
}
