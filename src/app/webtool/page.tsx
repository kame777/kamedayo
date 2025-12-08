import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from './Services.module.css';

const projects = [
  {
    id: 1,
    code: "T01",
    title: "文字数カウンター",
    desc: "多機能な文字数カウンター",
    category: "",
    url: "../webtool/1/"
  },
  {
    id: 2,
    code: "T02",
    title: "パスワードジェネレーター",
    desc: "詳細設定可能なパスワード生成ツール",
    category: "",
    url: "../webtool/2/"
  },
  {
    id: 3,
    code: "T03",
    title: "文章比較ツール",
    desc: "2つの文章を比較して差分を表示",
    category: "乞うご期待",
    url: "../webtool/3/"
  }
];

export default function Page() {
  return (
    <>
      <Header />

      <main className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Webツール一覧</h1>
          <p className={styles.subtitle}>軽量・シンプル・実用的なWebツールを揃えています。（）</p>
        </div>

        <div className={styles.grid}>
          {projects.map((p, index) => (
            <Link key={p.id} href={p.url} className={styles.linkReset}>
              <article
                className={styles.card}
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className={styles.left}>
                  <div className={styles.icon}>
                    {p.code}
                  </div>

                  <div>
                    <h3 className={styles.cardTitle}>{p.title}</h3>
                    <p className={styles.cardDesc}>{p.desc}</p>
                    <p className={styles.cardUrl}>{p.url}</p>
                  </div>
                </div>

                <div className={styles.category}>
                  {p.category}
                </div>
              </article>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
