
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Accelerometer } from 'react-native-sensors';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'circadianOptimizer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const RhythmTrackerScreen = ({ navigation }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [lightExposure, setLightExposure] = useState('Low'); // Conceptual
  const [activityLevel, setActivityLevel] = useState('Inactive'); // Conceptual
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    if (isTracking) {
      // Simulate light exposure and activity level based on sensor data (conceptual)
      accelerometerSubscription.current = new Accelerometer({ updateInterval: 5000 }).subscribe(({ x, y, z }) => {
        // In a real app, AI would analyze light sensor data and activity patterns
        const movement = Math.sqrt(x * x + y * y + z * z);
        if (movement > 1.5) {
          setActivityLevel('High');
        } else if (movement > 0.5) {
          setActivityLevel('Moderate');
        } else {
          setActivityLevel('Inactive');
        }

        // Simulate light exposure (e.g., based on time of day or external sensor)
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 18) {
          setLightExposure('High');
        } else {
          setLightExposure('Low');
        }
      });
    } else {
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.unsubscribe();
      }
    }
    return () => {
      if (accelerometerSubscription.current) {
        accelerometerSubscription.current.unsubscribe();
      }
    };
  }, [isTracking]);

  const startTracking = () => {
    setIsTracking(true);
    Alert.alert('Tracking Started', 'Your circadian rhythm is now being monitored.');
  };

  const stopTracking = () => {
    setIsTracking(false);
    Alert.alert('Tracking Stopped', 'Circadian rhythm monitoring has stopped.');
    saveRhythmData(lightExposure, activityLevel); // Save last recorded data
  };

  const saveRhythmData = (light, activity) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS rhythm_data (id INTEGER PRIMARY KEY AUTOINCREMENT, light TEXT, activity TEXT, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO rhythm_data (light, activity, timestamp) VALUES (?, ?, ?)',
            [light, activity, new Date().toLocaleString()],
            () => console.log('Rhythm data saved!'),
            (tx, error) => console.error('Error saving data', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const generateRecommendation = () => {
    Alert.alert(
      'Recommendation',
      'Simulating AI-optimized light exposure and activity timing. (Conceptual)'
    );
    // In a real app, AI would suggest optimal times for light exposure and activity.
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced optimization, sleep coaching, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Circadian Rhythm Tracker</Text>
      <Text style={styles.statusText}>Light Exposure: {lightExposure}</Text>
      <Text style={styles.statusText}>Activity Level: {activityLevel}</Text>

      {!isTracking ? (
        <TouchableOpacity style={styles.button} onPress={startTracking}>
          <Text style={styles.buttonText}>Start Tracking</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopTracking}>
          <Text style={styles.buttonText}>Stop Tracking</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={generateRecommendation}>
        <Text style={styles.buttonText}>Get AI Recommendation</Text>
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
  statusText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 10,
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

export default RhythmTrackerScreen;
