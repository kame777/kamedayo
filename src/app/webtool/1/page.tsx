"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./TextCounter.module.css";
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const TextCounter: React.FC = () => {
  const [text, setText] = useState("");
  const [selectedText, setSelectedText] = useState("");
  const [copied, setCopied] = useState(false);
  const [textStats, setTextStats] = useState({
    totalCharCount: 0,
    nonSpaceCharCount: 0,
    fullWidthCharCount: 0,
    halfWidthCharCount: 0,
    lineCount: 0,
  });
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    updateTextStats(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    updateTextStats(newText);
  };

  const handleSelection = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) {
      setSelectedText("");
      return;
    }
    setSelectedText(ta.value.substring(start, end));
  };

  const updateTextStats = (t: string) => {
    const totalCharCount = t.length;
    const nonSpaceCharCount = t.replace(/\s+/g, "").length;
    const fullWidthCharCount = (t.match(/[\u3000-\uFFEF]/g) || []).length;
    const halfWidthCharCount = totalCharCount - fullWidthCharCount;
    const lineCount = t ? t.split("\n").length : 0;

    setTextStats({
      totalCharCount,
      nonSpaceCharCount,
      fullWidthCharCount,
      halfWidthCharCount,
      lineCount,
    });
  };

  const clearText = () => {
    setText("");
    setSelectedText("");
    updateTextStats("");
    textareaRef.current?.focus();
  };

  const copyText = async () => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバックを簡潔に無視
    }
  };

  const pasteText = async () => {
    if (!navigator.clipboard) return;
    try {
      const clipboardText = await navigator.clipboard.readText();
      setText(clipboardText);
      updateTextStats(clipboardText);
    } catch (err) {
      console.error("クリップボードからの読み込みに失敗しました:", err);
      alert("クリップボードの内容を読み込めませんでした。ブラウザの権限設定を確認してください。");
    }
  };

  const selectedCharCount = selectedText.length;
  const selectedLineCount = selectedText ? selectedText.split("\n").length : 0;

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
            <p>全体文字数: <span>{textStats.totalCharCount}</span></p>
            <p>スペースと改行を除く文字数: <span>{textStats.nonSpaceCharCount}</span></p>
            <p>全角文字数: <span>{textStats.fullWidthCharCount}</span></p>
            <p>半角文字数: <span>{textStats.halfWidthCharCount}</span></p>
            <p>行数: <span>{textStats.lineCount}</span></p>
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
