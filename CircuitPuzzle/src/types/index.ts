// Type definitions for CircuitPuzzle

export type ComponentType = 'source' | 'wire' | 'node' | 'empty' | 'battery' | 'light' | 'switch' | 'resistor' | 'capacitor' | 'diode';

export interface GridComponent {
  id: string;
  type: ComponentType;
  rotation: 0 | 90 | 180 | 270; // Degrees
  connections: ('top' | 'right' | 'bottom' | 'left')[];
  isPowered?: boolean;
  isActive?: boolean;
  resistance?: number;
  voltage?: number;
  current?: number;
  color?: string;
  metadata?: {
    description?: string;
    hint?: string;
    difficulty?: number;
  };
}

export interface Level {
  id: string;
  name: string;
  description: string;
  gridSize: { rows: number; cols: number };
  grid: GridComponent[][];
  targetConnections: { from: string; to: string }[];
  maxMoves: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  hints: string[];
  solution?: GridComponent[][];
  stars: {
    one: number; // moves needed for 1 star
    two: number; // moves needed for 2 stars
    three: number; // moves needed for 3 stars
  };
  category: 'basic' | 'advanced' | 'expert' | 'challenge';
  isUnlocked: boolean;
  isCompleted: boolean;
  bestScore?: number;
  starsEarned?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerProgress {
  id: string;
  unlockedLevel: number;
  completedLevels: string[];
  totalStars: number;
  totalMoves: number;
  totalTime: number;
  achievements: Achievement[];
  statistics: GameStatistics;
  settings: GameSettings;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'completion' | 'efficiency' | 'speed' | 'mastery' | 'special';
  requirement: {
    type: 'levels' | 'stars' | 'moves' | 'time' | 'streak' | 'custom';
    value: number;
  };
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface GameStatistics {
  totalLevelsCompleted: number;
  totalStarsEarned: number;
  totalMovesUsed: number;
  totalTimePlayed: number;
  averageMovesPerLevel: number;
  averageTimePerLevel: number;
  perfectLevels: number; // 3 stars
  currentStreak: number;
  longestStreak: number;
  favoriteCategory: string;
  leastFavoriteCategory: string;
  lastPlayedDate?: string;
}

export interface GameSettings {
  theme: 'light' | 'dark' | 'auto';
  sound: {
    enabled: boolean;
    volume: number;
    effects: boolean;
    music: boolean;
  };
  graphics: {
    quality: 'low' | 'medium' | 'high';
    animations: boolean;
    particles: boolean;
  };
  gameplay: {
    showHints: boolean;
    autoSave: boolean;
    confirmMoves: boolean;
    showTimer: boolean;
  };
  accessibility: {
    highContrast: boolean;
    largeText: boolean;
    reducedMotion: boolean;
    colorBlindSupport: boolean;
  };
}

export interface GameState {
  currentLevel: Level | null;
  currentGrid: GridComponent[][];
  moves: number;
  time: number;
  isPlaying: boolean;
  isPaused: boolean;
  isCompleted: boolean;
  starsEarned: number;
  hintsUsed: number;
  undoStack: GridComponent[][][];
  redoStack: GridComponent[][][];
}

export interface CircuitSimulation {
  poweredComponents: string[];
  currentFlow: { from: string; to: string; strength: number }[];
  voltageMap: { [componentId: string]: number };
  resistanceMap: { [componentId: string]: number };
  isValid: boolean;
  isComplete: boolean;
}

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetComponent?: string;
  highlightArea?: { row: number; col: number; width: number; height: number };
  action?: 'tap' | 'drag' | 'rotate' | 'connect';
  completed: boolean;
}

export interface LevelPack {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  levels: string[];
  isUnlocked: boolean;
  isCompleted: boolean;
  totalStars: number;
  maxStars: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  category: 'basic' | 'advanced' | 'expert' | 'challenge';
  createdAt: string;
  updatedAt: string;
}

export interface Hint {
  id: string;
  levelId: string;
  title: string;
  description: string;
  cost: number;
  type: 'general' | 'specific' | 'solution';
  isUsed: boolean;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  levelId: string;
  score: number;
  moves: number;
  time: number;
  stars: number;
  date: string;
}

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  LevelSelect: undefined;
  Game: { levelId: string };
  LevelComplete: { levelId: string; stars: number; moves: number; time: number };
  Tutorial: undefined;
  Settings: undefined;
  Statistics: undefined;
  Achievements: undefined;
  Leaderboard: undefined;
  LevelPack: { packId: string };
  HintShop: undefined;
  Profile: undefined;
  Help: undefined;
  About: undefined;
};

export type TabParamList = {
  Home: undefined;
  Levels: undefined;
  Statistics: undefined;
  Profile: undefined;
};
