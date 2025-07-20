import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Translation, DictionaryEntry, Conversation, Flashcard, Progress, UserProfile, Achievement, HistoryEntry, Favorite } from '../types';

interface PocketPolyglotRNState {
  translations: Translation[];
  dictionary: DictionaryEntry[];
  conversations: Conversation[];
  flashcards: Flashcard[];
  progress: Progress[];
  achievements: Achievement[];
  history: HistoryEntry[];
  favorites: Favorite[];
  userProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
}

type PocketPolyglotRNAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TRANSLATIONS'; payload: Translation[] }
  | { type: 'ADD_TRANSLATION'; payload: Translation }
  | { type: 'UPDATE_TRANSLATION'; payload: Translation }
  | { type: 'SET_DICTIONARY'; payload: DictionaryEntry[] }
  | { type: 'ADD_DICTIONARY_ENTRY'; payload: DictionaryEntry }
  | { type: 'UPDATE_DICTIONARY_ENTRY'; payload: DictionaryEntry }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation }
  | { type: 'UPDATE_CONVERSATION'; payload: Conversation }
  | { type: 'SET_FLASHCARDS'; payload: Flashcard[] }
  | { type: 'ADD_FLASHCARD'; payload: Flashcard }
  | { type: 'UPDATE_FLASHCARD'; payload: Flashcard }
  | { type: 'SET_PROGRESS'; payload: Progress[] }
  | { type: 'ADD_PROGRESS'; payload: Progress }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_HISTORY'; payload: HistoryEntry[] }
  | { type: 'ADD_HISTORY_ENTRY'; payload: HistoryEntry }
  | { type: 'SET_FAVORITES'; payload: Favorite[] }
  | { type: 'ADD_FAVORITE'; payload: Favorite }
  | { type: 'REMOVE_FAVORITE'; payload: string };

const initialState: PocketPolyglotRNState = {
  translations: [],
  dictionary: [],
  conversations: [],
  flashcards: [],
  progress: [],
  achievements: [],
  history: [],
  favorites: [],
  userProfile: {
    id: '1',
    name: 'Polyglot User',
    email: 'user@example.com',
    avatar: null,
    joinDate: new Date().toISOString(),
    preferences: {
      nativeLanguage: 'English',
      targetLanguages: ['Spanish', 'French', 'German'],
      autoTranslate: true,
      offlineMode: false,
      notifications: true,
      soundEnabled: true,
    },
    stats: {
      totalTranslations: 0,
      totalConversations: 0,
      totalFlashcards: 0,
      learnedWords: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalStudyTime: 0,
      accuracy: 0,
    },
  },
  isLoading: false,
  error: null,
};

function pocketPolyglotRNReducer(state: PocketPolyglotRNState, action: PocketPolyglotRNAction): PocketPolyglotRNState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_TRANSLATIONS':
      return { ...state, translations: action.payload };
    case 'ADD_TRANSLATION':
      return { ...state, translations: [...state.translations, action.payload] };
    case 'UPDATE_TRANSLATION':
      return {
        ...state,
        translations: state.translations.map(translation =>
          translation.id === action.payload.id ? action.payload : translation
        ),
      };
    case 'SET_DICTIONARY':
      return { ...state, dictionary: action.payload };
    case 'ADD_DICTIONARY_ENTRY':
      return { ...state, dictionary: [...state.dictionary, action.payload] };
    case 'UPDATE_DICTIONARY_ENTRY':
      return {
        ...state,
        dictionary: state.dictionary.map(entry =>
          entry.id === action.payload.id ? action.payload : entry
        ),
      };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [...state.conversations, action.payload] };
    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map(conversation =>
          conversation.id === action.payload.id ? action.payload : conversation
        ),
      };
    case 'SET_FLASHCARDS':
      return { ...state, flashcards: action.payload };
    case 'ADD_FLASHCARD':
      return { ...state, flashcards: [...state.flashcards, action.payload] };
    case 'UPDATE_FLASHCARD':
      return {
        ...state,
        flashcards: state.flashcards.map(flashcard =>
          flashcard.id === action.payload.id ? action.payload : flashcard
        ),
      };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'ADD_PROGRESS':
      return { ...state, progress: [...state.progress, action.payload] };
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
    default:
      return state;
  }
}

interface PocketPolyglotRNContextType {
  state: PocketPolyglotRNState;
  dispatch: React.Dispatch<PocketPolyglotRNAction>;
  addTranslation: (translation: Omit<Translation, 'id' | 'createdAt'>) => void;
  updateTranslation: (translation: Translation) => void;
  addDictionaryEntry: (entry: Omit<DictionaryEntry, 'id' | 'createdAt'>) => void;
  updateDictionaryEntry: (entry: DictionaryEntry) => void;
  addConversation: (conversation: Omit<Conversation, 'id'>) => void;
  addFlashcard: (flashcard: Omit<Flashcard, 'id'>) => void;
  updateFlashcard: (flashcard: Flashcard) => void;
  addProgress: (progress: Omit<Progress, 'id'>) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id'>) => void;
  addFavorite: (favorite: Omit<Favorite, 'id'>) => void;
  removeFavorite: (favoriteId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  getTranslationHistory: () => Translation[];
  getFavoriteTranslations: () => Translation[];
  calculateStats: () => void;
}

const PocketPolyglotRNContext = createContext<PocketPolyglotRNContextType | undefined>(undefined);

export function PocketPolyglotRNProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(pocketPolyglotRNReducer, initialState);

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
        translationsData, dictionaryData, conversationsData, flashcardsData,
        progressData, achievementsData, userProfileData, historyData, favoritesData
      ] = await Promise.all([
        AsyncStorage.getItem('translations'),
        AsyncStorage.getItem('dictionary'),
        AsyncStorage.getItem('conversations'),
        AsyncStorage.getItem('flashcards'),
        AsyncStorage.getItem('progress'),
        AsyncStorage.getItem('achievements'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('history'),
        AsyncStorage.getItem('favorites'),
      ]);

      if (translationsData) {
        dispatch({ type: 'SET_TRANSLATIONS', payload: JSON.parse(translationsData) });
      }
      if (dictionaryData) {
        dispatch({ type: 'SET_DICTIONARY', payload: JSON.parse(dictionaryData) });
      }
      if (conversationsData) {
        dispatch({ type: 'SET_CONVERSATIONS', payload: JSON.parse(conversationsData) });
      }
      if (flashcardsData) {
        dispatch({ type: 'SET_FLASHCARDS', payload: JSON.parse(flashcardsData) });
      }
      if (progressData) {
        dispatch({ type: 'SET_PROGRESS', payload: JSON.parse(progressData) });
      }
      if (achievementsData) {
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: JSON.parse(achievementsData) });
      }
      if (userProfileData) {
        dispatch({ type: 'SET_USER_PROFILE', payload: JSON.parse(userProfileData) });
      }
      if (historyData) {
        dispatch({ type: 'SET_HISTORY', payload: JSON.parse(historyData) });
      }
      if (favoritesData) {
        dispatch({ type: 'SET_FAVORITES', payload: JSON.parse(favoritesData) });
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
        AsyncStorage.setItem('translations', JSON.stringify(state.translations)),
        AsyncStorage.setItem('dictionary', JSON.stringify(state.dictionary)),
        AsyncStorage.setItem('conversations', JSON.stringify(state.conversations)),
        AsyncStorage.setItem('flashcards', JSON.stringify(state.flashcards)),
        AsyncStorage.setItem('progress', JSON.stringify(state.progress)),
        AsyncStorage.setItem('achievements', JSON.stringify(state.achievements)),
        AsyncStorage.setItem('userProfile', JSON.stringify(state.userProfile)),
        AsyncStorage.setItem('history', JSON.stringify(state.history)),
        AsyncStorage.setItem('favorites', JSON.stringify(state.favorites)),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save data' });
    }
  };

  const addTranslation = (translationData: Omit<Translation, 'id' | 'createdAt'>) => {
    const newTranslation: Translation = {
      ...translationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRANSLATION', payload: newTranslation });
  };

  const updateTranslation = (translation: Translation) => {
    dispatch({ type: 'UPDATE_TRANSLATION', payload: translation });
  };

  const addDictionaryEntry = (entryData: Omit<DictionaryEntry, 'id' | 'createdAt'>) => {
    const newEntry: DictionaryEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_DICTIONARY_ENTRY', payload: newEntry });
  };

  const updateDictionaryEntry = (entry: DictionaryEntry) => {
    dispatch({ type: 'UPDATE_DICTIONARY_ENTRY', payload: entry });
  };

  const addConversation = (conversationData: Omit<Conversation, 'id'>) => {
    const newConversation: Conversation = {
      ...conversationData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
  };

  const addFlashcard = (flashcardData: Omit<Flashcard, 'id'>) => {
    const newFlashcard: Flashcard = {
      ...flashcardData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_FLASHCARD', payload: newFlashcard });
  };

  const updateFlashcard = (flashcard: Flashcard) => {
    dispatch({ type: 'UPDATE_FLASHCARD', payload: flashcard });
  };

  const addProgress = (progressData: Omit<Progress, 'id'>) => {
    const newProgress: Progress = {
      ...progressData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_PROGRESS', payload: newProgress });
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

  const getTranslationHistory = (): Translation[] => {
    return state.translations.slice(0, 10); // Return last 10 translations
  };

  const getFavoriteTranslations = (): Translation[] => {
    const favoriteIds = state.favorites
      .filter(f => f.type === 'translation')
      .map(f => f.itemId);
    return state.translations.filter(t => favoriteIds.includes(t.id));
  };

  const calculateStats = () => {
    const totalTranslations = state.translations.length;
    const totalConversations = state.conversations.length;
    const totalFlashcards = state.flashcards.length;
    const learnedWords = state.flashcards.filter(f => f.learned).length;
    const accuracy = state.progress.length > 0 
      ? state.progress.reduce((sum, p) => sum + p.accuracy, 0) / state.progress.length 
      : 0;

    updateUserProfile({
      stats: {
        totalTranslations,
        totalConversations,
        totalFlashcards,
        learnedWords,
        currentStreak: state.userProfile.stats.currentStreak,
        longestStreak: state.userProfile.stats.longestStreak,
        totalStudyTime: state.userProfile.stats.totalStudyTime,
        accuracy: Math.round(accuracy * 100),
      },
    });
  };

  const value: PocketPolyglotRNContextType = {
    state,
    dispatch,
    addTranslation,
    updateTranslation,
    addDictionaryEntry,
    updateDictionaryEntry,
    addConversation,
    addFlashcard,
    updateFlashcard,
    addProgress,
    addHistoryEntry,
    addFavorite,
    removeFavorite,
    updateUserProfile,
    unlockAchievement,
    getTranslationHistory,
    getFavoriteTranslations,
    calculateStats,
  };

  return (
    <PocketPolyglotRNContext.Provider value={value}>
      {children}
    </PocketPolyglotRNContext.Provider>
  );
}

export function usePocketPolyglotRN() {
  const context = useContext(PocketPolyglotRNContext);
  if (context === undefined) {
    throw new Error('usePocketPolyglotRN must be used within a PocketPolyglotRNProvider');
  }
  return context;
} 