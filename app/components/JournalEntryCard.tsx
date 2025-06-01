import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { JournalEntry } from '../types';

interface JournalEntryCardProps {
  entry: JournalEntry;
}

const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ entry }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.date}>{entry.date}</Text>
      <Text style={styles.content}>{entry.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
    borderLeftWidth: 6,
    borderLeftColor: '#9c27b0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    width: 320,
  },
  date: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#9c27b0',
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
});

export default JournalEntryCard;
