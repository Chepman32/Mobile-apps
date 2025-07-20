import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Text,
  Button,
  Chip,
  Avatar,
  List,
  useTheme,
  IconButton,
  FAB,
  SegmentedButtons,
  Portal,
  Dialog,
} from 'react-native-paper';
import { Calendar } from 'react-native-calendars';
import { useNavigation } from '@react-navigation/native';
import { useRecipeVault } from '../context/RecipeVaultContext';
import { MealPlan, Recipe } from '../types';

const MealPlansScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { state, actions } = useRecipeVault();
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddMealDialog, setShowAddMealDialog] = useState(false);

  const { mealPlans, recipes } = state;

  const onRefresh = async () => {
    setRefreshing(true);
    await actions.fetchAllData();
    setRefreshing(false);
  };

  const markedDates = useMemo(() => {
    const marked: any = {};
    mealPlans.forEach(plan => {
      const date = new Date(plan.date).toISOString().split('T')[0];
      marked[date] = {
        marked: true,
        dotColor: theme.colors.primary,
      };
    });
    return marked;
  }, [mealPlans, theme.colors.primary]);

  const selectedDateMealPlan = mealPlans.find(
    plan => new Date(plan.date).toISOString().split('T')[0] === selectedDate
  );

  const renderCalendarView = () => (
    <View>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: {
            ...markedDates[selectedDate],
            selected: true,
            selectedColor: theme.colors.primary,
          },
        }}
        theme={{
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: theme.colors.onPrimary,
          todayTextColor: theme.colors.primary,
          dayTextColor: theme.colors.onSurface,
          textDisabledColor: theme.colors.onSurfaceDisabled,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.onSurface,
          indicatorColor: theme.colors.primary,
        }}
        style={styles.calendar}
      />

      {/* Selected Date Meal Plan */}
      <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
            <Button
              mode="contained-tonal"
              icon="plus"
              onPress={() => setShowAddMealDialog(true)}
            >
              Add Meal
            </Button>
          </View>

          {selectedDateMealPlan ? (
            selectedDateMealPlan.meals.map((meal, index) => (
              <View key={index} style={styles.mealItem}>
                <View style={styles.mealInfo}>
                  <Text variant="bodyLarge" style={{ color: theme.colors.onSurface }}>
                    {meal.mealType}
                  </Text>
                  <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    {meal.recipe?.title || 'No recipe assigned'}
                  </Text>
                  {meal.recipe && (
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      {meal.recipe.prepTime} min • {meal.recipe.difficulty}
                    </Text>
                  )}
                </View>
                <View style={styles.mealActions}>
                  {meal.recipe && (
                    <IconButton
                      icon="chef-hat"
                      size={20}
                      onPress={() => navigation.navigate('RecipeDetail', { recipeId: meal.recipe!.id } as never)}
                    />
                  )}
                  <IconButton
                    icon="pencil"
                    size={20}
                    onPress={() => navigation.navigate('EditMealPlan', { 
                      mealPlanId: selectedDateMealPlan.id,
                      mealIndex: index 
                    } as never)}
                  />
                  <IconButton
                    icon="delete"
                    size={20}
                    onPress={() => {
                      const updatedMeals = selectedDateMealPlan.meals.filter((_, i) => i !== index);
                      actions.updateMealPlan({
                        ...selectedDateMealPlan,
                        meals: updatedMeals,
                      });
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyMealPlan}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                No meals planned for this day
              </Text>
              <Button
                mode="outlined"
                onPress={() => setShowAddMealDialog(true)}
                style={{ marginTop: 8 }}
              >
                Plan Your First Meal
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </View>
  );

  const renderWeeklyView = () => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      weekDays.push(date);
    }

    return (
      <ScrollView>
        {weekDays.map((date, index) => {
          const dateString = date.toISOString().split('T')[0];
          const dayMealPlan = mealPlans.find(
            plan => new Date(plan.date).toISOString().split('T')[0] === dateString
          );

          return (
            <Card key={index} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Card.Content>
                <View style={styles.cardHeader}>
                  <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                    {date.toLocaleDateString('en-US', { weekday: 'long' })}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>

                {dayMealPlan ? (
                  dayMealPlan.meals.map((meal, mealIndex) => (
                    <View key={mealIndex} style={styles.mealItem}>
                      <View style={styles.mealInfo}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                          {meal.mealType}: {meal.recipe?.title || 'No recipe assigned'}
                        </Text>
                        {meal.recipe && (
                          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                            {meal.recipe.prepTime} min • {meal.recipe.difficulty}
                          </Text>
                        )}
                      </View>
                      <Chip
                        mode="outlined"
                        compact
                        style={{ backgroundColor: theme.colors.surfaceVariant }}
                      >
                        {meal.mealType}
                      </Chip>
                    </View>
                  ))
                ) : (
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    No meals planned
                  </Text>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>
    );
  };

  const renderListView = () => (
    <ScrollView>
      {mealPlans
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map((mealPlan, index) => (
          <Card key={mealPlan.id} style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface }}>
                  {new Date(mealPlan.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
                <IconButton
                  icon="pencil"
                  size={20}
                  onPress={() => navigation.navigate('EditMealPlan', { mealPlanId: mealPlan.id } as never)}
                />
              </View>

              {mealPlan.meals.map((meal, mealIndex) => (
                <View key={mealIndex} style={styles.mealItem}>
                  <View style={styles.mealInfo}>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface }}>
                      {meal.mealType}: {meal.recipe?.title || 'No recipe assigned'}
                    </Text>
                    {meal.recipe && (
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                        {meal.recipe.prepTime} min • {meal.recipe.difficulty}
                      </Text>
                    )}
                  </View>
                  <Chip
                    mode="outlined"
                    compact
                    style={{ backgroundColor: theme.colors.surfaceVariant }}
                  >
                    {meal.mealType}
                  </Chip>
                </View>
              ))}
            </Card.Content>
          </Card>
        ))}
    </ScrollView>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text variant="headlineSmall" style={{ color: theme.colors.onSurface }}>
          Meal Plans
        </Text>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => navigation.navigate('AddMealPlan' as never)}
        >
          New Plan
        </Button>
      </View>

      {/* View Mode Toggle */}
      <SegmentedButtons
        value={viewMode}
        onValueChange={setViewMode}
        buttons={[
          { value: 'calendar', label: 'Calendar' },
          { value: 'weekly', label: 'Weekly' },
          { value: 'list', label: 'List' },
        ]}
        style={styles.segmentedButtons}
      />

      {/* Content */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {viewMode === 'calendar' && renderCalendarView()}
        {viewMode === 'weekly' && renderWeeklyView()}
        {viewMode === 'list' && renderListView()}
      </ScrollView>

      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => navigation.navigate('AddMealPlan' as never)}
      />

      {/* Add Meal Dialog */}
      <Portal>
        <Dialog
          visible={showAddMealDialog}
          onDismiss={() => setShowAddMealDialog(false)}
        >
          <Dialog.Title>Add Meal to Plan</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Add a meal to your plan for {new Date(selectedDate).toLocaleDateString()}?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddMealDialog(false)}>Cancel</Button>
            <Button onPress={() => {
              setShowAddMealDialog(false);
              navigation.navigate('AddMealPlan', { selectedDate } as never);
            }}>
              Add Meal
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  segmentedButtons: {
    margin: 16,
    marginTop: 0,
  },
  content: {
    flex: 1,
  },
  calendar: {
    margin: 16,
    marginTop: 0,
  },
  card: {
    margin: 16,
    marginTop: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  mealInfo: {
    flex: 1,
  },
  mealActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyMealPlan: {
    alignItems: 'center',
    padding: 32,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default MealPlansScreen; 