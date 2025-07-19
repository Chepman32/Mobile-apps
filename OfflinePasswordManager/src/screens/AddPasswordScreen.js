
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';
import PasswordStrengthMeter from 'react-native-password-strength-meter';

const SECRET_KEY = 'your-super-secret-key'; // In a real app, manage this securely!

const AddPasswordScreen = ({ navigation }) => {
  const [service, setService] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleAddPassword = async () => {
    if (!service.trim() || !username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    try {
      const encryptedPassword = CryptoJS.AES.encrypt(password, SECRET_KEY).toString();

      const newEntry = {
        service,
        username,
        password: encryptedPassword,
      };

      const storedPasswords = await Keychain.getGenericPassword({ service: 'passwords' });
      let existingPasswords = [];
      if (storedPasswords) {
        const decryptedBytes = CryptoJS.AES.decrypt(storedPasswords.password, SECRET_KEY);
        existingPasswords = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
      }

      const updatedPasswords = [...existingPasswords, newEntry];
      await Keychain.setGenericPassword('passwords', CryptoJS.AES.encrypt(JSON.stringify(updatedPasswords), SECRET_KEY).toString());

      Alert.alert('Success', 'Password added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding password:', error);
      Alert.alert('Error', 'Failed to add password.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Service (e.g., Google, Facebook)"
        value={service}
        onChangeText={setService}
      />
      <TextInput
        style={styles.input}
        placeholder="Username/Email"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <PasswordStrengthMeter password={password} />

      <TouchableOpacity style={styles.addButton} onPress={handleAddPassword}>
        <Text style={styles.buttonText}>Add Password</Text>
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddPasswordScreen;
