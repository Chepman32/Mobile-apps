
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { database } from '../services/database';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImagePicker from 'react-native-image-crop-picker';

const RawRecipeItem = ({ recipe, onPress }) => (
  <TouchableOpacity
    style={[styles.recipeItem, recipe.isPremium && styles.premiumRecipeItem]}
    onPress={() => onPress(recipe)}
  >
    <Text style={styles.recipeName}>{recipe.name}</Text>
    {recipe.isPremium && <Text style={styles.premiumText}>⭐ Premium</Text>}
  </TouchableOpacity>
);

const RecipeItem = withObservables(['recipe'], ({ recipe }) => ({
  recipe,
}))(RawRecipeItem);

const RecipeListScreen = ({ navigation, recipes }) => {
  const [isPremiumUser, setIsPremiumUser] = useState(false);

  useEffect(() => {
    const checkPremiumStatus = async () => {
      const status = await AsyncStorage.getItem('isPremiumUser');
      setIsPremiumUser(status === 'true');
    };
    checkPremiumStatus();
  }, []);

  const addRecipe = async () => {
    Alert.prompt(
      'Add New Recipe',
      'Enter recipe name:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add', onPress: async (name) => {
            if (name) {
              try {
                await database.write(async () => {
                  await database.get('recipes').create(recipe => {
                    recipe.name = name;
                    recipe.ingredients = JSON.stringify([]);
                    recipe.instructions = '';
                    recipe.category = 'Custom';
                    recipe.isPremium = false;
                  });
                });
                Alert.alert('Success', 'Recipe added!');
              } catch (error) {
                console.error('Failed to add recipe:', error);
                Alert.alert('Error', 'Failed to add recipe.');
              }
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
      'In a real app, this would initiate an in-app purchase for premium recipes, meal plans, etc.'
    );
    // For demonstration, simulate unlocking premium
    AsyncStorage.setItem('isPremiumUser', 'true');
    setIsPremiumUser(true);
    Alert.alert('Premium Unlocked!', 'You now have access to all premium features!');
  };

  const handleRecipePress = (recipe) => {
    if (recipe.isPremium && !isPremiumUser) {
      Alert.alert(
        'Premium Recipe',
        'This recipe is a premium feature. Purchase premium to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase Premium', onPress: purchasePremium },
        ]
      );
    } else {
      navigation.navigate('RecipeDetail', { recipeId: recipe.id });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <RecipeItem recipe={item} onPress={handleRecipePress} />}
        ListEmptyComponent={<Text style={styles.emptyText}>No recipes yet. Add one!</Text>}
      />
      <TouchableOpacity style={styles.addButton} onPress={addRecipe}>
        <Text style={styles.buttonText}>Add New Recipe</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.plannerButton} onPress={() => navigation.navigate('MealPlanner')}>
        <Text style={styles.buttonText}>Go to Meal Planner</Text>
      </TouchableOpacity>
      {!isPremiumUser && (
        <TouchableOpacity style={styles.premiumButton} onPress={purchasePremium}>
          <Text style={styles.buttonText}>Go Premium</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const enhance = withObservables([''], () => ({
  recipes: database.collections.get('recipes').query(Q.sortBy('name', Q.asc)).observe(),
}));

export default enhance(RecipeListScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  recipeItem: {
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
  premiumRecipeItem: {
    backgroundColor: '#ffe0b2',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  plannerButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
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
