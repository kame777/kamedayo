import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>私について</h1>
        <p>こちらのページをご覧ください（面倒くさくなった）</p>
        <iframe src="https://kamedayo.notion.site/ebd/1870b35a8a1680de9172d7c3bc9a165f" width="100%" height="600" frameborder="0" allowfullscreen />
      </main>
      <Footer />
    </>
  );
}