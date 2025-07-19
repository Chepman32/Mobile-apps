
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Sound from 'react-native-sound';
import { Accelerometer } from 'react-native-sensors';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'breathingCoach.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

// Enable playback in silence mode
Sound.setCategory('Playback');

const inhaleSound = new Sound('inhale.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load inhale sound', error);
    return;
  }
});

const exhaleSound = new Sound('exhale.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load exhale sound', error);
    return;
  }
});

const BreathingExerciseScreen = ({ navigation }) => {
  const [isBreathing, setIsBreathing] = useState(false);
  const [phase, setPhase] = useState('Inhale');
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    if (isBreathing) {
      timerRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

      // Simulate biometric monitoring for personalized exercises (conceptual)
      accelerometerSubscription.current = new Accelerometer({ updateInterval: 1000 }).subscribe(({ x, y, z }) => {
        // In a real app, AI would analyze breathing patterns from sensors
        // and adjust exercise pace or type.
        if (Math.random() > 0.8) { // Simulate a change
          setPhase(prevPhase => {
            if (prevPhase === 'Inhale') return 'Exhale';
            if (prevPhase === 'Exhale') return 'Inhale';
            return prevPhase;
          });
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
      inhaleSound.release();
      exhaleSound.release();
    };
  }, [isBreathing]);

  const startExercise = () => {
    setIsBreathing(true);
    setTimer(0);
    setPhase('Inhale');
    inhaleSound.play();
    Alert.alert('Exercise Started', 'Follow the breathing guide.');
  };

  const stopExercise = () => {
    setIsBreathing(false);
    Alert.alert('Exercise Ended', `You breathed for ${timer} seconds.`);
    saveSession(timer);
  };

  const saveSession = (duration) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS breathing_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, duration INTEGER, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO breathing_sessions (duration, timestamp) VALUES (?, ?)',
            [duration, new Date().toLocaleString()],
            () => console.log('Breathing session saved!'),
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
      'In a real app, this would initiate an in-app purchase for advanced exercises, biometric analysis, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathing Exercise</Text>
      <Text style={styles.phaseText}>{phase}</Text>
      <Text style={styles.timerText}>{timer}s</Text>

      {!isBreathing ? (
        <TouchableOpacity style={styles.button} onPress={startExercise}>
          <Text style={styles.buttonText}>Start Exercise</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopExercise}>
          <Text style={styles.buttonText}>Stop Exercise</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Content</Text>
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
  phaseText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  timerText: {
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

export default BreathingExerciseScreen;
