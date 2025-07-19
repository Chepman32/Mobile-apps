
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'fitnessTracker.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const GoalListScreen = ({ navigation }) => {
  const [goals, setGoals] = useState([]);

  const loadGoals = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, target REAL, current REAL, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM goals',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyGoals = [
                  { name: 'Run 5K', target: 5, current: 2, isPremium: 0 },
                  { name: 'Lift 100kg', target: 100, current: 50, isPremium: 0 },
                  { name: 'Marathon Training', target: 42.195, current: 10, isPremium: 1 },
                ];
                dummyGoals.forEach(g => {
                  tx.executeSql(
                    'INSERT INTO goals (name, target, current, isPremium) VALUES (?, ?, ?, ?)',
                    [g.name, g.target, g.current, g.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting goal', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM goals',
                [],
                (_, { rows: allRows }) => {
                  const loadedGoals = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedGoals.push(allRows.item(i));
                  }
                  setGoals(loadedGoals);
                },
                (tx, error) => console.error('Error fetching goals', error)
              );
            },
            (tx, error) => console.error('Error checking goals', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadGoals();
    const unsubscribe = navigation.addListener('focus', () => {
      loadGoals();
    });
    return unsubscribe;
  }, [navigation, loadGoals]);

  const addGoal = () => {
    navigation.navigate('AddGoal');
  };

  const handleGoalPress = (goal) => {
    if (goal.isPremium) {
      Alert.alert(
        'Premium Goal',
        'This goal is part of a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      navigation.navigate('Progress', { goalId: goal.id, goalName: goal.name });
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced goal setting, fitness analytics, etc.'
    );
  };

  const renderGoalItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.goalItem, item.isPremium ? styles.premiumGoalItem : null]}
      onPress={() => handleGoalPress(item)}
    >
      <Text style={styles.goalName}>{item.name}</Text>
      <Text style={styles.goalProgress}>Progress: {item.current} / {item.target}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGoalItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No goals found. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addGoal}>
        <Text style={styles.buttonText}>Add New Goal</Text>
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
  goalItem: {
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
  premiumGoalItem: {
    backgroundColor: '#ffe0b2',
  },
  goalName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  goalProgress: {
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

export default GoalListScreen;
