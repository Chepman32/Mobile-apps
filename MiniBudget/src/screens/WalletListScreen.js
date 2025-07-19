
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Realm from 'realm';

// Define Realm Schema
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

const WalletListScreen = ({ navigation }) => {
  const [wallets, setWallets] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'minibudget.realm',
          schema: [WalletSchema, TransactionSchema],
        });
        setRealm(newRealm);

        const initialWallets = newRealm.objects('Wallet');
        if (initialWallets.length === 0) {
          newRealm.write(() => {
            newRealm.create('Wallet', { _id: new Realm.BSON.ObjectId(), name: 'Cash', balance: 0 });
            newRealm.create('Wallet', { _id: new Realm.BSON.ObjectId(), name: 'Bank Account', balance: 0 });
          });
        }
        setWallets(Array.from(newRealm.objects('Wallet')));

        newRealm.objects('Wallet').addListener(() => {
          setWallets(Array.from(newRealm.objects('Wallet')));
        });
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

  const addWallet = () => {
    Alert.prompt(
      'Add New Wallet',
      'Enter wallet name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: (name) => {
            if (name && realm) {
              realm.write(() => {
                realm.create('Wallet', { _id: new Realm.BSON.ObjectId(), name: name, balance: 0 });
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const purchasePro = () => {
    Alert.alert(
      'Purchase MiniBudget Pro',
      'In a real app, this would initiate an in-app purchase to unlock unlimited wallets, reports, etc.'
    );
    // For demonstration, let's simulate unlocking pro features
    // You would typically store this in AsyncStorage or a secure store
    Alert.alert('Pro Unlocked!', 'You now have access to all premium features!');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={wallets}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.walletItem}
            onPress={() => navigation.navigate('TransactionList', { walletId: item._id.toHexString(), walletName: item.name })}
          >
            <Text style={styles.walletName}>{item.name}</Text>
            <Text style={styles.walletBalance}>Balance: ${item.balance.toFixed(2)}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No wallets yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addWallet}>
        <Text style={styles.addButtonText}>Add Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.proButton} onPress={purchasePro}>
        <Text style={styles.proButtonText}>Unlock MiniBudget Pro</Text>
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
  walletItem: {
    padding: 20,
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
  walletName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  walletBalance: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  proButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  proButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default WalletListScreen;
