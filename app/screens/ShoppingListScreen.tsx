import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShoppingItems } from '../features/shopping/shoppingThunks';
import { RootState, AppDispatch } from '../features/store';

const ShoppingListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.shopping.items);

  useEffect(() => {
    dispatch(fetchShoppingItems());
  }, [dispatch]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Shopping List</Text>
      {items.length === 0 ? (
        <Text>No items yet. Add one!</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 12, marginVertical: 6, backgroundColor: '#f0f0f0', borderRadius: 8, width: 320 }}>
              <Text style={{ fontSize: 18 }}>{item.name}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ShoppingListScreen;
