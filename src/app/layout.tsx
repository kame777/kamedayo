import type { Metadata } from 'next';
import './globals.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL('https://kamedayo.com'),
  title: {
    default: 'kamedayo | Webツールと技術メモ',
    template: '%s | kamedayo',
  },
  description: '個人が作る便利Webツールと技術メモのサイト。Next.jsで構築しています。',
  openGraph: {
    type: 'website',
    url: 'https://kamedayo.com',
    title: 'kamedayo | Webツールと技術メモ',
    description: '個人が作る便利Webツールと技術メモのサイト。',

    siteName: 'kamedayo',
    images: [
      { url: '/logo512.png', width: 512, height: 512, alt: 'kamedayo' },
    ],
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'kamedayo | Webツールと技術メモ',
    description: '個人が作る便利Webツールと技術メモのサイト。',
    images: ['/logo512.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/logo192.png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=LINE+Seed+JP:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Header />
        <div className="page-transition">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}