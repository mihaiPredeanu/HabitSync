import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ToDo } from '../types';

interface ToDoItemProps {
  todo: ToDo;
}

const priorityColors: Record<ToDo['priority'], string> = {
  none: '#bbb',
  low: '#8bc34a',
  medium: '#ffeb3b',
  high: '#ff9800',
  critical: '#f44336',
};

const ToDoItem: React.FC<ToDoItemProps> = ({ todo }) => {
  return (
    <View style={[styles.card, todo.completed && styles.completed]}>
      <View style={styles.header}>
        <Text style={styles.title}>{todo.title}</Text>
        <View style={[styles.priority, { backgroundColor: priorityColors[todo.priority] }]}>
          <Text style={styles.priorityText}>{todo.priority.charAt(0).toUpperCase()}</Text>
        </View>
      </View>
      {todo.dueDate && <Text style={styles.dueDate}>Due: {todo.dueDate}</Text>}
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
    borderLeftColor: '#2196f3',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 320,
  },
  completed: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: {
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
  dueDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
});

export default ToDoItem;
