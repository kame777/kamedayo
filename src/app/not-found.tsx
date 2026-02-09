import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />

      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 — ページが見つかりません</h1>
        <p style={{ marginBottom: '1.25rem' }}>お探しのページは存在しないか、移動した可能性があります。</p>
        <Link href="/" style={{ color: '#fff', background: '#0070f3', padding: '0.6rem 1rem', borderRadius: 6, textDecoration: 'none' }}>ホームに戻る</Link>
      </main>

      <Footer />
    </>
  );
}
