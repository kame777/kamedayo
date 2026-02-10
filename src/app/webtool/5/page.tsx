"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./PdfTool.module.css";
import HeroBanner from "../../components/HeroBanner";

/* ───────── Types ───────── */
type TabKey = "merge" | "split" | "extract";

type PdfFile = {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount: number;
};

type Tab = { key: TabKey; icon: string; label: string };

const TABS: Tab[] = [
  { key: "merge", icon: "📑", label: "PDF結合" },
  { key: "split", icon: "✂️", label: "PDF分割" },
  { key: "extract", icon: "📄", label: "ページ抽出" },
];

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ───────── Lazy load pdf-lib ───────── */
async function getPdfLib() {
  const { PDFDocument } = await import("pdf-lib");
  return { PDFDocument };
}

async function getPageCount(file: File): Promise<number> {
  const { PDFDocument } = await getPdfLib();
  const buf = await file.arrayBuffer();
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  return doc.getPageCount();
}

/* ───────── Component ───────── */
export default function PdfTool() {
  const [activeTab, setActiveTab] = useState<TabKey>("merge");
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("output.pdf");
  const [extractPages, setExtractPages] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* clean up blob url */
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  /* ── Reset when switching tabs ── */
  const switchTab = useCallback(
    (tab: TabKey) => {
      setActiveTab(tab);
      setFiles([]);
      setExtractPages("");
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(null);
    },
    [resultUrl],
  );

  /* ── Add files ── */
  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList).filter(
      (f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"),
    );
    const items: PdfFile[] = [];
    for (const f of arr) {
      try {
        const pages = await getPageCount(f);
        items.push({ id: uid(), file: f, name: f.name, size: f.size, pageCount: pages });
      } catch {
        items.push({ id: uid(), file: f, name: f.name, size: f.size, pageCount: 0 });
      }
    }
    setFiles((prev) => [...prev, ...items]);
  }, []);

  /* ── Drag & drop ── */
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) addFiles(e.target.files);
      e.target.value = "";
    },
    [addFiles],
  );

  /* ── Remove / Reorder ── */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const moveFile = useCallback((id: string, dir: -1 | 1) => {
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  }, []);

  /* ── Parse page range string  "1,3-5,8" → [0,2,3,4,7] (0-indexed) ── */
  const parsePages = useCallback(
    (input: string, maxPage: number): number[] => {
      const pages = new Set<number>();
      const parts = input.split(",").map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (part.includes("-")) {
          const [a, b] = part.split("-").map(Number);
          if (!isNaN(a) && !isNaN(b)) {
            const start = Math.max(1, Math.min(a, b));
            const end = Math.min(maxPage, Math.max(a, b));
            for (let i = start; i <= end; i++) pages.add(i - 1);
          }
        } else {
          const n = Number(part);
          if (!isNaN(n) && n >= 1 && n <= maxPage) pages.add(n - 1);
        }
      }
      return Array.from(pages).sort((a, b) => a - b);
    },
    [],
  );

  /* ── MERGE ── */
  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await getPdfLib();
      const merged = await PDFDocument.create();
      for (const f of files) {
        const buf = await f.file.arrayBuffer();
        const src = await PDFDocument.load(buf, { ignoreEncryption: true });
        const indices = src.getPageIndices();
        const pages = await merged.copyPages(src, indices);
        pages.forEach((p) => merged.addPage(p));
      }
      const bytes = await merged.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultName("merged.pdf");
    } catch (err) {
      alert("結合に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, resultUrl]);

  /* ── SPLIT ── */
  const handleSplit = useCallback(async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await getPdfLib();
      const buf = await files[0].file.arrayBuffer();
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const total = src.getPageCount();

      /* If only 1 page, just return it */
      if (total <= 1) {
        alert("このPDFは1ページのみです。分割できません。");
        setProcessing(false);
        return;
      }

      /* Split into individual pages and merge into one download for simplicity */
      /* We'll create a zip-like approach: download each page separately */
      for (let i = 0; i < total; i++) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(src, [i]);
        newDoc.addPage(page);
        const bytes = await newDoc.save();
        const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `page_${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        /* Small delay to prevent browser blocking */
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      alert("分割に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files]);

  /* ── EXTRACT ── */
  const handleExtract = useCallback(async () => {
    if (files.length !== 1 || !extractPages.trim()) return;
    setProcessing(true);
    try {
      const { PDFDocument } = await getPdfLib();
      const buf = await files[0].file.arrayBuffer();
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const indices = parsePages(extractPages, src.getPageCount());
      if (indices.length === 0) {
        alert("有効なページ番号を入力してください。");
        setProcessing(false);
        return;
      }
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(src, indices);
      pages.forEach((p) => newDoc.addPage(p));
      const bytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setResultName("extracted.pdf");
    } catch (err) {
      alert("抽出に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, extractPages, parsePages, resultUrl]);

  /* ── Download result ── */
  const downloadResult = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = resultName;
    a.click();
  }, [resultUrl, resultName]);

  const totalPages = files.reduce((s, f) => s + f.pageCount, 0);
  const canProcess =
    (activeTab === "merge" && files.length >= 2) ||
    (activeTab === "split" && files.length === 1 && files[0].pageCount > 1) ||
    (activeTab === "extract" && files.length === 1 && extractPages.trim().length > 0);

  return (
    <>
      <HeroBanner
        badge="📄 PDF Tool"
        title="PDFツール"
        subtitle="PDF結合・分割・ページ抽出をブラウザ上で"
      />

      <main className={styles.container}>
        {/* Tab selector */}
        <div className={styles.tabBar}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ""}`}
              onClick={() => switchTab(tab.key)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <div className={styles.tabDesc}>
          {activeTab === "merge" && (
            <p>複数のPDFファイルを1つに結合します。ドラッグで順序を変更できます。</p>
          )}
          {activeTab === "split" && (
            <p>PDFの各ページを個別のファイルに分割してダウンロードします。</p>
          )}
          {activeTab === "extract" && (
            <p>指定したページ番号のみを抽出して新しいPDFを作成します。</p>
          )}
        </div>

        {/* Drop zone */}
        <div
          className={`${styles.dropZone} ${isDragging ? styles.dropZoneActive : ""} ${files.length > 0 ? styles.dropZoneCompact : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple={activeTab === "merge"}
            className={styles.fileInput}
            onChange={handleInputChange}
          />
          <span className={styles.dropIcon}>📄</span>
          <p className={styles.dropText}>
            PDFをドラッグ＆ドロップ、またはクリックして選択
          </p>
          <p className={styles.dropHint}>
            {activeTab === "merge"
              ? "複数ファイル選択可能"
              : "1つのPDFファイルを選択"}
          </p>
        </div>

        {/* File list */}
        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((f, idx) => (
              <div key={f.id} className={styles.fileCard}>
                <div className={styles.fileIcon}>📄</div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileMeta}>
                    {formatBytes(f.size)} · {f.pageCount}ページ
                  </span>
                </div>
                <div className={styles.fileActions}>
                  {activeTab === "merge" && (
                    <>
                      <button
                        className={styles.moveBtn}
                        disabled={idx === 0}
                        onClick={() => moveFile(f.id, -1)}
                        title="上に移動"
                      >
                        ▲
                      </button>
                      <button
                        className={styles.moveBtn}
                        disabled={idx === files.length - 1}
                        onClick={() => moveFile(f.id, 1)}
                        title="下に移動"
                      >
                        ▼
                      </button>
                    </>
                  )}
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeFile(f.id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Stats */}
            <div className={styles.fileSummary}>
              {files.length}ファイル · 合計{totalPages}ページ
            </div>
          </div>
        )}

        {/* Extract pages input */}
        {activeTab === "extract" && files.length === 1 && (
          <div className={styles.extractSection}>
            <label className={styles.extractLabel}>
              抽出するページ番号（例: 1,3-5,8）
            </label>
            <input
              type="text"
              value={extractPages}
              onChange={(e) => setExtractPages(e.target.value)}
              placeholder="1,3-5,8"
              className={styles.extractInput}
            />
            <p className={styles.extractHint}>
              合計 {files[0].pageCount} ページ中から抽出
            </p>
          </div>
        )}

        {/* Action buttons */}
        {files.length > 0 && (
          <div className={styles.actionBar}>
            <button
              className={styles.button}
              onClick={() => {
                setFiles([]);
                if (resultUrl) URL.revokeObjectURL(resultUrl);
                setResultUrl(null);
                setExtractPages("");
              }}
            >
              🗑️ クリア
            </button>

            {!resultUrl && (
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={!canProcess || processing}
                onClick={
                  activeTab === "merge"
                    ? handleMerge
                    : activeTab === "split"
                      ? handleSplit
                      : handleExtract
                }
              >
                {processing ? (
                  <>
                    <span className={styles.spinner} /> 処理中...
                  </>
                ) : activeTab === "merge" ? (
                  "📑 結合する"
                ) : activeTab === "split" ? (
                  "✂️ 分割する"
                ) : (
                  "📄 抽出する"
                )}
              </button>
            )}

            {resultUrl && (
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={downloadResult}
              >
                ⬇️ ダウンロード
              </button>
            )}
          </div>
        )}

        {/* Features section */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🔒</span>
            <h3>完全ローカル処理</h3>
            <p>すべてブラウザ上で処理。PDFはサーバーにアップロードされません。</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📑</span>
            <h3>PDF結合</h3>
            <p>複数のPDFを1つにまとめます。順序変更も簡単。</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>✂️</span>
            <h3>PDF分割 & 抽出</h3>
            <p>ページごとに分割、または必要なページだけを抽出。</p>
          </div>
        </div>
      </main>
    </>
  );
}
