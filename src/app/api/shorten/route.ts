import { NextRequest, NextResponse } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    let SHORT_IO_API_KEY = "";
    let SHORT_IO_DOMAIN = "";

    try {
      // Cloudflare Pages runtime
      const { env } = getRequestContext();
      SHORT_IO_API_KEY = (env as Record<string, string>).SHORT_IO_API_KEY || "";
      SHORT_IO_DOMAIN = (env as Record<string, string>).SHORT_IO_DOMAIN || "";
    } catch {
      // Local dev fallback
      SHORT_IO_API_KEY = process.env.SHORT_IO_API_KEY || "";
      SHORT_IO_DOMAIN = process.env.SHORT_IO_DOMAIN || "";
    }

    if (!SHORT_IO_API_KEY || !SHORT_IO_DOMAIN) {
      return NextResponse.json(
        { error: "サーバー設定エラー: APIキーまたはドメインが未設定です。" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URLが指定されていません。" },
        { status: 400 }
      );
    }

    // Validate URL
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { error: "有効なURLを入力してください。" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.short.io/links/public", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: SHORT_IO_API_KEY,
      },
      body: JSON.stringify({
        originalURL: url,
        domain: SHORT_IO_DOMAIN,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error("Short.io API error:", response.status, errData);
      return NextResponse.json(
        { error: "短縮URLの生成に失敗しました。しばらくしてから再試行してください。" },
        { status: 502 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      shortURL: data.shortURL,
      originalURL: data.originalURL,
    });
  } catch (err) {
    console.error("Shorten API error:", err);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました。" },
      { status: 500 }
    );
  }
}
