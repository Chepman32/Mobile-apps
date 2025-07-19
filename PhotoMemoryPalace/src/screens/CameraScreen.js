
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import ImageResizer from 'react-native-image-resizer';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'memoryPalace.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CameraScreen = ({ route, navigation }) => {
  const { palaceName } = route.params;
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await RNCamera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    };
    requestPermissions();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: false };
        const data = await cameraRef.current.takePictureAsync(options);
        
        // Resize image for storage efficiency
        const resizedImage = await ImageResizer.createResizedImage(
          data.uri,
          800, // new width
          600, // new height
          'JPEG', // compress format
          80, // quality
          0, // rotation
          undefined, // output path
          false // keep metadata
        );
        setPhotoUri(resizedImage.uri);
      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to take picture.');
      }
    }
  };

  const savePalace = () => {
    if (!photoUri) {
      Alert.alert('Error', 'Please take a photo first.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO palaces (name, photoUri) VALUES (?, ?)',
        [palaceName, photoUri],
        (_, result) => {
          Alert.alert('Success', `Memory Palace '${palaceName}' created!`);
          navigation.navigate('PalaceDetail', { palaceId: result.insertId, palaceName: palaceName });
        },
        (tx, error) => console.error('Error saving palace', error)
      );
    });
  };

  if (!cameraPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission not granted.</Text>
        <Text style={styles.permissionText}>Please enable camera access in your device settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
          <TouchableOpacity style={styles.saveButton} onPress={savePalace}>
            <Text style={styles.buttonText}>Save Palace</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.retakeButton} onPress={() => setPhotoUri(null)}>
            <Text style={styles.buttonText}>Retake Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <RNCamera
          ref={cameraRef}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        >
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
              <Text style={styles.buttonText}> SNAP </Text>
            </TouchableOpacity>
          </View>
        </RNCamera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  captureButtonContainer: {
    flex: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  captureButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  buttonText: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  previewImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  retakeButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default CameraScreen;
