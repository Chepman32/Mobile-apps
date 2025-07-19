
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import SQLite from 'react-native-sqlite-storage';
import { Calendar } from 'react-native-calendars';
import PushNotification from 'react-native-push-notification';

const db = SQLite.openDatabase(
  { name: 'plants.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddPlantScreen = ({ navigation }) => {
  const [plantName, setPlantName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [lastWatered, setLastWatered] = useState(new Date().toISOString().split('T')[0]);
  const [photoUri, setPhotoUri] = useState(null);

  const handleAddPlant = () => {
    if (!plantName.trim() || !plantType.trim()) {
      Alert.alert('Error', 'Please enter plant name and type.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO plants (name, type, lastWatered, photoUri, isPremium) VALUES (?, ?, ?, ?, ?)',
        [plantName, plantType, lastWatered, photoUri, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Plant added successfully!');
          // Schedule a watering reminder (example: 7 days from now)
          const wateringDate = new Date();
          wateringDate.setDate(wateringDate.getDate() + 7);
          PushNotification.localNotificationSchedule({
            message: `Time to water your ${plantName}!`, // (required)
            date: wateringDate,
          });
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding plant', error)
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
        placeholder="Plant Name (e.g., Fiddle Leaf Fig)"
        value={plantName}
        onChangeText={setPlantName}
      />
      <TextInput
        style={styles.input}
        placeholder="Plant Type (e.g., Indoor, Succulent)"
        value={plantType}
        onChangeText={setPlantType}
      />

      <Text style={styles.label}>Last Watered:</Text>
      <Calendar
        onDayPress={(day) => setLastWatered(day.dateString)}
        markedDates={{
          [lastWatered]: { selected: true, marked: true, selectedColor: '#007bff' },
        }}
        style={styles.calendar}
      />

      <TouchableOpacity style={styles.photoButton} onPress={takePhoto}>
        <Text style={styles.buttonText}>Take Plant Photo</Text>
      </TouchableOpacity>
      {photoUri && <Image source={{ uri: photoUri }} style={styles.plantImage} />}

      <TouchableOpacity style={styles.addButton} onPress={handleAddPlant}>
        <Text style={styles.buttonText}>Add Plant</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  calendar: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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
  plantImage: {
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

export default AddPlantScreen;
