import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTodos } from '../features/todos/todosThunks';
import { RootState, AppDispatch } from '../features/store';

const ToDoScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => state.todos.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>To-Do List</Text>
      {todos.length === 0 ? (
        <Text>No tasks yet. Add one!</Text>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 12, marginVertical: 6, backgroundColor: '#f0f0f0', borderRadius: 8, width: 320 }}>
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ToDoScreen;
