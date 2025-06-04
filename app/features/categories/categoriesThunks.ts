
import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { Category } from '../../types';
import { addCategory, updateCategory, deleteCategory } from './categoriesSlice';
import { addToSyncQueue } from '../../db/syncQueue';

const categoryFromRecord = (record: any): Category => ({
  id: record.id,
  name: record.name,
  color: record.color,
  icon: record.icon,
  isDefault: record.is_default,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export const fetchCategories = createAsyncThunk('categories/fetchAll', async (_, thunkAPI) => {
  const collection = database.get('categories');
  const records = await collection.query().fetch();
  return records.map(categoryFromRecord);
});

export const addCategoryToDB = createAsyncThunk('categories/addToDB', async (category: Category, thunkAPI) => {
  const collection = database.get('categories');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.name = category.name;
      rec.color = category.color;
      rec.icon = category.icon;
      rec.is_default = category.isDefault;
      rec.created_at = category.createdAt;
      rec.updated_at = category.updatedAt;
    });
  });
  addToSyncQueue({ type: 'category', action: 'create', data: category, timestamp: Date.now() });
  thunkAPI.dispatch(addCategory(category));
});

export const updateCategoryInDB = createAsyncThunk('categories/updateInDB', async (category: Category, thunkAPI) => {
  const collection = database.get('categories');
  const record = await collection.find(category.id);
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.name = category.name;
      rec.color = category.color;
      rec.icon = category.icon;
      rec.is_default = category.isDefault;
      rec.updated_at = category.updatedAt;
    });
  });
  addToSyncQueue({ type: 'category', action: 'update', data: category, timestamp: Date.now() });
  thunkAPI.dispatch(updateCategory(category));
});

export const deleteCategoryFromDB = createAsyncThunk('categories/deleteFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('categories');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  addToSyncQueue({ type: 'category', action: 'delete', data: { id }, timestamp: Date.now() });
  thunkAPI.dispatch(deleteCategory(id));
});
