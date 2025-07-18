import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import DatabaseService from '../services/DatabaseService';
import {
  AppContextType,
  Workout,
  Exercise,
  WorkoutTemplate,
  UserProfile,
  WorkoutStats,
  ExerciseLog,
  ExerciseSet,
  ProgressChartData
} from '../types';

interface AppState {
  workouts: Workout[];
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  userProfile: UserProfile | null;
  currentWorkout: Workout | null;
  stats: WorkoutStats;
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_WORKOUTS'; payload: Workout[] }
  | { type: 'SET_EXERCISES'; payload: Exercise[] }
  | { type: 'SET_TEMPLATES'; payload: WorkoutTemplate[] }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'SET_CURRENT_WORKOUT'; payload: Workout | null }
  | { type: 'SET_STATS'; payload: WorkoutStats }
  | { type: 'ADD_WORKOUT'; payload: Workout }
  | { type: 'UPDATE_WORKOUT'; payload: Workout }
  | { type: 'DELETE_WORKOUT'; payload: string }
  | { type: 'ADD_EXERCISE'; payload: Exercise }
  | { type: 'UPDATE_CURRENT_WORKOUT'; payload: Partial<Workout> };

const initialState: AppState = {
  workouts: [],
  exercises: [],
  templates: [],
  userProfile: null,
  currentWorkout: null,
  stats: {
    totalWorkouts: 0,
    totalExercises: 0,
    totalSets: 0,
    totalVolume: 0,
    averageWorkoutDuration: 0,
    currentStreak: 0,
    longestStreak: 0,
    personalRecords: 0
  },
  loading: false,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_WORKOUTS':
      return { ...state, workouts: action.payload };
    case 'SET_EXERCISES':
      return { ...state, exercises: action.payload };
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'SET_CURRENT_WORKOUT':
      return { ...state, currentWorkout: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
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
    case 'UPDATE_CURRENT_WORKOUT':
      return {
        ...state,
        currentWorkout: state.currentWorkout ? { ...state.currentWorkout, ...action.payload } : null
      };
    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await DatabaseService.init();
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
      const [workouts, exercises, userProfile, stats] = await Promise.all([
        DatabaseService.getWorkouts(20), // Get last 20 workouts
        DatabaseService.getExercises(),
        DatabaseService.getUserProfile(),
        DatabaseService.getWorkoutStats()
      ]);

      dispatch({ type: 'SET_WORKOUTS', payload: workouts });
      dispatch({ type: 'SET_EXERCISES', payload: exercises });
      dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
      dispatch({ type: 'SET_STATS', payload: stats });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      console.error('Data refresh error:', error);
    }
  };

  const startWorkout = async (templateId?: string) => {
    try {
      const workoutName = templateId ? 'Template Workout' : `Workout ${new Date().toLocaleDateString()}`;
      const newWorkout = await DatabaseService.createWorkout({
        name: workoutName,
        date: new Date().toISOString().split('T')[0],
        startTime: new Date().toISOString(),
        isTemplate: false,
        templateId
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

      await DatabaseService.updateWorkout(state.currentWorkout.id, {
        endTime,
        duration
      });

      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: null });
      await refreshData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to end workout' });
      console.error('End workout error:', error);
    }
  };

  const addExerciseToWorkout = async (exerciseId: string) => {
    try {
      if (!state.currentWorkout) return;

      const orderIndex = state.currentWorkout.exercises.length;
      const exerciseLog = await DatabaseService.createExerciseLog({
        workoutId: state.currentWorkout.id,
        exerciseId,
        orderIndex
      });

      const updatedWorkout = {
        ...state.currentWorkout,
        exercises: [...state.currentWorkout.exercises, exerciseLog]
      };

      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: updatedWorkout });
      dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add exercise' });
      console.error('Add exercise error:', error);
    }
  };

  const addSetToExercise = async (
    exerciseLogId: string,
    set: Omit<ExerciseSet, 'id' | 'exerciseLogId' | 'createdAt'>
  ) => {
    try {
      if (!state.currentWorkout) return;

      const newSet = await DatabaseService.createSet({
        ...set,
        exerciseLogId
      });

      const updatedWorkout = {
        ...state.currentWorkout,
        exercises: state.currentWorkout.exercises.map(exerciseLog =>
          exerciseLog.id === exerciseLogId
            ? { ...exerciseLog, sets: [...exerciseLog.sets, newSet] }
            : exerciseLog
        )
      };

      dispatch({ type: 'SET_CURRENT_WORKOUT', payload: updatedWorkout });
      dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add set' });
      console.error('Add set error:', error);
    }
  };

  const updateSet = async (setId: string, updates: Partial<ExerciseSet>) => {
    try {
      await DatabaseService.updateSet(setId, updates);

      if (state.currentWorkout) {
        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exerciseLog => ({
            ...exerciseLog,
            sets: exerciseLog.sets.map(set =>
              set.id === setId ? { ...set, ...updates } : set
            )
          }))
        };

        dispatch({ type: 'SET_CURRENT_WORKOUT', payload: updatedWorkout });
        dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update set' });
      console.error('Update set error:', error);
    }
  };

  const deleteSet = async (setId: string) => {
    try {
      await DatabaseService.deleteSet(setId);

      if (state.currentWorkout) {
        const updatedWorkout = {
          ...state.currentWorkout,
          exercises: state.currentWorkout.exercises.map(exerciseLog => ({
            ...exerciseLog,
            sets: exerciseLog.sets.filter(set => set.id !== setId)
          }))
        };

        dispatch({ type: 'SET_CURRENT_WORKOUT', payload: updatedWorkout });
        dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete set' });
      console.error('Delete set error:', error);
    }
  };

  const saveWorkout = async (workout: Partial<Workout>) => {
    try {
      if (!workout.id) {
        // Create new workout
        const newWorkout = await DatabaseService.createWorkout({
          name: workout.name || 'New Workout',
          date: workout.date || new Date().toISOString().split('T')[0],
          isTemplate: workout.isTemplate || false,
          startTime: workout.startTime,
          endTime: workout.endTime,
          duration: workout.duration,
          notes: workout.notes,
          templateId: workout.templateId
        });
        dispatch({ type: 'ADD_WORKOUT', payload: newWorkout });
      } else {
        // Update existing workout
        await DatabaseService.updateWorkout(workout.id, workout);
        const updatedWorkout = await DatabaseService.getWorkoutById(workout.id);
        if (updatedWorkout) {
          dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });
        }
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save workout' });
      console.error('Save workout error:', error);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    try {
      await DatabaseService.deleteWorkout(workoutId);
      dispatch({ type: 'DELETE_WORKOUT', payload: workoutId });
      
      if (state.currentWorkout && state.currentWorkout.id === workoutId) {
        dispatch({ type: 'SET_CURRENT_WORKOUT', payload: null });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete workout' });
      console.error('Delete workout error:', error);
    }
  };

  const createTemplate = async (workout: Workout) => {
    try {
      // Implementation for creating workout templates
      // This would involve creating a workout_template record and template_exercises
      console.log('Creating template from workout:', workout.name);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create template' });
      console.error('Create template error:', error);
    }
  };

  const updateUserProfile = async (profile: Partial<UserProfile>) => {
    try {
      await DatabaseService.updateUserProfile(profile);
      const updatedProfile = await DatabaseService.getUserProfile();
      dispatch({ type: 'SET_USER_PROFILE', payload: updatedProfile });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update profile' });
      console.error('Update profile error:', error);
    }
  };

  const getProgressData = async (exerciseId: string, days?: number): Promise<ProgressChartData> => {
    try {
      return await DatabaseService.getProgressData(exerciseId, days);
    } catch (error) {
      console.error('Get progress data error:', error);
      return { weight: [], volume: [], reps: [] };
    }
  };

  const contextValue: AppContextType = {
    workouts: state.workouts,
    exercises: state.exercises,
    templates: state.templates,
    userProfile: state.userProfile,
    currentWorkout: state.currentWorkout,
    stats: state.stats,
    loading: state.loading,
    error: state.error,
    startWorkout,
    endWorkout,
    addExerciseToWorkout,
    addSetToExercise,
    updateSet,
    deleteSet,
    saveWorkout,
    deleteWorkout,
    createTemplate,
    updateUserProfile,
    getProgressData,
    refreshData
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}