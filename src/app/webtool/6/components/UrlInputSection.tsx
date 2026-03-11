import React from "react";
import styles from "../UrlShortener.module.css";
import Button from "../../../components/ui/Button";
import { AlertIcon } from "../../../components/Icons";

interface Props {
  url: string;
  loading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (val: string) => void;
  onShorten: () => void;
  error: string;
}

export const UrlInputSection: React.FC<Props> = ({
  url,
  loading,
  inputRef,
  onInputChange,
  onShorten,
  error,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      onShorten();
    }
  };

  return (
    <>
      <div className={styles.inputSection}>
        <div className={styles.inputWrapper}>
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://example.com/very/long/url..."
            className={styles.urlInput}
            disabled={loading}
            autoFocus
          />
        </div>
        <Button
          onClick={onShorten}
          disabled={loading || !url.trim()}
        >
          {loading ? <span className={styles.spinner} /> : "短縮する"}
        </Button>
      </div>

      {error && (
        <div className={styles.errorMsg}>
          <AlertIcon size={16} /> {error}
        </div>
      )}
    </>
  );
};
