import dynamic from 'next/dynamic';
import Hero from './components/Hero';
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
      <Features />
      <News />
      <KamesukiSection />
    </main>
  );
}