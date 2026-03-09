import React from "react";
import styles from "../UrlShortener.module.css";
import { ShortenedEntry } from "../types";
import Button from "../../../components/ui/Button";

type IconProps = { size?: number };

const HistoryIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
  </svg>
);

const CopyIcon = ({ size = 13 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const TrashIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

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
