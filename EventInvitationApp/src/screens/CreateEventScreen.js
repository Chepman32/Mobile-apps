
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const CreateEventScreen = ({ navigation }) => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const auth = getAuth();
  const db = getFirestore();

  const handleCreateEvent = async () => {
    if (!eventName.trim() || !eventDate.trim() || !eventLocation.trim()) {
      Alert.alert('Error', 'Please fill in event name, date, and location.');
      return;
    }

    try {
      await addDoc(collection(db, 'events'), {
        name: eventName,
        date: eventDate,
        location: eventLocation,
        description: eventDescription,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.email, // Or display name
        rsvps: [],
      });
      Alert.alert('Success', 'Event created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error creating event:', error);
      Alert.alert('Error', 'Failed to create event.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={eventName}
        onChangeText={setEventName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={eventDate}
        onChangeText={setEventDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={eventLocation}
        onChangeText={setEventLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (Optional)"
        value={eventDescription}
        onChangeText={setEventDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateEvent}>
        <Text style={styles.buttonText}>Create Event</Text>
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
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateEventScreen;
