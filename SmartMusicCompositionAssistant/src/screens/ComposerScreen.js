
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Sound from 'react-native-sound';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'musicComposer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

// Enable playback in silence mode
Sound.setCategory('Playback');

const sampleSound = new Sound('sample.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load sample sound', error);
    return;
  }
});

const ComposerScreen = () => {
  const [compositionTitle, setCompositionTitle] = useState('');
  const [notes, setNotes] = useState(''); // Simple string of notes for now

  const playComposition = () => {
    // This is a very basic playback. 
    // In a real app, you'd parse notes and use a music engine.
    sampleSound.play();
    Alert.alert('Playing', 'Simulating playback of your composition.');
  };

  const saveComposition = () => {
    if (!compositionTitle.trim() || !notes.trim()) {
      Alert.alert('Error', 'Please enter title and notes.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS compositions (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, notes TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO compositions (title, notes, timestamp, isPremium) VALUES (?, ?, ?, ?)',
            [compositionTitle, notes, new Date().toLocaleString(), 0],
            () => Alert.alert('Success', 'Composition saved!'),
            (tx, error) => console.error('Error saving composition', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered music composition with intelligent harmony suggestions. (Conceptual)'
    );
    // In a real app, an AI model would suggest melodies or harmonies.
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium instruments, AI features, export options, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Compose Your Music</Text>
      <TextInput
        style={styles.input}
        placeholder="Composition Title"
        value={compositionTitle}
        onChangeText={setCompositionTitle}
      />
      <TextInput
        style={styles.textArea}
        placeholder="Enter notes (e.g., C4, D4, E4)"
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.button} onPress={playComposition}>
        <Text style={styles.buttonText}>Play</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={saveComposition}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Harmony Suggestion</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
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

export default ComposerScreen;
