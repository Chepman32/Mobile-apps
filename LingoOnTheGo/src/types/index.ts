export interface Phrase {
  id: string;
  text: string;
  translation: string;
  pronunciation: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  context: string;
  examples: string[];
  tags: string[];
  isFavorite: boolean;
  learned: boolean;
  reviewCount: number;
  lastReviewed: string;
  createdAt: string;
  updatedAt: string;
}

export interface Translation {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  confidence: number;
  pronunciation: string;
  alternatives: string[];
  context: string;
  tags: string[];
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: string;
  language: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  learned: boolean;
  reviewCount: number;
  lastReviewed: string;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  type: 'phrase' | 'translation' | 'vocabulary' | 'practice';
  itemId: string;
  completed: boolean;
  score: number;
  accuracy: number;
  timeSpent: number;
  date: string;
  notes: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  joinDate: string;
  preferences: {
    nativeLanguage: string;
    targetLanguage: string;
    autoTranslate: boolean;
    offlineMode: boolean;
    notifications: boolean;
    soundEnabled: boolean;
  };
  stats: {
    totalPhrases: number;
    totalTranslations: number;
    totalVocabulary: number;
    learnedWords: number;
    currentStreak: number;
    longestStreak: number;
    totalStudyTime: number;
    accuracy: number;
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'phrase' | 'translation' | 'vocabulary' | 'streak' | 'special';
  requirement: {
    type: 'phrases' | 'translations' | 'vocabulary' | 'streak' | 'accuracy' | 'time';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface HistoryEntry {
  id: string;
  type: 'phrase' | 'translation' | 'vocabulary' | 'practice';
  itemId: string;
  title: string;
  description: string;
  timestamp: string;
  data: any;
}

export interface Favorite {
  id: string;
  type: 'phrase' | 'translation' | 'vocabulary';
  itemId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface OfflineData {
  phrases: Phrase[];
  translations: Translation[];
  vocabulary: Vocabulary[];
  lastSync: string;
  version: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  context?: string;
}

export interface TranslationResponse {
  translation: Translation;
  alternatives: string[];
  confidence: number;
  pronunciation: string;
}

export interface PracticeSession {
  id: string;
  type: 'vocabulary' | 'phrases' | 'grammar';
  items: string[];
  completed: boolean;
  score: number;
  timeSpent: number;
  createdAt: string;
  completedAt?: string;
}

export interface StudySession {
  id: string;
  type: 'phrase' | 'translation' | 'vocabulary' | 'practice';
  itemId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  score?: number;
  accuracy?: number;
}

export interface PronunciationGuide {
  id: string;
  word: string;
  phonetic: string;
  audioUrl: string;
  language: string;
  examples: string[];
  tips: string[];
}

export interface GrammarRule {
  id: string;
  title: string;
  description: string;
  language: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  examples: GrammarExample[];
  exceptions: string[];
  tips: string[];
}

export interface GrammarExample {
  id: string;
  sentence: string;
  translation: string;
  explanation: string;
  highlighted: string[];
}

export interface StudyStats {
  dailyStats: {
    date: string;
    phrases: number;
    translations: number;
    vocabulary: number;
    timeSpent: number;
    accuracy: number;
  }[];
  weeklyStats: {
    weekStart: string;
    weekEnd: string;
    phrases: number;
    translations: number;
    vocabulary: number;
    timeSpent: number;
    averageAccuracy: number;
  }[];
  monthlyStats: {
    month: string;
    year: number;
    phrases: number;
    translations: number;
    vocabulary: number;
    timeSpent: number;
    averageAccuracy: number;
  }[];
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  reminderTime: string;
  weeklyReport: boolean;
  achievementAlerts: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface ExportData {
  phrases: Phrase[];
  translations: Translation[];
  vocabulary: Vocabulary[];
  progress: Progress[];
  achievements: Achievement[];
  history: HistoryEntry[];
  favorites: Favorite[];
  userProfile: UserProfile;
  exportDate: string;
  version: string;
}

export interface ImportData {
  data: ExportData;
  importDate: string;
  conflicts: {
    type: 'phrase' | 'translation' | 'vocabulary' | 'progress';
    id: string;
    action: 'skip' | 'replace' | 'merge';
  }[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  sound: {
    enabled: boolean;
    volume: number;
    pronunciationEnabled: boolean;
  };
  translation: {
    autoTranslate: boolean;
    saveHistory: boolean;
    showAlternatives: boolean;
    pronunciationEnabled: boolean;
  },
  offline: {
    enabled: boolean;
    autoSync: boolean;
    dataLimit: number;
  },
  about: {
    version: string;
    buildNumber: string;
    lastUpdated: string;
  };
} 