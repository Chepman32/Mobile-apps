
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Button } from 'react-native-elements';

const db = SQLite.openDatabase(
  { name: 'smartNotes.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const NoteEditorScreen = ({ route, navigation }) => {
  const { noteId } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM notes WHERE id = ?',
        [noteId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const note = rows.item(0);
            setTitle(note.title);
            setContent(note.content);
            setTags(JSON.parse(note.tags).join(', '));
          }
        },
        (tx, error) => console.error('Error fetching note', error)
      );
    });
  }, [noteId]);

  const saveNote = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE notes SET title = ?, content = ?, tags = ? WHERE id = ?',
        [title, content, JSON.stringify(tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')), noteId],
        () => Alert.alert('Success', 'Note saved!'),
        (tx, error) => console.error('Error saving note', error)
      );
    });
  };

  const getAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered note organization and intelligent search. (Conceptual)'
    );
    // In a real app, an AI model would provide suggestions for tags or related notes.
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced AI features, cloud sync, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        style={styles.titleInput}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        onBlur={saveNote} // Save on blur
      />
      <TextInput
        style={styles.contentInput}
        placeholder="Note content..."
        multiline
        value={content}
        onChangeText={setContent}
        onBlur={saveNote} // Save on blur
      />
      <TextInput
        style={styles.input}
        placeholder="Tags (comma-separated)"
        value={tags}
        onChangeText={setTags}
        onBlur={saveNote} // Save on blur
      />

      <TouchableOpacity style={styles.button} onPress={getAISuggestion}>
        <Text style={styles.buttonText}>Get AI Suggestion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={saveNote}>
        <Text style={styles.buttonText}>Save Note</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  titleInput: {
    fontSize: 24,
    fontWeight: 'bold',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  contentInput: {
    height: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
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
    width: '100%',
    marginTop: 20,
  },
});

export default NoteEditorScreen;
