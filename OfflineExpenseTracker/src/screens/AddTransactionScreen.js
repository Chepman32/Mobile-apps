
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';
import RNFS from 'react-native-fs';

const db = SQLite.openDatabase(
  { name: 'expenses.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddTransactionScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [receiptUri, setReceiptUri] = useState(null);

  const handleAddTransaction = () => {
    if (!amount.trim() || !category.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount.');
      return;
    }

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO transactions (amount, category, description, date, receiptUri) VALUES (?, ?, ?, ?, ?)',
        [parsedAmount, category, description, date, receiptUri],
        () => {
          Alert.alert('Success', 'Transaction added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding transaction', error)
      );
    });
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setReceiptUri(response.assets[0].uri);
        // Placeholder for OCR integration (react-native-mlkit)
        Alert.alert('Receipt Scanned', 'Simulating OCR. In a real app, text would be extracted from the image.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Category (e.g., Food, Transport)"
        value={category}
        onChangeText={setCategory}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity style={styles.scanButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Scan Receipt</Text>
      </TouchableOpacity>
      {receiptUri && <Image source={{ uri: receiptUri }} style={styles.receiptImage} />}

      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.buttonText}>Add Transaction</Text>
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
  scanButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default AddTransactionScreen;
