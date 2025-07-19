
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import MapView, { Marker } from 'react-native-maps';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CheckInScreen = ({ navigation }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [placeName, setPlaceName] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        console.log(error);
        Alert.alert('Location Error', 'Could not get current location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const handleCheckIn = async () => {
    if (!currentLocation || !placeName.trim()) {
      Alert.alert('Error', 'Please get your location and enter a place name.');
      return;
    }

    try {
      await addDoc(collection(db, 'checkins'), {
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email, // Or display name
        placeName: placeName,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        timestamp: serverTimestamp(),
      });
      Alert.alert('Success', `Checked into ${placeName}!`);
      navigation.navigate('Journal');
    } catch (error) {
      console.error('Error checking in:', error);
      Alert.alert('Error', 'Failed to check in.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check In</Text>
      {currentLocation ? (
        <MapView
          style={styles.map}
          initialRegion={currentLocation}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          <Marker coordinate={currentLocation} title="My Location" />
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>Getting current location...</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Place Name (e.g., Eiffel Tower, Local Cafe)"
        value={placeName}
        onChangeText={setPlaceName}
      />

      <TouchableOpacity style={styles.button} onPress={handleCheckIn}>
        <Text style={styles.buttonText}>Check In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.journalButton} onPress={() => navigation.navigate('Journal')}>
        <Text style={styles.buttonText}>View Journal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 20,
  },
  mapPlaceholder: {
    width: '100%',
    height: 250,
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
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  journalButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default CheckInScreen;
