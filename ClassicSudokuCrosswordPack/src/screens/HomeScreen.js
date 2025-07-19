
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import puzzlesData from '../data/puzzles.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [unlockedPuzzles, setUnlockedPuzzles] = useState([]);

  const loadUnlockedPuzzles = useCallback(async () => {
    try {
      const storedUnlocked = await AsyncStorage.getItem('unlockedPuzzles');
      if (storedUnlocked) {
        setUnlockedPuzzles(JSON.parse(storedUnlocked));
      }
    } catch (error) {
      console.error('Failed to load unlocked puzzles:', error);
    }
  }, []);

  useEffect(() => {
    loadUnlockedPuzzles();
    const unsubscribe = navigation.addListener('focus', () => {
      loadUnlockedPuzzles();
    });
    return unsubscribe;
  }, [navigation, loadUnlockedPuzzles]);

  const handlePuzzleSelect = (type, puzzleId) => {
    const puzzle = puzzlesData[`${type}Puzzles`].find(p => p.id === puzzleId);
    if (puzzle && puzzle.locked && !unlockedPuzzles.includes(puzzle.id)) {
      Alert.alert(
        'Puzzle Locked',
        'This puzzle is part of a premium pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremiumPack() },
        ]
      );
    } else {
      navigation.navigate(type === 'sudoku' ? 'Sudoku' : 'Crossword', { puzzleId: puzzleId });
    }
  };

  const purchasePremiumPack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Premium Pack',
      'In a real app, this would initiate an in-app purchase for premium puzzle packs.'
    );
    // For demonstration, let's unlock all locked puzzles
    const allLockedPuzzleIds = [
      ...puzzlesData.sudokuPuzzles.filter(p => p.locked).map(p => p.id),
      ...puzzlesData.crosswordPuzzles.filter(p => p.locked).map(p => p.id),
    ];
    AsyncStorage.getItem('unlockedPuzzles').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...allLockedPuzzleIds])];
      AsyncStorage.setItem('unlockedPuzzles', JSON.stringify(combinedUnlocked));
      loadUnlockedPuzzles(); // Reload to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Your Puzzle</Text>

      <Text style={styles.sectionTitle}>Sudoku</Text>
      <FlatList
        data={puzzlesData.sudokuPuzzles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.puzzleItem, item.locked && !unlockedPuzzles.includes(item.id) && styles.lockedPuzzleItem]}
            onPress={() => handlePuzzleSelect('sudoku', item.id)}
          >
            <Text style={styles.puzzleName}>{item.name}</Text>
            {item.locked && !unlockedPuzzles.includes(item.id) && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />

      <Text style={styles.sectionTitle}>Crosswords</Text>
      <FlatList
        data={puzzlesData.crosswordPuzzles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.puzzleItem, item.locked && !unlockedPuzzles.includes(item.id) && styles.lockedPuzzleItem]}
            onPress={() => handlePuzzleSelect('crossword', item.id)}
          >
            <Text style={styles.puzzleName}>{item.name}</Text>
            {item.locked && !unlockedPuzzles.includes(item.id) && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremiumPack}>
        <Text style={styles.buttonText}>Unlock All Premium Puzzles</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  puzzleItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedPuzzleItem: {
    backgroundColor: '#e0e0e0',
  },
  puzzleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lockedText: {
    color: '#888',
    fontSize: 14,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default HomeScreen;
