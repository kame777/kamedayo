'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import PostCard from './PostCard';
import { PlusIcon } from './BlogIcons';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import type { PostMeta } from '../lib/types';
import styles from '../Blog.module.css';
import cardStyles from './PostCard.module.css';

type Props = { posts: PostMeta[] };

export default function BlogClient({ posts }: Props) {
  const { data: session } = useSession();
  const username = (session as { githubUsername?: string } | null)?.githubUsername;
  const isOwner = username === process.env.NEXT_PUBLIC_GITHUB_REPO_OWNER;

  const gridRef = useScrollReveal<HTMLDivElement>(
    `.${cardStyles.card}`,
    cardStyles.visible,
    { threshold: 0.08 },
  );

  return (
    <main className={styles.container}>
      {isOwner && (
        <div className={styles.ownerBar}>
          <Link href="/blog/new" className={styles.newPostBtn}>
            <PlusIcon size={15} />
            新規作成
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <p className={styles.empty}>記事はまだありません。</p>
      ) : (
        <div className={styles.grid} ref={gridRef}>
          {posts.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              delay={index * 100}
            />
          ))}
        </div>
      )}
    </main>
  );
}
