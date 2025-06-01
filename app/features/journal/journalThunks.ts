import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { JournalEntry } from '../../types';
import { addEntry, updateEntry, deleteEntry } from './journalSlice';

const journalEntryFromRecord = (record: any): JournalEntry => ({
  id: record.id,
  date: record.date,
  content: record.content,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export const fetchJournalEntries = createAsyncThunk('journal/fetchAll', async (_, thunkAPI) => {
  const collection = database.get('journal_entries');
  const records = await collection.query().fetch();
  return records.map(journalEntryFromRecord);
});

export const addJournalEntryToDB = createAsyncThunk('journal/addToDB', async (entry: JournalEntry, thunkAPI) => {
  const collection = database.get('journal_entries');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.date = entry.date;
      rec.content = entry.content;
      rec.created_at = entry.createdAt;
      rec.updated_at = entry.updatedAt;
    });
  });
  thunkAPI.dispatch(addEntry(entry));
});

export const updateJournalEntryInDB = createAsyncThunk('journal/updateInDB', async (entry: JournalEntry, thunkAPI) => {
  const collection = database.get('journal_entries');
  const record = await collection.find(entry.id);
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.date = entry.date;
      rec.content = entry.content;
      rec.updated_at = entry.updatedAt;
    });
  });
  thunkAPI.dispatch(updateEntry(entry));
});

export const deleteJournalEntryFromDB = createAsyncThunk('journal/deleteFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('journal_entries');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  thunkAPI.dispatch(deleteEntry(id));
});
