import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { Notification } from '../../types';
import { addNotification, markAsRead, deleteNotification } from './notificationsSlice';

const notificationFromRecord = (record: any): Notification => ({
  id: record.id,
  userId: record.user_id,
  type: record.type,
  title: record.title,
  body: record.body,
  data: record.data,
  read: record.read,
  createdAt: record.created_at,
});

export const fetchNotifications = createAsyncThunk('notifications/fetchAll', async (_, thunkAPI) => {
  const collection = database.get('notifications');
  const records = await collection.query().fetch();
  return records.map(notificationFromRecord);
});

export const addNotificationToDB = createAsyncThunk('notifications/addToDB', async (notification: Notification, thunkAPI) => {
  const collection = database.get('notifications');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.user_id = notification.userId;
      rec.type = notification.type;
      rec.title = notification.title;
      rec.body = notification.body;
      rec.data = notification.data;
      rec.read = notification.read;
      rec.created_at = notification.createdAt;
    });
  });
  thunkAPI.dispatch(addNotification(notification));
});

export const markNotificationAsReadInDB = createAsyncThunk('notifications/markAsReadInDB', async (id: string, thunkAPI) => {
  const collection = database.get('notifications');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.read = true;
    });
  });
  thunkAPI.dispatch(markAsRead(id));
});

export const deleteNotificationFromDB = createAsyncThunk('notifications/deleteFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('notifications');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  thunkAPI.dispatch(deleteNotification(id));
});
