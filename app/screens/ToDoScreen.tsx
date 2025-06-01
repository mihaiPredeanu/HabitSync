import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Keyboard, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from '../theme/ThemeContext';
import ToDoItem from '../components/ToDoItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodoToDB, updateTodoInDB, deleteTodoFromDB } from '../features/todos/todosThunks';
import { scheduleHabitNotification, cancelScheduledNotification } from '../utils/notifications';
import { RootState, AppDispatch } from '../features/store';

import { ToDoTimeOfDay } from '../types';

const TIME_OF_DAY_OPTIONS: { label: string; value: ToDoTimeOfDay }[] = [
  { label: 'Morning', value: 'morning' },
  { label: 'Afternoon', value: 'afternoon' },
  { label: 'Evening', value: 'evening' },
  { label: 'Any', value: 'any' },
];

const ToDoScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [timeOfDay, setTimeOfDay] = useState<ToDoTimeOfDay>('any');
  const [recurring, setRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState('');
  const [dueDate, setDueDate] = useState<string | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleAddOrUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Please enter a task title.');
      return;
    }
    const todoId = id || Date.now().toString();
    const todo = {
      id: todoId,
      title,
      completed: false,
      priority: 'none' as const,
      timeOfDay,
      dueDate,
      recurring,
      recurrenceRule: recurring ? recurrenceRule : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Cancel previous notification if editing
    if (isEdit) {
      await cancelScheduledNotification(todoId);
      await dispatch(updateTodoInDB(todo));
      Alert.alert('Success', 'Task updated!');
    } else {
      await dispatch(addTodoToDB(todo));
      Alert.alert('Success', 'Task added!');
    }
    // Schedule notification (default: 8:00 AM daily)
    try {
      await scheduleHabitNotification({
        identifier: todoId,
        title: `Task Reminder: ${title}`,
        body: `Don't forget your task: ${title}`,
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
    setTitle('');
    setTimeOfDay('any');
    setDueDate(undefined);
    setRecurring(false);
    setRecurrenceRule('');
    setIsEdit(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteTodoFromDB(id));
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
      <Text style={[styles.title, { color: theme.text, marginBottom: theme.spacing }]}>To-Do List</Text>
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
          placeholder="Task Title"
          placeholderTextColor={theme.placeholder}
          value={title}
          onChangeText={setTitle}
          accessibilityLabel="Task Title"
          returnKeyType="next"
          onSubmitEditing={Keyboard.dismiss}
        />
        {/* Time of Day Picker */}
        {/* Due Date Picker */}
        <View style={{ marginRight: theme.spacing / 2, alignItems: 'flex-start' }}>
          <Text style={{ color: theme.text, fontSize: 13, marginBottom: 2 }}>Due Date</Text>
          <TouchableOpacity
            style={{
              backgroundColor: theme.input,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 4,
            }}
            onPress={() => setShowDatePicker(true)}
            accessibilityLabel="Pick Due Date"
          >
            <Text style={{ color: theme.text, fontSize: 13 }}>
              {dueDate ? new Date(dueDate).toLocaleDateString() : 'Set Date'}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={dueDate ? new Date(dueDate) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(_event: any, date?: Date) => {
                setShowDatePicker(false);
                if (date) setDueDate(date.toISOString().slice(0, 10));
              }}
            />
          )}
        </View>
        <View style={{ marginRight: theme.spacing / 2 }}>
          <Text style={{ color: theme.text, fontSize: 13, marginBottom: 2 }}>Time</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {TIME_OF_DAY_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt.value}
                style={{
                  backgroundColor: timeOfDay === opt.value ? theme.primary : theme.input,
                  borderColor: theme.border,
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  marginRight: 4,
                }}
                onPress={() => setTimeOfDay(opt.value)}
                accessibilityLabel={`Set time of day to ${opt.label}`}
              >
                <Text style={{ color: timeOfDay === opt.value ? '#fff' : theme.text, fontSize: 13 }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Recurring toggle and rule */}
        <View style={{ marginRight: theme.spacing / 2, alignItems: 'flex-start' }}>
          <Text style={{ color: theme.text, fontSize: 13, marginBottom: 2 }}>Recurring</Text>
          <TouchableOpacity
            style={{
              backgroundColor: recurring ? theme.primary : theme.input,
              borderColor: theme.border,
              borderWidth: 1,
              borderRadius: 8,
              paddingVertical: 4,
              paddingHorizontal: 8,
              marginBottom: 4,
            }}
            onPress={() => setRecurring(r => !r)}
            accessibilityLabel="Toggle Recurring"
          >
            <Text style={{ color: recurring ? '#fff' : theme.text, fontSize: 13 }}>{recurring ? 'Yes' : 'No'}</Text>
          </TouchableOpacity>
          {recurring && (
            <TextInput
              style={{
                backgroundColor: theme.input,
                color: theme.text,
                borderColor: theme.border,
                borderWidth: 1,
                borderRadius: 8,
                padding: 6,
                fontSize: 13,
                width: 120,
                marginTop: 2,
              }}
              placeholder="e.g. every Mon"
              placeholderTextColor={theme.placeholder}
              value={recurrenceRule}
              onChangeText={setRecurrenceRule}
              accessibilityLabel="Recurrence Rule"
            />
          )}
        </View>
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
          accessibilityLabel="Edit Task ID"
          returnKeyType="done"
        />
        <Button
          title={isEdit ? 'Update' : 'Add'}
          onPress={() => { handleAddOrUpdate(); Keyboard.dismiss(); }}
          color={theme.primary}
          accessibilityLabel={isEdit ? 'Update Task' : 'Add Task'}
        />
      </View>
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing, width: '100%' }} />
      {/* Group todos by time of day */}
      {todos.length === 0 ? (
        <Text style={{ color: theme.text }}>No tasks yet. Add one!</Text>
      ) : (
        TIME_OF_DAY_OPTIONS.map(opt => {
          const group = todos.filter((t: typeof todos[0]) => (t.timeOfDay || 'any') === opt.value);
          if (group.length === 0) return null;
          return (
            <View key={opt.value} style={{ width: '100%', marginBottom: theme.spacing * 1.5 }}>
              <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16, marginBottom: 6, letterSpacing: 0.5 }}>{opt.label}</Text>
              <View style={{ backgroundColor: theme.card, borderRadius: theme.borderRadius, padding: 4, marginBottom: 2 }}>
                <FlatList
                  data={group}
                  keyExtractor={item => item.id}
                  renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <ToDoItem todo={item} />
                      <Button title="Delete" color="#f44336" onPress={() => handleDelete(item.id)} />
                    </View>
                  )}
                />
              </View>
            </View>
          );
        })
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

export default ToDoScreen;
