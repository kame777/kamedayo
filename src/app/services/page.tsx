import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

const projects = [
  { id: 1, title: '文字数カウンター', description: 'シンプルで多機能な文字数カウンター' },
  { id: 2, title: 'パスワードジェネレーター', description: '小文字や大文字・記号の有無など、詳細な設定が可能' },
  { id: 3, title: '文章比較ツール', description: '乞うご期待' },
];

export default function Page() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>Webツール一覧</h1>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '2rem'
        }}>
          {projects.map(project => (
            <Link key={project.id} href={`/webtool/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                padding: '1.5rem',
                borderRadius: '10px',
                background: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
