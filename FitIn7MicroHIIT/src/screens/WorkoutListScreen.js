
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import workoutsData from '../data/workouts.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WorkoutListScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);

  const loadWorkouts = useCallback(async () => {
    try {
      const unlockedWorkouts = await AsyncStorage.getItem('unlockedWorkouts');
      let updatedWorkouts = workoutsData.workouts.map(workout => ({
        ...workout,
        locked: workout.locked && !(unlockedWorkouts && JSON.parse(unlockedWorkouts).includes(workout.id))
      }));
      setWorkouts(updatedWorkouts);
    } catch (error) {
      console.error('Failed to load workouts:', error);
      setWorkouts(workoutsData.workouts); // Fallback to default
    }
  }, []);

  useEffect(() => {
    loadWorkouts();
    const unsubscribe = navigation.addListener('focus', () => {
      loadWorkouts();
    });
    return unsubscribe;
  }, [navigation, loadWorkouts]);

  const handleWorkoutPress = (workout) => {
    if (workout.locked) {
      Alert.alert(
        'Workout Locked',
        'This workout is part of a premium pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseWorkoutPack() },
        ]
      );
    } else {
      navigation.navigate('Workout', { workoutId: workout.id });
    }
  };

  const purchaseWorkoutPack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Workout Pack',
      'In a real app, this would initiate an in-app purchase for a workout pack.'
    );
    // For demonstration, let's unlock all locked workouts
    const newUnlockedWorkouts = workoutsData.workouts.filter(w => w.locked).map(w => w.id);
    AsyncStorage.getItem('unlockedWorkouts').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...newUnlockedWorkouts])];
      AsyncStorage.setItem('unlockedWorkouts', JSON.stringify(combinedUnlocked));
      loadWorkouts(); // Reload workouts to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.workoutItem, item.locked && styles.lockedWorkoutItem]}
            onPress={() => handleWorkoutPress(item)}
          >
            <Text style={styles.workoutName}>{item.name}</Text>
            {item.locked && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseWorkoutPack}>
        <Text style={styles.purchaseButtonText}>Unlock All Premium Workouts</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  workoutItem: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lockedWorkoutItem: {
    backgroundColor: '#e0e0e0',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lockedText: {
    color: '#888',
    fontSize: 14,
  },
  purchaseButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WorkoutListScreen;
