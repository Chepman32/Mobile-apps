
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const audioRecorderPlayer = new AudioRecorderPlayer();

const PracticeRecorderScreen = () => {
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
      console.log(result);
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

  const chartConfig = {
    backgroundColor: '#e26a00',
    backgroundGradientFrom: '#fb8c00',
    backgroundGradientTo: '#ffa726',
    decimalPlaces: 0, // optional, defaults to 2dp
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#ffa726',
    },
  };

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Practice Recorder</Text>

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

      <Text style={styles.chartTitle}>Practice Statistics (Conceptual)</Text>
      <LineChart
        data={data}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  durationText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    textAlign: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default PracticeRecorderScreen;
