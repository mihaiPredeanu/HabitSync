import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import HabitModel from './models/HabitModel';
import HabitLogModel from './models/HabitLogModel';
import ToDoModel from './models/ToDoModel';
import ShoppingItemModel from './models/ShoppingItemModel';
import CategoryModel from './models/CategoryModel';
import JournalEntryModel from './models/JournalEntryModel';
import NotificationModel from './models/NotificationModel';
import { appDatabaseSchema } from './schema';
import ShoppingListModel from './models/ShoppingListModel';

const adapter = new SQLiteAdapter({
  schema: appDatabaseSchema,
  dbName: 'HabitSyncDB',
  jsi: false, // set to true if using Hermes engine
});

export const database = new Database({
  adapter,
  modelClasses: [
    HabitModel,
    HabitLogModel,
    ToDoModel,
    ShoppingItemModel,
    ShoppingListModel,
    CategoryModel,
    JournalEntryModel,
    NotificationModel,
  ],
});
