
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'fitnessTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddGoalScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');

  const handleAddGoal = () => {
    if (!name.trim() || !target.trim() || !current.trim()) {
      Alert.alert('Error', 'Please fill all fields.');
      return;
    }

    const parsedTarget = parseFloat(target);
    const parsedCurrent = parseFloat(current);

    if (isNaN(parsedTarget) || parsedTarget <= 0 || isNaN(parsedCurrent) || parsedCurrent < 0) {
      Alert.alert('Error', 'Please enter valid numbers for target and current progress.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO goals (name, target, current, isPremium) VALUES (?, ?, ?, ?)',
        [name, parsedTarget, parsedCurrent, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Goal added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding goal', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-powered dynamic fitness goal adjustment. (Conceptual)'
    );
    // In a real app, an AI model would suggest realistic goals based on user data.
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Goal Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Run 5K, Lift 100kg"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Target Value:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5 (km), 100 (kg)"
        keyboardType="numeric"
        value={target}
        onChangeText={setTarget}
      />

      <Text style={styles.label}>Current Progress:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2 (km), 50 (kg)"
        keyboardType="numeric"
        value={current}
        onChangeText={setCurrent}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddGoal}>
        <Text style={styles.buttonText}>Add Goal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiButton} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Goal Suggestion</Text>
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
  aiButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
});

export default AddGoalScreen;
