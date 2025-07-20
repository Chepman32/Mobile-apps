// Type definitions for InstantScanAndSolve

export interface ScanResult {
  id: string;
  imageUri: string;
  problemText: string;
  solution: string;
  scannedAt: string; // ISO date
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  confidence: number; // 0-100
  processingTime: number; // milliseconds
  isBookmarked: boolean;
  tags: string[];
  notes: string;
  category: 'math' | 'science' | 'language' | 'other';
  subcategory: string;
  steps: SolutionStep[];
  alternativeSolutions: AlternativeSolution[];
  relatedProblems: RelatedProblem[];
}

export interface SolutionStep {
  id: string;
  stepNumber: number;
  description: string;
  explanation: string;
  formula?: string;
  diagram?: string;
}

export interface AlternativeSolution {
  id: string;
  method: string;
  solution: string;
  steps: SolutionStep[];
  advantages: string[];
  disadvantages: string[];
}

export interface RelatedProblem {
  id: string;
  title: string;
  similarity: number; // 0-100
  category: string;
  difficulty: string;
}

export interface HistoryItem extends ScanResult {}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar: string;
  joinDate: string;
  totalScans: number;
  totalSolved: number;
  favoriteSubjects: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferences: UserPreferences;
  statistics: UserStatistics;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  autoSave: boolean;
  highQualityScan: boolean;
  showSteps: boolean;
  defaultSubject: string;
  language: string;
  units: 'metric' | 'imperial';
}

export interface UserStatistics {
  totalScans: number;
  successfulScans: number;
  averageConfidence: number;
  favoriteSubjects: Record<string, number>;
  scanHistory: ScanHistoryItem[];
  accuracyRate: number;
  averageProcessingTime: number;
  subjectsMastered: string[];
  subjectsNeedingWork: string[];
}

export interface ScanHistoryItem {
  date: string;
  scans: number;
  subjects: Record<string, number>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  threshold: number;
  reward: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  highQualityScan: boolean;
  showSteps: boolean;
  notifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  dataBackupEnabled: boolean;
  cloudSyncEnabled: boolean;
  scanQuality: 'low' | 'medium' | 'high';
  processingMode: 'fast' | 'accurate' | 'balanced';
}

export interface ScanSession {
  id: string;
  startTime: string;
  endTime?: string;
  scans: ScanResult[];
  subject: string;
  totalProblems: number;
  solvedProblems: number;
  averageConfidence: number;
  sessionDuration: number; // minutes
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
  description: string;
  categories: SubjectCategory[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  isEnabled: boolean;
  scanCount: number;
  successRate: number;
}

export interface SubjectCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
  commonFormulas?: string[];
  tips: string[];
}

export interface ScanError {
  id: string;
  errorType: 'image_quality' | 'text_recognition' | 'problem_parsing' | 'network' | 'unknown';
  message: string;
  timestamp: string;
  imageUri?: string;
  retryCount: number;
  resolved: boolean;
}

export interface ExportData {
  version: string;
  exportDate: string;
  scanResults: ScanResult[];
  userProfile: UserProfile;
  achievements: Achievement[];
  appSettings: AppSettings;
  scanSessions: ScanSession[];
  subjects: Subject[];
}

export interface ImportData {
  version: string;
  importDate: string;
  scanResults?: ScanResult[];
  userProfile?: UserProfile;
  achievements?: Achievement[];
  appSettings?: AppSettings;
  scanSessions?: ScanSession[];
  subjects?: Subject[];
}

export interface ScanStatistics {
  totalScans: number;
  successfulScans: number;
  averageConfidence: number;
  favoriteSubjects: Record<string, number>;
  recentActivity: ScanResult[];
  accuracyRate: number;
  averageProcessingTime: number;
  subjectsMastered: string[];
  subjectsNeedingWork: string[];
  weeklyProgress: WeeklyProgress[];
  monthlyTrends: MonthlyTrend[];
}

export interface WeeklyProgress {
  week: string;
  scans: number;
  solved: number;
  accuracy: number;
  subjects: Record<string, number>;
}

export interface MonthlyTrend {
  month: string;
  totalScans: number;
  averageConfidence: number;
  topSubjects: string[];
  improvementRate: number;
}

export type RootStackParamList = {
  Home: undefined;
  Camera: undefined;
  Result: { scanId: string };
  History: undefined;
  Settings: undefined;
  Statistics: undefined;
  Achievements: undefined;
  SubjectDetail: { subjectId: string };
  ScanSession: { sessionId: string };
  UserProfile: undefined;
};
