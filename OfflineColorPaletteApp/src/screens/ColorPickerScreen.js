
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { ColorPicker, toHsv, fromHsv } from 'react-native-color-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';

const ColorPickerScreen = ({ navigation }) => {
  const [currentColor, setCurrentColor] = useState(toHsv('#FFFFFF'));
  const [paletteName, setPaletteName] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);

  const addColorToPalette = () => {
    setSelectedColors([...selectedColors, fromHsv(currentColor)]);
  };

  const savePalette = async () => {
    if (!paletteName.trim() || selectedColors.length === 0) {
      Alert.alert('Error', 'Please enter a palette name and add at least one color.');
      return;
    }

    const newPalette = {
      id: Date.now().toString(),
      name: paletteName,
      colors: selectedColors,
      isPremium: false,
    };

    try {
      const storedPalettes = await AsyncStorage.getItem('palettes');
      const palettes = storedPalettes ? JSON.parse(storedPalettes) : [];
      const updatedPalettes = [...palettes, newPalette];
      await AsyncStorage.setItem('palettes', JSON.stringify(updatedPalettes));
      Alert.alert('Success', 'Palette saved successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save palette:', error);
      Alert.alert('Error', 'Failed to save palette.');
    }
  };

  const extractColorsFromImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        // Conceptual: In a real app, you'd process the image to extract dominant colors
        Alert.alert('Image Selected', `Image: ${response.assets[0].uri}. (Conceptual: would extract colors)`);
        // For demonstration, add some random colors
        setSelectedColors([...selectedColors, '#FF00FF', '#00FFFF']);
      }
    });
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

      <TouchableOpacity style={styles.imageExtractButton} onPress={extractColorsFromImage}>
        <Text style={styles.buttonText}>Extract Colors from Image</Text>
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
  imageExtractButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default ColorPickerScreen;
