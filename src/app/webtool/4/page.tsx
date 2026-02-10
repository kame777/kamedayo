"use client";

import React, { useState, useCallback, useRef } from "react";
import styles from "./ImageConverter.module.css";
import HeroBanner from "../../components/HeroBanner";

/* ───────── Types ───────── */
type OutputFormat = "png" | "jpeg" | "webp" | "bmp";

type FileItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  preview: string;
  converted?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  status: "pending" | "converting" | "done" | "error";
  error?: string;
};

const FORMAT_OPTIONS: { value: OutputFormat; label: string; mime: string }[] = [
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "jpeg", label: "JPG / JPEG", mime: "image/jpeg" },
  { value: "webp", label: "WebP", mime: "image/webp" },
  { value: "bmp", label: "BMP", mime: "image/bmp" },
];

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml,image/avif,image/tiff";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ───────── Component ───────── */
export default function ImageConverter() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(92);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLossy = outputFormat === "jpeg" || outputFormat === "webp";

  /* ── Add files ── */
  const addFiles = useCallback((fileList: FileList | File[]) => {
    const arr = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    const newItems: FileItem[] = arr.map((f) => ({
      id: uid(),
      file: f,
      name: f.name,
      size: f.size,
      preview: URL.createObjectURL(f),
      status: "pending" as const,
    }));
    setFiles((prev) => [...prev, ...newItems]);
  }, []);

  /* ── Drop handlers ── */
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

  /* ── Remove file ── */
  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.preview) URL.revokeObjectURL(item.preview);
      if (item?.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  /* ── Clear all ── */
  const clearAll = useCallback(() => {
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
      if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
    });
    setFiles([]);
  }, [files]);

  /* ── Convert single image ── */
  const convertImage = useCallback(
    (item: FileItem): Promise<FileItem> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          /* For JPEG/BMP: fill white background (no alpha) */
          if (outputFormat === "jpeg" || outputFormat === "bmp") {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          ctx.drawImage(img, 0, 0);
          const mime = FORMAT_OPTIONS.find((f) => f.value === outputFormat)!.mime;
          const q = isLossy ? quality / 100 : undefined;
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve({ ...item, status: "error", error: "変換に失敗しました" });
                return;
              }
              const url = URL.createObjectURL(blob);
              resolve({
                ...item,
                status: "done",
                converted: blob,
                convertedUrl: url,
                convertedSize: blob.size,
              });
            },
            mime,
            q,
          );
        };
        img.onerror = () =>
          resolve({ ...item, status: "error", error: "画像の読み込みに失敗" });
        img.src = item.preview;
      });
    },
    [outputFormat, quality, isLossy],
  );

  /* ── Convert all ── */
  const convertAll = useCallback(async () => {
    setFiles((prev) =>
      prev.map((f) => (f.status !== "done" ? { ...f, status: "converting" as const } : f)),
    );
    const updated: FileItem[] = [];
    for (const f of files) {
      if (f.status === "done") {
        updated.push(f);
        continue;
      }
      const result = await convertImage(f);
      updated.push(result);
    }
    setFiles(updated);
  }, [files, convertImage]);

  /* ── Download single ── */
  const downloadFile = useCallback((item: FileItem) => {
    if (!item.convertedUrl) return;
    const ext = outputFormat === "jpeg" ? "jpg" : outputFormat;
    const baseName = item.name.replace(/\.[^.]+$/, "");
    const a = document.createElement("a");
    a.href = item.convertedUrl;
    a.download = `${baseName}.${ext}`;
    a.click();
  }, [outputFormat]);

  /* ── Download all ── */
  const downloadAll = useCallback(() => {
    files.forEach((f) => {
      if (f.status === "done") downloadFile(f);
    });
  }, [files, downloadFile]);

  const allDone = files.length > 0 && files.every((f) => f.status === "done");
  const hasPending = files.some((f) => f.status === "pending" || f.status === "error");

  return (
    <>
      <HeroBanner
        badge="🔄 Converter"
        title="画像変換ツール"
        subtitle="PNG・JPG・WebP・BMPをブラウザ上で相互変換"
      />

      <main className={styles.container}>
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
            accept={ACCEPT}
            multiple
            className={styles.fileInput}
            onChange={handleInputChange}
          />
          <span className={styles.dropIcon}>📁</span>
          <p className={styles.dropText}>
            画像をドラッグ＆ドロップ、またはクリックして選択
          </p>
          <p className={styles.dropHint}>
            PNG, JPG, WebP, GIF, BMP, SVG, AVIF に対応
          </p>
        </div>

        {files.length > 0 && (
          <>
            {/* Options */}
            <div className={styles.optionsBar}>
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>出力形式</label>
                <div className={styles.formatSelector}>
                  {FORMAT_OPTIONS.map((fmt) => (
                    <button
                      key={fmt.value}
                      className={`${styles.formatBtn} ${outputFormat === fmt.value ? styles.formatBtnActive : ""}`}
                      onClick={() => setOutputFormat(fmt.value)}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {isLossy && (
                <div className={styles.optionGroup}>
                  <label className={styles.optionLabel}>品質: {quality}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className={styles.range}
                  />
                </div>
              )}
            </div>

            {/* File list */}
            <div className={styles.fileList}>
              {files.map((f) => (
                <div key={f.id} className={styles.fileCard}>
                  <div className={styles.filePreview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f.preview} alt={f.name} />
                  </div>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{f.name}</span>
                    <span className={styles.fileSize}>
                      {formatBytes(f.size)}
                      {f.convertedSize != null && (
                        <>
                          {" → "}
                          <strong>{formatBytes(f.convertedSize)}</strong>
                        </>
                      )}
                    </span>
                  </div>
                  <div className={styles.fileActions}>
                    {f.status === "done" && (
                      <button
                        className={styles.dlBtn}
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadFile(f);
                        }}
                      >
                        ⬇️
                      </button>
                    )}
                    {f.status === "converting" && (
                      <span className={styles.spinner} />
                    )}
                    {f.status === "error" && (
                      <span className={styles.errorBadge}>❌</span>
                    )}
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(f.id);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className={styles.actionBar}>
              <button className={styles.button} onClick={clearAll}>
                🗑️ すべてクリア
              </button>
              {hasPending && (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={convertAll}
                >
                  🔄 変換する
                </button>
              )}
              {allDone && (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={downloadAll}
                >
                  ⬇️ すべてダウンロード
                </button>
              )}
            </div>
          </>
        )}

        {/* Features section */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🔒</span>
            <h3>プライバシー安全</h3>
            <p>すべてブラウザ上で処理。画像はサーバーにアップロードされません。</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>⚡</span>
            <h3>高速変換</h3>
            <p>Canvas APIを使用したネイティブ変換で瞬時に完了。</p>
          </div>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>📦</span>
            <h3>バッチ処理</h3>
            <p>複数画像を一括で変換。まとめてダウンロードも可能。</p>
          </div>
        </div>
      </main>
    </>
  );
}
