import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, FlatList } from 'react-native';
import { ShoppingItem as ShoppingItemType } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface ShoppingItemProps {
  item: ShoppingItemType;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ item }) => {
  const { theme } = useTheme ? useTheme() : { theme: { text: '#222', background: '#fff', border: '#eee', input: '#f5f5f5', primary: '#2196f3', borderRadius: 10, spacing: 8, padding: 8, placeholder: '#888', card: '#fff', accent: '#43a047' } };
  const [modalVisible, setModalVisible] = useState(false);
  const [sharedWithInput, setSharedWithInput] = useState('');
  const [sharedWith, setSharedWith] = useState<string[]>(item.sharedWith || []);

  // For demo: update local state only. In real app, would dispatch updateShoppingItemInDB
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
    <View style={[styles.card, item.checked && styles.checked]}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        {item.checked && <Text style={styles.checkmark}>✔</Text>}
        {/* Share button */}
        <TouchableOpacity
          style={{ marginLeft: 10, padding: 4 }}
          onPress={() => setModalVisible(true)}
          accessibilityLabel="Share Shopping Item"
        >
          <Text style={{ fontSize: 18, color: theme.primary }}>🤝</Text>
        </TouchableOpacity>
      </View>
      {item.listId && <Text style={styles.listId}>List: {item.listId}</Text>}
      {/* Shared with preview */}
      {sharedWith.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
          <Text style={{ color: '#888', fontSize: 12, marginRight: 4 }}>Shared with:</Text>
          {sharedWith.map(uid => (
            <View key={uid} style={{ backgroundColor: '#e3f2fd', borderRadius: 8, paddingHorizontal: 6, marginRight: 4, marginBottom: 2 }}>
              <Text style={{ color: '#1976d2', fontSize: 12 }}>{uid}</Text>
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
            <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Share Shopping Item</Text>
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
                  <Text style={{ color: theme.text, fontSize: 14, flex: 1 }}>{item}</Text>
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
    borderLeftColor: '#4caf50',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 320,
  },
  checked: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  checkmark: {
    fontSize: 18,
    color: '#4caf50',
    marginLeft: 8,
  },
  listId: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default ShoppingItem;
