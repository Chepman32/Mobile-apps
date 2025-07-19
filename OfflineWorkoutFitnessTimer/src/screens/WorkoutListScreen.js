
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'workouts.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const WorkoutListScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);

  const loadWorkouts = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, exercises TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM workouts',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyWorkouts = [
                  { name: 'Beginner HIIT', exercises: JSON.stringify([
                    { name: 'Jumping Jacks', duration: 30 },
                    { name: 'Rest', duration: 10 },
                    { name: 'High Knees', duration: 30 },
                    { name: 'Rest', duration: 10 },
                    { name: 'Plank', duration: 30 }
                  ]), isPremium: 0 },
                  { name: 'Advanced Cardio', exercises: JSON.stringify([
                    { name: 'Burpees', duration: 45 },
                    { name: 'Rest', duration: 15 },
                    { name: 'Mountain Climbers', duration: 45 }
                  ]), isPremium: 1 },
                ];
                dummyWorkouts.forEach(workout => {
                  tx.executeSql(
                    'INSERT INTO workouts (name, exercises, isPremium) VALUES (?, ?, ?)',
                    [workout.name, workout.exercises, workout.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting workout', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM workouts',
                [],
                (_, { rows: allRows }) => {
                  const loadedWorkouts = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedWorkouts.push({ ...allRows.item(i), exercises: JSON.parse(allRows.item(i).exercises) });
                  }
                  setWorkouts(loadedWorkouts);
                },
                (tx, error) => console.error('Error fetching workouts', error)
              );
            },
            (tx, error) => console.error('Error checking workouts', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadWorkouts();
    const unsubscribe = navigation.addListener('focus', () => {
      loadWorkouts();
    });
    return unsubscribe;
  }, [navigation, loadWorkouts]);

  const handleWorkoutPress = (workout) => {
    if (workout.isPremium) {
      Alert.alert(
        'Premium Workout',
        'This workout is a premium feature. Purchase a subscription to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Subscribe', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('WorkoutTimer', { workoutId: workout.id });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium workouts, personalized plans, etc.'
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.workoutItem, item.isPremium && styles.premiumWorkoutItem]}
            onPress={() => handleWorkoutPress(item)}
          >
            <Text style={styles.workoutName}>{item.name}</Text>
            {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No workouts found.</Text>}
      />
      <TouchableOpacity style={styles.analyticsButton} onPress={() => navigation.navigate('Analytics')}>
        <Text style={styles.buttonText}>View Analytics</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Go Premium</Text>
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
  premiumWorkoutItem: {
    backgroundColor: '#ffe0b2',
  },
  workoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  analyticsButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default WorkoutListScreen;
