
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import RNSketchCanvas from 'react-native-sketch-canvas';
import { launchImageLibrary } from 'react-native-image-picker';
import Share from 'react-native-share';

const { width, height } = Dimensions.get('window');

const DrawingCanvasScreen = () => {
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
      'SketchFlowPad',
      `drawing_${Date.now()}`,
      true,
      true,
      true
    );
    Alert.alert('Drawing Saved', 'Your drawing has been saved to your device!');
  };

  const shareDrawing = async () => {
    sketchCanvasRef.current.save(
      'png',
      false,
      'SketchFlowPad',
      `drawing_share_${Date.now()}`,
      true,
      true,
      true,
      async (error, path) => {
        if (error) {
          console.error('Error saving for share:', error);
          Alert.alert('Error', 'Could not prepare drawing for sharing.');
          return;
        }
        try {
          await Share.open({
            url: `file://${path}`,
            type: 'image/png',
            title: 'My SketchFlow Drawing',
          });
        } catch (shareError) {
          console.error('Error sharing:', shareError);
          Alert.alert('Share Failed', 'Could not share drawing.');
        }
      }
    );
  };

  const pickReferenceImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        // In a real app, you would load this image onto the canvas as a background or layer
        Alert.alert('Reference Image', `Image selected: ${response.assets[0].uri}. (Conceptual: would load onto canvas)`);
      }
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium brushes, tools, and export options.'
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
        <TouchableOpacity style={styles.controlButton} onPress={shareDrawing}>
          <Text style={styles.buttonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={pickReferenceImage}>
          <Text style={styles.buttonText}>Ref Image</Text>
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

export default DrawingCanvasScreen;
