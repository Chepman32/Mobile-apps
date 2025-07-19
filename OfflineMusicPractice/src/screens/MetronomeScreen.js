
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Slider from 'react-native-slider';
import Sound from 'react-native-sound';
import BackgroundTimer from 'react-native-background-timer';

// Enable playback in silence mode
Sound.setCategory('Playback');

const clickSound = new Sound('click.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const MetronomeScreen = ({ navigation }) => {
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000; // milliseconds per beat
      timerRef.current = BackgroundTimer.setInterval(() => {
        clickSound.play();
      }, interval);
    } else {
      BackgroundTimer.clearInterval(timerRef.current);
    }
    return () => BackgroundTimer.clearInterval(timerRef.current);
  }, [isPlaying, bpm]);

  const toggleMetronome = () => {
    setIsPlaying(!isPlaying);
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium rhythms, advanced features, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metronome</Text>
      <Text style={styles.bpmText}>{bpm} BPM</Text>

      <Slider
        style={styles.slider}
        minimumValue={40}
        maximumValue={240}
        step={1}
        value={bpm}
        onValueChange={setBpm}
        minimumTrackTintColor="#007bff"
        maximumTrackTintColor="#ccc"
        thumbTintColor="#007bff"
      />

      <TouchableOpacity style={styles.button} onPress={toggleMetronome}>
        <Text style={styles.buttonText}>{isPlaying ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.recorderButton} onPress={() => navigation.navigate('PracticeRecorder')}>
        <Text style={styles.buttonText}>Go to Practice Recorder</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  bpmText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 30,
  },
  slider: {
    width: '80%',
    height: 40,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recorderButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default MetronomeScreen;
