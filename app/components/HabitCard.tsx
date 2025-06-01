import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, FlatList } from 'react-native';
import { Habit } from '../features/habits/HabitTypes';
import { useTheme } from '../theme/ThemeContext';

interface HabitCardProps {
  habit: Habit;
}

const priorityColors: Record<Habit['priority'], string> = {
  none: '#bbb',
  low: '#8bc34a',
  medium: '#ffeb3b',
  high: '#ff9800',
  critical: '#f44336',
};

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { theme } = useTheme ? useTheme() : { theme: { text: '#222', background: '#fff', border: '#eee', input: '#f5f5f5', primary: '#2196f3', borderRadius: 10, spacing: 8, padding: 8, placeholder: '#888', card: '#fff', accent: '#43a047' } };
  const [modalVisible, setModalVisible] = useState(false);
  const [sharedWithInput, setSharedWithInput] = useState('');
  const [sharedWith, setSharedWith] = useState<string[]>(habit.sharedWith || []);

  // Helper: get avatar (first letter or emoji) and email preview
  const getAvatar = (uid: string) => {
    // If email, use first letter; if emoji, show emoji; else fallback
    if (/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(uid)) {
      return uid[0].toUpperCase();
    }
    if (/^[\p{Emoji}]/u.test(uid)) {
      return uid;
    }
    return uid[0].toUpperCase();
  };

  // Visual cue: highlight if shared
  const isShared = sharedWith.length > 0;

  // For demo: update local state only. In real app, would dispatch updateHabitInDB
  const handleAddUser = () => {
    const trimmed = sharedWithInput.trim();
    if (trimmed && !sharedWith.includes(trimmed)) {
      setSharedWith([...sharedWith, trimmed]);
      setSharedWithInput('');
    }
  };
  const handleRemoveUser = (userId: string) => {
    setSharedWith(sharedWith.filter(u => u !== userId));
  };

  return (
    <View style={[
      styles.card,
      { borderLeftColor: habit.color || '#2196f3', borderWidth: isShared ? 2 : 0, borderColor: isShared ? theme.primary : 'transparent', backgroundColor: isShared ? '#e3f2fd' : '#fff' },
    ]}>
      <View style={styles.header}>
        {/* Icon */}
        <View style={[styles.icon, { backgroundColor: habit.color || '#2196f3' }]} />
        <Text style={styles.name}>{habit.name}</Text>
        <View style={[styles.priority, { backgroundColor: priorityColors[habit.priority] }]}>
          <Text style={styles.priorityText}>{habit.priority.charAt(0).toUpperCase()}</Text>
        </View>
        {/* Share button */}
        <TouchableOpacity
          style={{ marginLeft: 10, padding: 4 }}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Share Habit"
        >
          <Text style={{ fontSize: 18, color: theme.primary }}>🤝</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.type}>{habit.type.toUpperCase()}</Text>
      {/* Shared with preview */}
      {sharedWith.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4, alignItems: 'center' }}>
          <Text style={{ color: '#888', fontSize: 12, marginRight: 4 }}>Shared with:</Text>
          {sharedWith.map(uid => (
            <View key={uid} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingVertical: 2, paddingHorizontal: 8, marginRight: 4, marginBottom: 2, borderWidth: 1, borderColor: '#90caf9' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#90caf9', alignItems: 'center', justifyContent: 'center', marginRight: 4 }}>
                <Text style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 13 }}>{getAvatar(uid)}</Text>
              </View>
              <Text style={{ color: '#1976d2', fontSize: 12, maxWidth: 80 }} numberOfLines={1} ellipsizeMode="middle">
                {uid.includes('@') ? uid.replace(/(.{2}).*(@.*)/, '$1***$2') : uid}
              </Text>
            </View>
          ))}
        </View>
      )}
      {/* Share Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.background, borderRadius: 12, padding: 20, width: 320, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8 }}>
            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Share Habit</Text>
            <Text style={{ color: theme.text, fontSize: 14, marginBottom: 8 }}>Enter user ID or email to share with:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: theme.border, borderRadius: 8, padding: 8, color: theme.text, backgroundColor: theme.input, marginRight: 8 }}
                value={sharedWithInput}
                onChangeText={setSharedWithInput}
                placeholder="User ID or email"
                placeholderTextColor={theme.placeholder || '#aaa'}
                accessibilityLabel="User ID or email to share with"
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
                    {item.includes('@') ? item.replace(/(.{2}).*(@.*)/, '$1***$2') : item}
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
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 320,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: '#2196f3',
  },
  name: {
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
  type: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default HabitCard;
