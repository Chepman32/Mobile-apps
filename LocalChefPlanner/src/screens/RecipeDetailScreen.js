import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import recipesData from '../data/recipes.json';
import RNFS from 'react-native-fs';

const RecipeDetailScreen = ({ route }) => {
  const { recipeId } = route.params;
  const recipe = recipesData.recipes.find((r) => r.id === recipeId);

  const exportRecipe = async () => {
    if (!recipe) return;

    const fileName = `${recipe.name.replace(/\s/g, '_')}.txt`;
    const path = `${RNFS.DocumentDirectoryPath}/${fileName}`;
    const content = `Recipe: ${recipe.name}\n\nIngredients:\n${recipe.ingredients.map(i => `- ${i}`).join('\n')}\n\nInstructions:\n${recipe.instructions}`;

    try {
      await RNFS.writeFile(path, content, 'utf8');
      Alert.alert('Export Successful', `Recipe saved to ${path}`);
    } catch (error) {
      console.error('Failed to export recipe:', error);
      Alert.alert('Export Failed', 'Could not save recipe to file.');
    }
  };

  if (!recipe) {
    return (
      <View style={styles.container}>
        <Text>Recipe not found!</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.recipeName}>{recipe.name}</Text>
      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.listItem}>• {ingredient}</Text>
      ))}
      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructionsText}>{recipe.instructions}</Text>

      <TouchableOpacity style={styles.exportButton} onPress={exportRecipe}>
        <Text style={styles.exportButtonText}>Export Recipe to File</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f8ff',
  },
  recipeName: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    color: '#333',
  },
  listItem: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  instructionsText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  exportButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  exportButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RecipeDetailScreen;
