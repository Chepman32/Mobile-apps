import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Phrase, Translation, Vocabulary, Progress, UserProfile, Achievement, HistoryEntry, Favorite } from '../types';

interface LingoOnTheGoState {
  phrases: Phrase[];
  translations: Translation[];
  vocabulary: Vocabulary[];
  progress: Progress[];
  achievements: Achievement[];
  history: HistoryEntry[];
  favorites: Favorite[];
  userProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
}

type LingoOnTheGoAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PHRASES'; payload: Phrase[] }
  | { type: 'ADD_PHRASE'; payload: Phrase }
  | { type: 'UPDATE_PHRASE'; payload: Phrase }
  | { type: 'SET_TRANSLATIONS'; payload: Translation[] }
  | { type: 'ADD_TRANSLATION'; payload: Translation }
  | { type: 'UPDATE_TRANSLATION'; payload: Translation }
  | { type: 'SET_VOCABULARY'; payload: Vocabulary[] }
  | { type: 'ADD_VOCABULARY'; payload: Vocabulary }
  | { type: 'UPDATE_VOCABULARY'; payload: Vocabulary }
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

const initialState: LingoOnTheGoState = {
  phrases: [],
  translations: [],
  vocabulary: [],
  progress: [],
  achievements: [],
  history: [],
  favorites: [],
  userProfile: {
    id: '1',
    name: 'Language Learner',
    email: 'learner@example.com',
    avatar: null,
    joinDate: new Date().toISOString(),
    preferences: {
      nativeLanguage: 'English',
      targetLanguage: 'Spanish',
      autoTranslate: true,
      offlineMode: false,
      notifications: true,
      soundEnabled: true,
    },
    stats: {
      totalPhrases: 0,
      totalTranslations: 0,
      totalVocabulary: 0,
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

function lingoOnTheGoReducer(state: LingoOnTheGoState, action: LingoOnTheGoAction): LingoOnTheGoState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PHRASES':
      return { ...state, phrases: action.payload };
    case 'ADD_PHRASE':
      return { ...state, phrases: [...state.phrases, action.payload] };
    case 'UPDATE_PHRASE':
      return {
        ...state,
        phrases: state.phrases.map(phrase =>
          phrase.id === action.payload.id ? action.payload : phrase
        ),
      };
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
    case 'SET_VOCABULARY':
      return { ...state, vocabulary: action.payload };
    case 'ADD_VOCABULARY':
      return { ...state, vocabulary: [...state.vocabulary, action.payload] };
    case 'UPDATE_VOCABULARY':
      return {
        ...state,
        vocabulary: state.vocabulary.map(vocab =>
          vocab.id === action.payload.id ? action.payload : vocab
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

interface LingoOnTheGoContextType {
  state: LingoOnTheGoState;
  dispatch: React.Dispatch<LingoOnTheGoAction>;
  addPhrase: (phrase: Omit<Phrase, 'id' | 'createdAt'>) => void;
  updatePhrase: (phrase: Phrase) => void;
  addTranslation: (translation: Omit<Translation, 'id' | 'createdAt'>) => void;
  updateTranslation: (translation: Translation) => void;
  addVocabulary: (vocabulary: Omit<Vocabulary, 'id' | 'createdAt'>) => void;
  updateVocabulary: (vocabulary: Vocabulary) => void;
  addProgress: (progress: Omit<Progress, 'id'>) => void;
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id'>) => void;
  addFavorite: (favorite: Omit<Favorite, 'id'>) => void;
  removeFavorite: (favoriteId: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  getPhraseHistory: () => Phrase[];
  getFavoritePhrases: () => Phrase[];
  calculateStats: () => void;
}

const LingoOnTheGoContext = createContext<LingoOnTheGoContextType | undefined>(undefined);

export function LingoOnTheGoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(lingoOnTheGoReducer, initialState);

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
        phrasesData, translationsData, vocabularyData, progressData,
        achievementsData, userProfileData, historyData, favoritesData
      ] = await Promise.all([
        AsyncStorage.getItem('phrases'),
        AsyncStorage.getItem('translations'),
        AsyncStorage.getItem('vocabulary'),
        AsyncStorage.getItem('progress'),
        AsyncStorage.getItem('achievements'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('history'),
        AsyncStorage.getItem('favorites'),
      ]);

      if (phrasesData) {
        dispatch({ type: 'SET_PHRASES', payload: JSON.parse(phrasesData) });
      }
      if (translationsData) {
        dispatch({ type: 'SET_TRANSLATIONS', payload: JSON.parse(translationsData) });
      }
      if (vocabularyData) {
        dispatch({ type: 'SET_VOCABULARY', payload: JSON.parse(vocabularyData) });
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
        AsyncStorage.setItem('phrases', JSON.stringify(state.phrases)),
        AsyncStorage.setItem('translations', JSON.stringify(state.translations)),
        AsyncStorage.setItem('vocabulary', JSON.stringify(state.vocabulary)),
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

  const addPhrase = (phraseData: Omit<Phrase, 'id' | 'createdAt'>) => {
    const newPhrase: Phrase = {
      ...phraseData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_PHRASE', payload: newPhrase });
  };

  const updatePhrase = (phrase: Phrase) => {
    dispatch({ type: 'UPDATE_PHRASE', payload: phrase });
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

  const addVocabulary = (vocabularyData: Omit<Vocabulary, 'id' | 'createdAt'>) => {
    const newVocabulary: Vocabulary = {
      ...vocabularyData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_VOCABULARY', payload: newVocabulary });
  };

  const updateVocabulary = (vocabulary: Vocabulary) => {
    dispatch({ type: 'UPDATE_VOCABULARY', payload: vocabulary });
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

  const getPhraseHistory = (): Phrase[] => {
    return state.phrases.slice(0, 10); // Return last 10 phrases
  };

  const getFavoritePhrases = (): Phrase[] => {
    const favoriteIds = state.favorites
      .filter(f => f.type === 'phrase')
      .map(f => f.itemId);
    return state.phrases.filter(p => favoriteIds.includes(p.id));
  };

  const calculateStats = () => {
    const totalPhrases = state.phrases.length;
    const totalTranslations = state.translations.length;
    const totalVocabulary = state.vocabulary.length;
    const learnedWords = state.vocabulary.filter(v => v.learned).length;
    const accuracy = state.progress.length > 0 
      ? state.progress.reduce((sum, p) => sum + p.accuracy, 0) / state.progress.length 
      : 0;

    updateUserProfile({
      stats: {
        totalPhrases,
        totalTranslations,
        totalVocabulary,
        learnedWords,
        currentStreak: state.userProfile.stats.currentStreak,
        longestStreak: state.userProfile.stats.longestStreak,
        totalStudyTime: state.userProfile.stats.totalStudyTime,
        accuracy: Math.round(accuracy * 100),
      },
    });
  };

  const value: LingoOnTheGoContextType = {
    state,
    dispatch,
    addPhrase,
    updatePhrase,
    addTranslation,
    updateTranslation,
    addVocabulary,
    updateVocabulary,
    addProgress,
    addHistoryEntry,
    addFavorite,
    removeFavorite,
    updateUserProfile,
    unlockAchievement,
    getPhraseHistory,
    getFavoritePhrases,
    calculateStats,
  };

  return (
    <LingoOnTheGoContext.Provider value={value}>
      {children}
    </LingoOnTheGoContext.Provider>
  );
}

export function useLingoOnTheGo() {
  const context = useContext(LingoOnTheGoContext);
  if (context === undefined) {
    throw new Error('useLingoOnTheGo must be used within a LingoOnTheGoProvider');
  }
  return context;
} 