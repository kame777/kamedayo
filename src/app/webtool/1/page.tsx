"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
import styles from "./TextCounter.module.css";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

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
  let lines = 1; // テキストがある場合は最低1行

  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    total++;

    // 改行カウント（CRLFにも対応）
    if (ch === "\n") lines++;

    // 空白類（空白/タブ/改行/復帰/垂直タブ/改ページ）以外をカウント
    if (!(ch === " " || ch === "\t" || ch === "\n" || ch === "\r" || ch === "\v" || ch === "\f")) {
      nonSpace++;
    }

    // サロゲートペア対応のcodePoint
    const cp = t.codePointAt(i)!;
    if (cp > 0xffff) {
      // 上位サロゲート分をスキップ
      i++;
    }
    if (cp >= 0x3000 && cp <= 0xffef) {
      full++;
    }
  }

  const half = total - full;

  return {
    totalCharCount: total,
    nonSpaceCharCount: nonSpace,
    fullWidthCharCount: full,
    halfWidthCharCount: half,
    lineCount: lines,
  };
}

const TextCounter: React.FC = () => {
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
    if (start === end) {
      setSelectedText("");
      return;
    }
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
    } catch {
      // フォールバックは簡潔に無視
    }
  }, [text]);

  const pasteText = useCallback(async () => {
    if (!navigator.clipboard) return;
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
    } catch (err) {
      console.error("クリップボードからの読み込みに失敗しました:", err);
      alert("クリップボードの内容を読み込めませんでした。ブラウザの権限設定を確認してください。");
    }
  }, []);

  const selectedCharCount = selectedText.length;
  const selectedLineCount = selectedText ? selectedText.split(/\r?\n/).length : 0;

  return (
    <div className={styles.container}>
      <Header />
      <h1 className={styles.title}>文字数カウンター</h1>

      <div className={styles.buttonGroup}>
        <button onClick={clearText} className={styles.button}>クリア</button>
        <button onClick={copyText} className={styles.button}>
          {copied ? "コピー済み！" : "テキストをコピー"}
        </button>
        <button onClick={pasteText} className={styles.button}>ペースト</button>
      </div>

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

      <div className={styles.statsContainer}>
        <div className={styles.statGroup}>
          <h2>基本統計</h2>
          <div className={styles.counter}>
            <p>全体文字数: <span>{stats.totalCharCount}</span></p>
            <p>スペースと改行を除く文字数: <span>{stats.nonSpaceCharCount}</span></p>
            <p>全角文字数: <span>{stats.fullWidthCharCount}</span></p>
            <p>半角文字数: <span>{stats.halfWidthCharCount}</span></p>
            <p>行数: <span>{stats.lineCount}</span></p>
          </div>
        </div>

        <div className={styles.statGroup}>
          <h2>選択部分の統計</h2>
          <div className={styles.counter}>
            <p>選択された文字数: <span>{selectedText ? selectedCharCount : "-"}</span></p>
            <p>選択された行数: <span>{selectedText ? selectedLineCount : "-"}</span></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TextCounter;