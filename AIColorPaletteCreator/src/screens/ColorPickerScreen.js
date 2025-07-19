
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ColorPicker, toHsv, fromHsv } from 'react-native-color-picker';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'colorPaletteCreator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ColorPickerScreen = ({ navigation }) => {
  const [currentColor, setCurrentColor] = useState(toHsv('#FFFFFF'));
  const [paletteName, setPaletteName] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);

  const addColorToPalette = () => {
    setSelectedColors([...selectedColors, fromHsv(currentColor)]);
  };

  const savePalette = () => {
    if (!paletteName.trim() || selectedColors.length === 0) {
      Alert.alert('Error', 'Please enter a palette name and add at least one color.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO palettes (name, colors, isPremium) VALUES (?, ?, ?)',
        [paletteName, JSON.stringify(selectedColors), 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Palette saved successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error saving palette', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-driven harmony analysis and palette generation. (Conceptual)'
    );
    // In a real app, an AI model would suggest harmonious colors.
  };

  return (
    <View style={styles.container}>
      <ColorPicker
        onColorChange={color => setCurrentColor(color)}
        style={styles.colorPicker}
        hideSliders={true}
      />
      <Text style={styles.selectedColorText}>Selected Color: {fromHsv(currentColor)}</Text>

      <TouchableOpacity style={styles.button} onPress={addColorToPalette}>
        <Text style={styles.buttonText}>Add Color to Palette</Text>
      </TouchableOpacity>

      <View style={styles.selectedColorsContainer}>
        {selectedColors.map((color, index) => (
          <View key={index} style={[styles.selectedColorSwatch, { backgroundColor: color }]} />
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Palette Name"
        value={paletteName}
        onChangeText={setPaletteName}
      />

      <TouchableOpacity style={styles.button} onPress={savePalette}>
        <Text style={styles.buttonText}>Save Palette</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiButton} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Harmony Suggestion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  colorPicker: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  selectedColorText: {
    fontSize: 18,
    marginBottom: 20,
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
  selectedColorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  selectedColorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  aiButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default ColorPickerScreen;
