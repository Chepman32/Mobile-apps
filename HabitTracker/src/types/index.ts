export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  color: string;
  icon: string;
  frequency: HabitFrequency;
  targetCount: number; // How many times per frequency period
  reminderTime?: string; // HH:MM format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  streak: number;
  bestStreak: number;
  totalCompletions: number;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  notes?: string;
}

export interface HabitEntry {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  count: number; // How many times completed that day
  notes?: string;
  mood?: 1 | 2 | 3 | 4 | 5; // 1=terrible, 5=excellent
  createdAt: string;
  updatedAt: string;
}

export interface HabitCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  habitCount: number;
  createdAt: string;
  isDefault: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: AchievementType;
  requirement: number;
  unlockedAt?: string;
  habitId?: string; // For habit-specific achievements
}

export interface HabitTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: HabitFrequency;
  targetCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
  color: string;
  tags: string[];
  isPopular: boolean;
}

export interface DailyGoal {
  id: string;
  date: string; // YYYY-MM-DD
  targetHabits: number;
  completedHabits: number;
  isAchieved: boolean;
  createdAt: string;
}

export interface WeeklyReview {
  id: string;
  weekStart: string; // YYYY-MM-DD (Monday)
  weekEnd: string; // YYYY-MM-DD (Sunday)
  totalHabits: number;
  completedHabits: number;
  completionRate: number;
  bestDay: string;
  worstDay: string;
  improvements: string[];
  celebrations: string[];
  nextWeekGoals: string[];
  createdAt: string;
}

export interface HabitReminder {
  id: string;
  habitId: string;
  time: string; // HH:MM
  message: string;
  isActive: boolean;
  daysOfWeek: number[]; // 0=Sunday, 1=Monday, etc.
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface UserSettings {
  id: string;
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  dailyReminderTime: string; // HH:MM
  weeklyReviewDay: number; // 0=Sunday, 1=Monday, etc.
  firstDayOfWeek: number; // 0=Sunday, 1=Monday
  defaultHabitFrequency: HabitFrequency;
  motivationalQuotes: boolean;
  streakFreezeEnabled: boolean; // Allow missing one day without breaking streak
  dataBackupEnabled: boolean;
  language: string;
  updatedAt: string;
}

export interface MotivationalQuote {
  id: string;
  text: string;
  author: string;
  category: string;
  isLiked: boolean;
}

export interface HabitStats {
  habitId: string;
  totalEntries: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  averagePerWeek: number;
  averagePerMonth: number;
  bestMonth: string;
  worstMonth: string;
  consistency: number; // 0-100 score
  momentum: 'increasing' | 'decreasing' | 'stable';
  lastCompleted?: string;
}

export interface MonthlyProgress {
  month: string; // YYYY-MM
  habits: {
    habitId: string;
    completedDays: number;
    targetDays: number;
    completionRate: number;
    streak: number;
  }[];
  totalCompletions: number;
  averageCompletionRate: number;
  bestHabit: string;
  strugglingHabit: string;
}

export interface HabitInsight {
  id: string;
  type: 'tip' | 'warning' | 'celebration' | 'suggestion';
  title: string;
  message: string;
  habitId?: string;
  actionable: boolean;
  action?: string;
  createdAt: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

// Enums and Types
export type HabitFrequency = 
  | 'daily' 
  | 'weekly' 
  | 'monthly' 
  | 'custom';

export type AchievementType = 
  | 'streak' 
  | 'completion' 
  | 'consistency' 
  | 'milestone' 
  | 'special';

export type HabitFilterType = 
  | 'all' 
  | 'active' 
  | 'completed_today' 
  | 'pending_today' 
  | 'category' 
  | 'difficulty';

export type HabitSortType = 
  | 'name' 
  | 'created_date' 
  | 'streak' 
  | 'completion_rate' 
  | 'difficulty' 
  | 'category';

export type AnalyticsPeriod = 
  | 'week' 
  | 'month' 
  | 'quarter' 
  | 'year' 
  | 'all_time';

export type ChartType = 
  | 'completion_rate' 
  | 'streak_timeline' 
  | 'category_breakdown' 
  | 'weekly_consistency' 
  | 'monthly_progress' 
  | 'habit_performance';

// Default categories
export const DEFAULT_HABIT_CATEGORIES: Omit<HabitCategory, 'id' | 'habitCount' | 'createdAt'>[] = [
  { name: 'Health & Fitness', description: 'Physical wellness and exercise', color: '#4CAF50', icon: 'heart', isDefault: true },
  { name: 'Productivity', description: 'Work and efficiency habits', color: '#2196F3', icon: 'rocket', isDefault: true },
  { name: 'Learning', description: 'Education and skill development', color: '#FF9800', icon: 'book', isDefault: true },
  { name: 'Mindfulness', description: 'Mental health and meditation', color: '#9C27B0', icon: 'meditation', isDefault: true },
  { name: 'Social', description: 'Relationships and communication', color: '#E91E63', icon: 'account-group', isDefault: true },
  { name: 'Creative', description: 'Art, music, and creative pursuits', color: '#8BC34A', icon: 'palette', isDefault: true },
  { name: 'Finance', description: 'Money management and savings', color: '#FFC107', icon: 'currency-usd', isDefault: true },
  { name: 'Home & Life', description: 'Household and personal care', color: '#795548', icon: 'home', isDefault: true },
  { name: 'Technology', description: 'Digital habits and screen time', color: '#607D8B', icon: 'laptop', isDefault: true },
  { name: 'Environment', description: 'Eco-friendly and sustainable habits', color: '#4CAF50', icon: 'earth', isDefault: true },
];

// Popular habit templates
export const HABIT_TEMPLATES: Omit<HabitTemplate, 'id'>[] = [
  { name: 'Drink 8 Glasses of Water', description: 'Stay hydrated throughout the day', category: 'Health & Fitness', frequency: 'daily', targetCount: 8, difficulty: 'easy', icon: 'water', color: '#2196F3', tags: ['health', 'hydration'], isPopular: true },
  { name: 'Morning Exercise', description: '30 minutes of physical activity', category: 'Health & Fitness', frequency: 'daily', targetCount: 1, difficulty: 'medium', icon: 'dumbbell', color: '#4CAF50', tags: ['fitness', 'morning'], isPopular: true },
  { name: 'Read 10 Pages', description: 'Daily reading habit', category: 'Learning', frequency: 'daily', targetCount: 10, difficulty: 'easy', icon: 'book-open', color: '#FF9800', tags: ['reading', 'learning'], isPopular: true },
  { name: 'Meditate', description: '10 minutes of mindfulness', category: 'Mindfulness', frequency: 'daily', targetCount: 1, difficulty: 'easy', icon: 'meditation', color: '#9C27B0', tags: ['meditation', 'mental-health'], isPopular: true },
  { name: 'Practice Gratitude', description: 'Write 3 things you\'re grateful for', category: 'Mindfulness', frequency: 'daily', targetCount: 3, difficulty: 'easy', icon: 'heart', color: '#E91E63', tags: ['gratitude', 'journaling'], isPopular: true },
  { name: 'Learn New Words', description: 'Study 5 vocabulary words', category: 'Learning', frequency: 'daily', targetCount: 5, difficulty: 'medium', icon: 'alphabetical', color: '#FF9800', tags: ['vocabulary', 'language'], isPopular: true },
  { name: 'Call Family/Friends', description: 'Stay connected with loved ones', category: 'Social', frequency: 'weekly', targetCount: 3, difficulty: 'easy', icon: 'phone', color: '#E91E63', tags: ['family', 'social'], isPopular: true },
  { name: 'Save Money', description: 'Put aside money for savings', category: 'Finance', frequency: 'daily', targetCount: 1, difficulty: 'medium', icon: 'piggy-bank', color: '#FFC107', tags: ['money', 'savings'], isPopular: true },
  { name: 'Take Vitamins', description: 'Daily vitamin supplements', category: 'Health & Fitness', frequency: 'daily', targetCount: 1, difficulty: 'easy', icon: 'pill', color: '#4CAF50', tags: ['health', 'supplements'], isPopular: true },
  { name: 'Practice Instrument', description: '30 minutes of music practice', category: 'Creative', frequency: 'daily', targetCount: 1, difficulty: 'medium', icon: 'music', color: '#8BC34A', tags: ['music', 'practice'], isPopular: true },
]; 