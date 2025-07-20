// Type definitions for InstantScanAndSolve

export interface ScanResult {
  id: string;
  type: 'math' | 'text' | 'object' | 'document';
  imageUri: string;
  extractedText: string;
  confidence: number;
  processingTime: number;
  successful: boolean;
  tags: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface SolveProblem {
  id: string;
  type: 'math' | 'text' | 'object' | 'document';
  problem: string;
  solution: string;
  steps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  solved: boolean;
  timeSpent: number;
  attempts: number;
  hints: string[];
  explanation: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  id: string;
  type: 'scan' | 'solve' | 'favorite' | 'share';
  itemId: string;
  title: string;
  description: string;
  timestamp: string;
  data: any;
}

export interface Favorite {
  id: string;
  type: 'scan' | 'solve' | 'result';
  itemId: string;
  title: string;
  description: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  joinDate: string;
  preferences: {
    autoSave: boolean;
    notifications: boolean;
    soundEnabled: boolean;
    offlineMode: boolean;
    highQualityScan: boolean;
  };
  stats: {
    totalScans: number;
    totalSolves: number;
    successfulScans: number;
    successfulSolves: number;
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
  category: 'scan' | 'solve' | 'streak' | 'accuracy' | 'special';
  requirement: {
    type: 'scans' | 'solves' | 'streak' | 'accuracy' | 'time';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  steps: TutorialStep[];
  completed: boolean;
  category: 'scan' | 'solve' | 'general';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  videoUrl?: string;
  completed: boolean;
}

export interface OfflineData {
  id: string;
  type: 'scan' | 'solve' | 'tutorial';
  data: any;
  syncStatus: 'pending' | 'synced' | 'failed';
  createdAt: string;
  syncedAt?: string;
}

export interface ScanRequest {
  imageUri: string;
  type: 'math' | 'text' | 'object' | 'document';
  quality: 'low' | 'medium' | 'high';
  language?: string;
}

export interface ScanResponse {
  success: boolean;
  extractedText: string;
  confidence: number;
  processingTime: number;
  alternatives: string[];
  error?: string;
}

export interface SolveRequest {
  problem: string;
  type: 'math' | 'text' | 'object' | 'document';
  difficulty: 'easy' | 'medium' | 'hard';
  hints: boolean;
}

export interface SolveResponse {
  success: boolean;
  solution: string;
  steps: string[];
  explanation: string;
  timeSpent: number;
  accuracy: number;
  error?: string;
}

export interface CameraSettings {
  quality: 'low' | 'medium' | 'high';
  flash: 'off' | 'on' | 'auto';
  focus: 'auto' | 'manual';
  zoom: number;
  aspectRatio: '4:3' | '16:9' | 'square';
}

export interface ScanMode {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'math' | 'text' | 'object' | 'document';
  settings: {
    quality: 'low' | 'medium' | 'high';
    autoFocus: boolean;
    flash: boolean;
    grid: boolean;
  };
}

export interface ProcessingResult {
  id: string;
  originalImage: string;
  processedImage: string;
  extractedData: any;
  confidence: number;
  processingTime: number;
  status: 'processing' | 'completed' | 'failed';
  error?: string;
}

export interface StudySession {
  id: string;
  type: 'scan' | 'solve' | 'tutorial';
  itemId: string;
  startTime: string;
  endTime?: string;
  duration: number;
  score?: number;
  accuracy?: number;
}

export interface ScanStats {
  dailyStats: {
    date: string;
    scans: number;
    solves: number;
    timeSpent: number;
    accuracy: number;
  }[];
  weeklyStats: {
    weekStart: string;
    weekEnd: string;
    scans: number;
    solves: number;
    timeSpent: number;
    averageAccuracy: number;
  }[];
  monthlyStats: {
    month: string;
    year: number;
    scans: number;
    solves: number;
    timeSpent: number;
    averageAccuracy: number;
  }[];
}

export interface NotificationSettings {
  enabled: boolean;
  scanComplete: boolean;
  solveComplete: boolean;
  achievementUnlocked: boolean;
  dailyReminder: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface ExportData {
  scanResults: ScanResult[];
  solveProblems: SolveProblem[];
  history: HistoryEntry[];
  favorites: Favorite[];
  achievements: Achievement[];
  userProfile: UserProfile;
  exportDate: string;
  version: string;
}

export interface ImportData {
  data: ExportData;
  importDate: string;
  conflicts: {
    type: 'scan' | 'solve' | 'history' | 'favorite';
    id: string;
    action: 'skip' | 'replace' | 'merge';
  }[];
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  camera: {
    quality: 'low' | 'medium' | 'high';
    autoFocus: boolean;
    flash: boolean;
    grid: boolean;
  };
  processing: {
    autoProcess: boolean;
    saveOriginal: boolean;
    highQuality: boolean;
    offlineMode: boolean;
  };
  about: {
    version: string;
    buildNumber: string;
    lastUpdated: string;
  };
}
