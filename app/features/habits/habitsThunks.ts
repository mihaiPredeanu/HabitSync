import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { Habit } from './HabitTypes';
import { addHabit, updateHabit, deleteHabit } from './habitsSlice';

// Helper to convert WatermelonDB record to Habit
const habitFromRecord = (record: any): Habit => ({
  id: record.id,
  name: record.name,
  color: record.color,
  icon: record.icon,
  type: record.type,
  frequency: {
    type: record.frequency_type,
    value: record.frequency_value,
    daysOfWeek: record.frequency_days_of_week
      ? record.frequency_days_of_week.split(',').map(Number)
      : undefined,
  },
  priority: record.priority,
  categoryId: record.category_id,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
  archived: record.archived,
  sharedWith: record.shared_with ? record.shared_with.split(',') : undefined,
  isDefault: record.is_default,
});

export const fetchHabits = createAsyncThunk('habits/fetchAll', async (_, thunkAPI) => {
  const collection = database.get('habits');
  const records = await collection.query().fetch();
  return records.map(habitFromRecord);
});

export const addHabitToDB = createAsyncThunk('habits/addToDB', async (habit: Habit, thunkAPI) => {
  const collection = database.get('habits');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.name = habit.name;
      rec.color = habit.color;
      rec.icon = habit.icon;
      rec.type = habit.type;
      rec.frequency_type = habit.frequency.type;
      rec.frequency_value = habit.frequency.value;
      rec.frequency_days_of_week = habit.frequency.daysOfWeek?.join(',') || '';
      rec.priority = habit.priority;
      rec.category_id = habit.categoryId;
      rec.archived = habit.archived;
      rec.shared_with = habit.sharedWith?.join(',') || '';
      rec.is_default = habit.isDefault;
      rec.created_at = habit.createdAt;
      rec.updated_at = habit.updatedAt;
    });
  });
  thunkAPI.dispatch(addHabit(habit));
});

export const updateHabitInDB = createAsyncThunk('habits/updateInDB', async (habit: Habit, thunkAPI) => {
  const collection = database.get('habits');
  const record = await collection.find(habit.id);
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.name = habit.name;
      rec.color = habit.color;
      rec.icon = habit.icon;
      rec.type = habit.type;
      rec.frequency_type = habit.frequency.type;
      rec.frequency_value = habit.frequency.value;
      rec.frequency_days_of_week = habit.frequency.daysOfWeek?.join(',') || '';
      rec.priority = habit.priority;
      rec.category_id = habit.categoryId;
      rec.archived = habit.archived;
      rec.shared_with = habit.sharedWith?.join(',') || '';
      rec.is_default = habit.isDefault;
      rec.updated_at = habit.updatedAt;
    });
  });
  thunkAPI.dispatch(updateHabit(habit));
});

export const deleteHabitFromDB = createAsyncThunk('habits/deleteFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('habits');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  thunkAPI.dispatch(deleteHabit(id));
});
