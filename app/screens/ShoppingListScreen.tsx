import { scheduleHabitNotification, cancelScheduledNotification } from '../utils/notifications';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import ShoppingItem from '../components/ShoppingItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShoppingItems, addShoppingItemToDB, updateShoppingItemInDB, deleteShoppingItemFromDB } from '../features/shopping/shoppingThunks';
import { fetchShoppingLists, addShoppingListToDB, updateShoppingListInDB, deleteShoppingListFromDB } from '../features/shopping/shoppingListsThunks';
import { RootState, AppDispatch } from '../features/store';

const ShoppingListScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.shopping.items);
  const shoppingLists = useSelector((state: RootState) => state.shoppingLists.lists);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Shopping lists state
  const [listName, setListName] = useState('');
  const [lists, setLists] = useState<string[]>(['default']); // legacy, for fallback
  const [selectedList, setSelectedList] = useState<string>('');
  const [renamingList, setRenamingList] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  useEffect(() => {
    dispatch(fetchShoppingItems());
    dispatch(fetchShoppingLists());
  }, [dispatch]);

  useEffect(() => {
    if (shoppingLists.length > 0) {
      if (!selectedList || !shoppingLists.some(l => l.id === selectedList)) {
        setSelectedList(shoppingLists[0].id);
      }
    }
  }, [shoppingLists, selectedList]);

  const handleAddOrUpdate = async () => {
    setError(null);
    const itemId = id || Date.now().toString();
    const item = {
      id: itemId,
      name,
      checked: false,
      listId: selectedList,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Cancel previous notification if editing
    let result;
    if (isEdit) {
      await cancelScheduledNotification(itemId);
      result = await dispatch(updateShoppingItemInDB(item));
    } else {
      result = await dispatch(addShoppingItemToDB(item));
    }
    // Handle validation errors from thunk
    if (result && result.payload && typeof result.payload === 'string') {
      setError(result.payload);
      return;
    }
    Alert.alert('Success', isEdit ? 'Item updated!' : 'Item added!');
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
      {/* Shopping List Picker & Creator */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing }}>
        <Text style={{ color: theme.text, fontWeight: 'bold', marginRight: theme.spacing / 2 }}>List:</Text>
        <FlatList
          data={shoppingLists}
          horizontal
          keyExtractor={l => l.id}
          renderItem={({ item: l }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 4 }}>
              <Button
                title={l.name}
                color={selectedList === l.id ? theme.primary : theme.input}
                onPress={() => setSelectedList(l.id)}
              />
              {l.name !== 'default' && (
                <>
                  <Button
                    title={renamingList === l.id ? 'Save' : '✏️'}
                    color={theme.accent || theme.primary}
                    onPress={async () => {
                      if (renamingList === l.id) {
                        const trimmed = renameValue.trim();
                        if (trimmed && !shoppingLists.some(x => x.name === trimmed)) {
                          const result = await dispatch(updateShoppingListInDB({ id: l.id, name: trimmed }));
                          if (
                            result &&
                            result.payload &&
                            typeof result.payload === 'object' &&
                            'id' in result.payload &&
                            typeof result.payload.id === 'string' &&
                            selectedList === l.id
                          ) {
                            setSelectedList(result.payload.id);
                          }
                        }
                        setRenamingList(null);
                        setRenameValue('');
                      } else {
                        setRenamingList(l.id);
                        setRenameValue(l.name);
                      }
                    }}
                  />
                  <Button
                    title="🗑"
                    color="#f44336"
                    onPress={async () => {
                      await dispatch(deleteShoppingListFromDB(l.id));
                      if (selectedList === l.id && shoppingLists.length > 1) {
                        setSelectedList(shoppingLists.find(x => x.id !== l.id)?.id || '');
                      }
                    }}
                  />
                </>
              )}
            </View>
          )}
          style={{ maxHeight: 36, marginRight: theme.spacing }}
        />
        {renamingList ? (
          <TextInput
            style={{
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              width: 100,
              marginRight: theme.spacing / 2,
            }}
            placeholder="Rename List"
            placeholderTextColor={theme.placeholder}
            value={renameValue}
            onChangeText={setRenameValue}
            accessibilityLabel="Rename List Name"
          />
        ) : (
          <TextInput
            style={{
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              width: 100,
              marginRight: theme.spacing / 2,
            }}
            placeholder="New List"
            placeholderTextColor={theme.placeholder}
            value={listName}
            onChangeText={setListName}
            accessibilityLabel="New List Name"
          />
        )}
        {!renamingList && (
          <Button
            title="Add"
            color={theme.accent || theme.primary}
            onPress={async () => {
              const trimmed = listName.trim();
              if (trimmed && !shoppingLists.some(x => x.name === trimmed)) {
                const result = await dispatch(addShoppingListToDB(trimmed));
                if (
                  result &&
                  result.payload &&
                  typeof result.payload === 'object' &&
                  'id' in result.payload &&
                  typeof result.payload.id === 'string'
                ) {
                  setSelectedList(result.payload.id);
                }
                setListName('');
              }
            }}
          />
        )}
      </View>
      {/* Section: Details */}
      <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16, marginBottom: theme.spacing / 2 }}>Details</Text>
      {error && (
        <Text style={{ color: '#f44336', marginBottom: theme.spacing / 2, fontSize: 14 }}>{error}</Text>
      )}
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
      {items.filter(i => i.listId === selectedList).length === 0 ? (
        <Text style={{ color: theme.text }}>No items in this list yet. Add one!</Text>
      ) : (
        <FlatList
          data={items.filter(i => i.listId === selectedList)}
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
