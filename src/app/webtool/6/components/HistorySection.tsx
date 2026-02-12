import React from "react";
import styles from "../UrlShortener.module.css";
import { ShortenedEntry } from "../types";

interface Props {
  history: ShortenedEntry[];
  copiedId: string | null;
  onCopy: (text: string, id: string) => void;
  onClear: () => void;
}

export const HistorySection: React.FC<Props> = ({
  history,
  copiedId,
  onCopy,
  onClear,
}) => {
  if (history.length <= 1) return null;

  // Skip the first one as it's displayed in LatestResult
  const historyItems = history.slice(1);

  return (
    <div className={styles.historySection}>
      <div className={styles.historyHeader}>
        <h2 className={styles.historyTitle}>📜 変換履歴</h2>
        <button onClick={onClear} className={styles.clearBtn}>
          履歴をクリア
        </button>
      </div>
      <div className={styles.historyList}>
        {historyItems.map((entry) => {
          const isCopied = copiedId === entry.id;
          return (
            <div key={entry.id} className={styles.historyItem}>
              <div className={styles.historyShort}>
                <a href={entry.shortURL} target="_blank" rel="noopener noreferrer">
                  {entry.shortURL}
                </a>
                <button
                  onClick={() => onCopy(entry.shortURL, entry.id)}
                  className={`${styles.copyBtn} ${isCopied ? styles.copied : ""}`}
                >
                  {isCopied ? "✅ コピー済み" : "📋 コピー"}
                </button>
              </div>
              <p className={styles.historyOriginal}>{entry.originalURL}</p>
              <span className={styles.historyTime}>{entry.createdAt}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
