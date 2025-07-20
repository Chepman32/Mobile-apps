import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import InstantScanService from '../services/InstantScanService';
import {
  ScanResult,
  UserProfile,
  Achievement,
  AppSettings,
  ScanSession,
  Subject,
  ScanStatistics,
  ExportData,
  ImportData,
} from '../types';

// State interface
interface AppState {
  scanResults: ScanResult[];
  userProfile: UserProfile | null;
  achievements: Achievement[];
  appSettings: AppSettings | null;
  scanSessions: ScanSession[];
  subjects: Subject[];
  statistics: ScanStatistics | null;
  loading: boolean;
  error: string | null;
  selectedScanResult: ScanResult | null;
  selectedSubject: Subject | null;
  currentSession: ScanSession | null;
  isScanning: boolean;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SCAN_RESULTS'; payload: ScanResult[] }
  | { type: 'ADD_SCAN_RESULT'; payload: ScanResult }
  | { type: 'UPDATE_SCAN_RESULT'; payload: ScanResult }
  | { type: 'DELETE_SCAN_RESULT'; payload: string }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_APP_SETTINGS'; payload: AppSettings | null }
  | { type: 'UPDATE_APP_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_SCAN_SESSIONS'; payload: ScanSession[] }
  | { type: 'ADD_SCAN_SESSION'; payload: ScanSession }
  | { type: 'UPDATE_SCAN_SESSION'; payload: ScanSession }
  | { type: 'SET_SUBJECTS'; payload: Subject[] }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'SET_STATISTICS'; payload: ScanStatistics }
  | { type: 'SET_SELECTED_SCAN_RESULT'; payload: ScanResult | null }
  | { type: 'SET_SELECTED_SUBJECT'; payload: Subject | null }
  | { type: 'SET_CURRENT_SESSION'; payload: ScanSession | null }
  | { type: 'SET_SCANNING'; payload: boolean }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  scanResults: [],
  userProfile: null,
  achievements: [],
  appSettings: null,
  scanSessions: [],
  subjects: [],
  statistics: null,
  loading: false,
  error: null,
  selectedScanResult: null,
  selectedSubject: null,
  currentSession: null,
  isScanning: false,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_SCAN_RESULTS':
      return { ...state, scanResults: action.payload };
    
    case 'ADD_SCAN_RESULT':
      return { ...state, scanResults: [action.payload, ...state.scanResults] };
    
    case 'UPDATE_SCAN_RESULT':
      return {
        ...state,
        scanResults: state.scanResults.map(scan =>
          scan.id === action.payload.id ? action.payload : scan
        ),
      };
    
    case 'DELETE_SCAN_RESULT':
      return {
        ...state,
        scanResults: state.scanResults.filter(scan => scan.id !== action.payload),
      };
    
    case 'SET_USER_PROFILE':
      return { ...state, userProfile: action.payload };
    
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: state.userProfile ? { ...state.userProfile, ...action.payload } : null,
      };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'UNLOCK_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload.id ? action.payload : achievement
        ),
      };
    
    case 'SET_APP_SETTINGS':
      return { ...state, appSettings: action.payload };
    
    case 'UPDATE_APP_SETTINGS':
      return {
        ...state,
        appSettings: state.appSettings ? { ...state.appSettings, ...action.payload } : null,
      };
    
    case 'SET_SCAN_SESSIONS':
      return { ...state, scanSessions: action.payload };
    
    case 'ADD_SCAN_SESSION':
      return { ...state, scanSessions: [action.payload, ...state.scanSessions] };
    
    case 'UPDATE_SCAN_SESSION':
      return {
        ...state,
        scanSessions: state.scanSessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        ),
      };
    
    case 'SET_SUBJECTS':
      return { ...state, subjects: action.payload };
    
    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map(subject =>
          subject.id === action.payload.id ? action.payload : subject
        ),
      };
    
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    
    case 'SET_SELECTED_SCAN_RESULT':
      return { ...state, selectedScanResult: action.payload };
    
    case 'SET_SELECTED_SUBJECT':
      return { ...state, selectedSubject: action.payload };
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    
    case 'SET_SCANNING':
      return { ...state, isScanning: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  // Scan Results actions
  loadScanResults: () => Promise<void>;
  createScanResult: (scanResult: Omit<ScanResult, 'id' | 'scannedAt'>) => Promise<ScanResult | null>;
  updateScanResult: (id: string, updates: Partial<ScanResult>) => Promise<ScanResult | null>;
  deleteScanResult: (id: string) => Promise<boolean>;
  selectScanResult: (scanResult: ScanResult | null) => void;
  
  // User Profile actions
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<UserProfile | null>;
  
  // Achievement actions
  loadAchievements: () => Promise<void>;
  
  // App Settings actions
  loadAppSettings: () => Promise<void>;
  updateAppSettings: (updates: Partial<AppSettings>) => Promise<AppSettings | null>;
  
  // Scan Sessions actions
  loadScanSessions: () => Promise<void>;
  createScanSession: (session: Omit<ScanSession, 'id' | 'startTime'>) => Promise<ScanSession | null>;
  updateScanSession: (id: string, updates: Partial<ScanSession>) => Promise<ScanSession | null>;
  setCurrentSession: (session: ScanSession | null) => void;
  
  // Subjects actions
  loadSubjects: () => Promise<void>;
  updateSubject: (id: string, updates: Partial<Subject>) => Promise<Subject | null>;
  selectSubject: (subject: Subject | null) => void;
  
  // Statistics actions
  loadStatistics: () => Promise<void>;
  
  // Scanning actions
  scanProblem: (imageUri: string, subject: string) => Promise<ScanResult | null>;
  setScanning: (scanning: boolean) => void;
  
  // Data management actions
  exportData: () => Promise<ExportData | null>;
  importData: (data: ImportData) => Promise<boolean>;
  clearAllData: () => Promise<void>;
  
  // Utility actions
  seedData: () => Promise<void>;
  resetState: () => void;
}

// Create context
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const service = InstantScanService.getInstance();

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await service.seedData();
        
        // Load all data in parallel
        await Promise.all([
          loadScanResults(),
          loadUserProfile(),
          loadAchievements(),
          loadAppSettings(),
          loadScanSessions(),
          loadSubjects(),
          loadStatistics(),
        ]);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Unknown error' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeApp();
  }, []);

  // Scan Results actions
  const loadScanResults = async (): Promise<void> => {
    try {
      const scanResults = await service.getScanResults();
      dispatch({ type: 'SET_SCAN_RESULTS', payload: scanResults });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load scan results' });
    }
  };

  const createScanResult = async (scanResult: Omit<ScanResult, 'id' | 'scannedAt'>): Promise<ScanResult | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newScanResult = await service.createScanResult(scanResult);
      dispatch({ type: 'ADD_SCAN_RESULT', payload: newScanResult });
      await loadStatistics();
      return newScanResult;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create scan result' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateScanResult = async (id: string, updates: Partial<ScanResult>): Promise<ScanResult | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedScanResult = await service.updateScanResult(id, updates);
      if (updatedScanResult) {
        dispatch({ type: 'UPDATE_SCAN_RESULT', payload: updatedScanResult });
        await loadStatistics();
      }
      return updatedScanResult;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update scan result' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteScanResult = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = await service.deleteScanResult(id);
      if (success) {
        dispatch({ type: 'DELETE_SCAN_RESULT', payload: id });
        await loadStatistics();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete scan result' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectScanResult = (scanResult: ScanResult | null): void => {
    dispatch({ type: 'SET_SELECTED_SCAN_RESULT', payload: scanResult });
  };

  // User Profile actions
  const loadUserProfile = async (): Promise<void> => {
    try {
      const userProfile = await service.getUserProfile();
      dispatch({ type: 'SET_USER_PROFILE', payload: userProfile });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load user profile' });
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const updatedProfile = await service.updateUserProfile(updates);
      if (updatedProfile) {
        dispatch({ type: 'UPDATE_USER_PROFILE', payload: updates });
      }
      return updatedProfile;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update user profile' });
      return null;
    }
  };

  // Achievement actions
  const loadAchievements = async (): Promise<void> => {
    try {
      const achievements = await service.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load achievements' });
    }
  };

  // App Settings actions
  const loadAppSettings = async (): Promise<void> => {
    try {
      const appSettings = await service.getAppSettings();
      dispatch({ type: 'SET_APP_SETTINGS', payload: appSettings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load app settings' });
    }
  };

  const updateAppSettings = async (updates: Partial<AppSettings>): Promise<AppSettings | null> => {
    try {
      const updatedSettings = await service.updateAppSettings(updates);
      if (updatedSettings) {
        dispatch({ type: 'UPDATE_APP_SETTINGS', payload: updates });
      }
      return updatedSettings;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update app settings' });
      return null;
    }
  };

  // Scan Sessions actions
  const loadScanSessions = async (): Promise<void> => {
    try {
      const scanSessions = await service.getScanSessions();
      dispatch({ type: 'SET_SCAN_SESSIONS', payload: scanSessions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load scan sessions' });
    }
  };

  const createScanSession = async (session: Omit<ScanSession, 'id' | 'startTime'>): Promise<ScanSession | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newSession = await service.createScanSession(session);
      dispatch({ type: 'ADD_SCAN_SESSION', payload: newSession });
      return newSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create scan session' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateScanSession = async (id: string, updates: Partial<ScanSession>): Promise<ScanSession | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedSession = await service.updateScanSession(id, updates);
      if (updatedSession) {
        dispatch({ type: 'UPDATE_SCAN_SESSION', payload: updatedSession });
      }
      return updatedSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update scan session' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const setCurrentSession = (session: ScanSession | null): void => {
    dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
  };

  // Subjects actions
  const loadSubjects = async (): Promise<void> => {
    try {
      const subjects = await service.getSubjects();
      dispatch({ type: 'SET_SUBJECTS', payload: subjects });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load subjects' });
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>): Promise<Subject | null> => {
    try {
      const updatedSubject = await service.updateSubject(id, updates);
      if (updatedSubject) {
        dispatch({ type: 'UPDATE_SUBJECT', payload: updatedSubject });
      }
      return updatedSubject;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update subject' });
      return null;
    }
  };

  const selectSubject = (subject: Subject | null): void => {
    dispatch({ type: 'SET_SELECTED_SUBJECT', payload: subject });
  };

  // Statistics actions
  const loadStatistics = async (): Promise<void> => {
    try {
      const statistics = await service.getScanStatistics();
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load statistics' });
    }
  };

  // Scanning actions
  const scanProblem = async (imageUri: string, subject: string): Promise<ScanResult | null> => {
    try {
      dispatch({ type: 'SET_SCANNING', payload: true });
      const scanResult = await service.scanProblem(imageUri, subject);
      if (scanResult) {
        dispatch({ type: 'ADD_SCAN_RESULT', payload: scanResult });
        await loadStatistics();
      }
      return scanResult;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to scan problem' });
      return null;
    } finally {
      dispatch({ type: 'SET_SCANNING', payload: false });
    }
  };

  const setScanning = (scanning: boolean): void => {
    dispatch({ type: 'SET_SCANNING', payload: scanning });
  };

  // Data management actions
  const exportData = async (): Promise<ExportData | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      return await service.exportData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to export data' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const importData = async (data: ImportData): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = await service.importData(data);
      if (success) {
        // Reload all data after successful import
        await Promise.all([
          loadScanResults(),
          loadUserProfile(),
          loadAchievements(),
          loadAppSettings(),
          loadScanSessions(),
          loadSubjects(),
          loadStatistics(),
        ]);
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to import data' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearAllData = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await service.clearAllData();
      dispatch({ type: 'RESET_STATE' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to clear data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Utility actions
  const seedData = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await service.seedData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to seed data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const resetState = (): void => {
    dispatch({ type: 'RESET_STATE' });
  };

  const contextValue: AppContextType = {
    state,
    loadScanResults,
    createScanResult,
    updateScanResult,
    deleteScanResult,
    selectScanResult,
    loadUserProfile,
    updateUserProfile,
    loadAchievements,
    loadAppSettings,
    updateAppSettings,
    loadScanSessions,
    createScanSession,
    updateScanSession,
    setCurrentSession,
    loadSubjects,
    updateSubject,
    selectSubject,
    loadStatistics,
    scanProblem,
    setScanning,
    exportData,
    importData,
    clearAllData,
    seedData,
    resetState,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook to use the context
export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
