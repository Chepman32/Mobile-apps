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

export interface DictionaryEntry {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  language: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology: string;
  frequency: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isLearned: boolean;
  reviewCount: number;
  lastReviewed: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  id: string;
  title: string;
  topic: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dialogues: Dialogue[];
  vocabulary: string[];
  grammar: string[];
  completed: boolean;
  score: number;
  timeSpent: number;
  createdAt: string;
  updatedAt: string;
}

export interface Dialogue {
  id: string;
  speaker: 'user' | 'native' | 'system';
  text: string;
  translation: string;
  audioUrl?: string;
  timestamp: number;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  language: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  learned: boolean;
  reviewCount: number;
  lastReviewed: string;
  nextReview: string;
  easeFactor: number;
  interval: number;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  type: 'translation' | 'conversation' | 'flashcard' | 'quiz';
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
    targetLanguages: string[];
    autoTranslate: boolean;
    offlineMode: boolean;
    notifications: boolean;
    soundEnabled: boolean;
  };
  stats: {
    totalTranslations: number;
    totalConversations: number;
    totalFlashcards: number;
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
  category: 'translation' | 'conversation' | 'flashcard' | 'streak' | 'special';
  requirement: {
    type: 'translations' | 'conversations' | 'flashcards' | 'streak' | 'accuracy' | 'time';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface HistoryEntry {
  id: string;
  type: 'translation' | 'conversation' | 'dictionary' | 'flashcard';
  itemId: string;
  title: string;
  description: string;
  timestamp: string;
  data: any;
}

export interface Favorite {
  id: string;
  type: 'translation' | 'conversation' | 'dictionary' | 'flashcard';
  itemId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface OfflineData {
  translations: Translation[];
  dictionary: DictionaryEntry[];
  conversations: Conversation[];
  flashcards: Flashcard[];
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

export interface ConversationTemplate {
  id: string;
  title: string;
  topic: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dialogues: Dialogue[];
  vocabulary: string[];
  grammar: string[];
  estimatedTime: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  language: string;
  questions: QuizQuestion[];
  timeLimit: number;
  passingScore: number;
  completed: boolean;
  score: number;
  completedAt?: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'fill-blank' | 'matching';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  points: number;
}

export interface StudySession {
  id: string;
  type: 'translation' | 'conversation' | 'flashcard' | 'quiz';
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
    translations: number;
    conversations: number;
    flashcards: number;
    timeSpent: number;
    accuracy: number;
  }[];
  weeklyStats: {
    weekStart: string;
    weekEnd: string;
    translations: number;
    conversations: number;
    flashcards: number;
    timeSpent: number;
    averageAccuracy: number;
  }[];
  monthlyStats: {
    month: string;
    year: number;
    translations: number;
    conversations: number;
    flashcards: number;
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
  translations: Translation[];
  dictionary: DictionaryEntry[];
  conversations: Conversation[];
  flashcards: Flashcard[];
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
    type: 'translation' | 'conversation' | 'flashcard' | 'progress';
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
  };
  offline: {
    enabled: boolean;
    autoSync: boolean;
    dataLimit: number;
  };
  about: {
    version: string;
    buildNumber: string;
    lastUpdated: string;
  };
} 