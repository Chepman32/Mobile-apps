import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Realm from 'realm';
import Share from 'react-native-share';

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

const TransactionListScreen = ({ route, navigation }) => {
  const { walletId, walletName } = route.params;
  const [transactions, setTransactions] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'minibudget.realm',
          schema: [WalletSchema, TransactionSchema],
        });
        setRealm(newRealm);

        const walletObjectId = new Realm.BSON.ObjectId(walletId);
        const walletTransactions = newRealm.objects('Transaction').filtered('walletId == $0', walletObjectId).sorted('date', true);
        setTransactions(Array.from(walletTransactions));

        walletTransactions.addListener(() => {
          setTransactions(Array.from(walletTransactions));
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
  }, [walletId]);

  const exportTransactions = async () => {
    if (transactions.length === 0) {
      Alert.alert('No Transactions', 'There are no transactions to export.');
      return;
    }

    const header = 'Date,Type,Amount,Description\n';
    const csvContent = transactions.map(t => 
      `${t.date.toLocaleDateString()},${t.type},${t.amount.toFixed(2)},"${t.description}"`
    ).join('\n');
    const fullCsv = header + csvContent;

    try {
      const shareOptions = {
        title: 'Transactions Export',
        message: `MiniBudget Transactions for ${walletName}`,
        url: `data:text/csv;base64,${btoa(fullCsv)}`, // Base64 encode CSV
        subject: 'MiniBudget Transactions',
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Export Failed', 'Could not export transactions.');
    }
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.transactionItem}>
      <View>
        <Text style={styles.transactionDescription}>{item.description}</Text>
        <Text style={styles.transactionDate}>{new Date(item.date).toLocaleDateString()}</Text>
      </View>
      <Text style={[styles.transactionAmount, item.type === 'income' ? styles.income : styles.expense]}>
        {item.type === 'income' ? '+' : '-'}${item.amount.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{walletName} Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item._id.toHexString()}
        renderItem={renderTransaction}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet.</Text>}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTransaction', { walletId: walletId })}
      >
        <Text style={styles.addButtonText}>Add Transaction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exportButton} onPress={exportTransactions}>
        <Text style={styles.exportButtonText}>Export to CSV</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  transactionItem: {
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
  transactionDescription: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  transactionDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  income: {
    color: '#28a745',
  },
  expense: {
    color: '#dc3545',
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
  exportButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  exportButtonText: {
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

export default TransactionListScreen;
