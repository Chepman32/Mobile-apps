
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { getRealm } from '../services/realm';

const FlashcardScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [cards, setCards] = useState([]);
  const [realm, setRealm] = useState(null);

  useEffect(() => {
    const openRealm = async () => {
      try {
        const newRealm = await getRealm();
        setRealm(newRealm);

        const deckObjectId = new Realm.BSON.ObjectId(deckId);
        const flashcards = newRealm.objects('Flashcard').filtered('deckId == $0', deckObjectId);
        setCards(Array.from(flashcards));

        flashcards.addListener(() => {
          setCards(Array.from(flashcards));
        });
      } catch (error) {
        console.error('Error opening Realm:', error);
      }
    };

    openRealm();

    return () => {
      if (realm) {
        realm.close();
      }
    };
  }, [deckId]);

  const handleGrade = (grade) => {
    if (!realm || cards.length === 0) return;

    const currentCard = cards[0]; // Always take the first card for simplicity
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

    const newDueDate = new Date();
    newDueDate.setDate(newDueDate.getDate() + newInterval);

    realm.write(() => {
      currentCard.interval = newInterval;
      currentCard.easeFactor = newEaseFactor;
      currentCard.dueDate = newDueDate.toISOString().split('T')[0];
    });

    // Move to next card (conceptual: in a real SRS, cards would be re-ordered based on due date)
    setCards(prevCards => prevCards.slice(1));

    if (cards.length === 1) {
      Alert.alert('Deck Complete', 'You have reviewed all cards in this session!');
      navigation.goBack();
    }
  };

  if (cards.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No cards in this deck. Add some!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateFlashcard', { deckId: deckId })}>
          <Text style={styles.buttonText}>Add Flashcard</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentCard = cards[0];

  return (
    <View style={styles.container}>
      <Swiper
        cards={[currentCard]} // Only show one card at a time for simplicity
        renderCard={(card) => {
          return (
            <View style={styles.card}>
              <Text style={styles.cardText}>{card.question}</Text>
              <Text style={styles.answerText}>{card.answer}</Text>
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
        cardIndex={0}
        backgroundColor={'#f0f8ff'}
        stackSize={1}
        stackSeparation={0}
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
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FlashcardScreen;
