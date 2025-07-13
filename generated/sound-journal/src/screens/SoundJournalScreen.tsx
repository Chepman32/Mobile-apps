import React, { useState } from 'react';
import { View } from 'react-native';
import { Audio } from 'expo-av';
import { Button, Text } from 'react-native-paper';
import { saveRecording } from '../services/storage';

export default function SoundJournalScreen() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const startRecording = async () => {
    const rec = new Audio.Recording();
    try {
      await rec.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await rec.startAsync();
      setRecording(rec);
    } catch (e) {
      console.warn(e);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) {
      await saveRecording(uri);
    }
    setRecording(null);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>SoundJournal</Text>
      {recording ? (
        <Button mode="contained" onPress={stopRecording}>
          Stop
        </Button>
      ) : (
        <Button mode="contained" onPress={startRecording}>
          Record
        </Button>
      )}
    </View>
  );
}
