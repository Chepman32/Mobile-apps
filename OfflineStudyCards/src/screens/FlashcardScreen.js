
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';

const FlashcardScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const loadCards = useCallback(async () => {
    const storedDecks = await AsyncStorage.getItem('decks');
    const decks = storedDecks ? JSON.parse(storedDecks) : [];
    const currentDeck = decks.find(d => d.id === deckId);
    if (currentDeck) {
      // In a real SRS, cards would be loaded and sorted based on due dates
      // For this simplified version, we just use the deck's cards
      setCards(currentDeck.cards);
    }
  }, [deckId]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const speakText = (text) => {
    Tts.speak(text);
  };

  const handleGrade = async (grade) => {
    const currentCard = cards[currentCardIndex];
    let newInterval = currentCard.interval;
    let newEaseFactor = currentCard.easeFactor;

    // Simplified SM-2 algorithm
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

    const updatedCard = {
      ...currentCard,
      interval: newInterval,
      easeFactor: newEaseFactor,
    };

    // Update card in AsyncStorage (conceptual)
    const storedDecks = await AsyncStorage.getItem('decks');
    let decks = storedDecks ? JSON.parse(storedDecks) : [];
    const deckIndex = decks.findIndex(d => d.id === deckId);
    if (deckIndex !== -1) {
      const cardIndex = decks[deckIndex].cards.findIndex(c => c.id === updatedCard.id);
      if (cardIndex !== -1) {
        decks[deckIndex].cards[cardIndex] = updatedCard;
        await AsyncStorage.setItem('decks', JSON.stringify(decks));
      }
    }

    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      Alert.alert('Deck Complete', 'You have reviewed all cards in this session!');
      navigation.goBack();
    }
  };

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No cards in this deck or deck not found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Swiper
        cards={cards}
        renderCard={(card) => {
          return (
            <View style={styles.card}>
              <Text style={styles.cardText}>{card.question}</Text>
              <TouchableOpacity onPress={() => speakText(card.question)}>
                <Text style={styles.speakButton}>Speak Question</Text>
              </TouchableOpacity>
              <Text style={styles.answerText}>{card.answer}</Text>
              <TouchableOpacity onPress={() => speakText(card.answer)}>
                <Text style={styles.speakButton}>Speak Answer</Text>
              </TouchableOpacity>
            </View>
          );
        }}
        onSwipedLeft={() => handleGrade(0)} // Again
        onSwipedBottom={() => handleGrade(1)} // Hard
        onSwipedTop={() => handleGrade(3)} // Good
        onSwipedRight={() => handleGrade(5)} // Easy
        onSwipedAll={() => {
          Alert.alert('Deck Complete', 'You have reviewed all cards in this session!');
          navigation.goBack();
        }}
        cardIndex={currentCardIndex}
        backgroundColor={'#f0f8ff'}
        stackSize={3}
        stackSeparation={15}
        overlayLabels={{
          bottom: {
            title: 'HARD',
            style: {
              label: {
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                color: 'white',
                borderWidth: 1,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
          },
          left: {
            title: 'AGAIN',
            style: {
              label: {
                backgroundColor: '#dc3545',
                borderColor: '#dc3545',
                color: 'white',
                borderWidth: 1,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: -30,
              },
            },
          },
          right: {
            title: 'EASY',
            style: {
              label: {
                backgroundColor: '#28a745',
                borderColor: '#28a745',
                color: 'white',
                borderWidth: 1,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: 30,
              },
            },
          },
          top: {
            title: 'GOOD',
            style: {
              label: {
                backgroundColor: '#17a2b8',
                borderColor: '#17a2b8',
                color: 'white',
                borderWidth: 1,
              },
              wrapper: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
  },
  card: {
    flex: 0.8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  cardText: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  answerText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  speakButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
});

export default FlashcardScreen;
