import Header from '../components/Header';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>私について</h1>
        <p>こちらのページをご覧ください（面倒くさくなった）</p>
        <a href="https://url.kamedayo.com/profile" target='_blank' rel="noopener noreferrer">https://url.kamedayo.com/profile</a>
      </main>
      <Footer />
    </>
  );
}