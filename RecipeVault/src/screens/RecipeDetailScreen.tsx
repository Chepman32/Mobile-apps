import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Avatar,
  List,
  Divider,
  useTheme,
  IconButton,
  Dialog,
  Portal,
  ProgressBar,
  SegmentedButtons,
} from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { Recipe, CookingSession } from '../types';

const { width } = Dimensions.get('window');

const RecipeDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const { state, actions } = useRecipeVault();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [cookingSession, setCookingSession] = useState<CookingSession | null>(null);
  const [showStartCookingDialog, setShowStartCookingDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { recipeId } = route.params as { recipeId: string };

  useEffect(() => {
    const foundRecipe = state.recipes.find(r => r.id === recipeId);
    setRecipe(foundRecipe || null);
  }, [recipeId, state.recipes]);

  const handleStartCooking = async () => {
    if (!recipe) return;

    const session: CookingSession = {
      id: Date.now().toString(),
      recipeId: recipe.id,
      recipe: recipe,
      startTime: new Date().toISOString(),
      status: 'in-progress',
      duration: 0,
      notes: '',
      photos: [],
    };

    await actions.addCookingSession(session);
    setCookingSession(session);
    setShowStartCookingDialog(false);
    navigation.navigate('CookingSession', { sessionId: session.id } as never);
  };

  const handleDeleteRecipe = async () => {
    if (!recipe) return;

    await actions.deleteRecipe(recipe.id);
    setShowDeleteDialog(false);
    navigation.goBack();
  };

  const handleShareRecipe = () => {
    if (!recipe) return;
    // TODO: Implement share functionality
    Alert.alert('Share', 'Share functionality coming soon!');
  };

  const handleEditRecipe = () => {
    if (!recipe) return;
    navigation.navigate('EditRecipe', { recipeId: recipe.id } as never);
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

  const renderOverview = () => (
    <View>
      {/* Recipe Image Placeholder */}
      <View style={[styles.imagePlaceholder, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Text variant="headlineLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          {recipe.title.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Recipe Stats */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                {recipe.prepTime}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Minutes
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                {recipe.servings}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Servings
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                {recipe.difficulty}
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Difficulty
              </Text>
            </View>
            {recipe.rating && (
              <View style={styles.statItem}>
                <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
                  ⭐ {recipe.rating.toFixed(1)}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Rating
                </Text>
              </View>
            )}
          </View>
        </Card.Content>
      </Card>

      {/* Description */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 8 }}>
            Description
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
            {recipe.description}
          </Text>
        </Card.Content>
      </Card>

      {/* Tags */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 12 }}>
            Tags
          </Text>
          <View style={styles.tagsContainer}>
            {recipe.cuisine && (
              <Chip
                mode="outlined"
                style={{ backgroundColor: theme.colors.primaryContainer }}
              >
                {recipe.cuisine.name}
              </Chip>
            )}
            {recipe.category && (
              <Chip
                mode="outlined"
                style={{ backgroundColor: theme.colors.secondaryContainer }}
              >
                {recipe.category.name}
              </Chip>
            )}
            {recipe.tags && recipe.tags.map((tag, index) => (
              <Chip
                key={index}
                mode="outlined"
                style={{ backgroundColor: theme.colors.surfaceVariant }}
              >
                {tag}
              </Chip>
            ))}
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderIngredients = () => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          Ingredients
        </Text>
        {recipe.ingredients && recipe.ingredients.map((ingredient, index) => (
          <List.Item
            key={index}
            title={ingredient.name}
            description={`${ingredient.amount} ${ingredient.unit}`}
            left={(props) => (
              <List.Icon {...props} icon="circle-small" />
            )}
            style={styles.ingredientItem}
          />
        ))}
      </Card.Content>
    </Card>
  );

  const renderInstructions = () => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          Instructions
        </Text>
        {recipe.instructions && recipe.instructions.map((instruction, index) => (
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
          </View>
        ))}
      </Card.Content>
    </Card>
  );

  const renderNutrition = () => (
    <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      <Card.Content>
        <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
          Nutrition Information
        </Text>
        {recipe.nutrition && (
          <View style={styles.nutritionContainer}>
            <View style={styles.nutritionItem}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                Calories
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                {recipe.nutrition.calories} kcal
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                Protein
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                {recipe.nutrition.protein}g
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                Carbs
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                {recipe.nutrition.carbs}g
              </Text>
            </View>
            <View style={styles.nutritionItem}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                Fat
              </Text>
              <Text variant="titleMedium" style={{ color: theme.colors.primary }}>
                {recipe.nutrition.fat}g
              </Text>
            </View>
          </View>
        )}
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
          {recipe.title}
        </Text>
        <IconButton
          icon="share"
          size={24}
          onPress={handleShareRecipe}
        />
        <IconButton
          icon="pencil"
          size={24}
          onPress={handleEditRecipe}
        />
        <IconButton
          icon="delete"
          size={24}
          onPress={() => setShowDeleteDialog(true)}
        />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Tab Navigation */}
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'overview', label: 'Overview' },
            { value: 'ingredients', label: 'Ingredients' },
            { value: 'instructions', label: 'Instructions' },
            { value: 'nutrition', label: 'Nutrition' },
          ]}
          style={styles.tabButtons}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'ingredients' && renderIngredients()}
        {activeTab === 'instructions' && renderInstructions()}
        {activeTab === 'nutrition' && renderNutrition()}
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="chef-hat"
          onPress={() => setShowStartCookingDialog(true)}
          style={styles.startCookingButton}
        >
          Start Cooking
        </Button>
        <Button
          mode="outlined"
          icon="plus"
          onPress={() => navigation.navigate('AddToMealPlan', { recipeId: recipe.id } as never)}
        >
          Add to Meal Plan
        </Button>
      </View>

      {/* Start Cooking Dialog */}
      <Portal>
        <Dialog
          visible={showStartCookingDialog}
          onDismiss={() => setShowStartCookingDialog(false)}
        >
          <Dialog.Title>Start Cooking Session</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you ready to start cooking "{recipe.title}"? This will start a new cooking session.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowStartCookingDialog(false)}>Cancel</Button>
            <Button onPress={handleStartCooking}>Start Cooking</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}
        >
          <Dialog.Title>Delete Recipe</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Are you sure you want to delete "{recipe.title}"? This action cannot be undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button onPress={handleDeleteRecipe} textColor={theme.colors.error}>
              Delete
            </Button>
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
  tabButtons: {
    margin: 16,
  },
  imagePlaceholder: {
    width: width - 32,
    height: 200,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ingredientItem: {
    paddingVertical: 4,
  },
  instructionItem: {
    flexDirection: 'row',
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
  nutritionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 8,
  },
  actionButtons: {
    padding: 16,
    gap: 12,
  },
  startCookingButton: {
    marginBottom: 8,
  },
});

export default RecipeDetailScreen; 