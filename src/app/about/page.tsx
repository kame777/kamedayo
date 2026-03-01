import React, { Fragment } from 'react';
import Image from 'next/image';
import styles from './About.module.css';
import CalloutBox from './CalloutBox';
import LinkCard from '../components/LinkCard';
import ImageLightbox from '../components/ImageLightbox';
import {
  profile,
  hobbies,
  bioCallouts,
  skills,
  currentCallouts,
  pastActivityCards,
  historyCards,
  pastCallouts,
  linkSections,
  type HistoryIconId,
} from '../data/about';

const historyIconMap: Record<HistoryIconId, React.ReactNode> = {
  image: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  video: (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
};

export const metadata = {
  title: '私について',
};

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
        <h2 className={styles.sectionTitle}>自己紹介</h2>

        <div className={styles.profileCard}>
          <div className={styles.profileImage}>
            <Image src="/logo512.png" alt="かめかめ" width={200} height={200} className={styles.profileImg} />
          </div>
          <div className={styles.profileInfo}>
            <h3 className={styles.profileHeading}>プロフィール</h3>
            <dl className={styles.profileList}>
              <div className={styles.profileItem}>
                <dt>名前</dt><dd>{profile.name}</dd>
              </div>
              <div className={styles.profileItem}>
                <dt>出身</dt><dd>{profile.origin}</dd>
              </div>
              <div className={styles.profileItem}>
                <dt>性別</dt><dd>{profile.gender}</dd>
              </div>
              <div className={styles.profileItem}>
                <dt>年齢</dt><dd>{profile.age}</dd>
              </div>
            </dl>

            <h3 className={styles.profileHeading}>趣味</h3>
            <ul className={styles.hobbyList}>
              {hobbies.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
        </div>

        {bioCallouts.map((entry, i) => (
          <CalloutBox key={i} data={entry} />
        ))}
      </section>

      {/* ===== 私がやっていること ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>私がやっていること</h2>

        <div className={styles.skillGrid}>
          {skills.map((skill) => (
            <div key={skill.label} className={styles.skillCard}>
              <span className={skill.type === 'react' ? styles.skillIconReact : styles.skillIcon}>
                {skill.icon}
              </span>
              <p className={styles.skillLabel}>{skill.label}</p>
            </div>
          ))}
        </div>

        {currentCallouts.map((entry, i) => (
          <CalloutBox key={i} data={entry} />
        ))}
      </section>

      {/* ===== 私がやったこと・やってたこと ===== */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>私がやったこと・やってたこと</h2>

        {pastActivityCards.map((card, i) => (
          <div key={i} className={styles.activityCard}>
            <div className={styles.activityBanner}>
              <span className={styles.activityBannerText}>{card.banner}</span>
            </div>
            <CalloutBox data={card.callout} />
          </div>
        ))}

        <div className={styles.historyGrid}>
          {historyCards.map((card) => (
            <div key={card.label} className={styles.historyCard}>
              <span className={styles.historyIcon}>{historyIconMap[card.iconId]}</span>
              <p className={styles.historyLabel}>{card.label}</p>
            </div>
          ))}
        </div>

        {pastCallouts.map((entry, i) => (
          <CalloutBox key={i} data={entry} />
        ))}

        {/* SeaofThieves: iframe を含むため JSX で記述 */}
        <div className={styles.callout}>
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

        {/* マイクラサーバー: ImageLightbox を含むため JSX で記述 */}
        <div className={styles.activityCard}>
          <div className={styles.activityBanner}>
            <span className={styles.activityBannerText}>マイクラサーバー運営</span>
          </div>
          <div className={styles.callout}>
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

        {linkSections.map((sec) => (
          <Fragment key={sec.heading}>
            <h3 className={styles.subSectionTitle}>{sec.heading}</h3>
            <div className={styles.linkGrid}>
              {sec.links.map((link) => (
                <LinkCard key={link.href} {...link} />
              ))}
            </div>
          </Fragment>
        ))}
      </section>
    </main>
  );
}
