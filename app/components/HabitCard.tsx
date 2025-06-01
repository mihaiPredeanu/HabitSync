import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Habit } from '../features/habits/HabitTypes';

interface HabitCardProps {
  habit: Habit;
}

const priorityColors: Record<Habit['priority'], string> = {
  none: '#bbb',
  low: '#8bc34a',
  medium: '#ffeb3b',
  high: '#ff9800',
  critical: '#f44336',
};

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  return (
    <View style={[styles.card, { borderLeftColor: habit.color || '#2196f3' }]}> 
      <View style={styles.header}>
        {/* Placeholder for icon */}
        <View style={[styles.icon, { backgroundColor: habit.color || '#2196f3' }]} />
        <Text style={styles.name}>{habit.name}</Text>
        <View style={[styles.priority, { backgroundColor: priorityColors[habit.priority] }]}>
          <Text style={styles.priorityText}>{habit.priority.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.type}>{habit.type.toUpperCase()}</Text>
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
    backgroundColor: '#2196f3',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  priority: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  priorityText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  type: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default HabitCard;
