'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './MarkdownEditor.module.css';

type Props = {
  initialSlug?: string;
  initialMarkdown?: string;
  onSave: (slug: string, markdown: string) => Promise<void>;
};

const STORAGE_KEY = 'blog-editor-draft';

function getDefaultFrontmatter() {
  const today = new Date().toISOString().slice(0, 10);
  return `---
title: ""
date: "${today}"
updatedAt: ""
summary: ""
category: "tech"
tags: []
draft: true
ogTitle: ""
ogDescription: ""
---

`;
}

export default function MarkdownEditor({ initialSlug, initialMarkdown, onSave }: Props) {
  const [slug, setSlug] = useState(initialSlug ?? '');
  const [markdown, setMarkdown] = useState(() => {
    if (initialMarkdown) return initialMarkdown;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return saved;
    }
    return getDefaultFrontmatter();
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // localStorage 自動保存（1秒デバウンス）
  useEffect(() => {
    if (initialMarkdown) return;
    const id = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, markdown);
    }, 1000);
    return () => clearTimeout(id);
  }, [markdown, initialMarkdown]);

  const insertAtCursor = useCallback((before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const selected = value.slice(s, e);
    const newValue = value.slice(0, s) + before + selected + after + value.slice(e);
    setMarkdown(newValue);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  }, []);

  const handleKeyDown = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (ev.key === 'Tab') {
      ev.preventDefault();
      insertAtCursor('  ');
    }
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      const res = await fetch('/api/blog/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, base64 }),
      });
      if (!res.ok) throw new Error('Upload failed');
      const { url } = (await res.json()) as { url: string };
      insertAtCursor(`![${file.name}](${url})`);
    } catch {
      setError('画像アップロードに失敗しました');
    } finally {
      setUploading(false);
    }
  };

  const handleReset = () => {
    const confirmMsg = initialMarkdown
      ? '編集内容を破棄して元の内容に戻しますか？'
      : '入力内容をリセットしますか？下書きも削除されます。';
    if (!window.confirm(confirmMsg)) return;
    const resetContent = initialMarkdown ?? getDefaultFrontmatter();
    setMarkdown(resetContent);
    if (!initialMarkdown) {
      localStorage.removeItem(STORAGE_KEY);
    }
    setError(null);
    setSuccess(false);
  };

  const handleSave = async () => {
    if (!slug) {
      setError('スラッグを入力してください');
      return;
    }
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave(slug, markdown);
      localStorage.removeItem(STORAGE_KEY);
      setSuccess(true);
    } catch {
      setError('保存に失敗しました。ログイン状態と設定を確認してください。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <input
          className={styles.slugInput}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="slug（例: 2026-02-24-my-post）"
          disabled={!!initialSlug}
        />
        <div className={styles.toolbarButtons}>
          <button type="button" onClick={() => insertAtCursor('**', '**')} title="太字">B</button>
          <button type="button" onClick={() => insertAtCursor('*', '*')} title="斜体">I</button>
          <button type="button" onClick={() => insertAtCursor('\n## ')} title="見出しH2">H2</button>
          <button type="button" onClick={() => insertAtCursor('\n### ')} title="見出しH3">H3</button>
          <button type="button" onClick={() => insertAtCursor('\n```\n', '\n```')} title="コードブロック">{'<>'}</button>
          <button type="button" onClick={() => insertAtCursor('[', '](url)')} title="リンク">link</button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="画像アップロード"
            className={styles.imageBtn}
          >
            {uploading ? '...' : '画像'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageUpload(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            className={styles.resetBtn}
            onClick={handleReset}
            title="初期状態にリセット"
          >
            リセット
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '保存中...' : 'GitHubに保存'}
          </button>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.successMsg}>GitHubに保存しました。リビルド後に公開されます。</p>}

      <div className={styles.panes}>
        <textarea
          ref={textareaRef}
          className={styles.editor}
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          placeholder="マークダウンで記事を書いてください..."
        />
        <div className={styles.preview}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
