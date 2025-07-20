import React from 'react';
import { StyleSheet } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { View, Text } from '@/components/Themed';
import Board from '@/components/sudoku/Board';
import Controls from '@/components/sudoku/Controls';
import { generateSudoku, solveSudoku } from '@/logic/sudoku';
import { SudokuProvider, useSudoku } from '@/context/SudokuContext';

const GameScreenContent: React.FC = () => {
  const { difficulty } = useLocalSearchParams<{ difficulty: string }>();
  const { grid, selectedCell, selectCell, setCellValue } = useSudoku();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Puzzle` }} />
      <Text style={styles.title}>Sudoku</Text>
      <Text style={styles.subtitle}>Difficulty: {difficulty}</Text>
      
      <View style={styles.boardContainer}>
        <Board />
      </View>
      
      <View style={styles.controlsContainer}>
        <Controls />
      </View>
    </View>
  );
};

export default function GameScreen() {
    return (
        <SudokuProvider>
            <GameScreenContent />
        </SudokuProvider>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2196F3',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  boardContainer: {
    marginBottom: 20,
  },
  controlsContainer: {
    width: '100%',
  },
}); 