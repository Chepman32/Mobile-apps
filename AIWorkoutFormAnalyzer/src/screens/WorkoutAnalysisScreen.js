
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Video from 'react-native-video';

const WorkoutAnalysisScreen = ({ route }) => {
  const { workoutId, workoutName } = route.params;
  const cameraRef = useRef(null);
  const videoRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [recordedVideoUri, setRecordedVideoUri] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await RNCamera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    };
    requestPermissions();
  }, []);

  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        const options = { quality: RNCamera.Constants.VideoQuality['480p'] };
        const data = await cameraRef.current.recordAsync(options);
        setRecordedVideoUri(data.uri);
        setIsRecording(false);
      } catch (error) {
        console.error('Failed to start recording:', error);
        Alert.alert('Error', 'Failed to start recording.');
        setIsRecording(false);
      }
    }
  };

  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  };

  const analyzeForm = () => {
    if (!recordedVideoUri) {
      Alert.alert('Error', 'Please record a video first.');
      return;
    }

    Alert.alert(
      'Analyzing Form',
      'Simulating AI-powered video analysis and form feedback. (Conceptual)'
    );
    // In a real app, an AI model would analyze the video for form correctness
    const dummyFeedback = [
      'Keep your back straight.',
      'Go deeper in your squat.',
      'Engage your core more.',
    ];
    const randomFeedback = dummyFeedback[Math.floor(Math.random() * dummyFeedback.length)];
    setAnalysisResult(randomFeedback);
  };

  if (!cameraPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera permission not granted.</Text>
        <Text style={styles.permissionText}>Please enable camera access in your device settings.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.workoutName}>{workoutName} Form Analysis</Text>

      {recordedVideoUri ? (
        <Video
          ref={videoRef}
          source={{ uri: recordedVideoUri }}
          style={styles.videoPlayer}
          resizeMode="contain"
          controls={true}
        />
      ) : (
        <RNCamera
          ref={cameraRef}
          style={styles.cameraPreview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.off}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera for form analysis',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
        />
      )}

      <View style={styles.controls}>
        {!isRecording ? (
          <TouchableOpacity style={styles.button} onPress={startRecording}>
            <Text style={styles.buttonText}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopRecording}>
            <Text style={styles.buttonText}>Stop Recording</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={analyzeForm}>
          <Text style={styles.buttonText}>Analyze Form</Text>
        </TouchableOpacity>
      </View>

      {analysisResult && (
        <View style={styles.analysisResultContainer}>
          <Text style={styles.analysisResultText}>Analysis: {analysisResult}</Text>
        </View>
      )}
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
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  cameraPreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  videoPlayer: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  controls: {
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
  stopButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  analysisResultContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  analysisResultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
});

export default WorkoutAnalysisScreen;
