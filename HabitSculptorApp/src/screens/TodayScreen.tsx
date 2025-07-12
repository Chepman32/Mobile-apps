import React, { useCallback, useContext, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { useTheme, themes } from '../context/ThemeContext';
import { Habit } from '../types';

const TodayScreen = ({ navigation }: { navigation: any }) => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const { 
    todayProgress, 
    habits, 
    categories,
    loading, 
    toggleHabitCompletion, 
    refreshData 
  } = useContext(AppContext);

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshData();
    }, [])
  );

  // Get habits for today
  const categoryMap = useMemo(() => 
    new Map(categories.map(cat => [cat.id, cat.name]))
  , [categories]);

  const todaysHabits = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return habits.filter(habit => {
      if (habit.frequency === 'daily') return true;
      if (habit.frequency === 'weekly' && habit.daysOfWeek?.includes(new Date().getDay())) {
        return true;
      }
      return false;
    });
  }, [habits]);

  const handleHabitPress = (habit: Habit) => {
    navigation.navigate('HabitDetails', { habitId: habit.id });
  };

  const handleCompleteHabit = (habitId: string, e: any) => {
    e.stopPropagation();
    toggleHabitCompletion(habitId);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateText}>
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
        <Text style={styles.progressText}>
          {todayProgress.completedHabits.length} of {todayProgress.totalHabits} completed
        </Text>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${todayProgress.completionPercentage}%` }
            ]} 
          />
        </View>
      </View>

      <ScrollView style={styles.habitsContainer}>
        {todaysHabits.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="checkmark-done-circle" size={60} color={colors.subtext} />
            <Text style={styles.emptyStateText}>No habits for today</Text>
            <Text style={styles.emptyStateSubtext}>
              Add habits to start tracking your progress
            </Text>
          </View>
        ) : (
          todaysHabits.map(habit => {
            const isCompleted = todayProgress.completedHabits.includes(habit.id);
            const categoryName = categoryMap.get(habit.category) || 'Uncategorized';

            return (
              <TouchableOpacity 
                key={habit.id} 
                style={[
                  styles.habitCard,
                  isCompleted && styles.completedHabitCard
                ]}
                onPress={() => handleHabitPress(habit)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${habit.color}20` }]}>
                  <Ionicons name={habit.icon as any} size={24} color={habit.color} />
                </View>
                <View style={styles.habitInfo}>
                  <Text 
                    style={[
                      styles.habitName,
                      isCompleted && styles.completedHabitName
                    ]}
                  >
                    {habit.name}
                  </Text>
                  <Text style={styles.habitCategory}>
                    {categoryName}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.completeButton,
                    isCompleted && { backgroundColor: habit.color, borderColor: habit.color }
                  ]}
                  onPress={(e) => handleCompleteHabit(habit.id, e)}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={24} color="#fff" />
                  ) : (
                    <View style={[styles.emptyCircle, { borderColor: habit.color }]} />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddEditHabit')}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const createStyles = (colors: typeof themes.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.card,
    padding: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dateText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.text,
  },
  progressText: {
    fontSize: 14,
    color: colors.subtext,
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 5,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  habitsContainer: {
    flex: 1,
    padding: 15,
  },
  habitCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  completedHabitCard: {
    opacity: 0.7,
    backgroundColor: colors.background,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  habitInfo: {
    flex: 1,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: colors.text,
  },
  completedHabitName: {
    textDecorationLine: 'line-through',
    color: colors.subtext,
  },
  habitCategory: {
    fontSize: 13,
    color: colors.subtext,
  },
  completeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#888',
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4a6fa5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default TodayScreen;
