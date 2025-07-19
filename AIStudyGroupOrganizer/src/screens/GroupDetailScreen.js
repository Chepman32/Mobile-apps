
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import { Calendar } from 'react-native-calendars';

const db = SQLite.openDatabase(
  { name: 'studyGroupOrganizer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const GroupDetailScreen = ({ route }) => {
  const { groupId } = route.params;
  const [group, setGroup] = useState(null);
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM study_groups WHERE id = ?',
        [groupId],
        (_, { rows }) => {
          if (rows.length > 0) {
            setGroup(rows.item(0));
          }
        },
        (tx, error) => console.error('Error fetching group', error)
      );

      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS group_schedules (id INTEGER PRIMARY KEY AUTOINCREMENT, groupId INTEGER, date TEXT, topic TEXT)',
        [],
        () => {
          tx.executeSql(
            'SELECT * FROM group_schedules WHERE groupId = ?',
            [groupId],
            (_, { rows }) => {
              const loadedSchedule = {};
              for (let i = 0; i < rows.length; i++) {
                const item = rows.item(i);
                if (!loadedSchedule[item.date]) {
                  loadedSchedule[item.date] = [];
                }
                loadedSchedule[item.date].push({ name: item.topic, height: 50 });
              }
              setSchedule(loadedSchedule);
            },
            (tx, error) => console.error('Error fetching schedule', error)
          );
        },
        (tx, error) => console.error('Error creating schedule table', error)
      );
    });
  }, [groupId]);

  const addScheduleItem = () => {
    Alert.prompt(
      'Add Schedule Item',
      'Enter date (YYYY-MM-DD) and topic:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: (input) => {
            const [date, topic] = input.split(',').map(s => s.trim());
            if (date && topic && group) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO group_schedules (groupId, date, topic) VALUES (?, ?, ?)',
                  [groupId, date, topic],
                  () => {
                    Alert.alert('Success', 'Schedule item added!');
                    // Reload schedule
                    db.transaction((tx) => {
                      tx.executeSql(
                        'SELECT * FROM group_schedules WHERE groupId = ?',
                        [groupId],
                        (_, { rows }) => {
                          const loadedSchedule = {};
                          for (let i = 0; i < rows.length; i++) {
                            const item = rows.item(i);
                            if (!loadedSchedule[item.date]) {
                              loadedSchedule[item.date] = [];
                            }
                            loadedSchedule[item.date].push({ name: item.topic, height: 50 });
                          }
                          setSchedule(loadedSchedule);
                        },
                        (tx, error) => console.error('Error fetching schedule after add', error)
                      );
                    });
                  },
                  (tx, error) => console.error('Error adding schedule item', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const generateAISuggestion = () => {
    Alert.alert(
      'AI Suggestion',
      'Simulating AI-optimized scheduling and progress tracking. (Conceptual)'
    );
    // In a real app, an AI model would suggest optimal study times or topics.
  };

  if (!group) {
    return (
      <View style={styles.container}>
        <Text>Loading group details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.groupName}>{group.name}</Text>
      <Text style={styles.groupSubject}>Subject: {group.subject}</Text>

      <TouchableOpacity style={styles.button} onPress={generateAISuggestion}>
        <Text style={styles.buttonText}>Get AI Scheduling Suggestion</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Study Schedule:</Text>
      <Calendar
        markedDates={schedule}
        style={styles.calendar}
      />
      <TouchableOpacity style={styles.button} onPress={addScheduleItem}>
        <Text style={styles.buttonText}>Add Schedule Item</Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>Group analytics and collaboration tools available with Premium.</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  groupName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  groupSubject: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  calendar: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: 'gray',
  },
});

export default GroupDetailScreen;
