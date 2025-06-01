import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Category } from '../types';

interface CategoryItemProps {
  category: Category;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category }) => {
  return (
    <View style={[styles.card, { borderLeftColor: category.color || '#607d8b' }]}> 
      <View style={styles.header}>
        {/* Placeholder for icon */}
        <View style={[styles.icon, { backgroundColor: category.color || '#607d8b' }]} />
        <Text style={styles.name}>{category.name}</Text>
        {category.isDefault && (
          <Text style={styles.defaultLabel}>Default</Text>
        )}
      </View>
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
    backgroundColor: '#607d8b',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  defaultLabel: {
    fontSize: 13,
    color: '#607d8b',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default CategoryItem;
