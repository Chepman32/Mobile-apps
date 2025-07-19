
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import decksData from '../data/decks.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeckListScreen = ({ navigation }) => {
  const [decks, setDecks] = useState([]);

  const loadDecks = useCallback(async () => {
    try {
      const unlockedDecks = await AsyncStorage.getItem('unlockedDecks');
      let updatedDecks = decksData.decks.map(deck => ({
        ...deck,
        locked: deck.locked && !(unlockedDecks && JSON.parse(unlockedDecks).includes(deck.id))
      }));
      setDecks(updatedDecks);
    } catch (error) {
      console.error('Failed to load decks:', error);
      setDecks(decksData.decks); // Fallback to default
    }
  }, []);

  useEffect(() => {
    loadDecks();
    const unsubscribe = navigation.addListener('focus', () => {
      loadDecks();
    });
    return unsubscribe;
  }, [navigation, loadDecks]);

  const handleDeckPress = (deck) => {
    if (deck.locked) {
      Alert.alert(
        'Deck Locked',
        'This deck is part of a premium package. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseDeckPack() },
        ]
      );
    } else {
      navigation.navigate('Flashcard', { deckId: deck.id });
    }
  };

  const purchaseDeckPack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Deck Pack',
      'In a real app, this would initiate an in-app purchase for a deck pack.'
    );
    // For demonstration, let's unlock all locked decks
    const newUnlockedDecks = decksData.decks.filter(d => d.locked).map(d => d.id);
    AsyncStorage.getItem('unlockedDecks').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...newUnlockedDecks])];
      AsyncStorage.setItem('unlockedDecks', JSON.stringify(combinedUnlocked));
      loadDecks(); // Reload decks to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.deckItem, item.locked && styles.lockedDeckItem]}
            onPress={() => handleDeckPress(item)}
          >
            <Text style={styles.deckName}>{item.name}</Text>
            {item.locked && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseDeckPack}>
        <Text style={styles.purchaseButtonText}>Unlock All Premium Decks</Text>
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
  deckItem: {
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
  lockedDeckItem: {
    backgroundColor: '#e0e0e0',
  },
  deckName: {
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
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeckListScreen;
