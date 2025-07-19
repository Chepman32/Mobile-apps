
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'habitStacking.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddHabitStackScreen = ({ navigation }) => {
  const [stackName, setStackName] = useState('');
  const [habit1, setHabit1] = useState('');
  const [habit2, setHabit2] = useState('');
  const [habit3, setHabit3] = useState('');

  const handleAddHabitStack = () => {
    if (!stackName.trim() || !habit1.trim()) {
      Alert.alert('Error', 'Please enter stack name and at least one habit.');
      return;
    }

    const habits = [
      habit1.trim(),
      habit2.trim(),
      habit3.trim(),
    ].filter(h => h !== '');

    if (habits.length === 0) {
      Alert.alert('Error', 'Please add at least one habit to the stack.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO habit_stacks (name, habits, isPremium) VALUES (?, ?, ?)',
        [stackName, JSON.stringify(habits), 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Habit stack added successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding habit stack', error)
      );
    });
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-optimized stacking strategies. (Conceptual)'
    );
    // In a real app, an AI model would suggest optimal habit sequences.
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Habit Stack Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Morning Routine"
        value={stackName}
        onChangeText={setStackName}
      />

      <Text style={styles.label}>Habits (one per line, up to 3 for free):</Text>
      <TextInput
        style={styles.input}
        placeholder="Habit 1"
        value={habit1}
        onChangeText={setHabit1}
      />
      <TextInput
        style={styles.input}
        placeholder="Habit 2 (Optional)"
        value={habit2}
        onChangeText={setHabit2}
      />
      <TextInput
        style={styles.input}
        placeholder="Habit 3 (Optional)"
        value={habit3}
        onChangeText={setHabit3}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddHabitStack}>
        <Text style={styles.buttonText}>Add Habit Stack</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.aiButton} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>AI Strategy Suggestion</Text>
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

export default AddHabitStackScreen;
