
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import plantsData from '../data/plants.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [identifiedPlants, setIdentifiedPlants] = useState([]);
  const [scanCount, setScanCount] = useState(0);
  const DAILY_SCAN_LIMIT = 20;

  const loadData = useCallback(async () => {
    try {
      const storedIdentifiedPlants = await AsyncStorage.getItem('identifiedPlants');
      if (storedIdentifiedPlants) {
        setIdentifiedPlants(JSON.parse(storedIdentifiedPlants));
      }

      const storedScanCount = await AsyncStorage.getItem('scanCount');
      const lastScanDate = await AsyncStorage.getItem('lastScanDate');
      const today = new Date().toDateString();

      if (!lastScanDate || lastScanDate !== today) {
        // Reset scan count daily
        await AsyncStorage.setItem('scanCount', JSON.stringify(0));
        await AsyncStorage.setItem('lastScanDate', today);
        setScanCount(0);
      } else if (storedScanCount) {
        setScanCount(JSON.parse(storedScanCount));
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, loadData]);

  const handleIdentifyPress = () => {
    if (scanCount >= DAILY_SCAN_LIMIT) {
      Alert.alert(
        'Daily Scan Limit Reached',
        'You have used all your free identifications for today. Purchase unlimited scans to continue!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase Unlimited Scans', onPress: () => purchaseUnlimitedScans() },
        ]
      );
      return;
    }
    navigation.navigate('Identify');
  };

  const purchaseUnlimitedScans = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Unlimited Scans',
      'In a real app, this would initiate an in-app purchase for unlimited scans.'
    );
    // For demonstration, let's simulate unlocking unlimited scans
    AsyncStorage.setItem('isUnlimitedScans', 'true');
    setScanCount(0); // Reset count after purchase
    Alert.alert('Unlimited Scans Unlocked!', 'You can now identify plants without limits.');
  };

  const renderPlantItem = ({ item }) => (
    <TouchableOpacity
      style={styles.plantItem}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
    >
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.plantImage} />
      )}
      <View style={styles.plantInfo}>
        <Text style={styles.plantName}>{item.name}</Text>
        <Text style={styles.plantScientificName}>{item.scientificName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Identified Plants</Text>
      <FlatList
        data={identifiedPlants}
        keyExtractor={(item) => item.id}
        renderItem={renderPlantItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No plants identified yet.</Text>
        }
      />
      <Text style={styles.scanCountText}>Scans remaining today: {DAILY_SCAN_LIMIT - scanCount}</Text>
      <TouchableOpacity style={styles.identifyButton} onPress={handleIdentifyPress}>
        <Text style={styles.identifyButtonText}>Identify New Plant</Text>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  plantItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
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
  plantScientificName: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
  scanCountText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  identifyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  identifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
