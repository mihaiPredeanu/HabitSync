import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, Keyboard, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [entryDate, setEntryDate] = useState(new Date());
  const [showPreview, setShowPreview] = useState(false);
  const [search, setSearch] = useState('');

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
      date: entryDate.toISOString().slice(0, 10),
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
    setEntryDate(new Date());
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
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing }}>
        <TextInput
          style={{
            flex: 1,
            backgroundColor: theme.input,
            color: theme.text,
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: theme.borderRadius,
            padding: theme.padding,
            marginRight: theme.spacing / 2,
            minHeight: 36,
            fontSize: 15,
          }}
          placeholder="Search journal..."
          placeholderTextColor={theme.placeholder}
          value={search}
          onChangeText={setSearch}
          accessibilityLabel="Search Journal"
        />
        <TouchableOpacity
          style={{ marginRight: theme.spacing }}
          onPress={() => setShowDatePicker(true)}
          accessibilityLabel="Pick Journal Entry Date"
        >
          <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 15 }}>
            {entryDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowPreview(p => !p)}
          accessibilityLabel="Toggle Markdown Preview"
        >
          <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 15 }}>{showPreview ? 'Edit' : 'Preview'}</Text>
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={entryDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_event: any, date?: Date) => {
            setShowDatePicker(false);
            if (date) setEntryDate(date);
          }}
        />
      )}
      {/* Section: Details */}
      <Text style={{ color: theme.text, fontWeight: '600', fontSize: 16, marginBottom: theme.spacing / 2 }}>Details</Text>
      <View style={[styles.inputRow, { marginBottom: theme.spacing }] }>
        {!showPreview ? (
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
                maxHeight: 120,
                flex: 1,
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
        ) : (
          <ScrollView style={{ flex: 1, minHeight: 40, maxHeight: 120, backgroundColor: theme.input, borderColor: theme.border, borderWidth: 1, borderRadius: theme.borderRadius, padding: theme.padding, marginRight: theme.spacing / 2 }}>
            <Markdown style={{ body: { color: theme.text, fontSize: 15 } }}>{content.trim() ? content : '*[Nothing to preview]*'}</Markdown>
          </ScrollView>
        )}
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
          data={entries.filter(e =>
            e.content.toLowerCase().includes(search.toLowerCase()) ||
            e.date.includes(search)
          )}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <JournalEntryCard entry={item} markdownPreview />
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
