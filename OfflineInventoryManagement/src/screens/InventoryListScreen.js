import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import Share from 'react-native-share';

const db = SQLite.openDatabase(
  { name: 'inventory.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const InventoryListScreen = ({ navigation }) => {
  const [items, setItems] = useState([]);

  const loadItems = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, quantity INTEGER, barcode TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM items ORDER BY name ASC',
            [],
            (_, { rows }) => {
              const loadedItems = [];
              for (let i = 0; i < rows.length; i++) {
                loadedItems.push(rows.item(i));
              }
              setItems(loadedItems);
            },
            (tx, error) => console.error('Error fetching items', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadItems();
    const unsubscribe = navigation.addListener('focus', () => {
      loadItems();
    });
    return unsubscribe;
  }, [navigation, loadItems]);

  const addItem = () => {
    navigation.navigate('AddItem');
  };

  const exportInventory = async () => {
    if (items.length === 0) {
      Alert.alert('No Items', 'There are no items to export.');
      return;
    }

    const header = 'Name,Quantity,Barcode\n';
    const csvContent = items.map(item => 
      `"${item.name}",${item.quantity},"${item.barcode || ''}"`
    ).join('\n');
    const fullCsv = header + csvContent;

    try {
      const shareOptions = {
        title: 'Inventory Export',
        message: 'My Inventory Data',
        url: `data:text/csv;base64,${btoa(fullCsv)}`, // Base64 encode CSV
        subject: 'Inventory Data',
      };
      await Share.open(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Export Failed', 'Could not export inventory.');
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced features, multiple inventories, etc.'
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>Quantity: {item.quantity}</Text>
        {item.barcode ? <Text style={styles.itemDetails}>Barcode: {item.barcode}</Text> : null}
      </View>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No items in inventory yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.buttonText}>Add New Item</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.exportButton} onPress={exportInventory}>
        <Text style={styles.buttonText}>Export Inventory (CSV)</Text>
      </TouchableOpacity>
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
  },
  itemContainer: {
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
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
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
  exportButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default InventoryListScreen;
