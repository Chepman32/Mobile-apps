
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import questionsData from '../data/questions.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const QuizScreen = ({ route, navigation }) => {
  const { quizId } = route.params;
  const quiz = questionsData.quizzes.find((q) => q.id === quizId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const handleAnswer = (selectedOption) => {
    if (answered) return; // Prevent multiple answers

    setAnswered(true);
    const currentQuestion = quiz.questions[currentQuestionIndex];

    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
      Alert.alert('Correct!', 'Your answer is correct.');
    } else {
      Alert.alert('Incorrect', `The correct answer was: ${currentQuestion.answer}`);
    }

    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setAnswered(false);
      } else {
        Alert.alert('Quiz Complete', `You scored ${score + (selectedOption === currentQuestion.answer ? 1 : 0)} out of ${quiz.questions.length}!`);
        // Update streak (conceptual)
        AsyncStorage.getItem('quizStreak').then(storedStreak => {
          const currentStreak = storedStreak ? parseInt(storedStreak) : 0;
          AsyncStorage.setItem('quizStreak', JSON.stringify(currentStreak + 1));
        });
        navigation.goBack();
      }
    }, 1500); // Short delay before next question
  };

  if (!quiz || quiz.questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Quiz not found or no questions!</Text>
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, answered && option === currentQuestion.answer && styles.correctOption, answered && option !== currentQuestion.answer && styles.incorrectOption]}
            onPress={() => handleAnswer(option)}
            disabled={answered}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
});

export default QuizScreen;
