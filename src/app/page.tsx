import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Kamesuki from './kamesuki/page';

export default function Home() {
  return (
    <>
      <title>kameテスト用サイト</title>
      <Header />
      <Hero />
      <Kamesuki />
      <Footer />
    </>
  );
}