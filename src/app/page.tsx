import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import News from './components/News';
import Kamesuki from './kamesuki/page';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <News />
      <Kamesuki />
      <Footer />
    </>
  );
}