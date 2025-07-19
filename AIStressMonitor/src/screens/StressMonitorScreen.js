
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Accelerometer } from 'react-native-sensors';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'stressMonitor.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const StressMonitorScreen = ({ navigation }) => {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [stressLevel, setStressLevel] = useState('Low');
  const accelerometerSubscription = useRef(null);
  const [heartRate, setHeartRate] = useState(70); // Conceptual

  useEffect(() => {
    if (isMonitoring) {
      accelerometerSubscription.current = new Accelerometer({ updateInterval: 1000 }).subscribe(({ x, y, z }) => {
        // Simulate stress level based on sensor data and conceptual biometric data
        const movement = Math.sqrt(x * x + y * y + z * z);
        if (movement > 0.8 || heartRate > 90) { // Simple thresholds
          setStressLevel('High');
        } else if (movement > 0.3 || heartRate > 75) {
          setStressLevel('Medium');
        } else {
          setStressLevel('Low');
        }
        // Simulate heart rate change
        setHeartRate(Math.floor(Math.random() * (100 - 60 + 1)) + 60);
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
  }, [isMonitoring, heartRate]);

  const toggleMonitoring = () => {
    setIsMonitoring(!isMonitoring);
    if (!isMonitoring) {
      Alert.alert('Monitoring Started', 'Your stress levels are now being monitored.');
    } else {
      Alert.alert('Monitoring Stopped', 'Stress monitoring has stopped.');
      saveStressData(stressLevel, heartRate); // Save last recorded data
    }
  };

  const saveStressData = (level, hr) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS stress_data (id INTEGER PRIMARY KEY AUTOINCREMENT, level TEXT, heartRate INTEGER, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO stress_data (level, heartRate, timestamp) VALUES (?, ?, ?)',
            [level, hr, new Date().toLocaleString()],
            () => console.log('Stress data saved!'),
            (tx, error) => console.error('Error saving stress data', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const generateRecommendation = () => {
    Alert.alert(
      'Recommendation',
      'Simulating AI-powered intervention recommendations. (Conceptual)'
    );
    // In a real app, AI would suggest breathing exercises, mindfulness, etc.
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced monitoring, stress management programs, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stress Monitor</Text>
      <Text style={styles.stressLevelText}>Current Stress Level: {stressLevel}</Text>
      <Text style={styles.heartRateText}>Heart Rate: {heartRate} bpm (Conceptual)</Text>

      <TouchableOpacity style={styles.button} onPress={toggleMonitoring}>
        <Text style={styles.buttonText}>{isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}</Text>
      </TouchableOpacity>

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
  stressLevelText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  heartRateText: {
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

export default StressMonitorScreen;
