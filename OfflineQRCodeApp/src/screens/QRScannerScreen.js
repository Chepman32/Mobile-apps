
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'qrcodes.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const QRScannerScreen = ({ navigation }) => {
  const [cameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await RNCamera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    };
    requestPermissions();
  }, []);

  const onBarCodeRead = ({ data }) => {
    Alert.alert('QR Code Scanned', `Scanned: ${data}`);
    saveScanHistory(data);
  };

  const saveScanHistory = (data) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, value TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO history (type, value, timestamp) VALUES (?, ?, ?)',
            ['scan', data, new Date().toLocaleString()],
            () => console.log('Scan history saved'),
            (tx, error) => console.error('Error saving scan history', error)
          );
        },
        (tx, error) => console.error('Error creating history table', error)
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
      <RNCamera
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        onBarCodeRead={onBarCodeRead}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera for QR code scanning',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Point camera at a QR Code</Text>
        </View>
      </RNCamera>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QRGenerator')}>
          <Text style={styles.buttonText}>Generate QR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
          <Text style={styles.buttonText}>History</Text>
        </TouchableOpacity>
      </View>
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
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  overlayText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
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
});

export default QRScannerScreen;
