
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import levelsData from '../data/levels.json';

const PuzzleScreen = ({ route, navigation }) => {
  const { levelId } = route.params;
  const level = levelsData.levels.find((l) => l.id === levelId);

  const [puzzleState, setPuzzleState] = useState([]);

  useEffect(() => {
    if (level) {
      if (level.type === 'sliding_puzzle') {
        setPuzzleState(level.puzzleData.grid);
      } else if (level.type === 'matching_pairs') {
        // Initialize matching pairs game
        const pairs = level.puzzleData.pairs;
        const shuffledPairs = [...pairs, ...pairs].sort(() => Math.random() - 0.5);
        setPuzzleState(shuffledPairs.map((value, index) => ({ id: index, value, flipped: false, matched: false })));
      }
    }
  }, [level]);

  const handleSlidingTilePress = (row, col) => {
    // Simplified sliding puzzle logic
    Alert.alert('Sliding Puzzle', `Tile at ${row},${col} pressed. (Conceptual: implement sliding logic)`);
    // In a real app, you'd implement the logic to move tiles and check for solution
    const isSolved = true; // Simulate solution
    if (isSolved) {
      Alert.alert('Success!', 'Puzzle Solved!');
      navigation.goBack(); // Or navigate to next level
    }
  };

  const handleMatchingPairPress = (id) => {
    // Simplified matching pairs logic
    Alert.alert('Matching Pairs', `Card ${id} pressed. (Conceptual: implement matching logic)`);
    // In a real app, you'd implement the logic to flip cards, check for matches, and update state
    const isSolved = true; // Simulate solution
    if (isSolved) {
      Alert.alert('Success!', 'Puzzle Solved!');
      navigation.goBack(); // Or navigate to next level
    }
  };

  if (!level) {
    return (
      <View style={styles.container}>
        <Text>Level not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.levelTitle}>{level.name}</Text>

      {level.type === 'sliding_puzzle' && (
        <View style={styles.puzzleGrid}>
          {puzzleState.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((tile, colIndex) => (
                <TouchableOpacity
                  key={`${rowIndex}-${colIndex}`}
                  style={[styles.tile, tile === 0 && styles.emptyTile]}
                  onPress={() => handleSlidingTilePress(rowIndex, colIndex)}
                >
                  <Text style={styles.tileText}>{tile !== 0 ? tile : ''}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      )}

      {level.type === 'matching_pairs' && (
        <View style={styles.matchingPairsGrid}>
          {puzzleState.map((card) => (
            <TouchableOpacity
              key={card.id}
              style={[styles.card, card.flipped && styles.flippedCard, card.matched && styles.matchedCard]}
              onPress={() => handleMatchingPairPress(card.id)}
            >
              <Text style={styles.cardText}>{card.flipped || card.matched ? card.value : '?'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.hintButton} onPress={() => Alert.alert('Hint', 'This is a hint! (Conceptual)')}>
        <Text style={styles.buttonText}>Get Hint</Text>
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
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  puzzleGrid: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
  },
  tile: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  emptyTile: {
    backgroundColor: '#eee',
  },
  tileText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  matchingPairsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#007bff',
    margin: 5,
  },
  flippedCard: {
    backgroundColor: '#fff',
  },
  matchedCard: {
    backgroundColor: '#d4edda',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  hintButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PuzzleScreen;
