import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Keyboard, Platform } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { addHabitToDB, updateHabitInDB } from '../features/habits/habitsThunks';
import { scheduleHabitNotification, cancelScheduledNotification } from '../utils/notifications';
import { Habit, HabitPriority, HabitType, HabitFrequency } from '../features/habits/HabitTypes';
import { AppDispatch } from '../features/store';

const defaultFrequency: HabitFrequency = { type: 'daily' };


// For demo: allow editing a habit by pasting its ID (in real app, this would be navigated to with params)
const AddHabitScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { theme } = useTheme();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [color, setColor] = useState('#2196f3');
  const [icon, setIcon] = useState('🌟');
  const [type, setType] = useState<HabitType>('binary');
  const [priority, setPriority] = useState<HabitPriority>('none');
  const [isEdit, setIsEdit] = useState(false);

  const handleAddOrUpdate = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Please enter a habit name.');
      return;
    }
    const habitId = id || Date.now().toString();
    const habit: Habit = {
      id: habitId,
      name,
      color,
      icon,
      type,
      frequency: defaultFrequency,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Cancel previous notification if editing
    if (isEdit) {
      await cancelScheduledNotification(habitId);
      await dispatch(updateHabitInDB(habit));
      Alert.alert('Success', 'Habit updated!');
    } else {
      await dispatch(addHabitToDB(habit));
      Alert.alert('Success', 'Habit added!');
    }
    // Schedule notification (default: 8:00 AM daily)
    try {
      await scheduleHabitNotification({
        identifier: habitId,
        title: `Habit Reminder: ${name}`,
        body: `Don't forget to log your habit: ${name}`,
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
    setColor('#2196f3');
    setIcon('🌟');
    setType('binary');
    setPriority('none');
    setIsEdit(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingTop: theme.spacing * 3,
          paddingHorizontal: theme.spacing * 1.5,
        },
      ]}
      accessible={true}
      accessibilityLabel="Add or Edit Habit Screen"
    >
      <Text style={[styles.title, { color: theme.text, marginBottom: theme.spacing * 1.5 }]}> 
        {isEdit ? 'Edit Habit' : 'Add Habit'}
      </Text>

      {/* Section: Details */}
      <Text style={[styles.sectionHeading, { color: theme.text, marginBottom: theme.spacing / 2 }]}>Details</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            color: theme.text,
            borderColor: theme.border,
            borderRadius: theme.borderRadius,
            padding: theme.padding,
            marginBottom: theme.spacing,
          },
        ]}
        placeholder="Habit Name"
        placeholderTextColor={theme.placeholder}
        value={name}
        onChangeText={setName}
        accessibilityLabel="Habit Name"
        returnKeyType="next"
        onSubmitEditing={Keyboard.dismiss}
      />

      {/* Section: Customize */}
      <Text style={[styles.sectionHeading, { color: theme.text, marginBottom: theme.spacing / 2 }]}>Customize</Text>
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing }}>
        <TouchableOpacity
          style={[
            styles.colorPicker,
            {
              backgroundColor: color,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              marginRight: theme.spacing,
            },
          ]}
          onPress={() => { /* Future: open color picker modal */ }}
          accessibilityLabel="Pick Color"
        >
          <Text style={{ color: theme.text, fontSize: 16 }}>🎨</Text>
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              flex: 1,
            },
          ]}
          placeholder="Color (hex)"
          placeholderTextColor={theme.placeholder}
          value={color}
          onChangeText={setColor}
          accessibilityLabel="Color Hex"
          returnKeyType="next"
        />
      </View>
      <Text style={{ color: theme.placeholder, marginBottom: theme.spacing / 2, fontSize: 12 }}>
        Example: #2196f3
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: theme.spacing }}>
        <TouchableOpacity
          style={[
            styles.iconPicker,
            {
              backgroundColor: theme.input,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              marginRight: theme.spacing,
            },
          ]}
          onPress={() => { /* Future: open emoji picker modal */ }}
          accessibilityLabel="Pick Icon"
        >
          <Text style={{ fontSize: 24 }}>{icon}</Text>
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.input,
              color: theme.text,
              borderColor: theme.border,
              borderRadius: theme.borderRadius,
              padding: theme.padding,
              flex: 1,
            },
          ]}
          placeholder="Icon (emoji)"
          placeholderTextColor={theme.placeholder}
          value={icon}
          onChangeText={setIcon}
          maxLength={2}
          accessibilityLabel="Icon Emoji"
          returnKeyType="done"
        />
      </View>
      <Text style={{ color: theme.placeholder, marginBottom: theme.spacing, fontSize: 12 }}>
        Example: 🌟
      </Text>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing * 1.5, width: '100%' }} />

      {/* Demo: Paste an ID to edit an existing habit */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.input,
            color: theme.text,
            borderColor: theme.border,
            borderRadius: theme.borderRadius,
            padding: theme.padding,
            marginBottom: theme.spacing * 1.5,
          },
        ]}
        placeholder="Paste Habit ID to Edit (demo)"
        placeholderTextColor={theme.placeholder}
        value={id}
        onChangeText={text => {
          setId(text);
          setIsEdit(!!text);
        }}
        accessibilityLabel="Edit Habit ID"
        returnKeyType="done"
      />

      <Button
        title={isEdit ? 'Update Habit' : 'Add Habit'}
        onPress={() => {
          handleAddOrUpdate();
          Keyboard.dismiss();
        }}
        color={theme.primary}
        accessibilityLabel={isEdit ? 'Update Habit' : 'Add Habit'}
      />
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
  sectionHeading: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  input: {
    width: '100%',
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

export default AddHabitScreen;
