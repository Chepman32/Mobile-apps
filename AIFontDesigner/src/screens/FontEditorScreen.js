

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'fontDesigner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const FontEditorScreen = ({ route }) => {
  const { fontId } = route.params;
  const [font, setFont] = useState(null);
  const [fontName, setFontName] = useState('');
  const [characters, setCharacters] = useState('');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM fonts WHERE id = ?',
        [fontId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedFont = rows.item(0);
            setFont(loadedFont);
            setFontName(loadedFont.name);
            setCharacters(loadedFont.characters);
          }
        },
        (tx, error) => console.error('Error fetching font', error)
      );
    });
  }, [fontId]);

  const saveFont = () => {
    if (!font) return;

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE fonts SET name = ?, characters = ? WHERE id = ?',
        [fontName, characters, fontId],
        () => Alert.alert('Success', 'Font saved!'),
        (tx, error) => console.error('Error saving font', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-assisted character generation and typography analysis. (Conceptual)'
    );
    // In a real app, an AI model would suggest character designs or analyze typography.
  };

  const exportFont = async () => {
    Alert.alert(
      'Export Font',
      'Simulating font export. (Conceptual: requires font generation library)'
    );
    // In a real app, you'd export the font data to a file (e.g., .ttf, .otf)
    const dummyFontContent = `// Dummy Font Data\n${fontName}\n${characters}`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${fontName.replace(/\s/g, '_')}.ttf`;
    try {
      await RNFS.writeFile(filePath, dummyFontContent, 'utf8');
      Alert.alert('Exported', `Font exported to ${filePath}`);
    } catch (error) {
      console.error('Error exporting font:', error);
      Alert.alert('Error', 'Failed to export font.');
    }
  };

  if (!font) {
    return (
      <View style={styles.container}>
        <Text>Loading font...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Font Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Font Name"
        value={fontName}
        onChangeText={setFontName}
        onBlur={saveFont} // Save on blur
      />

      <Text style={styles.label}>Characters:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter characters (e.g., ABC, abc, 123)"
        multiline
        value={characters}
        onChangeText={setCharacters}
        onBlur={saveFont} // Save on blur
      />

      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Character Suggestion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={exportFont}>
        <Text style={styles.buttonText}>Export Font</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Premium font tools and AI features available with Premium.</Text>
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
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default FontEditorScreen;
