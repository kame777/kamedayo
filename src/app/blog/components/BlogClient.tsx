'use client';

import { useState, useMemo } from 'react';
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

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const visiblePosts = isOwner ? posts : posts.filter((p) => !p.draft);

  const availableYears = useMemo(() => {
    const years = [...new Set(visiblePosts.map((p) => p.date.slice(0, 4)))];
    return years.sort((a, b) => b.localeCompare(a));
  }, [visiblePosts]);

  const availableTags = useMemo(() => {
    const tags = [...new Set(visiblePosts.flatMap((p) => p.tags))];
    return tags.sort();
  }, [visiblePosts]);

  const filteredPosts = useMemo(() => {
    return visiblePosts.filter((p) => {
      const yearMatch = !selectedYear || p.date.startsWith(selectedYear);
      const tagMatch = selectedTags.length === 0 || selectedTags.every((t) => p.tags.includes(t));
      return yearMatch && tagMatch;
    });
  }, [visiblePosts, selectedYear, selectedTags]);

  const filterKey = `${String(isOwner)}-${selectedYear ?? ''}-${selectedTags.join(',')}`;

  const gridRef = useScrollReveal<HTMLDivElement>(
    `.${cardStyles.card}`,
    cardStyles.visible,
    { threshold: 0.08 },
    filterKey,
  );

  const hasActiveFilter = !!selectedYear || selectedTags.length > 0;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

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

      {visiblePosts.length > 0 && (
        <div className={styles.filterBar}>
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>年</span>
            <div className={styles.filterPills}>
              {availableYears.map((year) => (
                <button
                  key={year}
                  className={`${styles.filterPill}${selectedYear === year ? ` ${styles.filterPillActive}` : ''}`}
                  onClick={() => setSelectedYear((prev) => (prev === year ? null : year))}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {availableTags.length > 0 && (
            <div className={styles.filterRow}>
              <span className={styles.filterLabel}>タグ</span>
              <div className={styles.filterPills}>
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    className={`${styles.filterPill}${selectedTags.includes(tag) ? ` ${styles.filterPillActive}` : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hasActiveFilter && (
            <div className={styles.filterResult}>
              <span>{filteredPosts.length}件</span>
              <button
                className={styles.clearFilter}
                onClick={() => { setSelectedYear(null); setSelectedTags([]); }}
              >
                クリア
              </button>
            </div>
          )}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className={styles.empty}>
          {hasActiveFilter ? '条件に一致する記事はありません。' : '記事はまだありません。'}
        </p>
      ) : (
        <div className={styles.grid} ref={gridRef}>
          {filteredPosts.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              delay={index * 100}
              isDraft={isOwner && post.draft}
            />
          ))}
        </div>
      )}
    </main>
  );
}
