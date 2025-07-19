import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'poetryGenerator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PoetryGeneratorScreen = ({ navigation }) => {
  const [theme, setTheme] = useState('');
  const [generatedPoem, setGeneratedPoem] = useState('');

  const generatePoem = () => {
    if (!theme.trim()) {
      Alert.alert('Error', 'Please enter a theme for the poem.');
      return;
    }

    // Simulate AI-powered poetry generation
    const dummyPoems = [
      `In realms of thought, where dreams take flight,\nYour theme, a beacon, shining bright.`, 
      `Whispers of ${theme} in the air,\nA symphony of beauty, beyond compare.`, 
      `Through ${theme}'s embrace, a story unfolds,\nIn verses woven, brave and bold.`
    ];
    const randomPoem = dummyPoems[Math.floor(Math.random() * dummyPoems.length)];
    setGeneratedPoem(randomPoem);
  };

  const savePoem = () => {
    if (!generatedPoem.trim()) {
      Alert.alert('Error', 'Generate a poem first to save.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS poems (id INTEGER PRIMARY KEY AUTOINCREMENT, theme TEXT, content TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO poems (theme, content, timestamp, isPremium) VALUES (?, ?, ?, ?)',
            [theme, generatedPoem, new Date().toLocaleString(), 0],
            () => Alert.alert('Success', 'Poem saved!'),
            (tx, error) => console.error('Error saving poem', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium AI features, style analysis, publishing tools, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generate Your Poem</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a theme (e.g., nature, love, future)"
        value={theme}
        onChangeText={setTheme}
      />

      <TouchableOpacity style={styles.button} onPress={generatePoem}>
        <Text style={styles.buttonText}>Generate Poem</Text>
      </TouchableOpacity>

      {generatedPoem ? (
        <View style={styles.poemContainer}>
          <Text style={styles.generatedPoemText}>{generatedPoem}</Text>
          <TouchableOpacity style={styles.saveButton} onPress={savePoem}>
            <Text style={styles.buttonText}>Save Poem</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <TouchableOpacity style={styles.viewPoemsButton} onPress={() => navigation.navigate('SavedPoems')}>
        <Text style={styles.buttonText}>View Saved Poems</Text>
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
  poemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  generatedPoemText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  viewPoemsButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default PoetryGeneratorScreen;
