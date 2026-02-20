"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./PdfTool.module.css";
import HeroBanner from "../../components/HeroBanner";
import { useTabIndicator } from '../../hooks/useTabIndicator';


/* ═══════════════════ Types ═══════════════════ */
type TabKey = "merge" | "split" | "extract" | "compress" | "img2pdf" | "pdf2img";
type CompressLevel = "low" | "medium" | "high";

type FileEntry = {
  id: string;
  file: File;
  name: string;
  size: number;
  pageCount?: number;
};

/* ═══════════════════ Constants ═══════════════════ */
const TABS: { key: TabKey; icon: string; label: string }[] = [
  { key: "merge", icon: "📑", label: "結合" },
  { key: "split", icon: "✂️", label: "分割" },
  { key: "extract", icon: "📄", label: "抽出" },
  { key: "compress", icon: "🗜️", label: "圧縮" },
  { key: "img2pdf", icon: "🖼️", label: "画像→PDF" },
  { key: "pdf2img", icon: "📷", label: "PDF→画像" },
];

const COMPRESS_OPTIONS: { value: CompressLevel; label: string; desc: string }[] = [
  { value: "low", label: "低クオリティ", desc: "高圧縮" },
  { value: "medium", label: "中クオリティ", desc: "標準圧縮" },
  { value: "high", label: "高クオリティ", desc: "低圧縮" },
];

const PDF_ACCEPT = "application/pdf,.pdf";
const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/gif,image/bmp,.jpg,.jpeg,.png,.webp,.gif,.bmp";
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"];

/* ═══════════════════ Helpers ═══════════════════ */
function fmt(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ═══════════════════ Lazy loaders ═══════════════════ */
async function getPdfLib() {
  const { PDFDocument } = await import("pdf-lib");
  return PDFDocument;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _pdfjs: any = null;
async function getPdfJs() {
  if (!_pdfjs) {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    _pdfjs = pdfjsLib;
  }
  return _pdfjs as typeof import("pdfjs-dist");
}

async function getJSZip() {
  const mod = await import("jszip");
  return mod.default;
}

async function getPageCount(file: File): Promise<number> {
  const PDFDocument = await getPdfLib();
  const buf = await file.arrayBuffer();
  const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
  return doc.getPageCount();
}

/* ═══════════════════ Image embed helper ═══════════════════ */
async function imageFileToEmbedData(
  file: File,
): Promise<{ data: Uint8Array; width: number; height: number; format: "jpg" | "png" }> {
  const isJpeg = file.type === "image/jpeg";
  const isPng = file.type === "image/png";

  if (isJpeg || isPng) {
    // Read directly for JPEG/PNG — no canvas conversion needed
    const dims = await new Promise<{ width: number; height: number }>((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => { URL.revokeObjectURL(url); resolve({ width: img.naturalWidth, height: img.naturalHeight }); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("画像読み込み失敗")); };
      img.src = url;
    });
    const buf = await file.arrayBuffer();
    return { data: new Uint8Array(buf), width: dims.width, height: dims.height, format: isJpeg ? "jpg" : "png" };
  }

  // WebP / GIF / BMP / other → convert to PNG via canvas
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0);
      c.toBlob(async (blob) => {
        URL.revokeObjectURL(url);
        if (!blob) { reject(new Error("変換失敗")); return; }
        resolve({ data: new Uint8Array(await blob.arrayBuffer()), width: img.naturalWidth, height: img.naturalHeight, format: "png" });
      }, "image/png");
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("画像読み込み失敗")); };
    img.src = url;
  });
}

/* ═══════════════════ PDF Compress ═══════════════════ */
async function compressPdf(file: File, level: CompressLevel): Promise<Blob> {
  const pdfjsLib = await getPdfJs();
  const PDFDocument = await getPdfLib();

  const cfg = {
    low: { s: 1.0, q: 0.3 },
    medium: { s: 1.5, q: 0.6 },
    high: { s: 2.0, q: 0.82 },
  };
  const { s, q } = cfg[level];

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
  }).promise;
  const doc = await PDFDocument.create();

  for (let i = 1; i <= pdf.numPages; i++) {
    const pg = await pdf.getPage(i);
    const orig = pg.getViewport({ scale: 1 });
    const vp = pg.getViewport({ scale: s });

    const c = document.createElement("canvas");
    c.width = Math.floor(vp.width);
    c.height = Math.floor(vp.height);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await pg.render({ canvasContext: c.getContext("2d")!, viewport: vp } as any).promise;

    const blob = await new Promise<Blob>((r) =>
      c.toBlob((b) => r(b!), "image/jpeg", q),
    );
    const img = await doc.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const page = doc.addPage([orig.width, orig.height]);
    page.drawImage(img, {
      x: 0,
      y: 0,
      width: orig.width,
      height: orig.height,
    });
  }

  return new Blob([new Uint8Array(await doc.save())], {
    type: "application/pdf",
  });
}

/* ═══════════════════ Component ═══════════════════ */
export default function PdfTool() {
  useEffect(() => { document.title = 'kamedayo | PDFツール'; }, []);
  const [tab, setTab] = useState<TabKey>("merge");
  const { containerRef: tabBarRef, indicatorStyle: tabIndicatorStyle } = useTabIndicator(tab);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("output.pdf");
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [extractPages, setExtractPages] = useState("");
  const [compressLevel, setCompressLevel] = useState<CompressLevel>("medium");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const clearResult = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultSize(null);
  }, [resultUrl]);

  /* ── Tab switch ── */
  const switchTab = useCallback(
    (t: TabKey) => {
      setTab(t);
      setFiles([]);
      setExtractPages("");
      clearResult();
    },
    [clearResult],
  );

  /* ── Add files ── */
  const addFiles = useCallback(
    async (fileList: FileList | File[]) => {
      clearResult(); // #109: clear previous result when new files are loaded

      const isImg2Pdf = tab === "img2pdf";
      const arr = Array.from(fileList).filter((f) => {
        if (isImg2Pdf) {
          return IMAGE_TYPES.includes(f.type) || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(f.name);
        }
        return f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
      });

      const items: FileEntry[] = [];
      for (const f of arr) {
        let pageCount: number | undefined;
        if (!isImg2Pdf) {
          try {
            pageCount = await getPageCount(f);
          } catch {
            pageCount = 0;
          }
        }
        items.push({ id: uid(), file: f, name: f.name, size: f.size, pageCount });
      }

      if (tab === "merge" || tab === "img2pdf") {
        setFiles((prev) => [...prev, ...items]);
      } else {
        setFiles(items.slice(0, 1));
      }
    },
    [tab, clearResult],
  );

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

  /* ── Parse page range ── */
  const parsePages = useCallback(
    (input: string, maxPage: number): number[] => {
      const pages = new Set<number>();
      const parts = input
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
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
      const PDFDocument = await getPdfLib();
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
      clearResult();
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultName("merged.pdf");
    } catch (err) {
      alert("結合に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, clearResult]);

  /* ── SPLIT (ZIP download) ── */
  const handleSplit = useCallback(async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
      const PDFDocument = await getPdfLib();
      const JSZip = await getJSZip();
      const buf = await files[0].file.arrayBuffer();
      const src = await PDFDocument.load(buf, { ignoreEncryption: true });
      const total = src.getPageCount();

      if (total <= 1) {
        alert("このPDFは1ページのみです。分割できません。");
        setProcessing(false);
        return;
      }

      const zip = new JSZip();
      for (let i = 0; i < total; i++) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(src, [i]);
        newDoc.addPage(page);
        const bytes = await newDoc.save();
        zip.file(`page_${i + 1}.pdf`, bytes);
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      clearResult();
      setResultUrl(URL.createObjectURL(zipBlob));
      setResultSize(zipBlob.size);
      const baseName = files[0].name.replace(/\.pdf$/i, "");
      setResultName(`${baseName}_split.zip`);
    } catch (err) {
      alert("分割に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, clearResult]);

  /* ── EXTRACT ── */
  const handleExtract = useCallback(async () => {
    if (files.length !== 1 || !extractPages.trim()) return;
    setProcessing(true);
    try {
      const PDFDocument = await getPdfLib();
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
      clearResult();
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultName("extracted.pdf");
    } catch (err) {
      alert("抽出に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, extractPages, parsePages, clearResult]);

  /* ── COMPRESS ── */
  const handleCompress = useCallback(async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
      const blob = await compressPdf(files[0].file, compressLevel);
      clearResult();
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultName("compressed.pdf");
    } catch (err) {
      alert("圧縮に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, compressLevel, clearResult]);

  /* ── IMG2PDF ── */
  const handleImg2Pdf = useCallback(async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const PDFDocument = await getPdfLib();
      const doc = await PDFDocument.create();
      for (const f of files) {
        const { data, width, height, format } = await imageFileToEmbedData(f.file);
        const img = format === "jpg" ? await doc.embedJpg(data) : await doc.embedPng(data);
        const page = doc.addPage([width, height]);
        page.drawImage(img, { x: 0, y: 0, width, height });
      }
      const bytes = await doc.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
      clearResult();
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultName("images.pdf");
    } catch (err) {
      alert("変換に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, clearResult]);

  /* ── PDF2IMG ── */
  const handlePdf2Img = useCallback(async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
      const pdfjsLib = await getPdfJs();
      const JSZip = await getJSZip();
      const pdf = await pdfjsLib.getDocument({
        data: new Uint8Array(await files[0].file.arrayBuffer()),
      }).promise;

      const zip = new JSZip();
      for (let i = 1; i <= pdf.numPages; i++) {
        const pg = await pdf.getPage(i);
        const vp = pg.getViewport({ scale: 2.0 });
        const c = document.createElement("canvas");
        c.width = Math.floor(vp.width);
        c.height = Math.floor(vp.height);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await pg.render({ canvasContext: c.getContext("2d")!, viewport: vp } as any).promise;
        const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), "image/png"));
        zip.file(`page_${i}.png`, await blob.arrayBuffer());
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      clearResult();
      setResultUrl(URL.createObjectURL(zipBlob));
      setResultSize(zipBlob.size);
      const baseName = files[0].name.replace(/\.pdf$/i, "");
      setResultName(`${baseName}_images.zip`);
    } catch (err) {
      alert("変換に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally {
      setProcessing(false);
    }
  }, [files, clearResult]);

  /* ── Download result ── */
  const downloadResult = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = resultName;
    a.click();
  }, [resultUrl, resultName]);

  /* ── Derived ── */
  const multiple = tab === "merge" || tab === "img2pdf";
  const isImageTab = tab === "img2pdf";
  const totalPages = files.reduce((s, f) => s + (f.pageCount ?? 0), 0);

  const canProcess = (() => {
    switch (tab) {
      case "merge":    return files.length >= 2;
      case "split":    return files.length === 1 && (files[0].pageCount ?? 0) > 1;
      case "extract":  return files.length === 1 && extractPages.trim().length > 0;
      case "compress": return files.length === 1;
      case "img2pdf":  return files.length >= 1;
      case "pdf2img":  return files.length === 1;
    }
  })();

  const handleAction = (() => {
    switch (tab) {
      case "merge":    return handleMerge;
      case "split":    return handleSplit;
      case "extract":  return handleExtract;
      case "compress": return handleCompress;
      case "img2pdf":  return handleImg2Pdf;
      case "pdf2img":  return handlePdf2Img;
    }
  })();

  const actionLabel = (() => {
    switch (tab) {
      case "merge":    return "📑 結合する";
      case "split":    return "✂️ 分割する";
      case "extract":  return "📄 抽出する";
      case "compress": return "🗜️ 圧縮する";
      case "img2pdf":  return "🖼️ PDF変換する";
      case "pdf2img":  return "📷 画像変換する";
    }
  })();

  return (
    <>
      <HeroBanner
        badge="📄 PDF Tool"
        title="PDFツール"
        subtitle="PDF結合・分割・圧縮をブラウザ上で"
      />

      <main className={styles.container}>
        {/* ── Tabs ── */}
        <div className={styles.tabBar} ref={tabBarRef}>
          <div className={styles.tabIndicator} style={tabIndicatorStyle} />
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ""}`}
              onClick={() => switchTab(t.key)}
              data-active={tab === t.key ? "true" : undefined}
            >
              <span className={styles.tabIcon}>{t.icon}</span>
              <span className={styles.tabLabel}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Tab description ── */}
        <div className={styles.tabDesc}>
          {tab === "merge" && (
            <p>複数のPDFファイルを1つに結合します。ドラッグで順序を変更できます。</p>
          )}
          {tab === "split" && (
            <p>PDFの各ページを個別のファイルに分割してZIPでダウンロードします。</p>
          )}
          {tab === "extract" && (
            <p>指定したページ番号のみを抽出して新しいPDFを作成します。</p>
          )}
          {tab === "compress" && (
            <p>PDFファイルのサイズを圧縮します。圧縮レベルを選択できます。</p>
          )}
          {tab === "img2pdf" && (
            <p>画像ファイル（JPEG・PNG・WebP・GIF）をPDFに変換します。複数枚まとめて変換可能です。</p>
          )}
          {tab === "pdf2img" && (
            <p>PDFの各ページをPNG画像に変換してZIPでダウンロードします。</p>
          )}
        </div>

        {/* ── Compress level selector ── */}
        {tab === "compress" && (
          <div className={styles.compressOptions}>
            {COMPRESS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`${styles.compressBtn} ${compressLevel === opt.value ? styles.compressBtnActive : ""}`}
                onClick={() => setCompressLevel(opt.value)}
              >
                <span className={styles.compressLabel}>{opt.label}</span>
                <span className={styles.compressDesc}>{opt.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* ── Drop zone ── */}
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
            accept={isImageTab ? IMAGE_ACCEPT : PDF_ACCEPT}
            multiple={multiple}
            className={styles.fileInput}
            onChange={handleInputChange}
          />
          <span className={styles.dropIcon}>{isImageTab ? "🖼️" : "📄"}</span>
          <p className={styles.dropText}>
            {isImageTab
              ? "画像をドラッグ＆ドロップ、またはクリックして選択"
              : "PDFをドラッグ＆ドロップ、またはクリックして選択"}
          </p>
          <p className={styles.dropHint}>
            {tab === "merge"
              ? "複数ファイル選択可能"
              : tab === "img2pdf"
              ? "JPEG・PNG・WebP・GIF対応（複数選択可）"
              : "1つのPDFファイルを選択"}
          </p>
        </div>

        {/* ── File list ── */}
        {files.length > 0 && (
          <div className={styles.fileList}>
            {files.map((f, idx) => (
              <div key={f.id} className={styles.fileCard}>
                <div className={styles.fileIcon}>
                  {f.file.type.startsWith("image/") ? "🖼️" : "📄"}
                </div>
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{f.name}</span>
                  <span className={styles.fileMeta}>
                    {fmt(f.size)}
                    {f.pageCount != null && ` · ${f.pageCount}ページ`}
                  </span>
                </div>
                <div className={styles.fileActions}>
                  {(tab === "merge" || tab === "img2pdf") && (
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
            {tab === "merge" && (
              <div className={styles.fileSummary}>
                {files.length}ファイル · 合計{totalPages}ページ
              </div>
            )}
            {tab === "img2pdf" && (
              <div className={styles.fileSummary}>
                {files.length}ファイル
              </div>
            )}
          </div>
        )}

        {/* ── Extract pages input ── */}
        {tab === "extract" && files.length === 1 && (
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

        {/* ── Compress result ── */}
        {tab === "compress" &&
          resultUrl &&
          resultSize != null &&
          files.length === 1 && (
            <div className={styles.compressResult}>
              <div className={styles.compressResultRow}>
                <span>元のサイズ</span>
                <strong>{fmt(files[0].size)}</strong>
              </div>
              <div className={styles.compressResultRow}>
                <span>圧縮後</span>
                <strong className={styles.greenText}>
                  {fmt(resultSize)}
                </strong>
              </div>
              <div className={styles.compressResultRow}>
                <span>削減率</span>
                <strong className={styles.greenText}>
                  {Math.round((1 - resultSize / files[0].size) * 100)}%
                </strong>
              </div>
            </div>
          )}

        {/* ── Action buttons ── */}
        {files.length > 0 && (
          <div className={styles.actionBar}>
            <button
              className={styles.button}
              onClick={() => {
                setFiles([]);
                clearResult();
                setExtractPages("");
              }}
            >
              🗑️ クリア
            </button>

            {!resultUrl && (
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={!canProcess || processing}
                onClick={handleAction}
              >
                {processing ? (
                  <>
                    <span className={styles.spinner} /> 処理中...
                  </>
                ) : (
                  actionLabel
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

        {/* ── Features ── */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🔒</span>
            <h3>完全ローカル処理</h3>
            <p>
              すべてブラウザ上で処理。ファイルはサーバーにアップロードされません。
            </p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🗜️</span>
            <h3>PDF圧縮</h3>
            <p>3段階の品質レベルでPDFファイルサイズを削減。</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>✂️</span>
            <h3>結合・分割・抽出</h3>
            <p>複数PDFの結合、ページごと分割、必要ページの抽出。</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🖼️</span>
            <h3>画像変換</h3>
            <p>画像からPDF作成、PDFをPNG画像に変換。</p>
          </div>
        </div>
      </main>
    </>
  );
}
