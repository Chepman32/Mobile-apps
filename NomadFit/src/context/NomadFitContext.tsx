import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import NomadFitService from '../services/NomadFitService';
import {
  NomadFitContextType,
  User,
  FitnessGoal,
  UserPreferences,
  Workout,
  Exercise,
  ExerciseSet,
  WorkoutTemplate,
  Progress,
  Achievement,
  WorkoutStats,
  ChartData
} from '../types';

interface NomadFitState {
  user: User | null;
  workouts: Workout[];
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  progress: Progress[];
  achievements: Achievement[];
  stats: WorkoutStats;
  currentWorkout: Workout | null;
  loading: boolean;
  error: string | null;
}

type NomadFitAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_WORKOUTS'; payload: Workout[] }
  | { type: 'SET_EXERCISES'; payload: Exercise[] }
  | { type: 'SET_TEMPLATES'; payload: WorkoutTemplate[] }
  | { type: 'SET_PROGRESS'; payload: Progress[] }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'SET_STATS'; payload: WorkoutStats }
  | { type: 'SET_CURRENT_WORKOUT'; payload: Workout | null }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'UPDATE_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_EXERCISE'; payload: Exercise }
  | { type: 'UPDATE_EXERCISE'; payload: Exercise }
  | { type: 'DELETE_EXERCISE'; payload: string }
  | { type: 'ADD_TEMPLATE'; payload: WorkoutTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: WorkoutTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'ADD_PROGRESS'; payload: Progress }
  | { type: 'UPDATE_PROGRESS'; payload: Progress }
  | { type: 'DELETE_PROGRESS'; payload: string }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement };

const initialState: NomadFitState = {
  user: null,
  workouts: [],
  exercises: [],
  templates: [],
  progress: [],
  achievements: [],
  stats: {
    totalWorkouts: 0,
    totalDuration: 0,
    totalCaloriesBurned: 0,
    averageWorkoutDuration: 0,
    currentStreak: 0,
    longestStreak: 0,
    favoriteWorkoutType: 'strength_training',
    weeklyGoalProgress: 0,
    monthlyGoalProgress: 0,
    achievements: []
  },
  currentWorkout: null,
  loading: false,
  error: null
};

function nomadFitReducer(state: NomadFitState, action: NomadFitAction): NomadFitState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_WORKOUTS':
      return { ...state, workouts: action.payload };
    case 'SET_EXERCISES':
      return { ...state, exercises: action.payload };
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_CURRENT_WORKOUT':
      return { ...state, currentWorkout: action.payload };
    case 'ADD_WORKOUT':
      return { ...state, workouts: [action.payload, ...state.workouts] };
    case 'UPDATE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.map(w => w.id === action.payload.id ? action.payload : w)
      };
    case 'DELETE_WORKOUT':
      return {
        ...state,
        workouts: state.workouts.filter(w => w.id !== action.payload)
      };
    case 'ADD_EXERCISE':
      return { ...state, exercises: [...state.exercises, action.payload] };
    case 'UPDATE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.map(e => e.id === action.payload.id ? action.payload : e)
      };
    case 'DELETE_EXERCISE':
      return {
        ...state,
        exercises: state.exercises.filter(e => e.id !== action.payload)
      };
    case 'ADD_TEMPLATE':
      return { ...state, templates: [...state.templates, action.payload] };
    case 'UPDATE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TEMPLATE':
      return {
        ...state,
        templates: state.templates.filter(t => t.id !== action.payload)
      };
    case 'ADD_PROGRESS':
      return { ...state, progress: [...state.progress, action.payload] };
    case 'UPDATE_PROGRESS':
      return {
        ...state,
        progress: state.progress.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROGRESS':
      return {
        ...state,
        progress: state.progress.filter(p => p.id !== action.payload)
      };
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(a => a.id === action.payload.id ? action.payload : a)
      };
    default:
      return state;
  }
}

const NomadFitContext = createContext<NomadFitContextType | undefined>(undefined);

interface NomadFitProviderProps {
  children: ReactNode;
}

export function NomadFitProvider({ children }: NomadFitProviderProps) {
  const [state, dispatch] = useReducer(nomadFitReducer, initialState);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await refreshData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to initialize app' });
      console.error('App initialization error:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const refreshData = async () => {
    try {
      const [user, workouts, exercises, templates, progress, achievements, stats] = await Promise.all([
        NomadFitService.getUser(),
        NomadFitService.getWorkouts(),
        NomadFitService.getExercises(),
        NomadFitService.getTemplates(),
        NomadFitService.getProgress(),
        NomadFitService.getAchievements(),
        NomadFitService.getWorkoutStats()
      ]);

      dispatch({ type: 'SET_USER', payload: user });
      dispatch({ type: 'SET_WORKOUTS', payload: workouts });
      dispatch({ type: 'SET_EXERCISES', payload: exercises });
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
      dispatch({ type: 'SET_PROGRESS', payload: progress });
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      console.error('Data refresh error:', error);
    }
  };

  // User Management
  const updateUser = async (updates: Partial<User>) => {
    try {
      await NomadFitService.updateUser(updates);
      const updatedUser = await NomadFitService.getUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update user' });
      console.error('Update user error:', error);
    }
  };

  const updatePreferences = async (preferences: Partial<UserPreferences>) => {
    try {
      await NomadFitService.updatePreferences(preferences);
      const updatedUser = await NomadFitService.getUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update preferences' });
      console.error('Update preferences error:', error);
    }
  };

  const addGoal = async (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => {
    try {
      await NomadFitService.addGoal(goal);
      const updatedUser = await NomadFitService.getUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add goal' });
      console.error('Add goal error:', error);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<FitnessGoal>) => {
    try {
      await NomadFitService.updateGoal(goalId, updates);
      const updatedUser = await NomadFitService.getUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update goal' });
      console.error('Update goal error:', error);
    }
  };

  const completeGoal = async (goalId: string) => {
    try {
      await NomadFitService.completeGoal(goalId);
      const updatedUser = await NomadFitService.getUser();
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to complete goal' });
      console.error('Complete goal error:', error);
    }
  };

  // Workout Management
  const startWorkout = async (templateId?: string) => {
    try {
      const workoutName = templateId ? 'Template Workout' : `Workout ${new Date().toLocaleDateString()}`;
      const newWorkout = await NomadFitService.createWorkout({
        name: workoutName,
        type: 'strength_training',
        duration: 0,
        exercises: [],
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
        isCompleted: false
      });

      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: newWorkout });
      dispatch({ type: 'ADD_WORKOUT', payload: newWorkout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to start workout' });
      console.error('Start workout error:', error);
    }
  };

  const endWorkout = async () => {
    try {
      if (!state.currentWorkout) return;

      const endTime = new Date().toISOString();
      const startTime = new Date(state.currentWorkout.startTime || Date.now());
      const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000); // in minutes

      const updatedWorkout = {
        ...state.currentWorkout,
        endTime,
        duration,
        isCompleted: true
      };

      await NomadFitService.updateWorkout(state.currentWorkout.id, updatedWorkout);
      
      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: null });
      dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
      await refreshStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to end workout' });
      console.error('End workout error:', error);
    }
  };

  const addExerciseToWorkout = async (exerciseId: string) => {
    try {
      if (!state.currentWorkout) return;

      const exercise = state.exercises.find(e => e.id === exerciseId);
      if (!exercise) return;

      const updatedWorkout = {
        ...state.currentWorkout,
        exercises: [...state.currentWorkout.exercises, exercise]
      };

      await NomadFitService.updateWorkout(state.currentWorkout.id, updatedWorkout);
      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: updatedWorkout });
      dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add exercise to workout' });
      console.error('Add exercise to workout error:', error);
    }
  };

  const addSetToExercise = async (exerciseId: string, set: Omit<ExerciseSet, 'id' | 'exerciseId' | 'workoutId' | 'createdAt'>) => {
    try {
      if (!state.currentWorkout) return;

      const newSet: ExerciseSet = {
        ...set,
        id: Date.now().toString(36) + Math.random().toString(36).substr(2),
        exerciseId,
        workoutId: state.currentWorkout.id,
        createdAt: new Date().toISOString()
      };

      // This would need to be implemented in the service layer
      // For now, we'll just update the workout
      const updatedWorkout = { ...state.currentWorkout };
      await NomadFitService.updateWorkout(state.currentWorkout.id, updatedWorkout);
      
      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: updatedWorkout });
      dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add set' });
      console.error('Add set error:', error);
    }
  };

  const updateSet = async (setId: string, updates: Partial<ExerciseSet>) => {
    try {
      // This would need to be implemented in the service layer
      await refreshData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update set' });
      console.error('Update set error:', error);
    }
  };

  const deleteSet = async (setId: string) => {
    try {
      // This would need to be implemented in the service layer
      await refreshData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete set' });
      console.error('Delete set error:', error);
    }
  };

  const saveWorkout = async (workout: Partial<Workout>) => {
    try {
      if (!state.currentWorkout) return;

      const updatedWorkout = { ...state.currentWorkout, ...workout };
      await NomadFitService.updateWorkout(state.currentWorkout.id, updatedWorkout);
      
      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: updatedWorkout });
      dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save workout' });
      console.error('Save workout error:', error);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    try {
      await NomadFitService.deleteWorkout(workoutId);
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
      await refreshStats();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete workout' });
      console.error('Delete workout error:', error);
    }
  };

  const getWorkoutHistory = async (limit?: number) => {
    try {
      return await NomadFitService.getWorkouts(limit);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get workout history' });
      console.error('Get workout history error:', error);
      return [];
    }
  };

  // Exercise Management
  const addExercise = async (exercise: Omit<Exercise, 'id' | 'createdAt'>) => {
    try {
      await NomadFitService.addExercise(exercise);
      const exercises = await NomadFitService.getExercises();
      dispatch({ type: 'SET_EXERCISES', payload: exercises });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add exercise' });
      console.error('Add exercise error:', error);
    }
  };

  const updateExercise = async (exerciseId: string, updates: Partial<Exercise>) => {
    try {
      await NomadFitService.updateExercise(exerciseId, updates);
      const exercises = await NomadFitService.getExercises();
      dispatch({ type: 'SET_EXERCISES', payload: exercises });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update exercise' });
      console.error('Update exercise error:', error);
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    try {
      await NomadFitService.deleteExercise(exerciseId);
      dispatch({ type: 'DELETE_EXERCISE', payload: exerciseId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete exercise' });
      console.error('Delete exercise error:', error);
    }
  };

  const getExercisesByCategory = (category: Exercise['category']) => {
    return state.exercises.filter(exercise => exercise.category === category);
  };

  const searchExercises = (query: string) => {
    const lowerQuery = query.toLowerCase();
    return state.exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(lowerQuery) ||
      exercise.muscleGroups.some(group => group.toLowerCase().includes(lowerQuery))
    );
  };

  // Template Management
  const createTemplate = async (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await NomadFitService.createTemplate(template);
      const templates = await NomadFitService.getTemplates();
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create template' });
      console.error('Create template error:', error);
    }
  };

  const updateTemplate = async (templateId: string, updates: Partial<WorkoutTemplate>) => {
    try {
      await NomadFitService.updateTemplate(templateId, updates);
      const templates = await NomadFitService.getTemplates();
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update template' });
      console.error('Update template error:', error);
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      await NomadFitService.deleteTemplate(templateId);
      dispatch({ type: 'DELETE_TEMPLATE', payload: templateId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete template' });
      console.error('Delete template error:', error);
    }
  };

  const getTemplatesByType = (type: Workout['type']) => {
    return state.templates.filter(template => template.type === type);
  };

  // Progress Tracking
  const addProgress = async (progress: Omit<Progress, 'id' | 'createdAt'>) => {
    try {
      await NomadFitService.addProgress(progress);
      const progressList = await NomadFitService.getProgress();
      dispatch({ type: 'SET_PROGRESS', payload: progressList });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add progress' });
      console.error('Add progress error:', error);
    }
  };

  const updateProgress = async (progressId: string, updates: Partial<Progress>) => {
    try {
      await NomadFitService.updateProgress(progressId, updates);
      const progressList = await NomadFitService.getProgress();
      dispatch({ type: 'SET_PROGRESS', payload: progressList });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update progress' });
      console.error('Update progress error:', error);
    }
  };

  const deleteProgress = async (progressId: string) => {
    try {
      await NomadFitService.deleteProgress(progressId);
      dispatch({ type: 'DELETE_PROGRESS', payload: progressId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete progress' });
      console.error('Delete progress error:', error);
    }
  };

  const getProgressByType = (type: Progress['type']) => {
    return state.progress.filter(progress => progress.type === type);
  };

  const getProgressChartData = async (type: Progress['type'], days?: number) => {
    try {
      return await NomadFitService.getProgressChartData(type, days);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get progress chart data' });
      console.error('Get progress chart data error:', error);
      return { labels: [], datasets: [{ data: [] }] };
    }
  };

  // Statistics
  const refreshStats = async () => {
    try {
      const stats = await NomadFitService.getWorkoutStats();
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh stats' });
      console.error('Refresh stats error:', error);
    }
  };

  const getWorkoutStats = () => {
    return state.stats;
  };

  const getAchievements = () => {
    return state.achievements;
  };

  const unlockAchievement = async (achievementId: string) => {
    try {
      await NomadFitService.unlockAchievement(achievementId);
      const achievements = await NomadFitService.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to unlock achievement' });
      console.error('Unlock achievement error:', error);
    }
  };

  // Data Management
  const exportData = () => {
    return NomadFitService.exportData();
  };

  const importData = async (jsonData: string) => {
    try {
      const success = await NomadFitService.importData(jsonData);
      if (success) {
        await refreshData();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import data' });
      console.error('Import data error:', error);
      return false;
    }
  };

  const clearAllData = async () => {
    try {
      await NomadFitService.clearAllData();
      await refreshData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear data' });
      console.error('Clear data error:', error);
    }
  };

  const contextValue: NomadFitContextType = {
    // State
    user: state.user,
    workouts: state.workouts,
    exercises: state.exercises,
    templates: state.templates,
    progress: state.progress,
    achievements: state.achievements,
    stats: state.stats,
    currentWorkout: state.currentWorkout,
    loading: state.loading,
    error: state.error,

    // Actions
    updateUser,
    updatePreferences,
    addGoal,
    updateGoal,
    completeGoal,
    startWorkout,
    endWorkout,
    addExerciseToWorkout,
    addSetToExercise,
    updateSet,
    deleteSet,
    saveWorkout,
    deleteWorkout,
    getWorkoutHistory,
    addExercise,
    updateExercise,
    deleteExercise,
    getExercisesByCategory,
    searchExercises,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByType,
    addProgress,
    updateProgress,
    deleteProgress,
    getProgressByType,
    getProgressChartData,
    refreshStats,
    getWorkoutStats,
    getAchievements,
    unlockAchievement,
    exportData,
    importData,
    clearAllData,
    refreshData
  };

  return (
    <NomadFitContext.Provider value={contextValue}>
      {children}
    </NomadFitContext.Provider>
  );
}

export function useNomadFit(): NomadFitContextType {
  const context = useContext(NomadFitContext);
  if (context === undefined) {
    throw new Error('useNomadFit must be used within a NomadFitProvider');
  }
  return context;
} 