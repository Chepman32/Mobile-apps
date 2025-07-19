
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'citationManager.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddCitationScreen = ({ navigation }) => {
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [format, setFormat] = useState('APA');

  const handleAddCitation = () => {
    if (!author.trim() || !title.trim() || !year.trim()) {
      Alert.alert('Error', 'Please fill all required fields.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO citations (author, title, year, format, isPremium) VALUES (?, ?, ?, ?, ?)',
        [author, title, year, format, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Citation added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding citation', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered citation generation. (Conceptual)'
    );
    // In a real app, an AI model would generate citations based on input text or metadata.
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Author:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Smith, J."
        value={author}
        onChangeText={setAuthor}
      />

      <Text style={styles.label}>Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., The Art of React Native"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Year:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2023"
        keyboardType="numeric"
        value={year}
        onChangeText={setYear}
      />

      <Text style={styles.label}>Format:</Text>
      <View style={styles.formatSelection}>
        <TouchableOpacity
          style={[styles.formatButton, format === 'APA' && styles.selectedFormat]}
          onPress={() => setFormat('APA')}
        >
          <Text style={styles.formatButtonText}>APA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.formatButton, format === 'MLA' && styles.selectedFormat]}
          onPress={() => setFormat('MLA')}
        >
          <Text style={styles.formatButtonText}>MLA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.formatButton, format === 'Chicago' && styles.selectedFormat]}
          onPress={() => setFormat('Chicago')}
        >
          <Text style={styles.formatButtonText}>Chicago</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddCitation}>
        <Text style={styles.buttonText}>Add Citation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiButton} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>Generate with AI</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
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
  formatSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  formatButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedFormat: {
    backgroundColor: '#007bff',
  },
  formatButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  aiButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default AddCitationScreen;
