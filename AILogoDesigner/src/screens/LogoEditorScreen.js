
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'logoDesigner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const LogoEditorScreen = ({ route }) => {
  const { logoId } = route.params;
  const [logo, setLogo] = useState(null);
  const [logoName, setLogoName] = useState('');
  const [logoDescription, setLogoDescription] = useState('');
  const [designElements, setDesignElements] = useState(''); // Conceptual: text representation of design

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM logos WHERE id = ?',
        [logoId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedLogo = rows.item(0);
            setLogo(loadedLogo);
            setLogoName(loadedLogo.name);
            setLogoDescription(loadedLogo.description);
            // In a real app, load actual design elements here
          }
        },
        (tx, error) => console.error('Error fetching logo', error)
      );
    });
  }, [logoId]);

  const saveLogo = () => {
    if (!logo) return;

    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE logos SET name = ?, description = ? WHERE id = ?',
        [logoName, logoDescription, logoId],
        () => Alert.alert('Success', 'Logo saved!'),
        (tx, error) => console.error('Error saving logo', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-assisted composition and style analysis. (Conceptual)'
    );
    // In a real app, an AI model would suggest logo elements or styles.
  };

  const exportLogo = async () => {
    Alert.alert(
      'Export Logo',
      'Simulating logo export. (Conceptual: requires vector graphics library)'
    );
    // In a real app, you'd export the logo as an SVG or PNG
    const dummyLogoContent = `// Dummy Logo Data\nName: ${logoName}\nElements: ${designElements}`;
    const filePath = `${RNFS.DocumentDirectoryPath}/${logoName.replace(/\s/g, '_')}.svg`;
    try {
      await RNFS.writeFile(filePath, dummyLogoContent, 'utf8');
      Alert.alert('Exported', `Logo exported to ${filePath}`);
    } catch (error) {
      console.error('Error exporting logo:', error);
      Alert.alert('Error', 'Failed to export logo.');
    }
  };

  if (!logo) {
    return (
      <View style={styles.container}>
        <Text>Loading logo...</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Logo Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Logo Name"
        value={logoName}
        onChangeText={setLogoName}
        onBlur={saveLogo} // Save on blur
      />

      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Logo Description"
        multiline
        value={logoDescription}
        onChangeText={setLogoDescription}
        onBlur={saveLogo} // Save on blur
      />

      <Text style={styles.label}>Design Elements (Conceptual):</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Describe your logo elements (e.g., a circle, a stylized letter A)"
        multiline
        value={designElements}
        onChangeText={setDesignElements}
      />

      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Design Suggestion</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={exportLogo}>
        <Text style={styles.buttonText}>Export Logo</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Premium logo tools and AI features available with Premium.</Text>
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
    height: 120,
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

export default LogoEditorScreen;
