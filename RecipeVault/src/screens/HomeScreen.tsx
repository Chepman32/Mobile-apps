import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
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
} from 'react-native-paper';
import { LineChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { Recipe, MealPlan, CookingSession, Statistics } from '../types';

const { width } = Dimensions.get('window');

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, actions } = useRecipeVault();
  const [refreshing, setRefreshing] = useState(false);

  const {
    recipes,
    mealPlans,
    cookingSessions,
    statistics,
    achievements,
  } = state;

  const onRefresh = async () => {
    setRefreshing(true);
    await actions.fetchAllData();
    setRefreshing(false);
  };

  const recentRecipes = recipes.slice(0, 3);
  const todayMealPlan = mealPlans.find(
    (plan) => new Date(plan.date).toDateString() === new Date().toDateString()
  );
  const recentSessions = cookingSessions.slice(0, 2);
  const totalRecipes = recipes.length;
  const totalCookingTime = cookingSessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [2, 3, 1, 4, 2, 5, 3],
        color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const quickActions = [
    {
      title: 'Add Recipe',
      icon: 'plus',
      onPress: () => navigation.navigate('AddRecipe' as never),
      color: theme.colors.primary,
    },
    {
      title: 'Plan Meal',
      icon: 'calendar',
      onPress: () => navigation.navigate('MealPlans' as never),
      color: theme.colors.secondary,
    },
    {
      title: 'Shopping List',
      icon: 'cart',
      onPress: () => navigation.navigate('Shopping' as never),
      color: theme.colors.tertiary,
    },
    {
      title: 'Start Cooking',
      icon: 'chef-hat',
      onPress: () => navigation.navigate('CookingSession' as never),
      color: theme.colors.error,
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineMedium" style={{ color: theme.colors.onBackground }}>
          Recipe Vault
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
          Your culinary journey starts here
        </Text>
      </View>

      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <Card style={[styles.statCard, { backgroundColor: theme.colors.primaryContainer }]}>
          <Card.Content>
            <Text variant="headlineLarge" style={{ color: theme.colors.onPrimaryContainer }}>
              {totalRecipes}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onPrimaryContainer }}>
              Total Recipes
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.statCard, { backgroundColor: theme.colors.secondaryContainer }]}>
          <Card.Content>
            <Text variant="headlineLarge" style={{ color: theme.colors.onSecondaryContainer }}>
              {Math.round(totalCookingTime / 60)}
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSecondaryContainer }}>
              Hours Cooked
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Quick Actions */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Quick Actions
          </Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                mode="contained-tonal"
                icon={action.icon}
                onPress={action.onPress}
                style={[styles.quickActionButton, { backgroundColor: action.color + '20' }]}
                labelStyle={{ color: action.color }}
              >
                {action.title}
              </Button>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Today's Meal Plan */}
      {todayMealPlan && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                Today's Meal Plan
              </Text>
              <IconButton
                icon="pencil"
                size={20}
                onPress={() => navigation.navigate('MealPlans' as never)}
              />
            </View>
            {todayMealPlan.meals.map((meal, index) => (
              <View key={index} style={styles.mealItem}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                  {meal.mealType}: {meal.recipe?.title || 'No recipe assigned'}
                </Text>
                <Chip
                  mode="outlined"
                  compact
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                >
                  {meal.recipe?.prepTime || 0} min
                </Chip>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}

      {/* Recent Recipes */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              Recent Recipes
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Recipes' as never)}
            >
              View All
            </Button>
          </View>
          {recentRecipes.map((recipe, index) => (
            <List.Item
              key={recipe.id}
              title={recipe.title}
              description={`${recipe.prepTime} min • ${recipe.difficulty}`}
              left={(props) => (
                <Avatar.Text
                  {...props}
                  label={recipe.title.charAt(0).toUpperCase()}
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                />
              )}
              right={(props) => (
                <View style={styles.recipeActions}>
                  <Chip
                    mode="outlined"
                    compact
                    style={{ backgroundColor: theme.colors.surfaceVariant }}
                  >
                    {recipe.cuisine?.name || 'Unknown'}
                  </Chip>
                </View>
              )}
              onPress={() => navigation.navigate('RecipeDetail', { recipeId: recipe.id } as never)}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Cooking Activity Chart */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
            Weekly Cooking Activity
          </Text>
          <LineChart
            data={chartData}
            width={width - 64}
            height={180}
            chartConfig={{
              backgroundColor: theme.colors.surface,
              backgroundGradientFrom: theme.colors.surface,
              backgroundGradientTo: theme.colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: theme.colors.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </Card.Content>
      </Card>

      {/* Recent Cooking Sessions */}
      {recentSessions.length > 0 && (
        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface, marginBottom: 16 }}>
              Recent Cooking Sessions
            </Text>
            {recentSessions.map((session, index) => (
              <View key={session.id} style={styles.sessionItem}>
                <View style={styles.sessionInfo}>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                    {session.recipe?.title}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {new Date(session.startTime).toLocaleDateString()} • {session.duration} min
                  </Text>
                </View>
                <Chip
                  mode="outlined"
                  compact
                  style={{ backgroundColor: theme.colors.surfaceVariant }}
                >
                  {session.status}
                </Chip>
              </View>
            ))}
          </Card.Content>
        </Card>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
  },
  card: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  recipeActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  sessionInfo: {
    flex: 1,
  },
});

export default HomeScreen; 