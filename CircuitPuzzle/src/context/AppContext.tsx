import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import CircuitPuzzleService from '../services/CircuitPuzzleService';
import {
  Level,
  PlayerProgress,
  Achievement,
  GameSettings,
  GameState,
  CircuitSimulation,
  GridComponent,
  ComponentType,
} from '../types';

// State interface
interface AppState {
  levels: Level[];
  playerProgress: PlayerProgress | null;
  achievements: Achievement[];
  settings: GameSettings;
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LEVELS'; payload: Level[] }
  | { type: 'UPDATE_LEVEL'; payload: Level }
  | { type: 'SET_PLAYER_PROGRESS'; payload: PlayerProgress | null }
  | { type: 'UPDATE_PLAYER_PROGRESS'; payload: Partial<PlayerProgress> }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_SETTINGS'; payload: GameSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'UPDATE_GAME_STATE'; payload: Partial<GameState> }
  | { type: 'REFRESH_DATA' };

// Initial state
const initialState: AppState = {
  levels: [],
  playerProgress: null,
  achievements: [],
  settings: {
    theme: 'auto',
    sound: {
      enabled: true,
      volume: 0.7,
      effects: true,
      music: true,
    },
    graphics: {
      quality: 'medium',
      animations: true,
      particles: true,
    },
    gameplay: {
      showHints: true,
      autoSave: true,
      confirmMoves: false,
      showTimer: true,
    },
    accessibility: {
      highContrast: false,
      largeText: false,
      reducedMotion: false,
      colorBlindSupport: false,
    },
  },
  gameState: null,
  loading: false,
  error: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LEVELS':
      return { ...state, levels: action.payload };
    case 'UPDATE_LEVEL':
      return {
        ...state,
        levels: state.levels.map(l =>
          l.id === action.payload.id ? action.payload : l
        ),
      };
    case 'SET_PLAYER_PROGRESS':
      return { ...state, playerProgress: action.payload };
    case 'UPDATE_PLAYER_PROGRESS':
      return {
        ...state,
        playerProgress: state.playerProgress
          ? { ...state.playerProgress, ...action.payload }
          : null,
      };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(a =>
          a.id === action.payload.id ? action.payload : a
        ),
      };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'UPDATE_GAME_STATE':
      return {
        ...state,
        gameState: state.gameState
          ? { ...state.gameState, ...action.payload }
          : null,
      };
    case 'REFRESH_DATA':
      return { ...state };
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Level actions
  loadLevels: () => Promise<void>;
  getLevel: (id: string) => Promise<Level | null>;
  updateLevel: (id: string, updates: Partial<Level>) => Promise<void>;
  
  // Player progress actions
  loadPlayerProgress: () => Promise<void>;
  updatePlayerProgress: (updates: Partial<PlayerProgress>) => Promise<void>;
  completeLevel: (levelId: string, stars: number, moves: number, time: number) => Promise<void>;
  
  // Achievement actions
  loadAchievements: () => Promise<void>;
  checkAchievements: () => Promise<Achievement[]>;
  
  // Settings actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<GameSettings>) => Promise<void>;
  
  // Game state actions
  loadGameState: () => Promise<void>;
  updateGameState: (updates: Partial<GameState>) => Promise<void>;
  startGame: (levelId: string) => Promise<void>;
  pauseGame: () => Promise<void>;
  resumeGame: () => Promise<void>;
  endGame: () => Promise<void>;
  
  // Circuit simulation
  simulateCircuit: (grid: GridComponent[][]) => CircuitSimulation;
  
  // Data management
  exportData: () => Promise<string>;
  importData: (dataString: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load all data on mount
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      await Promise.all([
        loadLevels(),
        loadPlayerProgress(),
        loadAchievements(),
        loadSettings(),
        loadGameState(),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Level actions
  const loadLevels = async () => {
    try {
      const levels = await CircuitPuzzleService.getLevels();
      dispatch({ type: 'SET_LEVELS', payload: levels });
    } catch (error) {
      console.error('Error loading levels:', error);
    }
  };

  const getLevel = async (id: string): Promise<Level | null> => {
    try {
      return await CircuitPuzzleService.getLevel(id);
    } catch (error) {
      console.error('Error getting level:', error);
      return null;
    }
  };

  const updateLevel = async (id: string, updates: Partial<Level>) => {
    try {
      const updatedLevel = await CircuitPuzzleService.updateLevel(id, updates);
      if (updatedLevel) {
        dispatch({ type: 'UPDATE_LEVEL', payload: updatedLevel });
      }
    } catch (error) {
      console.error('Error updating level:', error);
      throw error;
    }
  };

  // Player progress actions
  const loadPlayerProgress = async () => {
    try {
      const progress = await CircuitPuzzleService.getPlayerProgress();
      dispatch({ type: 'SET_PLAYER_PROGRESS', payload: progress });
    } catch (error) {
      console.error('Error loading player progress:', error);
    }
  };

  const updatePlayerProgress = async (updates: Partial<PlayerProgress>) => {
    try {
      const updatedProgress = await CircuitPuzzleService.updatePlayerProgress(updates);
      if (updatedProgress) {
        dispatch({ type: 'SET_PLAYER_PROGRESS', payload: updatedProgress });
      }
    } catch (error) {
      console.error('Error updating player progress:', error);
      throw error;
    }
  };

  const completeLevel = async (levelId: string, stars: number, moves: number, time: number) => {
    try {
      await CircuitPuzzleService.completeLevel(levelId, stars, moves, time);
      await Promise.all([loadPlayerProgress(), checkAchievements()]);
    } catch (error) {
      console.error('Error completing level:', error);
      throw error;
    }
  };

  // Achievement actions
  const loadAchievements = async () => {
    try {
      const achievements = await CircuitPuzzleService.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const checkAchievements = async (): Promise<Achievement[]> => {
    try {
      const unlockedAchievements = await CircuitPuzzleService.checkAchievements();
      await loadAchievements(); // Refresh achievements list
      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  };

  // Settings actions
  const loadSettings = async () => {
    try {
      const settings = await CircuitPuzzleService.getSettings();
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (updates: Partial<GameSettings>) => {
    try {
      const updatedSettings = await CircuitPuzzleService.updateSettings(updates);
      dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  // Game state actions
  const loadGameState = async () => {
    try {
      const gameState = await CircuitPuzzleService.getGameState();
      if (gameState) {
        dispatch({ type: 'SET_GAME_STATE', payload: gameState });
      }
    } catch (error) {
      console.error('Error loading game state:', error);
    }
  };

  const updateGameState = async (updates: Partial<GameState>) => {
    try {
      const updatedState = await CircuitPuzzleService.updateGameState(updates);
      dispatch({ type: 'SET_GAME_STATE', payload: updatedState });
    } catch (error) {
      console.error('Error updating game state:', error);
      throw error;
    }
  };

  const startGame = async (levelId: string) => {
    try {
      const level = await getLevel(levelId);
      if (!level) throw new Error('Level not found');

      const gameState: GameState = {
        currentLevel: level,
        currentGrid: JSON.parse(JSON.stringify(level.grid)), // Deep copy
        moves: 0,
        time: 0,
        isPlaying: true,
        isPaused: false,
        isCompleted: false,
        starsEarned: 0,
        hintsUsed: 0,
        undoStack: [],
        redoStack: [],
      };

      await updateGameState(gameState);
    } catch (error) {
      console.error('Error starting game:', error);
      throw error;
    }
  };

  const pauseGame = async () => {
    try {
      await updateGameState({ isPaused: true });
    } catch (error) {
      console.error('Error pausing game:', error);
    }
  };

  const resumeGame = async () => {
    try {
      await updateGameState({ isPaused: false });
    } catch (error) {
      console.error('Error resuming game:', error);
    }
  };

  const endGame = async () => {
    try {
      await updateGameState({
        isPlaying: false,
        isPaused: false,
        isCompleted: true,
      });
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  // Circuit simulation
  const simulateCircuit = (grid: GridComponent[][]): CircuitSimulation => {
    return CircuitPuzzleService.simulateCircuit(grid);
  };

  // Data management
  const exportData = async (): Promise<string> => {
    try {
      return await CircuitPuzzleService.exportData();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const importData = async (dataString: string): Promise<boolean> => {
    try {
      const success = await CircuitPuzzleService.importData(dataString);
      if (success) {
        await loadAllData();
      }
      return success;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  };

  const clearAllData = async () => {
    try {
      await CircuitPuzzleService.clearAllData();
      await loadAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    loadLevels,
    getLevel,
    updateLevel,
    loadPlayerProgress,
    updatePlayerProgress,
    completeLevel,
    loadAchievements,
    checkAchievements,
    loadSettings,
    updateSettings,
    loadGameState,
    updateGameState,
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    simulateCircuit,
    exportData,
    importData,
    clearAllData,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
