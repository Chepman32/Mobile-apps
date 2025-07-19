
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import RNSketchCanvas from 'react-native-sketch-canvas';
import SQLite from 'react-native-sqlite-storage';

const { width, height } = Dimensions.get('window');

const db = SQLite.openDatabase(
  { name: 'digitalArtStudio.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ArtStudioScreen = () => {
  const sketchCanvasRef = useRef(null);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(5);

  const clearCanvas = () => {
    sketchCanvasRef.current.clear();
  };

  const saveDrawing = () => {
    sketchCanvasRef.current.save(
      'png',
      false,
      'DigitalArtStudio',
      `artwork_${Date.now()}`,
      true,
      true,
      true
    );
    Alert.alert('Artwork Saved', 'Your artwork has been saved to your device!');
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-assisted tools and style recommendations. (Conceptual)'
    );
    // In a real app, an AI model would suggest colors, brushes, or styles.
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium AI tools, advanced brushes, style packs, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.canvasContainer}>
        <RNSketchCanvas
          ref={sketchCanvasRef}
          containerStyle={styles.sketchCanvas}
          canvasStyle={styles.sketchCanvas}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          localSourceImage={{ filename: '' }} // No initial image
          saveComponent={
            <View style={styles.hiddenSaveComponent} /> // Hide default save button
          }
          textComponent={
            <View style={styles.hiddenTextComponent} /> // Hide default text button
          }
          clearComponent={
            <View style={styles.hiddenClearComponent} /> // Hide default clear button
          }
          undoComponent={
            <View style={styles.hiddenUndoComponent} /> // Hide default undo button
          }
          redoComponent={
            <View style={styles.hiddenRedoComponent} /> // Hide default redo button
          }
        />
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={clearCanvas}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={saveDrawing}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setStrokeColor('white')}>
          <Text style={styles.buttonText}>Eraser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setStrokeColor('black')}>
          <Text style={styles.buttonText}>Pen</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={generateAISuggestion}>
          <Text style={styles.buttonText}>AI Suggestion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.colorPicker}>
        <TouchableOpacity style={[styles.colorSwatch, { backgroundColor: '#000000' }]} onPress={() => setStrokeColor('#000000')} />
        <TouchableOpacity style={[styles.colorSwatch, { backgroundColor: '#FF0000' }]} onPress={() => setStrokeColor('#FF0000')} />
        <TouchableOpacity style={[styles.colorSwatch, { backgroundColor: '#0000FF' }]} onPress={() => setStrokeColor('#0000FF')} />
        <TouchableOpacity style={[styles.colorSwatch, { backgroundColor: '#00FF00' }]} onPress={() => setStrokeColor('#00FF00')} />
      </View>

      <View style={styles.widthPicker}>
        <TouchableOpacity style={styles.widthButton} onPress={() => setStrokeWidth(3)}><Text style={styles.buttonText}>3</Text></TouchableOpacity>
        <TouchableOpacity style={styles.widthButton} onPress={() => setStrokeWidth(5)}><Text style={styles.buttonText}>5</Text></TouchableOpacity>
        <TouchableOpacity style={styles.widthButton} onPress={() => setStrokeWidth(10)}><Text style={styles.buttonText}>10</Text></TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  canvasContainer: {
    width: width * 0.9,
    height: height * 0.6,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  sketchCanvas: {
    flex: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eraserButton: {
    backgroundColor: '#dc3545',
  },
  penButton: {
    backgroundColor: '#28a745',
  },
  colorPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 10,
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  widthPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
    marginBottom: 20,
  },
  widthButton: {
    padding: 8,
    backgroundColor: '#6c757d',
    borderRadius: 5,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  hiddenSaveComponent: { width: 0, height: 0 },
  hiddenTextComponent: { width: 0, height: 0 },
  hiddenClearComponent: { width: 0, height: 0 },
  hiddenUndoComponent: { width: 0, height: 0 },
  hiddenRedoComponent: { width: 0, height: 0 },
});

export default ArtStudioScreen;
