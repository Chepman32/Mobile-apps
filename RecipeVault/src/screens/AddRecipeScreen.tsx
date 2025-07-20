import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  TextInput,
  SegmentedButtons,
  Chip,
  useTheme,
  IconButton,
  List,
  Divider,
  Portal,
  Dialog,
  HelperText,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { Recipe, Ingredient, Nutrition } from '../types';

const AddRecipeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, actions } = useRecipeVault();
  const [loading, setLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showIngredientDialog, setShowIngredientDialog] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    amount: '',
    unit: '',
  });

  // Instructions
  const [instructions, setInstructions] = useState<string[]>([]);
  const [showInstructionDialog, setShowInstructionDialog] = useState(false);
  const [newInstruction, setNewInstruction] = useState('');

  // Nutrition
  const [nutrition, setNutrition] = useState<Nutrition>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
  });

  const { cuisines, categories } = state;

  const handleAddIngredient = () => {
    if (!newIngredient.name || !newIngredient.amount || !newIngredient.unit) {
      Alert.alert('Error', 'Please fill in all ingredient fields');
      return;
    }

    const ingredient: Ingredient = {
      id: Date.now().toString(),
      name: newIngredient.name,
      amount: parseFloat(newIngredient.amount),
      unit: newIngredient.unit,
    };

    setIngredients([...ingredients, ingredient]);
    setNewIngredient({ name: '', amount: '', unit: '' });
    setShowIngredientDialog(false);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleAddInstruction = () => {
    if (!newInstruction.trim()) {
      Alert.alert('Error', 'Please enter an instruction');
      return;
    }

    setInstructions([...instructions, newInstruction.trim()]);
    setNewInstruction('');
    setShowInstructionDialog(false);
  };

  const handleRemoveInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (tags.includes(newTag.trim())) {
      Alert.alert('Error', 'Tag already exists');
      return;
    }
    setTags([...tags, newTag.trim()]);
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a recipe title');
      return false;
    }
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a recipe description');
      return false;
    }
    if (!prepTime || isNaN(parseInt(prepTime))) {
      Alert.alert('Error', 'Please enter a valid prep time');
      return false;
    }
    if (!servings || isNaN(parseInt(servings))) {
      Alert.alert('Error', 'Please enter a valid number of servings');
      return false;
    }
    if (ingredients.length === 0) {
      Alert.alert('Error', 'Please add at least one ingredient');
      return false;
    }
    if (instructions.length === 0) {
      Alert.alert('Error', 'Please add at least one instruction');
      return false;
    }
    return true;
  };

  const handleSaveRecipe = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const recipe: Recipe = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        prepTime: parseInt(prepTime),
        servings: parseInt(servings),
        difficulty,
        cuisine: selectedCuisine ? cuisines.find(c => c.id === selectedCuisine) || null : null,
        category: selectedCategory ? categories.find(c => c.id === selectedCategory) || null : null,
        ingredients,
        instructions,
        nutrition,
        tags,
        rating: null,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        isFavorite: false,
        timesCooked: 0,
        totalCookingTime: 0,
        averageRating: 0,
        notes: '',
        photos: [],
      };

      await actions.addRecipe(recipe);
      Alert.alert('Success', 'Recipe saved successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface, flex: 1 }}>
          Add New Recipe
        </Text>
        <Button
          mode="contained"
          onPress={handleSaveRecipe}
          loading={loading}
          disabled={loading}
        >
          Save
        </Button>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Basic Information */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Basic Information
            </Text>

            <TextInput
              label="Recipe Title"
              value={title}
              onChangeText={setTitle}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <View style={styles.row}>
              <TextInput
                label="Prep Time (minutes)"
                value={prepTime}
                onChangeText={setPrepTime}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Servings"
                value={servings}
                onChangeText={setServings}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
              />
            </View>

            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Difficulty
            </Text>
            <SegmentedButtons
              value={difficulty}
              onValueChange={setDifficulty}
              buttons={[
                { value: 'Easy', label: 'Easy' },
                { value: 'Medium', label: 'Medium' },
                { value: 'Hard', label: 'Hard' },
              ]}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Cuisine and Category */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Classification
            </Text>

            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Cuisine
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                mode={selectedCuisine === null ? 'flat' : 'outlined'}
                onPress={() => setSelectedCuisine(null)}
                style={{ backgroundColor: selectedCuisine === null ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              >
                None
              </Chip>
              {cuisines.map((cuisine) => (
                <Chip
                  key={cuisine.id}
                  mode={selectedCuisine === cuisine.id ? 'flat' : 'outlined'}
                  onPress={() => setSelectedCuisine(selectedCuisine === cuisine.id ? null : cuisine.id)}
                  style={{ backgroundColor: selectedCuisine === cuisine.id ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
                >
                  {cuisine.name}
                </Chip>
              ))}
            </View>

            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8, marginTop: 16 }}>
              Category
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                mode={selectedCategory === null ? 'flat' : 'outlined'}
                onPress={() => setSelectedCategory(null)}
                style={{ backgroundColor: selectedCategory === null ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
              >
                None
              </Chip>
              {categories.map((category) => (
                <Chip
                  key={category.id}
                  mode={selectedCategory === category.id ? 'flat' : 'outlined'}
                  onPress={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  style={{ backgroundColor: selectedCategory === category.id ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
                >
                  {category.name}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Tags */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Tags
            </Text>

            <View style={styles.tagInput}>
              <TextInput
                label="Add tag"
                value={newTag}
                onChangeText={setNewTag}
                mode="outlined"
                style={styles.input}
                onSubmitEditing={handleAddTag}
              />
              <IconButton
                icon="plus"
                onPress={handleAddTag}
                disabled={!newTag.trim()}
              />
            </View>

            <View style={styles.chipContainer}>
              {tags.map((tag, index) => (
                <Chip
                  key={index}
                  mode="outlined"
                  onClose={() => handleRemoveTag(tag)}
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                >
                  {tag}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Ingredients */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Ingredients ({ingredients.length})
              </Text>
              <Button
                mode="contained-tonal"
                icon="plus"
                onPress={() => setShowIngredientDialog(true)}
              >
                Add
              </Button>
            </View>

            {ingredients.map((ingredient, index) => (
              <List.Item
                key={ingredient.id}
                title={ingredient.name}
                description={`${ingredient.amount} ${ingredient.unit}`}
                left={(props) => (
                  <List.Icon {...props} icon="circle-small" />
                )}
                right={(props) => (
                  <IconButton
                    {...props}
                    icon="delete"
                    size={20}
                    onPress={() => handleRemoveIngredient(ingredient.id)}
                  />
                )}
                style={styles.ingredientItem}
              />
            ))}
          </Card.Content>
        </Card>

        {/* Instructions */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Instructions ({instructions.length})
              </Text>
              <Button
                mode="contained-tonal"
                icon="plus"
                onPress={() => setShowInstructionDialog(true)}
              >
                Add
              </Button>
            </View>

            {instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <View style={styles.stepNumber}>
                  <Text variant="titleSmall" style={{ color: theme.colors.primary }}>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.instructionContent}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {instruction}
                  </Text>
                </View>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => handleRemoveInstruction(index)}
                />
              </View>
            ))}
          </Card.Content>
        </Card>

        {/* Nutrition Information */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Nutrition Information (per serving)
            </Text>

            <View style={styles.nutritionGrid}>
              <TextInput
                label="Calories"
                value={nutrition.calories.toString()}
                onChangeText={(text) => setNutrition({ ...nutrition, calories: parseInt(text) || 0 })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.nutritionInput}
              />
              <TextInput
                label="Protein (g)"
                value={nutrition.protein.toString()}
                onChangeText={(text) => setNutrition({ ...nutrition, protein: parseInt(text) || 0 })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.nutritionInput}
              />
              <TextInput
                label="Carbs (g)"
                value={nutrition.carbs.toString()}
                onChangeText={(text) => setNutrition({ ...nutrition, carbs: parseInt(text) || 0 })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.nutritionInput}
              />
              <TextInput
                label="Fat (g)"
                value={nutrition.fat.toString()}
                onChangeText={(text) => setNutrition({ ...nutrition, fat: parseInt(text) || 0 })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.nutritionInput}
              />
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Ingredient Dialog */}
      <Portal>
        <Dialog
          visible={showIngredientDialog}
          onDismiss={() => setShowIngredientDialog(false)}
        >
          <Dialog.Title>Add Ingredient</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Ingredient Name"
              value={newIngredient.name}
              onChangeText={(text) => setNewIngredient({ ...newIngredient, name: text })}
              mode="outlined"
              style={styles.input}
            />
            <View style={styles.row}>
              <TextInput
                label="Amount"
                value={newIngredient.amount}
                onChangeText={(text) => setNewIngredient({ ...newIngredient, amount: text })}
                mode="outlined"
                keyboardType="numeric"
                style={[styles.input, styles.halfInput]}
              />
              <TextInput
                label="Unit"
                value={newIngredient.unit}
                onChangeText={(text) => setNewIngredient({ ...newIngredient, unit: text })}
                mode="outlined"
                style={[styles.input, styles.halfInput]}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowIngredientDialog(false)}>Cancel</Button>
            <Button onPress={handleAddIngredient}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Instruction Dialog */}
      <Portal>
        <Dialog
          visible={showInstructionDialog}
          onDismiss={() => setShowInstructionDialog(false)}
        >
          <Dialog.Title>Add Instruction</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Instruction"
              value={newInstruction}
              onChangeText={setNewInstruction}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowInstructionDialog(false)}>Cancel</Button>
            <Button onPress={handleAddInstruction}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  input: {
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ingredientItem: {
    paddingVertical: 4,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionContent: {
    flex: 1,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nutritionInput: {
    width: '48%',
  },
});

export default AddRecipeScreen; 