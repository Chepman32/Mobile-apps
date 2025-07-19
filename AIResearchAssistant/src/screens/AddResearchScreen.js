
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'researchAssistant.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddResearchScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleAddResearch = () => {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Error', 'Please enter both title and description.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO research_projects (title, description, isPremium) VALUES (?, ?, ?)',
        [title, description, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Research project added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding research project', error)
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Project Title:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Study on AI in Education"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Provide a brief description of your research..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddResearch}>
        <Text style={styles.buttonText}>Add Research Project</Text>
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
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 15,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
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
});

export default AddResearchScreen;
