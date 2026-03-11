import { Suspense } from 'react';
import { getAllPosts } from './lib/posts';
import BlogClient from './components/BlogClient';
import HeroBanner from '../components/HeroBanner';
import FlashMessage from './components/FlashMessage';
import { PenIcon } from '../components/Icons';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ブログ',
  description: 'kamedayoのブログ記事一覧です。',
  openGraph: {
    title: 'kamedayo | ブログ',
    description: 'kamedayoのブログ記事一覧です。',
  },
};

export default function BlogPage() {
  const posts = getAllPosts(true);

  return (
    <>
      <HeroBanner
        badge={<><PenIcon size={15} /> Blog</>}
        title="ブログ"
        subtitle="技術メモや日々の記録"
      />
      <BlogClient posts={posts} />
      <Suspense><FlashMessage /></Suspense>
    </>
  );
}
