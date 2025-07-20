import { MMKV } from 'react-native-mmkv';
import { User, Deck, Flashcard, Review, StudySession, Progress, Achievement, NavigationProps } from '../types';

const storage = new MMKV();

export class LanguageFlashcardsService {
  private static instance: LanguageFlashcardsService;
  private storage: MMKV;

  private constructor() {
    this.storage = storage;
    this.seedDefaultData();
  }

  public static getInstance(): LanguageFlashcardsService {
    if (!LanguageFlashcardsService.instance) {
      LanguageFlashcardsService.instance = new LanguageFlashcardsService();
    }
    return LanguageFlashcardsService.instance;
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  private seedDefaultData(): void {
    // Seed default user
    if (!this.storage.contains('user')) {
      const defaultUser: User = {
        id: 'default-user',
        name: 'Language Learner',
        email: 'learner@example.com',
        createdAt: this.formatDate(new Date()),
        lastActive: this.formatDate(new Date()),
        preferences: {
          theme: 'light',
          notifications: true,
          soundEnabled: true,
          autoPlay: false,
          studyReminders: true,
          dailyGoal: 50
        },
        statistics: {
          totalCardsStudied: 0,
          totalStudyTime: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalDecks: 0,
          totalCards: 0,
          averageAccuracy: 0
        }
      };
      this.storage.set('user', JSON.stringify(defaultUser));
    }

    // Seed default decks
    if (!this.storage.contains('decks')) {
      const defaultDecks: Deck[] = [
        {
          id: 'basic-spanish',
          name: 'Basic Spanish',
          description: 'Essential Spanish vocabulary for beginners',
          language: 'Spanish',
          category: 'Beginner',
          cardCount: 0,
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          isPublic: true,
          tags: ['beginner', 'spanish', 'vocabulary'],
          difficulty: 'beginner',
          estimatedTime: 30,
          lastStudied: null,
          studyCount: 0,
          averageAccuracy: 0
        },
        {
          id: 'basic-french',
          name: 'Basic French',
          description: 'Essential French vocabulary for beginners',
          language: 'French',
          category: 'Beginner',
          cardCount: 0,
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          isPublic: true,
          tags: ['beginner', 'french', 'vocabulary'],
          difficulty: 'beginner',
          estimatedTime: 30,
          lastStudied: null,
          studyCount: 0,
          averageAccuracy: 0
        },
        {
          id: 'basic-german',
          name: 'Basic German',
          description: 'Essential German vocabulary for beginners',
          language: 'German',
          category: 'Beginner',
          cardCount: 0,
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          isPublic: true,
          tags: ['beginner', 'german', 'vocabulary'],
          difficulty: 'beginner',
          estimatedTime: 30,
          lastStudied: null,
          studyCount: 0,
          averageAccuracy: 0
        }
      ];
      this.storage.set('decks', JSON.stringify(defaultDecks));
    }

    // Seed default flashcards
    if (!this.storage.contains('flashcards')) {
      const defaultFlashcards: Flashcard[] = [
        // Spanish flashcards
        {
          id: 'spanish-1',
          deckId: 'basic-spanish',
          front: 'Hello',
          back: 'Hola',
          pronunciation: 'oh-lah',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['greetings', 'basic'],
          notes: 'Basic greeting',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        {
          id: 'spanish-2',
          deckId: 'basic-spanish',
          front: 'Goodbye',
          back: 'Adiós',
          pronunciation: 'ah-dee-ohs',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['greetings', 'basic'],
          notes: 'Farewell greeting',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        {
          id: 'spanish-3',
          deckId: 'basic-spanish',
          front: 'Thank you',
          back: 'Gracias',
          pronunciation: 'grah-see-ahs',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['politeness', 'basic'],
          notes: 'Expression of gratitude',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        // French flashcards
        {
          id: 'french-1',
          deckId: 'basic-french',
          front: 'Hello',
          back: 'Bonjour',
          pronunciation: 'bohn-zhoor',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['greetings', 'basic'],
          notes: 'Basic greeting',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        {
          id: 'french-2',
          deckId: 'basic-french',
          front: 'Goodbye',
          back: 'Au revoir',
          pronunciation: 'oh ruh-vwahr',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['greetings', 'basic'],
          notes: 'Farewell greeting',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        {
          id: 'french-3',
          deckId: 'basic-french',
          front: 'Thank you',
          back: 'Merci',
          pronunciation: 'mehr-see',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['politeness', 'basic'],
          notes: 'Expression of gratitude',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        // German flashcards
        {
          id: 'german-1',
          deckId: 'basic-german',
          front: 'Hello',
          back: 'Hallo',
          pronunciation: 'hah-loh',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['greetings', 'basic'],
          notes: 'Basic greeting',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        {
          id: 'german-2',
          deckId: 'basic-german',
          front: 'Goodbye',
          back: 'Auf Wiedersehen',
          pronunciation: 'owf vee-der-zayn',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['greetings', 'basic'],
          notes: 'Farewell greeting',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        },
        {
          id: 'german-3',
          deckId: 'basic-german',
          front: 'Thank you',
          back: 'Danke',
          pronunciation: 'dahn-kuh',
          audioUrl: null,
          difficulty: 'easy',
          createdAt: this.formatDate(new Date()),
          updatedAt: this.formatDate(new Date()),
          tags: ['politeness', 'basic'],
          notes: 'Expression of gratitude',
          reviewCount: 0,
          lastReviewed: null,
          nextReview: this.formatDate(new Date()),
          interval: 1,
          easeFactor: 2.5,
          consecutiveCorrect: 0,
          totalReviews: 0,
          correctReviews: 0
        }
      ];
      this.storage.set('flashcards', JSON.stringify(defaultFlashcards));
    }

    // Initialize other collections
    if (!this.storage.contains('reviews')) {
      this.storage.set('reviews', JSON.stringify([]));
    }
    if (!this.storage.contains('studySessions')) {
      this.storage.set('studySessions', JSON.stringify([]));
    }
    if (!this.storage.contains('progress')) {
      this.storage.set('progress', JSON.stringify([]));
    }
    if (!this.storage.contains('achievements')) {
      this.storage.set('achievements', JSON.stringify([]));
    }

    // Update deck card counts
    this.updateDeckCardCounts();
  }

  private updateDeckCardCounts(): void {
    const decks = this.getDecks();
    const flashcards = this.getFlashcards();

    const updatedDecks = decks.map(deck => ({
      ...deck,
      cardCount: flashcards.filter(card => card.deckId === deck.id).length
    }));

    this.storage.set('decks', JSON.stringify(updatedDecks));
  }

  // User operations
  public getUser(): User {
    const userData = this.storage.getString('user');
    return userData ? JSON.parse(userData) : null;
  }

  public updateUser(updates: Partial<User>): User {
    const user = this.getUser();
    const updatedUser = { ...user, ...updates, updatedAt: this.formatDate(new Date()) };
    this.storage.set('user', JSON.stringify(updatedUser));
    return updatedUser;
  }

  // Deck operations
  public getDecks(): Deck[] {
    const decksData = this.storage.getString('decks');
    return decksData ? JSON.parse(decksData) : [];
  }

  public getDeckById(id: string): Deck | null {
    const decks = this.getDecks();
    return decks.find(deck => deck.id === id) || null;
  }

  public createDeck(deck: Omit<Deck, 'id' | 'createdAt' | 'updatedAt' | 'cardCount' | 'lastStudied' | 'studyCount' | 'averageAccuracy'>): Deck {
    const newDeck: Deck = {
      ...deck,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date()),
      cardCount: 0,
      lastStudied: null,
      studyCount: 0,
      averageAccuracy: 0
    };

    const decks = this.getDecks();
    decks.push(newDeck);
    this.storage.set('decks', JSON.stringify(decks));
    return newDeck;
  }

  public updateDeck(id: string, updates: Partial<Deck>): Deck | null {
    const decks = this.getDecks();
    const index = decks.findIndex(deck => deck.id === id);
    if (index === -1) return null;

    decks[index] = {
      ...decks[index],
      ...updates,
      updatedAt: this.formatDate(new Date())
    };

    this.storage.set('decks', JSON.stringify(decks));
    return decks[index];
  }

  public deleteDeck(id: string): boolean {
    const decks = this.getDecks();
    const filteredDecks = decks.filter(deck => deck.id !== id);
    
    if (filteredDecks.length === decks.length) return false;
    
    this.storage.set('decks', JSON.stringify(filteredDecks));
    
    // Delete associated flashcards
    const flashcards = this.getFlashcards();
    const filteredFlashcards = flashcards.filter(card => card.deckId !== id);
    this.storage.set('flashcards', JSON.stringify(filteredFlashcards));
    
    return true;
  }

  // Flashcard operations
  public getFlashcards(): Flashcard[] {
    const flashcardsData = this.storage.getString('flashcards');
    return flashcardsData ? JSON.parse(flashcardsData) : [];
  }

  public getFlashcardsByDeck(deckId: string): Flashcard[] {
    const flashcards = this.getFlashcards();
    return flashcards.filter(card => card.deckId === deckId);
  }

  public getFlashcardById(id: string): Flashcard | null {
    const flashcards = this.getFlashcards();
    return flashcards.find(card => card.id === id) || null;
  }

  public createFlashcard(flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt' | 'reviewCount' | 'lastReviewed' | 'nextReview' | 'interval' | 'easeFactor' | 'consecutiveCorrect' | 'totalReviews' | 'correctReviews'>): Flashcard {
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date()),
      reviewCount: 0,
      lastReviewed: null,
      nextReview: this.formatDate(new Date()),
      interval: 1,
      easeFactor: 2.5,
      consecutiveCorrect: 0,
      totalReviews: 0,
      correctReviews: 0
    };

    const flashcards = this.getFlashcards();
    flashcards.push(newFlashcard);
    this.storage.set('flashcards', JSON.stringify(flashcards));
    
    // Update deck card count
    this.updateDeckCardCounts();
    
    return newFlashcard;
  }

  public updateFlashcard(id: string, updates: Partial<Flashcard>): Flashcard | null {
    const flashcards = this.getFlashcards();
    const index = flashcards.findIndex(card => card.id === id);
    if (index === -1) return null;

    flashcards[index] = {
      ...flashcards[index],
      ...updates,
      updatedAt: this.formatDate(new Date())
    };

    this.storage.set('flashcards', JSON.stringify(flashcards));
    return flashcards[index];
  }

  public deleteFlashcard(id: string): boolean {
    const flashcards = this.getFlashcards();
    const filteredFlashcards = flashcards.filter(card => card.id !== id);
    
    if (filteredFlashcards.length === flashcards.length) return false;
    
    this.storage.set('flashcards', JSON.stringify(filteredFlashcards));
    this.updateDeckCardCounts();
    
    return true;
  }

  // Spaced repetition algorithm
  public reviewFlashcard(cardId: string, quality: number): Review {
    const card = this.getFlashcardById(cardId);
    if (!card) throw new Error('Flashcard not found');

    const now = new Date();
    const review: Review = {
      id: this.generateId(),
      cardId,
      deckId: card.deckId,
      quality,
      reviewedAt: this.formatDate(now),
      timeSpent: 0, // TODO: Implement time tracking
      wasCorrect: quality >= 3
    };

    // Update card based on spaced repetition algorithm
    const updatedCard = this.updateCardWithSpacedRepetition(card, quality);
    this.updateFlashcard(cardId, updatedCard);

    // Save review
    const reviews = this.getReviews();
    reviews.push(review);
    this.storage.set('reviews', JSON.stringify(reviews));

    return review;
  }

  private updateCardWithSpacedRepetition(card: Flashcard, quality: number): Partial<Flashcard> {
    const now = new Date();
    const wasCorrect = quality >= 3;
    
    let newInterval: number;
    let newEaseFactor: number;
    let newConsecutiveCorrect: number;

    if (wasCorrect) {
      newConsecutiveCorrect = card.consecutiveCorrect + 1;
      
      if (card.reviewCount === 0) {
        newInterval = 1;
      } else if (card.reviewCount === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(card.interval * card.easeFactor);
      }
      
      newEaseFactor = card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      newConsecutiveCorrect = 0;
      newInterval = 1;
      newEaseFactor = Math.max(1.3, card.easeFactor - 0.2);
    }

    const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

    return {
      reviewCount: card.reviewCount + 1,
      lastReviewed: this.formatDate(now),
      nextReview: this.formatDate(nextReview),
      interval: newInterval,
      easeFactor: newEaseFactor,
      consecutiveCorrect: newConsecutiveCorrect,
      totalReviews: card.totalReviews + 1,
      correctReviews: card.correctReviews + (wasCorrect ? 1 : 0)
    };
  }

  public getDueCards(deckId?: string): Flashcard[] {
    const flashcards = deckId ? this.getFlashcardsByDeck(deckId) : this.getFlashcards();
    const now = new Date();
    
    return flashcards.filter(card => {
      const nextReview = new Date(card.nextReview);
      return nextReview <= now;
    });
  }

  // Review operations
  public getReviews(): Review[] {
    const reviewsData = this.storage.getString('reviews');
    return reviewsData ? JSON.parse(reviewsData) : [];
  }

  public getReviewsByDeck(deckId: string): Review[] {
    const reviews = this.getReviews();
    return reviews.filter(review => review.deckId === deckId);
  }

  public getReviewsByCard(cardId: string): Review[] {
    const reviews = this.getReviews();
    return reviews.filter(review => review.cardId === cardId);
  }

  // Study session operations
  public getStudySessions(): StudySession[] {
    const sessionsData = this.storage.getString('studySessions');
    return sessionsData ? JSON.parse(sessionsData) : [];
  }

  public createStudySession(session: Omit<StudySession, 'id' | 'createdAt' | 'updatedAt'>): StudySession {
    const newSession: StudySession = {
      ...session,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date())
    };

    const sessions = this.getStudySessions();
    sessions.push(newSession);
    this.storage.set('studySessions', JSON.stringify(sessions));
    return newSession;
  }

  public updateStudySession(id: string, updates: Partial<StudySession>): StudySession | null {
    const sessions = this.getStudySessions();
    const index = sessions.findIndex(session => session.id === id);
    if (index === -1) return null;

    sessions[index] = {
      ...sessions[index],
      ...updates,
      updatedAt: this.formatDate(new Date())
    };

    this.storage.set('studySessions', JSON.stringify(sessions));
    return sessions[index];
  }

  // Progress operations
  public getProgress(): Progress[] {
    const progressData = this.storage.getString('progress');
    return progressData ? JSON.parse(progressData) : [];
  }

  public getProgressByDeck(deckId: string): Progress[] {
    const progress = this.getProgress();
    return progress.filter(p => p.deckId === deckId);
  }

  public createProgress(progress: Omit<Progress, 'id' | 'createdAt' | 'updatedAt'>): Progress {
    const newProgress: Progress = {
      ...progress,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date())
    };

    const progressList = this.getProgress();
    progressList.push(newProgress);
    this.storage.set('progress', JSON.stringify(progressList));
    return newProgress;
  }

  // Achievement operations
  public getAchievements(): Achievement[] {
    const achievementsData = this.storage.getString('achievements');
    return achievementsData ? JSON.parse(achievementsData) : [];
  }

  public createAchievement(achievement: Omit<Achievement, 'id' | 'createdAt' | 'updatedAt'>): Achievement {
    const newAchievement: Achievement = {
      ...achievement,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date())
    };

    const achievements = this.getAchievements();
    achievements.push(newAchievement);
    this.storage.set('achievements', JSON.stringify(achievements));
    return newAchievement;
  }

  // Data export/import
  public exportData(): string {
    const data = {
      user: this.getUser(),
      decks: this.getDecks(),
      flashcards: this.getFlashcards(),
      reviews: this.getReviews(),
      studySessions: this.getStudySessions(),
      progress: this.getProgress(),
      achievements: this.getAchievements(),
      exportDate: this.formatDate(new Date())
    };
    return JSON.stringify(data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.user) this.storage.set('user', JSON.stringify(data.user));
      if (data.decks) this.storage.set('decks', JSON.stringify(data.decks));
      if (data.flashcards) this.storage.set('flashcards', JSON.stringify(data.flashcards));
      if (data.reviews) this.storage.set('reviews', JSON.stringify(data.reviews));
      if (data.studySessions) this.storage.set('studySessions', JSON.stringify(data.studySessions));
      if (data.progress) this.storage.set('progress', JSON.stringify(data.progress));
      if (data.achievements) this.storage.set('achievements', JSON.stringify(data.achievements));
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  public clearAllData(): void {
    this.storage.clearAll();
    this.seedDefaultData();
  }
} 