// Navigation Types
export type RootStackParamList = {
  MainTabs: undefined;
  HabitDetails: { habitId: string };
  AddEditHabit: { habitId?: string };
};

export type TabParamList = {
  Today: undefined;
  Habits: undefined;
  Stats: undefined;
  Profile: undefined;
};

// Data Types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  targetCount: number;
  currentStreak: number;
  longestStreak: number;
  frequency: 'daily' | 'weekly' | 'custom';
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  completionHistory: {
    date: string;
    count: number;
  }[];
  category: string;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface DailyProgress {
  date: string;
  completedHabits: string[];
  totalHabits: number;
  completionPercentage: number;
}

export interface Stats {
  currentStreak: number;
  longestStreak: number;
  totalHabits: number;
  completionRate: number;
  monthlyCompletions: { date: string; count: number }[];
  categoryDistribution: { category: string; count: number }[];
}
