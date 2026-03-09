import React from "react";
import styles from "../UrlShortener.module.css";
import Button from "../../../components/ui/Button";

type IconProps = { size?: number };

const AlertIcon = ({ size = 16 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

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
