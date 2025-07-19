
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import Sound from 'react-native-sound';

// Enable playback in silence mode
Sound.setCategory('Playback');

// Dummy data for quiz questions
const quizData = [
  {
    id: '1',
    question: 'Hello',
    answer: 'Hola',
    audio: 'hola.mp3',
    interval: 0, // Spaced Repetition: days until next review
    easeFactor: 2.5, // Spaced Repetition: factor for increasing interval
  },
  {
    id: '2',
    question: 'Goodbye',
    answer: 'Adiós',
    audio: 'adios.mp3',
    interval: 0,
    easeFactor: 2.5,
  },
  {
    id: '3',
    question: 'Thank you',
    answer: 'Gracias',
    audio: 'gracias.mp3',
    interval: 0,
    easeFactor: 2.5,
  },
];

const QuizScreen = ({ navigation }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);

  const loadQuestions = useCallback(async () => {
    // In a real app, you'd load questions from SQLite based on spaced repetition algorithm
    // For now, we'll use dummy data and simulate SRS
    setQuestions(quizData);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const speakText = (text) => {
    Tts.speak(text);
  };

  const playAudio = (audioFile) => {
    const sound = new Sound(audioFile, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('failed to load the sound', error);
        Alert.alert('Error', 'Could not load audio.');
        return;
      }
      sound.play((success) => {
        if (success) {
          console.log('successfully finished playing');
        } else {
          console.log('playback failed due to audio decoding errors');
        }
        sound.release();
      });
    });
  };

  const handleAnswer = async (grade) => {
    const currentQuestion = questions[currentQuestionIndex];
    let newInterval = currentQuestion.interval;
    let newEaseFactor = currentQuestion.easeFactor;

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

    const updatedQuestion = {
      ...currentQuestion,
      interval: newInterval,
      easeFactor: newEaseFactor,
    };

    // In a real app, you'd update this in SQLite
    // For now, just move to next question

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
    } else {
      Alert.alert('Quiz Complete', 'You have finished this quiz session!');
      // Update streak
      const storedStreak = await AsyncStorage.getItem('quizStreak');
      const currentStreak = storedStreak ? parseInt(storedStreak) : 0;
      await AsyncStorage.setItem('quizStreak', JSON.stringify(currentStreak + 1));
      navigation.goBack();
    }
  };

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading questions...</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>

      <TouchableOpacity style={styles.flipButton} onPress={() => setShowAnswer(!showAnswer)}>
        <Text style={styles.flipButtonText}>{showAnswer ? 'Hide Answer' : 'Show Answer'}</Text>
      </TouchableOpacity>

      {showAnswer && (
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>{currentQuestion.answer}</Text>
          <TouchableOpacity style={styles.audioButton} onPress={() => playAudio(currentQuestion.audio)}>
            <Text style={styles.audioButtonText}>Play Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.audioButton} onPress={() => speakText(currentQuestion.answer)}>
            <Text style={styles.audioButtonText}>Speak Text</Text>
          </TouchableOpacity>

          <View style={styles.gradeButtons}>
            <TouchableOpacity style={[styles.gradeButton, styles.gradeAgain]} onPress={() => handleAnswer(0)}>
              <Text style={styles.gradeButtonText}>Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gradeButton, styles.gradeHard]} onPress={() => handleAnswer(1)}>
              <Text style={styles.gradeButtonText}>Hard</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gradeButton, styles.gradeGood]} onPress={() => handleAnswer(3)}>
              <Text style={styles.gradeButtonText}>Good</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.gradeButton, styles.gradeEasy]} onPress={() => handleAnswer(5)}>
              <Text style={styles.gradeButtonText}>Easy</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  flipButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
  },
  flipButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  answerContainer: {
    alignItems: 'center',
  },
  answerText: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  audioButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  audioButtonText: {
    color: 'white',
    fontSize: 16,
  },
  gradeButtons: {
    flexDirection: 'row',
    marginTop: 20,
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

export default QuizScreen;
