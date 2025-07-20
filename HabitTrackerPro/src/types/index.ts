export interface Habit {
  id: string;
  name: string;
  description: string;
  category: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  targetCount: number;
  currentCount: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  color: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  reminderTime?: string;
  reminderDays: number[];
  notes: string;
}

export interface HabitProgress {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  count: number;
  notes: string;
  mood: 'terrible' | 'bad' | 'okay' | 'good' | 'excellent';
  timeSpent?: number; // in minutes
  location?: string;
  weather?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'completion' | 'milestone' | 'special';
  requirement: {
    type: 'streak' | 'completions' | 'perfect_week' | 'perfect_month';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  joinDate: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    reminderTime: string;
    weeklyGoal: number;
    language: string;
    timezone: string;
  };
  stats: {
    totalHabits: number;
    completedToday: number;
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    perfectWeeks: number;
    perfectMonths: number;
  };
}

export interface Reminder {
  id: string;
  habitId: string;
  title: string;
  message: string;
  time: string;
  days: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Streak {
  id: string;
  habitId: string;
  currentStreak: number;
  longestStreak: number;
  startDate: string;
  lastCompletedDate: string;
  totalCompletions: number;
  perfectWeeks: number;
  perfectMonths: number;
}

export interface HabitCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
  habitCount: number;
}

export interface HabitStats {
  totalHabits: number;
  activeHabits: number;
  completedToday: number;
  weeklyCompletionRate: number;
  monthlyCompletionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  averageMood: number;
  mostProductiveDay: string;
  mostProductiveTime: string;
}

export interface WeeklyProgress {
  weekStart: string;
  weekEnd: string;
  habits: {
    habitId: string;
    habitName: string;
    completedDays: number;
    totalDays: number;
    completionRate: number;
  }[];
  totalCompletions: number;
  averageMood: number;
}

export interface MonthlyProgress {
  month: string;
  year: number;
  habits: {
    habitId: string;
    habitName: string;
    completedDays: number;
    totalDays: number;
    completionRate: number;
  }[];
  totalCompletions: number;
  averageMood: number;
  perfectDays: number;
}

export interface HabitAnalytics {
  completionTrend: {
    date: string;
    completed: number;
    total: number;
  }[];
  moodTrend: {
    date: string;
    averageMood: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
    completionRate: number;
  }[];
  timeOfDayAnalysis: {
    hour: number;
    completions: number;
  }[];
  weeklyPattern: {
    day: string;
    completions: number;
  }[];
}

export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string;
  reminderDays: number[];
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

export interface ExportData {
  habits: Habit[];
  progress: HabitProgress[];
  achievements: Achievement[];
  userProfile: UserProfile;
  reminders: Reminder[];
  streaks: Streak[];
  exportDate: string;
  version: string;
}

export interface ImportData {
  data: ExportData;
  importDate: string;
  conflicts: {
    type: 'habit' | 'progress' | 'achievement';
    id: string;
    action: 'skip' | 'replace' | 'merge';
  }[];
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  cloudBackup: boolean;
  lastBackupDate?: string;
  backupLocation: 'local' | 'cloud' | 'both';
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  backup: BackupSettings;
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
  about: {
    version: string;
    buildNumber: string;
    lastUpdated: string;
  };
} 