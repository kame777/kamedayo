"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./UrlShortener.module.css";
import HeroBanner from "../../components/HeroBanner";

type ShortenedEntry = {
  id: string;
  originalURL: string;
  shortURL: string;
  createdAt: string;
};

const STORAGE_KEY = "kamedayo:urlShortenerHistory";

function isValidUrl(str: string): boolean {
  try {
    const url = new URL(str);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function UrlShortenerPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ShortenedEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleShorten = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("URLを入力してください。");
      return;
    }
    if (!isValidUrl(trimmed)) {
      setError("有効なURL（https://...）を入力してください。");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "短縮に失敗しました。もう一度お試しください。");
        return;
      }

      const entry: ShortenedEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        originalURL: trimmed,
        shortURL: data.shortURL,
        createdAt: new Date().toLocaleString("ja-JP"),
      };

      setHistory((prev) => [entry, ...prev]);
      setUrl("");
      inputRef.current?.focus();
    } catch {
      setError("ネットワークエラーが発生しました。接続を確認してください。");
    } finally {
      setLoading(false);
    }
  }, [url]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !loading) handleShorten();
    },
    [handleShorten, loading]
  );

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as any[];
        if (Array.isArray(parsed)) {
          const normalized: ShortenedEntry[] = parsed
            .map((it) => {
              if (!it || typeof it !== "object") return null;
              const id = it.id || it.key || (Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
              const originalURL = it.originalURL || it.originalUrl || it.url || "";
              const shortURL = it.shortURL || it.shortUrl || it.short || "";
              const createdAt = it.createdAt || it.created_at || it.time || new Date().toLocaleString("ja-JP");
              if (!originalURL || !shortURL) return null;
              return { id, originalURL, shortURL, createdAt } as ShortenedEntry;
            })
            .filter((v): v is ShortenedEntry => v !== null);

          if (normalized.length > 0) setHistory(normalized);
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // Persist history to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
      /* ignore */
    }
  }, [history]);

  return (
    <>
      <HeroBanner
        badge="🔗 URL Shortener"
        title="短縮URL作成ツール"
        subtitle="長いURLをワンクリックで短縮"
      />

      <main className={styles.container}>
        {/* Input Section */}
        <div className={styles.inputSection}>
          <div className={styles.inputWrapper}>
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com/very/long/url..."
              className={styles.urlInput}
              disabled={loading}
              autoFocus
            />
          </div>
          <button
            onClick={handleShorten}
            className={styles.shortenBtn}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              "短縮する"
            )}
          </button>
        </div>

        {error && (
          <div className={styles.errorMsg}>
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Result - Latest */}
        {history.length > 0 && (
          <div className={styles.latestResult}>
            <div className={styles.latestLabel}>✨ 短縮URL</div>
            <div className={styles.latestUrlRow}>
              <a
                href={history[0].shortURL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.latestUrl}
              >
                {history[0].shortURL}
              </a>
              <button
                onClick={() => copyToClipboard(history[0].shortURL, history[0].id)}
                className={`${styles.copyBtn} ${copiedId === history[0].id ? styles.copied : ""}`}
              >
                {copiedId === history[0].id ? "✅ コピー済み" : "📋 コピー"}
              </button>
            </div>
            <p className={styles.latestOriginal}>
              元のURL: <span>{history[0].originalURL}</span>
            </p>
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <div className={styles.historySection}>
            <div className={styles.historyHeader}>
              <h2 className={styles.historyTitle}>📜 変換履歴</h2>
              <button onClick={clearHistory} className={styles.clearBtn}>
                履歴をクリア
              </button>
            </div>
            <div className={styles.historyList}>
              {history.slice(1).map((entry) => (
                <div key={entry.id} className={styles.historyItem}>
                  <div className={styles.historyShort}>
                    <a
                      href={entry.shortURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {entry.shortURL}
                    </a>
                    <button
                      onClick={() => copyToClipboard(entry.shortURL, entry.id)}
                      className={`${styles.copyBtn} ${copiedId === entry.id ? styles.copied : ""}`}
                    >
                      {copiedId === entry.id ? "✅ コピー済み" : "📋 コピー"}
                    </button>
                  </div>
                  <p className={styles.historyOriginal}>{entry.originalURL}</p>
                  <span className={styles.historyTime}>{entry.createdAt}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className={styles.infoSection}>
          <h2 className={styles.infoTitle}>💡 使い方</h2>
          <ul className={styles.infoList}>
            <li>短縮したいURLを入力して「短縮する」をクリック</li>
            <li>元のURLは、https://url.kamedayo.com/xxxxxxという形に変換されます</li>
            <li>生成された短縮URLをコピーして共有</li>
            <li>変換履歴はブラウザを閉じても保持されます（ローカルストレージ）</li>
          </ul>
        </div>
      </main>
    </>
  );
}
