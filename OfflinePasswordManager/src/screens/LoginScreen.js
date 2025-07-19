
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import ReactNativeBiometrics from 'react-native-biometrics';
import * as Keychain from 'react-native-keychain';

const LoginScreen = ({ navigation }) => {
  const [masterPassword, setMasterPassword] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  useEffect(() => {
    ReactNativeBiometrics.isSensorAvailable().then((resultObject) => {
      const { available, biometryType } = resultObject;
      if (available && biometryType) {
        setIsBiometricSupported(true);
      }
    });
  }, []);

  const handleLogin = async () => {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        // Master password already set, verify it
        if (credentials.password === masterPassword) {
          navigation.replace('PasswordList');
        } else {
          Alert.alert('Error', 'Incorrect master password.');
        }
      } else {
        // No master password set, create one
        await Keychain.setGenericPassword('masterPassword', masterPassword);
        Alert.alert('Success', 'Master password set!');
        navigation.replace('PasswordList');
      }
    } catch (error) {
      console.error('Keychain error:', error);
      Alert.alert('Error', 'Could not access secure storage.');
    }
  };

  const handleBiometricLogin = async () => {
    try {
      const { success } = await ReactNativeBiometrics.simplePrompt({
        promptMessage: 'Authenticate to access passwords',
      });

      if (success) {
        navigation.replace('PasswordList');
      } else {
        Alert.alert('Authentication Failed', 'Biometric authentication failed.');
      }
    } catch (error) {
      console.error('Biometric error:', error);
      Alert.alert('Error', 'Biometric authentication failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Offline Password Manager</Text>
      <TextInput
        style={styles.input}
        placeholder="Master Password"
        secureTextEntry
        value={masterPassword}
        onChangeText={setMasterPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login / Set Master Password</Text>
      </TouchableOpacity>

      {isBiometricSupported && (
        <TouchableOpacity style={styles.biometricButton} onPress={handleBiometricLogin}>
          <Text style={styles.buttonText}>Login with Biometrics</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
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
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  biometricButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default LoginScreen;
