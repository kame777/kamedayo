'use client';

import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import styles from './TodoForm.module.css';

export default function TodoForm() {
  const [title, setTitle] = useState('');
  const { addTodo } = useTodos();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addTodo(title.trim());
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新しいタスクを追加..."
        className={styles.input}
        maxLength={200}
      />
      <button
        type="submit"
        className={styles.addButton}
        disabled={!title.trim()}
      >
        +
      </button>
    </form>
  );
}
