
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import chordsData from '../data/chords.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

const ChordLibraryScreen = ({ navigation }) => {
  const [chords, setChords] = useState([]);

  const loadChords = useCallback(async () => {
    try {
      const unlockedChords = await AsyncStorage.getItem('unlockedChords');
      let updatedChords = chordsData.chords.map(chord => ({
        ...chord,
        locked: chord.locked && !(unlockedChords && JSON.parse(unlockedChords).includes(chord.id))
      }));
      setChords(updatedChords);
    } catch (error) {
      console.error('Failed to load chords:', error);
      setChords(chordsData.chords); // Fallback to default
    }
  }, []);

  useEffect(() => {
    loadChords();
    const unsubscribe = navigation.addListener('focus', () => {
      loadChords();
    });
    return unsubscribe;
  }, [navigation, loadChords]);

  const playChord = (chord) => {
    if (chord.locked) {
      Alert.alert(
        'Chord Locked',
        'This chord is part of a premium pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseChordPack() },
        ]
      );
      return;
    }

    const sound = new Sound(chord.audio, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        Alert.alert('Error', 'Could not load chord sound.');
        return;
      }
      // Play the sound once
      sound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due' + ' to audio decoding errors');
        }
        // Release the audio player resource once the sound is finished
        sound.release();
      });
    });
  };

  const purchaseChordPack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Chord Pack',
      'In a real app, this would initiate an in-app purchase for a chord pack.'
    );
    // For demonstration, let's unlock all locked chords
    const newUnlockedChords = chordsData.chords.filter(c => c.locked).map(c => c.id);
    AsyncStorage.getItem('unlockedChords').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...newUnlockedChords])];
      AsyncStorage.setItem('unlockedChords', JSON.stringify(combinedUnlocked));
      loadChords(); // Reload chords to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chords}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.chordItem, item.locked && styles.lockedChordItem]}
            onPress={() => playChord(item)}
          >
            <Text style={styles.chordName}>{item.name}</Text>
            <Text style={styles.chordDiagram}>{item.diagram}</Text>
            {item.locked && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseChordPack}>
        <Text style={styles.purchaseButtonText}>Unlock All Premium Chords</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  chordItem: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedChordItem: {
    backgroundColor: '#e0e0e0',
  },
  chordName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chordDiagram: {
    fontSize: 16,
    color: '#666',
  },
  lockedText: {
    color: '#888',
    fontSize: 14,
  },
  purchaseButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChordLibraryScreen;
