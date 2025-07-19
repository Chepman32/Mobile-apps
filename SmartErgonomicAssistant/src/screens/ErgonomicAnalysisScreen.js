
import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'ergonomicAssistant.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ErgonomicAnalysisScreen = ({ navigation }) => {
  const cameraRef = useRef(null);
  const [cameraPermission, setCameraPermission] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await RNCamera.requestCameraPermissionsAsync();
      setCameraPermission(cameraStatus.status === 'granted');
    };
    requestPermissions();
  }, []);

  const analyzePosture = async () => {
    if (cameraRef.current) {
      try {
        const options = { quality: 0.5, base64: false };
        const data = await cameraRef.current.takePictureAsync(options);
        
        // Simulate AI-powered workspace ergonomics analysis
        Alert.alert(
          'Analyzing Ergonomics',
          `Simulating AI analysis of image: ${data.uri}. (Conceptual)`
        );

        const dummyFeedback = [
          'Adjust your chair height.',
          'Move your monitor closer.',
          'Ensure your wrists are straight.',
        ];
        const randomFeedback = dummyFeedback[Math.floor(Math.random() * dummyFeedback.length)];
        setAnalysisResult(randomFeedback);
        saveAnalysis(randomFeedback);

      } catch (error) {
        console.error('Failed to take picture:', error);
        Alert.alert('Error', 'Failed to analyze ergonomics.');
      }
    }
  };

  const saveAnalysis = (result) => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS ergonomic_analysis (id INTEGER PRIMARY KEY AUTOINCREMENT, result TEXT, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          tx.executeSql(
            'INSERT INTO ergonomic_analysis (result, timestamp, isPremium) VALUES (?, ?, ?)',
            [result, new Date().toLocaleString(), 0],
            () => console.log('Analysis saved!'),
            (tx, error) => console.error('Error saving analysis', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced analysis, ergonomic coaching, etc.'
    );
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
      <Text style={styles.title}>Ergonomic Analysis</Text>
      <RNCamera
        ref={cameraRef}
        style={styles.cameraPreview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera for ergonomic analysis',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />

      <TouchableOpacity style={styles.button} onPress={analyzePosture}>
        <Text style={styles.buttonText}>Analyze Posture</Text>
      </TouchableOpacity>

      {analysisResult && (
        <View style={styles.analysisResultContainer}>
          <Text style={styles.analysisResultText}>Recommendation: {analysisResult}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Insights</Text>
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
    marginBottom: 20,
  },
  cameraPreview: {
    width: '100%',
    height: 300,
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
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
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
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
    marginTop: 20,
  },
  analysisResultText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
});

export default ErgonomicAnalysisScreen;
