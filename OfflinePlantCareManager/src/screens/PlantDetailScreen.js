
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import * as Progress from 'react-native-progress';

const db = SQLite.openDatabase(
  { name: 'plants.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const PlantDetailScreen = ({ route }) => {
  const { plantId } = route.params;
  const [plant, setPlant] = useState(null);

  const loadPlant = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM plants WHERE id = ?',
        [plantId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setPlant(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching plant', error)
      );
    });
  }, [plantId]);

  useEffect(() => {
    loadPlant();
  }, [loadPlant]);

  const markWatered = () => {
    const today = new Date().toISOString().split('T')[0];
    db.transaction((tx) => {
      tx.executeSql(
        'UPDATE plants SET lastWatered = ? WHERE id = ?',
        [today, plantId],
        () => {
          Alert.alert('Success', 'Plant marked as watered!');
          loadPlant(); // Reload plant data
        },
        (tx, error) => console.error('Error updating plant', error)
      );
    });
  };

  if (!plant) {
    return (
      <View style={styles.container}>
        <Text>Loading plant details...</Text>
      </View>
    );
  }

  // Simulate growth progress (conceptual)
  const growthProgress = 0.75; // Example value

  return (
    <ScrollView style={styles.container}>
      {plant.photoUri && (
        <Image source={{ uri: plant.photoUri }} style={styles.plantImage} />
      )}
      <Text style={styles.plantName}>{plant.name}</Text>
      <Text style={styles.plantType}>{plant.type}</Text>
      <Text style={styles.lastWatered}>Last Watered: {plant.lastWatered}</Text>

      <TouchableOpacity style={styles.waterButton} onPress={markWatered}>
        <Text style={styles.buttonText}>Mark as Watered</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Growth Progress:</Text>
      <Progress.Bar progress={growthProgress} width={null} height={15} color={'#28a745'} />
      <Text style={styles.progressText}>{Math.round(growthProgress * 100)}% Grown (Conceptual)</Text>

      {/* Placeholder for care guides and other premium features */}
      {plant.isPremium ? (
        <Text style={styles.premiumFeatureText}>Access to premium care guides and advanced features.</Text>
      ) : (
        <Text style={styles.infoText}>Unlock premium features for detailed care guides and more!</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  plantImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  plantName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  plantType: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
    color: '#666',
  },
  lastWatered: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  waterButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: '#666',
  },
  premiumFeatureText: {
    fontSize: 16,
    color: '#28a745',
    textAlign: 'center',
    marginTop: 30,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 30,
  },
});

export default PlantDetailScreen;
