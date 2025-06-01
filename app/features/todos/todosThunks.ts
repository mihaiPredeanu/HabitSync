import { createAsyncThunk } from '@reduxjs/toolkit';
import { database } from '../../db/watermelon';
import { ToDo } from '../../types';
import { addTodo, updateTodo, deleteTodo, toggleTodo } from './todosSlice';

const todoFromRecord = (record: any): ToDo => ({
  id: record.id,
  title: record.title,
  completed: record.completed,
  dueDate: record.due_date,
  recurring: record.recurring,
  recurrenceRule: record.recurrence_rule,
  priority: record.priority,
  timeOfDay: record.time_of_day as ToDo['timeOfDay'],
  categoryId: record.category_id,
  sharedWith: record.shared_with ? record.shared_with.split(',') : undefined,
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

export const fetchTodos = createAsyncThunk('todos/fetchAll', async (_, thunkAPI) => {
  const collection = database.get('todos');
  const records = await collection.query().fetch();
  return records.map(todoFromRecord);
});

export const addTodoToDB = createAsyncThunk('todos/addToDB', async (todo: ToDo, thunkAPI) => {
  const collection = database.get('todos');
  await database.write(async () => {
    await collection.create((rec: any) => {
      rec.title = todo.title;
      rec.completed = todo.completed;
      rec.due_date = todo.dueDate;
      rec.recurring = todo.recurring;
      rec.recurrence_rule = todo.recurrenceRule;
      rec.priority = todo.priority;
      rec.time_of_day = todo.timeOfDay || 'any';
      rec.category_id = todo.categoryId;
      rec.shared_with = todo.sharedWith?.join(',') || '';
      rec.created_at = todo.createdAt;
      rec.updated_at = todo.updatedAt;
    });
  });
  thunkAPI.dispatch(addTodo(todo));
});

export const updateTodoInDB = createAsyncThunk('todos/updateInDB', async (todo: ToDo, thunkAPI) => {
  const collection = database.get('todos');
  const record = await collection.find(todo.id);
  await database.write(async () => {
    await record.update((rec: any) => {
      rec.title = todo.title;
      rec.completed = todo.completed;
      rec.due_date = todo.dueDate;
      rec.recurring = todo.recurring;
      rec.recurrence_rule = todo.recurrenceRule;
      rec.priority = todo.priority;
      rec.time_of_day = todo.timeOfDay || 'any';
      rec.category_id = todo.categoryId;
      rec.shared_with = todo.sharedWith?.join(',') || '';
      rec.updated_at = todo.updatedAt;
    });
  });
  thunkAPI.dispatch(updateTodo(todo));
});

export const deleteTodoFromDB = createAsyncThunk('todos/deleteFromDB', async (id: string, thunkAPI) => {
  const collection = database.get('todos');
  const record = await collection.find(id);
  await database.write(async () => {
    await record.markAsDeleted();
    await record.destroyPermanently();
  });
  thunkAPI.dispatch(deleteTodo(id));
});
