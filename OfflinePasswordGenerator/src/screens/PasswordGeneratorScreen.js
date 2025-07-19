
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import * as Keychain from 'react-native-keychain';
import CryptoJS from 'crypto-js';
import Share from 'react-native-share';

const SECRET_KEY = 'your-super-secret-key'; // In a real app, manage this securely!

const PasswordGeneratorScreen = () => {
  const [passwordLength, setPasswordLength] = useState('12');
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const generatePassword = () => {
    const length = parseInt(passwordLength);
    if (isNaN(length) || length <= 0) {
      Alert.alert('Error', 'Please enter a valid password length.');
      return;
    }

    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let allChars = '';
    if (includeUppercase) allChars += uppercaseChars;
    if (includeLowercase) allChars += lowercaseChars;
    if (includeNumbers) allChars += numberChars;
    if (includeSymbols) allChars += symbolChars;

    if (allChars.length === 0) {
      Alert.alert('Error', 'Please select at least one character type.');
      return;
    }

    let newPassword = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * allChars.length);
      newPassword += allChars[randomIndex];
    }
    setGeneratedPassword(newPassword);
  };

  const copyToClipboard = () => {
    Clipboard.setString(generatedPassword);
    Alert.alert('Copied!', 'Password copied to clipboard.');
  };

  const savePassword = async () => {
    if (!generatedPassword) {
      Alert.alert('Error', 'Generate a password first.');
      return;
    }

    Alert.prompt(
      'Save Password',
      'Enter a service name (e.g., Google, Facebook):',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: async (serviceName) => {
            if (serviceName) {
              try {
                const encryptedPassword = CryptoJS.AES.encrypt(generatedPassword, SECRET_KEY).toString();

                const newEntry = {
                  service: serviceName,
                  username: 'generated', // Placeholder
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

                Alert.alert('Success', 'Password saved securely!');
              } catch (error) {
                console.error('Error saving password:', error);
                Alert.alert('Error', 'Failed to save password.');
              }
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const sharePassword = async () => {
    if (!generatedPassword) {
      Alert.alert('Error', 'Generate a password first to share.');
      return;
    }
    try {
      await Share.open({
        message: generatedPassword,
        title: 'Generated Password',
      });
    } catch (error) {
      console.error('Error sharing password:', error);
      Alert.alert('Share Failed', 'Could not share password.');
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium security features and advanced customization.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Generator</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Length:</Text>
        <TextInput
          style={styles.lengthInput}
          keyboardType="numeric"
          value={passwordLength}
          onChangeText={setPasswordLength}
        />
      </View>

      <View style={styles.optionRow}>
        <Text style={styles.label}>Include Uppercase:</Text>
        <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
      </View>
      <View style={styles.optionRow}>
        <Text style={styles.label}>Include Lowercase:</Text>
        <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
      </View>
      <View style={styles.optionRow}>
        <Text style={styles.label}>Include Numbers:</Text>
        <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
      </View>
      <View style={styles.optionRow}>
        <Text style={styles.label}>Include Symbols:</Text>
        <Switch value={includeSymbols} onValueChange={setIncludeSymbols} />
      </View>

      <TouchableOpacity style={styles.generateButton} onPress={generatePassword}>
        <Text style={styles.buttonText}>Generate Password</Text>
      </TouchableOpacity>

      {generatedPassword ? (
        <View style={styles.generatedPasswordContainer}>
          <Text style={styles.generatedPasswordText}>{generatedPassword}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={copyToClipboard}>
            <Text style={styles.buttonText}>Copy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={savePassword}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={sharePassword}>
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      ) : null}

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginRight: 10,
    flex: 1,
  },
  lengthInput: {
    width: 80,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  generateButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  generatedPasswordContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  generatedPasswordText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#28a745',
  },
  copyButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#17a2b8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  shareButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default PasswordGeneratorScreen;
