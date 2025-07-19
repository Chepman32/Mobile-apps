
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Video from 'react-native-video';
import Sound from 'react-native-sound';
import workoutsData from '../data/workouts.json';
import PushNotification from 'react-native-push-notification';

// Enable playback in silence mode
Sound.setCategory('Playback');

const beepSound = new Sound('beep.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('failed to load the sound', error);
    return;
  }
});

const WorkoutScreen = ({ route, navigation }) => {
  const { workoutId } = route.params;
  const workout = workoutsData.workouts.find((w) => w.id === workoutId);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (workout && workout.exercises.length > 0) {
      setTimeLeft(workout.exercises[currentExerciseIndex].duration);
    }
  }, [workout, currentExerciseIndex]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      beepSound.play();
      clearInterval(timerRef.current);
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        setIsRunning(false);
        Alert.alert('Workout Complete!', 'Great job!');
        navigation.goBack();
      }
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, isRunning, currentExerciseIndex, workout, navigation]);

  const startWorkout = () => {
    setIsRunning(true);
    // Schedule a notification for workout completion (example)
    PushNotification.localNotificationSchedule({
      message: "Your workout is complete!", // (required)
      date: new Date(Date.now() + (workout.exercises.reduce((sum, ex) => sum + ex.duration, 0) * 1000)),
    });
  };

  const pauseWorkout = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
  };

  const resetWorkout = () => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setCurrentExerciseIndex(0);
    setTimeLeft(workout.exercises[0].duration);
  };

  if (!workout || workout.exercises.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Workout not found or no exercises!</Text>
      </View>
    );
  }

  const currentExercise = workout.exercises[currentExerciseIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.workoutTitle}>{workout.name}</Text>
      <Text style={styles.exerciseName}>{currentExercise.name}</Text>
      <Text style={styles.timerText}>{timeLeft}s</Text>

      {currentExercise.video && (
        <Video
          ref={videoRef}
          source={{ uri: currentExercise.video }} // e.g., require('../assets/videos/jumping_jacks.mp4')
          style={styles.videoPlayer}
          resizeMode="contain"
          repeat={true}
          paused={!isRunning} // Pause video if workout is paused
          onLoad={() => videoRef.current.seek(0)} // Reset video on load
        />
      )}

      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={styles.button} onPress={startWorkout}>
            <Text style={styles.buttonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={pauseWorkout}>
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
  videoPlayer: {
    width: '100%',
    height: 250,
    backgroundColor: 'black',
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
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default WorkoutScreen;
