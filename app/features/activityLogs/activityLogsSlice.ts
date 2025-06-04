import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActivityLog } from '../../types';

interface ActivityLogsState {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivityLogsState = {
  logs: [],
  loading: false,
  error: null,
};

const activityLogsSlice = createSlice({
  name: 'activityLogs',
  initialState,
  reducers: {
    setActivityLogs(state, action: PayloadAction<ActivityLog[]>) {
      state.logs = action.payload;
    },
    addActivityLog(state, action: PayloadAction<ActivityLog>) {
      state.logs.unshift(action.payload);
    },
    setActivityLogsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setActivityLogsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearActivityLogs(state) {
      state.logs = [];
      state.error = null;
    },
  },
});

export const {
  setActivityLogs,
  addActivityLog,
  setActivityLogsLoading,
  setActivityLogsError,
  clearActivityLogs,
} = activityLogsSlice.actions;

export default activityLogsSlice.reducer;
