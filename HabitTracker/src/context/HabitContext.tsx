import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import HabitService from '../services/HabitService';
import { 
  Habit, 
  HabitEntry, 
  HabitCategory, 
  Achievement, 
  HabitTemplate,
  DailyGoal,
  HabitReminder,
  UserSettings,
  MotivationalQuote,
  HabitStats,
  HabitInsight,
  HabitFilterType,
  HabitSortType
} from '../types';

interface HabitState {
  habits: Habit[];
  entries: HabitEntry[];
  categories: HabitCategory[];
  achievements: Achievement[];
  templates: HabitTemplate[];
  dailyGoal: DailyGoal | null;
  reminders: HabitReminder[];
  settings: UserSettings | null;
  todaysQuote: MotivationalQuote | null;
  insights: HabitInsight[];
  selectedDate: Date;
  filter: HabitFilterType;
  sortBy: HabitSortType;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

type HabitAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: { id: string; updates: Partial<Habit> } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'SET_ENTRIES'; payload: HabitEntry[] }
  | { type: 'ADD_ENTRY'; payload: HabitEntry }
  | { type: 'UPDATE_ENTRY'; payload: { id: string; updates: Partial<HabitEntry> } }
  | { type: 'SET_CATEGORIES'; payload: HabitCategory[] }
  | { type: 'ADD_CATEGORY'; payload: HabitCategory }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; updates: Partial<HabitCategory> } }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: HabitTemplate[] }
  | { type: 'SET_DAILY_GOAL'; payload: DailyGoal | null }
  | { type: 'SET_REMINDERS'; payload: HabitReminder[] }
  | { type: 'ADD_REMINDER'; payload: HabitReminder }
  | { type: 'UPDATE_REMINDER'; payload: { id: string; updates: Partial<HabitReminder> } }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'SET_SETTINGS'; payload: UserSettings | null }
  | { type: 'SET_TODAYS_QUOTE'; payload: MotivationalQuote | null }
  | { type: 'SET_INSIGHTS'; payload: HabitInsight[] }
  | { type: 'ADD_INSIGHT'; payload: HabitInsight }
  | { type: 'MARK_INSIGHT_READ'; payload: string }
  | { type: 'SET_SELECTED_DATE'; payload: Date }
  | { type: 'SET_FILTER'; payload: HabitFilterType }
  | { type: 'SET_SORT'; payload: HabitSortType }
  | { type: 'SET_SEARCH_QUERY'; payload: string };

const initialState: HabitState = {
  habits: [],
  entries: [],
  categories: [],
  achievements: [],
  templates: [],
  dailyGoal: null,
  reminders: [],
  settings: null,
  todaysQuote: null,
  insights: [],
  selectedDate: new Date(),
  filter: 'all',
  sortBy: 'name',
  searchQuery: '',
  isLoading: false,
  error: null,
};

function habitReducer(state: HabitState, action: HabitAction): HabitState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id
            ? { ...habit, ...action.payload.updates }
            : habit
        ),
      };
    
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        entries: state.entries.filter(entry => entry.habitId !== action.payload),
        reminders: state.reminders.filter(reminder => reminder.habitId !== action.payload),
      };
    
    case 'SET_ENTRIES':
      return { ...state, entries: action.payload };
    
    case 'ADD_ENTRY':
      return { ...state, entries: [...state.entries, action.payload] };
    
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry =>
          entry.id === action.payload.id
            ? { ...entry, ...action.payload.updates }
            : entry
        ),
      };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category =>
          category.id === action.payload.id
            ? { ...category, ...action.payload.updates }
            : category
        ),
      };
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload
            ? { ...achievement, unlockedAt: new Date().toISOString() }
            : achievement
        ),
      };
    
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    
    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoal: action.payload };
    
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id
            ? { ...reminder, ...action.payload.updates }
            : reminder
        ),
      };
    
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'SET_TODAYS_QUOTE':
      return { ...state, todaysQuote: action.payload };
    
    case 'SET_INSIGHTS':
      return { ...state, insights: action.payload };
    
    case 'ADD_INSIGHT':
      return { ...state, insights: [...state.insights, action.payload] };
    
    case 'MARK_INSIGHT_READ':
      return {
        ...state,
        insights: state.insights.map(insight =>
          insight.id === action.payload
            ? { ...insight, isRead: true }
            : insight
        ),
      };
    
    case 'SET_SELECTED_DATE':
      return { ...state, selectedDate: action.payload };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SORT':
      return { ...state, sortBy: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    default:
      return state;
  }
}

interface HabitContextValue extends HabitState {
  // Habit actions
  addHabit: (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'streak' | 'bestStreak' | 'totalCompletions'>) => Promise<string>;
  updateHabit: (id: string, updates: Partial<Habit>) => Promise<boolean>;
  deleteHabit: (id: string) => Promise<boolean>;
  
  // Entry actions
  markHabitComplete: (habitId: string, date: Date, count?: number, notes?: string, mood?: 1 | 2 | 3 | 4 | 5) => Promise<boolean>;
  markHabitIncomplete: (habitId: string, date: Date) => Promise<boolean>;
  
  // Category actions
  addCategory: (categoryData: Omit<HabitCategory, 'id' | 'habitCount' | 'createdAt'>) => Promise<string>;
  updateCategory: (id: string, updates: Partial<HabitCategory>) => Promise<boolean>;
  deleteCategory: (id: string) => Promise<boolean>;
  
  // Reminder actions
  addReminder: (reminderData: Omit<HabitReminder, 'id'>) => Promise<string>;
  updateReminder: (id: string, updates: Partial<HabitReminder>) => Promise<boolean>;
  deleteReminder: (id: string) => Promise<boolean>;
  
  // Settings actions
  updateSettings: (settings: UserSettings) => Promise<void>;
  
  // Insight actions
  markInsightAsRead: (id: string) => Promise<boolean>;
  
  // Filter and search actions
  setSelectedDate: (date: Date) => void;
  setFilter: (filter: HabitFilterType) => void;
  setSortBy: (sort: HabitSortType) => void;
  setSearchQuery: (query: string) => void;
  
  // Data actions
  refreshData: () => Promise<void>;
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
  
  // Utility functions
  getHabitStats: (habitId: string) => HabitStats | null;
  getOverallStats: () => ReturnType<typeof HabitService.getOverallStats>;
  getFilteredHabits: () => Habit[];
  getTodaysEntries: () => HabitEntry[];
  getUnreadInsights: () => HabitInsight[];
}

const HabitContext = createContext<HabitContextValue | undefined>(undefined);

export function HabitProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(habitReducer, initialState);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Update daily goal when date changes
  useEffect(() => {
    updateDailyGoal();
  }, [state.selectedDate]);

  const loadInitialData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Load all data in parallel
      const [
        habits,
        entries,
        categories,
        achievements,
        templates,
        reminders,
        settings,
        todaysQuote,
        insights
      ] = await Promise.all([
        Promise.resolve(HabitService.getHabits()),
        Promise.resolve(HabitService.getEntries()),
        Promise.resolve(HabitService.getCategories()),
        Promise.resolve(HabitService.getAchievements()),
        Promise.resolve(HabitService.getTemplates()),
        Promise.resolve(HabitService.getReminders()),
        Promise.resolve(HabitService.getSettings()),
        Promise.resolve(HabitService.getTodaysQuote()),
        Promise.resolve(HabitService.getInsights()),
      ]);

      dispatch({ type: 'SET_HABITS', payload: habits });
      dispatch({ type: 'SET_ENTRIES', payload: entries });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
      dispatch({ type: 'SET_REMINDERS', payload: reminders });
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      dispatch({ type: 'SET_TODAYS_QUOTE', payload: todaysQuote });
      dispatch({ type: 'SET_INSIGHTS', payload: insights });

      // Load daily goal for selected date
      await updateDailyGoal();

      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      console.error('Error loading initial data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const updateDailyGoal = useCallback(async () => {
    try {
      const goal = HabitService.ensureDailyGoal(state.selectedDate);
      dispatch({ type: 'SET_DAILY_GOAL', payload: goal });
    } catch (error) {
      console.error('Error updating daily goal:', error);
    }
  }, [state.selectedDate]);

  // Habit actions
  const addHabit = useCallback(async (habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'streak' | 'bestStreak' | 'totalCompletions'>): Promise<string> => {
    try {
      const id = HabitService.addHabit(habitData);
      const newHabit = HabitService.getHabit(id);
      if (newHabit) {
        dispatch({ type: 'ADD_HABIT', payload: newHabit });
        
        // Refresh categories and achievements
        dispatch({ type: 'SET_CATEGORIES', payload: HabitService.getCategories() });
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: HabitService.getAchievements() });
        
        // Update daily goal
        await updateDailyGoal();
      }
      return id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add habit' });
      throw error;
    }
  }, [updateDailyGoal]);

  const updateHabit = useCallback(async (id: string, updates: Partial<Habit>): Promise<boolean> => {
    try {
      const success = HabitService.updateHabit(id, updates);
      if (success) {
        dispatch({ type: 'UPDATE_HABIT', payload: { id, updates } });
        
        // Refresh categories if category changed
        if (updates.category) {
          dispatch({ type: 'SET_CATEGORIES', payload: HabitService.getCategories() });
        }
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update habit' });
      throw error;
    }
  }, []);

  const deleteHabit = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = HabitService.deleteHabit(id);
      if (success) {
        dispatch({ type: 'DELETE_HABIT', payload: id });
        
        // Refresh categories
        dispatch({ type: 'SET_CATEGORIES', payload: HabitService.getCategories() });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete habit' });
      throw error;
    }
  }, []);

  // Entry actions
  const markHabitComplete = useCallback(async (habitId: string, date: Date, count = 1, notes?: string, mood?: 1 | 2 | 3 | 4 | 5): Promise<boolean> => {
    try {
      const success = HabitService.markHabitComplete(habitId, date, count, notes, mood);
      if (success) {
        // Refresh data that might have changed
        dispatch({ type: 'SET_HABITS', payload: HabitService.getHabits() });
        dispatch({ type: 'SET_ENTRIES', payload: HabitService.getEntries() });
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: HabitService.getAchievements() });
        dispatch({ type: 'SET_INSIGHTS', payload: HabitService.getInsights() });
        
        // Update daily goal
        await updateDailyGoal();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark habit complete' });
      throw error;
    }
  }, [updateDailyGoal]);

  const markHabitIncomplete = useCallback(async (habitId: string, date: Date): Promise<boolean> => {
    try {
      const success = HabitService.markHabitIncomplete(habitId, date);
      if (success) {
        // Refresh data that might have changed
        dispatch({ type: 'SET_HABITS', payload: HabitService.getHabits() });
        dispatch({ type: 'SET_ENTRIES', payload: HabitService.getEntries() });
        
        // Update daily goal
        await updateDailyGoal();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark habit incomplete' });
      throw error;
    }
  }, [updateDailyGoal]);

  // Category actions
  const addCategory = useCallback(async (categoryData: Omit<HabitCategory, 'id' | 'habitCount' | 'createdAt'>): Promise<string> => {
    try {
      const newCategory: HabitCategory = {
        ...categoryData,
        id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        habitCount: 0,
        createdAt: new Date().toISOString(),
      };
      
      const id = HabitService.addCategory(newCategory);
      dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
      return id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add category' });
      throw error;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, updates: Partial<HabitCategory>): Promise<boolean> => {
    try {
      const success = HabitService.updateCategory(id, updates);
      if (success) {
        dispatch({ type: 'UPDATE_CATEGORY', payload: { id, updates } });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update category' });
      throw error;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = HabitService.deleteCategory(id);
      if (success) {
        dispatch({ type: 'DELETE_CATEGORY', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete category' });
      throw error;
    }
  }, []);

  // Reminder actions
  const addReminder = useCallback(async (reminderData: Omit<HabitReminder, 'id'>): Promise<string> => {
    try {
      const id = HabitService.addReminder(reminderData);
      const newReminder = { ...reminderData, id };
      dispatch({ type: 'ADD_REMINDER', payload: newReminder });
      return id;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add reminder' });
      throw error;
    }
  }, []);

  const updateReminder = useCallback(async (id: string, updates: Partial<HabitReminder>): Promise<boolean> => {
    try {
      const success = HabitService.updateReminder(id, updates);
      if (success) {
        dispatch({ type: 'UPDATE_REMINDER', payload: { id, updates } });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update reminder' });
      throw error;
    }
  }, []);

  const deleteReminder = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = HabitService.deleteReminder(id);
      if (success) {
        dispatch({ type: 'DELETE_REMINDER', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete reminder' });
      throw error;
    }
  }, []);

  // Settings actions
  const updateSettings = useCallback(async (settings: UserSettings): Promise<void> => {
    try {
      HabitService.updateSettings(settings);
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update settings' });
      throw error;
    }
  }, []);

  // Insight actions
  const markInsightAsRead = useCallback(async (id: string): Promise<boolean> => {
    try {
      const success = HabitService.markInsightAsRead(id);
      if (success) {
        dispatch({ type: 'MARK_INSIGHT_READ', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to mark insight as read' });
      throw error;
    }
  }, []);

  // Filter and search actions
  const setSelectedDate = useCallback((date: Date) => {
    dispatch({ type: 'SET_SELECTED_DATE', payload: date });
  }, []);

  const setFilter = useCallback((filter: HabitFilterType) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  }, []);

  const setSortBy = useCallback((sort: HabitSortType) => {
    dispatch({ type: 'SET_SORT', payload: sort });
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  }, []);

  // Data actions
  const refreshData = useCallback(async () => {
    await loadInitialData();
  }, [loadInitialData]);

  const exportData = useCallback((): string => {
    return HabitService.exportData();
  }, []);

  const importData = useCallback(async (jsonData: string): Promise<boolean> => {
    try {
      const success = HabitService.importData(jsonData);
      if (success) {
        await loadInitialData();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import data' });
      throw error;
    }
  }, [loadInitialData]);

  const clearAllData = useCallback(async () => {
    try {
      HabitService.clearAllData();
      await loadInitialData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear data' });
      throw error;
    }
  }, [loadInitialData]);

  // Utility functions
  const getHabitStats = useCallback((habitId: string): HabitStats | null => {
    return HabitService.getHabitStats(habitId);
  }, []);

  const getOverallStats = useCallback(() => {
    return HabitService.getOverallStats();
  }, []);

  const getFilteredHabits = useCallback((): Habit[] => {
    let filtered = [...state.habits];

    // Apply search filter
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(habit =>
        habit.name.toLowerCase().includes(query) ||
        habit.description?.toLowerCase().includes(query) ||
        habit.category.toLowerCase().includes(query) ||
        habit.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category/status filter
    switch (state.filter) {
      case 'active':
        filtered = filtered.filter(habit => habit.isActive);
        break;
      case 'completed_today':
        const todaysEntries = state.entries.filter(entry => 
          entry.date === state.selectedDate.toISOString().split('T')[0] && entry.completed
        );
        const completedHabitIds = new Set(todaysEntries.map(entry => entry.habitId));
        filtered = filtered.filter(habit => completedHabitIds.has(habit.id));
        break;
      case 'pending_today':
        const completedToday = state.entries.filter(entry => 
          entry.date === state.selectedDate.toISOString().split('T')[0] && entry.completed
        );
        const completedTodayIds = new Set(completedToday.map(entry => entry.habitId));
        filtered = filtered.filter(habit => 
          habit.isActive && 
          habit.frequency === 'daily' && 
          !completedTodayIds.has(habit.id)
        );
        break;
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created_date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'streak':
          return b.streak - a.streak;
        case 'completion_rate':
          const aStats = getHabitStats(a.id);
          const bStats = getHabitStats(b.id);
          return (bStats?.completionRate || 0) - (aStats?.completionRate || 0);
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    return filtered;
  }, [state.habits, state.entries, state.selectedDate, state.filter, state.sortBy, state.searchQuery, getHabitStats]);

  const getTodaysEntries = useCallback((): HabitEntry[] => {
    const today = state.selectedDate.toISOString().split('T')[0];
    return state.entries.filter(entry => entry.date === today);
  }, [state.entries, state.selectedDate]);

  const getUnreadInsights = useCallback((): HabitInsight[] => {
    return state.insights.filter(insight => !insight.isRead);
  }, [state.insights]);

  const value: HabitContextValue = {
    ...state,
    addHabit,
    updateHabit,
    deleteHabit,
    markHabitComplete,
    markHabitIncomplete,
    addCategory,
    updateCategory,
    deleteCategory,
    addReminder,
    updateReminder,
    deleteReminder,
    updateSettings,
    markInsightAsRead,
    setSelectedDate,
    setFilter,
    setSortBy,
    setSearchQuery,
    refreshData,
    exportData,
    importData,
    clearAllData,
    getHabitStats,
    getOverallStats,
    getFilteredHabits,
    getTodaysEntries,
    getUnreadInsights,
  };

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit(): HabitContextValue {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabit must be used within a HabitProvider');
  }
  return context;
}

export default HabitContext; 