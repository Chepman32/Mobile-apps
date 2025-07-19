
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const AddHabitScreen = ({ navigation }) => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleAddHabit = async () => {
    if (!habitName.trim() || !frequency.trim()) {
      Alert.alert('Error', 'Please enter both habit name and frequency.');
      return;
    }

    const newHabit = {
      id: Date.now().toString(),
      name: habitName,
      frequency: frequency,
      completed: false,
    };

    try {
      const storedHabits = await AsyncStorage.getItem('habits');
      const habits = storedHabits ? JSON.parse(storedHabits) : [];
      const updatedHabits = [...habits, newHabit];
      await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));

      // Schedule local notification (example: daily reminder at 9 AM)
      PushNotification.localNotificationSchedule({
        id: newHabit.id,
        message: `Time to ${newHabit.name}!`, // (required)
        date: new Date(Date.now() + 60 * 1000), // Schedule for 1 minute from now for testing
        repeatType: 'day', // Repeat daily
      });

      Alert.alert('Success', 'Habit added successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to add habit:', error);
      Alert.alert('Error', 'Failed to add habit.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Habit Name (e.g., Drink 8 glasses of water)"
        value={habitName}
        onChangeText={setHabitName}
      />
      <TextInput
        style={styles.input}
        placeholder="Frequency (e.g., Daily, 3 times a week)"
        value={frequency}
        onChangeText={setFrequency}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddHabit}>
        <Text style={styles.addButtonText}>Add Habit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  addButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
