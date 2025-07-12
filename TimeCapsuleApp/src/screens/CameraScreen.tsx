import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useAppContext } from '../context/AppContext';
import { solveProblem } from '../utils/solver';

const CameraScreen = () => {
  const navigation = useNavigation();
  const { addScan } = useAppContext();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: true, // For OCR processing if needed
      });

      // Simulate OCR and solving
      // In a real app, you'd send the image (photo.uri or photo.base64) to an OCR service
      const mockProblemText = '2 + 2 * 4'; // Mocked OCR result
      const solution = solveProblem(mockProblemText);

      // Save image to a persistent directory
      const newPath = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
      await FileSystem.moveAsync({
        from: photo.uri,
        to: newPath,
      });

      const scanResult = {
        id: Date.now().toString(),
        imageUri: newPath,
        problemText: mockProblemText,
        solution,
        scannedAt: new Date().toISOString(),
      };

      addScan(scanResult);
      navigation.navigate('Result', { scanId: scanResult.id });

    } catch (error) {
      console.error('Failed to take picture:', error);
      Alert.alert('Error', 'Could not capture the image. Please try again.');
    } finally {
      setIsCapturing(false);
    }
  };

  if (hasPermission === null) {
    return <View style={styles.centered}><ActivityIndicator size="large" color="#fff" /></View>;
  }
  if (hasPermission === false) {
    return (
      <View style={styles.centered}>
        <Text style={styles.permissionText}>No access to camera.</Text>
        <TouchableOpacity onPress={() => Camera.requestCameraPermissionsAsync()}>
          <Text style={styles.permissionLink}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={CameraType.back} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
              onPress={takePicture} 
              disabled={isCapturing}
            >
              {isCapturing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="camera" size={40} color="#4a6fa5" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    padding: 24,
    alignItems: 'flex-start',
    marginTop: 20,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#4a6fa5',
  },
  captureButtonDisabled: {
    backgroundColor: '#ccc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
  },
  permissionLink: {
    color: '#4a90e2',
    fontSize: 16,
  },
});

export default CameraScreen;
