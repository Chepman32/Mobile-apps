export interface Challenge {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  category: 'focus' | 'social' | 'gaming' | 'entertainment' | 'productivity' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  icon: string;
  color: string;
  tips: string[];
  benefits: string[];
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  challengeId: string;
  challenge: Challenge;
  startedAt: string;
  completedAt?: string;
  completed: boolean;
  duration: number; // actual duration in minutes
  notes?: string;
  interruptions: number;
  moodBefore: number; // 1-5 scale
  moodAfter: number; // 1-5 scale
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  totalSessions: number;
  totalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  averageSessionDuration: number;
  favoriteChallenges: string[];
  goals: Goal[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  targetMinutes: number;
  currentMinutes: number;
  deadline?: string;
  completed: boolean;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    sessionReminders: boolean;
    goalReminders: boolean;
    streakReminders: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    shareStats: boolean;
    shareAchievements: boolean;
  };
  sound: {
    sessionStart: boolean;
    sessionEnd: boolean;
    achievements: boolean;
  };
}

export interface Statistics {
  totalSessions: number;
  totalMinutes: number;
  averageSessionDuration: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  weeklyMinutes: { date: string; minutes: number }[];
  monthlyMinutes: { month: string; minutes: number }[];
  categoryBreakdown: { category: string; minutes: number }[];
  moodTrends: { date: string; averageMood: number }[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'duration' | 'sessions' | 'special';
  requirement: {
    type: 'sessions' | 'minutes' | 'streak' | 'custom';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface NotificationSettings {
  sessionReminders: boolean;
  goalReminders: boolean;
  streakReminders: boolean;
  weeklyReports: boolean;
  achievementNotifications: boolean;
  dailyMotivation: boolean;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
  sound: {
    sessionStart: boolean;
    sessionEnd: boolean;
    achievements: boolean;
  };
  privacy: {
    shareStats: boolean;
    shareAchievements: boolean;
  };
  dataExport: {
    lastExport: string;
    autoBackup: boolean;
  };
}

export interface Timer {
  isActive: boolean;
  isPaused: boolean;
  seconds: number;
  minutes: number;
  hours: number;
  totalSeconds: number;
  targetSeconds: number;
}

export interface SessionState {
  currentSession: Session | null;
  timer: Timer;
  isInSession: boolean;
  sessionStartTime: string | null;
  interruptions: number;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Challenge: { challengeId: string };
  Session: { sessionId: string };
  ActiveSession: { challengeId: string };
  SessionComplete: { sessionId: string };
  Settings: undefined;
  Profile: undefined;
  Statistics: undefined;
  Achievements: undefined;
  Goals: undefined;
  AddGoal: undefined;
  EditGoal: { goalId: string };
  AddChallenge: undefined;
  EditChallenge: { challengeId: string };
  History: undefined;
  SessionHistory: undefined;
  GoalDetails: { goalId: string };
  AchievementDetails: { achievementId: string };
};

export type TabParamList = {
  Home: undefined;
  Challenges: undefined;
  Sessions: undefined;
  Profile: undefined;
};
