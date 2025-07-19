
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Button } from 'react-native-elements';

const db = SQLite.openDatabase(
  { name: 'writingAssistant.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const WritingScreen = () => {
  const [text, setText] = useState('');
  const [suggestion, setSuggestion] = useState('');

  const getAISuggestion = () => {
    // This is a conceptual AI suggestion. 
    // In a real app, you'd integrate an on-device NLP model.
    const dummySuggestions = [
      'Consider rephrasing this sentence for clarity.',
      'Perhaps add more descriptive adjectives here.',
      'Check for passive voice in this paragraph.',
      'This section could benefit from a stronger topic sentence.',
    ];
    const randomSuggestion = dummySuggestions[Math.floor(Math.random() * dummySuggestions.length)];
    setSuggestion(randomSuggestion);
  };

  const saveDraft = () => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS drafts (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO drafts (content, timestamp) VALUES (?, ?)',
            [text, new Date().toLocaleString()],
            () => Alert.alert('Success', 'Draft saved!'),
            (tx, error) => console.error('Error saving draft', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced writing styles, plagiarism detection, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Write Your Text</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Start writing here..."
        multiline
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.button} onPress={getAISuggestion}>
        <Text style={styles.buttonText}>Get AI Suggestion</Text>
      </TouchableOpacity>
      {suggestion ? <Text style={styles.suggestionText}>{suggestion}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={saveDraft}>
        <Text style={styles.buttonText}>Save Draft</Text>
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
  textArea: {
    height: 250,
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
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  suggestionText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
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

export default WritingScreen;
