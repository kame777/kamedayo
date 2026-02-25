'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './EditButton.module.css';

export default function EditButton({ slug }: { slug: string }) {
  const { data: session } = useSession();
  const username = (session as { githubUsername?: string } | null)?.githubUsername;
  const owner = process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER;

  if (!username || username !== owner) return null;

  return (
    <Link href={`/blog/edit/${slug}`} className={styles.editBtn}>
      ✏️ 編集
    </Link>
  );
}
