import dynamic from 'next/dynamic';
import Hero from './components/Hero';
import WaveDivider from './components/WaveDivider';
import { FeaturesSkeleton, NewsSkeleton, KamesukiSkeleton } from './components/Skeleton';

const Features = dynamic(() => import('./components/Features'), {
  loading: () => <FeaturesSkeleton />,
});
const News = dynamic(() => import('./components/News'), {
  loading: () => <NewsSkeleton />,
});
const KamesukiSection = dynamic(() => import('./components/KamesukiSection'), {
  loading: () => <KamesukiSkeleton />,
});

export default function Home() {
  return (
    <main>
      <Hero />
      <WaveDivider />
      <News />
      <KamesukiSection />
      <Features />
    </main>
  );
}

export const metadata = {
  title: 'kamedayo | Webツールと技術メモ',
};