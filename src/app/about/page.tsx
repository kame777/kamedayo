import styles from './About.module.css';
export const metadata = {
  title: '私について',
};
import Link from 'next/link';
import Image from 'next/image';
import ImageLightbox from '../components/ImageLightbox';

export default function About() {
  return (
    <main className={styles.main}>
      {/* ===== ヒーロー ===== */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.headerRow}>
            <Image src="/logo512.png" alt="kame" width={56} height={56} className={styles.avatar} />
            <div className={styles.meta}>
              <p className={styles.byline}>kame-かめ</p>
              <p className={styles.tagline}>プロフィール・リンク集</p>
            </div>
          </div>
          <h1 className={styles.title}>私について</h1>
        </div>
      </section>

      {/* ===== 自己紹介 ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>📝</span>
          自己紹介
        </h2>

        <div className={styles.profileCard}>
          <div className={styles.profileImage}>
            <Image src="/logo512.png" alt="かめかめ" width={220} height={220} className={styles.profileImg} />
          </div>
          <div className={styles.profileInfo}>
            <h3 className={styles.profileHeading}>プロフィール</h3>
            <dl className={styles.profileList}>
              <div className={styles.profileItem}>
                <dt>名前</dt><dd>kame</dd>
              </div>
              <div className={styles.profileItem}>
                <dt>出身</dt><dd>千葉</dd>
              </div>
              <div className={styles.profileItem}>
                <dt>性別</dt><dd>男</dd>
              </div>
              <div className={styles.profileItem}>
                <dt>年齢</dt><dd>10代</dd>
              </div>
            </dl>

            <h3 className={styles.profileHeading}>趣味</h3>
            <ul className={styles.hobbyList}>
              <li>パソコン</li>
              <li>鉄道</li>
              <li>ロケット</li>
              <li>地震</li>
            </ul>
          </div>
        </div>

        {/* 一言 */}
        <div className={styles.callout}>
          <span className={styles.calloutIcon}>💬</span>
          <div>
            <p className={styles.calloutDate}>2026年1月1日 一言</p>
            <p>2026年もよろしくお願いします！</p>
          </div>
        </div>

        {/* 好きなゲームジャンル */}
        <div className={styles.callout}>
          <span className={styles.calloutIcon}>🎮</span>
          <div>
            <p className={styles.calloutTitle}>好きなゲームジャンル</p>
            <p>Factorioとかの自動化シミュレーションゲームが好き。</p>
            <p>自分がプレイヤーを操作する系のゲームが特に好き❤️</p>
          </div>
        </div>

        {/* 名前の由来 */}
        <div className={styles.callout}>
          <span className={styles.calloutIcon}>🏷️</span>
          <div>
            <p className={styles.calloutTitle}>名前の由来</p>
            <p>ウマ娘というゲームをやった時、テキトウに&quot;亀太郎&quot;という名前を付けたのが始まり。</p>
            <p>のちに名前を命名するのが面倒くさくなり&quot;亀&quot;→&quot;かめ&quot;→&quot;kame&quot;という流れ</p>
          </div>
        </div>
      </section>

      {/* ===== 私がやっていること ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🚀</span>
          私がやっていること
        </h2>

        {/* スキルカード */}
        <div className={styles.skillGrid}>
          <div className={styles.skillCard}>
            <span className={styles.skillIcon}>&lt;/&gt;</span>
            <p className={styles.skillLabel}>HTML / CSS</p>
          </div>
          <div className={styles.skillCard}>
            <span className={styles.skillIconReact}>⚛</span>
            <p className={styles.skillLabel}>React（勉強中）</p>
          </div>
        </div>

        <div className={styles.callout}>
          <span className={styles.calloutIcon}>💬</span>
          <div>
            <p>まだいろいろ勉強中です。チャッピーやネットの手を借りて、webサイト(webツール)を制作しています。
              <Link href="https://kamedayo.com" target="_blank" rel="noopener noreferrer">kamedayo.com</Link>で公開しています。
            </p>
            <p>React は軽く触った程度で、あまり理解していません。ちなみにkamedayo.comはNext.jsで書いています。</p>
          </div>
        </div>
      </section>

      {/* ===== 私がやったこと・やってたこと ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>📜</span>
          私がやったこと・やってたこと
        </h2>

        {/* Misskeyインスタンス運営 */}
        <div className={styles.activityCard}>
          <div className={styles.activityBanner}>
            <span className={styles.activityBannerText}>Misskeyインスタンス運営</span>
          </div>
          <div className={styles.callout}>
            <span className={styles.calloutIcon}>💬</span>
            <div>
              <p className={styles.calloutDate}>2025年1月14日～2026年3月31日</p>
              <p>
                <Link href="https://misskey.kamedayo.com/" target="_blank" rel="noopener noreferrer">
                  かめすきー
                </Link>
                という身内用のMisskeyインスタンスを運営していました。
              </p>
            </div>
          </div>
        </div>

        {/* 活動カード */}
        <div className={styles.historyGrid}>
          <div className={styles.historyCard}>
            <span className={styles.historyIcon}>🖼️</span>
            <p className={styles.historyLabel}>画像加工</p>
          </div>
          <div className={styles.historyCard}>
            <span className={styles.historyIcon}>🎬</span>
            <p className={styles.historyLabel}>動画編集</p>
          </div>
        </div>

        <div className={styles.callout}>
          <span className={styles.calloutIcon}>💬</span>
          <div>
            <p className={styles.calloutDate}>22年12月頃～23年6月28日</p>
            <p>過去には地震観測の動画を投稿してたりもしました…!</p>
            <p>⇒ 地震監視 by kame 【現在休止中】</p>
          </div>
        </div>

        <div className={styles.callout}>
          <span className={styles.calloutIcon}>💬</span>
          <div>
            <p>SeaofThievesというゲームにハマっていた時は、攻略動画なんかも作りました。</p>
            <div className={styles.videoEmbed}>
              <iframe
                src="https://www.youtube.com/embed/42zGm68KZzI"
                title="SeaofThieves 攻略動画"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* マイクラサーバー運営 */}
        <div className={styles.activityCard}>
          <div className={styles.activityBanner}>
            <span className={styles.activityBannerText}>マイクラサーバー運営</span>
          </div>
          <div className={styles.callout}>
            <span className={styles.calloutIcon}>💬</span>
            <div>
              <p className={styles.calloutDate}>～23年3月頃まで</p>
              <p>一時期かめ鯖というマイクラサーバーを運営していました！</p>
              <p>サーバーの費用の問題でサービス終了しましたが…</p>
              <details className={styles.toggle}>
                <summary>チラ見(当時のwebサイト)</summary>
                <ImageLightbox
                  images={[
                    { src: '/kamesaba1.webp', alt: 'かめ鯖 webサイト 1' },
                    { src: '/kamesaba2.webp', alt: 'かめ鯖 webサイト 2' },
                    { src: '/kamesaba3.webp', alt: 'かめ鯖 webサイト 3' },
                  ]}
                />
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* ===== 各種リンク類 ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🔗</span>
          各種リンク類
        </h2>

        {/* 各種アカウント */}
        <h3 className={styles.subSectionTitle}>各種アカウント</h3>
        <div className={styles.linkGrid}>
          <LinkCard icon="https://www.google.com/s2/favicons?domain=twitch.tv&sz=64" label="Twitch" href="https://www.twitch.tv/kamedayo777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=store.steampowered.com&sz=64" label="Steam" href="https://steamcommunity.com/id/kame777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=github.com&sz=64" label="GitHub" href="https://github.com/kame777/" />
        </div>

        {/* SNS */}
        <h3 className={styles.subSectionTitle}>SNS — 主に使っているSNS</h3>
        <div className={styles.linkGrid}>
          <LinkCard icon="https://www.google.com/s2/favicons?domain=x.com&sz=64" label="X（旧Twitter）" href="https://x.com/kamedayo_777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=misskey.kamedayo.com&sz=64" label="かめすきー" href="https://misskey.kamedayo.com/@kame777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=misskey.io&sz=64" label="Misskey.io" href="https://misskey.io/@kame777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=misskey.flowers&sz=64" label="はなみすきー" href="https://misskey.flowers/@kame777/" />
        </div>

        <h3 className={styles.subSectionTitle}>SNS — あまり使っていないSNS</h3>
        <div className={styles.linkGrid}>
          <LinkCard icon="https://www.google.com/s2/favicons?domain=bsky.app&sz=64" label="Bluesky Social" href="https://bsky.app/profile/kame-777.bsky.social/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=social.vivaldi.net&sz=64" label="Vivaldi Social" href="https://social.vivaldi.net/@kame777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=mstdn.jp&sz=64" label="mstdn.jp" href="https://mstdn.jp/@kame777/" />
        </div>

        <h3 className={styles.subSectionTitle}>SNS — 全く使っていないSNS</h3>
        <div className={styles.linkGrid}>
          <LinkCard icon="https://www.google.com/s2/favicons?domain=fiicen.jp&sz=64" label="フィーセン" href="https://fiicen.jp/field/kame777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=tmitter.tokyo&sz=64" label="つみったー" href="https://tmitter.tokyo/users/kame777/" />
          <LinkCard icon="https://www.google.com/s2/favicons?domain=taittsuu.com&sz=64" label="タイッツー" href="https://taittsuu.com/users/kame777/" />
        </div>

        {/* その他 */}
        <h3 className={styles.subSectionTitle}>その他</h3>
        <div className={styles.linkGrid}>
          <LinkCard icon="https://www.google.com/s2/favicons?domain=youtube.com&sz=64" label="地震監視 by kame 【現在休止中】" href="https://www.youtube.com/@EEW3/" />
        </div>
      </section>
    </main>
  );
}

function LinkCard({ icon, label, href }: { icon: string; label: string; href: string }) {
  const isExternal = href.startsWith('http');
  return (
    <Link
      href={href}
      className={styles.linkCard}
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      data-no-external="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" width={20} height={20} className={styles.linkCardIcon} />
      <span className={styles.linkCardLabel}>{label}</span>
    </Link>
  );
}