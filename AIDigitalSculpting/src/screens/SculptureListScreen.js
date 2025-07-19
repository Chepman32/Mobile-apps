
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'digitalSculpting.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const SculptureListScreen = ({ navigation }) => {
  const [sculptures, setSculptures] = useState([]);

  const loadSculptures = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS sculptures (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM sculptures',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummySculptures = [
                  { name: 'Abstract Form', description: 'A modern abstract sculpture.', isPremium: 0 },
                  { name: 'Human Bust', description: 'A detailed human bust.', isPremium: 0 },
                  { name: 'Mythical Creature', description: 'A complex mythical creature.', isPremium: 1 },
                ];
                dummySculptures.forEach(s => {
                  tx.executeSql(
                    'INSERT INTO sculptures (name, description, isPremium) VALUES (?, ?, ?)',
                    [s.name, s.description, s.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting sculpture', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM sculptures',
                [],
                (_, { rows: allRows }) => {
                  const loadedSculptures = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedSculptures.push(allRows.item(i));
                  }
                  setSculptures(loadedSculptures);
                },
                (tx, error) => console.error('Error fetching sculptures', error)
              );
            },
            (tx, error) => console.error('Error checking sculptures', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadSculptures();
    const unsubscribe = navigation.addListener('focus', () => {
      loadSculptures();
    });
    return unsubscribe;
  }, [navigation, loadSculptures]);

  const createSculpture = () => {
    Alert.prompt(
      'New Sculpture',
      'Enter sculpture name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO sculptures (name, description, isPremium) VALUES (?, ?, ?)',
                  [name, '', 0],
                  (_, result) => {
                    navigation.navigate('SculptureEditor', { sculptureId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding sculpture', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleSculpturePress = (sculpture) => {
    if (sculpture.isPremium) {
      Alert.alert(
        'Premium Sculpture',
        'This sculpture is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('SculptureEditor', { sculptureId: sculpture.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium sculpting tools, AI features, etc.'
    );
  };

  const renderSculptureItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.sculptureItem, item.isPremium ? styles.premiumSculptureItem : null]}
      onPress={() => handleSculpturePress(item)}
    >
      <Text style={styles.sculptureName}>{item.name}</Text>
      <Text style={styles.sculptureDescription}>{item.description}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={sculptures}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSculptureItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No sculptures found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createSculpture}>
        <Text style={styles.buttonText}>Create New Sculpture</Text>
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
  sculptureItem: {
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
  premiumSculptureItem: {
    backgroundColor: '#ffe0b2',
  },
  sculptureName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  sculptureDescription: {
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

export default SculptureListScreen;
