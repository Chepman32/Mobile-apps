import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Lesson, Vocabulary, Grammar, Progress, UserProfile, Achievement, Quiz, Conversation } from '../types';

interface LanguageLearnerState {
  lessons: Lesson[];
  vocabulary: Vocabulary[];
  grammar: Grammar[];
  progress: Progress[];
  achievements: Achievement[];
  quizzes: Quiz[];
  conversations: Conversation[];
  userProfile: UserProfile;
  isLoading: boolean;
  error: string | null;
}

type LanguageLearnerAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_LESSONS'; payload: Lesson[] }
  | { type: 'ADD_LESSON'; payload: Lesson }
  | { type: 'UPDATE_LESSON'; payload: Lesson }
  | { type: 'SET_VOCABULARY'; payload: Vocabulary[] }
  | { type: 'ADD_VOCABULARY'; payload: Vocabulary }
  | { type: 'UPDATE_VOCABULARY'; payload: Vocabulary }
  | { type: 'SET_GRAMMAR'; payload: Grammar[] }
  | { type: 'ADD_GRAMMAR'; payload: Grammar }
  | { type: 'UPDATE_GRAMMAR'; payload: Grammar }
  | { type: 'SET_PROGRESS'; payload: Progress[] }
  | { type: 'ADD_PROGRESS'; payload: Progress }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_USER_PROFILE'; payload: UserProfile }
  | { type: 'UPDATE_USER_PROFILE'; payload: Partial<UserProfile> }
  | { type: 'SET_QUIZZES'; payload: Quiz[] }
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'SET_CONVERSATIONS'; payload: Conversation[] }
  | { type: 'ADD_CONVERSATION'; payload: Conversation };

const initialState: LanguageLearnerState = {
  lessons: [],
  vocabulary: [],
  grammar: [],
  progress: [],
  achievements: [],
  quizzes: [],
  conversations: [],
  userProfile: {
    id: '1',
    name: 'Language Learner',
    email: 'learner@example.com',
    avatar: null,
    joinDate: new Date().toISOString(),
    preferences: {
      nativeLanguage: 'English',
      targetLanguage: 'Spanish',
      difficulty: 'beginner',
      dailyGoal: 30,
      notifications: true,
      soundEnabled: true,
    },
    stats: {
      totalLessons: 0,
      completedLessons: 0,
      totalVocabulary: 0,
      learnedVocabulary: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalStudyTime: 0,
      accuracy: 0,
    },
  },
  isLoading: false,
  error: null,
};

function languageLearnerReducer(state: LanguageLearnerState, action: LanguageLearnerAction): LanguageLearnerState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_LESSONS':
      return { ...state, lessons: action.payload };
    case 'ADD_LESSON':
      return { ...state, lessons: [...state.lessons, action.payload] };
    case 'UPDATE_LESSON':
      return {
        ...state,
        lessons: state.lessons.map(lesson =>
          lesson.id === action.payload.id ? action.payload : lesson
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
    case 'SET_GRAMMAR':
      return { ...state, grammar: action.payload };
    case 'ADD_GRAMMAR':
      return { ...state, grammar: [...state.grammar, action.payload] };
    case 'UPDATE_GRAMMAR':
      return {
        ...state,
        grammar: state.grammar.map(grammar =>
          grammar.id === action.payload.id ? action.payload : grammar
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
    case 'SET_QUIZZES':
      return { ...state, quizzes: action.payload };
    case 'ADD_QUIZ':
      return { ...state, quizzes: [...state.quizzes, action.payload] };
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'ADD_CONVERSATION':
      return { ...state, conversations: [...state.conversations, action.payload] };
    default:
      return state;
  }
}

interface LanguageLearnerContextType {
  state: LanguageLearnerState;
  dispatch: React.Dispatch<LanguageLearnerAction>;
  addLesson: (lesson: Omit<Lesson, 'id' | 'createdAt'>) => void;
  updateLesson: (lesson: Lesson) => void;
  addVocabulary: (vocabulary: Omit<Vocabulary, 'id' | 'createdAt'>) => void;
  updateVocabulary: (vocabulary: Vocabulary) => void;
  addGrammar: (grammar: Omit<Grammar, 'id' | 'createdAt'>) => void;
  updateGrammar: (grammar: Grammar) => void;
  addProgress: (progress: Omit<Progress, 'id'>) => void;
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  addConversation: (conversation: Omit<Conversation, 'id'>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  unlockAchievement: (achievement: Achievement) => void;
  getLessonProgress: (lessonId: string) => Progress | undefined;
  getVocabularyProgress: (vocabularyId: string) => Progress | undefined;
  calculateStats: () => void;
}

const LanguageLearnerContext = createContext<LanguageLearnerContextType | undefined>(undefined);

export function LanguageLearnerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(languageLearnerReducer, initialState);

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
        lessonsData, vocabularyData, grammarData, progressData, 
        achievementsData, userProfileData, quizzesData, conversationsData
      ] = await Promise.all([
        AsyncStorage.getItem('lessons'),
        AsyncStorage.getItem('vocabulary'),
        AsyncStorage.getItem('grammar'),
        AsyncStorage.getItem('progress'),
        AsyncStorage.getItem('achievements'),
        AsyncStorage.getItem('userProfile'),
        AsyncStorage.getItem('quizzes'),
        AsyncStorage.getItem('conversations'),
      ]);

      if (lessonsData) {
        dispatch({ type: 'SET_LESSONS', payload: JSON.parse(lessonsData) });
      }
      if (vocabularyData) {
        dispatch({ type: 'SET_VOCABULARY', payload: JSON.parse(vocabularyData) });
      }
      if (grammarData) {
        dispatch({ type: 'SET_GRAMMAR', payload: JSON.parse(grammarData) });
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
      if (quizzesData) {
        dispatch({ type: 'SET_QUIZZES', payload: JSON.parse(quizzesData) });
      }
      if (conversationsData) {
        dispatch({ type: 'SET_CONVERSATIONS', payload: JSON.parse(conversationsData) });
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
        AsyncStorage.setItem('lessons', JSON.stringify(state.lessons)),
        AsyncStorage.setItem('vocabulary', JSON.stringify(state.vocabulary)),
        AsyncStorage.setItem('grammar', JSON.stringify(state.grammar)),
        AsyncStorage.setItem('progress', JSON.stringify(state.progress)),
        AsyncStorage.setItem('achievements', JSON.stringify(state.achievements)),
        AsyncStorage.setItem('userProfile', JSON.stringify(state.userProfile)),
        AsyncStorage.setItem('quizzes', JSON.stringify(state.quizzes)),
        AsyncStorage.setItem('conversations', JSON.stringify(state.conversations)),
      ]);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to save data' });
    }
  };

  const addLesson = (lessonData: Omit<Lesson, 'id' | 'createdAt'>) => {
    const newLesson: Lesson = {
      ...lessonData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_LESSON', payload: newLesson });
  };

  const updateLesson = (lesson: Lesson) => {
    dispatch({ type: 'UPDATE_LESSON', payload: lesson });
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

  const addGrammar = (grammarData: Omit<Grammar, 'id' | 'createdAt'>) => {
    const newGrammar: Grammar = {
      ...grammarData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_GRAMMAR', payload: newGrammar });
  };

  const updateGrammar = (grammar: Grammar) => {
    dispatch({ type: 'UPDATE_GRAMMAR', payload: grammar });
  };

  const addProgress = (progressData: Omit<Progress, 'id'>) => {
    const newProgress: Progress = {
      ...progressData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_PROGRESS', payload: newProgress });
  };

  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_QUIZ', payload: newQuiz });
  };

  const addConversation = (conversationData: Omit<Conversation, 'id'>) => {
    const newConversation: Conversation = {
      ...conversationData,
      id: Date.now().toString(),
    };
    dispatch({ type: 'ADD_CONVERSATION', payload: newConversation });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    dispatch({ type: 'UPDATE_USER_PROFILE', payload: profile });
  };

  const unlockAchievement = (achievement: Achievement) => {
    dispatch({ type: 'UNLOCK_ACHIEVEMENT', payload: achievement });
  };

  const getLessonProgress = (lessonId: string): Progress | undefined => {
    return state.progress.find(p => p.lessonId === lessonId);
  };

  const getVocabularyProgress = (vocabularyId: string): Progress | undefined => {
    return state.progress.find(p => p.vocabularyId === vocabularyId);
  };

  const calculateStats = () => {
    const totalLessons = state.lessons.length;
    const completedLessons = state.lessons.filter(l => l.completed).length;
    const totalVocabulary = state.vocabulary.length;
    const learnedVocabulary = state.vocabulary.filter(v => v.learned).length;
    const accuracy = state.progress.length > 0 
      ? state.progress.reduce((sum, p) => sum + p.accuracy, 0) / state.progress.length 
      : 0;

    updateUserProfile({
      stats: {
        totalLessons,
        completedLessons,
        totalVocabulary,
        learnedVocabulary,
        currentStreak: state.userProfile.stats.currentStreak,
        longestStreak: state.userProfile.stats.longestStreak,
        totalStudyTime: state.userProfile.stats.totalStudyTime,
        accuracy: Math.round(accuracy * 100),
      },
    });
  };

  const value: LanguageLearnerContextType = {
    state,
    dispatch,
    addLesson,
    updateLesson,
    addVocabulary,
    updateVocabulary,
    addGrammar,
    updateGrammar,
    addProgress,
    addQuiz,
    addConversation,
    updateUserProfile,
    unlockAchievement,
    getLessonProgress,
    getVocabularyProgress,
    calculateStats,
  };

  return (
    <LanguageLearnerContext.Provider value={value}>
      {children}
    </LanguageLearnerContext.Provider>
  );
}

export function useLanguageLearner() {
  const context = useContext(LanguageLearnerContext);
  if (context === undefined) {
    throw new Error('useLanguageLearner must be used within a LanguageLearnerProvider');
  }
  return context;
} 