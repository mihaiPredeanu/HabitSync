import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Keyboard } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import JournalEntryCard from '../components/JournalEntryCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournalEntries, addJournalEntryToDB, updateJournalEntryInDB, deleteJournalEntryFromDB } from '../features/journal/journalThunks';
import { RootState, AppDispatch } from '../features/store';

const JournalScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const entries = useSelector((state: RootState) => state.journal.entries);
  const [id, setId] = useState('');
  const [content, setContent] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(fetchJournalEntries());
  }, [dispatch]);

  const handleAddOrUpdate = async () => {
    if (!content.trim()) {
      Alert.alert('Validation', 'Please enter some text.');
      return;
    }
    const entry = {
      id: id || Date.now().toString(),
      date: new Date().toISOString().slice(0, 10),
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (isEdit) {
      await dispatch(updateJournalEntryInDB(entry));
      Alert.alert('Success', 'Entry updated!');
    } else {
      await dispatch(addJournalEntryToDB(entry));
      Alert.alert('Success', 'Entry added!');
    }
    setId('');
    setContent('');
    setIsEdit(false);
  };

  const handleDelete = async (id: string) => {
    await dispatch(deleteJournalEntryFromDB(id));
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
      <Text style={[styles.title, { color: theme.text, marginBottom: theme.spacing }]}>Journal</Text>
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
              minHeight: 40,
              maxHeight: 100,
            },
          ]}
          placeholder="Write a new journal entry..."
          placeholderTextColor={theme.placeholder}
          value={content}
          onChangeText={setContent}
          multiline
          accessibilityLabel="Journal Entry Content"
          returnKeyType="next"
          onSubmitEditing={Keyboard.dismiss}
        />
        {/* Demo: Paste an ID to edit an existing entry */}
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
          accessibilityLabel="Edit Journal Entry ID"
          returnKeyType="done"
        />
        <Button
          title={isEdit ? 'Update' : 'Add'}
          onPress={() => { handleAddOrUpdate(); Keyboard.dismiss(); }}
          color={theme.primary}
          accessibilityLabel={isEdit ? 'Update Entry' : 'Add Entry'}
        />
      </View>
      <View style={{ height: 1, backgroundColor: theme.border, marginBottom: theme.spacing, width: '100%' }} />
      {entries.length === 0 ? (
        <Text style={{ color: theme.text }}>No journal entries yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <JournalEntryCard entry={item} />
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

export default JournalScreen;
