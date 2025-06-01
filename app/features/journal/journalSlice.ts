import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { JournalEntry } from '../../types';

interface JournalState {
  entries: JournalEntry[];
}

const initialState: JournalState = {
  entries: [],
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addEntry(state, action: PayloadAction<JournalEntry>) {
      state.entries.push(action.payload);
    },
    updateEntry(state, action: PayloadAction<JournalEntry>) {
      const idx = state.entries.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state.entries[idx] = action.payload;
    },
    deleteEntry(state, action: PayloadAction<string>) {
      state.entries = state.entries.filter(e => e.id !== action.payload);
    },
  },
});

export const { addEntry, updateEntry, deleteEntry } = journalSlice.actions;
export default journalSlice.reducer;
