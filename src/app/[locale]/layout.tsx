import type { Metadata } from 'next';

export const metadata: Metadata = {
  // 子側では共通metadataは上位のapp/layout.tsxを継承
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={params.locale}>
      <body>
        {children}
      </body>
    </html>
  );
}



