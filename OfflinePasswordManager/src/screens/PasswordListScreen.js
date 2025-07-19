
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';
import QRCode from 'react-native-qrcode-svg';

const SECRET_KEY = 'your-super-secret-key'; // In a real app, manage this securely!

const PasswordListScreen = ({ navigation }) => {
  const [passwords, setPasswords] = useState([]);
  const [decryptedPassword, setDecryptedPassword] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);

  const loadPasswords = useCallback(async () => {
    try {
      const storedPasswords = await Keychain.getGenericPassword({ service: 'passwords' });
      if (storedPasswords) {
        const decryptedBytes = CryptoJS.AES.decrypt(storedPasswords.password, SECRET_KEY);
        const decryptedJson = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
        setPasswords(decryptedJson);
      } else {
        setPasswords([]);
      }
    } catch (error) {
      console.error('Error loading passwords:', error);
      Alert.alert('Error', 'Could not load passwords.');
    }
  }, []);

  useEffect(() => {
    loadPasswords();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPasswords();
    });
    return unsubscribe;
  }, [navigation, loadPasswords]);

  const decryptAndShow = (encryptedPassword) => {
    try {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedPassword, SECRET_KEY);
      setDecryptedPassword(decryptedBytes.toString(CryptoJS.enc.Utf8));
      setShowQrCode(false);
    } catch (error) {
      console.error('Decryption error:', error);
      Alert.alert('Error', 'Could not decrypt password.');
    }
  };

  const addPassword = () => {
    navigation.navigate('AddPassword');
  };

  const renderPasswordItem = ({ item }) => (
    <View style={styles.passwordItem}>
      <View>
        <Text style={styles.passwordService}>{item.service}</Text>
        <Text style={styles.passwordUsername}>{item.username}</Text>
      </View>
      <TouchableOpacity style={styles.viewButton} onPress={() => decryptAndShow(item.password)}>
        <Text style={styles.buttonText}>View</Text>
      </TouchableOpacity>
    </View>
  );

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for multi-device sync, advanced security, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={passwords}
        keyExtractor={(item) => item.service + item.username}
        renderItem={renderPasswordItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No passwords yet. Add one!</Text>}
      />

      {decryptedPassword && (
        <View style={styles.decryptedContainer}>
          <Text style={styles.decryptedText}>Decrypted Password: {decryptedPassword}</Text>
          <TouchableOpacity style={styles.qrButton} onPress={() => setShowQrCode(!showQrCode)}>
            <Text style={styles.buttonText}>{showQrCode ? 'Hide QR' : 'Show QR'}</Text>
          </TouchableOpacity>
          {showQrCode && (
            <View style={styles.qrCodeContainer}>
              <QRCode value={decryptedPassword} size={150} />
            </View>
          )}
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={addPassword}>
        <Text style={styles.buttonText}>Add New Password</Text>
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
  },
  passwordItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passwordService: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  passwordUsername: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  decryptedContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    alignItems: 'center',
  },
  decryptedText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  qrButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  qrCodeContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default PasswordListScreen;
