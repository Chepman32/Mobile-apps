import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  View as RNView,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');
const CELL_SIZE = (width - 48) / 9;

type SudokuGrid = (number | null)[][];

interface GameState {
  grid: SudokuGrid;
  solution: SudokuGrid;
  selectedCell: { row: number; col: number } | null;
  isCompleted: boolean;
  timer: number;
  hints: number;
  mistakes: number;
}

export default function GameScreen() {
  const [gameState, setGameState] = useState<GameState>({
    grid: generatePuzzle(),
    solution: generateSolution(),
    selectedCell: null,
    isCompleted: false,
    timer: 0,
    hints: 3,
    mistakes: 0,
  });

  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && !gameState.isCompleted) {
      interval = setInterval(() => {
        setGameState(prev => ({ ...prev, timer: prev.timer + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState.isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectCell = (row: number, col: number) => {
    if (gameState.grid[row][col] === null) {
      setGameState(prev => ({
        ...prev,
        selectedCell: { row, col },
      }));
    }
  };

  const inputNumber = (number: number) => {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const newGrid = [...gameState.grid];
    newGrid[row][col] = number;

    // Check if move is correct
    let newMistakes = gameState.mistakes;
    if (gameState.solution[row][col] !== number) {
      newMistakes++;
      if (newMistakes >= 3) {
        Alert.alert('Game Over', 'Too many mistakes! Try again.', [
          { text: 'Restart', onPress: restartGame },
          { text: 'Quit', onPress: () => router.back() },
        ]);
        return;
      }
    }

    // Check if puzzle is completed
    const isCompleted = checkCompletion(newGrid);
    if (isCompleted) {
      setIsTimerRunning(false);
      Alert.alert('Congratulations!', `You completed the puzzle in ${formatTime(gameState.timer)}!`, [
        { text: 'New Game', onPress: restartGame },
        { text: 'Back to Menu', onPress: () => router.back() },
      ]);
    }

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      mistakes: newMistakes,
      isCompleted,
    }));
  };

  const useHint = () => {
    if (gameState.hints <= 0 || !gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const correctNumber = gameState.solution[row][col];
    
    const newGrid = [...gameState.grid];
    newGrid[row][col] = correctNumber;

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
      hints: prev.hints - 1,
      selectedCell: null,
    }));
  };

  const clearCell = () => {
    if (!gameState.selectedCell) return;

    const { row, col } = gameState.selectedCell;
    const newGrid = [...gameState.grid];
    newGrid[row][col] = null;

    setGameState(prev => ({
      ...prev,
      grid: newGrid,
    }));
  };

  const restartGame = () => {
    setGameState({
      grid: generatePuzzle(),
      solution: generateSolution(),
      selectedCell: null,
      isCompleted: false,
      timer: 0,
      hints: 3,
      mistakes: 0,
    });
    setIsTimerRunning(true);
  };

  const pauseGame = () => {
    setIsTimerRunning(!isTimerRunning);
    Alert.alert('Game Paused', 'Tap Resume to continue playing.', [
      { text: 'Resume', onPress: () => setIsTimerRunning(true) },
    ]);
  };

  const getCellStyle = (row: number, col: number) => {
    const isSelected = gameState.selectedCell?.row === row && gameState.selectedCell?.col === col;
    const isFixed = gameState.grid[row][col] !== null;
    const isInSameRowCol = gameState.selectedCell && 
      (gameState.selectedCell.row === row || gameState.selectedCell.col === col);
    const isInSameBox = gameState.selectedCell &&
      Math.floor(gameState.selectedCell.row / 3) === Math.floor(row / 3) &&
      Math.floor(gameState.selectedCell.col / 3) === Math.floor(col / 3);

    return [
      styles.cell,
      isSelected && styles.selectedCell,
      isInSameRowCol && styles.highlightedCell,
      isInSameBox && styles.boxHighlightedCell,
      isFixed && styles.fixedCell,
      // Border styles for 3x3 boxes
      (row % 3 === 0) && styles.topBorder,
      (col % 3 === 0) && styles.leftBorder,
      (row === 8) && styles.bottomBorder,
      (col === 8) && styles.rightBorder,
    ];
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2196F3" />
        </TouchableOpacity>
        <Text style={styles.title}>Sudoku</Text>
        <TouchableOpacity onPress={pauseGame}>
          <Ionicons name={isTimerRunning ? "pause" : "play"} size={24} color="#2196F3" />
        </TouchableOpacity>
      </View>

      {/* Game Info */}
      <View style={styles.gameInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color="#666" />
          <Text style={styles.infoText}>{formatTime(gameState.timer)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="bulb-outline" size={20} color="#FF9800" />
          <Text style={styles.infoText}>{gameState.hints}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="close-circle-outline" size={20} color="#F44336" />
          <Text style={styles.infoText}>{gameState.mistakes}/3</Text>
        </View>
      </View>

      {/* Sudoku Grid */}
      <View style={styles.gridContainer}>
        {gameState.grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={getCellStyle(rowIndex, colIndex)}
                onPress={() => selectCell(rowIndex, colIndex)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.cellText,
                  cell !== null && styles.filledCellText
                ]}>
                  {cell || ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      {/* Number Input */}
      <View style={styles.numberPad}>
        <View style={styles.numberRow}>
          {[1, 2, 3, 4, 5].map(num => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => inputNumber(num)}
            >
              <Text style={styles.numberText}>{num}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.numberRow}>
          {[6, 7, 8, 9].map(num => (
            <TouchableOpacity
              key={num}
              style={styles.numberButton}
              onPress={() => inputNumber(num)}
            >
              <Text style={styles.numberText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.numberButton, styles.clearButton]}
            onPress={clearCell}
          >
            <Ionicons name="backspace-outline" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
          onPress={useHint}
          disabled={gameState.hints <= 0}
        >
          <Ionicons name="bulb-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#F44336' }]}
          onPress={restartGame}
        >
          <Ionicons name="refresh-outline" size={20} color="white" />
          <Text style={styles.actionButtonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Helper functions
function generatePuzzle(): SudokuGrid {
  // This is a simplified puzzle generator - in a real app, you'd have more sophisticated generation
  const puzzle: SudokuGrid = Array(9).fill(null).map(() => Array(9).fill(null));
  
  // Add some pre-filled numbers for demonstration
  const samplePuzzle = [
    [5, 3, null, null, 7, null, null, null, null],
    [6, null, null, 1, 9, 5, null, null, null],
    [null, 9, 8, null, null, null, null, 6, null],
    [8, null, null, null, 6, null, null, null, 3],
    [4, null, null, 8, null, 3, null, null, 1],
    [7, null, null, null, 2, null, null, null, 6],
    [null, 6, null, null, null, null, 2, 8, null],
    [null, null, null, 4, 1, 9, null, null, 5],
    [null, null, null, null, 8, null, null, 7, 9],
  ];
  
  return samplePuzzle;
}

function generateSolution(): SudokuGrid {
  // This would be the complete solution to the puzzle
  return [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9],
  ];
}

function checkCompletion(grid: SudokuGrid): boolean {
  // Check if all cells are filled
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (grid[row][col] === null) {
        return false;
      }
    }
  }
  return true;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  gridContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderWidth: 0.5,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  selectedCell: {
    backgroundColor: '#E3F2FD',
  },
  highlightedCell: {
    backgroundColor: '#F5F5F5',
  },
  boxHighlightedCell: {
    backgroundColor: '#FAFAFA',
  },
  fixedCell: {
    backgroundColor: '#E8F5E8',
  },
  topBorder: {
    borderTopWidth: 2,
    borderTopColor: '#333',
  },
  leftBorder: {
    borderLeftWidth: 2,
    borderLeftColor: '#333',
  },
  bottomBorder: {
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  rightBorder: {
    borderRightWidth: 2,
    borderRightColor: '#333',
  },
  cellText: {
    fontSize: 18,
    color: '#666',
  },
  filledCellText: {
    color: '#333',
    fontWeight: 'bold',
  },
  numberPad: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  numberButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  numberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
