
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'mealPlanner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ShoppingListScreen = ({ navigation }) => {
  const [shoppingList, setShoppingList] = useState([]);
  const [newItem, setNewItem] = useState('');

  const loadShoppingList = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS shopping_list (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, isCompleted INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM shopping_list',
            [],
            (_, { rows }) => {
              const loadedList = [];
              for (let i = 0; i < rows.length; i++) {
                loadedList.push(rows.item(i));
              }
              setShoppingList(loadedList);
            },
            (tx, error) => console.error('Error fetching shopping list', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadShoppingList();
    const unsubscribe = navigation.addListener('focus', () => {
      loadShoppingList();
    });
    return unsubscribe;
  }, [navigation, loadShoppingList]);

  const addItem = () => {
    if (!newItem.trim()) {
      Alert.alert('Error', 'Please enter an item.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO shopping_list (item, isCompleted) VALUES (?, ?)',
        [newItem, 0],
        () => {
          Alert.alert('Success', 'Item added!');
          setNewItem('');
          loadShoppingList();
        },
        (tx, error) => console.error('Error adding item', error)
      );
    });
  };

  const toggleItemCompletion = (itemId, isCompleted) => {
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE shopping_list SET isCompleted = ? WHERE id = ?',
        [isCompleted ? 0 : 1, itemId],
        () => {
          Alert.alert('Item Updated', `Item marked as ${isCompleted ? 'incomplete' : 'complete'}.`);
          loadShoppingList();
        },
        (tx, error) => console.error('Error updating item', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced planning, nutritionist features, etc.'
    );
  };

  const renderShoppingItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.shoppingItem, item.isCompleted ? styles.completedItem : null]}
      onPress={() => toggleItemCompletion(item.id, item.isCompleted)}
    >
      <Text style={styles.itemText}>{item.item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Add new item..."
        value={newItem}
        onChangeText={setNewItem}
      />
      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>

      <FlatList
        data={shoppingList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderShoppingItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Your shopping list is empty.</Text>}
      />

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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  shoppingItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedItem: {
    backgroundColor: '#d4edda',
    textDecorationLine: 'line-through',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default ShoppingListScreen;
