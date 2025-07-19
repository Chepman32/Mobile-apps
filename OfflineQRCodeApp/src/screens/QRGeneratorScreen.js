
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import SQLite from 'react-native-sqlite-storage';
import Share from 'react-native-share';

const db = SQLite.openDatabase(
  { name: 'qrcodes.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const QRGeneratorScreen = ({ navigation }) => {
  const [qrValue, setQrValue] = useState('');
  const [generatedQr, setGeneratedQr] = useState(null);

  const generateQrCode = () => {
    if (!qrValue.trim()) {
      Alert.alert('Error', 'Please enter some text to generate QR code.');
      return;
    }
    setGeneratedQr(qrValue);
    saveGenerateHistory(qrValue);
  };

  const saveGenerateHistory = (value) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, value TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO history (type, value, timestamp) VALUES (?, ?, ?)',
            ['generate', value, new Date().toLocaleString()],
            () => console.log('Generate history saved'),
            (tx, error) => console.error('Error saving generate history', error)
          );
        },
        (tx, error) => console.error('Error creating history table', error)
      );
    });
  };

  const shareQrCode = async () => {
    if (!generatedQr) {
      Alert.alert('Error', 'Generate a QR code first to share.');
      return;
    }
    // This is a conceptual share. In a real app, you'd capture the SVG as an image.
    Alert.alert('Share QR Code', 'Simulating QR code sharing.');
    try {
      // Example of sharing a base64 image (conceptual)
      // const base64Image = await generatedQr.toDataURL();
      // await Share.open({ url: `data:image/png;base64,${base64Image}` });
      await Share.open({
        message: `Check out this QR code: ${generatedQr}`,
        title: 'My QR Code',
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
      Alert.alert('Share Failed', 'Could not share QR code.');
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium features, batch operations, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter text or URL for QR code"
        value={qrValue}
        onChangeText={setQrValue}
      />
      <TouchableOpacity style={styles.button} onPress={generateQrCode}>
        <Text style={styles.buttonText}>Generate QR Code</Text>
      </TouchableOpacity>

      {generatedQr && (
        <View style={styles.qrCodeContainer}>
          <QRCode value={generatedQr} size={200} />
          <TouchableOpacity style={styles.shareButton} onPress={shareQrCode}>
            <Text style={styles.buttonText}>Share QR Code</Text>
          </TouchableOpacity>
        </View>
      )}

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
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shareButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
  },
  premiumButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default QRGeneratorScreen;
