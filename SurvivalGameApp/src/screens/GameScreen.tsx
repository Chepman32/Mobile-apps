import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, GridComponent, Level } from '../types';
import { useAppContext } from '../context/AppContext';
import { LEVELS } from '../data/levels';

const GameScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Game'>>();
  const { completeLevel, unlockNextLevel } = useAppContext();

  const [level, setLevel] = useState<Level | null>(null);
  const [grid, setGrid] = useState<GridComponent[][]>([]);

  useEffect(() => {
    const levelId = route.params.levelId;
    const currentLevel = LEVELS.find(l => l.id === levelId);
    if (currentLevel) {
      setLevel(currentLevel);
      // Deep copy the grid to avoid mutating the original level data
      setGrid(JSON.parse(JSON.stringify(currentLevel.grid)));
    }
  }, [route.params.levelId]);

  const handleRotate = (row: number, col: number) => {
    const component = grid[row][col];
    if (component.type === 'empty' || component.type === 'source') return;

    const newGrid = [...grid];
    const newRotation = (component.rotation + 90) % 360;
    newGrid[row][col].rotation = newRotation as 0 | 90 | 180 | 270;
    setGrid(newGrid);

    checkWinCondition(newGrid);
  };

  const checkWinCondition = (currentGrid: GridComponent[][]) => {
    // Placeholder for win condition logic
    // In a real game, this would trace the circuit from the source
    // to see if all nodes are powered.
    console.log('Checking win condition...');
  };

  const resetLevel = () => {
    if (level) {
      setGrid(JSON.parse(JSON.stringify(level.grid)));
    }
  };

  if (!level) {
    return <View style={styles.container}><Text style={styles.loadingText}>Loading...</Text></View>;
  }

  const { width } = Dimensions.get('window');
  const tileSize = (width - 32) / level.gridSize.cols;

  const renderComponent = (component: GridComponent) => {
    let iconName: React.ComponentProps<typeof Ionicons>['name'] = 'square-outline';
    let iconColor = '#4a4a58';

    switch (component.type) {
      case 'source':
        iconName = 'flash';
        iconColor = '#ffcc00';
        break;
      case 'wire':
        iconName = 'remove-outline';
        iconColor = '#1f4068';
        break;
      case 'node':
        iconName = 'radio-button-on';
        iconColor = '#e0e0e0';
        break;
    }

    return (
      <Ionicons
        name={iconName}
        size={tileSize * 0.6}
        color={iconColor}
        style={{ transform: [{ rotate: `${component.rotation}deg` }] }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color="#e0e0e0" />
        </TouchableOpacity>
        <Text style={styles.title}>{level.name}</Text>
        <TouchableOpacity onPress={resetLevel} style={styles.resetButton}>
          <Ionicons name="refresh" size={24} color="#e0e0e0" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((component, colIndex) => (
              <TouchableOpacity
                key={component.id}
                style={[styles.tile, { width: tileSize, height: tileSize }]}
                onPress={() => handleRotate(rowIndex, colIndex)}
                activeOpacity={0.7}
              >
                {renderComponent(component)}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    backgroundColor: '#0f3460',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e0e0e0',
  },
  resetButton: {
    padding: 8,
    marginRight: -8,
  },
  loadingText: {
    color: '#e0e0e0',
    fontSize: 18,
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
});

export default GameScreen;

