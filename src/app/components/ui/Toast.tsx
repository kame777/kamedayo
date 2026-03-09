import React from "react";
import styles from "./Toast.module.css";

interface Props {
  message: string | null;
}

export const Toast: React.FC<Props> = ({ message }) => {
  if (!message) return null;
  return (
    <div className={styles.toast}>
      <span>✓</span> {message}
    </div>
  );
};
