
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Accelerometer } from 'react-native-sensors';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'sleepOptimizer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const SleepTrackerScreen = ({ navigation }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [sleepDuration, setSleepDuration] = useState(0);
  const [sleepQuality, setSleepQuality] = useState('Good'); // Conceptual
  const timerRef = useRef(null);
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    if (isTracking) {
      timerRef.current = setInterval(() => {
        setSleepDuration((prevDuration) => prevDuration + 1);
      }, 1000);

      // Simulate sleep quality based on sensor data (conceptual)
      accelerometerSubscription.current = new Accelerometer({ updateInterval: 5000 }).subscribe(({ x, y, z }) => {
        // In a real app, AI would analyze movement patterns for sleep stages
        const movement = Math.sqrt(x * x + y * y + z * z);
        if (movement > 0.5) { // Simulate restless sleep
          setSleepQuality('Restless');
        } else {
          setSleepQuality('Good');
        }
      });
    } else {
      clearInterval(timerRef.current);
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.unsubscribe();
      }
    }

    return () => {
      clearInterval(timerRef.current);
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.unsubscribe();
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    setSleepDuration(0);
    Alert.alert('Sleep Tracking Started', 'Go to sleep! Your sleep is being monitored.');
  };

  const stopTracking = () => {
    setIsTracking(false);
    Alert.alert('Sleep Tracking Ended', `You slept for ${Math.floor(sleepDuration / 3600)} hours and ${Math.floor((sleepDuration % 3600) / 60)} minutes. Sleep quality: ${sleepQuality}.`);
    saveSleepSession(sleepDuration, sleepQuality);
  };

  const saveSleepSession = (duration, quality) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS sleep_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, duration INTEGER, quality TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO sleep_sessions (duration, quality, timestamp) VALUES (?, ?, ?)',
            [duration, quality, new Date().toLocaleString()],
            () => console.log('Sleep session saved!'),
            (tx, error) => console.error('Error saving session', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced sleep analysis, custom recommendations, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sleep Optimizer</Text>
      <Text style={styles.durationText}>Sleep Duration: {Math.floor(sleepDuration / 3600)}h {Math.floor((sleepDuration % 3600) / 60)}m</Text>
      <Text style={styles.qualityText}>Sleep Quality: {sleepQuality}</Text>

      {!isTracking ? (
        <TouchableOpacity style={styles.button} onPress={startTracking}>
          <Text style={styles.buttonText}>Start Sleep Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTracking}>
          <Text style={styles.buttonText}>Stop Sleep Tracking</Text>
        </TouchableOpacity>
      )}

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
  durationText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  qualityText: {
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
  stopButton: {
    backgroundColor: '#dc3545',
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

export default SleepTrackerScreen;
