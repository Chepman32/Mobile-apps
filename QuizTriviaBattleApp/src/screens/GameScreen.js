
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const questionsData = [
  { id: 'q1', question: 'What is the capital of France?', options: ['Berlin', 'Madrid', 'Paris', 'Rome'], answer: 'Paris' },
  { id: 'q2', question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: '4' },
  { id: 'q3', question: 'What is the chemical symbol for water?', options: ['O2', 'H2O', 'CO2', 'NaCl'], answer: 'H2O' },
];

const GameScreen = ({ route, navigation }) => {
  const { gameId } = route.params;
  const [game, setGame] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const gameRef = doc(db, 'games', gameId);
    const unsubscribe = onSnapshot(gameRef, (docSnap) => {
      if (docSnap.exists()) {
        setGame({ id: docSnap.id, ...docSnap.data() });
      } else {
        Alert.alert('Game Ended', 'The game has ended or was deleted.');
        navigation.goBack();
      }
    });
    return unsubscribe;
  }, [gameId]);

  useEffect(() => {
    if (game && game.status === 'in-progress' && game.currentQuestionIndex !== undefined) {
      setCurrentQuestionIndex(game.currentQuestionIndex);
      setSelectedOption(null);
      setAnswered(false);
    }
  }, [game]);

  const startGame = async () => {
    if (!game) return;
    try {
      const gameRef = doc(db, 'games', game.id);
      await updateDoc(gameRef, {
        status: 'in-progress',
        currentQuestionIndex: 0,
        playerScores: game.players.map(p => ({ uid: p.uid, score: 0 })),
      });
    } catch (error) {
      console.error('Error starting game:', error);
      Alert.alert('Error', 'Failed to start game.');
    }
  };

  const handleAnswer = async (option) => {
    if (answered || !game || game.status !== 'in-progress') return;

    setSelectedOption(option);
    setAnswered(true);

    const currentQuestion = questionsData[currentQuestionIndex];
    const isCorrect = option === currentQuestion.answer;

    // Update player score
    const updatedPlayerScores = game.playerScores.map(playerScore => {
      if (playerScore.uid === auth.currentUser.uid) {
        return { ...playerScore, score: playerScore.score + (isCorrect ? 1 : 0) };
      }
      return playerScore;
    });

    try {
      const gameRef = doc(db, 'games', game.id);
      await updateDoc(gameRef, {
        playerScores: updatedPlayerScores,
      });
    } catch (error) {
      console.error('Error updating score:', error);
    }

    setTimeout(async () => {
      if (currentQuestionIndex < questionsData.length - 1) {
        const gameRef = doc(db, 'games', game.id);
        await updateDoc(gameRef, {
          currentQuestionIndex: currentQuestionIndex + 1,
        });
      } else {
        // Game over
        const gameRef = doc(db, 'games', game.id);
        await updateDoc(gameRef, {
          status: 'completed',
        });
        Alert.alert('Game Over', 'Quiz completed!');
        navigation.goBack();
      }
    }, 1500); // Short delay before next question
  };

  if (!game) {
    return (
      <View style={styles.container}>
        <Text>Loading game...</Text>
      </View>
    );
  }

  if (game.status === 'waiting') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Waiting for players...</Text>
        <Text style={styles.subtitle}>Players: {game.players.map(p => p.name).join(', ')}</Text>
        {game.hostId === auth.currentUser.uid && (
          <TouchableOpacity style={styles.button} onPress={startGame}>
            <Text style={styles.buttonText}>Start Game</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  if (game.status === 'completed') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Completed!</Text>
        <Text style={styles.subtitle}>Final Scores:</Text>
        {game.playerScores.map((playerScore, index) => (
          <Text key={index} style={styles.scoreText}>{playerScore.name}: {playerScore.score}</Text>
        ))}
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Back to Lobby</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentQuestion = questionsData[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              answered && option === currentQuestion.answer && styles.correctOption,
              answered && option === selectedOption && option !== currentQuestion.answer && styles.incorrectOption,
            ]}
            onPress={() => handleAnswer(option)}
            disabled={answered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.scoreText}>Your Score: {game.playerScores.find(p => p.uid === auth.currentUser.uid)?.score || 0}</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  correctOption: {
    backgroundColor: '#28a745',
  },
  incorrectOption: {
    backgroundColor: '#dc3545',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GameScreen;
