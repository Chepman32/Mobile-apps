
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'timeTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const TimeTrackerScreen = ({ route, navigation }) => {
  const { taskId, taskName } = route.params;
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerIntervalRef.current = BackgroundTimer.setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      BackgroundTimer.clearInterval(timerIntervalRef.current);
    }
    return () => BackgroundTimer.clearInterval(timerIntervalRef.current);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    if (timeElapsed > 0) {
      saveTimeEntry();
    }
  };

  const saveTimeEntry = () => {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS time_entries (id INTEGER PRIMARY KEY AUTOINCREMENT, taskId INTEGER, date TEXT, duration INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO time_entries (taskId, date, duration) VALUES (?, ?, ?)',
            [taskId, date, timeElapsed],
            () => {
              Alert.alert('Time Saved', `Recorded ${formatTime(timeElapsed)} for ${taskName}.`);
              navigation.goBack();
            },
            (tx, error) => console.error('Error saving time entry', error)
          );
        },
        (tx, error) => console.error('Error creating time_entries table', error)
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.taskName}>{taskName}</Text>
      <Text style={styles.timerText}>{formatTime(timeElapsed)}</Text>

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startTimer}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTimer}>
            <Text style={styles.buttonText}>Stop & Save</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  taskName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 40,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TimeTrackerScreen;
