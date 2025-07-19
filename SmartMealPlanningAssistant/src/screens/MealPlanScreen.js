
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'mealPlanner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const MealPlanScreen = ({ navigation }) => {
  const [mealPlan, setMealPlan] = useState([]);

  const loadMealPlan = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS meal_plan (id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, mealType TEXT, recipeName TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM meal_plan',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyPlan = [
                  { date: '2024-07-01', mealType: 'Breakfast', recipeName: 'Oatmeal', isPremium: 0 },
                  { date: '2024-07-01', mealType: 'Lunch', recipeName: 'Salad', isPremium: 0 },
                  { date: '2024-07-02', mealType: 'Dinner', recipeName: 'Premium Steak', isPremium: 1 },
                ];
                dummyPlan.forEach(item => {
                  tx.executeSql(
                    'INSERT INTO meal_plan (date, mealType, recipeName, isPremium) VALUES (?, ?, ?, ?)',
                    [item.date, item.mealType, item.recipeName, item.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting meal plan item', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM meal_plan ORDER BY date ASC',
                [],
                (_, { rows: allRows }) => {
                  const loadedPlan = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedPlan.push(allRows.item(i));
                  }
                  setMealPlan(loadedPlan);
                },
                (tx, error) => console.error('Error fetching meal plan', error)
              );
            },
            (tx, error) => console.error('Error checking meal plan', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadMealPlan();
    const unsubscribe = navigation.addListener('focus', () => {
      loadMealPlan();
    });
    return unsubscribe;
  }, [navigation, loadMealPlan]);

  const addMealToPlan = () => {
    Alert.prompt(
      'Add Meal to Plan',
      'Enter date (YYYY-MM-DD), meal type (Breakfast, Lunch, Dinner), and recipe name (comma-separated):',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: (input) => {
            const [date, mealType, recipeName] = input.split(',').map(s => s.trim());
            if (date && mealType && recipeName) {
              db.transaction((tx) => {
                tx.executeSql(
                  'INSERT INTO meal_plan (date, mealType, recipeName, isPremium) VALUES (?, ?, ?, ?)',
                  [date, mealType, recipeName, 0],
                  () => {
                    Alert.alert('Success', 'Meal added to plan!');
                    loadMealPlan();
                  },
                  (tx, error) => console.error('Error adding meal to plan', error)
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
      'In a real app, this would initiate an in-app purchase for premium recipes, advanced planning, etc.'
    );
  };

  const renderMealPlanItem = ({ item }) => (
    <View style={[styles.mealPlanItem, item.isPremium ? styles.premiumMealPlanItem : null]}>
      <Text style={styles.mealPlanDate}>{item.date}</Text>
      <Text style={styles.mealPlanDetails}>{item.mealType}: {item.recipeName}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={mealPlan}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMealPlanItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No meals planned yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addMealToPlan}>
        <Text style={styles.buttonText}>Add Meal to Plan</Text>
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
  mealPlanItem: {
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
  premiumMealPlanItem: {
    backgroundColor: '#ffe0b2',
  },
  mealPlanDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  mealPlanDetails: {
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

export default MealPlanScreen;
