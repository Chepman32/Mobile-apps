
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import BackgroundTimer from 'react-native-background-timer';

const db = SQLite.openDatabase(
  { name: 'examSimulator.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const ExamScreen = ({ route, navigation }) => {
  const { examId } = route.params;
  const [exam, setExam] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes for exam
  const timerRef = useRef(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM exams WHERE id = ?',
        [examId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedExam = { ...rows.item(0), questions: JSON.parse(rows.item(0).questions) };
            setExam(loadedExam);
          }
        },
        (tx, error) => console.error('Error fetching exam', error)
      );
    });
  }, [examId]);

  useEffect(() => {
    if (exam && timeLeft > 0) {
      timerRef.current = BackgroundTimer.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      BackgroundTimer.clearInterval(timerRef.current);
      Alert.alert('Time's Up!', 'Your exam time has ended.');
      endExam();
    }
    return () => BackgroundTimer.clearInterval(timerRef.current);
  }, [timeLeft, exam]);

  const handleOptionPress = (option) => {
    setSelectedOption(option);
  };

  const submitAnswer = () => {
    const currentQuestion = exam.questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      endExam();
    }
  };

  const endExam = () => {
    BackgroundTimer.clearInterval(timerRef.current);
    navigation.replace('Results', { score: score, totalQuestions: exam.questions.length });
  };

  if (!exam || exam.questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading exam...</Text>
      </View>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}</Text>
      <Text style={styles.questionText}>{currentQuestion.question}</Text>
      <View style={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
            onPress={() => handleOptionPress(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={submitAnswer}>
        <Text style={styles.buttonText}>Submit Answer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#dc3545',
  },
  questionText: {
    fontSize: 20,
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
  selectedOptionButton: {
    backgroundColor: '#28a745',
  },
  optionText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ExamScreen;
