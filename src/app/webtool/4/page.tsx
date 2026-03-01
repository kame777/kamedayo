"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import styles from "./Converter.module.css";
import HeroBanner from "../../components/HeroBanner";
import { useTabIndicator } from '../../hooks/useTabIndicator';

/* ───────── SVG Icons ───────── */
type IconProps = { size?: number };

const ConvertIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
  </svg>
);

const ImageModeIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
  </svg>
);

const VideoModeIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="6" width="15" height="12" rx="2"/><path d="m22 8-4 4 4 4V8z"/>
  </svg>
);

const FolderIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
  </svg>
);

const FilmIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20M17 2v20M2 12h20M2 7h5M17 7h5M2 17h5M17 17h5"/>
  </svg>
);

const TrashIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

const DownloadIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const LockIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const CloseIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ErrorIcon = ({ size = 18 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
  </svg>
);

/* ───────── Types ───────── */
type Mode = "image" | "video";

type ImageOutputFormat = "png" | "jpeg" | "webp" | "bmp" | "gif" | "avif" | "ico" | "tiff";
type VideoOutputFormat = "mp4" | "webm" | "avi" | "mov" | "gif" | "mp3" | "wav";
type OutputFormat = ImageOutputFormat | VideoOutputFormat;

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
  progress?: number;
};

const IMAGE_FORMAT_OPTIONS: { value: ImageOutputFormat; label: string; mime: string }[] = [
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "jpeg", label: "JPG", mime: "image/jpeg" },
  { value: "webp", label: "WebP", mime: "image/webp" },
  { value: "gif", label: "GIF", mime: "image/gif" },
  { value: "bmp", label: "BMP", mime: "image/bmp" },
  { value: "avif", label: "AVIF", mime: "image/avif" },
  { value: "ico", label: "ICO", mime: "image/x-icon" },
  { value: "tiff", label: "TIFF", mime: "image/tiff" },
];

const VIDEO_FORMAT_OPTIONS: { value: VideoOutputFormat; label: string; ext: string }[] = [
  { value: "mp4", label: "MP4", ext: "mp4" },
  { value: "webm", label: "WebM", ext: "webm" },
  { value: "avi", label: "AVI", ext: "avi" },
  { value: "mov", label: "MOV", ext: "mov" },
  { value: "gif", label: "GIF", ext: "gif" },
  { value: "mp3", label: "MP3 (音声)", ext: "mp3" },
  { value: "wav", label: "WAV (音声)", ext: "wav" },
];

const IMAGE_ACCEPT =
  "image/png,image/jpeg,image/webp,image/gif,image/bmp,image/svg+xml,image/avif,image/tiff,image/x-icon,.ico,image/heic,image/heif,.heic,.heif";
const VIDEO_ACCEPT =
  "video/mp4,video/webm,video/quicktime,video/x-msvideo,video/x-matroska,video/ogg,video/mpeg,.mp4,.webm,.mov,.avi,.mkv,.ogg,.mpeg,.mpg";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

/* ───────── Component ───────── */
export default function ExtensionConverter() {
  useEffect(() => { document.title = 'kamedayo | 拡張子変換ツール'; }, []);
  const [mode, setMode] = useState<Mode>("image");
  const { containerRef: modeTabsRef, indicatorStyle: modeIndicatorStyle } = useTabIndicator(mode);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [imageFormat, setImageFormat] = useState<ImageOutputFormat>("png");
  const [videoFormat, setVideoFormat] = useState<VideoOutputFormat>("mp4");
  const [quality, setQuality] = useState(92);
  const [isDragging, setIsDragging] = useState(false);
  const [ffmpegLoading, setFfmpegLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ffmpegRef = useRef<any>(null);

  const outputFormat: OutputFormat = mode === "image" ? imageFormat : videoFormat;
  const isLossy = outputFormat === "jpeg" || outputFormat === "webp" || outputFormat === "avif";

  /* ── Load FFmpeg lazily ── */
  const loadFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;
    setFfmpegLoading(true);
    try {
      const { FFmpeg } = await import("@ffmpeg/ffmpeg");
      const { toBlobURL } = await import("@ffmpeg/util");
      const ffmpeg = new FFmpeg();
      const baseURL = "https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd";
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
      });
      ffmpegRef.current = ffmpeg;
      return ffmpeg;
    } catch {
      throw new Error("FFmpegの読み込みに失敗しました");
    } finally {
      setFfmpegLoading(false);
    }
  }, []);

  /* ── Switch mode ── */
  const switchMode = useCallback(
    (newMode: Mode) => {
      if (newMode === mode) return;
      // Clear files when switching mode
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
        if (f.convertedUrl) URL.revokeObjectURL(f.convertedUrl);
      });
      setFiles([]);
      setMode(newMode);
    },
    [mode, files],
  );

  /* ── Add files ── */
  const addFiles = useCallback(
    (fileList: FileList | File[]) => {
      const prefix = mode === "image" ? "image/" : "video/";
      const isHeic = (f: File) => /\.heic$|\.heif$/i.test(f.name);
      const arr = Array.from(fileList).filter(
        (f) => f.type.startsWith(prefix) || (mode === "image" && isHeic(f)),
      );
      const newItems: FileItem[] = arr.map((f) => ({
        id: uid(),
        file: f,
        name: f.name,
        size: f.size,
        preview: URL.createObjectURL(f),
        status: "pending" as const,
      }));
      setFiles((prev) => [...prev, ...newItems]);
    },
    [mode],
  );

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
    async (item: FileItem): Promise<FileItem> => {
      /* HEIC / HEIF: decode with heic2any first */
      let srcUrl = item.preview;
      let heicBlobUrl: string | null = null;
      const isHeic = /\.heic$|\.heif$/i.test(item.name) ||
        item.file.type === "image/heic" || item.file.type === "image/heif";
      if (isHeic) {
        try {
          const heic2any = (await import("heic2any")).default;
          const converted = await heic2any({ blob: item.file, toType: "image/png" });
          const blob = Array.isArray(converted) ? converted[0] : converted;
          heicBlobUrl = URL.createObjectURL(blob);
          srcUrl = heicBlobUrl;
        } catch {
          return { ...item, status: "error", error: "HEIC/HEIFの変換に失敗しました" };
        }
      }

      return new Promise((resolve) => {
        /* ICO: special handling — resize to 256×256 max, output as PNG (ICO compatible) */
        const img = new Image();
        img.onload = () => {
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (imageFormat === "ico") {
            const max = 256;
            if (w > max || h > max) {
              const ratio = Math.min(max / w, max / h);
              w = Math.round(w * ratio);
              h = Math.round(h * ratio);
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d")!;
          if (
            imageFormat === "jpeg" ||
            imageFormat === "bmp" ||
            imageFormat === "ico"
          ) {
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(0, 0, w, h);
          }
          ctx.drawImage(img, 0, 0, w, h);

          const fmtEntry = IMAGE_FORMAT_OPTIONS.find(
            (f) => f.value === imageFormat,
          )!;
          /* ICO → use PNG mime (browser can't produce ICO natively, we output as .ico with PNG data which is valid ICO) */
          const mime =
            imageFormat === "ico" ? "image/png" : fmtEntry.mime;
          const q = isLossy ? quality / 100 : undefined;
          canvas.toBlob(
            (blob) => {
              if (heicBlobUrl) URL.revokeObjectURL(heicBlobUrl);
              if (!blob) {
                resolve({
                  ...item,
                  status: "error",
                  error: "変換に失敗しました",
                });
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
        img.onerror = () => {
          if (heicBlobUrl) URL.revokeObjectURL(heicBlobUrl);
          resolve({ ...item, status: "error", error: "画像の読み込みに失敗" });
        };
        img.src = srcUrl;
      });
    },
    [imageFormat, quality, isLossy],
  );

  /* ── Convert single video using FFmpeg ── */
  const convertVideo = useCallback(
    async (item: FileItem): Promise<FileItem> => {
      try {
        const ffmpeg = await loadFFmpeg();
        const { fetchFile } = await import("@ffmpeg/util");

        const inputExt = item.name.split(".").pop() || "mp4";
        const inputName = `input.${inputExt}`;
        const outputExt =
          VIDEO_FORMAT_OPTIONS.find((f) => f.value === videoFormat)?.ext ||
          videoFormat;
        const outputName = `output.${outputExt}`;

        await ffmpeg.writeFile(inputName, await fetchFile(item.file));

        /* Progress tracking */
        const handleProgress = ({ progress }: { progress: number; time: number }) => {
          if (!Number.isFinite(progress) || progress <= 0) return;
          const pct = Math.min(99, Math.round(progress * 100));
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: pct } : f));
        };
        ffmpeg.on('progress', handleProgress);

        /* Build FFmpeg args based on target format */
        const args: string[] = ["-i", inputName];

        switch (videoFormat) {
          case "mp4":
            args.push("-c:v", "mpeg4", "-q:v", "5", "-c:a", "aac");
            break;
          case "webm":
            args.push("-c:v", "libvpx", "-b:v", "1M", "-c:a", "libvorbis");
            break;
          case "avi":
            args.push("-c:v", "mpeg4", "-q:v", "5", "-c:a", "aac");
            break;
          case "mov":
            args.push("-c:v", "mpeg4", "-q:v", "5", "-c:a", "aac");
            break;
          case "gif":
            args.push(
              "-vf",
              "fps=15,scale=480:-1:flags=lanczos",
              "-loop",
              "0",
            );
            break;
          case "mp3":
            args.push("-vn", "-c:a", "libmp3lame", "-q:a", "4");
            break;
          case "wav":
            args.push("-vn", "-c:a", "pcm_s16le");
            break;
        }

        args.push("-y", outputName);
        try {
          await ffmpeg.exec(args);
        } finally {
          ffmpeg.off('progress', handleProgress);
        }

        const data = await ffmpeg.readFile(outputName);
        const blob = new Blob([data], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);

        // Cleanup
        try {
          await ffmpeg.deleteFile(inputName);
          await ffmpeg.deleteFile(outputName);
        } catch {
          /* ignore */
        }

        return {
          ...item,
          status: "done",
          converted: blob,
          convertedUrl: url,
          convertedSize: blob.size,
        };
      } catch (err) {
        return {
          ...item,
          status: "error",
          error: err instanceof Error ? err.message : "動画変換に失敗しました",
        };
      }
    },
    [videoFormat, loadFFmpeg],
  );

  /* ── Convert all ── */
  const convertAll = useCallback(async () => {
    setFiles((prev) =>
      prev.map((f) =>
        f.status !== "done" ? { ...f, status: "converting" as const } : f,
      ),
    );

    const convertFn = mode === "image" ? convertImage : convertVideo;
    const updated: FileItem[] = [];
    for (const f of files) {
      if (f.status === "done") {
        updated.push(f);
        continue;
      }
      const result = await convertFn(f);
      updated.push(result);
      /* Update UI per file */
      setFiles([...updated, ...files.slice(updated.length)]);
    }
    setFiles(updated);
  }, [files, mode, convertImage, convertVideo]);

  /* ── Download single ── */
  const downloadFile = useCallback(
    (item: FileItem) => {
      if (!item.convertedUrl) return;
      let ext: string;
      if (mode === "image") {
        ext = imageFormat === "jpeg" ? "jpg" : imageFormat;
      } else {
        ext =
          VIDEO_FORMAT_OPTIONS.find((f) => f.value === videoFormat)?.ext ||
          videoFormat;
      }
      const baseName = item.name.replace(/\.[^.]+$/, "");
      const a = document.createElement("a");
      a.href = item.convertedUrl;
      a.download = `${baseName}.${ext}`;
      a.click();
    },
    [mode, imageFormat, videoFormat],
  );

  /* ── Download all ── */
  const downloadAll = useCallback(() => {
    files.forEach((f) => {
      if (f.status === "done") downloadFile(f);
    });
  }, [files, downloadFile]);

  const allDone = files.length > 0 && files.every((f) => f.status === "done");
  const hasPending = files.some(
    (f) => f.status === "pending" || f.status === "error",
  );
  const isConverting = files.some((f) => f.status === "converting");
  const accept = mode === "image" ? IMAGE_ACCEPT : VIDEO_ACCEPT;

  return (
    <>
      <HeroBanner
        badge={<><ConvertIcon size={14} /> Converter</>}
        title="拡張子変換ツール"
        subtitle="画像・動画ファイルをブラウザ上で自在に変換"
      />

      <main className={styles.container}>
        {/* Mode tabs */}
        <div className={styles.modeTabs} ref={modeTabsRef}>
          <div className={styles.modeIndicator} style={modeIndicatorStyle} />
          <button
            className={`${styles.modeTab} ${mode === "image" ? styles.modeTabActive : ""}`}
            onClick={() => switchMode("image")}
            data-active={mode === "image" ? "true" : undefined}
          >
            <ImageModeIcon size={15} />
            <span>画像変換</span>
          </button>
          <button
            className={`${styles.modeTab} ${mode === "video" ? styles.modeTabActive : ""}`}
            onClick={() => switchMode("video")}
            data-active={mode === "video" ? "true" : undefined}
          >
            <VideoModeIcon size={15} />
            <span>動画変換</span>
          </button>
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
            accept={accept}
            multiple
            className={styles.fileInput}
            onChange={handleInputChange}
          />
          <span className={styles.dropIcon}>
            {mode === "image" ? <FolderIcon size={36} /> : <FilmIcon size={36} />}
          </span>
          <p className={styles.dropText}>
            {mode === "image"
              ? "画像をドラッグ＆ドロップ、またはクリックして選択"
              : "動画をドラッグ＆ドロップ、またはクリックして選択"}
          </p>
          <p className={styles.dropHint}>
            {mode === "image"
              ? "PNG, JPG, WebP, GIF, BMP, SVG, AVIF, TIFF, ICO, HEIC/HEIF に対応"
              : "MP4, WebM, MOV, AVI, MKV, OGG, MPEG に対応"}
          </p>
        </div>

        {files.length > 0 && (
          <>
            {/* Options */}
            <div className={styles.optionsBar}>
              <div className={styles.optionGroup}>
                <label className={styles.optionLabel}>出力形式</label>
                <div className={styles.formatSelector}>
                  {mode === "image"
                    ? IMAGE_FORMAT_OPTIONS.map((fmt) => (
                        <button
                          key={fmt.value}
                          className={`${styles.formatBtn} ${imageFormat === fmt.value ? styles.formatBtnActive : ""}`}
                          onClick={() => setImageFormat(fmt.value)}
                        >
                          {fmt.label}
                        </button>
                      ))
                    : VIDEO_FORMAT_OPTIONS.map((fmt) => (
                        <button
                          key={fmt.value}
                          className={`${styles.formatBtn} ${videoFormat === fmt.value ? styles.formatBtnActive : ""}`}
                          onClick={() => setVideoFormat(fmt.value)}
                        >
                          {fmt.label}
                        </button>
                      ))}
                </div>
              </div>

              {mode === "image" && isLossy && (
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

            {/* FFmpeg loading notice (video mode) */}
            {mode === "video" && ffmpegLoading && (
              <div className={styles.notice}>
                <span className={styles.spinner} />
                FFmpegを読み込み中...（初回のみ時間がかかります）
              </div>
            )}

            {/* File list */}
            <div className={styles.fileList}>
              {files.map((f) => (
                <div key={f.id} className={styles.fileCard}>
                  <div className={styles.filePreview}>
                    {mode === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={f.preview} alt={f.name} />
                    ) : (
                      <span className={styles.videoIcon}><VideoModeIcon size={22} /></span>
                    )}
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
                    {f.status === "converting" && f.progress != null && f.progress > 0 && (
                      <div className={styles.progressTrack}>
                        <div className={styles.progressFill} style={{ width: `${f.progress}%` }} />
                      </div>
                    )}
                    {f.status === "error" && f.error && (
                      <span className={styles.errorText}>{f.error}</span>
                    )}
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
                        <DownloadIcon size={15} />
                      </button>
                    )}
                    {f.status === "converting" && (
                      f.progress != null && f.progress > 0
                        ? <span className={styles.progressPct}>{f.progress}%</span>
                        : <span className={styles.spinner} />
                    )}
                    {f.status === "error" && (
                      <span className={styles.errorBadge}><ErrorIcon size={18} /></span>
                    )}
                    <button
                      className={styles.removeBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(f.id);
                      }}
                    >
                      <CloseIcon size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className={styles.actionBar}>
              <button className={styles.button} onClick={clearAll}>
                <TrashIcon size={15} /> すべてクリア
              </button>
              {hasPending && !isConverting && (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={convertAll}
                >
                  <ConvertIcon size={15} /> 変換する
                </button>
              )}
              {isConverting && (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  disabled
                >
                  <span className={styles.spinnerSmall} /> 変換中...
                </button>
              )}
              {allDone && (
                <button
                  className={`${styles.button} ${styles.buttonPrimary}`}
                  onClick={downloadAll}
                >
                  <DownloadIcon size={15} /> すべてダウンロード
                </button>
              )}
            </div>
          </>
        )}

        {/* Tip banner */}
        <div className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}><LockIcon size={20} /></div>
            <div>
              <h3>完全ローカル処理</h3>
              <p>すべてブラウザ上で処理。ファイルはサーバーにアップロードされません。</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
