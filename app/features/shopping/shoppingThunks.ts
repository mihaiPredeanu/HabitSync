import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { ShoppingItem } from '../../types';
import { addItem, updateItem, deleteItem, toggleChecked } from './shoppingSlice';

const shoppingItemFromRecord = (record: any): ShoppingItem => ({
  id: record.id,
  name: record.name,
  checked: record.checked,
  listId: record.list_id,
  sharedWith: record.shared_with ? record.shared_with.split(',') : undefined,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export const fetchShoppingItems = createAsyncThunk('shopping/fetchAll', async (_, thunkAPI) => {
  const collection = database.get('shopping_items');
  const records = await collection.query().fetch();
  return records.map(shoppingItemFromRecord);
});

export const addShoppingItemToDB = createAsyncThunk('shopping/addToDB', async (item: ShoppingItem, thunkAPI) => {
  const collection = database.get('shopping_items');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.name = item.name;
      rec.checked = item.checked;
      rec.list_id = item.listId;
      rec.shared_with = item.sharedWith?.join(',') || '';
      rec.created_at = item.createdAt;
      rec.updated_at = item.updatedAt;
    });
  });
  thunkAPI.dispatch(addItem(item));
});

export const updateShoppingItemInDB = createAsyncThunk('shopping/updateInDB', async (item: ShoppingItem, thunkAPI) => {
  const collection = database.get('shopping_items');
  const record = await collection.find(item.id);
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.name = item.name;
      rec.checked = item.checked;
      rec.list_id = item.listId;
      rec.shared_with = item.sharedWith?.join(',') || '';
      rec.updated_at = item.updatedAt;
    });
  });
  thunkAPI.dispatch(updateItem(item));
});

export const deleteShoppingItemFromDB = createAsyncThunk('shopping/deleteFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('shopping_items');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  thunkAPI.dispatch(deleteItem(id));
});
