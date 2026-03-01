// ============================================================
// About ページのコンテンツはすべてここで管理する
// テキストや URL を変えたい場合はこのファイルだけ編集すればよい
// ============================================================

// ── 型定義 ──────────────────────────────────────────────────

/** インライン要素: 文字列 or リンク */
export type TextSegment = string | { text: string; href: string }

/** 1 段落 = TextSegment の配列 */
export type Paragraph = TextSegment[]

/** callout ボックス 1 件分のデータ */
export interface CalloutData {
  date?: string
  title?: string
  paragraphs: Paragraph[]
}

/** activityCard (バナー付きカード) のデータ */
export interface ActivityCardData {
  banner: string
  callout: CalloutData
}

/** historyCard のアイコン識別子 */
export type HistoryIconId = 'image' | 'video'

/** historyCard */
export interface HistoryCardData {
  iconId: HistoryIconId
  label: string
}

/** スキルカード */
export interface SkillCardData {
  icon: string
  label: string
  type: 'code' | 'react'
}

/** リンク 1 件 */
export interface LinkItem {
  label: string
  /** Google Favicon API に渡すドメイン */
  domain: string
  href: string
}

/** リンクセクション */
export interface LinkSection {
  heading: string
  links: LinkItem[]
}

// ── プロフィール ─────────────────────────────────────────────

export const profile = {
  name: 'kame',
  origin: '千葉',
  gender: '男',
  age: '10代',
}

export const hobbies: string[] = ['パソコン', '鉄道', 'ロケット', '地震']

// ── 自己紹介 callout ─────────────────────────────────────────

export const bioCallouts: CalloutData[] = [
  {
    date: '2026年1月1日 一言',
    paragraphs: [['2026年もよろしくお願いします！']],
  },
  {
    title: '好きなゲームジャンル',
    paragraphs: [
      ['Factorioとかの自動化シミュレーションゲームが好き。'],
      ['自分がプレイヤーを操作する系のゲームが特に好き'],
    ],
  },
  {
    title: '名前の由来',
    paragraphs: [
      ['ウマ娘というゲームをやった時、テキトウに"亀太郎"という名前を付けたのが始まり。'],
      ['のちに名前を命名するのが面倒くさくなり"亀"→"かめ"→"kame"という流れ'],
    ],
  },
]

// ── スキル ──────────────────────────────────────────────────

export const skills: SkillCardData[] = [
  { icon: '</>', label: 'HTML / CSS', type: 'code' },
  { icon: '⚛', label: 'React（勉強中）', type: 'react' },
]

// ── 私がやっていること ────────────────────────────────────────

export const currentCallouts: CalloutData[] = [
  {
    paragraphs: [
      [
        'まだいろいろ勉強中です。チャッピーやネットの手を借りて、webサイト(webツール)を制作しています。',
        { text: 'kamedayo.com', href: 'https://kamedayo.com' },
        'で公開しています。',
      ],
      ['React は軽く触った程度で、あまり理解していません。ちなみにkamedayo.comはNext.jsで書いています。'],
    ],
  },
]

// ── 私がやったこと・やってたこと ────────────────────────────────

export const pastActivityCards: ActivityCardData[] = [
  {
    banner: 'Misskeyインスタンス運営',
    callout: {
      date: '2025年1月14日～2026年3月31日',
      paragraphs: [['かめすきーという身内用のMisskeyインスタンスを運営していました。']],
    },
  },
  // マイクラサーバーは ImageLightbox を含むため page.tsx に JSX として記述
]

export const historyCards: HistoryCardData[] = [
  { iconId: 'image', label: '画像加工' },
  { iconId: 'video', label: '動画編集' },
]

export const pastCallouts: CalloutData[] = [
  {
    date: '22年12月頃～23年6月28日',
    paragraphs: [
      ['過去には地震観測の動画を投稿してたりもしました…!'],
      ['⇒ 地震監視 by kame 【現在休止中】'],
    ],
  },
  // SeaofThieves は iframe を含むため page.tsx に JSX として記述
]

// ── リンク集 ─────────────────────────────────────────────────

export const linkSections: LinkSection[] = [
  {
    heading: '各種アカウント',
    links: [
      { label: 'Twitch', domain: 'twitch.tv', href: 'https://www.twitch.tv/kamedayo777/' },
      { label: 'Steam', domain: 'store.steampowered.com', href: 'https://steamcommunity.com/id/kame777/' },
      { label: 'GitHub', domain: 'github.com', href: 'https://github.com/kame777/' },
    ],
  },
  {
    heading: 'SNS — 主に使っているSNS',
    links: [
      { label: 'X（旧Twitter）', domain: 'x.com', href: 'https://x.com/kamedayo_777/' },
      { label: 'かめすきー', domain: 'misskey.kamedayo.com', href: 'https://misskey.kamedayo.com/@kame777/' },
      { label: 'Misskey.io', domain: 'misskey.io', href: 'https://misskey.io/@kame777/' },
      { label: 'はなみすきー', domain: 'misskey.flowers', href: 'https://misskey.flowers/@kame777/' },
    ],
  },
  {
    heading: 'SNS — あまり使っていないSNS',
    links: [
      { label: 'Bluesky Social', domain: 'bsky.app', href: 'https://bsky.app/profile/kame-777.bsky.social/' },
      { label: 'Vivaldi Social', domain: 'social.vivaldi.net', href: 'https://social.vivaldi.net/@kame777/' },
      { label: 'mstdn.jp', domain: 'mstdn.jp', href: 'https://mstdn.jp/@kame777/' },
    ],
  },
  {
    heading: 'SNS — 全く使っていないSNS',
    links: [
      { label: 'フィーセン', domain: 'fiicen.jp', href: 'https://fiicen.jp/field/kame777/' },
      { label: 'つみったー', domain: 'tmitter.tokyo', href: 'https://tmitter.tokyo/users/kame777/' },
      { label: 'タイッツー', domain: 'taittsuu.com', href: 'https://taittsuu.com/users/kame777/' },
    ],
  },
  {
    heading: 'その他',
    links: [
      { label: '地震監視 by kame 【現在休止中】', domain: 'youtube.com', href: 'https://www.youtube.com/@EEW3/' },
    ],
  },
]
