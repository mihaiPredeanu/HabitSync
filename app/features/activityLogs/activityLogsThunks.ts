import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { Q } from '@nozbe/watermelondb';
import { ActivityLog } from '../../types';
import { setActivityLogs, addActivityLog, setActivityLogsLoading, setActivityLogsError } from './activityLogsSlice';

// Fetch logs for a specific item (to-do or shopping item)
export const fetchActivityLogsForItem = createAsyncThunk(
  'activityLogs/fetchForItem',
  async (
    { itemId, itemType }: { itemId: string; itemType: 'todo' | 'shopping' },
    { dispatch }
  ) => {
    dispatch(setActivityLogsLoading(true));
    try {
      const logsCollection = database.get<ActivityLog>('activity_logs');
      const logs = await logsCollection
        .query(Q.where('item_id', itemId), Q.where('item_type', itemType), Q.sortBy('timestamp', Q.desc))
        .fetch();
      dispatch(setActivityLogs(logs.map(log => log._raw as ActivityLog)));
    } catch (error: any) {
      dispatch(setActivityLogsError(error.message || 'Failed to fetch activity logs'));
    } finally {
      dispatch(setActivityLogsLoading(false));
    }
  }
);

// Add a new activity log entry
export const createActivityLog = createAsyncThunk(
  'activityLogs/create',
  async (log: Omit<ActivityLog, 'id'>, { dispatch }) => {
    try {
      const logsCollection = database.get<ActivityLog>('activity_logs');
      const newLog = await database.write(async () => {
        return await logsCollection.create(entry => {
          entry.itemId = log.itemId;
          entry.itemType = log.itemType;
          entry.action = log.action;
          entry.userId = log.userId;
          entry.details = log.details || '';
          entry.timestamp = log.timestamp;
        });
      });
      dispatch(addActivityLog(newLog._raw as ActivityLog));
    } catch (error) {
      // Optionally handle error
    }
  }
);
