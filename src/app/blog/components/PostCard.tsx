import Link from 'next/link';
import type { PostMeta } from '../lib/types';
import styles from './PostCard.module.css';

export default function PostCard({ post, delay = 0, isDraft = false }: { post: PostMeta; delay?: number; isDraft?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.linkReset}>
      <article
        className={`${styles.card}${isDraft ? ` ${styles.visible}` : ''}`}
        style={{ '--delay': `${delay}ms` } as React.CSSProperties}
      >
        <div className={styles.cardMeta}>
          <time className={styles.date}>{post.date}</time>
          <span className={styles.category}>{post.category}</span>
          {isDraft && <span className={styles.draftBadge}>下書き</span>}
        </div>
        <h2 className={styles.title}>{post.title}</h2>
        <p className={styles.summary}>{post.summary}</p>
        {post.tags.length > 0 && (
          <div className={styles.tags}>
            {post.tags.map((tag) => (
              <span key={tag} className={styles.tag}>#{tag}</span>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
