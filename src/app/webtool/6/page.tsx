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
import { LinkIcon } from "../../components/Icons";

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
