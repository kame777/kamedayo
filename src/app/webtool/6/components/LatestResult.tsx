import React from "react";
import styles from "../UrlShortener.module.css";
import { ShortenedEntry } from "../types";
import Button from "../../../components/ui/Button";
import { LinkIcon, CopyIcon } from "../../../components/Icons";

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
