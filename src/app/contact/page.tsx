import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Contact() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>お問い合わせ</h1>
        <p>XのDMまでお願いします。（なるべく早い返信を心がけておりますが、お時間を頂く場合があります。）</p>
        <a href="https://url.kamedayo.com/twitter" target='_blank'>https://url.kamedayo.com/twitter</a>
      </main>
      <Footer />
    </>
  );
}
