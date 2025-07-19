
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import recipesData from '../data/recipes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MenuPlannerScreen = ({ navigation }) => {
  const [plannedMeals, setPlannedMeals] = useState([]);
  const [availableRecipes, setAvailableRecipes] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const storedPlannedMeals = await AsyncStorage.getItem('plannedMeals');
      if (storedPlannedMeals) {
        setPlannedMeals(JSON.parse(storedPlannedMeals));
      }

      const unlockedPacks = await AsyncStorage.getItem('unlockedRecipePacks');
      const allRecipes = recipesData.recipes.filter(recipe => 
        !recipe.locked || (unlockedPacks && JSON.parse(unlockedPacks).includes(recipe.category))
      );
      setAvailableRecipes(allRecipes);

    } catch (error) {
      console.error('Failed to load data:', error);
    }
  }, []);

  useEffect(() => {
    loadData();
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation, loadData]);

  const addMealToPlanner = async (recipe) => {
    const newPlannedMeals = [...plannedMeals, { ...recipe, plannedDate: new Date().toDateString() }];
    setPlannedMeals(newPlannedMeals);
    await AsyncStorage.setItem('plannedMeals', JSON.stringify(newPlannedMeals));
    Alert.alert('Meal Added', `${recipe.name} added to your planner.`);
  };

  const clearPlanner = async () => {
    Alert.alert(
      'Clear Planner',
      'Are you sure you want to clear all planned meals?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', onPress: async () => {
            setPlannedMeals([]);
            await AsyncStorage.removeItem('plannedMeals');
          }
        },
      ],
      { cancelable: true }
    );
  };

  const renderPlannedMeal = ({ item }) => (
    <View style={styles.plannedMealItem}>
      <Text style={styles.plannedMealName}>{item.name}</Text>
      <Text style={styles.plannedMealDate}>{item.plannedDate}</Text>
    </View>
  );

  const renderAvailableRecipe = ({ item }) => (
    <TouchableOpacity style={styles.availableRecipeItem} onPress={() => addMealToPlanner(item)}>
      <Text style={styles.availableRecipeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Planned Meals</Text>
      <FlatList
        data={plannedMeals}
        keyExtractor={(item, index) => item.id + index} // Use index for unique key if same recipe added multiple times
        renderItem={renderPlannedMeal}
        ListEmptyComponent={<Text style={styles.emptyText}>No meals planned yet.</Text>}
      />
      <TouchableOpacity style={styles.clearButton} onPress={clearPlanner}>
        <Text style={styles.clearButtonText}>Clear Planner</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Available Recipes</Text>
      <FlatList
        data={availableRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderAvailableRecipe}
        ListEmptyComponent={<Text style={styles.emptyText}>No recipes available.</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  plannedMealItem: {
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
  plannedMealName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  plannedMealDate: {
    fontSize: 14,
    color: '#666',
  },
  availableRecipeItem: {
    padding: 15,
    backgroundColor: '#e6e6fa',
    marginBottom: 10,
    borderRadius: 8,
  },
  availableRecipeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  clearButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MenuPlannerScreen;
