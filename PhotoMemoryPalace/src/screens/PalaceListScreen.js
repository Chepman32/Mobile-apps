
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'memoryPalace.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PalaceListScreen = ({ navigation }) => {
  const [palaces, setPalaces] = useState([]);

  const loadPalaces = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS palaces (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, photoUri TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM palaces',
            [],
            (_, { rows }) => {
              const loadedPalaces = [];
              for (let i = 0; i < rows.length; i++) {
                loadedPalaces.push(rows.item(i));
              }
              setPalaces(loadedPalaces);
            },
            (tx, error) => console.error('Error fetching palaces', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadPalaces();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPalaces();
    });
    return unsubscribe;
  }, [navigation, loadPalaces]);

  const addPalace = () => {
    Alert.prompt(
      'New Memory Palace',
      'Enter a name for your new palace:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name) {
              navigation.navigate('Camera', { palaceName: name });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for unlimited palaces, advanced techniques, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={palaces}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.palaceItem}
            onPress={() => navigation.navigate('PalaceDetail', { palaceId: item.id, palaceName: item.name })}
          >
            <Text style={styles.palaceName}>{item.name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No memory palaces yet. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addPalace}>
        <Text style={styles.addButtonText}>Create New Palace</Text>
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
  palaceItem: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  palaceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
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

export default PalaceListScreen;
