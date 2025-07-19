
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { database } from '../services/database';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';

const RawMealPlannerScreen = ({ navigation, recipes, mealPlans }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const addMealToPlanner = async (recipeId) => {
    try {
      await database.write(async () => {
        await database.get('meal_plans').create(mealPlan => {
          mealPlan.date = selectedDate;
          mealPlan.recipeId = recipeId;
        });
      });
      Alert.alert('Meal Added', 'Recipe added to your meal plan!');
    } catch (error) {
      console.error('Failed to add meal to planner:', error);
      Alert.alert('Error', 'Failed to add meal to planner.');
    }
  };

  const renderPlannedMeal = ({ item }) => {
    const recipe = recipes.find(r => r.id === item.recipeId);
    return (
      <View style={styles.plannedMealItem}>
        <Text style={styles.plannedMealName}>{recipe ? recipe.name : 'Unknown Recipe'}</Text>
        <Text style={styles.plannedMealDate}>{item.date}</Text>
      </View>
    );
  };

  const renderAvailableRecipe = ({ item }) => (
    <TouchableOpacity style={styles.availableRecipeItem} onPress={() => addMealToPlanner(item.id)}>
      <Text style={styles.availableRecipeName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for advanced meal planning features.'
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Planned Meals for {selectedDate}</Text>
      <FlatList
        data={mealPlans.filter(mp => mp.date === selectedDate)}
        keyExtractor={(item) => item.id}
        renderItem={renderPlannedMeal}
        ListEmptyComponent={<Text style={styles.emptyText}>No meals planned for this date.</Text>}
      />

      <Text style={styles.sectionTitle}>Available Recipes</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={renderAvailableRecipe}
        ListEmptyComponent={<Text style={styles.emptyText}>No recipes available.</Text>}
      />

      <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
        <Text style={styles.buttonText}>Unlock Premium Meal Plans</Text>
      </TouchableOpacity>
    </View>
  );
};

const enhance = withObservables([''], () => ({
  recipes: database.collections.get('recipes').query().observe(),
  mealPlans: database.collections.get('meal_plans').query().observe(),
}));

export default enhance(RawMealPlannerScreen);

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
});
