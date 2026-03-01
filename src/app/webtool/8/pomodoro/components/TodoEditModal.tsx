'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '../types';
import { useTodos } from '../hooks/useTodos';
import styles from './TodoEditModal.module.css';

interface TodoEditModalProps {
  todo: TodoItem | null;
  onClose: () => void;
}

export default function TodoEditModal({ todo, onClose }: TodoEditModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState<number | ''>('');
  const { updateTodo } = useTodos();

  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description || '');
      setEstimatedPomodoros(todo.estimated_pomodoros || '');
    }
  }, [todo]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (todo) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [todo, onClose]);

  if (!todo) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTodo(todo.id, {
      title: title.trim(),
      description: description.trim() || undefined,
      estimated_pomodoros: estimatedPomodoros || undefined
    });

    onClose();
  };

  return (
    <>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>タスクを編集</h2>
          <button onClick={onClose} className={styles.closeBtn}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>タイトル *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              maxLength={200}
              autoFocus
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>説明</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              rows={3}
              maxLength={500}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="estimate" className={styles.label}>見積もり（ポモドーロ数）</label>
            <input
              id="estimate"
              type="number"
              value={estimatedPomodoros}
              onChange={(e) => setEstimatedPomodoros(e.target.value ? parseInt(e.target.value) : '')}
              className={styles.input}
              min="1"
              max="99"
            />
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              キャンセル
            </button>
            <button type="submit" className={styles.saveBtn} disabled={!title.trim()}>
              保存
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
