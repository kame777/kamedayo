import { create } from 'zustand';
import { TodoItem } from '../types';

interface TodoStore {
  todos: TodoItem[];
  selectedTodoId: string | null;
  isLoaded: boolean;

  setTodos: (todos: TodoItem[]) => void;
  addTodo: (todo: TodoItem) => void;
  updateTodo: (id: string, partial: Partial<TodoItem>) => void;
  deleteTodo: (id: string) => void;
  selectTodo: (id: string | null) => void;
  incrementTodoTime: (id: string, seconds: number) => void;
  reorderTodos: (startIndex: number, endIndex: number) => void;
  setLoaded: (loaded: boolean) => void;
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  selectedTodoId: null,
  isLoaded: false,

  setTodos: (todos) => set({ todos }),

  addTodo: (todo) => set((state) => {
    // Prevent duplicates
    if (state.todos.some(t => t.id === todo.id)) {
      return state;
    }
    return { todos: [...state.todos, todo] };
  }),

  updateTodo: (id, partial) => set((state) => ({
    todos: state.todos.map(t =>
      t.id === id ? { ...t, ...partial, updated_at: new Date().toISOString() } : t
    )
  })),

  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(t => t.id !== id),
    selectedTodoId: state.selectedTodoId === id ? null : state.selectedTodoId
  })),

  selectTodo: (id) => set({ selectedTodoId: id }),

  incrementTodoTime: (id, seconds) => set((state) => ({
    todos: state.todos.map(t =>
      t.id === id
        ? { ...t, total_time_spent: t.total_time_spent + seconds, updated_at: new Date().toISOString() }
        : t
    )
  })),

  reorderTodos: (startIndex, endIndex) => set((state) => {
    const result = Array.from(state.todos);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return { todos: result.map((t, idx) => ({ ...t, order_index: idx })) };
  }),

  setLoaded: (loaded) => set({ isLoaded: loaded })
}));
