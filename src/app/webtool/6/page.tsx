"use client";

import React, { useEffect } from "react";
import styles from "./UrlShortener.module.css";
import HeroBanner from "../../components/HeroBanner";
import { useUrlShortener } from "./hooks/useUrlShortener";
import { UrlInputSection } from "./components/UrlInputSection";
import { LatestResult } from "./components/LatestResult";
import { HistorySection } from "./components/HistorySection";
import { InfoSection } from "./components/InfoSection";


export default function UrlShortenerPage() {
  useEffect(() => { document.title = 'kamedayo | 短縮URL作成ツール'; }, []);
  const {
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
  } = useUrlShortener();

  return (
    <>
      <HeroBanner
        badge="🔗 URL Shortener"
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
          <LatestResult
            entry={history[0]}
            copiedId={copiedId}
            onCopy={copyToClipboard}
          />
        )}

        <HistorySection
          history={history}
          copiedId={copiedId}
          onCopy={copyToClipboard}
          onClear={clearHistory}
        />

        <InfoSection />
      </main>
    </>
  );
}
