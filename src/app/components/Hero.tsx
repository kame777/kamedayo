import styles from './Hero.module.css';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          kameテスト用サイトへ
          <br />
          ようこそ！
        </h1>
        <p className={styles.subtitle}>
          【近況報告】サイトをHTML/CSSからNext.jsに変更しました。
          <br />
          拡張性抜群だけど、慣れるまで大変だなあ。
        </p>
        <h2 className='{styles.subtitle}'>
          このサイトについて.
        </h2>
        <p className={styles.subtitle}>
        こんにちは、運営のkameです。
        <br />
        Webに関する技術全般に興味があり、個人的な趣味で作成したWebツールをどうせなら公開しちゃおう！っていうスタイルで運営しています。
        <br />
        （あったらいいなぁっていうWebサービスを自分で作りたい）
        <br />
        オープンソースで開発しておりますので、是非GitHubも覗いてみてください。
        <br />
        皆様の生活が少しでも便利になるようなツールを提供できれば幸いです。
        <br />
        どうぞよろしくお願いいたします。
        </p>
        <div className={styles.buttons}>
          <Link href="/services">
            <button className={styles.primaryBtn}>Webツール一覧</button>
          </Link>
          <Link href="/about">
            <button className={styles.secondaryBtn}>私について</button>
          </Link>
        </div>
      </div>
      <div className={styles.background}>
        <div className={styles.blob}></div>
        <div className={styles.blob}></div>
      </div>
    </section>
  );
}