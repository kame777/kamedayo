import React from "react";
import styles from "../UrlShortener.module.css";

const InfoIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="8.01"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
  </svg>
);

export const InfoSection: React.FC = () => {
  return (
    <div className={styles.infoSection}>
      <h2 className={styles.infoTitle}>
        <InfoIcon size={16} /> 使い方
      </h2>
      <ul className={styles.infoList}>
        <li>短縮したいURLを入力して「短縮する」をクリック</li>
        <li>元のURLは、https://url.kamedayo.com/xxxxxxという形に変換されます</li>
        <li>生成された短縮URLをコピーして共有</li>
        <li>変換履歴はブラウザを閉じても保持されます（ローカルストレージ）</li>
      </ul>
    </div>
  );
};
