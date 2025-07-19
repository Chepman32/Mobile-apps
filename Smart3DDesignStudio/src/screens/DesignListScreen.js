
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: '3dDesignStudio.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const DesignListScreen = ({ navigation }) => {
  const [designs, setDesigns] = useState([]);

  const loadDesigns = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS designs (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM designs',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyDesigns = [
                  { name: 'Simple Cube', description: 'A basic 3D cube model.', isPremium: 0 },
                  { name: 'Complex Sphere', description: 'A detailed 3D sphere model.', isPremium: 0 },
                  { name: 'Architectural House', description: 'A detailed 3D house model.', isPremium: 1 },
                ];
                dummyDesigns.forEach(d => {
                  tx.executeSql(
                    'INSERT INTO designs (name, description, isPremium) VALUES (?, ?, ?)',
                    [d.name, d.description, d.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting design', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM designs',
                [],
                (_, { rows: allRows }) => {
                  const loadedDesigns = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedDesigns.push(allRows.item(i));
                  }
                  setDesigns(loadedDesigns);
                },
                (tx, error) => console.error('Error fetching designs', error)
              );
            },
            (tx, error) => console.error('Error checking designs', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadDesigns();
    const unsubscribe = navigation.addListener('focus', () => {
      loadDesigns();
    });
    return unsubscribe;
  }, [navigation, loadDesigns]);

  const createDesign = () => {
    Alert.prompt(
      'New 3D Design',
      'Enter design name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO designs (name, description, isPremium) VALUES (?, ?, ?)',
                  [name, '', 0],
                  (_, result) => {
                    navigation.navigate('DesignEditor', { designId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding design', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleDesignPress = (design) => {
    if (design.isPremium) {
      Alert.alert(
        'Premium Design',
        'This design is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('DesignEditor', { designId: design.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium 3D tools, AI features, etc.'
    );
  };

  const renderDesignItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.designItem, item.isPremium ? styles.premiumDesignItem : null]}
      onPress={() => handleDesignPress(item)}
    >
      <Text style={styles.designName}>{item.name}</Text>
      <Text style={styles.designDescription}>{item.description}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={designs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderDesignItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No designs found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createDesign}>
        <Text style={styles.buttonText}>Create New Design</Text>
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
  designItem: {
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
  premiumDesignItem: {
    backgroundColor: '#ffe0b2',
  },
  designName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  designDescription: {
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

export default DesignListScreen;
