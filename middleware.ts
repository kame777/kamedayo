import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ja', 'en'] as const;
type Locale = typeof locales[number];

function getPreferredLocale(req: NextRequest): Locale {
  try {
    const header = req.headers.get('accept-language') || '';
    const lower = header.toLowerCase();
    if (lower.includes('ja')) return 'ja';
    return 'en';
  } catch {
    return 'ja';
  }
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // すでに /ja or /en で始まっていれば何もしない
  if (locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) {
    return NextResponse.next();
  }

  // 静的ファイルは除外
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\..*).*)'],
};



