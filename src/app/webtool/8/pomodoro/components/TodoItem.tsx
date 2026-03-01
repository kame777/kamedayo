'use client';

import { useState } from 'react';
import { TodoItem as TodoItemType } from '../types';
import { useTodos } from '../hooks/useTodos';
import { useTimerStore } from '../stores/timerStore';
import styles from './TodoItem.module.css';

interface TodoItemProps {
  todo: TodoItemType;
  onEdit: (todo: TodoItemType) => void;
  dragHandleProps?: any;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}時間${remainingMinutes}分` : `${hours}時間`;
}

export default function TodoItem({ todo, onEdit, dragHandleProps }: TodoItemProps) {
  const { updateTodo, deleteTodo, selectTodo } = useTodos();
  const { activeTodoId, setActiveTodoId } = useTimerStore();

  const isSelected = activeTodoId === todo.id;

  const handleSelect = () => {
    const newId = isSelected ? null : todo.id;
    selectTodo(newId);
    setActiveTodoId(newId);
  };

  const handleToggleComplete = () => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const handleDelete = () => {
    if (confirm('このタスクを削除しますか？')) {
      deleteTodo(todo.id);
    }
  };

  return (
    <div className={`${styles.item} ${isSelected ? styles.selected : ''} ${todo.completed ? styles.completed : ''}`}>
      <div {...dragHandleProps} className={styles.dragHandle}>
        ≡
      </div>

      <input
        type="checkbox"
        checked={todo.completed}
        onChange={handleToggleComplete}
        className={styles.checkbox}
      />

      <div className={styles.content}>
        <h3 className={styles.title}>{todo.title}</h3>
        {todo.description && <p className={styles.description}>{todo.description}</p>}
        <div className={styles.meta}>
          <span className={styles.time}>{formatTime(todo.total_time_spent)}</span>
          {todo.estimated_pomodoros && (
            <span className={styles.estimate}>目標: {todo.estimated_pomodoros}🍅</span>
          )}
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={handleSelect}
          className={`${styles.selectBtn} ${isSelected ? styles.active : ''}`}
        >
          {isSelected ? '✓' : '○'}
          <span className={styles.tooltip}>{isSelected ? '選択解除' : 'このタスクで作業'}</span>
        </button>
        <button onClick={() => onEdit(todo)} className={styles.editBtn}>
          ✎
          <span className={styles.tooltip}>編集</span>
        </button>
        <button onClick={handleDelete} className={styles.deleteBtn}>
          ×
          <span className={styles.tooltip}>削除</span>
        </button>
      </div>
    </div>
  );
}
