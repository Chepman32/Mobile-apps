import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import DigitalDetoxService from '../services/DigitalDetoxService';
import {
  Challenge,
  Session,
  UserProfile,
  Goal,
  Statistics,
  Achievement,
  AppSettings,
  SessionState,
  Timer,
} from '../types';

// State interface
interface AppState {
  challenges: Challenge[];
  sessions: Session[];
  userProfile: UserProfile | null;
  goals: Goal[];
  achievements: Achievement[];
  settings: AppSettings;
  sessionState: SessionState | null;
  statistics: Statistics;
  loading: boolean;
  error: string | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CHALLENGES'; payload: Challenge[] }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'UPDATE_CHALLENGE'; payload: Challenge }
  | { type: 'DELETE_CHALLENGE'; payload: string }
  | { type: 'SET_SESSIONS'; payload: Session[] }
  | { type: 'ADD_SESSION'; payload: Session }
  | { type: 'UPDATE_SESSION'; payload: Session }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_SETTINGS'; payload: AppSettings }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_SESSION_STATE'; payload: SessionState }
  | { type: 'UPDATE_SESSION_STATE'; payload: Partial<SessionState> }
  | { type: 'SET_STATISTICS'; payload: Statistics }
  | { type: 'REFRESH_DATA' };

// Initial state
const initialState: AppState = {
  challenges: [],
  sessions: [],
  userProfile: null,
  goals: [],
  achievements: [],
  settings: {
    theme: 'auto',
    notifications: {
      sessionReminders: true,
      goalReminders: true,
      streakReminders: true,
      weeklyReports: true,
      achievementNotifications: true,
      dailyMotivation: true,
    },
    sound: {
      sessionStart: true,
      sessionEnd: true,
      achievements: true,
    },
    privacy: {
      shareStats: false,
      shareAchievements: false,
    },
    dataExport: {
      lastExport: '',
      autoBackup: false,
    },
  },
  sessionState: null,
  statistics: {
    totalSessions: 0,
    totalMinutes: 0,
    averageSessionDuration: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionRate: 0,
    weeklyMinutes: [],
    monthlyMinutes: [],
    categoryBreakdown: [],
    moodTrends: [],
  },
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
    case 'SET_CHALLENGES':
      return { ...state, challenges: action.payload };
    case 'ADD_CHALLENGE':
      return { ...state, challenges: [...state.challenges, action.payload] };
    case 'UPDATE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.map(c =>
          c.id === action.payload.id ? action.payload : c
        ),
      };
    case 'DELETE_CHALLENGE':
      return {
        ...state,
        challenges: state.challenges.filter(c => c.id !== action.payload),
      };
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    case 'ADD_SESSION':
      return { ...state, sessions: [action.payload, ...state.sessions] };
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.id ? action.payload : s
        ),
      };
    case 'DELETE_SESSION':
      return {
        ...state,
        sessions: state.sessions.filter(s => s.id !== action.payload),
      };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: state.userProfile
          ? { ...state.userProfile, ...action.payload }
          : null,
      };
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };
    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload.id ? action.payload : g
        ),
      };
    case 'DELETE_GOAL':
      return {
        ...state,
        goals: state.goals.filter(g => g.id !== action.payload),
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
    case 'SET_SESSION_STATE':
      return { ...state, sessionState: action.payload };
    case 'UPDATE_SESSION_STATE':
      return {
        ...state,
        sessionState: state.sessionState
          ? { ...state.sessionState, ...action.payload }
          : null,
      };
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
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
  
  // Challenge actions
  loadChallenges: () => Promise<void>;
  addChallenge: (challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateChallenge: (id: string, updates: Partial<Challenge>) => Promise<void>;
  deleteChallenge: (id: string) => Promise<void>;
  
  // Session actions
  loadSessions: () => Promise<void>;
  addSession: (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateSession: (id: string, updates: Partial<Session>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  
  // User profile actions
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  
  // Goal actions
  loadGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateGoal: (id: string, updates: Partial<Goal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  
  // Achievement actions
  loadAchievements: () => Promise<void>;
  checkAchievements: () => Promise<Achievement[]>;
  
  // Settings actions
  loadSettings: () => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  
  // Session state actions
  loadSessionState: () => Promise<void>;
  updateSessionState: (updates: Partial<SessionState>) => Promise<void>;
  
  // Statistics actions
  loadStatistics: () => Promise<void>;
  
  // Data management
  exportData: () => Promise<string>;
  importData: (dataString: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
  
  // Timer actions
  startTimer: (targetSeconds: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  updateTimer: (timer: Partial<Timer>) => void;
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
        loadChallenges(),
        loadSessions(),
        loadUserProfile(),
        loadGoals(),
        loadAchievements(),
        loadSettings(),
        loadSessionState(),
        loadStatistics(),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Challenge actions
  const loadChallenges = async () => {
    try {
      const challenges = await DigitalDetoxService.getChallenges();
      dispatch({ type: 'SET_CHALLENGES', payload: challenges });
    } catch (error) {
      console.error('Error loading challenges:', error);
    }
  };

  const addChallenge = async (challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newChallenge = await DigitalDetoxService.addChallenge(challenge);
      dispatch({ type: 'ADD_CHALLENGE', payload: newChallenge });
    } catch (error) {
      console.error('Error adding challenge:', error);
      throw error;
    }
  };

  const updateChallenge = async (id: string, updates: Partial<Challenge>) => {
    try {
      const updatedChallenge = await DigitalDetoxService.updateChallenge(id, updates);
      if (updatedChallenge) {
        dispatch({ type: 'UPDATE_CHALLENGE', payload: updatedChallenge });
      }
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw error;
    }
  };

  const deleteChallenge = async (id: string) => {
    try {
      const success = await DigitalDetoxService.deleteChallenge(id);
      if (success) {
        dispatch({ type: 'DELETE_CHALLENGE', payload: id });
      }
    } catch (error) {
      console.error('Error deleting challenge:', error);
      throw error;
    }
  };

  // Session actions
  const loadSessions = async () => {
    try {
      const sessions = await DigitalDetoxService.getSessions();
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const addSession = async (session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newSession = await DigitalDetoxService.addSession(session);
      dispatch({ type: 'ADD_SESSION', payload: newSession });
      
      // Refresh statistics and achievements
      await Promise.all([loadStatistics(), checkAchievements()]);
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  };

  const updateSession = async (id: string, updates: Partial<Session>) => {
    try {
      const updatedSession = await DigitalDetoxService.updateSession(id, updates);
      if (updatedSession) {
        dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
        await loadStatistics();
      }
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  };

  const deleteSession = async (id: string) => {
    try {
      const success = await DigitalDetoxService.deleteSession(id);
      if (success) {
        dispatch({ type: 'DELETE_SESSION', payload: id });
        await loadStatistics();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  };

  // User profile actions
  const loadUserProfile = async () => {
    try {
      const profile = await DigitalDetoxService.getUserProfile();
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    try {
      const updatedProfile = await DigitalDetoxService.updateUserProfile(updates);
      if (updatedProfile) {
        dispatch({ type: 'SET_USER_PROFILE', payload: updatedProfile });
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  // Goal actions
  const loadGoals = async () => {
    try {
      const goals = await DigitalDetoxService.getGoals();
      dispatch({ type: 'SET_GOALS', payload: goals });
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newGoal = await DigitalDetoxService.addGoal(goal);
      dispatch({ type: 'ADD_GOAL', payload: newGoal });
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  };

  const updateGoal = async (id: string, updates: Partial<Goal>) => {
    try {
      const updatedGoal = await DigitalDetoxService.updateGoal(id, updates);
      if (updatedGoal) {
        dispatch({ type: 'UPDATE_GOAL', payload: updatedGoal });
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const success = await DigitalDetoxService.deleteGoal(id);
      if (success) {
        dispatch({ type: 'DELETE_GOAL', payload: id });
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      throw error;
    }
  };

  // Achievement actions
  const loadAchievements = async () => {
    try {
      const achievements = await DigitalDetoxService.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const checkAchievements = async (): Promise<Achievement[]> => {
    try {
      const unlockedAchievements = await DigitalDetoxService.checkAchievements();
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
      const settings = await DigitalDetoxService.getSettings();
      dispatch({ type: 'SET_SETTINGS', payload: settings });
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (updates: Partial<AppSettings>) => {
    try {
      const updatedSettings = await DigitalDetoxService.updateSettings(updates);
      dispatch({ type: 'SET_SETTINGS', payload: updatedSettings });
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  // Session state actions
  const loadSessionState = async () => {
    try {
      const sessionState = await DigitalDetoxService.getSessionState();
      if (sessionState) {
        dispatch({ type: 'SET_SESSION_STATE', payload: sessionState });
      }
    } catch (error) {
      console.error('Error loading session state:', error);
    }
  };

  const updateSessionState = async (updates: Partial<SessionState>) => {
    try {
      const updatedState = await DigitalDetoxService.updateSessionState(updates);
      dispatch({ type: 'SET_SESSION_STATE', payload: updatedState });
    } catch (error) {
      console.error('Error updating session state:', error);
      throw error;
    }
  };

  // Statistics actions
  const loadStatistics = async () => {
    try {
      const statistics = await DigitalDetoxService.getStatistics();
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  // Data management
  const exportData = async (): Promise<string> => {
    try {
      return await DigitalDetoxService.exportData();
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  const importData = async (dataString: string): Promise<boolean> => {
    try {
      const success = await DigitalDetoxService.importData(dataString);
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
      await DigitalDetoxService.clearAllData();
      await loadAllData();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  };

  // Timer actions
  const startTimer = (targetSeconds: number) => {
    const timer: Timer = {
      isActive: true,
      isPaused: false,
      seconds: 0,
      minutes: 0,
      hours: 0,
      totalSeconds: 0,
      targetSeconds,
    };
    updateSessionState({ timer });
  };

  const pauseTimer = () => {
    if (state.sessionState?.timer) {
      updateSessionState({ timer: { ...state.sessionState.timer, isPaused: true } });
    }
  };

  const resumeTimer = () => {
    if (state.sessionState?.timer) {
      updateSessionState({ timer: { ...state.sessionState.timer, isPaused: false } });
    }
  };

  const stopTimer = () => {
    if (state.sessionState?.timer) {
      updateSessionState({ timer: { ...state.sessionState.timer, isActive: false } });
    }
  };

  const updateTimer = (timer: Partial<Timer>) => {
    if (state.sessionState?.timer) {
      updateSessionState({ timer: { ...state.sessionState.timer, ...timer } });
    }
  };

  const contextValue: AppContextType = {
    state,
    dispatch,
    loadChallenges,
    addChallenge,
    updateChallenge,
    deleteChallenge,
    loadSessions,
    addSession,
    updateSession,
    deleteSession,
    loadUserProfile,
    updateUserProfile,
    loadGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    loadAchievements,
    checkAchievements,
    loadSettings,
    updateSettings,
    loadSessionState,
    updateSessionState,
    loadStatistics,
    exportData,
    importData,
    clearAllData,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    updateTimer,
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
