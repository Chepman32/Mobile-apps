
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import plantsData from '../data/plants.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const IdentifyScreen = ({ navigation }) => {
  const devices = useCameraDevices();
  const camera = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      setCameraPermission(status === 'granted');
    })();
  }, []);

  const handleIdentify = async () => {
    if (camera.current) {
      // In a real app, you would capture a photo here
      // const photo = await camera.current.takePhoto({
      //   qualityPrioritization: 'speed',
      //   flash: 'off',
      // });

      // Placeholder for ML Kit / TFLite inference
      Alert.alert(
        'Identifying...',
        'Simulating plant identification. In a real app, ML model would process the image.'
      );

      // Simulate identification result
      const identifiedPlant = plantsData.plants[Math.floor(Math.random() * plantsData.plants.length)];

      // Update scan count
      const storedScanCount = await AsyncStorage.getItem('scanCount');
      let currentScanCount = storedScanCount ? JSON.parse(storedScanCount) : 0;
      await AsyncStorage.setItem('scanCount', JSON.stringify(currentScanCount + 1));

      // Save identified plant (if not locked)
      if (!identifiedPlant.locked) {
        const storedIdentifiedPlants = await AsyncStorage.getItem('identifiedPlants');
        let identifiedPlants = storedIdentifiedPlants ? JSON.parse(storedIdentifiedPlants) : [];
        const isAlreadyIdentified = identifiedPlants.some(p => p.id === identifiedPlant.id);
        if (!isAlreadyIdentified) {
          identifiedPlants.push(identifiedPlant);
          await AsyncStorage.setItem('identifiedPlants', JSON.stringify(identifiedPlants));
        }
      }

      navigation.navigate('PlantDetail', { plantId: identifiedPlant.id });
    }
  };

  if (devices.back == null) {
    return <Text>Loading camera...</Text>;
  }

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
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={devices.back}
        isActive={true}
        photo={true}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.identifyButton} onPress={handleIdentify}>
          <Text style={styles.identifyButtonText}>Capture & Identify</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  buttonContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  identifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  identifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default IdentifyScreen;
