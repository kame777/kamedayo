'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTodos } from '../hooks/useTodos';
import TodoItem from './TodoItem';
import { TodoItem as TodoItemType } from '../types';
import styles from './TodoList.module.css';

interface SortableTodoItemProps {
  todo: TodoItemType;
  onEdit: (todo: TodoItemType) => void;
}

function SortableTodoItem({ todo, onEdit }: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TodoItem
        todo={todo}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

interface TodoListProps {
  onEdit: (todo: TodoItemType) => void;
}

export default function TodoList({ onEdit }: TodoListProps) {
  const { todos, reorderTodos } = useTodos();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex(t => t.id === active.id);
      const newIndex = todos.findIndex(t => t.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTodos(oldIndex, newIndex);
      }
    }
  };

  if (todos.length === 0) {
    return (
      <div className={styles.empty}>
        <p>タスクがありません</p>
        <p className={styles.emptyHint}>上のフォームから新しいタスクを追加してください</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={todos.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {todos.map((todo) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              onEdit={onEdit}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
