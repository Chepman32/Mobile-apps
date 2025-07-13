import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import Voice from '@react-native-voice/voice';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { storage } from '../services/storage';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [transcript, setTranscript] = useState('');

  const startRecording = async () => {
    try {
      await Voice.start('en-US');
    } catch {
      // ignore
    }
  };

  Voice.onSpeechResults = e => {
    const text = e.value?.[0] ?? '';
    setTranscript(text);
    storage.set('melody', text);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>{transcript || 'Tap record and hum your tune'}</Text>
      <Button title="Record" onPress={startRecording} />
      <Button title="Settings" onPress={() => navigation.navigate('Settings')} />
    </View>
  );
}
