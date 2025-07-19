import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'colorPaletteCreator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PaletteListScreen = ({ navigation }) => {
  const [palettes, setPalettes] = useState([]);

  const loadPalettes = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS palettes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, colors TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM palettes',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyPalettes = [
                  { name: 'Ocean Breeze', colors: JSON.stringify(['#ADD8E6', '#87CEEB', '#6495ED']), isPremium: 0 },
                  { name: 'Sunset Hues', colors: JSON.stringify(['#FFD700', '#FFA500', '#FF4500']), isPremium: 0 },
                  { name: 'Forest Harmony', colors: JSON.stringify(['#228B22', '#3CB371', '#6B8E23']), isPremium: 1 },
                ];
                dummyPalettes.forEach(p => {
                  tx.executeSql(
                    'INSERT INTO palettes (name, colors, isPremium) VALUES (?, ?, ?)',
                    [p.name, p.colors, p.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting palette', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM palettes',
                [],
                (_, { rows: allRows }) => {
                  const loadedPalettes = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedPalettes.push({ ...allRows.item(i), colors: JSON.parse(allRows.item(i).colors) });
                  }
                  setPalettes(loadedPalettes);
                },
                (tx, error) => console.error('Error fetching palettes', error)
              );
            },
            (tx, error) => console.error('Error checking palettes', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadPalettes();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPalettes();
    });
    return unsubscribe;
  }, [navigation, loadPalettes]);

  const handlePalettePress = (palette) => {
    if (palette.isPremium) {
      Alert.alert(
        'Premium Palette',
        'This palette is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Palette Details', `Name: ${palette.name}\nColors: ${palette.colors.join(', ')}`);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium palettes, AI features, etc.'
    );
  };

  const deletePalette = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM palettes WHERE id = ?', [id], () => {
        loadPalettes();
      });
    });
  };

  const renderPaletteItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.paletteItem, item.isPremium ? styles.premiumPaletteItem : null]}
      onPress={() => handlePalettePress(item)}
    >
      <Text style={styles.paletteName}>{item.name}</Text>
      <View style={styles.colorSwatches}>
        {item.colors.map((color, index) => (
          <View key={index} style={[styles.colorSwatch, { backgroundColor: color }]} />
        ))}
      </View>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
      <TouchableOpacity onPress={() => deletePalette(item.id)}>
        <Text style={styles.deleteButton}>Delete</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={palettes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPaletteItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No palettes found. Create one!</Text>}
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
  paletteItem: {
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
  premiumPaletteItem: {
    backgroundColor: '#ffe0b2',
  },
  paletteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  colorSwatches: {
    flexDirection: 'row',
  },
  colorSwatch: {
    width: 30,
    height: 30,
    borderRadius: 5,
    marginRight: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  deleteButton: {
    color: 'red',
    marginLeft: 10,
  },
});

export default PaletteListScreen;
