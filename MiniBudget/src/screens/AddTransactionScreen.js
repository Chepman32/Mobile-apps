
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Realm from 'realm';

// Define Realm Schema (re-defined for clarity, but ideally imported)
const WalletSchema = {
  name: 'Wallet',
  properties: {
    _id: 'objectId',
    name: 'string',
    balance: 'double',
  },
};

const TransactionSchema = {
  name: 'Transaction',
  properties: {
    _id: 'objectId',
    walletId: 'objectId',
    amount: 'double',
    description: 'string',
    date: 'date',
    type: 'string', // 'income' or 'expense'
  },
};

const AddTransactionScreen = ({ route, navigation }) => {
  const { walletId } = route.params;
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('expense'); // 'expense' or 'income'
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'minibudget.realm',
          schema: [WalletSchema, TransactionSchema],
        });
        setRealm(newRealm);
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  const handleAddTransaction = () => {
    if (!amount.trim() || !description.trim()) {
      Alert.alert('Error', 'Please enter amount and description.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid positive amount.');
      return;
    }

    if (realm) {
      realm.write(() => {
        const wallet = realm.objectForPrimaryKey('Wallet', new Realm.BSON.ObjectId(walletId));
        if (wallet) {
          realm.create('Transaction', {
            _id: new Realm.BSON.ObjectId(),
            walletId: wallet._id,
            amount: parsedAmount,
            description: description,
            date: new Date(),
            type: type,
          });

          if (type === 'income') {
            wallet.balance += parsedAmount;
          } else {
            wallet.balance -= parsedAmount;
          }
        }
      });
      Alert.alert('Success', 'Transaction added successfully!');
      navigation.goBack();
    }
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
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
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
