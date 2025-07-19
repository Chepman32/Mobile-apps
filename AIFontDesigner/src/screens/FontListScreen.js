
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'fontDesigner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const FontListScreen = ({ navigation }) => {
  const [fonts, setFonts] = useState([]);

  const loadFonts = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS fonts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, characters TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM fonts',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyFonts = [
                  { name: 'Basic Sans', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', isPremium: 0 },
                  { name: 'Elegant Serif', characters: 'abcdefghijklmnopqrstuvwxyz', isPremium: 0 },
                  { name: 'Handwritten Script', characters: '1234567890', isPremium: 1 },
                ];
                dummyFonts.forEach(f => {
                  tx.executeSql(
                    'INSERT INTO fonts (name, characters, isPremium) VALUES (?, ?, ?)',
                    [f.name, f.characters, f.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting font', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM fonts',
                [],
                (_, { rows: allRows }) => {
                  const loadedFonts = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedFonts.push(allRows.item(i));
                  }
                  setFonts(loadedFonts);
                },
                (tx, error) => console.error('Error fetching fonts', error)
              );
            },
            (tx, error) => console.error('Error checking fonts', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadFonts();
    const unsubscribe = navigation.addListener('focus', () => {
      loadFonts();
    });
    return unsubscribe;
  }, [navigation, loadFonts]);

  const createFont = () => {
    Alert.prompt(
      'New Font',
      'Enter font name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Create', onPress: (name) => {
            if (name) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO fonts (name, characters, isPremium) VALUES (?, ?, ?)',
                  [name, '', 0],
                  (_, result) => {
                    navigation.navigate('FontEditor', { fontId: result.insertId });
                  },
                  (tx, error) => console.error('Error adding font', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const handleFontPress = (font) => {
    if (font.isPremium) {
      Alert.alert(
        'Premium Font',
        'This font is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('FontEditor', { fontId: font.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium font tools, AI features, etc.'
    );
  };

  const renderFontItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.fontItem, item.isPremium ? styles.premiumFontItem : null]}
      onPress={() => handleFontPress(item)}
    >
      <Text style={styles.fontName}>{item.name}</Text>
      <Text style={styles.fontCharacters}>{item.characters.substring(0, 20)}...</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={fonts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderFontItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No fonts found. Create one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={createFont}>
        <Text style={styles.buttonText}>Create New Font</Text>
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
  fontItem: {
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
  premiumFontItem: {
    backgroundColor: '#ffe0b2',
  },
  fontName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  fontCharacters: {
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

export default FontListScreen;
