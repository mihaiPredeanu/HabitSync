// Global types for HabitSync

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ToDoTimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';

export interface ToDo {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  recurring?: boolean;
  recurrenceRule?: string;
  priority: 'none' | 'low' | 'medium' | 'high' | 'critical';
  timeOfDay?: ToDoTimeOfDay;
  categoryId?: string;
  sharedWith?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  checked: boolean;
  listId: string;
  sharedWith?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: string;
}
