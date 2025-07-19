
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'recoveryTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const RecoveryTrackerScreen = ({ navigation }) => {
  const [recoveryScore, setRecoveryScore] = useState(0); // Conceptual score
  const [lastWorkoutDate, setLastWorkoutDate] = useState('N/A');

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS recovery_data (id INTEGER PRIMARY KEY AUTOINCREMENT, score INTEGER, workoutDate TEXT, timestamp TEXT)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM recovery_data',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyData = [
                  { score: 70, workoutDate: '2024-07-01', timestamp: '2024-07-01 08:00' },
                  { score: 85, workoutDate: '2024-07-02', timestamp: '2024-07-02 08:00' },
                ];
                dummyData.forEach(d => {
                  tx.executeSql(
                    'INSERT INTO recovery_data (score, workoutDate, timestamp) VALUES (?, ?, ?)',
                    [d.score, d.workoutDate, d.timestamp],
                    () => {},
                    (tx, error) => console.error('Error inserting data', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM recovery_data ORDER BY timestamp DESC LIMIT 1',
                [],
                (_, { rows: lastRow }) => {
                  if (lastRow.length > 0) {
                    setRecoveryScore(lastRow.item(0).score);
                    setLastWorkoutDate(lastRow.item(0).workoutDate);
                  }
                },
                (tx, error) => console.error('Error fetching last data', error)
              );
            },
            (tx, error) => console.error('Error checking data', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  const recordRecovery = () => {
    // Simulate AI-powered recovery monitoring
    const newScore = Math.floor(Math.random() * (100 - 50 + 1)) + 50; // 50-100
    const today = new Date().toISOString().split('T')[0];

    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO recovery_data (score, workoutDate, timestamp) VALUES (?, ?, ?)',
        [newScore, today, new Date().toLocaleString()],
        () => {
          setRecoveryScore(newScore);
          setLastWorkoutDate(today);
          Alert.alert('Recovery Recorded', `Your recovery score today is: ${newScore}`);
        },
        (tx, error) => console.error('Error recording recovery', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced recovery analytics, custom programs, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recovery Tracker</Text>
      <Text style={styles.scoreText}>Recovery Score: {recoveryScore}</Text>
      <Text style={styles.lastWorkoutText}>Last Workout: {lastWorkoutDate}</Text>

      <TouchableOpacity style={styles.button} onPress={recordRecovery}>
        <Text style={styles.buttonText}>Record Today's Recovery</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Insights</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  lastWorkoutText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 30,
  },
});

export default RecoveryTrackerScreen;
