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
  Chip,
  useTheme,
  IconButton,
  List,
  Portal,
  Dialog,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { MealPlan, Meal, Recipe } from '../types';

const AddMealPlanScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { state, actions } = useRecipeVault();
  const [loading, setLoading] = useState(false);

  const { selectedDate } = route.params as { selectedDate?: string };

  // Form state
  const [planName, setPlanName] = useState('');
  const [selectedDate, setSelectedDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const { recipes } = state;

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleAddMeal = () => {
    if (!selectedRecipe) {
      Alert.alert('Error', 'Please select a recipe');
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      mealType: selectedMealType,
      recipe: selectedRecipe,
      notes: '',
    };

    setMeals([...meals, meal]);
    setSelectedRecipe(null);
    setShowAddMealDialog(false);
  };

  const handleRemoveMeal = (mealId: string) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  const handleSaveMealPlan = async () => {
    if (!planName.trim()) {
      Alert.alert('Error', 'Please enter a plan name');
      return;
    }

    if (meals.length === 0) {
      Alert.alert('Error', 'Please add at least one meal');
      return;
    }

    setLoading(true);

    try {
      const mealPlan: MealPlan = {
        id: Date.now().toString(),
        name: planName.trim(),
        date: selectedDate,
        meals,
        notes: '',
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      };

      await actions.addMealPlan(mealPlan);
      Alert.alert('Success', 'Meal plan created successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to create meal plan');
    } finally {
      setLoading(false);
    }
  };

  const renderMealItem = (meal: Meal) => (
    <Card key={meal.id} style={[styles.mealCard, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <View style={styles.mealHeader}>
          <View style={styles.mealInfo}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {meal.mealType}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
              {meal.recipe?.title}
            </Text>
            {meal.recipe && (
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                {meal.recipe.prepTime} min • {meal.recipe.difficulty}
              </Text>
            )}
          </View>
          <View style={styles.mealActions}>
            <IconButton
              icon="pencil"
              size={20}
              onPress={() => {
                setSelectedMealType(meal.mealType);
                setSelectedRecipe(meal.recipe);
                setShowAddMealDialog(true);
              }}
            />
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleRemoveMeal(meal.id)}
            />
          </View>
        </View>
      </Card.Content>
    </Card>
  );

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
          Create Meal Plan
        </Text>
        <Button
          mode="contained"
          onPress={handleSaveMealPlan}
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
              Plan Details
            </Text>

            <TextInput
              label="Plan Name"
              value={planName}
              onChangeText={setPlanName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g., Weekly Meal Plan"
            />

            <TextInput
              label="Date"
              value={selectedDate}
              onChangeText={setSelectedDate}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />
          </Card.Content>
        </Card>

        {/* Meals */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Meals ({meals.length})
              </Text>
              <Button
                mode="contained-tonal"
                icon="plus"
                onPress={() => setShowAddMealDialog(true)}
              >
                Add Meal
              </Button>
            </View>

            {meals.length > 0 ? (
              meals.map(renderMealItem)
            ) : (
              <View style={styles.emptyState}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  No meals added yet
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Add your first meal to get started
                </Text>
              </View>
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Add Meal Dialog */}
      <Portal>
        <Dialog
          visible={showAddMealDialog}
          onDismiss={() => setShowAddMealDialog(false)}
        >
          <Dialog.Title>Add Meal</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8 }}>
              Meal Type
            </Text>
            <SegmentedButtons
              value={selectedMealType}
              onValueChange={setSelectedMealType}
              buttons={mealTypes.map(type => ({ value: type, label: type }))}
              style={styles.segmentedButtons}
            />

            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 8, marginTop: 16 }}>
              Select Recipe
            </Text>
            <ScrollView style={styles.recipeList}>
              {recipes.map((recipe) => (
                <List.Item
                  key={recipe.id}
                  title={recipe.title}
                  description={`${recipe.prepTime} min • ${recipe.difficulty}`}
                  left={(props) => (
                    <List.Icon {...props} icon="food" />
                  )}
                  onPress={() => setSelectedRecipe(recipe)}
                  style={[
                    styles.recipeItem,
                    selectedRecipe?.id === recipe.id && {
                      backgroundColor: theme.colors.primaryContainer,
                    }
                  ]}
                />
              ))}
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddMealDialog(false)}>Cancel</Button>
            <Button onPress={handleAddMeal}>Add</Button>
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealCard: {
    marginBottom: 8,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mealInfo: {
    flex: 1,
  },
  mealActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  recipeList: {
    maxHeight: 200,
  },
  recipeItem: {
    paddingVertical: 4,
  },
});

export default AddMealPlanScreen; 