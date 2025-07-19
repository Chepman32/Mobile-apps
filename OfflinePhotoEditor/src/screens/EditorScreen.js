
import React, { useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import ImageEditor from 'react-native-image-editor';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const EditorScreen = ({ route }) => {
  const { imageUri } = route.params;
  const [editedImageUri, setEditedImageUri] = useState(imageUri);
  const lottieRef = useRef(null);

  const applyFilter = () => {
    // This is a conceptual filter application. 
    // react-native-image-editor primarily handles cropping and resizing.
    // For actual filters, you'd need a more advanced image processing library
    // or implement filters manually (e.g., by manipulating pixel data).
    Alert.alert('Filter Applied', 'Simulating filter application. (Conceptual)');
    // In a real app, you'd process the image and update editedImageUri
    // For now, just play a Lottie animation
    lottieRef.current?.play();
  };

  const saveImage = () => {
    Alert.alert('Image Saved', `Edited image saved to: ${editedImageUri}. (Conceptual)`);
    // In a real app, you'd save the editedImageUri to device storage
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Your Photo</Text>
      <Image source={{ uri: editedImageUri }} style={styles.imagePreview} />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={applyFilter}>
          <Text style={styles.buttonText}>Apply Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={saveImage}>
          <Text style={styles.buttonText}>Save Image</Text>
        </TouchableOpacity>
      </View>

      <LottieView
        ref={lottieRef}
        source={require('../assets/lottie/confetti.json')} // Placeholder Lottie animation
        loop={false}
        autoPlay={false}
        style={styles.lottieAnimation}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imagePreview: {
    width: width * 0.8,
    height: width * 0.8,
    resizeMode: 'contain',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lottieAnimation: {
    width: 200,
    height: 200,
    position: 'absolute',
  },
});

export default EditorScreen;
