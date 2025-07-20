// CreativeSpark Types

export interface CreativePrompt {
  id: string;
  title: string;
  description: string;
  category: 'writing' | 'art' | 'music' | 'design' | 'photography' | 'crafting' | 'cooking' | 'technology' | 'business' | 'other';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  tags: string[];
  estimatedTime: number; // in minutes
  materials?: string[];
  steps?: string[];
  inspiration?: string;
  examples?: string[];
  isFavorite: boolean;
  isCompleted: boolean;
  completedAt?: string;
  rating?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreativeProject {
  id: string;
  title: string;
  description: string;
  category: CreativePrompt['category'];
  promptId?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'abandoned';
  priority: 'low' | 'medium' | 'high';
  estimatedTime: number;
  actualTime?: number;
  startDate?: string;
  dueDate?: string;
  completedDate?: string;
  progress: number; // 0-100
  materials: string[];
  steps: ProjectStep[];
  notes: string;
  images?: string[];
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectStep {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  order: number;
  estimatedTime: number;
  actualTime?: number;
  notes?: string;
}

export interface CreativeIdea {
  id: string;
  title: string;
  description: string;
  category: CreativePrompt['category'];
  inspiration: string;
  potential: 'low' | 'medium' | 'high';
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedTime: number;
  materials?: string[];
  steps?: string[];
  isDeveloped: boolean;
  developedInto?: string; // project ID
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  bio?: string;
  interests: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  preferredCategories: CreativePrompt['category'][];
  totalProjects: number;
  completedProjects: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  achievements: Achievement[];
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    dailyInspiration: boolean;
    projectReminders: boolean;
    achievementNotifications: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    shareProjects: boolean;
    shareProgress: boolean;
    allowComments: boolean;
  };
  creativity: {
    autoSuggestions: boolean;
    difficultyPreference: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    timePreference: 'short' | 'medium' | 'long';
    categoryPreference: CreativePrompt['category'][];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'completion' | 'streak' | 'creativity' | 'skill' | 'special';
  requirement: {
    type: 'projects' | 'streak' | 'time' | 'categories' | 'custom';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface CreativeStatistics {
  totalProjects: number;
  completedProjects: number;
  totalTimeSpent: number;
  averageProjectTime: number;
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  categoryBreakdown: { category: string; count: number }[];
  monthlyProgress: { month: string; projects: number }[];
  skillProgress: { skill: string; level: number }[];
}

export interface InspirationQuote {
  id: string;
  text: string;
  author: string;
  category: CreativePrompt['category'];
  isFavorite: boolean;
  createdAt: string;
}

export interface CreativeChallenge {
  id: string;
  title: string;
  description: string;
  category: CreativePrompt['category'];
  duration: number; // in days
  startDate: string;
  endDate: string;
  participants: string[];
  isActive: boolean;
  isCompleted: boolean;
  progress: number;
  rewards: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreativeResource {
  id: string;
  title: string;
  description: string;
  type: 'tutorial' | 'inspiration' | 'tool' | 'community' | 'course';
  category: CreativePrompt['category'];
  url: string;
  isFree: boolean;
  rating: number;
  tags: string[];
  isBookmarked: boolean;
  createdAt: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    dailyInspiration: boolean;
    projectReminders: boolean;
    achievementNotifications: boolean;
    weeklyReports: boolean;
  };
  privacy: {
    shareProjects: boolean;
    shareProgress: boolean;
    allowComments: boolean;
  };
  creativity: {
    autoSuggestions: boolean;
    difficultyPreference: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    timePreference: 'short' | 'medium' | 'long';
    categoryPreference: CreativePrompt['category'][];
  };
  dataExport: {
    lastExport: string;
    autoBackup: boolean;
  };
}

export interface SearchFilters {
  category?: CreativePrompt['category'];
  difficulty?: CreativePrompt['difficulty'];
  timeRange?: {
    min: number;
    max: number;
  };
  tags?: string[];
  status?: CreativeProject['status'];
  isCompleted?: boolean;
}

export interface SortOptions {
  field: 'title' | 'category' | 'difficulty' | 'createdAt' | 'updatedAt' | 'rating' | 'estimatedTime';
  direction: 'asc' | 'desc';
}

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Prompts: undefined;
  Projects: undefined;
  Ideas: undefined;
  Profile: undefined;
  PromptDetails: { promptId: string };
  ProjectDetails: { projectId: string };
  AddProject: { promptId?: string };
  EditProject: { projectId: string };
  AddIdea: undefined;
  EditIdea: { ideaId: string };
  ProjectEditor: { projectId: string };
  Statistics: undefined;
  Achievements: undefined;
  Settings: undefined;
  Inspiration: undefined;
  Challenges: undefined;
  Resources: undefined;
  Search: undefined;
  CategoryView: { category: CreativePrompt['category'] };
  UserProfile: { userId: string };
  Community: undefined;
  Help: undefined;
  About: undefined;
};

export type TabParamList = {
  Home: undefined;
  Prompts: undefined;
  Projects: undefined;
  Ideas: undefined;
  Profile: undefined;
}; 