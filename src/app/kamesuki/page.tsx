import Link from 'next/link';

export default function About() {
  return (
    <>
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <h1>かめすき－</h1>
        <p>「<a href='https://misskey.kamedayo.com' target="_blank">かめすきー</a>」というMisskeyサーバーを運営しています。
        <br />
        一般開放はしない予定ですので、もし入りたい方がいらっしゃいましたらX(旧Twitter)もしくはMisskey.ioにDMしてください。
        <br />
        （データの保証はできません！インスタンスごと吹っ飛ばしたらごめんなさい）
        </p>
        
      </main>
    </>
  );
}