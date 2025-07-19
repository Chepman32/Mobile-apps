
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'budget.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddTransactionScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense'); // 'income' or 'expense'
  const [category, setCategory] = useState('');

  const handleAddTransaction = () => {
    if (!amount.trim() || !category.trim()) {
      Alert.alert('Error', 'Please enter amount and category.');
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
        'INSERT INTO transactions (amount, type, category, date) VALUES (?, ?, ?, ?)',
        [parsedAmount, type, category, date],
        () => {
          Alert.alert('Success', 'Transaction added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding transaction', error)
      );
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
      <View style={styles.typeSelection}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'expense' && styles.selectedType]}
          onPress={() => setType('expense')}
        >
          <Text style={styles.typeButtonText}>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'income' && styles.selectedType]}
          onPress={() => setType('income')}
        >
          <Text style={styles.typeButtonText}>Income</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Category (e.g., Food, Salary)"
        value={category}
        onChangeText={setCategory}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddTransaction}>
        <Text style={styles.addButtonText}>Add Transaction</Text>
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
  typeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  typeButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedType: {
    backgroundColor: '#007bff',
  },
  typeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddTransactionScreen;
