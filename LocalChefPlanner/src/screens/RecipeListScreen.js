
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import recipesData from '../data/recipes.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Placeholder for SQLite database operations
const db = {
  init: () => console.log('DB Initialized'),
  getRecipes: async () => {
    const storedRecipes = await AsyncStorage.getItem('userRecipes');
    return storedRecipes ? JSON.parse(storedRecipes) : [];
  },
  saveRecipe: async (recipe) => {
    const recipes = await db.getRecipes();
    const updatedRecipes = [...recipes, recipe];
    await AsyncStorage.setItem('userRecipes', JSON.stringify(updatedRecipes));
  },
};

const RecipeListScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);

  const loadRecipes = useCallback(async () => {
    try {
      const userRecipes = await db.getRecipes();
      const allRecipes = [...recipesData.recipes, ...userRecipes];

      const unlockedPacks = await AsyncStorage.getItem('unlockedRecipePacks');
      let updatedRecipes = allRecipes.map(recipe => ({
        ...recipe,
        locked: recipe.locked && !(unlockedPacks && JSON.parse(unlockedPacks).includes(recipe.category))
      }));
      setRecipes(updatedRecipes);
    } catch (error) {
      console.error('Failed to load recipes:', error);
      setRecipes(recipesData.recipes); // Fallback to default
    }
  }, []);

  useEffect(() => {
    db.init(); // Initialize DB (placeholder)
    loadRecipes();
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecipes();
    });
    return unsubscribe;
  }, [navigation, loadRecipes]);

  const handleRecipePress = (recipe) => {
    if (recipe.locked) {
      Alert.alert(
        'Recipe Locked',
        'This recipe is part of a premium pack. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchaseRecipePack() },
        ]
      );
    } else {
      navigation.navigate('RecipeDetail', { recipeId: recipe.id });
    }
  };

  const purchaseRecipePack = () => {
    // Placeholder for In-App Purchase logic
    Alert.alert(
      'Purchase Recipe Pack',
      'In a real app, this would initiate an in-app purchase for a recipe pack.'
    );
    // For demonstration, let's unlock all locked categories
    const newUnlockedCategories = recipesData.recipes.filter(r => r.locked).map(r => r.category);
    AsyncStorage.getItem('unlockedRecipePacks').then(stored => {
      const currentUnlocked = stored ? JSON.parse(stored) : [];
      const combinedUnlocked = [...new Set([...currentUnlocked, ...newUnlockedCategories])];
      AsyncStorage.setItem('unlockedRecipePacks', JSON.stringify(combinedUnlocked));
      loadRecipes(); // Reload recipes to reflect changes
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.recipeItem, item.locked && styles.lockedRecipeItem]}
            onPress={() => handleRecipePress(item)}
          >
            <Text style={styles.recipeName}>{item.name}</Text>
            {item.locked && <Text style={styles.lockedText}>🔒 Locked</Text>}
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.menuPlannerButton} onPress={() => navigation.navigate('MenuPlanner')}>
        <Text style={styles.menuPlannerButtonText}>Go to Menu Planner</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.purchaseButton} onPress={purchaseRecipePack}>
        <Text style={styles.purchaseButtonText}>Unlock Premium Packs</Text>
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
  recipeItem: {
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
  lockedRecipeItem: {
    backgroundColor: '#e0e0e0',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  lockedText: {
    color: '#888',
    fontSize: 14,
  },
  menuPlannerButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  menuPlannerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  purchaseButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  purchaseButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeListScreen;
