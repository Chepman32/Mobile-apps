import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { database } from '../services/database';
import { Q } from '@nozbe/watermelondb';
import withObservables from '@nozbe/with-observables';
import ImagePicker from 'react-native-image-crop-picker';
import Share from 'react-native-share';

const RawRecipeDetailScreen = ({ route, recipe }) => {
  const { recipeId } = route.params;

  const addPhoto = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 300,
        cropping: true,
        includeBase64: false,
      });

      await database.write(async () => {
        await recipe.update(r => {
          r.photoUri = image.path;
        });
      });
      Alert.alert('Photo Added', 'Recipe photo updated!');
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to add photo.');
    }
  };

  const shareRecipe = async () => {
    if (!recipe) return;

    const recipeText = `Recipe: ${recipe.name}\n\nIngredients:\n${recipe.ingredients.map(i => `- ${i}`).join('\n')}\n\nInstructions:\n${recipe.instructions}`;

    try {
      await Share.open({
        message: recipeText,
        title: `Check out this recipe: ${recipe.name}`,
      });
    } catch (error) {
      console.error('Error sharing recipe:', error);
      Alert.alert('Share Failed', 'Could not share recipe.');
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
      {recipe.photoUri && (
        <Image source={{ uri: recipe.photoUri }} style={styles.recipeImage} />
      )}
      <TouchableOpacity style={styles.addPhotoButton} onPress={addPhoto}>
        <Text style={styles.addPhotoButtonText}>Add/Change Photo</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {recipe.ingredients.map((ingredient, index) => (
        <Text key={index} style={styles.listItem}>• {ingredient}</Text>
      ))}
      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructionsText}>{recipe.instructions}</Text>

      <TouchableOpacity style={styles.shareButton} onPress={shareRecipe}>
        <Text style={styles.shareButtonText}>Share Recipe</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const enhance = withObservables(['route'], ({ route }) => ({
  recipe: database.collections.get('recipes').find(route.params.recipeId),
}));

export default enhance(RawRecipeDetailScreen);

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
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  addPhotoButton: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addPhotoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  shareButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  shareButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
