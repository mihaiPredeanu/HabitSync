import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShoppingItem as ShoppingItemType } from '../types';

interface ShoppingItemProps {
  item: ShoppingItemType;
}

const ShoppingItem: React.FC<ShoppingItemProps> = ({ item }) => {
  return (
    <View style={[styles.card, item.checked && styles.checked]}>
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        {item.checked && <Text style={styles.checkmark}>✔</Text>}
      </View>
      {item.listId && <Text style={styles.listId}>List: {item.listId}</Text>}
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
