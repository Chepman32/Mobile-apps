
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Accelerometer } from 'react-native-sensors';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'postureCorrector.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PostureMonitorScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [postureStatus, setPostureStatus] = useState('Good');
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await RNCamera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    };
    requestPermissions();
  }, []);

  useEffect(() => {
    if (isMonitoring) {
      accelerometerSubscription.current = new Accelerometer({ updateInterval: 100 }).subscribe(({ x, y, z }) => {
        // Simulate posture analysis based on sensor data (conceptual)
        // In a real app, AI would analyze camera feed and sensor data
        if (Math.abs(x) > 0.5 || Math.abs(y) > 0.5) { // Simple threshold
          setPostureStatus('Bad');
        } else {
          setPostureStatus('Good');
        }
      });
    } else {
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.unsubscribe();
      }
    }
    return () => {
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.unsubscribe();
      }
    };
  }, [isMonitoring]);

  const toggleMonitoring = () => {
    if (!cameraPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required for posture monitoring.');
      return;
    }
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      Alert.alert('Monitoring Started', 'Your posture is now being monitored.');
    } else {
      Alert.alert('Monitoring Stopped', 'Posture monitoring has stopped.');
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced analytics, custom alerts, etc.'
    );
  };

  return (
    <View style={styles.container}>
      {cameraPermission ? (
        <RNCamera
          ref={cameraRef}
          style={styles.cameraPreview}
          type={RNCamera.Constants.Type.front} // Use front camera for posture
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera for posture analysis',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      ) : (
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraPlaceholderText}>Camera Preview (Requires Permission)</Text>
        </View>
      )}

      <Text style={styles.statusText}>Posture Status: {postureStatus}</Text>

      <TouchableOpacity style={styles.button} onPress={toggleMonitoring}>
        <Text style={styles.buttonText}>{isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  cameraPreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cameraPlaceholder: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholderText: {
    fontSize: 16,
    color: '#666',
  },
  statusText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default PostureMonitorScreen;
