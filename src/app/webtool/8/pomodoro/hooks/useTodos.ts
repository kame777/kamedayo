'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useTodoStore } from '../stores/todoStore';
import { createClient } from '@/lib/supabase/client';
import { TodoItem } from '../types';
import {
  saveTodosLocal,
  loadTodosLocal,
  saveSelectedTodoLocal,
  loadSelectedTodoLocal,
  generateId
} from '../utils/storage';

export function useTodos() {
  const { user } = useAuthStore();
  const {
    todos,
    selectedTodoId,
    isLoaded,
    setTodos,
    addTodo: addTodoToStore,
    updateTodo: updateTodoInStore,
    deleteTodo: deleteTodoFromStore,
    reorderTodos: reorderTodosInStore,
    selectTodo,
    setLoaded
  } = useTodoStore();

  const [isLoading, setIsLoading] = useState(true);
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  // Reset loaded state when user changes (login/logout)
  useEffect(() => {
    const currentUserId = user?.id ?? null;
    if (prevUserIdRef.current === undefined) {
      prevUserIdRef.current = currentUserId;
      return;
    }
    if (prevUserIdRef.current !== currentUserId) {
      prevUserIdRef.current = currentUserId;
      setTodos([]);
      setLoaded(false);
    }
  }, [user, setTodos, setLoaded]);

  // Load todos on mount or after user change
  useEffect(() => {
    if (isLoaded) return;

    const loadTodos = async () => {
      setIsLoading(true);

      if (user) {
        // Load from Supabase
        try {
          const supabase = createClient();
          const { data, error } = await supabase
            .from('todos')
            .select('*')
            .eq('user_id', user.id)
            .order('order_index', { ascending: true });

          if (error) {
            console.warn('Failed to load todos from Supabase (table may not exist yet):', error.message);
            // Fallback to localStorage
            const localTodos = loadTodosLocal();
            setTodos(localTodos.map(t => ({ ...t, user_id: 'local' })));
          } else if (data) {
            setTodos(data as TodoItem[]);
          }
        } catch (error) {
          console.error('Error loading todos:', error);
          // Fallback to localStorage
          const localTodos = loadTodosLocal();
          setTodos(localTodos.map(t => ({ ...t, user_id: 'local' })));
        }
      } else {
        // Load from localStorage
        const localTodos = loadTodosLocal();
        setTodos(localTodos.map(t => ({ ...t, user_id: 'local' })));
      }

      const selectedId = loadSelectedTodoLocal();
      selectTodo(selectedId);

      setLoaded(true);
      setIsLoading(false);
    };

    loadTodos();
  }, [user, isLoaded, setTodos, selectTodo, setLoaded]);

  // Save to localStorage when todos change (guest mode)
  useEffect(() => {
    if (!user && isLoaded) {
      saveTodosLocal(todos);
    }
  }, [todos, user, isLoaded]);

  // Save selected todo to localStorage
  useEffect(() => {
    saveSelectedTodoLocal(selectedTodoId);
  }, [selectedTodoId]);

  // Realtime sync for authenticated users
  useEffect(() => {
    if (!user || !isLoaded) return;

    console.log('[Todos] Setting up realtime sync for user:', user.id);
    const supabase = createClient();
    const channel = supabase
      .channel(`todos-sync-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${user.id}` },
        async (payload) => {
          console.log('[Todos] Realtime event:', payload.eventType, payload);
          if (payload.eventType === 'INSERT') {
            const newTodo = payload.new as TodoItem;
            console.log('[Todos] Adding todo from realtime:', newTodo.id);
            addTodoToStore(newTodo);
          } else if (payload.eventType === 'UPDATE') {
            const updated = payload.new as TodoItem;
            console.log('[Todos] Updating todo from realtime:', updated.id);
            updateTodoInStore(updated.id, updated);
          } else if (payload.eventType === 'DELETE') {
            const deleted = payload.old as { id: string };
            console.log('[Todos] Deleting todo from realtime:', deleted.id);
            deleteTodoFromStore(deleted.id);
          }
        }
      )
      .subscribe((status) => {
        console.log('[Todos] Realtime subscription status:', status);
      });

    return () => {
      console.log('[Todos] Cleaning up realtime sync');
      supabase.removeChannel(channel);
    };
  }, [user, isLoaded, addTodoToStore, updateTodoInStore, deleteTodoFromStore]);

  const addTodo = useCallback(async (title: string, description?: string, estimatedPomodoros?: number) => {
    const newTodo: TodoItem = {
      id: generateId(),
      user_id: user?.id || 'local',
      title,
      description,
      completed: false,
      total_time_spent: 0,
      estimated_pomodoros: estimatedPomodoros,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      order_index: todos.length
    };

    addTodoToStore(newTodo);

    if (user) {
      const supabase = createClient();
      await supabase.from('todos').insert(newTodo);
    }
  }, [user, todos.length, addTodoToStore]);

  const updateTodo = useCallback(async (id: string, partial: Partial<TodoItem>) => {
    updateTodoInStore(id, partial);

    if (user) {
      const supabase = createClient();
      const updatedAt = new Date().toISOString();
      await supabase.from('todos').update({ ...partial, updated_at: updatedAt }).eq('id', id);
    }
  }, [user, updateTodoInStore]);

  const deleteTodo = useCallback(async (id: string) => {
    deleteTodoFromStore(id);

    if (user) {
      const supabase = createClient();
      await supabase.from('todos').delete().eq('id', id);
    }
  }, [user, deleteTodoFromStore]);

  const reorderTodos = useCallback(async (startIndex: number, endIndex: number) => {
    reorderTodosInStore(startIndex, endIndex);

    if (user) {
      const supabase = createClient();
      const updatedTodos = useTodoStore.getState().todos;
      await Promise.all(
        updatedTodos.map(todo =>
          supabase.from('todos').update({ order_index: todo.order_index }).eq('id', todo.id)
        )
      );
    }
  }, [user, reorderTodosInStore]);

  return {
    todos,
    selectedTodoId,
    isLoading,
    addTodo,
    updateTodo,
    deleteTodo,
    reorderTodos,
    selectTodo
  };
}
