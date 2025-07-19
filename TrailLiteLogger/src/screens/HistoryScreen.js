
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryScreen = ({ navigation }) => {
  const [tracks, setTracks] = useState([]);

  const loadTracks = useCallback(async () => {
    try {
      const storedTracks = await AsyncStorage.getItem('tracks');
      if (storedTracks) {
        setTracks(JSON.parse(storedTracks));
      }
    } catch (error) {
      console.error('Failed to load tracks:', error);
    }
  }, []);

  useEffect(() => {
    loadTracks();
    const unsubscribe = navigation.addListener('focus', () => {
      loadTracks();
    });
    return unsubscribe;
  }, [navigation, loadTracks]);

  const renderItem = ({ item }) => (
    <View style={styles.trackItem}>
      <Text style={styles.trackDate}>{item.date}</Text>
      <Text style={styles.trackDistance}>Distance: {item.distance.toFixed(2)} km</Text>
      {/* You could add a button here to view the track on a map */}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tracks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No tracks recorded yet.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  trackItem: {
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
  trackDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  trackDistance: {
    fontSize: 14,
    color: '#666',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default HistoryScreen;
