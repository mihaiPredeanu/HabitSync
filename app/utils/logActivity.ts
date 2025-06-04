import { AppDispatch } from '../features/store';
import { createActivityLog } from '../features/activityLogs/activityLogsThunks';
import { ActivityLog } from '../types';

/**
 * Utility to log an activity for a shared item (to-do or shopping item).
 *
 * @param params - Activity log params
 * @param dispatch - Redux dispatch
 */
export function logActivity(
  params: {
    itemId: string;
    itemType: 'todo' | 'shopping';
    action: string;
    userId: string;
    details?: string;
    timestamp?: number;
  },
  dispatch: AppDispatch
) {
  const log: Omit<ActivityLog, 'id'> = {
    itemId: params.itemId,
    itemType: params.itemType,
    action: params.action,
    userId: params.userId,
    details: params.details,
    timestamp: params.timestamp || Date.now(),
  };
  dispatch(createActivityLog(log));
}
