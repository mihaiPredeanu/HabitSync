// app/db/syncTodos.ts
import { getSyncQueue, clearSyncQueue } from './syncQueue';

const API_BASE_URL = 'http://localhost:3000';

export const syncTodos = async () => {
  const queue = getSyncQueue();
  const create: any[] = [];
  const update: any[] = [];
  const del: string[] = [];
  for (const item of queue) {
    if (item.type === 'todo') {
      if (item.action === 'create') {
        create.push(item.data);
      } else if (item.action === 'update') {
        update.push({ ...item.data, id: item.data.id });
      } else if (item.action === 'delete') {
        del.push(item.data.id);
      }
    }
  }
  if (create.length || update.length || del.length) {
    try {
      await fetch(`${API_BASE_URL}/todos/bulk-upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ create, update, delete: del }),
      });
    } catch (e) {
      // Optionally: keep failed items in the queue for retry
      return;
    }
  }
  clearSyncQueue();
};

export const pullTodosFromBackend = async (upsertTodo: (todo: any) => Promise<void>) => {
  const res = await fetch(`${API_BASE_URL}/todos`);
  if (!res.ok) return;
  const remoteTodos = await res.json();
  for (const todo of remoteTodos) {
    await upsertTodo(todo);
  }
};
