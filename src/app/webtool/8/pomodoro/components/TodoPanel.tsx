'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '../types';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoEditModal from './TodoEditModal';
import styles from './TodoPanel.module.css';

const PANEL_OPEN_KEY = 'pomodoro-todo-panel-open';

interface TodoPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function TodoPanel({ isOpen, onToggle }: TodoPanelProps) {
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null);

  // Save panel state
  useEffect(() => {
    localStorage.setItem(PANEL_OPEN_KEY, String(isOpen));
  }, [isOpen]);

  return (
    <>
      {/* Panel */}
      <div className={`${styles.panel} ${isOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>タスク</h2>
          <button onClick={onToggle} className={styles.closeBtn} aria-label="閉じる">
            ×
          </button>
        </div>

        <TodoForm />
        <TodoList onEdit={setEditingTodo} />
      </div>

      {/* Backdrop for mobile */}
      {isOpen && <div className={styles.backdrop} onClick={onToggle} />}

      {/* Edit Modal */}
      <TodoEditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />
    </>
  );
}
