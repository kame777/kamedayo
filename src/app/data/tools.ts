export type Tool = {
  id: number;
  icon: string;
  title: string;
  description: string;
  category: string;
  status: 'live' | 'soon';
  url: string;
};

export const tools: Tool[] = [
  {
    id: 1,
    icon: '📝',
    title: '文字数カウンター',
    description: 'テキストの文字数・行数をリアルタイムでカウント。',
    category: '公開中',
    status: 'live',
    url: '/webtool/1',
  },
  {
    id: 2,
    icon: '🔐',
    title: 'パスワード生成ツール',
    description: 'ワンクリックで強力なパスワードを自動生成。',
    category: '公開中',
    status: 'live',
    url: '/webtool/2',
  },
  {
    id: 3,
    icon: '🔍',
    title: '文章比較ツール',
    description: '2つの文章を並べて差分をハイライト表示。コードレビューや原稿チェックに。',
    category: '公開中',
    status: 'live',
    url: '/webtool/3',
  },
  {
    id: 4,
    icon: '🔄',
    title: '拡張子変換ツール',
    description: '画像・動画ファイルの拡張子をブラウザ上で変換。様々な拡張子に対応。',
    category: '公開中',
    status: 'live',
    url: '/webtool/4',
  },
  {
    id: 5,
    icon: '📄',
    title: 'PDFツール',
    description: 'PDFの結合・分割・ページ抽出・圧縮。すべてブラウザ上で完結。',
    category: '公開中',
    status: 'live',
    url: '/webtool/5',
  },
  {
    id: 6,
    icon: '🔗',
    title: '短縮URL作成ツール',
    description: '長いURLをワンクリックで短縮。url.kamedayo.com/xxxxxxに変換。',
    category: '公開中',
    status: 'live',
    url: '/webtool/6',
  },
  {
    id: 7,
    icon: '📱',
    title: 'QRコード生成ツール',
    description: 'テキストやURLからQRコードを即座に生成。PNG・SVG・クリップボードにコピー可能。',
    category: '公開中',
    status: 'live',
    url: '/webtool/7',
  },
  {
    id: 8,
    icon: '🍅',
    title: 'ポモドーロタイマー',
    description: 'GitHubログインによるデータ同期・統計閲覧が可能。集中力を最大化します。',
    category: '公開中',
    status: 'live',
    url: '/webtool/8',
  },
];

export const newsItems = [
  { date: '2026/02/11', text: 'ポモドーロタイマーを開発予定です！' },
  { date: '2026/02/10', text: 'メインページを大幅リニューアルしました！' },
  { date: '2025/11/15', text: 'メインページリニューアルしました！' },
];
