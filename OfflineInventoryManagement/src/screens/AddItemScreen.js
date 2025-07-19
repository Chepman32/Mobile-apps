
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'inventory.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddItemScreen = ({ navigation }) => {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [barcode, setBarcode] = useState('');

  const handleAddItem = () => {
    if (!itemName.trim() || !quantity.trim()) {
      Alert.alert('Error', 'Please enter item name and quantity.');
      return;
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      Alert.alert('Error', 'Please enter a valid positive quantity.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO items (name, quantity, barcode, isPremium) VALUES (?, ?, ?, ?)',
        [itemName, parsedQuantity, barcode.trim() || null, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Item added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding item', error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Item Name (e.g., Laptop, Book)"
        value={itemName}
        onChangeText={setItemName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity"
        keyboardType="numeric"
        value={quantity}
        onChangeText={setQuantity}
      />
      <TextInput
        style={styles.input}
        placeholder="Barcode (Optional)"
        value={barcode}
        onChangeText={setBarcode}
      />
      <TouchableOpacity style={styles.scanBarcodeButton} onPress={() => navigation.navigate('BarcodeScanner')}>
        <Text style={styles.buttonText}>Scan Barcode</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
        <Text style={styles.buttonText}>Add Item</Text>
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
  scanBarcodeButton: {
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
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default AddItemScreen;
