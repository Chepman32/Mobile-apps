
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import { Accelerometer } from 'react-native-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [breathCount, setBreathCount] = useState(0);
  const timerRef = useRef(null);
  const lastY = useRef(0);
  const breathThreshold = 0.1; // Adjust based on sensor sensitivity

  useEffect(() => {
    let subscription;
    if (isMeditating) {
      timerRef.current = BackgroundTimer.setInterval(() => {
        setMeditationTime((prevTime) => prevTime + 1);
      }, 1000);

      // Simulate breath detection using accelerometer (conceptual)
      subscription = new Accelerometer({ updateInterval: 100 }).subscribe(({ y }) => {
        if (Math.abs(y - lastY.current) > breathThreshold) {
          setBreathCount((prevCount) => prevCount + 1);
        }
        lastY.current = y;
      });
    } else {
      BackgroundTimer.clearInterval(timerRef.current);
      if (subscription) {
        subscription.unsubscribe();
      }
    }

    return () => {
      BackgroundTimer.clearInterval(timerRef.current);
      if (subscription) {
        subscription.unsubscribe();
      }
      bellSound.release();
    };
  }, [isMeditating]);

  const startMeditation = () => {
    setIsMeditating(true);
    setMeditationTime(0);
    setBreathCount(0);
    bellSound.play();
    Alert.alert('Meditation Started', 'Focus on your breath.');
  };

  const endMeditation = async () => {
    setIsMeditating(false);
    bellSound.play();
    Alert.alert(
      'Meditation Ended',
      `You meditated for ${meditationTime} seconds and took ${Math.floor(breathCount / 2)} breaths.`
    );

    // Save meditation session data
    try {
      const sessionData = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        duration: meditationTime,
        breaths: Math.floor(breathCount / 2),
      };
      const storedSessions = await AsyncStorage.getItem('meditationSessions');
      const sessions = storedSessions ? JSON.parse(storedSessions) : [];
      const updatedSessions = [...sessions, sessionData];
      await AsyncStorage.setItem('meditationSessions', JSON.stringify(updatedSessions));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium guided meditations, courses, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meditation Session</Text>
      <Text style={styles.timerText}>Time: {meditationTime}s</Text>
      <Text style={styles.breathText}>Breaths: {Math.floor(breathCount / 2)}</Text>

      {!isMeditating ? (
        <TouchableOpacity style={styles.button} onPress={startMeditation}>
          <Text style={styles.buttonText}>Start Meditation</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={endMeditation}>
          <Text style={styles.buttonText}>End Meditation</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.buttonText}>View Analytics</Text>
      </TouchableOpacity>
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
  breathText: {
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
  analyticsButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default MeditationSessionScreen;
