
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import SearchBar from 'react-native-search-bar';

const db = SQLite.openDatabase(
  { name: 'smartNotes.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const NoteListScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadNotes = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT, tags TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM notes',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyNotes = [
                  { title: 'Meeting Notes', content: 'Discussed Q3 strategy.', tags: JSON.stringify(['work', 'meeting']), isPremium: 0 },
                  { title: 'Shopping List', content: 'Milk, Eggs, Bread.', tags: JSON.stringify(['personal', 'shopping']), isPremium: 0 },
                  { title: 'AI Research Ideas', content: 'Explore new NLP models.', tags: JSON.stringify(['research', 'AI']), isPremium: 1 },
                ];
                dummyNotes.forEach(note => {
                  tx.executeSql(
                    'INSERT INTO notes (title, content, tags, isPremium) VALUES (?, ?, ?, ?)',
                    [note.title, note.content, note.tags, note.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting note', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM notes',
                [],
                (_, { rows: allRows }) => {
                  const loadedNotes = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedNotes.push({ ...allRows.item(i), tags: JSON.parse(allRows.item(i).tags) });
                  }
                  setNotes(loadedNotes);
                },
                (tx, error) => console.error('Error fetching notes', error)
              );
            },
            (tx, error) => console.error('Error checking notes', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadNotes();
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });
    return unsubscribe;
  }, [navigation, loadNotes]);

  const createNewNote = () => {
    Alert.prompt(
      'New Note',
      'Enter note title:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (title) => {
            if (title) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO notes (title, content, tags, isPremium) VALUES (?, ?, ?, ?)',
                  [title, '', JSON.stringify([]), 0],
                  (_, result) => {
                    navigation.navigate('NoteEditor', { noteId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding note', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleNotePress = (note) => {
    if (note.isPremium) {
      Alert.alert(
        'Premium Note',
        'This note is part of a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('NoteEditor', { noteId: note.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced AI features, cloud sync, etc.'
    );
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchText.toLowerCase()) ||
    note.content.toLowerCase().includes(searchText.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
  );

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.noteItem, item.isPremium ? styles.premiumNoteItem : null]}
      onPress={() => handleNotePress(item)}
    >
      <Text style={styles.noteTitle}>{item.title}</Text>
      <Text style={styles.notePreview} numberOfLines={1}>{item.content}</Text>
      {item.tags.length > 0 && <Text style={styles.noteTags}>Tags: {item.tags.join(', ')}</Text>}
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SearchBar
        placeholder="Search Notes"
        onChangeText={setSearchText}
        value={searchText}
        onSearchButtonPress={() => {}}
        onCancelButtonPress={() => setSearchText('')}
      />
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNoteItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No notes yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createNewNote}>
        <Text style={styles.buttonText}>Create New Note</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  noteItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumNoteItem: {
    backgroundColor: '#ffe0b2',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  notePreview: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noteTags: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
    marginTop: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default NoteListScreen;
