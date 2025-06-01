// Core types for Habits and Habit Logs

export type HabitType = 'binary' | 'numeric';
export type HabitPriority = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type HabitFrequencyType = 'daily' | 'every_x_days' | 'x_times_per_week' | 'x_times_per_month' | 'specific_days';
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'any';

export interface HabitFrequency {
  type: HabitFrequencyType;
  value?: number; // e.g., every 2 days, 3 times per week
  daysOfWeek?: number[]; // 0=Sunday, 6=Saturday
}

export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  type: HabitType;
  frequency: HabitFrequency;
  priority: HabitPriority;
  categoryId?: string;
  createdAt: string;
  updatedAt: string;
  archived?: boolean;
  sharedWith?: string[]; // user ids
  isDefault?: boolean;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  value: boolean | number;
  note?: string;
  timeOfDay?: TimeOfDay;
  createdAt: string;
}
