import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '../lib/posts';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import HeroBanner from '../../components/HeroBanner';
import EditButton from '../components/EditButton';
import DraftBanner from './DraftBanner';
import FlashMessage from '../components/FlashMessage';
import type { Metadata } from 'next';
import styles from './Post.module.css';

type Props = { params: { slug: string } };

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.ogTitle ?? post.title,
    description: post.ogDescription ?? post.summary,
    openGraph: {
      title: post.ogTitle ?? post.title,
      description: post.ogDescription ?? post.summary,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updatedAt,
    },
  };
}

export default function PostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const showUpdated = post.updatedAt && post.updatedAt !== post.date;

  return (
    <>
      <HeroBanner
        badge={post.slug}
        title={post.title}
        subtitle={post.summary}
      />
      <main className={styles.container}>
        <div className={styles.topBar}>
          <Link href="/blog" className={styles.backLink}>← ブログ一覧へ</Link>
          <EditButton slug={post.slug} />
        </div>
        {post.draft && <DraftBanner />}
        <article>
          <header className={styles.postHeader}>
            <div className={styles.metaRow}>
              <div className={styles.dates}>
                <time className={styles.date} dateTime={post.date}>
                  投稿: {post.date}
                </time>
                {showUpdated && (
                  <time className={styles.updatedAt} dateTime={post.updatedAt}>
                    最終更新: {post.updatedAt}
                  </time>
                )}
              </div>
              <span className={styles.category}>{post.category}</span>
            </div>
            {post.tags.length > 0 && (
              <div className={styles.tags}>
                {post.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            )}
          </header>
          <div className={styles.prose}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{post.content}</ReactMarkdown>
          </div>
        </article>
      </main>
      <Suspense><FlashMessage /></Suspense>
    </>
  );
}
