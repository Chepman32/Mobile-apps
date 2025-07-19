
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'studyGroupOrganizer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const CreateGroupScreen = ({ navigation }) => {
  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');

  const handleCreateGroup = () => {
    if (!groupName.trim() || !subject.trim()) {
      Alert.alert('Error', 'Please enter both group name and subject.');
      return;
    }

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO study_groups (name, subject, isPremium) VALUES (?, ?, ?)',
        [groupName, subject, 0], // 0 for non-premium
        () => {
          Alert.alert('Success', 'Study group created successfully!');
          navigation.goBack();
        },
        (tx, error) => console.error('Error creating group', error)
      );
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Group Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Calculus Study Group"
        value={groupName}
        onChangeText={setGroupName}
      />

      <Text style={styles.label}>Subject:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Math, History, Science"
        value={subject}
        onChangeText={setSubject}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateGroup}>
        <Text style={styles.buttonText}>Create Group</Text>
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
});

export default CreateGroupScreen;
