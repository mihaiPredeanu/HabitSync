import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHabits } from '../features/habits/habitsThunks';
import { RootState, AppDispatch } from '../features/store';

const DashboardScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.habits);

  useEffect(() => {
    dispatch(fetchHabits());
  }, [dispatch]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Your Habits</Text>
      {habits.length === 0 ? (
        <Text>No habits yet. Add one!</Text>
      ) : (
        <FlatList
          data={habits}
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

export default DashboardScreen;
