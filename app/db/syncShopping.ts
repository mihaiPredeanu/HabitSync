// app/db/syncShopping.ts
import { getSyncQueue, clearSyncQueue } from './syncQueue';

const API_BASE_URL = 'http://localhost:3000';

export const syncShoppingItems = async () => {
  const queue = getSyncQueue();
  const create: any[] = [];
  const update: any[] = [];
  const del: string[] = [];
  for (const item of queue) {
    if (item.type === 'shoppingItem') {
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
      await fetch(`${API_BASE_URL}/shopping/items/bulk-upsert`, {
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

export const pullShoppingItemsFromBackend = async (upsertShoppingItem: (item: any) => Promise<void>) => {
  const res = await fetch(`${API_BASE_URL}/shopping-items`);
  if (!res.ok) return;
  const remoteItems = await res.json();
  for (const item of remoteItems) {
    await upsertShoppingItem(item);
  }
};
