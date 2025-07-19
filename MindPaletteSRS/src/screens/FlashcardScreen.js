
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import decksData from '../data/decks.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FlashcardScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const deck = decksData.decks.find((d) => d.id === deckId);

  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const loadCards = useCallback(async () => {
    if (deck) {
      // In a real SRS, cards would be loaded and sorted based on due dates
      // For this simplified version, we just use the deck's cards
      setCards(deck.cards);
      setCurrentCardIndex(0);
      setShowAnswer(false);
    }
  }, [deck]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const handleFlipCard = () => {
    setShowAnswer(!showAnswer);
  };

  const handleGrade = async (grade) => {
    // Simplified SM-2 algorithm logic
    const currentCard = cards[currentCardIndex];
    let newInterval = currentCard.interval;
    let newEaseFactor = currentCard.easeFactor;

    if (grade >= 3) { // Correct answer
      if (newInterval === 0) {
        newInterval = 1;
      } else if (newInterval === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(newInterval * newEaseFactor);
      }
      newEaseFactor = newEaseFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02));
    } else { // Incorrect answer
      newInterval = 0;
      newEaseFactor = Math.max(1.3, newEaseFactor - 0.2);
    }

    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + newInterval);

    const updatedCard = {
      ...currentCard,
      interval: newInterval,
      easeFactor: newEaseFactor,
      dueDate: newDueDate.toISOString().split('T')[0], // YYYY-MM-DD
    };

    // In a real app, you'd update the specific card in AsyncStorage for the deck
    // For this demo, we'll just move to the next card
    Alert.alert('Card Graded', `Interval: ${newInterval} days`);

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      Alert.alert('Deck Complete', 'You have reviewed all cards in this session!');
      navigation.goBack();
    }
  };

  if (!deck || cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No cards in this deck or deck not found!</Text>
      </View>
    );
  }

  const currentCard = cards[currentCardIndex];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card} onPress={handleFlipCard}>
        <Text style={styles.cardText}>
          {showAnswer ? currentCard.answer : currentCard.question}
        </Text>
      </TouchableOpacity>

      {showAnswer && (
        <View style={styles.gradeButtons}>
          <TouchableOpacity style={[styles.gradeButton, styles.gradeAgain]} onPress={() => handleGrade(0)}>
            <Text style={styles.gradeButtonText}>Again (0)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gradeButton, styles.gradeHard]} onPress={() => handleGrade(1)}>
            <Text style={styles.gradeButtonText}>Hard (1)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gradeButton, styles.gradeGood]} onPress={() => handleGrade(3)}>
            <Text style={styles.gradeButtonText}>Good (3)</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.gradeButton, styles.gradeEasy]} onPress={() => handleGrade(5)}>
            <Text style={styles.gradeButtonText}>Easy (5)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    height: '50%',
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardText: {
    fontSize: 24,
    textAlign: 'center',
  },
  gradeButtons: {
    flexDirection: 'row',
    marginTop: 30,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  gradeButton: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    margin: 5,
  },
  gradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  gradeAgain: {
    backgroundColor: '#dc3545',
  },
  gradeHard: {
    backgroundColor: '#ffc107',
  },
  gradeGood: {
    backgroundColor: '#17a2b8',
  },
  gradeEasy: {
    backgroundColor: '#28a745',
  },
});

export default FlashcardScreen;
