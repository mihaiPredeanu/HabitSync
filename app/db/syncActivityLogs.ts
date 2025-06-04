// app/db/syncActivityLogs.ts
import { getSyncQueue, clearSyncQueue } from './syncQueue';

const API_BASE_URL = 'http://localhost:3000';

export const syncActivityLogs = async () => {
  const queue = getSyncQueue();
  const create: any[] = [];
  const update: any[] = [];
  const del: string[] = [];
  for (const item of queue) {
    if (item.type === 'activityLog') {
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
      await fetch(`${API_BASE_URL}/activity-logs/bulk-upsert`, {
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

export const pullActivityLogsFromBackend = async (upsertActivityLog: (log: any) => Promise<void>) => {
  const res = await fetch(`${API_BASE_URL}/activity-log`);
  if (!res.ok) return;
  const remoteLogs = await res.json();
  for (const log of remoteLogs) {
    await upsertActivityLog(log);
  }
};
