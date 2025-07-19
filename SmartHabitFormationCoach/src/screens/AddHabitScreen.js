
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'habitCoach.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddHabitScreen = ({ navigation }) => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('daily');

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO habits (name, frequency, completedDates, isPremium) VALUES (?, ?, ?, ?)',
        [habitName, frequency, JSON.stringify([]), 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Habit added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding habit', error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Habit Name (e.g., Meditate)"
        value={habitName}
        onChangeText={setHabitName}
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
      </View>
      <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
        <Text style={styles.buttonText}>Add Habit</Text>
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
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
