
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import wordsData from '../data/words.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GRID_SIZE = 10;

const WordSearchScreen = ({ navigation }) => {
  const [wordPack, setWordPack] = useState(wordsData.wordPacks[0]);
  const [grid, setGrid] = useState([]);
  const [foundWords, setFoundWords] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);

  const generateGrid = useCallback(() => {
    const newGrid = Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(''));
    const wordsToPlace = [...wordPack.words];

    // Simple word placement (horizontal only for now)
    wordsToPlace.forEach(word => {
      let placed = false;
      while (!placed) {
        const row = Math.floor(Math.random() * GRID_SIZE);
        const col = Math.floor(Math.random() * (GRID_SIZE - word.length + 1));

        let canPlace = true;
        for (let i = 0; i < word.length; i++) {
          if (newGrid[row][col + i] !== '' && newGrid[row][col + i] !== word[i]) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            newGrid[row][col + i] = word[i];
          }
          placed = true;
        }
      }
    });

    // Fill remaining empty cells with random letters
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26)); // Random uppercase letter
        }
      }
    }
    setGrid(newGrid);
    setFoundWords([]);
    setSelectedCells([]);
  }, [wordPack]);

  useEffect(() => {
    generateGrid();
  }, [generateGrid]);

  const handleCellPress = (row, col) => {
    const newSelectedCells = [...selectedCells, { row, col }];
    setSelectedCells(newSelectedCells);

    if (newSelectedCells.length > 1) {
      const selectedWord = newSelectedCells.map(cell => grid[cell.row][cell.col]).join('');
      if (wordPack.words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
        Alert.alert('Word Found!', `You found: ${selectedWord}`);
        setFoundWords([...foundWords, selectedWord]);
        setSelectedCells([]);
      } else if (wordPack.words.includes(selectedWord) && foundWords.includes(selectedWord)) {
        Alert.alert('Already Found', `You already found: ${selectedWord}`);
        setSelectedCells([]);
      } else if (newSelectedCells.length > Math.max(...wordPack.words.map(w => w.length))) {
        // If selection is too long and not a word, reset
        setSelectedCells([]);
      }
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for extra puzzles, hints, or ad removal.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Word Search</Text>
      <Text style={styles.wordPackName}>Word Pack: {wordPack.name}</Text>

      <View style={styles.gridContainer}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((letter, colIndex) => (
              <TouchableOpacity
                key={`${rowIndex}-${colIndex}`}
                style={[
                  styles.cell,
                  selectedCells.some(c => c.row === rowIndex && c.col === colIndex) && styles.selectedCell,
                  foundWords.some(word => {
                    // This is a simplified check for highlighting found words
                    // A more robust solution would track exact cell positions of found words
                    const wordLength = word.length;
                    const startCol = colIndex - wordLength + 1;
                    for (let i = 0; i < wordLength; i++) {
                      if (rowIndex === rowIndex && colIndex === startCol + i && wordPack.words.includes(word)) {
                        return true;
                      }
                    }
                    return false;
                  }) && styles.foundCell,
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text style={styles.cellText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Text style={styles.foundWordsTitle}>Found Words:</Text>
      <View style={styles.foundWordsContainer}>
        {foundWords.length > 0 ? (
          foundWords.map((word, index) => (
            <Text key={index} style={styles.foundWordText}>{word}</Text>
          ))
        ) : (
          <Text style={styles.emptyText}>No words found yet.</Text>
        )}
      </View>

      <TouchableOpacity style={styles.newGameButton} onPress={generateGrid}>
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  wordPackName: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666',
  },
  gridContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  selectedCell: {
    backgroundColor: '#add8e6',
  },
  foundCell: {
    backgroundColor: '#90ee90',
  },
  cellText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  foundWordsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foundWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  foundWordText: {
    fontSize: 16,
    margin: 5,
    padding: 5,
    backgroundColor: '#d4edda',
    borderRadius: 5,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
  newGameButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

export default WordSearchScreen;
