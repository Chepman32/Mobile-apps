
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

const inhaleSound = new Sound('inhale.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const exhaleSound = new Sound('exhale.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const holdSound = new Sound('hold.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const TimerScreen = () => {
  const [phase, setPhase] = useState('Inhale');
  const [time, setTime] = useState(4); // 4-7-8 breathing
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const startTimer = () => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 1) {
          handlePhaseChange();
          return 0; // Will be updated by handlePhaseChange
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    setIsRunning(false);
    clearInterval(intervalRef.current);
  };

  const resetTimer = () => {
    stopTimer();
    setPhase('Inhale');
    setTime(4);
  };

  const handlePhaseChange = () => {
    switch (phase) {
      case 'Inhale':
        inhaleSound.play();
        setPhase('Hold (lungs full)');
        setTime(7);
        break;
      case 'Hold (lungs full)':
        holdSound.play();
        setPhase('Exhale');
        setTime(8);
        break;
      case 'Exhale':
        exhaleSound.play();
        setPhase('Hold (lungs empty)');
        setTime(0); // No hold after exhale in 4-7-8, directly to inhale
        setTimeout(() => {
          setPhase('Inhale');
          setTime(4);
        }, 1000); // Small pause before next inhale
        break;
      case 'Hold (lungs empty)': // This case should ideally not be reached in 4-7-8
        setPhase('Inhale');
        setTime(4);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      inhaleSound.release();
      exhaleSound.release();
      holdSound.release();
    };
  }, []);

  const unlockPrograms = () => {
    Alert.alert(
      'Unlock Programs',
      'In a real app, this would initiate an in-app purchase to unlock more programs.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.phaseText}>{phase}</Text>
      <Text style={styles.timerText}>{time}</Text>
      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startTimer}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={stopTimer}>
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.unlockButton} onPress={unlockPrograms}>
        <Text style={styles.unlockButtonText}>Unlock More Programs</Text>
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
  },
  phaseText: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  timerText: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#007bff',
  },
  controls: {
    flexDirection: 'row',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  unlockButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginTop: 50,
  },
  unlockButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TimerScreen;
