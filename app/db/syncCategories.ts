// app/db/syncCategories.ts
import { getSyncQueue, clearSyncQueue } from './syncQueue';

const API_BASE_URL = 'http://localhost:3000'; // Change to your backend URL

export const syncCategories = async () => {
  const queue = getSyncQueue();
  for (const item of queue) {
    try {
      if (item.type === 'category') {
        if (item.action === 'create') {
          await fetch(`${API_BASE_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          });
        } else if (item.action === 'update') {
          await fetch(`${API_BASE_URL}/categories/${item.data.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.data),
          });
        } else if (item.action === 'delete') {
          await fetch(`${API_BASE_URL}/categories/${item.data.id}`, {
            method: 'DELETE',
          });
        }
      }
    } catch (e) {
      // Optionally: keep failed items in the queue for retry
    }
  }
  clearSyncQueue();
};

export const pullCategoriesFromBackend = async (upsertCategory: (cat: any) => Promise<void>) => {
  const res = await fetch(`${API_BASE_URL}/categories`);
  if (!res.ok) return;
  const remoteCategories = await res.json();
  for (const cat of remoteCategories) {
    await upsertCategory(cat);
  }
};
