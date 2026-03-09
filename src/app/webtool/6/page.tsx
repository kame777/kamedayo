"use client";

import React, { useEffect } from "react";
import styles from "./UrlShortener.module.css";
import HeroBanner from "../../components/HeroBanner";
import { useUrlShortener } from "./hooks/useUrlShortener";
import { UrlInputSection } from "./components/UrlInputSection";
import { LatestResult } from "./components/LatestResult";
import { HistorySection } from "./components/HistorySection";
import { InfoSection } from "./components/InfoSection";
import { Toast } from "./components/Toast";

const LinkIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

export default function UrlShortenerPage() {
  useEffect(() => { document.title = 'kamedayo | 短縮URL作成ツール'; }, []);
  const {
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
  } = useUrlShortener();

  return (
    <>
      <HeroBanner
        badge={<><LinkIcon size={15} /> URL Shortener</>}
        title="短縮URL作成ツール"
        subtitle="長いURLをワンクリックで短縮"
      />

      <main className={styles.container}>
        <UrlInputSection
          url={url}
          loading={loading}
          inputRef={inputRef}
          onInputChange={handleInputChange}
          onShorten={handleShorten}
          error={error}
        />

        {history.length > 0 && (
          <LatestResult entry={history[0]} onCopy={copyToClipboard} />
        )}

        <HistorySection
          history={history}
          onCopy={copyToClipboard}
          onClear={clearHistory}
        />

        <InfoSection />
      </main>
      <Toast message={toast} />
    </>
  );
}
