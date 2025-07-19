
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Sound from 'react-native-sound';
import { Accelerometer } from 'react-native-sensors';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'meditationGuide.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

// Enable playback in silence mode
Sound.setCategory('Playback');

const bellSound = new Sound('bell.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const MeditationSessionScreen = ({ navigation }) => {
  const [isMeditating, setIsMeditating] = useState(false);
  const [meditationTime, setMeditationTime] = useState(0);
  const [stressLevel, setStressLevel] = useState('Normal'); // Conceptual
  const timerRef = useRef(null);
  const accelerometerSubscription = useRef(null);

  useEffect(() => {
    if (isMeditating) {
      timerRef.current = setInterval(() => {
        setMeditationTime((prevTime) => prevTime + 1);
      }, 1000);

      // Simulate stress level monitoring based on sensor data (conceptual)
      accelerometerSubscription.current = new Accelerometer({ updateInterval: 1000 }).subscribe(({ x, y, z }) => {
        // In a real app, AI would analyze biometric data for stress levels
        if (Math.random() > 0.7) { // Simulate random stress fluctuation
          setStressLevel('High');
        } else {
          setStressLevel('Normal');
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
      bellSound.release();
    };
  }, [isMeditating]);

  const startMeditation = () => {
    setIsMeditating(true);
    setMeditationTime(0);
    bellSound.play();
    Alert.alert('Meditation Started', 'Focus on your breath.');
  };

  const endMeditation = () => {
    setIsMeditating(false);
    bellSound.play();
    Alert.alert('Meditation Ended', `You meditated for ${meditationTime} seconds.`);
    saveMeditationSession(meditationTime);
  };

  const saveMeditationSession = (duration) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS meditation_sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, duration INTEGER, timestamp TEXT)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO meditation_sessions (duration, timestamp) VALUES (?, ?)',
            [duration, new Date().toLocaleString()],
            () => console.log('Meditation session saved!'),
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
      'In a real app, this would initiate an in-app purchase for premium meditations, advanced features, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Session</Text>
      <Text style={styles.timerText}>Time: {meditationTime}s</Text>
      <Text style={styles.stressText}>Stress Level: {stressLevel}</Text>

      {!isMeditating ? (
        <TouchableOpacity style={styles.button} onPress={startMeditation}>
          <Text style={styles.buttonText}>Start Meditation</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={endMeditation}>
          <Text style={styles.buttonText}>End Meditation</Text>
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
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 10,
  },
  stressText: {
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

export default MeditationSessionScreen;
