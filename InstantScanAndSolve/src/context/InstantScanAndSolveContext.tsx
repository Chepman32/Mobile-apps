import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScanResult, SolveProblem, HistoryEntry, Favorite, UserProfile, Achievement, Tutorial, OfflineData } from '../types';

interface InstantScanAndSolveState {
  scanResults: ScanResult[];
  solveProblems: SolveProblem[];
  history: HistoryEntry[];
  favorites: Favorite[];
  achievements: Achievement[];
  tutorials: Tutorial[];
  offlineData: OfflineData[];
  userProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
}

type InstantScanAndSolveAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SCAN_RESULTS'; payload: ScanResult[] }
  | { type: 'ADD_SCAN_RESULT'; payload: ScanResult }
  | { type: 'UPDATE_SCAN_RESULT'; payload: ScanResult }
  | { type: 'SET_SOLVE_PROBLEMS'; payload: SolveProblem[] }
  | { type: 'ADD_SOLVE_PROBLEM'; payload: SolveProblem }
  | { type: 'UPDATE_SOLVE_PROBLEM'; payload: SolveProblem }
  | { type: 'SET_HISTORY'; payload: HistoryEntry[] }
  | { type: 'ADD_HISTORY_ENTRY'; payload: HistoryEntry }
  | { type: 'SET_FAVORITES'; payload: Favorite[] }
  | { type: 'ADD_FAVORITE'; payload: Favorite }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_TUTORIALS'; payload: Tutorial[] }
  | { type: 'SET_OFFLINE_DATA'; payload: OfflineData[] }
  | { type: 'ADD_OFFLINE_DATA'; payload: OfflineData };

const initialState: InstantScanAndSolveState = {
  scanResults: [],
  solveProblems: [],
  history: [],
  favorites: [],
  achievements: [],
  tutorials: [],
  offlineData: [],
  userProfile: {
    id: '1',
    name: 'Scanner User',
    email: 'scanner@example.com',
    avatar: null,
    joinDate: new Date().toISOString(),
    preferences: {
      autoSave: true,
      notifications: true,
      soundEnabled: true,
      offlineMode: false,
      highQualityScan: true,
    },
    stats: {
      totalScans: 0,
      totalSolves: 0,
      successfulScans: 0,
      successfulSolves: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalStudyTime: 0,
      accuracy: 0,
    },
  },
  isLoading: false,
  error: null,
};

function instantScanAndSolveReducer(state: InstantScanAndSolveState, action: InstantScanAndSolveAction): InstantScanAndSolveState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SCAN_RESULTS':
      return { ...state, scanResults: action.payload };
    case 'ADD_SCAN_RESULT':
      return { ...state, scanResults: [...state.scanResults, action.payload] };
    case 'UPDATE_SCAN_RESULT':
      return {
        ...state,
        scanResults: state.scanResults.map(result =>
          result.id === action.payload.id ? action.payload : result
        ),
      };
    case 'SET_SOLVE_PROBLEMS':
      return { ...state, solveProblems: action.payload };
    case 'ADD_SOLVE_PROBLEM':
      return { ...state, solveProblems: [...state.solveProblems, action.payload] };
    case 'UPDATE_SOLVE_PROBLEM':
      return {
        ...state,
        solveProblems: state.solveProblems.map(problem =>
          problem.id === action.payload.id ? action.payload : problem
        ),
      };
    case 'SET_HISTORY':
      return { ...state, history: action.payload };
    case 'ADD_HISTORY_ENTRY':
      return { ...state, history: [action.payload, ...state.history] };
    case 'SET_FAVORITES':
      return { ...state, favorites: action.payload };
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.payload] };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(favorite => favorite.id !== action.payload),
      };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.some(a => a.id === action.payload.id)
          ? state.achievements
          : [...state.achievements, action.payload],
      };
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload },
      };
    case 'SET_TUTORIALS':
      return { ...state, tutorials: action.payload };
    case 'SET_OFFLINE_DATA':
      return { ...state, offlineData: action.payload };
    case 'ADD_OFFLINE_DATA':
      return { ...state, offlineData: [...state.offlineData, action.payload] };
    default:
      return state;
  }
}

interface InstantScanAndSolveContextType {
  state: InstantScanAndSolveState;
  dispatch: React.Dispatch<InstantScanAndSolveAction>;
  addScanResult: (result: Omit<ScanResult, 'id' | 'createdAt'>) => void;
  updateScanResult: (result: ScanResult) => void;
  addSolveProblem: (problem: Omit<SolveProblem, 'id'>) => void;
  updateSolveProblem: (problem: SolveProblem) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id'>) => void;
  addFavorite: (favorite: Omit<Favorite, 'id'>) => void;
  removeFavorite: (favoriteId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  addOfflineData: (data: Omit<OfflineData, 'id'>) => void;
  getScanHistory: () => ScanResult[];
  getFavoriteScans: () => ScanResult[];
  calculateStats: () => void;
}

const InstantScanAndSolveContext = createContext<InstantScanAndSolveContextType | undefined>(undefined);

export function InstantScanAndSolveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(instantScanAndSolveReducer, initialState);

  // Load data from AsyncStorage on app start
  useEffect(() => {
    loadData();
  }, []);

  // Save data to AsyncStorage when state changes
  useEffect(() => {
    saveData();
  }, [state]);

  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const [
        scanResultsData, solveProblemsData, historyData, favoritesData,
        achievementsData, userProfileData, tutorialsData, offlineDataData
      ] = await Promise.all([
        AsyncStorage.getItem('scanResults'),
        AsyncStorage.getItem('solveProblems'),
        AsyncStorage.getItem('history'),
        AsyncStorage.getItem('favorites'),
        AsyncStorage.getItem('achievements'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('tutorials'),
        AsyncStorage.getItem('offlineData'),
      ]);

      if (scanResultsData) {
        dispatch({ type: 'SET_SCAN_RESULTS', payload: JSON.parse(scanResultsData) });
      }
      if (solveProblemsData) {
        dispatch({ type: 'SET_SOLVE_PROBLEMS', payload: JSON.parse(solveProblemsData) });
      }
      if (historyData) {
        dispatch({ type: 'SET_HISTORY', payload: JSON.parse(historyData) });
      }
      if (favoritesData) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(favoritesData) });
      }
      if (achievementsData) {
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: JSON.parse(achievementsData) });
      }
      if (userProfileData) {
        dispatch({ type: 'SET_USER_PROFILE', payload: JSON.parse(userProfileData) });
      }
      if (tutorialsData) {
        dispatch({ type: 'SET_TUTORIALS', payload: JSON.parse(tutorialsData) });
      }
      if (offlineDataData) {
        dispatch({ type: 'SET_OFFLINE_DATA', payload: JSON.parse(offlineDataData) });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveData = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem('scanResults', JSON.stringify(state.scanResults)),
        AsyncStorage.setItem('solveProblems', JSON.stringify(state.solveProblems)),
        AsyncStorage.setItem('history', JSON.stringify(state.history)),
        AsyncStorage.setItem('favorites', JSON.stringify(state.favorites)),
        AsyncStorage.setItem('achievements', JSON.stringify(state.achievements)),
        AsyncStorage.setItem('userProfile', JSON.stringify(state.userProfile)),
        AsyncStorage.setItem('tutorials', JSON.stringify(state.tutorials)),
        AsyncStorage.setItem('offlineData', JSON.stringify(state.offlineData)),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save data' });
    }
  };

  const addScanResult = (resultData: Omit<ScanResult, 'id' | 'createdAt'>) => {
    const newResult: ScanResult = {
      ...resultData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_SCAN_RESULT', payload: newResult });
  };

  const updateScanResult = (result: ScanResult) => {
    dispatch({ type: 'UPDATE_SCAN_RESULT', payload: result });
  };

  const addSolveProblem = (problemData: Omit<SolveProblem, 'id'>) => {
    const newProblem: SolveProblem = {
      ...problemData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_SOLVE_PROBLEM', payload: newProblem });
  };

  const updateSolveProblem = (problem: SolveProblem) => {
    dispatch({ type: 'UPDATE_SOLVE_PROBLEM', payload: problem });
  };

  const addHistoryEntry = (entryData: Omit<HistoryEntry, 'id'>) => {
    const newEntry: HistoryEntry = {
      ...entryData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_HISTORY_ENTRY', payload: newEntry });
  };

  const addFavorite = (favoriteData: Omit<Favorite, 'id'>) => {
    const newFavorite: Favorite = {
      ...favoriteData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_FAVORITE', payload: newFavorite });
  };

  const removeFavorite = (favoriteId: string) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: favoriteId });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: profile });
  };

  const unlockAchievement = (achievement: Achievement) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
  };

  const addOfflineData = (dataData: Omit<OfflineData, 'id'>) => {
    const newData: OfflineData = {
      ...dataData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_OFFLINE_DATA', payload: newData });
  };

  const getScanHistory = (): ScanResult[] => {
    return state.scanResults.slice(0, 10); // Return last 10 scans
  };

  const getFavoriteScans = (): ScanResult[] => {
    const favoriteIds = state.favorites
      .filter(f => f.type === 'scan')
      .map(f => f.itemId);
    return state.scanResults.filter(s => favoriteIds.includes(s.id));
  };

  const calculateStats = () => {
    const totalScans = state.scanResults.length;
    const totalSolves = state.solveProblems.length;
    const successfulScans = state.scanResults.filter(s => s.successful).length;
    const successfulSolves = state.solveProblems.filter(s => s.solved).length;
    const accuracy = totalScans > 0 ? (successfulScans / totalScans) * 100 : 0;

    updateUserProfile({
      stats: {
        totalScans,
        totalSolves,
        successfulScans,
        successfulSolves,
        currentStreak: state.userProfile.stats.currentStreak,
        longestStreak: state.userProfile.stats.longestStreak,
        totalStudyTime: state.userProfile.stats.totalStudyTime,
        accuracy: Math.round(accuracy),
      },
    });
  };

  const value: InstantScanAndSolveContextType = {
    state,
    dispatch,
    addScanResult,
    updateScanResult,
    addSolveProblem,
    updateSolveProblem,
    addHistoryEntry,
    addFavorite,
    removeFavorite,
    updateUserProfile,
    unlockAchievement,
    addOfflineData,
    getScanHistory,
    getFavoriteScans,
    calculateStats,
  };

  return (
    <InstantScanAndSolveContext.Provider value={value}>
      {children}
    </InstantScanAndSolveContext.Provider>
  );
}

export function useInstantScanAndSolve() {
  const context = useContext(InstantScanAndSolveContext);
  if (context === undefined) {
    throw new Error('useInstantScanAndSolve must be used within an InstantScanAndSolveProvider');
  }
  return context;
} 