import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import HabitCard from '../components/HabitCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHabits, deleteHabitFromDB } from '../features/habits/habitsThunks';
import { fetchHabitLogs } from '../features/habits/habitLogsThunks';
import TrackerGrid from '../components/TrackerGrid';
import { RootState, AppDispatch } from '../features/store';

const DashboardScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const habits = useSelector((state: RootState) => state.habits.habits);
  const logs = useSelector((state: RootState) => state.habits.logs);

  useEffect(() => {
    dispatch(fetchHabits());
    dispatch(fetchHabitLogs());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    await dispatch(deleteHabitFromDB(id));
    Alert.alert('Deleted', 'Habit deleted.');
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
      <Text style={[styles.title, { color: theme.text, marginBottom: theme.spacing }]}>Your Habits</Text>
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing, width: '100%' }} />
      {habits.length === 0 ? (
        <Text style={{ color: theme.text }}>No habits yet. Add one!</Text>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            // Filter logs for this habit
            const habitLogs = logs.filter((l: any) => l.habitId === item.id);

            // --- Stats Calculation ---
            // Completion days
            const completedDays = habitLogs.filter((l: any) => l.value === true || (typeof l.value === 'number' && l.value > 0)).length;
            // Streaks
            let currentStreak = 0, bestStreak = 0, streak = 0;
            const sortedLogs = [...habitLogs].sort((a: any, b: any) => a.date.localeCompare(b.date));
            let prevDate: string | null = null;
            sortedLogs.forEach((l: any) => {
              if (l.value === true || (typeof l.value === 'number' && l.value > 0)) {
                if (prevDate) {
                  const prev = new Date(prevDate);
                  const curr = new Date(l.date);
                  const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
                  if (diff === 1) {
                    streak++;
                  } else {
                    streak = 1;
                  }
                } else {
                  streak = 1;
                }
                if (streak > bestStreak) bestStreak = streak;
                prevDate = l.date;
              } else {
                streak = 0;
                prevDate = null;
              }
            });
            currentStreak = streak;
            // Completion rate
            const totalDays = 30;
            const completionRate = totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

            return (
              <View style={{ flexDirection: 'column', alignItems: 'center', marginBottom: theme.spacing } }>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <HabitCard habit={item} />
                  <Button title="Delete" color="#f44336" onPress={() => handleDelete(item.id)} />
                </View>
                {/* Stats summary */}
                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text style={{ color: theme.text, marginRight: 12, fontSize: 12 }}>Current Streak: <Text style={{ fontWeight: 'bold' }}>{currentStreak}</Text></Text>
                  <Text style={{ color: theme.text, marginRight: 12, fontSize: 12 }}>Best Streak: <Text style={{ fontWeight: 'bold' }}>{bestStreak}</Text></Text>
                  <Text style={{ color: theme.text, marginRight: 12, fontSize: 12 }}>Completion: <Text style={{ fontWeight: 'bold' }}>{completionRate}%</Text></Text>
                  <Text style={{ color: theme.text, fontSize: 12 }}>Total: <Text style={{ fontWeight: 'bold' }}>{completedDays}</Text></Text>
                </View>
                <TrackerGrid data={habitLogs} days={30} />
              </View>
            );
          }}
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
});

export default DashboardScreen;
