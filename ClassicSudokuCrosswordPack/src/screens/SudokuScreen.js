
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import puzzlesData from '../data/puzzles.json';

const SudokuScreen = ({ route, navigation }) => {
  const { puzzleId } = route.params;
  const sudokuPuzzle = puzzlesData.sudokuPuzzles.find((p) => p.id === puzzleId);

  const [grid, setGrid] = useState([]);
  const [initialGrid, setInitialGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1 });

  useEffect(() => {
    if (sudokuPuzzle) {
      setGrid(JSON.parse(JSON.stringify(sudokuPuzzle.puzzle))); // Deep copy
      setInitialGrid(JSON.parse(JSON.stringify(sudokuPuzzle.puzzle)));
    }
  }, [sudokuPuzzle]);

  const handleCellChange = (text) => {
    if (selectedCell.row === -1 || selectedCell.col === -1) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    const value = parseInt(text) || 0;

    if (value >= 0 && value <= 9) {
      newGrid[selectedCell.row][selectedCell.col] = value;
      setGrid(newGrid);
    }
  };

  const checkSolution = () => {
    if (!sudokuPuzzle) return;

    const isSolved = JSON.stringify(grid) === JSON.stringify(sudokuPuzzle.solution);
    if (isSolved) {
      Alert.alert('Success!', 'Sudoku Solved!');
      navigation.goBack();
    } else {
      Alert.alert('Keep Trying', 'Your solution is not correct yet.');
    }
  };

  const getCellColor = (row, col) => {
    if (initialGrid[row][col] !== 0) {
      return styles.initialCell; // Pre-filled cells
    }
    if (selectedCell.row === row && selectedCell.col === col) {
      return styles.selectedCell;
    }
    return styles.editableCell;
  };

  if (!sudokuPuzzle) {
    return (
      <View style={styles.container}>
        <Text>Sudoku puzzle not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.puzzleTitle}>{sudokuPuzzle.name}</Text>
      <View style={styles.sudokuGrid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[styles.cell, getCellColor(rowIndex, colIndex)]}
                onPress={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                disabled={initialGrid[rowIndex][colIndex] !== 0} // Disable pre-filled cells
              >
                <Text style={styles.cellText}>{cell !== 0 ? cell : ''}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.numberInputContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <TouchableOpacity key={number} style={styles.numberButton} onPress={() => handleCellChange(number.toString())}>
            <Text style={styles.numberButtonText}>{number}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.numberButton} onPress={() => handleCellChange('0')}> 
          <Text style={styles.numberButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.checkButton} onPress={checkSolution}>
        <Text style={styles.buttonText}>Check Solution</Text>
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
  puzzleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sudokuGrid: {
    borderWidth: 2,
    borderColor: '#333',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  initialCell: {
    backgroundColor: '#e0e0e0',
  },
  editableCell: {
    backgroundColor: '#fff',
  },
  selectedCell: {
    backgroundColor: '#add8e6',
  },
  cellText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  numberInputContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    width: '90%',
  },
  numberButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    borderRadius: 5,
    margin: 5,
  },
  numberButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkButton: {
    backgroundColor: '#28a745',
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
});

export default SudokuScreen;
