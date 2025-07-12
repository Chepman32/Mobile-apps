import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, Category, DailyProgress, Stats } from '../types';

interface AppContextType {
  habits: Habit[];
  categories: Category[];
  todayProgress: DailyProgress;
  stats: Stats;
  loading: boolean;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'currentStreak' | 'longestStreak' | 'completionHistory'>) => Promise<void>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitCompletion: (habitId: string) => Promise<void>;
  getHabitById: (id: string) => Habit | undefined;
  getHabitsByCategory: (categoryId: string) => Habit[];
  refreshData: () => Promise<void>;
  resetAllData: () => Promise<void>;
}

const defaultStats: Stats = {
  currentStreak: 0,
  longestStreak: 0,
  totalHabits: 0,
  completionRate: 0,
  monthlyCompletions: [],
  categoryDistribution: []
};

const defaultTodayProgress: DailyProgress = {
  date: new Date().toISOString().split('T')[0],
  completedHabits: [],
  totalHabits: 0,
  completionPercentage: 0
};

export const AppContext = createContext<AppContextType>({
  habits: [],
  categories: [],
  todayProgress: defaultTodayProgress,
  stats: defaultStats,
  loading: true,
  addHabit: async () => {},
  updateHabit: async () => {},
  deleteHabit: async () => {},
  toggleHabitCompletion: async () => {},
  getHabitById: () => undefined,
  getHabitsByCategory: () => [],
  refreshData: async () => {},
  resetAllData: async () => {}
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [todayProgress, setTodayProgress] = useState<DailyProgress>(defaultTodayProgress);
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState(true);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadData();
  }, []);

  // Recalculate progress and stats whenever habits change
  useEffect(() => {
    if (!loading) {
      updateTodayProgress();
      calculateStats();
    }
  }, [habits]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [habitsData, categoriesData, progressData] = await Promise.all([
        AsyncStorage.getItem('habits'),
        AsyncStorage.getItem('categories'),
        AsyncStorage.getItem('todayProgress')
      ]);

      const loadedHabits = habitsData ? JSON.parse(habitsData) : [];
      setHabits(loadedHabits);

      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      } else {
        const defaultCategories: Category[] = [
          { id: '1', name: 'Health', icon: 'heart', color: '#FF6B6B' },
          { id: '2', name: 'Productivity', icon: 'checkmark-done', color: '#4ECDC4' },
          { id: '3', name: 'Mindfulness', icon: 'leaf', color: '#45B7D1' },
          { id: '4', name: 'Learning', icon: 'book', color: '#96CEB4' },
          { id: '5', name: 'Fitness', icon: 'barbell', color: '#FFEEAD' },
        ];
        setCategories(defaultCategories);
        await AsyncStorage.setItem('categories', JSON.stringify(defaultCategories));
      }
      if (progressData) setTodayProgress(JSON.parse(progressData));
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTodayProgress = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayHabits = habits.filter(habit => {
      if (habit.frequency === 'daily') return true;
      if (habit.frequency === 'weekly' && habit.daysOfWeek?.includes(new Date().getDay())) {
        return true;
      }
      return false;
    });

    const completedToday = todayHabits.filter(habit => 
      habit.completionHistory.some(ch => ch.date === today && ch.count >= habit.targetCount)
    );

    const progress: DailyProgress = {
      date: today,
      completedHabits: completedToday.map(h => h.id),
      totalHabits: todayHabits.length,
      completionPercentage: todayHabits.length > 0 ? Math.round((completedToday.length / todayHabits.length) * 100) : 0
    };

    setTodayProgress(progress);
    AsyncStorage.setItem('todayProgress', JSON.stringify(progress));
  }, [habits]);

  const calculateStats = useCallback(() => {
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 
      ? habits.reduce((sum, habit) => sum + (habit.completionHistory.length > 0 ? 1 : 0), 0) / totalHabits
      : 0;

    const monthlyCompletions = Array(30).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split('T')[0];
      const count = habits.reduce((sum, habit) => 
        sum + (habit.completionHistory.some(ch => ch.date === dateStr) ? 1 : 0), 0);
      return { date: dateStr, count };
    });

    const categoryDistribution = categories.map(category => ({
      category: category.name,
      count: habits.filter(h => h.category === category.id).length
    }));

    setStats(prev => ({ ...prev, totalHabits, completionRate, monthlyCompletions, categoryDistribution }));
  }, [habits, categories]);

  const addHabit = async (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'currentStreak' | 'longestStreak' | 'completionHistory'>) => {
    const newHabit: Habit = {
      ...habit,
      id: new Date().toISOString() + Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentStreak: 0,
      longestStreak: 0,
      completionHistory: [],
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const updateHabit = async (id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(h => 
      h.id === id ? { ...h, ...updates, updatedAt: new Date().toISOString() } : h
    );
    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const deleteHabit = async (id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const toggleHabitCompletion = async (habitId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const habitToUpdate = habits.find(h => h.id === habitId);
    if (!habitToUpdate) return;

    const completionIndex = habitToUpdate.completionHistory.findIndex(ch => ch.date === today);
    
    let updatedCompletions = [...habitToUpdate.completionHistory];
    if (completionIndex >= 0) {
      updatedCompletions.splice(completionIndex, 1);
    } else {
      updatedCompletions.push({ date: today, count: 1 });
    }

    const currentStreak = calculateCurrentStreak(updatedCompletions);
    const longestStreak = Math.max(habitToUpdate.longestStreak, currentStreak);

    const updatedHabits = habits.map(h => 
      h.id === habitId ? { 
        ...h, 
        completionHistory: updatedCompletions,
        currentStreak,
        longestStreak,
        updatedAt: new Date().toISOString() 
      } : h
    );
    setHabits(updatedHabits);
    await AsyncStorage.setItem('habits', JSON.stringify(updatedHabits));
  };

  const calculateCurrentStreak = (completions: { date: string }[]) => {
    if (completions.length === 0) return 0;
    
    const sortedDates = [...completions]
      .map(c => new Date(c.date).getTime())
      .sort((a, b) => b - a);
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(currentDate);
      checkDate.setDate(checkDate.getDate() - i);
      
      const hasCompletion = sortedDates.some(d => {
        const completionDate = new Date(d);
        completionDate.setHours(0, 0, 0, 0);
        return completionDate.getTime() === checkDate.getTime();
      });

      if (hasCompletion) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getHabitById = (id: string) => {
    return habits.find(habit => habit.id === id);
  };

  const getHabitsByCategory = (categoryId: string) => {
    return habits.filter(habit => habit.category === categoryId);
  };

  const refreshData = async () => {
    await loadData();
  };

  const resetAllData = async () => {
    try {
      setLoading(true);
      // Clear state
      setHabits([]);
      setTodayProgress(defaultTodayProgress);
      setStats(defaultStats);

      // Clear AsyncStorage
      await AsyncStorage.removeItem('habits');
      await AsyncStorage.removeItem('todayProgress');
      // We keep categories as they are default

    } catch (error) {
      console.error('Error resetting data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        habits,
        categories,
        todayProgress,
        stats,
        loading,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitCompletion,
        getHabitById,
        getHabitsByCategory,
        refreshData,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
