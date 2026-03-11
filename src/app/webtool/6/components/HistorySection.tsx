import React from "react";
import styles from "../UrlShortener.module.css";
import { ShortenedEntry } from "../types";
import Button from "../../../components/ui/Button";
import { HistoryIcon, CopyIcon, TrashIcon } from "../../../components/Icons";

interface Props {
  history: ShortenedEntry[];
  onCopy: (text: string) => void;
  onClear: () => void;
}

export const HistorySection: React.FC<Props> = ({
  history,
  onCopy,
  onClear,
}) => {
  if (history.length <= 1) return null;

  // Skip the first one as it's displayed in LatestResult
  const historyItems = history.slice(1);

  return (
    <div className={styles.historySection}>
      <div className={styles.historyHeader}>
        <h2 className={styles.historyTitle}>
          <HistoryIcon size={16} /> 変換履歴
        </h2>
        <Button variant="danger" size="sm" onClick={onClear}>
          <TrashIcon size={14} /> クリア
        </Button>
      </div>
      <div className={styles.historyList}>
        {historyItems.map((entry) => (
          <div key={entry.id} className={styles.historyItem}>
            <div className={styles.historyShort}>
              <a href={entry.shortURL} target="_blank" rel="noopener noreferrer">
                {entry.shortURL}
              </a>
              <Button size="sm" onClick={() => onCopy(entry.shortURL)}>
                <CopyIcon size={13} /> コピー
              </Button>
            </div>
            <p className={styles.historyOriginal}>{entry.originalURL}</p>
            <span className={styles.historyTime}>{entry.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
