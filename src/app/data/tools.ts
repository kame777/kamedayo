export type Tool = {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  status: 'live' | 'soon';
  url: string;
  color: string;
};

export const tools: Tool[] = [
  {
    id: 1,
    icon: '📝',
    title: '文字数カウンター',
    description: 'テキストの文字数・単語数・行数をリアルタイムでカウント。',
    category: '公開中',
    status: 'live',
    url: '/webtool/1',
    color: '#059669',
  },
  {
    id: 2,
    icon: '🔐',
    title: 'パスワードジェネレーター',
    description: '安全なランダムパスワードをワンクリックで生成。',
    category: '公開中',
    status: 'live',
    url: '/webtool/2',
    color: '#10b981',
  },
  {
    id: 3,
    icon: '🔍',
    title: '文章比較ツール',
    description: '2つの文章を並べて差分をハイライト表示。コードレビューや原稿チェックに。',
    category: '開発中',
    status: 'soon',
    url: '/webtool/3',
    color: '#34d399',
  },
];

export const newsItems = [
  { date: '2026/02/10', text: 'メインページを大幅リニューアルしました！' },
  { date: '2025/11/15', text: 'メインページリニューアルしました！' },
];
