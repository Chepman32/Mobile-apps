
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dummyDecks = [
  {
    id: '1',
    name: 'Basic English',
    cards: [
      { id: 'c1', question: 'Hello', answer: 'Привет', interval: 0, easeFactor: 2.5 },
      { id: 'c2', question: 'Goodbye', answer: 'Пока', interval: 0, easeFactor: 2.5 },
    ],
    isPremium: false,
  },
  {
    id: '2',
    name: 'Advanced Math',
    cards: [
      { id: 'c3', question: 'Derivative of x^2', answer: '2x', interval: 0, easeFactor: 2.5 },
      { id: 'c4', question: 'Integral of 1/x', answer: 'ln|x|', interval: 0, easeFactor: 2.5 },
    ],
    isPremium: true,
  },
];

const DeckListScreen = ({ navigation }) => {
  const [decks, setDecks] = useState([]);

  const loadDecks = useCallback(async () => {
    try {
      const storedDecks = await AsyncStorage.getItem('decks');
      if (storedDecks) {
        setDecks(JSON.parse(storedDecks));
      } else {
        // Initialize with dummy data if no decks exist
        await AsyncStorage.setItem('decks', JSON.stringify(dummyDecks));
        setDecks(dummyDecks);
      }
    } catch (error) {
      console.error('Failed to load decks:', error);
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
    if (deck.isPremium) {
      Alert.alert(
        'Premium Deck',
        'This deck is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase Premium', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('Flashcard', { deckId: deck.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium card sets, advanced studying features, etc.'
    );
  };

  const renderDeckItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.deckItem, item.isPremium ? styles.premiumDeckItem : null]}
      onPress={() => handleDeckPress(item)}
    >
      <Text style={styles.deckName}>{item.name}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={decks}
        keyExtractor={(item) => item.id}
        renderItem={renderDeckItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No decks found.</Text>}
      />
      <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.buttonText}>View Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  premiumDeckItem: {
    backgroundColor: '#ffe0b2',
  },
  deckName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  analyticsButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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

export default DeckListScreen;
