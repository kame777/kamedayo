import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import './Introduction.css';

const Introduction = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`introduction ${theme === 'dark' ? 'introduction-dark' : ''}`}>
      {/* 文字が横いっぱいに表示されるようdiv要素でラップ */}
      <div className="introduction-content">
        <h1 className='welcome'>kameテスト用サイトへようこそ!!</h1>
        <div className="intro-text">
          <p>
            趣味でWebサービスを自作したりしてプログラミングを勉強してます。<br />
            ホームページとかの技術に興味があるのでこのサイトで公開しています。<br />
            最近はReactを勉強しています。
          </p>
          <p>（このサイトは<a href="https://github.com/kame777/kamedayo/">GitHub</a>でOSSとして公開されてるよ!）</p>
        </div>
        <div className={`info-box ${theme === 'dark' ? 'info-box-dark' : ''}`}>
          <p>
            「かめすきー」というMisskeyサーバーを運営しています。<br />
            一般開放はしない予定ですので、もし入りたい方がいらっしゃいましたら<a href="https://url.kamedayo.com/twitter">X(旧Twitter)</a>もしくは<a href="https://url.kamedayo.com/misskey">Misskey.io</a>にDMしてください。<br />
            （データの保証はできません！インスタンスごと吹っ飛ばしたらごめんなさい）
          </p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;