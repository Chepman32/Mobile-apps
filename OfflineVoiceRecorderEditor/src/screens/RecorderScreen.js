
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import RNFS from 'react-native-fs';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecorderScreen = ({ navigation }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedAudioPath, setRecordedAudioPath] = useState(null);
  const [recordDuration, setRecordDuration] = useState('00:00:00');
  const [playDuration, setPlayDuration] = useState('00:00:00');
  const [playCurrentPosition, setPlayCurrentPosition] = useState('00:00:00');

  useEffect(() => {
    return () => {
      audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removeRecordBackListener();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  const onStartRecord = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        setRecordDuration(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)));
      });
      setIsRecording(true);
      console.log(result);
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
      setRecordedAudioPath(result);
      Alert.alert('Recording Saved', `Audio saved to: ${result}`);
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const onStartPlay = async () => {
    if (!recordedAudioPath) {
      Alert.alert('No Recording', 'Please record something first.');
      return;
    }
    try {
      await audioRecorderPlayer.startPlayer(recordedAudioPath);
      audioRecorderPlayer.addPlayBackListener((e) => {
        setPlayCurrentPosition(audioRecorderPlayer.mmss(Math.floor(e.currentPosition / 1000)));
        setPlayDuration(audioRecorderPlayer.mmss(Math.floor(e.duration / 1000)));
        if (e.currentPosition === e.duration) {
          audioRecorderPlayer.stopPlayer();
          setIsPlaying(false);
        }
      });
      setIsPlaying(true);
    } catch (err) {
      console.error('Failed to start playback:', err);
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
    } catch (err) {
      console.error('Failed to stop playback:', err);
      Alert.alert('Error', 'Failed to stop playback.');
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium features, advanced editing, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Recorder</Text>

      <View style={styles.audioControls}>
        <TouchableOpacity style={styles.button} onPress={isRecording ? onStopRecord : onStartRecord}>
          <Text style={styles.buttonText}>{isRecording ? 'Stop Recording' : 'Start Recording'}</Text>
        </TouchableOpacity>
        {recordedAudioPath && (
          <TouchableOpacity style={styles.button} onPress={isPlaying ? onStopPlay : onStartPlay}>
            <Text style={styles.buttonText}>{isPlaying ? 'Stop Playback' : 'Play Recording'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {isRecording && <Text style={styles.durationText}>Recording: {recordDuration}</Text>}
      {isPlaying && <Text style={styles.durationText}>Playback: {playCurrentPosition} / {playDuration}</Text>}

      <TouchableOpacity style={styles.listButton} onPress={() => navigation.navigate('AudioList')}>
        <Text style={styles.buttonText}>View Audio Notes</Text>
      </TouchableOpacity>

      {recordedAudioPath && (
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Editor', { audioUri: recordedAudioPath })}>
          <Text style={styles.buttonText}>Edit Audio</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  audioControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  durationText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  listButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  editButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default RecorderScreen;
