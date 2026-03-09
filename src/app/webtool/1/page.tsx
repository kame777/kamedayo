"use client";

import React, { useState, useRef, useMemo, useCallback, useEffect } from "react";
import styles from "./TextCounter.module.css";
import HeroBanner from '../../components/HeroBanner';
import Button from '../../components/ui/Button';


type Stats = {
  totalCharCount: number;
  nonSpaceCharCount: number;
  fullWidthCharCount: number;
  halfWidthCharCount: number;
  lineCount: number;
};

function computeStats(t: string): Stats {
  if (!t) {
    return {
      totalCharCount: 0,
      nonSpaceCharCount: 0,
      fullWidthCharCount: 0,
      halfWidthCharCount: 0,
      lineCount: 0,
    };
  }

  let total = 0;
  let nonSpace = 0;
  let full = 0;
  let lines = 1;

  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    total++;
    if (ch === "\n") lines++;
    if (!(ch === " " || ch === "\u3000" || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\v" || ch === "\f")) {
      nonSpace++;
    }
    const cp = t.codePointAt(i)!;
    if (cp > 0xffff) i++;
    if (cp >= 0x3000 && cp <= 0xffef) full++;
  }

  return {
    totalCharCount: total,
    nonSpaceCharCount: nonSpace,
    fullWidthCharCount: full,
    halfWidthCharCount: total - full,
    lineCount: lines,
  };
}

const TextCounter: React.FC = () => {
  useEffect(() => { document.title = 'kamedayo | 文字数カウンター'; }, []);
  const [text, setText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const stats = useMemo(() => computeStats(text), [text]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  }, []);

  const handleSelection = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: start, selectionEnd: end, value } = ta;
    if (start === end) { setSelectedText(""); return; }
    setSelectedText(value.substring(start, end));
  }, []);

  const clearText = useCallback(() => {
    setText("");
    setSelectedText("");
    textareaRef.current?.focus();
  }, []);

  const copyText = useCallback(async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [text]);

  const pasteText = useCallback(async () => {
    if (!navigator.clipboard) return;
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch {
      alert("クリップボードの内容を読み込めませんでした。ブラウザの権限設定を確認してください。");
    }
  }, []);

  const selectedCharCount = selectedText.length;
  const selectedLineCount = selectedText ? selectedText.split(/\r?\n/).length : 0;

  return (
    <>
      <HeroBanner
        badge="📝 Text Counter"
        title="文字数カウンター"
        subtitle="文字数・行数・全角/半角をリアルタイムにカウント"
      />

      <main className={styles.container}>
        {/* Buttons */}
        <div className={styles.buttonGroup}>
          <Button variant="secondary" onClick={clearText}>クリア</Button>
          <Button onClick={copyText}>
            {copied ? "コピー済み！" : "テキストをコピー"}
          </Button>
          <Button variant="secondary" onClick={pasteText}>ペースト</Button>
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleTextChange}
          onMouseUp={handleSelection}
          onKeyUp={handleSelection}
          placeholder="ここにテキストを入力してください..."
          rows={10}
          className={styles.textarea}
        />

        {/* Stats */}
        <div className={styles.statsContainer}>
          <div className={styles.statGroup}>
            <h2 className={styles.statGroupTitle}>基本統計</h2>
            <div className={styles.counter}>
              <p>全体文字数: <span>{stats.totalCharCount}</span></p>
              <p>スペースと改行を除く文字数: <span>{stats.nonSpaceCharCount}</span></p>
              <p>全角文字数: <span>{stats.fullWidthCharCount}</span></p>
              <p>半角文字数: <span>{stats.halfWidthCharCount}</span></p>
              <p>行数: <span>{stats.lineCount}</span></p>
            </div>
          </div>

          <div className={styles.statGroup}>
            <h2 className={styles.statGroupTitle}>選択部分の統計</h2>
            <div className={styles.counter}>
              <p>選択された文字数: <span>{selectedText ? selectedCharCount : "-"}</span></p>
              <p>選択された行数: <span>{selectedText ? selectedLineCount : "-"}</span></p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TextCounter;