// NomadFit - Fitness Tracking App Types

export interface User {
  id: string;
  name: string;
  email?: string;
  age?: number;
  weight?: number; // in kg
  height?: number; // in cm
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goals: FitnessGoal[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface FitnessGoal {
  id: string;
  type: 'weight_loss' | 'muscle_gain' | 'endurance' | 'strength' | 'flexibility' | 'general_fitness';
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface UserPreferences {
  workoutDuration: number; // in minutes
  workoutFrequency: number; // workouts per week
  preferredWorkoutTypes: WorkoutType[];
  notifications: NotificationSettings;
  units: 'metric' | 'imperial';
  theme: 'light' | 'dark' | 'auto';
}

export interface NotificationSettings {
  workoutReminders: boolean;
  goalUpdates: boolean;
  achievementAlerts: boolean;
  weeklyReports: boolean;
}

export interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  duration: number; // in minutes
  caloriesBurned?: number;
  exercises: Exercise[];
  notes?: string;
  date: string;
  startTime?: string;
  endTime?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type WorkoutType = 
  | 'strength_training'
  | 'cardio'
  | 'flexibility'
  | 'hiit'
  | 'yoga'
  | 'pilates'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'walking'
  | 'mixed';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  type: ExerciseType;
  muscleGroups: MuscleGroup[];
  equipment: Equipment[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string[];
  videoUrl?: string;
  imageUrl?: string;
  isCustom: boolean;
  createdBy?: string;
  createdAt: string;
}

export type ExerciseCategory = 
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'balance'
  | 'sports'
  | 'functional';

export type ExerciseType = 
  | 'bodyweight'
  | 'weighted'
  | 'cardio'
  | 'stretching'
  | 'plyometric'
  | 'isometric';

export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full_body'
  | 'core';

export type Equipment = 
  | 'none'
  | 'dumbbells'
  | 'barbell'
  | 'kettlebell'
  | 'resistance_bands'
  | 'pull_up_bar'
  | 'bench'
  | 'mat'
  | 'treadmill'
  | 'bike'
  | 'rower'
  | 'elliptical';

export interface ExerciseSet {
  id: string;
  exerciseId: string;
  workoutId: string;
  setNumber: number;
  reps?: number;
  weight?: number; // in kg
  duration?: number; // in seconds
  distance?: number; // in meters
  restTime?: number; // in seconds
  notes?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  type: WorkoutType;
  exercises: TemplateExercise[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isPublic: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateExercise {
  exerciseId: string;
  order: number;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
}

export interface Progress {
  id: string;
  userId: string;
  type: 'weight' | 'measurements' | 'strength' | 'endurance' | 'flexibility';
  value: number;
  unit: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
  createdAt: string;
}

export type AchievementType = 
  | 'workout_streak'
  | 'total_workouts'
  | 'calories_burned'
  | 'weight_lost'
  | 'strength_gain'
  | 'endurance_improvement'
  | 'goal_completion'
  | 'workout_duration'
  | 'exercise_mastery'
  | 'consistency';

export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number; // in minutes
  totalCaloriesBurned: number;
  averageWorkoutDuration: number;
  currentStreak: number;
  longestStreak: number;
  favoriteWorkoutType: WorkoutType;
  weeklyGoalProgress: number;
  monthlyGoalProgress: number;
  achievements: Achievement[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: string;
    strokeWidth?: number;
  }[];
}

export interface NavigationProps {
  navigation: any;
  route: any;
}

// Navigation Types
export type RootStackParamList = {
  Main: undefined;
  WorkoutDetails: { workoutId: string };
  AddWorkout: undefined;
  ExerciseDetails: { exerciseId: string };
  ProgressDetails: { type: string };
  Settings: undefined;
  Profile: undefined;
  Achievements: undefined;
  WorkoutHistory: undefined;
  AddExercise: undefined;
  EditExercise: { exerciseId: string };
  WorkoutTemplates: undefined;
  CreateTemplate: undefined;
  EditTemplate: { templateId: string };
};

export type TabParamList = {
  Home: undefined;
  Workouts: undefined;
  Progress: undefined;
  Profile: undefined;
};

// Context Types
export interface NomadFitContextType {
  // State
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

  // Actions
  // User Management
  updateUser: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  addGoal: (goal: Omit<FitnessGoal, 'id' | 'createdAt'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<FitnessGoal>) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;

  // Workout Management
  startWorkout: (templateId?: string) => Promise<void>;
  endWorkout: () => Promise<void>;
  addExerciseToWorkout: (exerciseId: string) => Promise<void>;
  addSetToExercise: (exerciseId: string, set: Omit<ExerciseSet, 'id' | 'exerciseId' | 'workoutId' | 'createdAt'>) => Promise<void>;
  updateSet: (setId: string, updates: Partial<ExerciseSet>) => Promise<void>;
  deleteSet: (setId: string) => Promise<void>;
  saveWorkout: (workout: Partial<Workout>) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  getWorkoutHistory: (limit?: number) => Promise<Workout[]>;

  // Exercise Management
  addExercise: (exercise: Omit<Exercise, 'id' | 'createdAt'>) => Promise<void>;
  updateExercise: (exerciseId: string, updates: Partial<Exercise>) => Promise<void>;
  deleteExercise: (exerciseId: string) => Promise<void>;
  getExercisesByCategory: (category: ExerciseCategory) => Exercise[];
  searchExercises: (query: string) => Exercise[];

  // Template Management
  createTemplate: (template: Omit<WorkoutTemplate, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTemplate: (templateId: string, updates: Partial<WorkoutTemplate>) => Promise<void>;
  deleteTemplate: (templateId: string) => Promise<void>;
  getTemplatesByType: (type: WorkoutType) => WorkoutTemplate[];

  // Progress Tracking
  addProgress: (progress: Omit<Progress, 'id' | 'createdAt'>) => Promise<void>;
  updateProgress: (progressId: string, updates: Partial<Progress>) => Promise<void>;
  deleteProgress: (progressId: string) => Promise<void>;
  getProgressByType: (type: Progress['type']) => Progress[];
  getProgressChartData: (type: Progress['type'], days?: number) => ChartData;

  // Statistics
  refreshStats: () => Promise<void>;
  getWorkoutStats: () => WorkoutStats;
  getAchievements: () => Achievement[];
  unlockAchievement: (achievementId: string) => Promise<void>;

  // Data Management
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
} 