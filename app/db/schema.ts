import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const habitSchema = tableSchema({
  name: 'habits',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'color', type: 'string' },
    { name: 'icon', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'frequency_type', type: 'string' },
    { name: 'frequency_value', type: 'number', isOptional: true },
    { name: 'frequency_days_of_week', type: 'string', isOptional: true }, // store as comma-separated string
    { name: 'priority', type: 'string' },
    { name: 'category_id', type: 'string', isOptional: true },
    { name: 'archived', type: 'boolean', isOptional: true },
    { name: 'shared_with', type: 'string', isOptional: true }, // store as comma-separated string
    { name: 'is_default', type: 'boolean', isOptional: true },
    { name: 'created_at', type: 'string' },
    { name: 'updated_at', type: 'string' },
  ],
});

export const habitLogSchema = tableSchema({
  name: 'habit_logs',
  columns: [
    { name: 'habit_id', type: 'string' },
    { name: 'date', type: 'string' },
    { name: 'value', type: 'string' }, // store as string, can be 'true', 'false', or a number as string
    { name: 'note', type: 'string', isOptional: true },
    { name: 'time_of_day', type: 'string', isOptional: true },
    { name: 'created_at', type: 'string' },
  ],
});

export const toDoSchema = tableSchema({
  name: 'todos',
  columns: [
    { name: 'title', type: 'string' },
    { name: 'completed', type: 'boolean' },
    { name: 'due_date', type: 'string', isOptional: true },
    { name: 'recurring', type: 'boolean', isOptional: true },
    { name: 'recurrence_rule', type: 'string', isOptional: true },
    { name: 'priority', type: 'string' },
    { name: 'category_id', type: 'string', isOptional: true },
    { name: 'shared_with', type: 'string', isOptional: true },
    { name: 'created_at', type: 'string' },
    { name: 'updated_at', type: 'string' },
  ],
});

export const shoppingItemSchema = tableSchema({
  name: 'shopping_items',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'checked', type: 'boolean' },
    { name: 'list_id', type: 'string' },
    { name: 'shared_with', type: 'string', isOptional: true },
    { name: 'created_at', type: 'string' },
    { name: 'updated_at', type: 'string' },
  ],
});

export const categorySchema = tableSchema({
  name: 'categories',
  columns: [
    { name: 'name', type: 'string' },
    { name: 'color', type: 'string' },
    { name: 'icon', type: 'string' },
    { name: 'is_default', type: 'boolean', isOptional: true },
    { name: 'created_at', type: 'string' },
    { name: 'updated_at', type: 'string' },
  ],
});

export const journalEntrySchema = tableSchema({
  name: 'journal_entries',
  columns: [
    { name: 'date', type: 'string' },
    { name: 'content', type: 'string' },
    { name: 'created_at', type: 'string' },
    { name: 'updated_at', type: 'string' },
  ],
});

export const notificationSchema = tableSchema({
  name: 'notifications',
  columns: [
    { name: 'user_id', type: 'string' },
    { name: 'type', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'body', type: 'string' },
    { name: 'data', type: 'string', isOptional: true },
    { name: 'read', type: 'boolean' },
    { name: 'created_at', type: 'string' },
  ],
});

export const appDatabaseSchema = appSchema({
  version: 1,
  tables: [
    habitSchema,
    habitLogSchema,
    toDoSchema,
    shoppingItemSchema,
    categorySchema,
    journalEntrySchema,
    notificationSchema,
  ],
});
