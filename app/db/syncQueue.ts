// app/db/syncQueue.ts

export type SyncAction = 'create' | 'update' | 'delete';
export type SyncType =
  | 'category'
  | 'habit'
  | 'habitLog'
  | 'todo'
  | 'shoppingItem'
  | 'shoppingList'
  | 'activityLog'
  | 'notification'
  | 'journalEntry'
  | 'user';

export interface SyncQueueItem {
  type: SyncType;
  action: SyncAction;
  data: any; // Entity object or just id for delete
  timestamp: number;
}

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'SYNC_QUEUE';
let syncQueue: SyncQueueItem[] = [];
let loaded = false;

const persistQueue = async () => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(syncQueue));
  } catch (e) {
    // Optionally: log error
  }
};

const loadQueue = async () => {
  if (loaded) return;
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      syncQueue = JSON.parse(data);
    }
    loaded = true;
  } catch (e) {
    syncQueue = [];
    loaded = true;
  }
};

export const addToSyncQueue = async (item: SyncQueueItem) => {
  await loadQueue();
  syncQueue.push(item);
  await persistQueue();
};

export const getSyncQueue = () => {
  // Note: This is now async in practice, but for compatibility, return current in-memory queue
  return syncQueue;
};

export const clearSyncQueue = async () => {
  syncQueue = [];
  await persistQueue();
};

// On module load, try to load the queue
loadQueue();
