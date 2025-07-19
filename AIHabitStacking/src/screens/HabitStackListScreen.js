
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'habitStacking.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const HabitStackListScreen = ({ navigation }) => {
  const [habitStacks, setHabitStacks] = useState([]);

  const loadHabitStacks = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS habit_stacks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, habits TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM habit_stacks',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyStacks = [
                  { name: 'Morning Routine', habits: JSON.stringify(['Make bed', 'Drink water', 'Meditate']), isPremium: 0 },
                  { name: 'Evening Wind-down', habits: JSON.stringify(['Read book', 'Prepare clothes', 'Journal']), isPremium: 0 },
                  { name: 'Productivity Boost', habits: JSON.stringify(['Prioritize tasks', 'Deep work', 'Review progress']), isPremium: 1 },
                ];
                dummyStacks.forEach(stack => {
                  tx.executeSql(
                    'INSERT INTO habit_stacks (name, habits, isPremium) VALUES (?, ?, ?)',
                    [stack.name, stack.habits, stack.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting stack', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM habit_stacks',
                [],
                (_, { rows: allRows }) => {
                  const loadedStacks = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedStacks.push({ ...allRows.item(i), habits: JSON.parse(allRows.item(i).habits) });
                  }
                  setHabitStacks(loadedStacks);
                },
                (tx, error) => console.error('Error fetching stacks', error)
              );
            },
            (tx, error) => console.error('Error checking stacks', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadHabitStacks();
    const unsubscribe = navigation.addListener('focus', () => {
      loadHabitStacks();
    });
    return unsubscribe;
  }, [navigation, loadHabitStacks]);

  const handleStackPress = (stack) => {
    if (stack.isPremium) {
      Alert.alert(
        'Premium Habit Stack',
        'This habit stack is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Habit Stack', `Habits: ${stack.habits.join(', ')}`);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced stacking, habit analytics, etc.'
    );
  };

  const renderHabitStackItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.habitStackItem, item.isPremium ? styles.premiumHabitStackItem : null]}
      onPress={() => handleStackPress(item)}
    >
      <Text style={styles.stackName}>{item.name}</Text>
      <Text style={styles.stackHabits}>{item.habits.join(' • ')}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={habitStacks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHabitStackItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No habit stacks found. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddHabitStack')}>
        <Text style={styles.buttonText}>Add New Habit Stack</Text>
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
  habitStackItem: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  premiumHabitStackItem: {
    backgroundColor: '#ffe0b2',
  },
  stackName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  stackHabits: {
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

export default HabitStackListScreen;
