
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import puzzlesData from '../data/puzzles.json';

const CrosswordScreen = ({ route, navigation }) => {
  const { puzzleId } = route.params;
  const crosswordPuzzle = puzzlesData.crosswordPuzzles.find((p) => p.id === puzzleId);

  const [grid, setGrid] = useState([]);
  const [solutionGrid, setSolutionGrid] = useState([]);
  const [selectedCell, setSelectedCell] = useState({ row: -1, col: -1 });

  useEffect(() => {
    if (crosswordPuzzle) {
      // Initialize grid with empty strings for user input
      const initialGrid = crosswordPuzzle.grid.map(row => row.map(cell => cell === '' ? '' : ''));
      setGrid(initialGrid);
      setSolutionGrid(crosswordPuzzle.grid); // Store solution separately
    }
  }, [crosswordPuzzle]);

  const handleCellChange = (text) => {
    if (selectedCell.row === -1 || selectedCell.col === -1) return;

    const newGrid = JSON.parse(JSON.stringify(grid));
    newGrid[selectedCell.row][selectedCell.col] = text.toUpperCase();
    setGrid(newGrid);
  };

  const checkSolution = () => {
    if (!crosswordPuzzle) return;

    let correct = true;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (solutionGrid[r][c] !== '' && grid[r][c] !== solutionGrid[r][c]) {
          correct = false;
          break;
        }
      }
      if (!correct) break;
    }

    if (correct) {
      Alert.alert('Success!', 'Crossword Solved!');
      navigation.goBack();
    } else {
      Alert.alert('Keep Trying', 'Your solution is not correct yet.');
    }
  };

  const getCellColor = (row, col) => {
    if (crosswordPuzzle.grid[row][col] === '') {
      return styles.emptyCell; // Blacked out cells
    }
    if (selectedCell.row === row && selectedCell.col === col) {
      return styles.selectedCell;
    }
    return styles.editableCell;
  };

  if (!crosswordPuzzle) {
    return (
      <View style={styles.container}>
        <Text>Crossword puzzle not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.puzzleTitle}>{crosswordPuzzle.name}</Text>
      <View style={styles.crosswordGrid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[styles.cell, getCellColor(rowIndex, colIndex)]}
                onPress={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                disabled={crosswordPuzzle.grid[rowIndex][colIndex] === ''} // Disable blacked out cells
              >
                <TextInput
                  style={styles.cellInput}
                  maxLength={1}
                  onChangeText={handleCellChange}
                  value={grid[rowIndex][colIndex]}
                  editable={crosswordPuzzle.grid[rowIndex][colIndex] !== ''}
                />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Across Clues:</Text>
      {crosswordPuzzle.clues.across.map((clue, index) => (
        <Text key={index} style={styles.clueText}>• {clue}</Text>
      ))}

      <Text style={styles.sectionTitle}>Down Clues:</Text>
      {crosswordPuzzle.clues.down.map((clue, index) => (
        <Text key={index} style={styles.clueText}>• {clue}</Text>
      ))}

      <TouchableOpacity style={styles.checkButton} onPress={checkSolution}>
        <Text style={styles.buttonText}>Check Solution</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  puzzleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  crosswordGrid: {
    borderWidth: 2,
    borderColor: '#333',
    alignSelf: 'center',
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
  emptyCell: {
    backgroundColor: '#333',
  },
  editableCell: {
    backgroundColor: '#fff',
  },
  selectedCell: {
    backgroundColor: '#add8e6',
  },
  cellInput: {
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  clueText: {
    fontSize: 16,
    marginBottom: 5,
  },
  checkButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CrosswordScreen;
