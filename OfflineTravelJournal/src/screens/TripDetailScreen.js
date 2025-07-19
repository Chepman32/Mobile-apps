import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import Share from 'react-native-share';

const db = SQLite.openDatabase(
  { name: 'travelJournal.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const TripDetailScreen = ({ route }) => {
  const { tripId } = route.params;
  const [trip, setTrip] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const loadTrip = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM trips WHERE id = ?',
        [tripId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setTrip(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching trip', error)
      );
    });
  }, [tripId]);

  useEffect(() => {
    loadTrip();

    // Get current location for map (conceptual)
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, [loadTrip]);

  const shareJournal = async () => {
    if (!trip) return;

    const journalText = `My Trip to ${trip.name}\nDates: ${trip.startDate} to ${trip.endDate}\n\n${trip.notes || 'No notes yet.'}`;

    try {
      await Share.open({
        message: journalText,
        title: `My Travel Journal: ${trip.name}`,
      });
    } catch (error) {
      console.error('Error sharing journal:', error);
      Alert.alert('Share Failed', 'Could not share journal.');
    }
  };

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.tripName}>{trip.name}</Text>
      <Text style={styles.tripDates}>{trip.startDate} - {trip.endDate}</Text>
      {trip.photoUri && (
        <Image source={{ uri: trip.photoUri }} style={styles.tripImage} />
      )}

      <Text style={styles.sectionTitle}>Notes:</Text>
      <Text style={styles.sectionContent}>{trip.notes || 'No notes for this trip yet.'}</Text>

      <Text style={styles.sectionTitle}>Current Location (Conceptual Map):</Text>
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={currentLocation}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* You can add markers for points of interest here */}
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Loading map...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.shareButton} onPress={shareJournal}>
        <Text style={styles.buttonText}>Share Journal</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  tripName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
    color: '#333',
  },
  tripDates: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  tripImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#666',
  },
  shareButton: {
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
});

export default TripDetailScreen;
