import Hero from './components/Hero';
import Features from './components/Features';
import News from './components/News';
import KamesukiSection from './components/KamesukiSection';

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