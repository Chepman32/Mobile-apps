
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'workoutAnalyzer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const WorkoutListScreen = ({ navigation }) => {
  const [workouts, setWorkouts] = useState([]);

  const loadWorkouts = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM workouts',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyWorkouts = [
                  { name: 'Squats', description: 'Analyze your squat form.', isPremium: 0 },
                  { name: 'Push-ups', description: 'Analyze your push-up form.', isPremium: 0 },
                  { name: 'Deadlifts', description: 'Analyze your deadlift form.', isPremium: 1 },
                ];
                dummyWorkouts.forEach(w => {
                  tx.executeSql(
                    'INSERT INTO workouts (name, description, isPremium) VALUES (?, ?, ?)',
                    [w.name, w.description, w.isPremium],
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
                    loadedWorkouts.push(allRows.item(i));
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
        'This workout analysis is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('WorkoutAnalysis', { workoutId: workout.id, workoutName: workout.name });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced analysis, personal training, etc.'
    );
  };

  const renderWorkoutItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.workoutItem, item.isPremium ? styles.premiumWorkoutItem : null]}
      onPress={() => handleWorkoutPress(item)}
    >
      <Text style={styles.workoutName}>{item.name}</Text>
      <Text style={styles.workoutDescription}>{item.description}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderWorkoutItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No workouts found.</Text>}
      />
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
    padding: 15,
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
  workoutDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
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
