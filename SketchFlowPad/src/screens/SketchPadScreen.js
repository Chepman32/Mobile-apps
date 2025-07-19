
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Canvas, Path, Skia, useTouchHandler, useValue, Circle } from '@shopify/react-native-skia';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const SketchPadScreen = () => {
  const path = useValue(Skia.Path.Make());
  const [paths, setPaths] = useState([]);
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [strokeColor, setStrokeColor] = useState('black');
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    const loadProStatus = async () => {
      const proStatus = await AsyncStorage.getItem('isProUser');
      setIsProUser(proStatus === 'true');
    };
    loadProStatus();
  }, []);

  const touchHandler = useTouchHandler({
    onStart: (touchInfo) => {
      path.current.moveTo(touchInfo.x, touchInfo.y);
    },
    onActive: (touchInfo) => {
      path.current.lineTo(touchInfo.x, touchInfo.y);
    },
    onEnd: () => {
      setPaths((prevPaths) => [...prevPaths, { path: path.current.copy(), strokeWidth, strokeColor }]);
      path.current.reset();
    },
  });

  const clearCanvas = () => {
    setPaths([]);
    path.current.reset();
  };

  const purchasePro = () => {
    Alert.alert(
      'Purchase Pro Features',
      'In a real app, this would initiate an in-app purchase for unlimited canvas, more brushes, and OCR.'
    );
    // For demonstration, simulate unlocking pro features
    AsyncStorage.setItem('isProUser', 'true');
    setIsProUser(true);
    Alert.alert('Pro Unlocked!', 'You now have access to all premium drawing features!');
  };

  const recognizeHandwriting = () => {
    if (!isProUser) {
      Alert.alert('Pro Feature', 'Handwriting recognition is a Pro feature. Purchase to unlock!');
      return;
    }
    Alert.alert(
      'Handwriting Recognition',
      'Simulating OCR. In a real app, a TFLite model would process the drawing.'
    );
    // Placeholder for ML model inference
    const recognizedText = "Hello World!"; // Simulated result
    Alert.alert('Recognized Text', recognizedText);
  };

  return (
    <View style={styles.container}>
      <Canvas style={styles.canvas} onTouch={touchHandler}>
        {paths.map((p, index) => (
          <Path
            key={index}
            path={p.path}
            color={p.strokeColor}
            style="stroke"
            strokeWidth={p.strokeWidth}
            strokeJoin="round"
            strokeCap="round"
          />
        ))}
        <Path
          path={path}
          color={strokeColor}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeJoin="round"
          strokeCap="round"
        />
      </Canvas>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={clearCanvas}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setStrokeColor('red')}>
          <Circle cx={15} cy={15} r={10} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setStrokeColor('blue')}>
          <Circle cx={15} cy={15} r={10} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setStrokeWidth(strokeWidth + 1)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => setStrokeWidth(Math.max(1, strokeWidth - 1))}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.proButton} onPress={purchasePro}>
        <Text style={styles.proButtonText}>Unlock Pro Features</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ocrButton} onPress={recognizeHandwriting}>
        <Text style={styles.ocrButtonText}>Recognize Handwriting</Text>
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
  canvas: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    justifyContent: 'space-around',
  },
  controlButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  proButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  proButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ocrButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  ocrButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SketchPadScreen;
