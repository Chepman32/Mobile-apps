import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import ComicCrafterService from '../services/ComicCrafterService';
import {
  Comic,
  Character,
  Template,
  UserProfile,
  Achievement,
  AppSettings,
  PublishingSettings,
  ComicStatistics,
  ExportData,
  ImportData,
} from '../types';

// State interface
interface AppState {
  comics: Comic[];
  characters: Character[];
  templates: Template[];
  userProfile: UserProfile | null;
  achievements: Achievement[];
  appSettings: AppSettings | null;
  publishingSettings: PublishingSettings | null;
  statistics: ComicStatistics | null;
  loading: boolean;
  error: string | null;
  selectedComic: Comic | null;
  selectedCharacter: Character | null;
  selectedTemplate: Template | null;
}

// Action types
type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COMICS'; payload: Comic[] }
  | { type: 'ADD_COMIC'; payload: Comic }
  | { type: 'UPDATE_COMIC'; payload: Comic }
  | { type: 'DELETE_COMIC'; payload: string }
  | { type: 'SET_CHARACTERS'; payload: Character[] }
  | { type: 'ADD_CHARACTER'; payload: Character }
  | { type: 'UPDATE_CHARACTER'; payload: Character }
  | { type: 'DELETE_CHARACTER'; payload: string }
  | { type: 'SET_TEMPLATES'; payload: Template[] }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile | null }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_APP_SETTINGS'; payload: AppSettings | null }
  | { type: 'UPDATE_APP_SETTINGS'; payload: Partial<AppSettings> }
  | { type: 'SET_PUBLISHING_SETTINGS'; payload: PublishingSettings | null }
  | { type: 'UPDATE_PUBLISHING_SETTINGS'; payload: Partial<PublishingSettings> }
  | { type: 'SET_STATISTICS'; payload: ComicStatistics }
  | { type: 'SET_SELECTED_COMIC'; payload: Comic | null }
  | { type: 'SET_SELECTED_CHARACTER'; payload: Character | null }
  | { type: 'SET_SELECTED_TEMPLATE'; payload: Template | null }
  | { type: 'RESET_STATE' };

// Initial state
const initialState: AppState = {
  comics: [],
  characters: [],
  templates: [],
  userProfile: null,
  achievements: [],
  appSettings: null,
  publishingSettings: null,
  statistics: null,
  loading: false,
  error: null,
  selectedComic: null,
  selectedCharacter: null,
  selectedTemplate: null,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_COMICS':
      return { ...state, comics: action.payload };
    
    case 'ADD_COMIC':
      return { ...state, comics: [...state.comics, action.payload] };
    
    case 'UPDATE_COMIC':
      return {
        ...state,
        comics: state.comics.map(comic =>
          comic.id === action.payload.id ? action.payload : comic
        ),
      };
    
    case 'DELETE_COMIC':
      return {
        ...state,
        comics: state.comics.filter(comic => comic.id !== action.payload),
      };
    
    case 'SET_CHARACTERS':
      return { ...state, characters: action.payload };
    
    case 'ADD_CHARACTER':
      return { ...state, characters: [...state.characters, action.payload] };
    
    case 'UPDATE_CHARACTER':
      return {
        ...state,
        characters: state.characters.map(char =>
          char.id === action.payload.id ? action.payload : char
        ),
      };
    
    case 'DELETE_CHARACTER':
      return {
        ...state,
        characters: state.characters.filter(char => char.id !== action.payload),
      };
    
    case 'SET_TEMPLATES':
      return { ...state, templates: action.payload };
    
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
    
    case 'SET_PUBLISHING_SETTINGS':
      return { ...state, publishingSettings: action.payload };
    
    case 'UPDATE_PUBLISHING_SETTINGS':
      return {
        ...state,
        publishingSettings: state.publishingSettings ? { ...state.publishingSettings, ...action.payload } : null,
      };
    
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    
    case 'SET_SELECTED_COMIC':
      return { ...state, selectedComic: action.payload };
    
    case 'SET_SELECTED_CHARACTER':
      return { ...state, selectedCharacter: action.payload };
    
    case 'SET_SELECTED_TEMPLATE':
      return { ...state, selectedTemplate: action.payload };
    
    case 'RESET_STATE':
      return initialState;
    
    default:
      return state;
  }
}

// Context interface
interface AppContextType {
  state: AppState;
  // Comic actions
  loadComics: () => Promise<void>;
  createComic: (comic: Omit<Comic, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Comic | null>;
  updateComic: (id: string, updates: Partial<Comic>) => Promise<Comic | null>;
  deleteComic: (id: string) => Promise<boolean>;
  selectComic: (comic: Comic | null) => void;
  
  // Character actions
  loadCharacters: () => Promise<void>;
  createCharacter: (character: Omit<Character, 'id'>) => Promise<Character | null>;
  updateCharacter: (id: string, updates: Partial<Character>) => Promise<Character | null>;
  deleteCharacter: (id: string) => Promise<boolean>;
  selectCharacter: (character: Character | null) => void;
  
  // Template actions
  loadTemplates: () => Promise<void>;
  getTemplatesByGenre: (genre: string) => Promise<Template[]>;
  selectTemplate: (template: Template | null) => void;
  
  // User profile actions
  loadUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<UserProfile | null>;
  
  // Achievement actions
  loadAchievements: () => Promise<void>;
  
  // Settings actions
  loadAppSettings: () => Promise<void>;
  updateAppSettings: (updates: Partial<AppSettings>) => Promise<AppSettings | null>;
  loadPublishingSettings: () => Promise<void>;
  updatePublishingSettings: (updates: Partial<PublishingSettings>) => Promise<PublishingSettings | null>;
  
  // Statistics actions
  loadStatistics: () => Promise<void>;
  
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
  const service = ComicCrafterService.getInstance();

  // Load initial data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await service.seedData();
        
        // Load all data in parallel
        await Promise.all([
          loadComics(),
          loadCharacters(),
          loadTemplates(),
          loadUserProfile(),
          loadAchievements(),
          loadAppSettings(),
          loadPublishingSettings(),
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

  // Comic actions
  const loadComics = async (): Promise<void> => {
    try {
      const comics = await service.getComics();
      dispatch({ type: 'SET_COMICS', payload: comics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load comics' });
    }
  };

  const createComic = async (comic: Omit<Comic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comic | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newComic = await service.createComic(comic);
      dispatch({ type: 'ADD_COMIC', payload: newComic });
      await loadStatistics();
      return newComic;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create comic' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateComic = async (id: string, updates: Partial<Comic>): Promise<Comic | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedComic = await service.updateComic(id, updates);
      if (updatedComic) {
        dispatch({ type: 'UPDATE_COMIC', payload: updatedComic });
        await loadStatistics();
      }
      return updatedComic;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update comic' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteComic = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = await service.deleteComic(id);
      if (success) {
        dispatch({ type: 'DELETE_COMIC', payload: id });
        await loadStatistics();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete comic' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectComic = (comic: Comic | null): void => {
    dispatch({ type: 'SET_SELECTED_COMIC', payload: comic });
  };

  // Character actions
  const loadCharacters = async (): Promise<void> => {
    try {
      const characters = await service.getCharacters();
      dispatch({ type: 'SET_CHARACTERS', payload: characters });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load characters' });
    }
  };

  const createCharacter = async (character: Omit<Character, 'id'>): Promise<Character | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newCharacter = await service.createCharacter(character);
      dispatch({ type: 'ADD_CHARACTER', payload: newCharacter });
      await loadStatistics();
      return newCharacter;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to create character' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateCharacter = async (id: string, updates: Partial<Character>): Promise<Character | null> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedCharacter = await service.updateCharacter(id, updates);
      if (updatedCharacter) {
        dispatch({ type: 'UPDATE_CHARACTER', payload: updatedCharacter });
      }
      return updatedCharacter;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update character' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteCharacter = async (id: string): Promise<boolean> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = await service.deleteCharacter(id);
      if (success) {
        dispatch({ type: 'DELETE_CHARACTER', payload: id });
        await loadStatistics();
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to delete character' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectCharacter = (character: Character | null): void => {
    dispatch({ type: 'SET_SELECTED_CHARACTER', payload: character });
  };

  // Template actions
  const loadTemplates = async (): Promise<void> => {
    try {
      const templates = await service.getTemplates();
      dispatch({ type: 'SET_TEMPLATES', payload: templates });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load templates' });
    }
  };

  const getTemplatesByGenre = async (genre: string): Promise<Template[]> => {
    try {
      return await service.getTemplatesByGenre(genre);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to get templates' });
      return [];
    }
  };

  const selectTemplate = (template: Template | null): void => {
    dispatch({ type: 'SET_SELECTED_TEMPLATE', payload: template });
  };

  // User profile actions
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

  // Settings actions
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

  const loadPublishingSettings = async (): Promise<void> => {
    try {
      const publishingSettings = await service.getPublishingSettings();
      dispatch({ type: 'SET_PUBLISHING_SETTINGS', payload: publishingSettings });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load publishing settings' });
    }
  };

  const updatePublishingSettings = async (updates: Partial<PublishingSettings>): Promise<PublishingSettings | null> => {
    try {
      const updatedSettings = await service.updatePublishingSettings(updates);
      if (updatedSettings) {
        dispatch({ type: 'UPDATE_PUBLISHING_SETTINGS', payload: updates });
      }
      return updatedSettings;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to update publishing settings' });
      return null;
    }
  };

  // Statistics actions
  const loadStatistics = async (): Promise<void> => {
    try {
      const statistics = await service.getComicStatistics();
      dispatch({ type: 'SET_STATISTICS', payload: statistics });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error instanceof Error ? error.message : 'Failed to load statistics' });
    }
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
          loadComics(),
          loadCharacters(),
          loadTemplates(),
          loadUserProfile(),
          loadAchievements(),
          loadAppSettings(),
          loadPublishingSettings(),
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
    loadComics,
    createComic,
    updateComic,
    deleteComic,
    selectComic,
    loadCharacters,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    selectCharacter,
    loadTemplates,
    getTemplatesByGenre,
    selectTemplate,
    loadUserProfile,
    updateUserProfile,
    loadAchievements,
    loadAppSettings,
    updateAppSettings,
    loadPublishingSettings,
    updatePublishingSettings,
    loadStatistics,
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