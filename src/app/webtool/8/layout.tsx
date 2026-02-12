import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'kamedayo | Webツールと技術メモ',
  description:
    'ポモドーロ・テクニックで集中力を高める。作業と休憩を効果的に管理するWebタイマーアプリ。',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
