
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Calendar } from 'react-native-calendars';
import PushNotification from 'react-native-push-notification';

const db = SQLite.openDatabase(
  { name: 'dailyPlanner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddTask = () => {
    if (!title.trim() || !dueDate.trim()) {
      Alert.alert('Error', 'Please enter task title and due date.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO tasks (title, description, dueDate, isCompleted, isPremium) VALUES (?, ?, ?, ?, ?)',
        [title, description, dueDate, 0, 0], // 0 for not completed, 0 for non-premium
        () => {
          Alert.alert('Success', 'Task added successfully!');
          // Schedule a notification for the task (example: on due date at 9 AM)
          const notificationDate = new Date(dueDate);
          notificationDate.setHours(9, 0, 0, 0);
          PushNotification.localNotificationSchedule({
            message: `Reminder: ${title} is due today!`, // (required)
            date: notificationDate,
          });
          navigation.goBack();
        },
        (tx, error) => console.error('Error adding task', error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title (e.g., Finish report)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description (Optional)"
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Due Date:</Text>
      <Calendar
        onDayPress={(day) => setDueDate(day.dateString)}
        markedDates={{
          [dueDate]: { selected: true, marked: true, selectedColor: '#007bff' },
        }}
        style={styles.calendar}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.buttonText}>Add Task</Text>
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
  calendar: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
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

export default AddTaskScreen;
