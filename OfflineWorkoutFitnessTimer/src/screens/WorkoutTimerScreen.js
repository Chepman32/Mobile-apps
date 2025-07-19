
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import Sound from 'react-native-sound';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'workouts.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

// Enable playback in silence mode
Sound.setCategory('Playback');

const beepSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const WorkoutTimerScreen = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM workouts WHERE id = ?',
        [workoutId],
        (_, { rows }) => {
          if (rows.length > 0) {
            const loadedWorkout = { ...rows.item(0), exercises: JSON.parse(rows.item(0).exercises) };
            setWorkout(loadedWorkout);
            setTimeLeft(loadedWorkout.exercises[0].duration);
          }
        },
        (tx, error) => console.error('Error fetching workout', error)
      );
    });
  }, [workoutId]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerIntervalRef.current = BackgroundTimer.setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      beepSound.play();
      BackgroundTimer.clearInterval(timerIntervalRef.current);
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        setIsRunning(false);
        Alert.alert('Workout Complete!', 'Great job!');
        navigation.goBack();
      }
    }
    return () => BackgroundTimer.clearInterval(timerIntervalRef.current);
  }, [timeLeft, isRunning, currentExerciseIndex, workout, navigation]);

  const startWorkout = () => {
    setIsRunning(true);
  };

  const pauseWorkout = () => {
    setIsRunning(false);
    BackgroundTimer.clearInterval(timerIntervalRef.current);
  };

  const resetWorkout = () => {
    setIsRunning(false);
    BackgroundTimer.clearInterval(timerIntervalRef.current);
    setCurrentExerciseIndex(0);
    if (workout) {
      setTimeLeft(workout.exercises[0].duration);
    }
  };

  if (!workout || workout.exercises.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading workout...</Text>
      </View>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.workoutTitle}>{workout.name}</Text>
      <Text style={styles.exerciseName}>{currentExercise.name}</Text>
      <Text style={styles.timerText}>{timeLeft}s</Text>

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startWorkout}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={pauseWorkout}>
            <Text style={styles.buttonText}>Pause</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={resetWorkout}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
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
  workoutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 20,
    marginBottom: 20,
  },
  timerText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 20,
  },
  controls: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  stopButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WorkoutTimerScreen;
