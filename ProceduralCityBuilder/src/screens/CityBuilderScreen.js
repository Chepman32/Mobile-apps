
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Canvas, Rect, useValue, useTouchHandler, Circle, Text as SkiaText, Font } from '@shopify/react-native-skia';
import ViewShot from 'react-native-view-shot';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const TILE_SIZE = 20;
const GRID_SIZE = 20; // 20x20 grid

// Simple Perlin noise implementation (conceptual)
const perlinNoise = (x, y) => {
  // In a real app, this would be a more complex noise function
  return Math.random(); 
};

const CityBuilderScreen = () => {
  const [grid, setGrid] = useState([]);
  const [selectedTool, setSelectedTool] = useState('road'); // 'road', 'residential', 'commercial', 'industrial'
  const [isProUser, setIsProUser] = useState(false);
  const viewShotRef = useRef(null);

  useEffect(() => {
    generateNewCity();
    const loadProStatus = async () => {
      const proStatus = await AsyncStorage.getItem('isProUser');
      setIsProUser(proStatus === 'true');
    };
    loadProStatus();
  }, []);

  const generateNewCity = () => {
    const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
    // Simple procedural generation: random terrain
    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const noiseVal = perlinNoise(i, j);
        if (noiseVal < 0.2) newGrid[i][j] = 'water';
        else if (noiseVal < 0.5) newGrid[i][j] = 'grass';
        else newGrid[i][j] = 'dirt';
      }
    }
    setGrid(newGrid);
  };

  const handleGridPress = (x, y) => {
    setGrid(prevGrid => {
      const newGrid = [...prevGrid.map(row => [...row])];
      if (selectedTool === 'road') newGrid[y][x] = 'road';
      else if (selectedTool === 'residential') newGrid[y][x] = 'residential';
      else if (selectedTool === 'commercial') newGrid[y][x] = 'commercial';
      else if (selectedTool === 'industrial') newGrid[y][x] = 'industrial';
      return newGrid;
    });
  };

  const captureAndShare = async () => {
    if (viewShotRef.current) {
      try {
        const uri = await viewShotRef.current.capture();
        Alert.alert('Image Captured', `Image saved to: ${uri}. In a real app, this would be shared.`);
        // In a real app, you would use react-native-share to share the URI
      } catch (error) {
        console.error('Failed to capture image:', error);
        Alert.alert('Error', 'Failed to capture image.');
      }
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium buildings, terrain, etc.'
    );
    // For demonstration, simulate unlocking pro features
    AsyncStorage.setItem('isProUser', 'true');
    setIsProUser(true);
    Alert.alert('Premium Unlocked!', 'You now have access to all premium features!');
  };

  return (
    <View style={styles.container}>
      <ViewShot ref={viewShotRef} options={{ format: "png", quality: 0.9 }} style={styles.canvasContainer}>
        <Canvas style={styles.canvas}>
          {grid.map((row, y) => (
            row.map((cell, x) => {
              let color = '#eee';
              if (cell === 'water') color = '#add8e6';
              else if (cell === 'grass') color = '#90ee90';
              else if (cell === 'dirt') color = '#d2b48c';
              else if (cell === 'road') color = '#696969';
              else if (cell === 'residential') color = '#ffb6c1';
              else if (cell === 'commercial') color = '#ffa07a';
              else if (cell === 'industrial') color = '#808080';

              return (
                <Rect
                  key={`${x}-${y}`}
                  x={x * TILE_SIZE}
                  y={y * TILE_SIZE}
                  width={TILE_SIZE}
                  height={TILE_SIZE}
                  color={color}
                />
              );
            })
          ))}
        </Canvas>
      </ViewShot>

      <View style={styles.toolsContainer}>
        <TouchableOpacity
          style={[styles.toolButton, selectedTool === 'road' && styles.selectedToolButton]}
          onPress={() => setSelectedTool('road')}
        >
          <Text style={styles.toolButtonText}>Road</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, selectedTool === 'residential' && styles.selectedToolButton]}
          onPress={() => setSelectedTool('residential')}
        >
          <Text style={styles.toolButtonText}>Res</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, selectedTool === 'commercial' && styles.selectedToolButton]}
          onPress={() => setSelectedTool('commercial')}
        >
          <Text style={styles.toolButtonText}>Com</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolButton, selectedTool === 'industrial' && styles.selectedToolButton]}
          onPress={() => setSelectedTool('industrial')}
        >
          <Text style={styles.toolButtonText}>Ind</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={generateNewCity}>
        <Text style={styles.buttonText}>New City</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={captureAndShare}>
        <Text style={styles.buttonText}>Share City</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  canvasContainer: {
    width: GRID_SIZE * TILE_SIZE,
    height: GRID_SIZE * TILE_SIZE,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  canvas: {
    width: '100%',
    height: '100%',
  },
  toolsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toolButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  selectedToolButton: {
    backgroundColor: '#007bff',
  },
  toolButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default CityBuilderScreen;
