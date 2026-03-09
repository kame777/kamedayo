import React from "react";
import styles from "../UrlShortener.module.css";
import { ShortenedEntry } from "../types";
import Button from "../../../components/ui/Button";

type IconProps = { size?: number };

const LinkIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const CopyIcon = ({ size = 14 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="13" height="13" rx="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

interface Props {
  entry: ShortenedEntry;
  onCopy: (text: string) => void;
}

export const LatestResult: React.FC<Props> = ({ entry, onCopy }) => {
  return (
    <div className={styles.latestResult}>
      <div className={styles.latestLabel}>
        <LinkIcon size={13} /> 短縮URL
      </div>
      <div className={styles.latestUrlRow}>
        <a
          href={entry.shortURL}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.latestUrl}
        >
          {entry.shortURL}
        </a>
        <Button size="sm" onClick={() => onCopy(entry.shortURL)}>
          <CopyIcon size={13} /> コピー
        </Button>
      </div>
      <p className={styles.latestOriginal}>
        元のURL: <span>{entry.originalURL}</span>
      </p>
    </div>
  );
};
