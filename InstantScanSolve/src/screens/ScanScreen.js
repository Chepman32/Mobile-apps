
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAILY_SCAN_LIMIT = 20;
const INITIAL_TOKENS = 20;

const ScanScreen = ({ navigation }) => {
  const [tokens, setTokens] = useState(0);

  const loadTokens = useCallback(async () => {
    try {
      const storedTokens = await AsyncStorage.getItem('scanTokens');
      const lastResetDate = await AsyncStorage.getItem('lastResetDate');
      const today = new Date().toDateString();

      if (!lastResetDate || lastResetDate !== today) {
        // Reset tokens daily
        await AsyncStorage.setItem('scanTokens', JSON.stringify(INITIAL_TOKENS));
        await AsyncStorage.setItem('lastResetDate', today);
        setTokens(INITIAL_TOKENS);
      } else if (storedTokens) {
        setTokens(JSON.parse(storedTokens));
      } else {
        await AsyncStorage.setItem('scanTokens', JSON.stringify(INITIAL_TOKENS));
        await AsyncStorage.setItem('lastResetDate', today);
        setTokens(INITIAL_TOKENS);
      }
    } catch (error) {
      console.error('Failed to load tokens:', error);
      setTokens(INITIAL_TOKENS); // Fallback
    }
  }, []);

  useEffect(() => {
    loadTokens();
    const unsubscribe = navigation.addListener('focus', () => {
      loadTokens();
    });
    return unsubscribe;
  }, [navigation, loadTokens]);

  const handleScan = async () => {
    if (tokens > 0) {
      // Placeholder for camera access and ML model inference
      Alert.alert('Scanning...', 'Simulating scan and solve. In a real app, camera would open here.');
      const result = 'Simulated Result: x = 5'; // Replace with actual ML result

      const updatedTokens = tokens - 1;
      setTokens(updatedTokens);
      await AsyncStorage.setItem('scanTokens', JSON.stringify(updatedTokens));

      navigation.navigate('Result', { scanResult: result });
    } else {
      Alert.alert('No Tokens', 'You have no scan tokens left. Please purchase more.');
    }
  };

  const purchaseTokens = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Tokens',
      'In a real app, this would initiate an in-app purchase for more tokens.'
    );
    // For demonstration, let's add some tokens
    const newTokens = tokens + 500; // Simulate purchasing 500 tokens
    setTokens(newTokens);
    AsyncStorage.setItem('scanTokens', JSON.stringify(newTokens));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.tokenText}>Scan Tokens: {tokens}</Text>
      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Text style={styles.scanButtonText}>Scan & Solve</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseTokens}>
        <Text style={styles.purchaseButtonText}>Purchase More Tokens</Text>
      </TouchableOpacity>
      <Text style={styles.infoText}>
        Free scans reset daily. Purchase tokens for unlimited use.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  tokenText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scanButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 16,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default ScanScreen;
