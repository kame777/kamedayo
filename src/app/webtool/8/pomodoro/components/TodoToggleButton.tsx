'use client';

import { useTodoStore } from '../stores/todoStore';
import styles from './TodoToggleButton.module.css';

interface TodoToggleButtonProps {
  onClick: () => void;
}

export default function TodoToggleButton({ onClick }: TodoToggleButtonProps) {
  const { todos } = useTodoStore();
  const activeTodoCount = todos.filter(t => !t.completed).length;

  return (
    <button
      className={styles.toggleButton}
      onClick={onClick}
      aria-label="タスクリストを開く"
      title="タスクリスト"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
      {activeTodoCount > 0 && (
        <span className={styles.badge}>{activeTodoCount}</span>
      )}
    </button>
  );
}
