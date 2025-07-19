
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'textureGenerator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const TextureGeneratorScreen = ({ navigation }) => {
  const [patternType, setPatternType] = useState('noise'); // noise, stripes, checker
  const [color1, setColor1] = useState('#FF0000');
  const [color2, setColor2] = useState('#0000FF');
  const [generatedTextureUri, setGeneratedTextureUri] = useState(null);

  const generateTexture = async () => {
    // Simulate AI-powered texture generation
    Alert.alert(
      'Generating Texture',
      'Simulating AI-powered pattern generation. (Conceptual)'
    );

    // In a real app, you'd generate an image based on parameters
    // For now, we'll use a placeholder image and save it.
    const dummyImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='; // A 1x1 transparent PNG
    const filePath = `${RNFS.DocumentDirectoryPath}/texture_${Date.now()}.png`;

    try {
      await RNFS.writeFile(filePath, dummyImageBase64.split(',')[1], 'base64');
      setGeneratedTextureUri(filePath);
    } catch (error) {
      console.error('Error saving dummy texture:', error);
      Alert.alert('Error', 'Failed to generate texture.');
    }
  };

  const saveTexture = () => {
    if (!generatedTextureUri) {
      Alert.alert('Error', 'Generate a texture first to save.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS textures (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, color1 TEXT, color2 TEXT, uri TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO textures (type, color1, color2, uri, timestamp, isPremium) VALUES (?, ?, ?, ?, ?, ?)',
            [patternType, color1, color2, generatedTextureUri, new Date().toLocaleString(), 0],
            () => Alert.alert('Success', 'Texture saved!'),
            (tx, error) => console.error('Error saving texture', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium textures, AI features, commercial licensing, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Generate Textures</Text>

      <Text style={styles.label}>Pattern Type:</Text>
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[styles.optionButton, patternType === 'noise' && styles.selectedOption]}
          onPress={() => setPatternType('noise')}
        >
          <Text style={styles.buttonText}>Noise</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, patternType === 'stripes' && styles.selectedOption]}
          onPress={() => setPatternType('stripes')}
        >
          <Text style={styles.buttonText}>Stripes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.optionButton, patternType === 'checker' && styles.selectedOption]}
          onPress={() => setPatternType('checker')}
        >
          <Text style={styles.buttonText}>Checker</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Color 1:</Text>
      <TextInput style={styles.input} value={color1} onChangeText={setColor1} />
      <Text style={styles.label}>Color 2:</Text>
      <TextInput style={styles.input} value={color2} onChangeText={setColor2} />

      <TouchableOpacity style={styles.button} onPress={generateTexture}>
        <Text style={styles.buttonText}>Generate Texture</Text>
      </TouchableOpacity>

      {generatedTextureUri ? (
        <View style={styles.texturePreviewContainer}>
          <Image source={{ uri: generatedTextureUri }} style={styles.texturePreview} />
          <TouchableOpacity style={styles.saveButton} onPress={saveTexture}>
            <Text style={styles.buttonText}>Save Texture</Text>
          </TouchableOpacity>
        </View>
      ) : null}

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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 15,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedOption: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  texturePreviewContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  texturePreview: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  premiumButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default TextureGeneratorScreen;
