
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'nutritionAnalyzer.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const NutritionTrackerScreen = ({ navigation }) => {
  const [meals, setMeals] = useState([]);

  const loadMeals = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS meals (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, calories REAL, protein REAL, carbs REAL, fat REAL, timestamp TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM meals',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyMeals = [
                  { name: 'Breakfast', calories: 300, protein: 15, carbs: 40, fat: 10, timestamp: '2024-07-01 08:00', isPremium: 0 },
                  { name: 'Lunch', calories: 500, protein: 30, carbs: 60, fat: 20, timestamp: '2024-07-01 13:00', isPremium: 0 },
                  { name: 'Dinner', calories: 700, protein: 40, carbs: 80, fat: 25, timestamp: '2024-07-01 19:00', isPremium: 1 },
                ];
                dummyMeals.forEach(meal => {
                  tx.executeSql(
                    'INSERT INTO meals (name, calories, protein, carbs, fat, timestamp, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [meal.name, meal.calories, meal.protein, meal.carbs, meal.fat, meal.timestamp, meal.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting meal', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM meals ORDER BY timestamp DESC',
                [],
                (_, { rows: allRows }) => {
                  const loadedMeals = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedMeals.push(allRows.item(i));
                  }
                  setMeals(loadedMeals);
                },
                (tx, error) => console.error('Error fetching meals', error)
              );
            },
            (tx, error) => console.error('Error checking meals', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadMeals();
    const unsubscribe = navigation.addListener('focus', () => {
      loadMeals();
    });
    return unsubscribe;
  }, [navigation, loadMeals]);

  const addMeal = () => {
    Alert.prompt(
      'Add Meal',
      'Enter meal name, calories, protein, carbs, fat (comma-separated):',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: (input) => {
            const [name, calories, protein, carbs, fat] = input.split(',').map(s => s.trim());
            if (name && calories && protein && carbs && fat) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO meals (name, calories, protein, carbs, fat, timestamp, isPremium) VALUES (?, ?, ?, ?, ?, ?, ?)',
                  [name, parseFloat(calories), parseFloat(protein), parseFloat(carbs), parseFloat(fat), new Date().toLocaleString(), 0],
                  () => {
                    Alert.alert('Success', 'Meal added!');
                    loadMeals();
                  },
                  (tx, error) => console.error('Error adding meal', error)
                );
              });
            }
          }
        },
      ],
      'plain-text'
    );
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium nutrition data, meal planning, etc.'
    );
  };

  const renderMealItem = ({ item }) => (
    <View style={[styles.mealItem, item.isPremium ? styles.premiumMealItem : null]}>
      <Text style={styles.mealName}>{item.name}</Text>
      <Text style={styles.mealDetails}>Calories: {item.calories} | Protein: {item.protein}g | Carbs: {item.carbs}g | Fat: {item.fat}g</Text>
      <Text style={styles.mealTimestamp}>{item.timestamp}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={meals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMealItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No meals logged yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addMeal}>
        <Text style={styles.buttonText}>Add Meal</Text>
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
  mealItem: {
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
  premiumMealItem: {
    backgroundColor: '#ffe0b2',
  },
  mealName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  mealTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  premiumText: {
    fontSize: 14,
    color: '#ff8c00',
    fontWeight: 'bold',
    marginTop: 5,
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

export default NutritionTrackerScreen;
