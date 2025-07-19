
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';

const BarcodeScannerScreen = ({ navigation }) => {
  const [cameraPermission, setCameraPermission] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await RNCamera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    };
    requestPermissions();
  }, []);

  const onBarCodeRead = ({ data }) => {
    Alert.alert('Barcode Scanned', `Scanned: ${data}`);
    navigation.goBack();
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
          message: 'We need your permission to use your camera for barcode scanning',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      >
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>Point camera at a barcode</Text>
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
});

export default BarcodeScannerScreen;
