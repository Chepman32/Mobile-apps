
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'travelJournal.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const TripListScreen = ({ navigation }) => {
  const [trips, setTrips] = useState([]);

  const loadTrips = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS trips (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, startDate TEXT, endDate TEXT, photoUri TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM trips ORDER BY startDate DESC',
            [],
            (_, { rows }) => {
              const loadedTrips = [];
              for (let i = 0; i < rows.length; i++) {
                loadedTrips.push(rows.item(i));
              }
              setTrips(loadedTrips);
            },
            (tx, error) => console.error('Error fetching trips', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadTrips();
    const unsubscribe = navigation.addListener('focus', () => {
      loadTrips();
    });
    return unsubscribe;
  }, [navigation, loadTrips]);

  const addTrip = () => {
    navigation.navigate('AddTrip');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium templates, offline maps, etc.'
    );
  };

  const renderTripItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tripItem}
      onPress={() => navigation.navigate('TripDetail', { tripId: item.id })}
    >
      <Text style={styles.tripName}>{item.name}</Text>
      <Text style={styles.tripDates}>{item.startDate} - {item.endDate}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTripItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No trips planned yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addTrip}>
        <Text style={styles.buttonText}>Plan New Trip</Text>
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
  tripItem: {
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
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  tripDates: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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

export default TripListScreen;
