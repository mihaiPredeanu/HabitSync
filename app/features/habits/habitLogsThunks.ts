import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { HabitLog } from './HabitTypes';
import { addHabitLog, updateHabitLog, deleteHabitLog } from './habitsSlice';

const habitLogFromRecord = (record: any): HabitLog => ({
  id: record.id,
  habitId: record.habit_id,
  date: record.date,
  value: record.value === 'true' ? true : record.value === 'false' ? false : Number(record.value),
  note: record.note,
  timeOfDay: record.time_of_day,
  createdAt: record.created_at,
});

export const fetchHabitLogs = createAsyncThunk('habits/fetchLogs', async (_, thunkAPI) => {
  const collection = database.get('habit_logs');
  const records = await collection.query().fetch();
  return records.map(habitLogFromRecord);
});

export const addHabitLogToDB = createAsyncThunk('habits/addLogToDB', async (log: HabitLog, thunkAPI) => {
  const collection = database.get('habit_logs');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.habit_id = log.habitId;
      rec.date = log.date;
      rec.value = String(log.value);
      rec.note = log.note;
      rec.time_of_day = log.timeOfDay;
      rec.created_at = log.createdAt;
    });
  });
  thunkAPI.dispatch(addHabitLog(log));
});

export const updateHabitLogInDB = createAsyncThunk('habits/updateLogInDB', async (log: HabitLog, thunkAPI) => {
  const collection = database.get('habit_logs');
  const record = await collection.find(log.id);
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.value = String(log.value);
      rec.note = log.note;
      rec.time_of_day = log.timeOfDay;
    });
  });
  thunkAPI.dispatch(updateHabitLog(log));
});

export const deleteHabitLogFromDB = createAsyncThunk('habits/deleteLogFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('habit_logs');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  thunkAPI.dispatch(deleteHabitLog(id));
});
