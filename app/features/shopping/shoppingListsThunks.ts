import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { ShoppingList } from '../../types';

const shoppingListFromRecord = (record: any): ShoppingList => ({
  id: record.id,
  name: record.name,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export const fetchShoppingLists = createAsyncThunk('shoppingLists/fetchAll', async () => {
  const collection = database.get('shopping_lists');
  const records = await collection.query().fetch();
  return records.map(shoppingListFromRecord);
});

export const addShoppingListToDB = createAsyncThunk('shoppingLists/addToDB', async (name: string, thunkAPI) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return thunkAPI.rejectWithValue('List name is required.');
  }
  const now = new Date().toISOString();
  let newList: ShoppingList | null = null;
  const collection = database.get('shopping_lists');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.name = name;
      rec.created_at = now;
      rec.updated_at = now;
      newList = {
        id: rec.id,
        name,
        createdAt: now,
        updatedAt: now,
      };
    });
  });
  return newList;
});

export const updateShoppingListInDB = createAsyncThunk('shoppingLists/updateInDB', async ({ id, name }: { id: string; name: string }, thunkAPI) => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return thunkAPI.rejectWithValue('List name is required.');
  }
  const collection = database.get('shopping_lists');
  const record = await collection.find(id);
  let updated: ShoppingList | null = null;
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.name = name;
      rec.updated_at = new Date().toISOString();
      updated = {
        id,
        name,
        createdAt: rec.created_at,
        updatedAt: rec.updated_at,
      };
    });
  });
  return updated;
});

export const deleteShoppingListFromDB = createAsyncThunk('shoppingLists/deleteFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('shopping_lists');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  // Orphaned items: set their listId to 'default'
  const itemCollection = database.get('shopping_items');
  const orphaned = await itemCollection.query().fetch();
  await database.write(async () => {
    for (const item of orphaned) {
      if (item.list_id === id) {
        await item.update((rec: any) => {
          rec.list_id = 'default';
        });
      }
    }
  });
  return id;
});
