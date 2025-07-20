import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { LanguageFlashcardsService } from '../services/LanguageFlashcardsService';
import { User, Deck, Flashcard, Review, StudySession, Progress, Achievement } from '../types';

// State interface
interface LanguageFlashcardsState {
  user: User | null;
  decks: Deck[];
  flashcards: Flashcard[];
  reviews: Review[];
  studySessions: StudySession[];
  progress: Progress[];
  achievements: Achievement[];
  isLoading: boolean;
  error: string | null;
  currentStudySession: StudySession | null;
  currentDeck: Deck | null;
  currentCard: Flashcard | null;
}

// Action types
type LanguageFlashcardsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_DECKS'; payload: Deck[] }
  | { type: 'ADD_DECK'; payload: Deck }
  | { type: 'UPDATE_DECK'; payload: { id: string; updates: Partial<Deck> } }
  | { type: 'DELETE_DECK'; payload: string }
  | { type: 'SET_FLASHCARDS'; payload: Flashcard[] }
  | { type: 'ADD_FLASHCARD'; payload: Flashcard }
  | { type: 'UPDATE_FLASHCARD'; payload: { id: string; updates: Partial<Flashcard> } }
  | { type: 'DELETE_FLASHCARD'; payload: string }
  | { type: 'SET_REVIEWS'; payload: Review[] }
  | { type: 'ADD_REVIEW'; payload: Review }
  | { type: 'SET_STUDY_SESSIONS'; payload: StudySession[] }
  | { type: 'ADD_STUDY_SESSION'; payload: StudySession }
  | { type: 'UPDATE_STUDY_SESSION'; payload: { id: string; updates: Partial<StudySession> } }
  | { type: 'SET_PROGRESS'; payload: Progress[] }
  | { type: 'ADD_PROGRESS'; payload: Progress }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_CURRENT_STUDY_SESSION'; payload: StudySession | null }
  | { type: 'SET_CURRENT_DECK'; payload: Deck | null }
  | { type: 'SET_CURRENT_CARD'; payload: Flashcard | null }
  | { type: 'REFRESH_DATA' };

// Initial state
const initialState: LanguageFlashcardsState = {
  user: null,
  decks: [],
  flashcards: [],
  reviews: [],
  studySessions: [],
  progress: [],
  achievements: [],
  isLoading: false,
  error: null,
  currentStudySession: null,
  currentDeck: null,
  currentCard: null,
};

// Reducer function
function languageFlashcardsReducer(
  state: LanguageFlashcardsState,
  action: LanguageFlashcardsAction
): LanguageFlashcardsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'UPDATE_USER':
      return { 
        ...state, 
        user: state.user ? { ...state.user, ...action.payload } : null 
      };
    
    case 'SET_DECKS':
      return { ...state, decks: action.payload };
    
    case 'ADD_DECK':
      return { ...state, decks: [...state.decks, action.payload] };
    
    case 'UPDATE_DECK':
      return {
        ...state,
        decks: state.decks.map(deck =>
          deck.id === action.payload.id
            ? { ...deck, ...action.payload.updates }
            : deck
        ),
      };
    
    case 'DELETE_DECK':
      return {
        ...state,
        decks: state.decks.filter(deck => deck.id !== action.payload),
        flashcards: state.flashcards.filter(card => card.deckId !== action.payload),
      };
    
    case 'SET_FLASHCARDS':
      return { ...state, flashcards: action.payload };
    
    case 'ADD_FLASHCARD':
      return { ...state, flashcards: [...state.flashcards, action.payload] };
    
    case 'UPDATE_FLASHCARD':
      return {
        ...state,
        flashcards: state.flashcards.map(card =>
          card.id === action.payload.id
            ? { ...card, ...action.payload.updates }
            : card
        ),
      };
    
    case 'DELETE_FLASHCARD':
      return {
        ...state,
        flashcards: state.flashcards.filter(card => card.id !== action.payload),
      };
    
    case 'SET_REVIEWS':
      return { ...state, reviews: action.payload };
    
    case 'ADD_REVIEW':
      return { ...state, reviews: [...state.reviews, action.payload] };
    
    case 'SET_STUDY_SESSIONS':
      return { ...state, studySessions: action.payload };
    
    case 'ADD_STUDY_SESSION':
      return { ...state, studySessions: [...state.studySessions, action.payload] };
    
    case 'UPDATE_STUDY_SESSION':
      return {
        ...state,
        studySessions: state.studySessions.map(session =>
          session.id === action.payload.id
            ? { ...session, ...action.payload.updates }
            : session
        ),
      };
    
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    
    case 'ADD_PROGRESS':
      return { ...state, progress: [...state.progress, action.payload] };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'ADD_ACHIEVEMENT':
      return { ...state, achievements: [...state.achievements, action.payload] };
    
    case 'SET_CURRENT_STUDY_SESSION':
      return { ...state, currentStudySession: action.payload };
    
    case 'SET_CURRENT_DECK':
      return { ...state, currentDeck: action.payload };
    
    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.payload };
    
    case 'REFRESH_DATA':
      return { ...state };
    
    default:
      return state;
  }
}

// Context interface
interface LanguageFlashcardsContextType {
  state: LanguageFlashcardsState;
  // User actions
  getUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => Promise<void>;
  
  // Deck actions
  getDecks: () => Promise<void>;
  createDeck: (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'cardCount' | 'lastStudied' | 'studyCount' | 'averageAccuracy'>) => Promise<Deck>;
  updateDeck: (id: string, updates: Partial<Deck>) => Promise<Deck | null>;
  deleteDeck: (id: string) => Promise<boolean>;
  
  // Flashcard actions
  getFlashcards: () => Promise<void>;
  getFlashcardsByDeck: (deckId: string) => Promise<Flashcard[]>;
  createFlashcard: (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt' | 'reviewCount' | 'lastReviewed' | 'nextReview' | 'interval' | 'easeFactor' | 'consecutiveCorrect' | 'totalReviews' | 'correctReviews'>) => Promise<Flashcard>;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => Promise<Flashcard | null>;
  deleteFlashcard: (id: string) => Promise<boolean>;
  
  // Review actions
  reviewFlashcard: (cardId: string, quality: number) => Promise<Review>;
  getDueCards: (deckId?: string) => Promise<Flashcard[]>;
  
  // Study session actions
  getStudySessions: () => Promise<void>;
  createStudySession: (session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>) => Promise<StudySession>;
  updateStudySession: (id: string, updates: Partial<StudySession>) => Promise<StudySession | null>;
  
  // Progress actions
  getProgress: () => Promise<void>;
  createProgress: (progress: Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Progress>;
  
  // Achievement actions
  getAchievements: () => Promise<void>;
  createAchievement: (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Achievement>;
  
  // Data management
  exportData: () => Promise<string>;
  importData: (jsonData: string) => Promise<boolean>;
  clearAllData: () => Promise<void>;
  
  // Study session management
  setCurrentStudySession: (session: StudySession | null) => void;
  setCurrentDeck: (deck: Deck | null) => void;
  setCurrentCard: (card: Flashcard | null) => void;
}

// Create context
const LanguageFlashcardsContext = createContext<LanguageFlashcardsContextType | undefined>(undefined);

// Provider component
export function LanguageFlashcardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(languageFlashcardsReducer, initialState);
  const service = LanguageFlashcardsService.getInstance();

  // User actions
  const getUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const user = service.getUser();
      if (user) {
        dispatch({ type: 'SET_USER', payload: user });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedUser = service.updateUser(updates);
      dispatch({ type: 'UPDATE_USER', payload: updates });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update user' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Deck actions
  const getDecks = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const decks = service.getDecks();
      dispatch({ type: 'SET_DECKS', payload: decks });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get decks' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createDeck = async (deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'cardCount' | 'lastStudied' | 'studyCount' | 'averageAccuracy'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newDeck = service.createDeck(deck);
      dispatch({ type: 'ADD_DECK', payload: newDeck });
      return newDeck;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create deck' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateDeck = async (id: string, updates: Partial<Deck>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedDeck = service.updateDeck(id, updates);
      if (updatedDeck) {
        dispatch({ type: 'UPDATE_DECK', payload: { id, updates } });
      }
      return updatedDeck;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update deck' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteDeck = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = service.deleteDeck(id);
      if (success) {
        dispatch({ type: 'DELETE_DECK', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete deck' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Flashcard actions
  const getFlashcards = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const flashcards = service.getFlashcards();
      dispatch({ type: 'SET_FLASHCARDS', payload: flashcards });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get flashcards' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getFlashcardsByDeck = async (deckId: string) => {
    try {
      const flashcards = service.getFlashcardsByDeck(deckId);
      return flashcards;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get flashcards by deck' });
      return [];
    }
  };

  const createFlashcard = async (flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt' | 'reviewCount' | 'lastReviewed' | 'nextReview' | 'interval' | 'easeFactor' | 'consecutiveCorrect' | 'totalReviews' | 'correctReviews'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newFlashcard = service.createFlashcard(flashcard);
      dispatch({ type: 'ADD_FLASHCARD', payload: newFlashcard });
      return newFlashcard;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create flashcard' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateFlashcard = async (id: string, updates: Partial<Flashcard>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedFlashcard = service.updateFlashcard(id, updates);
      if (updatedFlashcard) {
        dispatch({ type: 'UPDATE_FLASHCARD', payload: { id, updates } });
      }
      return updatedFlashcard;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update flashcard' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteFlashcard = async (id: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = service.deleteFlashcard(id);
      if (success) {
        dispatch({ type: 'DELETE_FLASHCARD', payload: id });
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete flashcard' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Review actions
  const reviewFlashcard = async (cardId: string, quality: number) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const review = service.reviewFlashcard(cardId, quality);
      dispatch({ type: 'ADD_REVIEW', payload: review });
      return review;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to review flashcard' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getDueCards = async (deckId?: string) => {
    try {
      const dueCards = service.getDueCards(deckId);
      return dueCards;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get due cards' });
      return [];
    }
  };

  // Study session actions
  const getStudySessions = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const sessions = service.getStudySessions();
      dispatch({ type: 'SET_STUDY_SESSIONS', payload: sessions });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get study sessions' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createStudySession = async (session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newSession = service.createStudySession(session);
      dispatch({ type: 'ADD_STUDY_SESSION', payload: newSession });
      return newSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create study session' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateStudySession = async (id: string, updates: Partial<StudySession>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const updatedSession = service.updateStudySession(id, updates);
      if (updatedSession) {
        dispatch({ type: 'UPDATE_STUDY_SESSION', payload: { id, updates } });
      }
      return updatedSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update study session' });
      return null;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Progress actions
  const getProgress = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const progress = service.getProgress();
      dispatch({ type: 'SET_PROGRESS', payload: progress });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get progress' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createProgress = async (progress: Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newProgress = service.createProgress(progress);
      dispatch({ type: 'ADD_PROGRESS', payload: newProgress });
      return newProgress;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create progress' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Achievement actions
  const getAchievements = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const achievements = service.getAchievements();
      dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to get achievements' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createAchievement = async (achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const newAchievement = service.createAchievement(achievement);
      dispatch({ type: 'ADD_ACHIEVEMENT', payload: newAchievement });
      return newAchievement;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create achievement' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Data management
  const exportData = async () => {
    try {
      return service.exportData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to export data' });
      throw error;
    }
  };

  const importData = async (jsonData: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const success = service.importData(jsonData);
      if (success) {
        dispatch({ type: 'REFRESH_DATA' });
        // Reload all data
        await Promise.all([
          getUser(),
          getDecks(),
          getFlashcards(),
          getStudySessions(),
          getProgress(),
          getAchievements(),
        ]);
      }
      return success;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to import data' });
      return false;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearAllData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      service.clearAllData();
      dispatch({ type: 'REFRESH_DATA' });
      // Reload all data
      await Promise.all([
        getUser(),
        getDecks(),
        getFlashcards(),
        getStudySessions(),
        getProgress(),
        getAchievements(),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Study session management
  const setCurrentStudySession = (session: StudySession | null) => {
    dispatch({ type: 'SET_CURRENT_STUDY_SESSION', payload: session });
  };

  const setCurrentDeck = (deck: Deck | null) => {
    dispatch({ type: 'SET_CURRENT_DECK', payload: deck });
  };

  const setCurrentCard = (card: Flashcard | null) => {
    dispatch({ type: 'SET_CURRENT_CARD', payload: card });
  };

  const value: LanguageFlashcardsContextType = {
    state,
    getUser,
    updateUser,
    getDecks,
    createDeck,
    updateDeck,
    deleteDeck,
    getFlashcards,
    getFlashcardsByDeck,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    reviewFlashcard,
    getDueCards,
    getStudySessions,
    createStudySession,
    updateStudySession,
    getProgress,
    createProgress,
    getAchievements,
    createAchievement,
    exportData,
    importData,
    clearAllData,
    setCurrentStudySession,
    setCurrentDeck,
    setCurrentCard,
  };

  return (
    <LanguageFlashcardsContext.Provider value={value}>
      {children}
    </LanguageFlashcardsContext.Provider>
  );
}

// Hook to use the context
export function useLanguageFlashcards() {
  const context = useContext(LanguageFlashcardsContext);
  if (context === undefined) {
    throw new Error('useLanguageFlashcards must be used within a LanguageFlashcardsProvider');
  }
  return context;
} 