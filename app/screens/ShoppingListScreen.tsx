import { scheduleHabitNotification, cancelScheduledNotification } from '../utils/notifications';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import ShoppingItem from '../components/ShoppingItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShoppingItems, addShoppingItemToDB, updateShoppingItemInDB, deleteShoppingItemFromDB } from '../features/shopping/shoppingThunks';
import { RootState, AppDispatch } from '../features/store';

const ShoppingListScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.shopping.items);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchShoppingItems());
  }, [dispatch]);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter an item name.');
      return;
    }
    const itemId = id || Date.now().toString();
    const item = {
      id: itemId,
      name,
      checked: false,
      listId: 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Cancel previous notification if editing
    if (isEdit) {
      await cancelScheduledNotification(itemId);
      await dispatch(updateShoppingItemInDB(item));
      Alert.alert('Success', 'Item updated!');
    } else {
      await dispatch(addShoppingItemToDB(item));
      Alert.alert('Success', 'Item added!');
    }
    // Schedule notification (default: 8:00 AM daily)
    try {
      await scheduleHabitNotification({
        identifier: itemId,
        title: `Shopping Reminder: ${name}`,
        body: `Don't forget to buy: ${name}`,
        trigger: {
          hour: 8,
          minute: 0,
          repeats: true,
          type: 'daily',
        } as any,
      });
    } catch (e) {
      // Optionally handle notification errors
    }
    setId('');
    setName('');
    setIsEdit(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteShoppingItemFromDB(id));
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: theme.spacing * 2,
          paddingHorizontal: theme.spacing,
        },
      ]}
    >
      <Text style={[styles.title, { color: theme.text, marginBottom: theme.spacing }]}>Shopping List</Text>
      {/* Section: Details */}
      <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16, marginBottom: theme.spacing / 2 }}>Details</Text>
      <View style={[styles.inputRow, { marginBottom: theme.spacing }] }>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              marginRight: theme.spacing / 2,
            },
          ]}
          placeholder="Item Name"
          placeholderTextColor={theme.placeholder}
          value={name}
          onChangeText={setName}
          accessibilityLabel="Item Name"
          returnKeyType="next"
          onSubmitEditing={Keyboard.dismiss}
        />
        {/* Demo: Paste an ID to edit an existing item */}
        <TextInput
          style={[
            styles.input,
            {
              width: 120,
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              marginRight: theme.spacing / 2,
            },
          ]}
          placeholder="Paste ID to Edit"
          placeholderTextColor={theme.placeholder}
          value={id}
          onChangeText={text => {
            setId(text);
            setIsEdit(!!text);
          }}
          accessibilityLabel="Edit Item ID"
          returnKeyType="done"
        />
        <Button
          title={isEdit ? 'Update' : 'Add'}
          onPress={() => { handleAddOrUpdate(); Keyboard.dismiss(); }}
          color={theme.primary}
          accessibilityLabel={isEdit ? 'Update Item' : 'Add Item'}
        />
      </View>
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing, width: '100%' }} />
      {items.length === 0 ? (
        <Text style={{ color: theme.text }}>No items yet. Add one!</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ShoppingItem item={item} />
              <Button title="Delete" color="#f44336" onPress={() => handleDelete(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    fontSize: 16,
  },
});

export default ShoppingListScreen;
