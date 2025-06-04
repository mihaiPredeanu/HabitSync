import { configureStore } from '@reduxjs/toolkit';

import habitsReducer from './habits/habitsSlice';
import todosReducer from './todos/todosSlice';
import shoppingReducer from './shopping/shoppingSlice';
import shoppingListsReducer from './shopping/shoppingListsSlice';
import categoriesReducer from './categories/categoriesSlice';
import journalReducer from './journal/journalSlice';
import notificationsReducer from './notifications/notificationsSlice';
import activityLogsReducer from './activityLogs/activityLogsSlice';

export const store = configureStore({
  reducer: {
    habits: habitsReducer,
    todos: todosReducer,
    shopping: shoppingReducer,
    shoppingLists: shoppingListsReducer,
    categories: categoriesReducer,
    journal: journalReducer,
    notifications: notificationsReducer,
    activityLogs: activityLogsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
