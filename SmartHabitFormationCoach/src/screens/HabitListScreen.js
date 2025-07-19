
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'habitCoach.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const HabitListScreen = ({ navigation }) => {
  const [habits, setHabits] = useState([]);

  const loadHabits = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, frequency TEXT, completedDates TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM habits',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyHabits = [
                  { name: 'Drink Water', frequency: 'daily', completedDates: JSON.stringify([]), isPremium: 0 },
                  { name: 'Read Book', frequency: 'daily', completedDates: JSON.stringify([]), isPremium: 0 },
                  { name: 'Meditate', frequency: 'daily', completedDates: JSON.stringify([]), isPremium: 1 },
                ];
                dummyHabits.forEach(habit => {
                  tx.executeSql(
                    'INSERT INTO habits (name, frequency, completedDates, isPremium) VALUES (?, ?, ?, ?)',
                    [habit.name, habit.frequency, habit.completedDates, habit.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting habit', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM habits',
                [],
                (_, { rows: allRows }) => {
                  const loadedHabits = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedHabits.push({ ...allRows.item(i), completedDates: JSON.parse(allRows.item(i).completedDates) });
                  }
                  setHabits(loadedHabits);
                },
                (tx, error) => console.error('Error fetching habits', error)
              );
            },
            (tx, error) => console.error('Error checking habits', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadHabits();
    const unsubscribe = navigation.addListener('focus', () => {
      loadHabits();
    });
    return unsubscribe;
  }, [navigation, loadHabits]);

  const toggleHabitCompletion = (habitId, isCompleted) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM habits WHERE id = ?',
        [habitId],
        (_, { rows }) => {
          const habit = rows.item(0);
          let updatedCompletedDates = JSON.parse(habit.completedDates);
          const today = new Date().toISOString().split('T')[0];

          if (updatedCompletedDates.includes(today)) {
            updatedCompletedDates = updatedCompletedDates.filter(date => date !== today);
          } else {
            updatedCompletedDates.push(today);
          }

          tx.executeSql(
            'UPDATE habits SET completedDates = ? WHERE id = ?',
            [JSON.stringify(updatedCompletedDates), habitId],
            () => {
              Alert.alert('Habit Updated', `Habit marked as ${updatedCompletedDates.includes(today) ? 'complete' : 'incomplete'}.`);
              loadHabits(); // Reload habits
            },
            (tx, error) => console.error('Error updating habit', error)
          );
        },
        (tx, error) => console.error('Error fetching habit for update', error)
      );
    });
  };

  const addHabit = () => {
    navigation.navigate('AddStudyItem'); // Reusing AddStudyItemScreen for simplicity
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium AI coaching, detailed analytics, etc.'
    );
  };

  const renderHabitItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.habitItem, item.completedDates.includes(new Date().toISOString().split('T')[0]) && styles.completedHabitItem]}
      onPress={() => toggleHabitCompletion(item.id, item.completedDates.includes(new Date().toISOString().split('T')[0]))}
    >
      <Text style={styles.habitName}>{item.name}</Text>
      <Text style={styles.habitFrequency}>{item.frequency}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHabitItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No habits found. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addHabit}>
        <Text style={styles.buttonText}>Add New Habit</Text>
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
  habitItem: {
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
  completedHabitItem: {
    backgroundColor: '#d4edda',
  },
  habitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  habitFrequency: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#007bff',
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
  premiumButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default HabitListScreen;
