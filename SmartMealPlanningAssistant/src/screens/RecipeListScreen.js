import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  { name: 'mealPlanner.db', location: 'default' },
  () => {},
  (error) => console.error('Error opening database', error)
);

const RecipeListScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);

  const loadRecipes = useCallback(() => {
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS recipes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, ingredients TEXT, instructions TEXT, isPremium INTEGER)',
        [],
        () => {
          // Insert dummy data if table is empty
          tx.executeSql(
            'SELECT * FROM recipes',
            [],
            (_, { rows }) => {
              if (rows.length === 0) {
                const dummyRecipes = [
                  { name: 'Spaghetti', ingredients: 'Pasta, Sauce', instructions: 'Cook pasta, add sauce.', isPremium: 0 },
                  { name: 'Chicken Stir-fry', ingredients: 'Chicken, Veggies', instructions: 'Stir-fry everything.', isPremium: 0 },
                  { name: 'Gourmet Salmon', ingredients: 'Salmon, Asparagus', instructions: 'Bake salmon.', isPremium: 1 },
                ];
                dummyRecipes.forEach(r => {
                  tx.executeSql(
                    'INSERT INTO recipes (name, ingredients, instructions, isPremium) VALUES (?, ?, ?, ?)',
                    [r.name, r.ingredients, r.instructions, r.isPremium],
                    () => {},
                    (tx, error) => console.error('Error inserting recipe', error)
                  );
                });
              }
              tx.executeSql(
                'SELECT * FROM recipes ORDER BY name ASC',
                [],
                (_, { rows: allRows }) => {
                  const loadedRecipes = [];
                  for (let i = 0; i < allRows.length; i++) {
                    loadedRecipes.push(allRows.item(i));
                  }
                  setRecipes(loadedRecipes);
                },
                (tx, error) => console.error('Error fetching recipes', error)
              );
            },
            (tx, error) => console.error('Error checking recipes', error)
          );
        },
        (tx, error) => console.error('Error creating table', error)
      );
    });
  }, []);

  useEffect(() => {
    loadRecipes();
    const unsubscribe = navigation.addListener('focus', () => {
      loadRecipes();
    });
    return unsubscribe;
  }, [navigation, loadRecipes]);

  const handleRecipePress = (recipe) => {
    if (recipe.isPremium) {
      Alert.alert(
        'Premium Recipe',
        'This recipe is a premium feature. Purchase to unlock!',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Purchase', onPress: () => purchasePremium() },
        ]
      );
    } else {
      Alert.alert('Recipe Details', `Ingredients: ${recipe.ingredients}\nInstructions: ${recipe.instructions}`);
    }
  };

  const purchasePremium = () => {
    Alert.alert(
      'Purchase Premium Features',
      'In a real app, this would initiate an in-app purchase for premium recipes, advanced planning, etc.'
    );
  };

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.recipeItem, item.isPremium ? styles.premiumRecipeItem : null]}
      onPress={() => handleRecipePress(item)}
    >
      <Text style={styles.recipeName}>{item.name}</Text>
      {item.isPremium ? <Text style={styles.premiumText}>⭐ Premium</Text> : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRecipeItem}
        ListEmptyComponent={<Text style={styles.emptyText}>No recipes found.</Text>}
      />
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
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: 'gray',
  },
});

export default RecipeListScreen;
