
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const NoteEditorScreen = ({ route, navigation }) => {
  const { noteId } = route.params;
  const [note, setNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const db = getFirestore();

  useEffect(() => {
    const fetchNote = async () => {
      const docRef = doc(db, 'notes', noteId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const noteData = { id: docSnap.id, ...docSnap.data() };
        setNote(noteData);
        setTitle(noteData.title);
        setContent(noteData.content);
      } else {
        Alert.alert('Error', 'Note not found.');
        navigation.goBack();
      }
    };
    fetchNote();
  }, [noteId]);

  const saveNote = async () => {
    if (!note) return;
    try {
      await updateDoc(doc(db, 'notes', note.id), {
        title: title,
        content: content,
      });
      Alert.alert('Success', 'Note saved!');
    } catch (error) {
      console.error('Error saving note:', error);
      Alert.alert('Error', 'Failed to save note.');
    }
  };

  if (!note) {
    return (
      <View style={styles.container}>
        <Text>Loading note...</Text>
      </View>
    );
  }

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
      <TouchableOpacity style={styles.saveButton} onPress={saveNote}>
        <Text style={styles.buttonText}>Save Note</Text>
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
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default NoteEditorScreen;
