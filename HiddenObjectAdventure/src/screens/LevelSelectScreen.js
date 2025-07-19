
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import levelsData from '../data/levels.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LevelSelectScreen = ({ navigation }) => {
  const [levels, setLevels] = useState([]);

  const loadLevels = useCallback(async () => {
    try {
      const unlockedLevels = await AsyncStorage.getItem('unlockedLevels');
      let updatedLevels = levelsData.levels.map(level => ({
        ...level,
        locked: level.locked && !(unlockedLevels && JSON.parse(unlockedLevels).includes(level.id))
      }));
      setLevels(updatedLevels);
    } catch (error) {
      console.error('Failed to load levels:', error);
      setLevels(levelsData.levels); // Fallback to default
    }
  }, []);

  useEffect(() => {
    loadLevels();
    const unsubscribe = navigation.addListener('focus', () => {
      loadLevels();
    });
    return unsubscribe;
  }, [navigation, loadLevels]);

  const handleLevelPress = (level) => {
    if (level.locked) {
      Alert.alert(
        'Level Locked',
        'This level is part of a premium pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseLevelPack() },
        ]
      );
    } else {
      navigation.navigate('HiddenObject', { levelId: level.id });
    }
  };

  const purchaseLevelPack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Level Pack',
      'In a real app, this would initiate an in-app purchase for a level pack.'
    );
    // For demonstration, let's unlock all locked levels
    const newUnlockedLevels = levelsData.levels.filter(l => l.locked).map(l => l.id);
    AsyncStorage.getItem('unlockedLevels').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...newUnlockedLevels])];
      AsyncStorage.setItem('unlockedLevels', JSON.stringify(combinedUnlocked));
      loadLevels(); // Reload levels to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={levels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.levelItem, item.locked && styles.lockedLevelItem]}
            onPress={() => handleLevelPress(item)}
          >
            <Text style={styles.levelName}>{item.name}</Text>
            {item.locked && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseLevelPack}>
        <Text style={styles.buttonText}>Unlock All Premium Levels</Text>
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
  levelItem: {
    padding: 20,
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
  lockedLevelItem: {
    backgroundColor: '#e0e0e0',
  },
  levelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lockedText: {
    color: '#888',
    fontSize: 14,
  },
  purchaseButton: {
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

export default LevelSelectScreen;
