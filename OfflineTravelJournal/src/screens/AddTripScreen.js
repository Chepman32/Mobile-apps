
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'travelJournal.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddTripScreen = ({ navigation }) => {
  const [tripName, setTripName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [photoUri, setPhotoUri] = useState(null);

  const handleAddTrip = () => {
    if (!tripName.trim() || !startDate.trim() || !endDate.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO trips (name, startDate, endDate, photoUri, isPremium) VALUES (?, ?, ?, ?, ?)',
        [tripName, startDate, endDate, photoUri, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Trip added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding trip', error)
      );
    });
  };

  const takePhoto = () => {
    launchCamera({ mediaType: 'photo', quality: 0.7 }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else if (response.assets && response.assets.length > 0) {
        setPhotoUri(response.assets[0].uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Trip Name (e.g., European Adventure)"
        value={tripName}
        onChangeText={setTripName}
      />
      <TextInput
        style={styles.input}
        placeholder="Start Date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="End Date (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />

      <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Add Trip Photo</Text>
      </TouchableOpacity>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.tripImage} />}

      <TouchableOpacity style={styles.addButton} onPress={handleAddTrip}>
        <Text style={styles.buttonText}>Add Trip</Text>
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
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  photoButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tripImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default AddTripScreen;
