import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Keyboard, Image } from 'react-native';
import CategoryItem from '../components/CategoryItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories, addCategoryToDB, updateCategoryInDB, deleteCategoryFromDB } from '../features/categories/categoriesThunks';
import { useTheme } from '../theme/ThemeContext';
import { RootState, AppDispatch } from '../features/store';

const SettingsScreen = () => {
  const { theme, mode, toggleTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const categories = useSelector((state: RootState) => state.categories.categories);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#607d8b');
  const [icon, setIcon] = useState('📁');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter a category name.');
      return;
    }
    const category = {
      id: id || Date.now().toString(),
      name,
      color,
      icon,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (isEdit) {
      await dispatch(updateCategoryInDB(category));
      Alert.alert('Success', 'Category updated!');
    } else {
      await dispatch(addCategoryToDB(category));
      Alert.alert('Success', 'Category added!');
    }
    setId('');
    setName('');
    setColor('#607d8b');
    setIcon('📁');
    setIsEdit(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteCategoryFromDB(id));
  };

  // Daily header with date and logo
  const today = new Date();
  const dateString = today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

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
      {/* Daily header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing * 1.5, width: '100%' }}>
        <Image source={require('../assets/icon.png')} style={{ width: 32, height: 32, marginRight: theme.spacing }} />
        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', flex: 1 }}>{dateString}</Text>
      </View>

      {/* Theme section */}
      <Text style={[styles.sectionLabel, { color: theme.text, marginBottom: theme.spacing / 2 }]}>Theme</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing }}>
        <Button
          title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`}
          onPress={toggleTheme}
          color={theme.primary}
          accessibilityLabel="Toggle Theme"
        />
      </View>
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing, width: '100%' }} />

      {/* Categories section */}
      <Text style={[styles.sectionLabel, { color: theme.text, marginBottom: theme.spacing / 2 }]}>Categories</Text>
      {/* Section: Details */}
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
              minWidth: 100,
            },
          ]}
          placeholder="Category Name"
          placeholderTextColor={theme.placeholder}
          value={name}
          onChangeText={setName}
          accessibilityLabel="Category Name"
          returnKeyType="next"
          onSubmitEditing={Keyboard.dismiss}
        />
        <TouchableOpacity
          style={[
            styles.colorPicker,
            {
              backgroundColor: color,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              marginRight: theme.spacing / 2,
              shadowColor: color,
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 2,
            },
          ]}
          onPress={() => { /* Future: open color picker modal */ }}
          accessibilityLabel="Pick Category Color"
          activeOpacity={0.7}
        >
          <Text style={{ color: theme.text, fontSize: 16 }}>🎨</Text>
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              width: 80,
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              marginRight: theme.spacing / 2,
            },
          ]}
          placeholder="Color"
          placeholderTextColor={theme.placeholder}
          value={color}
          onChangeText={setColor}
          accessibilityLabel="Category Color Hex"
          returnKeyType="next"
        />
        <TouchableOpacity
          style={[
            styles.iconPicker,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              marginRight: theme.spacing / 2,
              shadowColor: theme.text,
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 1,
            },
          ]}
          onPress={() => { /* Future: open emoji picker modal */ }}
          accessibilityLabel="Pick Category Icon"
          activeOpacity={0.7}
        >
          <Text style={{ fontSize: 20 }}>{icon}</Text>
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              width: 50,
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              marginRight: theme.spacing / 2,
            },
          ]}
          placeholder="Icon"
          placeholderTextColor={theme.placeholder}
          value={icon}
          onChangeText={setIcon}
          maxLength={2}
          accessibilityLabel="Category Icon Emoji"
          returnKeyType="next"
        />
        {/* Demo: Paste an ID to edit an existing category */}
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
          accessibilityLabel="Edit Category ID"
          returnKeyType="done"
        />
        <Button
          title={isEdit ? 'Update' : 'Add'}
          onPress={() => { handleAddOrUpdate(); Keyboard.dismiss(); }}
          color={theme.primary}
          accessibilityLabel={isEdit ? 'Update Category' : 'Add Category'}
        />
      </View>
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing, width: '100%' }} />
      {/* Helper text for pickers */}
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing / 2, width: '100%' }}>
        <Text style={{ color: theme.placeholder, fontSize: 12, marginRight: theme.spacing }}>
          Tap 🎨 to pick color, emoji to pick icon
        </Text>
      </View>
      {categories.length === 0 ? (
        <Text style={{ color: theme.text }}>No categories found.</Text>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: theme.spacing * 2 }}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.input,
                borderRadius: theme.borderRadius,
                marginBottom: theme.spacing / 1.5,
                padding: theme.padding,
                shadowColor: theme.text,
                shadowOpacity: 0.04,
                shadowRadius: 2,
                elevation: 1,
                width: '100%',
              }}
            >
              {/* Color swatch */}
              <View style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: item.color,
                marginRight: theme.spacing,
                borderWidth: 1,
                borderColor: theme.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 16 }}>{item.icon}</Text>
              </View>
              <CategoryItem category={item} />
              {!item.isDefault && (
                <Button title="Delete" color="#f44336" onPress={() => handleDelete(item.id)} />
              )}
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
    width: '100%',
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    fontSize: 16,
  },
  colorPicker: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  iconPicker: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default SettingsScreen;