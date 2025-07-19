
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS } from 'react-native-permissions';

const TrackScreen = ({ navigation }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const watchId = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (status === 'granted') {
        return true;
      } else {
        Alert.alert('Location Permission Denied', 'Please enable location services in settings.');
        return false;
      }
    } else if (Platform.OS === 'android') {
      const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (status === 'granted') {
        return true;
      } else {
        Alert.alert('Location Permission Denied', 'Please enable location services in settings.');
        return false;
      }
    }
    return false;
  };

  const startTracking = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) return;

    setIsTracking(true);
    setRouteCoordinates([]);
    setCurrentPosition(null);

    watchId.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoordinate = { latitude, longitude };
        setCurrentPosition(newCoordinate);
        setRouteCoordinates((prev) => [...prev, newCoordinate]);
      },
      (error) => {
        console.log(error);
        Alert.alert('Location Error', error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10, // Update every 10 meters
        interval: 5000, // Update every 5 seconds
        fastestInterval: 2000,
      }
    );
  };

  const stopTracking = async () => {
    setIsTracking(false);
    if (watchId.current !== null) {
      Geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    if (routeCoordinates.length > 1) {
      const newTrack = {
        id: Date.now().toString(),
        date: new Date().toLocaleString(),
        coordinates: routeCoordinates,
        distance: calculateDistance(routeCoordinates), // Simple distance calculation
      };
      try {
        const storedTracks = await AsyncStorage.getItem('tracks');
        const tracks = storedTracks ? JSON.parse(storedTracks) : [];
        const updatedTracks = [...tracks, newTrack];
        await AsyncStorage.setItem('tracks', JSON.stringify(updatedTracks));
        Alert.alert('Track Saved', `Distance: ${newTrack.distance.toFixed(2)} km`);
      } catch (error) {
        console.error('Failed to save track:', error);
        Alert.alert('Error', 'Failed to save track.');
      }
    }
  };

  const calculateDistance = (coords) => {
    let dist = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      dist += haversine(coords[i], coords[i + 1]);
    }
    return dist; // in kilometers
  };

  // Haversine formula to calculate distance between two lat/lon points
  const haversine = (coord1, coord2) => {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRad(coord2.latitude - coord1.latitude);
    const dLon = toRad(coord2.longitude - coord1.longitude);
    const lat1 = toRad(coord1.latitude);
    const lat2 = toRad(coord2.latitude);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value) => (value * Math.PI) / 180;

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  const purchaseMaps = () => {
    Alert.alert(
      'Purchase Offline Maps',
      'In a real app, this would initiate an in-app purchase for map packs.'
    );
  };

  return (
    <View style={styles.container}>
      {currentPosition && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          region={{
            latitude: currentPosition.latitude,
            longitude: currentPosition.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Polyline coordinates={routeCoordinates} strokeWidth={3} strokeColor="blue" />
          {routeCoordinates.length > 0 && (
            <Marker coordinate={routeCoordinates[0]} title="Start" pinColor="green" />
          )}
          {routeCoordinates.length > 1 && (
            <Marker coordinate={routeCoordinates[routeCoordinates.length - 1]} title="End" pinColor="red" />
          )}
        </MapView>
      )} {!currentPosition && (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Waiting for GPS signal...</Text>
        </View>
      )}

      <View style={styles.controls}>
        {!isTracking ? (
          <TouchableOpacity style={styles.button} onPress={startTracking}>
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTracking}>
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
          <Text style={styles.buttonText}>View History</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseMaps}>
        <Text style={styles.purchaseButtonText}>Purchase Offline Maps</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  mapPlaceholderText: {
    fontSize: 18,
    color: '#666',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TrackScreen;
