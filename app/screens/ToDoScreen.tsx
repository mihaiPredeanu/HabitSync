import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import ToDoItem from '../components/ToDoItem';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos, addTodoToDB, updateTodoInDB, deleteTodoFromDB } from '../features/todos/todosThunks';
import { scheduleHabitNotification, cancelScheduledNotification } from '../utils/notifications';
import { RootState, AppDispatch } from '../features/store';

const ToDoScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
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
      priority: 'none',
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
        {/* Demo: Paste an ID to edit an existing task */}
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
      {todos.length === 0 ? (
        <Text style={{ color: theme.text }}>No tasks yet. Add one!</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <ToDoItem todo={item} />
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

export default ToDoScreen;
