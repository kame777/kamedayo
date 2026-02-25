import { getAllPosts } from './lib/posts';
import BlogClient from './components/BlogClient';
import HeroBanner from '../components/HeroBanner';
import { PenIcon } from './components/BlogIcons';
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
  const posts = getAllPosts();

  return (
    <>
      <HeroBanner
        badge={<><PenIcon size={15} /> Blog</>}
        title="ブログ"
        subtitle="技術メモや日々の記録"
      />
      <BlogClient posts={posts} />
    </>
  );
}
