
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import PushNotification from 'react-native-push-notification';

const db = SQLite.openDatabase(
  { name: 'moodTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const MoodEntryScreen = ({ navigation }) => {
  const [mood, setMood] = useState(null); // 1-5 scale
  const [journalEntry, setJournalEntry] = useState('');

  const handleSaveMood = () => {
    if (mood === null) {
      Alert.alert('Error', 'Please select your mood.');
      return;
    }

    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS mood_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, mood INTEGER, journal TEXT, date TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO mood_entries (mood, journal, date) VALUES (?, ?, ?)',
            [mood, journalEntry, date],
            () => {
              Alert.alert('Success', 'Mood and journal entry saved!');
              // Schedule next check-in reminder (example: 24 hours from now)
              PushNotification.localNotificationSchedule({
                message: "Time to check in with your mood!", // (required)
                date: new Date(Date.now() + 60 * 1000 * 60 * 24),
              });
              navigation.navigate('MoodHistory');
            },
            (tx, error) => console.error('Error saving mood entry', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium insights, analytics, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.moodSelection}>
        {[1, 2, 3, 4, 5].map((m) => (
          <TouchableOpacity
            key={m}
            style={[styles.moodButton, mood === m && styles.selectedMood]}
            onPress={() => setMood(m)}
          >
            <Text style={styles.moodButtonText}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.journalInput}
        placeholder="Write about your day..."
        multiline
        value={journalEntry}
        onChangeText={setJournalEntry}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveMood}>
        <Text style={styles.buttonText}>Save Mood</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('MoodHistory')}>
        <Text style={styles.buttonText}>View History</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.buttonText}>View Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  moodSelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    width: '100%',
  },
  moodButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedMood: {
    backgroundColor: '#007bff',
  },
  moodButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  journalInput: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  analyticsButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  premiumButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default MoodEntryScreen;
