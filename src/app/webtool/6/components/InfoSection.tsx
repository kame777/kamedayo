import React from "react";
import styles from "../UrlShortener.module.css";

export const InfoSection: React.FC = () => {
  return (
    <div className={styles.infoSection}>
      <h2 className={styles.infoTitle}>💡 使い方</h2>
      <ul className={styles.infoList}>
        <li>短縮したいURLを入力して「短縮する」をクリック</li>
        <li>元のURLは、https://url.kamedayo.com/xxxxxxという形に変換されます</li>
        <li>生成された短縮URLをコピーして共有</li>
        <li>変換履歴はブラウザを閉じても保持されます（ローカルストレージ）</li>
      </ul>
    </div>
  );
};
