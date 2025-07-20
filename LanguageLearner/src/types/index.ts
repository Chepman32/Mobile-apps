export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  difficulty: 'easy' | 'medium' | 'hard';
  content: string;
  vocabulary: string[];
  grammar: string[];
  exercises: Exercise[];
  completed: boolean;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  type: 'multiple-choice' | 'fill-blank' | 'translation' | 'listening' | 'speaking';
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'pronoun' | 'preposition' | 'conjunction';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  learned: boolean;
  reviewCount: number;
  lastReviewed: string;
  createdAt: string;
  updatedAt: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
}

export interface Grammar {
  id: string;
  title: string;
  description: string;
  rules: string[];
  examples: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  learned: boolean;
  reviewCount: number;
  lastReviewed: string;
  createdAt: string;
  updatedAt: string;
}

export interface Progress {
  id: string;
  lessonId?: string;
  vocabularyId?: string;
  grammarId?: string;
  quizId?: string;
  type: 'lesson' | 'vocabulary' | 'grammar' | 'quiz';
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
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    dailyGoal: number;
    notifications: boolean;
    soundEnabled: boolean;
  };
  stats: {
    totalLessons: number;
    completedLessons: number;
    totalVocabulary: number;
    learnedVocabulary: number;
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
  category: 'lesson' | 'vocabulary' | 'streak' | 'accuracy' | 'special';
  requirement: {
    type: 'lessons' | 'vocabulary' | 'streak' | 'accuracy' | 'time';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  lessonId?: string;
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

export interface Conversation {
  id: string;
  title: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  dialogues: Dialogue[];
  vocabulary: string[];
  completed: boolean;
  createdAt: string;
}

export interface Dialogue {
  id: string;
  speaker: 'user' | 'native';
  text: string;
  translation: string;
  audioUrl?: string;
}

export interface StudySession {
  id: string;
  type: 'lesson' | 'vocabulary' | 'grammar' | 'quiz';
  itemId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  score?: number;
  accuracy?: number;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  lessons: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  completed: boolean;
  progress: number;
  createdAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed: string;
  nextReview: string;
  reviewCount: number;
  easeFactor: number;
  interval: number;
}

export interface DictionaryEntry {
  id: string;
  word: string;
  definition: string;
  pronunciation: string;
  partOfSpeech: string;
  examples: string[];
  synonyms: string[];
  antonyms: string[];
  etymology: string;
  frequency: number;
}

export interface PronunciationGuide {
  id: string;
  word: string;
  phonetic: string;
  audioUrl: string;
  examples: string[];
  tips: string[];
}

export interface GrammarRule {
  id: string;
  title: string;
  description: string;
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
    lessonsCompleted: number;
    vocabularyLearned: number;
    timeSpent: number;
    accuracy: number;
  }[];
  weeklyStats: {
    weekStart: string;
    weekEnd: string;
    lessonsCompleted: number;
    vocabularyLearned: number;
    timeSpent: number;
    averageAccuracy: number;
  }[];
  monthlyStats: {
    month: string;
    year: number;
    lessonsCompleted: number;
    vocabularyLearned: number;
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
  lessons: Lesson[];
  vocabulary: Vocabulary[];
  grammar: Grammar[];
  progress: Progress[];
  achievements: Achievement[];
  quizzes: Quiz[];
  conversations: Conversation[];
  userProfile: UserProfile;
  exportDate: string;
  version: string;
}

export interface ImportData {
  data: ExportData;
  importDate: string;
  conflicts: {
    type: 'lesson' | 'vocabulary' | 'grammar' | 'progress';
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
  study: {
    autoPlay: boolean;
    showHints: boolean;
    reviewInterval: number;
    dailyGoal: number;
  };
  about: {
    version: string;
    buildNumber: string;
    lastUpdated: string;
  };
} 