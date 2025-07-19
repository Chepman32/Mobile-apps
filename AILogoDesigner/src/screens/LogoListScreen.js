
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'logoDesigner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const LogoListScreen = ({ navigation }) => {
  const [logos, setLogos] = useState([]);

  const loadLogos = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS logos (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM logos',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyLogos = [
                  { name: 'Minimalist Logo', description: 'A clean and simple logo.', isPremium: 0 },
                  { name: 'Abstract Mark', description: 'A unique abstract logo.', isPremium: 0 },
                  { name: 'Luxury Emblem', description: 'A sophisticated and premium logo.', isPremium: 1 },
                ];
                dummyLogos.forEach(l => {
                  tx.executeSql(
                    'INSERT INTO logos (name, description, isPremium) VALUES (?, ?, ?)',
                    [l.name, l.description, l.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting logo', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM logos',
                [],
                (_, { rows: allRows }) => {
                  const loadedLogos = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedLogos.push(allRows.item(i));
                  }
                  setLogos(loadedLogos);
                },
                (tx, error) => console.error('Error fetching logos', error)
              );
            },
            (tx, error) => console.error('Error checking logos', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadLogos();
    const unsubscribe = navigation.addListener('focus', () => {
      loadLogos();
    });
    return unsubscribe;
  }, [navigation, loadLogos]);

  const createLogo = () => {
    Alert.prompt(
      'New Logo',
      'Enter logo name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO logos (name, description, isPremium) VALUES (?, ?, ?)',
                  [name, '', 0],
                  (_, result) => {
                    navigation.navigate('LogoEditor', { logoId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding logo', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleLogoPress = (logo) => {
    if (logo.isPremium) {
      Alert.alert(
        'Premium Logo',
        'This logo is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('LogoEditor', { logoId: logo.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium logo tools, AI features, etc.'
    );
  };

  const renderLogoItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.logoItem, item.isPremium ? styles.premiumLogoItem : null]}
      onPress={() => handleLogoPress(item)}
    >
      <Text style={styles.logoName}>{item.name}</Text>
      <Text style={styles.logoDescription}>{item.description}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={logos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderLogoItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No logos found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createLogo}>
        <Text style={styles.buttonText}>Create New Logo</Text>
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
  logoItem: {
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
  premiumLogoItem: {
    backgroundColor: '#ffe0b2',
  },
  logoName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  logoDescription: {
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

export default LogoListScreen;
