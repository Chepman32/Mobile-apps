// Navigation types
export type RootStackParamList = {
  Main: undefined;
  AddWorkout: undefined;
  WorkoutDetails: { workoutId: string };
  AddExercise: { workoutId: string };
  ExerciseDetails: { exerciseId: string };
  ProgressStats: undefined;
  Settings: undefined;
};

export type TabParamList = {
  Workouts: undefined;
  Progress: undefined;
  Exercises: undefined;
  Profile: undefined;
};

// Data types
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  targetMuscles: string[];
  instructions?: string;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseSet {
  id: string;
  exerciseLogId: string;
  setNumber: number;
  reps: number;
  weight: number;
  duration?: number; // in seconds for time-based exercises
  distance?: number; // for cardio
  restTime?: number; // in seconds
  notes?: string;
  createdAt: string;
}

export interface ExerciseLog {
  id: string;
  workoutId: string;
  exerciseId: string;
  exercise: Exercise;
  sets: ExerciseSet[];
  notes?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Workout {
  id: string;
  name: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // in minutes
  exercises: ExerciseLog[];
  notes?: string;
  isTemplate: boolean;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description?: string;
  exercises: TemplateExercise[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateExercise {
  id: string;
  exerciseId: string;
  exercise: Exercise;
  targetSets: number;
  targetReps?: number;
  targetWeight?: number;
  targetDuration?: number;
  restTime?: number;
  orderIndex: number;
}

export interface ProgressEntry {
  id: string;
  exerciseId: string;
  date: string;
  maxWeight: number;
  totalVolume: number;
  personalRecord: boolean;
  notes?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age?: number;
  weight?: number;
  height?: number;
  fitnessLevel: FitnessLevel;
  goals: string[];
  preferredUnits: WeightUnit;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  totalSets: number;
  totalVolume: number;
  averageWorkoutDuration: number;
  currentStreak: number;
  longestStreak: number;
  personalRecords: number;
  lastWorkoutDate?: string;
}

// Enums
export enum ExerciseCategory {
  CHEST = 'chest',
  BACK = 'back',
  SHOULDERS = 'shoulders',
  ARMS = 'arms',
  LEGS = 'legs',
  CORE = 'core',
  CARDIO = 'cardio',
  FULL_BODY = 'full_body',
  OTHER = 'other'
}

export enum FitnessLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum WeightUnit {
  KG = 'kg',
  LBS = 'lbs'
}

// UI State types
export interface Timer {
  isActive: boolean;
  seconds: number;
  minutes: number;
  hours: number;
}

export interface FilterOptions {
  category?: ExerciseCategory;
  dateRange?: {
    start: string;
    end: string;
  };
  muscleGroups?: string[];
}

// Chart data types
export interface ChartDataPoint {
  label: string;
  value: number;
  date: string;
}

export interface ProgressChartData {
  weight: ChartDataPoint[];
  volume: ChartDataPoint[];
  reps: ChartDataPoint[];
}

// App Context types
export interface AppContextType {
  workouts: Workout[];
  exercises: Exercise[];
  templates: WorkoutTemplate[];
  userProfile: UserProfile | null;
  currentWorkout: Workout | null;
  stats: WorkoutStats;
  loading: boolean;
  error: string | null;
  
  // Actions
  startWorkout: (templateId?: string) => Promise<void>;
  endWorkout: () => Promise<void>;
  addExerciseToWorkout: (exerciseId: string) => Promise<void>;
  addSetToExercise: (exerciseLogId: string, set: Omit<ExerciseSet, 'id' | 'exerciseLogId' | 'createdAt'>) => Promise<void>;
  updateSet: (setId: string, updates: Partial<ExerciseSet>) => Promise<void>;
  deleteSet: (setId: string) => Promise<void>;
  saveWorkout: (workout: Partial<Workout>) => Promise<void>;
  deleteWorkout: (workoutId: string) => Promise<void>;
  createTemplate: (workout: Workout) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  getProgressData: (exerciseId: string, days?: number) => Promise<ProgressChartData>;
  refreshData: () => Promise<void>;
}