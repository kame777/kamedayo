import { useState, useCallback, useEffect, useRef } from "react";
import { ShortenedEntry, ApiSuccessResponse, ApiErrorResponse } from "../types";
import { useToast } from "../../../hooks/useToast";

const STORAGE_KEY = "kamedayo:urlShortenerHistory";

const ERROR_MESSAGES: Record<string, string> = {
  RATE_LIMIT: "リクエストが多すぎます。しばらくしてから再試行してください。",
  INVALID_URL: "有効なURLを入力してください。",
  API_ERROR: "短縮URLの生成に失敗しました。しばらくしてから再試行してください。",
  SERVER_ERROR: "サーバーエラーが発生しました。しばらくしてから再試行してください。",
};

function isPrivateHost(hostname: string): boolean {
  if (["localhost", "0.0.0.0", "::1"].includes(hostname)) return true;
  const ipv4 = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(hostname);
  if (!ipv4) return false;
  const [, a, b] = ipv4.map(Number);
  return (
    a === 127 ||
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function validateUrl(input: string): string | null {
  try {
    const parsed = new URL(input);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "有効なURL（https://...）を入力してください。";
    }
    if (isPrivateHost(parsed.hostname)) {
      return "内部ネットワークのURLは短縮できません。";
    }
    return null;
  } catch {
    return "有効なURL（https://...）を入力してください。";
  }
}

export function useUrlShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<ShortenedEntry[]>([]);
  const { toast, showToast } = useToast();
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

    const validationError = validateUrl(trimmed);
    if (validationError) {
      setError(validationError);
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

      const data: ApiSuccessResponse | ApiErrorResponse = await res.json();

      if (!res.ok) {
        const errData = data as ApiErrorResponse;
        const message = errData.code
          ? (ERROR_MESSAGES[errData.code] ?? errData.error)
          : errData.error;
        setError(message || "短縮に失敗しました。もう一度お試しください。");
        return;
      }

      const successData = data as ApiSuccessResponse;
      const entry: ShortenedEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        originalURL: trimmed,
        shortURL: successData.shortURL,
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

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast("コピーしました！");
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  }, [showToast]);

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
    toast,
    inputRef,
    handleShorten,
    handleInputChange,
    copyToClipboard,
    clearHistory,
  };
}
