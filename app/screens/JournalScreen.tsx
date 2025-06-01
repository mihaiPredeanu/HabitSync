import React, { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournalEntries } from '../features/journal/journalThunks';
import { RootState, AppDispatch } from '../features/store';

const JournalScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const entries = useSelector((state: RootState) => state.journal.entries);

  useEffect(() => {
    dispatch(fetchJournalEntries());
  }, [dispatch]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 32 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Journal</Text>
      {entries.length === 0 ? (
        <Text>No journal entries yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ padding: 12, marginVertical: 6, backgroundColor: '#f0f0f0', borderRadius: 8, width: 320 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.date}</Text>
              <Text>{item.content}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default JournalScreen;
