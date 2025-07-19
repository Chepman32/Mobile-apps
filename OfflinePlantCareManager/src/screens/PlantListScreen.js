
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'plants.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PlantListScreen = ({ navigation }) => {
  const [plants, setPlants] = useState([]);

  const loadPlants = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS plants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, lastWatered TEXT, photoUri TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM plants ORDER BY name ASC',
            [],
            (_, { rows }) => {
              const loadedPlants = [];
              for (let i = 0; i < rows.length; i++) {
                loadedPlants.push(rows.item(i));
              }
              setPlants(loadedPlants);
            },
            (tx, error) => console.error('Error fetching plants', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadPlants();
    const unsubscribe = navigation.addListener('focus', () => {
      loadPlants();
    });
    return unsubscribe;
  }, [navigation, loadPlants]);

  const addPlant = () => {
    navigation.navigate('AddPlant');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for plant databases, care guides, etc.'
    );
  };

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.plantItem, item.isPremium ? styles.premiumPlantItem : null]}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
    >
      {item.photoUri && <Image source={{ uri: item.photoUri }} style={styles.plantImage} />}
      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{item.name}</Text>
        <Text style={styles.plantType}>{item.type}</Text>
        <Text style={styles.plantLastWatered}>Last Watered: {item.lastWatered}</Text>
      </View>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPlantItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No plants added yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addPlant}>
        <Text style={styles.buttonText}>Add New Plant</Text>
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
  plantItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumPlantItem: {
    backgroundColor: '#ffe0b2',
  },
  plantImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  plantInfo: {
    flex: 1,
  },
  plantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  plantType: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  plantLastWatered: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
    marginLeft: 10,
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

export default PlantListScreen;
