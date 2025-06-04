import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../features/store';
import { fetchActivityLogsForItem } from '../features/activityLogs/activityLogsThunks';
import { ActivityLog } from '../types';

interface ActivityLogListProps {
  itemId: string;
  itemType: 'todo' | 'shopping';
}

const actionLabels: Record<string, string> = {
  shared: 'Shared',
  unshared: 'Unshared',
  edited: 'Edited',
  completed: 'Completed',
  comment: 'Commented',
};

export const ActivityLogList: React.FC<ActivityLogListProps> = ({ itemId, itemType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { logs, loading, error } = useSelector((state: RootState) => state.activityLogs);

  useEffect(() => {
    dispatch(fetchActivityLogsForItem({ itemId, itemType }));
  }, [dispatch, itemId, itemType]);

  if (loading) return <ActivityIndicator size="small" style={{ margin: 8 }} />;
  if (error) return <Text style={{ color: 'red', margin: 8 }}>{error}</Text>;
  if (!logs.length) return <Text style={{ color: '#888', margin: 8 }}>No activity yet.</Text>;

  return (
    <FlatList
      data={logs}
      keyExtractor={log => log.id}
      renderItem={({ item }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
          <Text style={{ fontWeight: 'bold', marginRight: 6 }}>
            {actionLabels[item.action] || item.action}
          </Text>
          <Text style={{ color: '#1976d2', marginRight: 6 }}>{item.userId}</Text>
          <Text style={{ color: '#888', fontSize: 12 }}>
            {item.details ? `(${item.details}) ` : ''}
            {new Date(item.timestamp).toLocaleString()}
          </Text>
        </View>
      )}
      style={{ marginVertical: 8, paddingHorizontal: 8 }}
    />
  );
};

export default ActivityLogList;
