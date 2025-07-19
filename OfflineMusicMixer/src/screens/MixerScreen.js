
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

const soundsData = [
  { id: 'kick', name: 'Kick', file: 'kick.mp3' },
  { id: 'snare', name: 'Snare', file: 'snare.mp3' },
  { id: 'hihat', name: 'Hi-Hat', file: 'hihat.mp3' },
  { id: 'clap', name: 'Clap', file: 'clap.mp3' },
  { id: 'loop1', name: 'Loop 1', file: 'loop1.mp3', isLoop: true, isPremium: false },
  { id: 'loop2', name: 'Loop 2', file: 'loop2.mp3', isLoop: true, isPremium: true },
];

const loadedSounds = {};

soundsData.forEach(sound => {
  loadedSounds[sound.id] = new Sound(sound.file, Sound.MAIN_BUNDLE, (error) => {
    if (error) {
      console.log(`failed to load ${sound.file}`, error);
      return;
    }
    if (sound.isLoop) {
      loadedSounds[sound.id].setNumberOfLoops(-1); // Loop indefinitely
    }
  });
});

const MixerScreen = () => {
  const [playingSounds, setPlayingSounds] = useState({});

  const toggleSound = (soundId, isPremium) => {
    if (isPremium) {
      Alert.alert(
        'Premium Sound',
        'This sound is part of a premium pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
      return;
    }

    if (playingSounds[soundId]) {
      loadedSounds[soundId].stop(() => {
        setPlayingSounds(prev => ({ ...prev, [soundId]: false }));
      });
    } else {
      loadedSounds[soundId].play((success) => {
        if (success) {
          setPlayingSounds(prev => ({ ...prev, [soundId]: true }));
        } else {
          console.log('playback failed due to audio decoding errors');
          setPlayingSounds(prev => ({ ...prev, [soundId]: false }));
        }
      });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for additional sound packs, exporting, etc.'
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Music Mixer</Text>

      <Text style={styles.sectionTitle}>Drum Pads</Text>
      <View style={styles.drumPadContainer}>
        {soundsData.filter(s => !s.isLoop).map(sound => (
          <TouchableOpacity
            key={sound.id}
            style={[styles.drumPad, playingSounds[sound.id] && styles.drumPadActive]}
            onPress={() => toggleSound(sound.id, sound.isPremium)}
          >
            <Text style={styles.drumPadText}>{sound.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Loops</Text>
      <View style={styles.loopContainer}>
        {soundsData.filter(s => s.isLoop).map(sound => (
          <TouchableOpacity
            key={sound.id}
            style={[styles.loopButton, playingSounds[sound.id] && styles.loopButtonActive, sound.isPremium && styles.premiumLoopButton]}
            onPress={() => toggleSound(sound.id, sound.isPremium)}
          >
            <Text style={styles.loopButtonText}>{sound.name}</Text>
            {sound.isPremium && <Text style={styles.premiumText}>⭐ Premium</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Sounds</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  drumPadContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  drumPad: {
    width: 80,
    height: 80,
    backgroundColor: '#007bff',
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drumPadActive: {
    backgroundColor: '#0056b3',
  },
  drumPadText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loopContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  loopButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    margin: 10,
    alignItems: 'center',
  },
  loopButtonActive: {
    backgroundColor: '#1e7e34',
  },
  premiumLoopButton: {
    backgroundColor: '#ffc107',
  },
  loopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  premiumText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: 'bold',
    marginTop: 5,
  },
  premiumButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MixerScreen;
