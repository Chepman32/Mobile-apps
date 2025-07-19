
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Realm from 'realm';
import PushNotification from 'react-native-push-notification';

// Define Realm Schema (re-defined for clarity, but ideally imported)
const HabitSchema = {
  name: 'Habit',
  properties: {
    _id: 'objectId',
    name: 'string',
    frequency: 'string', // e.g., 'daily', 'weekly'
    completedDates: 'string[]', // Store dates as YYYY-MM-DD
    isPremium: 'bool', // For monetization
  },
};

const AddHabitScreen = ({ navigation }) => {
  const [habitName, setHabitName] = useState('');
  const [frequency, setFrequency] = useState('daily');
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await Realm.open({
          path: 'habitTracker.realm',
          schema: [HabitSchema],
        });
        setRealm(newRealm);
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, []);

  const handleAddHabit = () => {
    if (!habitName.trim()) {
      Alert.alert('Error', 'Please enter a habit name.');
      return;
    }

    if (realm) {
      realm.write(() => {
        realm.create('Habit', {
          _id: new Realm.BSON.ObjectId(),
          name: habitName,
          frequency: frequency,
          completedDates: [],
          isPremium: false, // Default to non-premium
        });
      });
      Alert.alert('Success', 'Habit added successfully!');

      // Schedule a daily notification for the new habit
      PushNotification.localNotificationSchedule({
        id: habitName.hashCode(), // Unique ID for the notification
        message: `Time to ${habitName}!`, // (required)
        date: new Date(Date.now() + 60 * 1000), // Schedule for 1 minute from now for testing
        repeatType: 'day', // Repeat daily
      });

      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Habit Name (e.g., Drink water)"
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
        <Text style={styles.addButtonText}>Add Habit</Text>
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
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default AddHabitScreen;
