import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useDispatch } from 'react-redux';
import { addHabitLogToDB } from '../features/habits/habitLogsThunks';
import { HabitLog, TimeOfDay } from '../features/habits/HabitTypes';
import { AppDispatch } from '../features/store';

// For demo: user must paste habitId to log (in real app, this would be navigated to with params)
const LogHabitScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const [habitId, setHabitId] = useState('');
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('any');

  const handleLog = async () => {
    if (!habitId.trim()) {
      Alert.alert('Validation', 'Please enter a habit ID.');
      return;
    }
    const log: HabitLog = {
      id: Date.now().toString(),
      habitId,
      date: new Date().toISOString().slice(0, 10),
      value: value === 'yes' ? true : value === 'no' ? false : Number(value),
      note,
      timeOfDay,
      createdAt: new Date().toISOString(),
    };
    await dispatch(addHabitLogToDB(log));
    setValue('');
    setNote('');
    setTimeOfDay('any');
    Alert.alert('Success', 'Habit log added!');
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
    >
      <Text style={[styles.title, { color: theme.text, marginBottom: theme.spacing * 1.5 }]}>Log Habit</Text>
      {/* Section: Details */}
      <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16, marginBottom: theme.spacing / 2 }}>Details</Text>
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
        placeholder="Paste Habit ID"
        placeholderTextColor={theme.placeholder}
        value={habitId}
        onChangeText={setHabitId}
        accessibilityLabel="Habit ID"
        returnKeyType="next"
        onSubmitEditing={Keyboard.dismiss}
      />
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
        placeholder="Value (yes/no or number)"
        placeholderTextColor={theme.placeholder}
        value={value}
        onChangeText={setValue}
        accessibilityLabel="Habit Value"
        returnKeyType="next"
      />
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
        placeholder="Note (optional)"
        placeholderTextColor={theme.placeholder}
        value={note}
        onChangeText={setNote}
        accessibilityLabel="Habit Note"
        returnKeyType="next"
      />
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
        placeholder="Time of Day (morning/afternoon/evening/any)"
        placeholderTextColor={theme.placeholder}
        value={timeOfDay}
        onChangeText={text => setTimeOfDay(text as TimeOfDay)}
        accessibilityLabel="Time of Day"
        returnKeyType="done"
      />
      <Button
        title="Log"
        onPress={() => { handleLog(); Keyboard.dismiss(); }}
        color={theme.primary}
        accessibilityLabel="Log Habit"
      />
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing, width: '100%' }} />
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
  input: {
    width: '100%',
    borderWidth: 1,
    fontSize: 16,
  },
});

export default LogHabitScreen;
