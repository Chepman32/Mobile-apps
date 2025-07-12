import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { workout } from '../data/workout';
const WorkoutScreen = () => {
  const [step, setStep] = useState(0);
  const done = step >= workout.length;

  const next = () => setStep(s => s + 1);
  const restart = () => setStep(0);

  if (done) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Workout complete!</Text>
        <TouchableOpacity style={styles.button} onPress={restart}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const current = workout[step];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{current.name}</Text>
      <Text style={styles.text}>{current.reps}</Text>
      <TouchableOpacity style={styles.button} onPress={next}>
        <Text style={styles.buttonText}>Complete</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 10 },
  text: { fontSize: 18, marginBottom: 20 },
  button: { backgroundColor: '#4a6fa5', padding: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 18 },
});

export default WorkoutScreen;
