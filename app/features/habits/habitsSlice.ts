
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Habit, HabitLog } from './HabitTypes';
import { fetchHabits } from './habitsThunks';
import { fetchHabitLogs } from './habitLogsThunks';

interface HabitsState {
  habits: Habit[];
  logs: HabitLog[];
}

const initialState: HabitsState = {
  habits: [],
  logs: [],
};

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit(state, action: PayloadAction<Habit>) {
      state.habits.push(action.payload);
    },
    updateHabit(state, action: PayloadAction<Habit>) {
      const idx = state.habits.findIndex(h => h.id === action.payload.id);
      if (idx !== -1) state.habits[idx] = action.payload;
    },
    deleteHabit(state, action: PayloadAction<string>) {
      state.habits = state.habits.filter(h => h.id !== action.payload);
      state.logs = state.logs.filter(l => l.habitId !== action.payload);
    },
    addHabitLog(state, action: PayloadAction<HabitLog>) {
      state.logs.push(action.payload);
    },
    updateHabitLog(state, action: PayloadAction<HabitLog>) {
      const idx = state.logs.findIndex(l => l.id === action.payload.id);
      if (idx !== -1) state.logs[idx] = action.payload;
    },
    deleteHabitLog(state, action: PayloadAction<string>) {
      state.logs = state.logs.filter(l => l.id !== action.payload);
    },
    clearHabitLogs(state) {
      state.logs = [];
    },

  },
  extraReducers: (builder) => {
    builder.addCase(fetchHabits.fulfilled, (state, action) => {
      state.habits = action.payload;
    });
    builder.addCase(fetchHabitLogs.fulfilled, (state, action) => {
      state.logs = action.payload;
    });
  },
});

export const {
  addHabit,
  updateHabit,
  deleteHabit,
  addHabitLog,
  updateHabitLog,
  deleteHabitLog,
  clearHabitLogs,
} = habitsSlice.actions;
export default habitsSlice.reducer;
