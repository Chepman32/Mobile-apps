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

const AddToMealPlanScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { state, actions } = useRecipeVault();
  const [loading, setLoading] = useState(false);

  const { recipeId } = route.params as { recipeId: string };

  // Form state
  const [selectedMealType, setSelectedMealType] = useState('Lunch');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const { recipes, mealPlans } = state;
  const recipe = recipes.find(r => r.id === recipeId);

  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

  const handleAddToMealPlan = async () => {
    if (!recipe) {
      Alert.alert('Error', 'Recipe not found');
      return;
    }

    setLoading(true);

    try {
      // Check if meal plan exists for the selected date
      let existingMealPlan = mealPlans.find(
        plan => new Date(plan.date).toISOString().split('T')[0] === selectedDate
      );

      const meal: Meal = {
        id: Date.now().toString(),
        mealType: selectedMealType,
        recipe: recipe,
        notes: notes.trim(),
      };

      if (existingMealPlan) {
        // Update existing meal plan
        const updatedMealPlan: MealPlan = {
          ...existingMealPlan,
          meals: [...existingMealPlan.meals, meal],
          dateModified: new Date().toISOString(),
        };
        await actions.updateMealPlan(updatedMealPlan);
      } else {
        // Create new meal plan
        const newMealPlan: MealPlan = {
          id: Date.now().toString(),
          name: `Meal Plan - ${new Date(selectedDate).toLocaleDateString()}`,
          date: selectedDate,
          meals: [meal],
          notes: '',
          dateCreated: new Date().toISOString(),
          dateModified: new Date().toISOString(),
        };
        await actions.addMealPlan(newMealPlan);
      }

      Alert.alert('Success', 'Recipe added to meal plan!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add recipe to meal plan');
    } finally {
      setLoading(false);
    }
  };

  if (!recipe) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
          Recipe not found
        </Text>
      </View>
    );
  }

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
          Add to Meal Plan
        </Text>
        <Button
          mode="contained"
          onPress={handleAddToMealPlan}
          loading={loading}
          disabled={loading}
        >
          Add
        </Button>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Recipe Info */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Recipe Information
            </Text>
            <View style={styles.recipeInfo}>
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                {recipe.title}
              </Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {recipe.description}
              </Text>
              <View style={styles.recipeStats}>
                <Chip mode="outlined" compact style={{ backgroundColor: theme.colors.surfaceVariant }}>
                  {recipe.prepTime} min
                </Chip>
                <Chip mode="outlined" compact style={{ backgroundColor: theme.colors.surfaceVariant }}>
                  {recipe.difficulty}
                </Chip>
                <Chip mode="outlined" compact style={{ backgroundColor: theme.colors.surfaceVariant }}>
                  {recipe.servings} servings
                </Chip>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Meal Type Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Meal Type
            </Text>
            <SegmentedButtons
              value={selectedMealType}
              onValueChange={setSelectedMealType}
              buttons={mealTypes.map(type => ({ value: type, label: type }))}
              style={styles.segmentedButtons}
            />
          </Card.Content>
        </Card>

        {/* Date Selection */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Date
            </Text>
            <TextInput
              label="Date"
              value={selectedDate}
              onChangeText={setSelectedDate}
              mode="outlined"
              style={styles.input}
              placeholder="YYYY-MM-DD"
            />
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginTop: 8 }}>
              Format: YYYY-MM-DD (e.g., 2024-01-15)
            </Text>
          </Card.Content>
        </Card>

        {/* Notes */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Notes (Optional)
            </Text>
            <TextInput
              label="Add notes about this meal"
              value={notes}
              onChangeText={setNotes}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Existing Meal Plans */}
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Existing Meal Plans
            </Text>
            {mealPlans.length > 0 ? (
              mealPlans.slice(0, 5).map((mealPlan) => (
                <List.Item
                  key={mealPlan.id}
                  title={mealPlan.name}
                  description={`${new Date(mealPlan.date).toLocaleDateString()} • ${mealPlan.meals.length} meals`}
                  left={(props) => (
                    <List.Icon {...props} icon="calendar" />
                  )}
                  onPress={() => {
                    setSelectedDate(mealPlan.date);
                    Alert.alert('Date Updated', `Date set to ${new Date(mealPlan.date).toLocaleDateString()}`);
                  }}
                  style={styles.mealPlanItem}
                />
              ))
            ) : (
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                No existing meal plans
              </Text>
            )}
          </Card.Content>
        </Card>
      </ScrollView>
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
  recipeInfo: {
    marginBottom: 8,
  },
  recipeStats: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  mealPlanItem: {
    paddingVertical: 4,
  },
});

export default AddToMealPlanScreen; 