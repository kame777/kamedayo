import React from "react";
import styles from "../UrlShortener.module.css";
import { ShortenedEntry } from "../types";
import Button from "../../../components/ui/Button";

interface Props {
  entry: ShortenedEntry;
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
}

export const LatestResult: React.FC<Props> = ({ entry, copiedId, onCopy }) => {
  const isCopied = copiedId === entry.id;

  return (
    <div className={styles.latestResult}>
      <div className={styles.latestLabel}>✨ 短縮URL</div>
      <div className={styles.latestUrlRow}>
        <a
          href={entry.shortURL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.latestUrl}
        >
          {entry.shortURL}
        </a>
        <Button
          size="sm"
          onClick={() => onCopy(entry.shortURL, entry.id)}
          className={isCopied ? styles.copied : ""}
        >
          {isCopied ? "✅ コピー済み" : "📋 コピー"}
        </Button>
      </div>
      <p className={styles.latestOriginal}>
        元のURL: <span>{entry.originalURL}</span>
      </p>
    </div>
  );
};
