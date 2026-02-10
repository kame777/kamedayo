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
    title: 'パスワード生成ツール',
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
    category: '公開中',
    status: 'live',
    url: '/webtool/3',
    color: '#34d399',
  },
  {
    id: 4,
    icon: '🔄',
    title: '拡張子変換ツール',
    description: '画像・動画ファイルの拡張子をブラウザ上で変換。PNG・JPG・WebP・MP4・WebMなど幅広く対応。',
    category: '公開中',
    status: 'live',
    url: '/webtool/4',
    color: '#6ee7b7',
  },
  {
    id: 5,
    icon: '📄',
    title: 'PDFツール',
    description: 'PDFの結合・分割・ページ抽出・圧縮。すべてブラウザ上で完結。',
    category: '公開中',
    status: 'live',
    url: '/webtool/5',
    color: '#a7f3d0',
  },
  {
    id: 6,
    icon: '🔗',
    title: '短縮URL作成ツール',
    description: '長いURLをワンクリックで短縮。共有やSNS投稿に便利。',
    category: '公開中',
    status: 'live',
    url: '/webtool/6',
    color: '#67e8f9',
  },
  {
    id: 7,
    icon: '📱',
    title: 'QRコード生成ツール',
    description: 'テキストやURLからQRコードを即座に生成。PNG・SVGでダウンロード可能。',
    category: '公開中',
    status: 'live',
    url: '/webtool/7',
    color: '#38bdf8',
  },
];

export const newsItems = [
  { date: '2026/02/10', text: 'メインページを大幅リニューアルしました！' },
  { date: '2025/11/15', text: 'メインページリニューアルしました！' },
];
