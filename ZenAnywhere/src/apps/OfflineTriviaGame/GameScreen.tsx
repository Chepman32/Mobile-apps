import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QUESTIONS = [
  { q: 'What is the capital of France?', options: ['Paris', 'London', 'Berlin', 'Rome'], answer: 0 },
  { q: 'Who wrote Hamlet?', options: ['Shakespeare', 'Tolstoy', 'Hemingway', 'Dickens'], answer: 0 },
];

export default function GameScreen() {
  const navigation = useNavigation();
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (idx: number) => {
    if (QUESTIONS[current].answer === idx) setScore(score + 1);
    if (current + 1 < QUESTIONS.length) setCurrent(current + 1);
    else setShowResult(true);
  };

  if (showResult) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Game Over!</Text>
        <Text style={styles.score}>Score: {score}/{QUESTIONS.length}</Text>
        <Button title="Back to Home" onPress={() => navigation.navigate('HomeScreen')} />
      </View>
    );
  }

  const q = QUESTIONS[current];
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{q.q}</Text>
      {q.options.map((opt, idx) => (
        <Button key={idx} title={opt} onPress={() => handleAnswer(idx)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  score: { fontSize: 22, marginBottom: 20 },
  question: { fontSize: 22, marginBottom: 30 },
});
