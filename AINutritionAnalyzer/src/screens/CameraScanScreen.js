
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { RNCamera } from 'react-native-camera';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'nutritionAnalyzer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CameraScanScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);

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
        
        // Simulate AI-powered image recognition
        Alert.alert(
          'Analyzing Food',
          `Simulating AI analysis of image: ${data.uri}. (Conceptual)`
        );

        // Simulate nutrition data lookup
        const dummyNutrition = {
          name: 'Apple',
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
        };

        db.transaction((tx) => {
          tx.executeSql(
            'INSERT INTO meals (name, calories, protein, carbs, fat, timestamp, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [dummyNutrition.name, dummyNutrition.calories, dummyNutrition.protein, dummyNutrition.carbs, dummyNutrition.fat, new Date().toLocaleString(), 0],
            () => {
              Alert.alert('Nutrition Found', `Found ${dummyNutrition.name}: ${dummyNutrition.calories} calories.`);
              navigation.navigate('Tracker');
            },
            (tx, error) => console.error('Error adding meal from scan', error)
          );
        });

      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to take picture.');
      }
    }
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
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera for food scanning',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity onPress={takePicture} style={styles.captureButton}>
            <Text style={styles.buttonText}> Scan Food </Text>
          </TouchableOpacity>
        </View>
      </RNCamera>
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
});

export default CameraScanScreen;
