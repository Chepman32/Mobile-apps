
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';

const db = SQLite.openDatabase(
  { name: 'supplementScheduler.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddSupplementScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleAddSupplement = () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Error', 'Please enter supplement name and dosage.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO supplements (name, dosage, frequency, isPremium) VALUES (?, ?, ?, ?)',
        [name, dosage, frequency, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Supplement added successfully!');
          // Schedule a daily reminder for the new supplement (example: 9 AM)
          PushNotification.localNotificationSchedule({
            message: `Time to take your ${name}!`, // (required)
            date: new Date(Date.now() + 60 * 1000), // Schedule for 1 minute from now for testing
            repeatType: 'day', // Repeat daily
          });
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding supplement', error)
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Supplement Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Vitamin C"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Dosage:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 500mg"
        value={dosage}
        onChangeText={setDosage}
      />

      <Text style={styles.label}>Frequency:</Text>
      <View style={styles.frequencyOptions}>
        <TouchableOpacity
          style={[styles.frequencyButton, frequency === 'daily' && styles.selectedFrequency]}
          onPress={() => setFrequency('daily')}
        >
          <Text style={styles.frequencyButtonText}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.frequencyButton, frequency === 'weekly' && styles.selectedFrequency]}
          onPress={() => setFrequency('weekly')}
        >
          <Text style={styles.frequencyButtonText}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.frequencyButton, frequency === 'monthly' && styles.selectedFrequency]}
          onPress={() => setFrequency('monthly')}
        >
          <Text style={styles.frequencyButtonText}>Monthly</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={handleAddSupplement}>
        <Text style={styles.buttonText}>Add Supplement</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
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
  frequencyOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  frequencyButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  selectedFrequency: {
    backgroundColor: '#007bff',
  },
  frequencyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#28a745',
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

export default AddSupplementScreen;
