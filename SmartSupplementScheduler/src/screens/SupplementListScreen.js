import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'supplementScheduler.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const SupplementListScreen = ({ navigation }) => {
  const [supplements, setSupplements] = useState([]);

  const loadSupplements = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS supplements (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, dosage TEXT, frequency TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM supplements',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummySupplements = [
                  { name: 'Vitamin D', dosage: '1000 IU', frequency: 'daily', isPremium: 0 },
                  { name: 'Omega-3', dosage: '1000 mg', frequency: 'daily', isPremium: 0 },
                  { name: 'Creatine', dosage: '5g', frequency: 'daily', isPremium: 1 },
                ];
                dummySupplements.forEach(s => {
                  tx.executeSql(
                    'INSERT INTO supplements (name, dosage, frequency, isPremium) VALUES (?, ?, ?, ?)',
                    [s.name, s.dosage, s.frequency, s.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting supplement', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM supplements',
                [],
                (_, { rows: allRows }) => {
                  const loadedSupplements = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedSupplements.push(allRows.item(i));
                  }
                  setSupplements(loadedSupplements);
                },
                (tx, error) => console.error('Error fetching supplements', error)
              );
            },
            (tx, error) => console.error('Error checking supplements', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadSupplements();
    const unsubscribe = navigation.addListener('focus', () => {
      loadSupplements();
    });
    return unsubscribe;
  }, [navigation, loadSupplements]);

  const addSupplement = () => {
    navigation.navigate('AddSupplement');
  };

  const viewSchedule = () => {
    navigation.navigate('Schedule');
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced scheduling, health analytics, etc.'
    );
  };

  const renderSupplementItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.supplementItem, item.isPremium ? styles.premiumSupplementItem : null]}
      onPress={() => Alert.alert('Supplement Details', `Name: ${item.name}\nDosage: ${item.dosage}\nFrequency: ${item.frequency}`)}
    >
      <Text style={styles.supplementName}>{item.name}</Text>
      <Text style={styles.supplementDosage}>{item.dosage}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={supplements}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSupplementItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No supplements added yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addSupplement}>
        <Text style={styles.buttonText}>Add New Supplement</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.scheduleButton} onPress={viewSchedule}>
        <Text style={styles.buttonText}>View Schedule</Text>
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
  supplementItem: {
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
  premiumSupplementItem: {
    backgroundColor: '#ffe0b2',
  },
  supplementName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  supplementDosage: {
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
  scheduleButton: {
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

export default SupplementListScreen;
