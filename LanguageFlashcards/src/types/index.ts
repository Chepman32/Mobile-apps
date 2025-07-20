// LanguageFlashcards - Spaced Repetition Learning App Types

export interface User {
  id: string;
  name: string;
  email?: string;
  nativeLanguage: string;
  learningLanguages: LearningLanguage[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface LearningLanguage {
  id: string;
  language: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isActive: boolean;
  createdAt: string;
}

export interface UserPreferences {
  dailyGoal: number; // cards per day
  reviewInterval: number; // minutes between reviews
  autoPlayAudio: boolean;
  showTransliteration: boolean;
  theme: 'light' | 'dark' | 'auto';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  dailyReminders: boolean;
  streakAlerts: boolean;
  achievementAlerts: boolean;
  weeklyReports: boolean;
}

export interface Flashcard {
  id: string;
  deckId: string;
  front: string; // word/phrase in target language
  back: string; // translation
  transliteration?: string; // pronunciation guide
  audioUrl?: string;
  imageUrl?: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  language: string;
  category: DeckCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalCards: number;
  activeCards: number;
  isPublic: boolean;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export type DeckCategory = 
  | 'basic_vocabulary'
  | 'common_phrases'
  | 'numbers'
  | 'colors'
  | 'family'
  | 'food'
  | 'travel'
  | 'business'
  | 'grammar'
  | 'idioms'
  | 'custom';

export interface Review {
  id: string;
  flashcardId: string;
  deckId: string;
  userId: string;
  response: 'correct' | 'incorrect' | 'easy' | 'hard';
  timeSpent: number; // in seconds
  nextReviewDate: string;
  interval: number; // days until next review
  easeFactor: number; // spaced repetition ease factor
  createdAt: string;
}

export interface StudySession {
  id: string;
  userId: string;
  deckId: string;
  startTime: string;
  endTime?: string;
  totalCards: number;
  correctCards: number;
  incorrectCards: number;
  timeSpent: number; // in minutes
  isCompleted: boolean;
  createdAt: string;
}

export interface Progress {
  id: string;
  userId: string;
  deckId: string;
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  currentStreak: number;
  longestStreak: number;
  averageResponseTime: number;
  lastStudied: string;
  createdAt: string;
  updatedAt: string;
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
  | 'first_card'
  | 'study_streak'
  | 'perfect_session'
  | 'deck_master'
  | 'speed_learner'
  | 'consistency_king'
  | 'vocabulary_builder'
  | 'grammar_expert'
  | 'pronunciation_perfect'
  | 'multilingual_master';

export interface StudyStats {
  totalCards: number;
  totalDecks: number;
  totalReviews: number;
  correctReviews: number;
  incorrectReviews: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  totalStudyTime: number; // in minutes
  cardsStudiedToday: number;
  goalProgress: number;
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
  DeckDetails: { deckId: string };
  StudySession: { deckId: string };
  ReviewCard: { flashcardId: string };
  AddCard: { deckId: string };
  EditCard: { flashcardId: string };
  CreateDeck: undefined;
  EditDeck: { deckId: string };
  ProgressDetails: { deckId: string };
  Settings: undefined;
  Profile: undefined;
  Achievements: undefined;
  Statistics: undefined;
  ImportExport: undefined;
};

export type TabParamList = {
  Home: undefined;
  Study: undefined;
  Decks: undefined;
  Progress: undefined;
  Profile: undefined;
};

// Context Types
export interface LanguageFlashcardsContextType {
  // State
  user: User | null;
  decks: Deck[];
  flashcards: Flashcard[];
  reviews: Review[];
  studySessions: StudySession[];
  progress: Progress[];
  achievements: Achievement[];
  stats: StudyStats;
  currentSession: StudySession | null;
  loading: boolean;
  error: string | null;

  // Actions
  // User Management
  updateUser: (updates: Partial<User>) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  addLearningLanguage: (language: Omit<LearningLanguage, 'id' | 'createdAt'>) => Promise<void>;
  updateLearningLanguage: (languageId: string, updates: Partial<LearningLanguage>) => Promise<void>;

  // Deck Management
  createDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateDeck: (deckId: string, updates: Partial<Deck>) => Promise<void>;
  deleteDeck: (deckId: string) => Promise<void>;
  getDecksByLanguage: (language: string) => Deck[];
  getDecksByCategory: (category: DeckCategory) => Deck[];

  // Flashcard Management
  addFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateFlashcard: (flashcardId: string, updates: Partial<Flashcard>) => Promise<void>;
  deleteFlashcard: (flashcardId: string) => Promise<void>;
  getFlashcardsByDeck: (deckId: string) => Flashcard[];
  searchFlashcards: (query: string) => Flashcard[];

  // Study Session Management
  startStudySession: (deckId: string) => Promise<void>;
  endStudySession: () => Promise<void>;
  submitReview: (flashcardId: string, response: Review['response'], timeSpent: number) => Promise<void>;
  getDueCards: (deckId: string) => Flashcard[];
  getNextReviewDate: (flashcardId: string) => string;

  // Progress Tracking
  updateProgress: (deckId: string, review: Review) => Promise<void>;
  getProgressByDeck: (deckId: string) => Progress | null;
  getProgressChartData: (deckId: string, days?: number) => ChartData;

  // Achievement Management
  unlockAchievement: (achievementId: string) => Promise<void>;
  getAchievements: () => Achievement[];
  checkAchievements: () => Promise<void>;

  // Statistics
  refreshStats: () => Promise<void>;
  getStudyStats: () => StudyStats;
  getDailyStats: () => ChartData;

  // Data Management
  exportData: () => string;
  importData: (jsonData: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
  refreshData: () => Promise<void>;
} 