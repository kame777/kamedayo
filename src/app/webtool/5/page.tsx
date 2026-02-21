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

/* ═══════════════════ SVG Icons ═══════════════════ */
type IconProps = { size?: number };

const MergeIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="6" r="2" />
    <circle cx="18" cy="6" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M6 8v3a6 6 0 0 0 6 6" />
    <path d="M18 8v3a6 6 0 0 1-6 6" />
  </svg>
);

const SplitIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="6" cy="18" r="2.5" />
    <path d="M20 4L8.5 15.5" />
    <path d="M14.5 14.5L20 20" />
    <path d="M8.5 8.5L12 12" />
  </svg>
);

const ExtractIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <rect x="8" y="12" width="8" height="4" rx="0.5" strokeDasharray="1.5 1" />
  </svg>
);

const CompressIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="4 14 4 20 10 20" />
    <polyline points="20 10 20 4 14 4" />
    <line x1="14" y1="10" x2="20.5" y2="3.5" />
    <line x1="3.5" y1="20.5" x2="10" y2="14" />
  </svg>
);

const ImgToPdfIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const PdfToImgIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <polyline points="13 2 13 9 20 9" />
    <line x1="12" y1="13" x2="12" y2="18" />
    <polyline points="9 16 12 19 15 16" />
  </svg>
);

const DocumentIcon = ({ size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const ImageFrameIcon = ({ size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TrashIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const DownloadIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const LockIcon = ({ size = 28 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ChevronUpIcon = ({ size = 12 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = ({ size = 12 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const CloseIcon = ({ size = 12 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ── Composite icon selectors ── */
function TabIcon({ tabKey, size = 18 }: { tabKey: TabKey; size?: number }) {
  switch (tabKey) {
    case "merge":    return <MergeIcon size={size} />;
    case "split":    return <SplitIcon size={size} />;
    case "extract":  return <ExtractIcon size={size} />;
    case "compress": return <CompressIcon size={size} />;
    case "img2pdf":  return <ImgToPdfIcon size={size} />;
    case "pdf2img":  return <PdfToImgIcon size={size} />;
  }
}

function FeatureIcon({ icon, size = 28 }: { icon: "lock" | "compress" | "split" | "image"; size?: number }) {
  switch (icon) {
    case "lock":    return <LockIcon size={size} />;
    case "compress":return <CompressIcon size={size} />;
    case "split":   return <SplitIcon size={size} />;
    case "image":   return <ImgToPdfIcon size={size} />;
  }
}

/* ═══════════════════ Consolidated Config ═══════════════════ */
const TAB_DEFS: Array<{ key: TabKey; label: string; desc: string; actionLabel: string }> = [
  { key: "merge",    label: "結合",     desc: "複数のPDFファイルを1つに結合します。ドラッグで順序を変更できます。",                       actionLabel: "結合する" },
  { key: "split",    label: "分割",     desc: "PDFの各ページを個別のファイルに分割してZIPでダウンロードします。",                        actionLabel: "分割する" },
  { key: "extract",  label: "抽出",     desc: "指定したページ番号のみを抽出して新しいPDFを作成します。",                                actionLabel: "抽出する" },
  { key: "compress", label: "圧縮",     desc: "PDFファイルのサイズを圧縮します。圧縮レベルを選択できます。",                             actionLabel: "圧縮する" },
  { key: "img2pdf",  label: "画像→PDF", desc: "画像ファイル（JPEG・PNG・WebP・GIF）をPDFに変換します。複数枚まとめて変換可能です。",      actionLabel: "PDF変換する" },
  { key: "pdf2img",  label: "PDF→画像", desc: "PDFの各ページをPNG画像に変換してZIPでダウンロードします。",                             actionLabel: "画像変換する" },
];

const FEATURE_DEFS: Array<{ icon: "lock" | "compress" | "split" | "image"; title: string; desc: string }> = [
  { icon: "lock", title: "完全ローカル処理", desc: "すべてブラウザ上で処理。ファイルはサーバーにアップロードされません。" },
];

const COMPRESS_OPTIONS: { value: CompressLevel; label: string; desc: string }[] = [
  { value: "low",    label: "低クオリティ", desc: "高圧縮" },
  { value: "medium", label: "中クオリティ", desc: "標準圧縮" },
  { value: "high",   label: "高クオリティ", desc: "低圧縮" },
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

  // WebP / GIF / BMP → convert to PNG via canvas
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

  const cfg = { low: { s: 1.0, q: 0.3 }, medium: { s: 1.5, q: 0.6 }, high: { s: 2.0, q: 0.82 } };
  const { s, q } = cfg[level];

  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
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
    const blob = await new Promise<Blob>((r) => c.toBlob((b) => r(b!), "image/jpeg", q));
    const img = await doc.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const page = doc.addPage([orig.width, orig.height]);
    page.drawImage(img, { x: 0, y: 0, width: orig.width, height: orig.height });
  }

  return new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" });
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

  const currentTabDef = TAB_DEFS.find(t => t.key === tab)!;

  useEffect(() => {
    return () => { if (resultUrl) URL.revokeObjectURL(resultUrl); };
  }, [resultUrl]);

  const clearResult = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultSize(null);
  }, [resultUrl]);

  /* ── Tab switch ── */
  const switchTab = useCallback((t: TabKey) => {
    setTab(t);
    setFiles([]);
    setExtractPages("");
    clearResult();
  }, [clearResult]);

  /* ── Add files ── */
  const addFiles = useCallback(async (fileList: FileList | File[]) => {
    clearResult();

    const isImg2Pdf = tab === "img2pdf";
    const arr = Array.from(fileList).filter((f) => {
      if (isImg2Pdf) return IMAGE_TYPES.includes(f.type) || /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(f.name);
      return f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    });

    const items: FileEntry[] = [];
    for (const f of arr) {
      let pageCount: number | undefined;
      if (!isImg2Pdf) {
        try { pageCount = await getPageCount(f); } catch { pageCount = 0; }
      }
      items.push({ id: uid(), file: f, name: f.name, size: f.size, pageCount });
    }

    if (tab === "merge" || tab === "img2pdf") {
      setFiles((prev) => [...prev, ...items]);
    } else {
      setFiles(items.slice(0, 1));
    }
  }, [tab, clearResult]);

  /* ── Drag & drop ── */
  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
  }, [addFiles]);
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files);
    e.target.value = "";
  }, [addFiles]);

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
  const parsePages = useCallback((input: string, maxPage: number): number[] => {
    const pages = new Set<number>();
    for (const part of input.split(",").map(s => s.trim()).filter(Boolean)) {
      if (part.includes("-")) {
        const [a, b] = part.split("-").map(Number);
        if (!isNaN(a) && !isNaN(b)) {
          for (let i = Math.max(1, Math.min(a, b)); i <= Math.min(maxPage, Math.max(a, b)); i++) pages.add(i - 1);
        }
      } else {
        const n = Number(part);
        if (!isNaN(n) && n >= 1 && n <= maxPage) pages.add(n - 1);
      }
    }
    return Array.from(pages).sort((a, b) => a - b);
  }, []);

  /* ── MERGE ── */
  const handleMerge = useCallback(async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const PDFDocument = await getPdfLib();
      const merged = await PDFDocument.create();
      for (const f of files) {
        const src = await PDFDocument.load(await f.file.arrayBuffer(), { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const blob = new Blob([new Uint8Array(await merged.save())], { type: "application/pdf" });
      clearResult();
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultName("merged.pdf");
    } catch (err) {
      alert("結合に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally { setProcessing(false); }
  }, [files, clearResult]);

  /* ── SPLIT (ZIP) ── */
  const handleSplit = useCallback(async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
      const PDFDocument = await getPdfLib();
      const JSZip = await getJSZip();
      const src = await PDFDocument.load(await files[0].file.arrayBuffer(), { ignoreEncryption: true });
      const total = src.getPageCount();
      if (total <= 1) { alert("このPDFは1ページのみです。分割できません。"); setProcessing(false); return; }
      const zip = new JSZip();
      for (let i = 0; i < total; i++) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(src, [i]);
        newDoc.addPage(page);
        zip.file(`page_${i + 1}.pdf`, await newDoc.save());
      }
      const zipBlob = await zip.generateAsync({ type: "blob" });
      clearResult();
      setResultUrl(URL.createObjectURL(zipBlob));
      setResultSize(zipBlob.size);
      setResultName(`${files[0].name.replace(/\.pdf$/i, "")}_split.zip`);
    } catch (err) {
      alert("分割に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally { setProcessing(false); }
  }, [files, clearResult]);

  /* ── EXTRACT ── */
  const handleExtract = useCallback(async () => {
    if (files.length !== 1 || !extractPages.trim()) return;
    setProcessing(true);
    try {
      const PDFDocument = await getPdfLib();
      const src = await PDFDocument.load(await files[0].file.arrayBuffer(), { ignoreEncryption: true });
      const indices = parsePages(extractPages, src.getPageCount());
      if (indices.length === 0) { alert("有効なページ番号を入力してください。"); setProcessing(false); return; }
      const newDoc = await PDFDocument.create();
      const pages = await newDoc.copyPages(src, indices);
      pages.forEach((p) => newDoc.addPage(p));
      const blob = new Blob([new Uint8Array(await newDoc.save())], { type: "application/pdf" });
      clearResult();
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultName("extracted.pdf");
    } catch (err) {
      alert("抽出に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally { setProcessing(false); }
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
    } finally { setProcessing(false); }
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
      const blob = new Blob([new Uint8Array(await doc.save())], { type: "application/pdf" });
      clearResult();
      setResultUrl(URL.createObjectURL(blob));
      setResultSize(blob.size);
      setResultName("images.pdf");
    } catch (err) {
      alert("変換に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally { setProcessing(false); }
  }, [files, clearResult]);

  /* ── PDF2IMG ── */
  const handlePdf2Img = useCallback(async () => {
    if (files.length !== 1) return;
    setProcessing(true);
    try {
      const pdfjsLib = await getPdfJs();
      const JSZip = await getJSZip();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await files[0].file.arrayBuffer()) }).promise;
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
      setResultName(`${files[0].name.replace(/\.pdf$/i, "")}_images.zip`);
    } catch (err) {
      alert("変換に失敗しました: " + (err instanceof Error ? err.message : "不明なエラー"));
    } finally { setProcessing(false); }
  }, [files, clearResult]);

  /* ── Download ── */
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

  return (
    <>
      <HeroBanner
        badge={<><DocumentIcon size={14} /> PDF Tool</>}
        title="PDFツール"
        subtitle="PDF結合・分割・圧縮をブラウザ上で"
      />

      <main className={styles.container}>
        {/* ── Tabs ── */}
        <div className={styles.tabBar} ref={tabBarRef}>
          <div className={styles.tabIndicator} style={tabIndicatorStyle} />
          {TAB_DEFS.map((t) => (
            <button
              key={t.key}
              className={`${styles.tabBtn} ${tab === t.key ? styles.tabBtnActive : ""}`}
              onClick={() => switchTab(t.key)}
              data-active={tab === t.key ? "true" : undefined}
              title={t.label}
            >
              <TabIcon tabKey={t.key} size={17} />
              <span className={styles.tabLabel}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── Mobile active mode indicator ── */}
        <div className={styles.mobileMode}>
          <TabIcon tabKey={tab} size={15} />
          <span>{currentTabDef.label}</span>
        </div>

        {/* ── Tab description ── */}
        <div className={styles.tabDesc}>
          <p>{currentTabDef.desc}</p>
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
          <span className={styles.dropIcon}>
            {isImageTab ? <ImageFrameIcon size={40} /> : <DocumentIcon size={40} />}
          </span>
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
                  {f.file.type.startsWith("image/")
                    ? <ImageFrameIcon size={26} />
                    : <DocumentIcon size={26} />}
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
                        <ChevronUpIcon size={11} />
                      </button>
                      <button
                        className={styles.moveBtn}
                        disabled={idx === files.length - 1}
                        onClick={() => moveFile(f.id, 1)}
                        title="下に移動"
                      >
                        <ChevronDownIcon size={11} />
                      </button>
                    </>
                  )}
                  <button className={styles.removeBtn} onClick={() => removeFile(f.id)} title="削除">
                    <CloseIcon size={11} />
                  </button>
                </div>
              </div>
            ))}
            {(tab === "merge" || tab === "img2pdf") && (
              <div className={styles.fileSummary}>
                {files.length}ファイル{tab === "merge" ? ` · 合計${totalPages}ページ` : ""}
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
            <p className={styles.extractHint}>合計 {files[0].pageCount} ページ中から抽出</p>
          </div>
        )}

        {/* ── Compress result ── */}
        {tab === "compress" && resultUrl && resultSize != null && files.length === 1 && (
          <div className={styles.compressResult}>
            <div className={styles.compressResultRow}>
              <span>元のサイズ</span>
              <strong>{fmt(files[0].size)}</strong>
            </div>
            <div className={styles.compressResultRow}>
              <span>圧縮後</span>
              <strong className={styles.greenText}>{fmt(resultSize)}</strong>
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
              onClick={() => { setFiles([]); clearResult(); setExtractPages(""); }}
            >
              <TrashIcon size={15} />
              クリア
            </button>

            {!resultUrl && (
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={!canProcess || processing}
                onClick={handleAction}
              >
                {processing ? (
                  <><span className={styles.spinner} /> 処理中...</>
                ) : (
                  <><TabIcon tabKey={tab} size={15} /> {currentTabDef.actionLabel}</>
                )}
              </button>
            )}

            {resultUrl && (
              <button
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={downloadResult}
              >
                <DownloadIcon size={15} />
                ダウンロード
              </button>
            )}
          </div>
        )}

        {/* ── Features ── */}
        <div className={styles.features}>
          {FEATURE_DEFS.map((f) => (
            <div key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>
                <FeatureIcon icon={f.icon} size={28} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
