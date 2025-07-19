
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'healthTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const SymptomTrackerScreen = ({ navigation }) => {
  const [symptom, setSymptom] = useState('');
  const [severity, setSeverity] = useState(3); // 1-5 scale
  const [notes, setNotes] = useState('');

  const handleLogSymptom = () => {
    if (!symptom.trim()) {
      Alert.alert('Error', 'Please enter a symptom.');
      return;
    }

    const timestamp = new Date().toLocaleString();

    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS symptoms (id INTEGER PRIMARY KEY AUTOINCREMENT, symptom TEXT, severity INTEGER, notes TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO symptoms (symptom, severity, notes, timestamp, isPremium) VALUES (?, ?, ?, ?, ?)',
            [symptom, severity, notes, timestamp, 0], // 0 for non-premium
            () => {
              Alert.alert('Success', 'Symptom logged successfully!');
              setSymptom('');
              setNotes('');
            },
            (tx, error) => console.error('Error logging symptom', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered pattern recognition and health insights. (Conceptual)'
    );
    // In a real app, an AI model would analyze symptom patterns and suggest insights.
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced analytics, health insights, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Log Your Symptoms</Text>
      <TextInput
        style={styles.input}
        placeholder="Symptom (e.g., Headache, Fatigue)"
        value={symptom}
        onChangeText={setSymptom}
      />

      <Text style={styles.label}>Severity (1-5): {severity}</Text>
      <View style={styles.severitySelection}>
        {[1, 2, 3, 4, 5].map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.severityButton, severity === s && styles.selectedSeverity]}
            onPress={() => setSeverity(s)}
          >
            <Text style={styles.severityButtonText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Any additional notes about the symptom..."
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogSymptom}>
        <Text style={styles.buttonText}>Log Symptom</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>Get AI Insights</Text>
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
  severitySelection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  severityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedSeverity: {
    backgroundColor: '#007bff',
  },
  severityButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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

export default SymptomTrackerScreen;
