import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Services.module.css';

const projects = [
  { id: 1, title: '文字数カウンター', description: 'シンプルで多機能な文字数カウンター' },
  { id: 2, title: 'パスワードジェネレーター', description: '小文字や大文字・記号の有無など、詳細な設定が可能' },
  { id: 3, title: '文章比較ツール', description: '乞うご期待' },
];

export default function Page() {
  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Webツール一覧</h1>
            <p className={styles.subtitle}>軽量・シンプル・実用的。随時追加予定です。</p>
          </div>
        </div>

        <div className={styles.grid}>
          {projects.map((project, index) => (
            <Link
              key={project.id}
              href={`/webtool/${project.id}`}
              className={styles.linkReset}
              aria-label={`${project.title}の詳細へ`}
            >
              <article className={styles.card} style={{ animationDelay: `${index * 70}ms` }}>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>{project.description}</p>
              </article>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
