
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'mentalHealthMonitor.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const MoodTrackerScreen = ({ navigation }) => {
  const [mood, setMood] = useState(null); // 1-5 scale
  const [notes, setNotes] = useState('');

  const handleLogMood = () => {
    if (mood === null) {
      Alert.alert('Error', 'Please select your mood.');
      return;
    }

    const timestamp = new Date().toLocaleString();

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS mood_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, mood INTEGER, notes TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO mood_entries (mood, notes, timestamp, isPremium) VALUES (?, ?, ?, ?)',
            [mood, notes, timestamp, 0], // 0 for non-premium
            () => {
              Alert.alert('Success', 'Mood logged successfully!');
              setMood(null);
              setNotes('');
            },
            (tx, error) => console.error('Error logging mood', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered mood analysis and intervention recommendations. (Conceptual)'
    );
    // In a real app, an AI model would analyze mood patterns and suggest interventions.
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced monitoring, mental health resources, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
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

      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Any additional notes about your mood..."
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogMood}>
        <Text style={styles.buttonText}>Log Mood</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>Get AI Recommendation</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  textArea: {
    height: 120,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
});

export default MoodTrackerScreen;
