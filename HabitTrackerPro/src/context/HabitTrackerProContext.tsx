import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit, HabitProgress, Achievement, UserProfile, Reminder, Streak } from '../types';

interface HabitTrackerProState {
  habits: Habit[];
  progress: HabitProgress[];
  achievements: Achievement[];
  userProfile: UserProfile;
  reminders: Reminder[];
  streaks: Streak[];
  isLoading: boolean;
  error: string | null;
}

type HabitTrackerProAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_HABITS'; payload: Habit[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'SET_PROGRESS'; payload: HabitProgress[] }
  | { type: 'ADD_PROGRESS'; payload: HabitProgress }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_REMINDERS'; payload: Reminder[] }
  | { type: 'ADD_REMINDER'; payload: Reminder }
  | { type: 'UPDATE_REMINDER'; payload: Reminder }
  | { type: 'DELETE_REMINDER'; payload: string }
  | { type: 'SET_STREAKS'; payload: Streak[] }
  | { type: 'UPDATE_STREAK'; payload: Streak };

const initialState: HabitTrackerProState = {
  habits: [],
  progress: [],
  achievements: [],
  userProfile: {
    id: '1',
    name: 'User',
    email: 'user@example.com',
    avatar: null,
    joinDate: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true,
      reminderTime: '09:00',
      weeklyGoal: 5,
    },
    stats: {
      totalHabits: 0,
      completedToday: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalCompletions: 0,
    },
  },
  reminders: [],
  streaks: [],
  isLoading: false,
  error: null,
};

function habitTrackerProReducer(state: HabitTrackerProState, action: HabitTrackerProAction): HabitTrackerProState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_HABITS':
      return { ...state, habits: action.payload };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'UPDATE_HABIT':
      return {
        ...state,
        habits: state.habits.map(habit =>
          habit.id === action.payload.id ? action.payload : habit
        ),
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter(habit => habit.id !== action.payload),
        progress: state.progress.filter(p => p.habitId !== action.payload),
      };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'ADD_PROGRESS':
      return { ...state, progress: [...state.progress, action.payload] };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.some(a => a.id === action.payload.id)
          ? state.achievements
          : [...state.achievements, action.payload],
      };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };
    case 'SET_REMINDERS':
      return { ...state, reminders: action.payload };
    case 'ADD_REMINDER':
      return { ...state, reminders: [...state.reminders, action.payload] };
    case 'UPDATE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map(reminder =>
          reminder.id === action.payload.id ? action.payload : reminder
        ),
      };
    case 'DELETE_REMINDER':
      return {
        ...state,
        reminders: state.reminders.filter(reminder => reminder.id !== action.payload),
      };
    case 'SET_STREAKS':
      return { ...state, streaks: action.payload };
    case 'UPDATE_STREAK':
      return {
        ...state,
        streaks: state.streaks.map(streak =>
          streak.habitId === action.payload.habitId ? action.payload : streak
        ),
      };
    default:
      return state;
  }
}

interface HabitTrackerProContextType {
  state: HabitTrackerProState;
  dispatch: React.Dispatch<HabitTrackerProAction>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
  updateHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  completeHabit: (habitId: string, date: string) => void;
  uncompleteHabit: (habitId: string, date: string) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (reminderId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  getHabitProgress: (habitId: string, startDate: string, endDate: string) => HabitProgress[];
  getStreak: (habitId: string) => Streak | undefined;
  calculateStats: () => void;
}

const HabitTrackerProContext = createContext<HabitTrackerProContextType | undefined>(undefined);

export function HabitTrackerProProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(habitTrackerProReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage when state changes
  useEffect(() => {
    saveData();
  }, [state]);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [habitsData, progressData, achievementsData, userProfileData, remindersData, streaksData] = await Promise.all([
        AsyncStorage.getItem('habits'),
        AsyncStorage.getItem('progress'),
        AsyncStorage.getItem('achievements'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('reminders'),
        AsyncStorage.getItem('streaks'),
      ]);

      if (habitsData) {
        dispatch({ type: 'SET_HABITS', payload: JSON.parse(habitsData) });
      }
      if (progressData) {
        dispatch({ type: 'SET_PROGRESS', payload: JSON.parse(progressData) });
      }
      if (achievementsData) {
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: JSON.parse(achievementsData) });
      }
      if (userProfileData) {
        dispatch({ type: 'SET_USER_PROFILE', payload: JSON.parse(userProfileData) });
      }
      if (remindersData) {
        dispatch({ type: 'SET_REMINDERS', payload: JSON.parse(remindersData) });
      }
      if (streaksData) {
        dispatch({ type: 'SET_STREAKS', payload: JSON.parse(streaksData) });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('habits', JSON.stringify(state.habits)),
        AsyncStorage.setItem('progress', JSON.stringify(state.progress)),
        AsyncStorage.setItem('achievements', JSON.stringify(state.achievements)),
        AsyncStorage.setItem('userProfile', JSON.stringify(state.userProfile)),
        AsyncStorage.setItem('reminders', JSON.stringify(state.reminders)),
        AsyncStorage.setItem('streaks', JSON.stringify(state.streaks)),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save data' });
    }
  };

  const addHabit = (habitData: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_HABIT', payload: newHabit });
  };

  const updateHabit = (habit: Habit) => {
    dispatch({ type: 'UPDATE_HABIT', payload: habit });
  };

  const deleteHabit = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const completeHabit = (habitId: string, date: string) => {
    const progress: HabitProgress = {
      id: Date.now().toString(),
      habitId,
      date,
      completed: true,
      notes: '',
      mood: 'good',
    };
    dispatch({ type: 'ADD_PROGRESS', payload: progress });
    calculateStats();
  };

  const uncompleteHabit = (habitId: string, date: string) => {
    const newProgress = state.progress.filter(
      p => !(p.habitId === habitId && p.date === date)
    );
    dispatch({ type: 'SET_PROGRESS', payload: newProgress });
    calculateStats();
  };

  const addReminder = (reminderData: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminderData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_REMINDER', payload: newReminder });
  };

  const updateReminder = (reminder: Reminder) => {
    dispatch({ type: 'UPDATE_REMINDER', payload: reminder });
  };

  const deleteReminder = (reminderId: string) => {
    dispatch({ type: 'DELETE_REMINDER', payload: reminderId });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: profile });
  };

  const getHabitProgress = (habitId: string, startDate: string, endDate: string): HabitProgress[] => {
    return state.progress.filter(
      p => p.habitId === habitId && p.date >= startDate && p.date <= endDate
    );
  };

  const getStreak = (habitId: string): Streak | undefined => {
    return state.streaks.find(s => s.habitId === habitId);
  };

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = state.progress.filter(
      p => p.date === today && p.completed
    ).length;

    const totalCompletions = state.progress.filter(p => p.completed).length;
    const totalHabits = state.habits.length;

    // Calculate current streak (simplified)
    let currentStreak = 0;
    let longestStreak = 0;

    updateUserProfile({
      stats: {
        totalHabits,
        completedToday,
        currentStreak,
        longestStreak,
        totalCompletions,
      },
    });
  };

  const value: HabitTrackerProContextType = {
    state,
    dispatch,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    addReminder,
    updateReminder,
    deleteReminder,
    updateUserProfile,
    getHabitProgress,
    getStreak,
    calculateStats,
  };

  return (
    <HabitTrackerProContext.Provider value={value}>
      {children}
    </HabitTrackerProContext.Provider>
  );
}

export function useHabitTrackerPro() {
  const context = useContext(HabitTrackerProContext);
  if (context === undefined) {
    throw new Error('useHabitTrackerPro must be used within a HabitTrackerProProvider');
  }
  return context;
} 