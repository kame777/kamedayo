import { useState, useCallback, useEffect, useRef } from "react";
import { ShortenedEntry } from "../types";

const STORAGE_KEY = "kamedayo:urlShortenerHistory";

export function useUrlShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ShortenedEntry[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
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

        setHistory(normalized);
      }
    } catch (e) {
      console.error("Failed to parse history:", e);
    }
  }, []);

  // Persist history to localStorage whenever it changes
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error("Failed to save history:", e);
    }
  }, [history]);

  const handleShorten = useCallback(async () => {
    const trimmed = url.trim();
    if (!trimmed) {
      setError("URLを入力してください。");
      return;
    }
    
    // Simple URL validation
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        throw new Error();
      }
    } catch {
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

  const copyToClipboard = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }, []);

  const clearHistory = useCallback(() => {
    if (window.confirm("履歴をすべて削除してもよろしいですか？")) {
      setHistory([]);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        console.error("Failed to clear history:", e);
      }
    }
  }, []);

  const handleInputChange = (val: string) => {
    setUrl(val);
    if (error) setError("");
  };

  return {
    url,
    loading,
    error,
    history,
    copiedId,
    inputRef,
    handleShorten,
    handleInputChange,
    copyToClipboard,
    clearHistory,
  };
}
