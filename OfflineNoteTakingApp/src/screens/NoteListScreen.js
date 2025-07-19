
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchBar from 'react-native-search-bar';

const NoteListScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const [searchText, setSearchText] = useState('');

  const loadNotes = useCallback(async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('notes');
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
      }
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  }, []);

  useEffect(() => {
    loadNotes();
    const unsubscribe = navigation.addListener('focus', () => {
      loadNotes();
    });
    return unsubscribe;
  }, [navigation, loadNotes]);

  const createNewNote = async () => {
    const newNote = {
      id: Date.now().toString(),
      title: `New Note ${notes.length + 1}`,
      content: '',
      audioMemo: null,
      tags: [],
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    navigation.navigate('NoteEditor', { noteId: newNote.id });
  };

  const handleNotePress = (noteId) => {
    navigation.navigate('NoteEditor', { noteId });
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchText.toLowerCase()) ||
    note.content.toLowerCase().includes(searchText.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()))
  );

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium organization features, cloud sync, etc.'
    );
  };

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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteItem}
            onPress={() => handleNotePress(item.id)}
          >
            <Text style={styles.noteTitle}>{item.title}</Text>
            <Text style={styles.noteContent} numberOfLines={2}>{item.content}</Text>
            {item.tags.length > 0 && <Text style={styles.noteTags}>Tags: {item.tags.join(', ')}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet. Create one!</Text>
        }
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
  noteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  noteContent: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  noteTags: {
    fontSize: 12,
    color: '#999',
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
