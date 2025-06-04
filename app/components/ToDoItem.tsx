import React, { useState } from 'react';
import ActivityLogList from './ActivityLogList';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, FlatList, Alert } from 'react-native';
import { ToDo } from '../types';
import { useTheme } from '../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../features/store';
import { updateTodoInDB } from '../features/todos/todosThunks';
import { triggerToDoShareNotification, sendPushNotificationToUser } from '../utils/notifications';
import { logActivity } from '../utils/logActivity';

interface ToDoItemProps {
  todo: ToDo;
}

const priorityColors: Record<ToDo['priority'], string> = {
  none: '#bbb',
  low: '#8bc34a',
  medium: '#ffeb3b',
  high: '#ff9800',
  critical: '#f44336',
};

const ToDoItem: React.FC<ToDoItemProps> = ({ todo }) => {
  const { theme } = useTheme ? useTheme() : { theme: { text: '#222', background: '#fff', border: '#eee', input: '#f5f5f5', primary: '#2196f3', borderRadius: 10, spacing: 8, padding: 8, placeholder: '#888', card: '#fff', accent: '#43a047' } };
  const dispatch = useDispatch<AppDispatch>();
  const [modalVisible, setModalVisible] = useState(false);
  const [sharedWithInput, setSharedWithInput] = useState('');
  const [sharedWith, setSharedWith] = useState<string[]>(todo.sharedWith || []);

  // Persist sharedWith changes to DB and Redux
  const persistSharedWith = async (newSharedWith: string[]) => {
    const updatedToDo = {
      ...todo,
      sharedWith: newSharedWith,
      updatedAt: new Date().toISOString(),
    };
    await dispatch(updateTodoInDB(updatedToDo));
  };

  // Helper: get Expo push token for a user (stub, replace with real lookup)
  const getExpoPushTokenForUser = async (userId: string): Promise<string | null> => {
    // TODO: Replace with real lookup from backend or user profile
    return null; // e.g., await api.getPushToken(userId)
  };

  const handleAddUser = async () => {
    const trimmed = sharedWithInput.trim();
    if (trimmed && !sharedWith.includes(trimmed)) {
      const newSharedWith = [...sharedWith, trimmed];
      setSharedWith(newSharedWith);
      setSharedWithInput('');
      await persistSharedWith(newSharedWith);
      Alert.alert('Shared', `To-Do shared with ${trimmed}`);
      await triggerToDoShareNotification({
        todoTitle: todo.title,
        userId: trimmed,
        action: 'shared',
      });
      // Log activity
      logActivity({
        itemId: todo.id,
        itemType: 'todo',
        action: 'shared',
        userId: trimmed,
        details: `Shared with ${trimmed}`,
      }, dispatch);
      // Remote push notification to collaborator (if token available)
      const pushToken = await getExpoPushTokenForUser(trimmed);
      if (pushToken) {
        await sendPushNotificationToUser({
          expoPushToken: pushToken,
          title: 'You have a new shared To-Do!',
          body: `"${todo.title}" was shared with you.`,
          data: { todoId: todo.id, action: 'shared' },
        });
      }
    }
  };

  const handleRemoveUser = async (userId: string) => {
    const newSharedWith = sharedWith.filter(u => u !== userId);
    setSharedWith(newSharedWith);
    await persistSharedWith(newSharedWith);
    Alert.alert('Unshared', `To-Do unshared with ${userId}`);
    await triggerToDoShareNotification({
      todoTitle: todo.title,
      userId,
      action: 'unshared',
    });
    // Log activity
    logActivity({
      itemId: todo.id,
      itemType: 'todo',
      action: 'unshared',
      userId,
      details: `Unshared with ${userId}`,
    }, dispatch);
    // Remote push notification to collaborator (if token available)
    const pushToken = await getExpoPushTokenForUser(userId);
    if (pushToken) {
      await sendPushNotificationToUser({
        expoPushToken: pushToken,
        title: 'A To-Do was unshared',
        body: `"${todo.title}" is no longer shared with you.`,
        data: { todoId: todo.id, action: 'unshared' },
      });
    }
  };

  // Helper: get avatar (initial or emoji)
  const getAvatar = (uid: string) => {
    if (/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(uid)) {
      return uid[0].toUpperCase();
    }
    if (/^[\p{Emoji}]/u.test(uid)) {
      return uid;
    }
    return uid[0].toUpperCase();
  };

  // Mask user ID/email for privacy
  const maskUserId = (uid: string) => {
    if (uid.includes('@')) {
      return uid.replace(/(.{2}).*(@.*)/, '$1***$2');
    }
    if (uid.length > 6) {
      return uid.slice(0, 2) + '***' + uid.slice(-2);
    }
    return uid;
  };

  const isShared = sharedWith.length > 0;

  return (
    <View style={[styles.card, todo.completed && styles.completed, isShared && { borderColor: theme.primary, borderWidth: 2, backgroundColor: theme.card || '#e3f2fd' }]}> 
      <View style={styles.header}>
        <Text style={styles.title}>{todo.title}</Text>
        {isShared && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 6 }}>
            <Text style={{ color: theme.primary, fontSize: 16, fontWeight: 'bold', marginRight: 2 }} accessibilityLabel="Shared To-Do">🤝</Text>
            <Text style={{ color: theme.primary, fontSize: 12, fontWeight: 'bold' }}>Shared</Text>
          </View>
        )}
        <View style={[styles.priority, { backgroundColor: priorityColors[todo.priority] }]}> 
          <Text style={styles.priorityText}>{todo.priority.charAt(0).toUpperCase()}</Text>
        </View>
        {/* Share button */}
        <TouchableOpacity
          style={{ marginLeft: 10, padding: 4 }}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Share To-Do"
        >
          <Text style={{ fontSize: 18, color: theme.primary }}>🤝</Text>
        </TouchableOpacity>
      </View>
      {/* Recurring info */}
      {todo.recurring && (
        <Text style={{ color: '#43a047', fontSize: 13, marginBottom: 2 }}>
          🔁 {todo.recurrenceRule ? todo.recurrenceRule : 'Recurring'}
        </Text>
      )}
      {todo.dueDate && <Text style={styles.dueDate}>Due: {todo.dueDate}</Text>}
      {/* Shared with preview */}
      {isShared && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, alignItems: 'center' }}>
          <Text style={{ color: '#888', fontSize: 12, marginRight: 4 }}>Shared with:</Text>
          {sharedWith.map(uid => (
            <View key={uid} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 2, paddingHorizontal: 8, marginRight: 4, marginBottom: 2, borderWidth: 1, borderColor: '#90caf9' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#90caf9', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 13 }}>{getAvatar(uid)}</Text>
              </View>
              <Text style={{ color: '#1976d2', fontSize: 12, maxWidth: 80 }} numberOfLines={1} ellipsizeMode="middle">
                {maskUserId(uid)}
              </Text>
            </View>
          ))}
        </View>
      )}
      {/* Activity Log */}
      <View style={{ marginTop: 8 }}>
        <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 14, marginBottom: 2 }}>Activity Log</Text>
        <ActivityLogList itemId={todo.id} itemType="todo" />
      </View>
      {/* Share Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.background, borderRadius: 12, padding: 20, width: 320, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}>
            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Share To-Do</Text>
            <Text style={{ color: theme.text, fontSize: 14, marginBottom: 8 }}>Enter user ID to share with:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: theme.border, borderRadius: 8, padding: 8, color: theme.text, backgroundColor: theme.input, marginRight: 8 }}
                value={sharedWithInput}
                onChangeText={setSharedWithInput}
                placeholder="User ID"
                placeholderTextColor={theme.placeholder || '#aaa'}
                accessibilityLabel="User ID to share with"
              />
              <Button title="Add" onPress={handleAddUser} color={theme.primary} />
            </View>
            <FlatList
              data={sharedWith}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#90caf9', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                    <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 13 }}>{getAvatar(item)}</Text>
                  </View>
                  <Text style={{ color: theme.text, fontSize: 14, flex: 1 }} numberOfLines={1} ellipsizeMode="middle">
                    {maskUserId(item)}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveUser(item)} accessibilityLabel={`Remove ${item}`}>
                    <Text style={{ color: '#f44336', fontSize: 16, marginLeft: 8 }}>Remove</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={<Text style={{ color: theme.placeholder || '#aaa', fontSize: 13 }}>No users yet.</Text>}
              style={{ maxHeight: 120, marginBottom: 10 }}
            />
            <Button title="Done" onPress={() => setModalVisible(false)} color={theme.primary} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#2196f3',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 320,
  },
  completed: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priority: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dueDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default ToDoItem;
