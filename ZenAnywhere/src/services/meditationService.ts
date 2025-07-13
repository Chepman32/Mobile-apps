import { BaseApiService } from './api/base';
import { 
  MeditationSession, 
  MeditationSeries, 
  UserProgress, 
  UserFavorite, 
  UserRating,
  Category,
  Playlist
} from '@types/models';
import { firebase } from '@react-native-firebase/firestore';

class MeditationService extends BaseApiService<MeditationSession> {
  constructor() {
    super('meditation_sessions');
  }

  // Get featured meditation sessions
  async getFeaturedSessions(limit: number = 5): Promise<MeditationSession[]> {
    return this.query(
      [['isFeatured', '==', true]],
      ['createdAt', 'desc'],
      limit
    );
  }

  // Get sessions by category
  async getSessionsByCategory(
    categoryId: string, 
    limit: number = 10,
    lastVisible?: any
  ): Promise<{ sessions: MeditationSession[], lastVisible: any }> {
    let query = this.collection
      .where('category', '==', categoryId)
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }
    
    const snapshot = await query.get();
    const sessions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MeditationSession[];
    
    return {
      sessions,
      lastVisible: snapshot.docs[snapshot.docs.length - 1]
    };
  }

  // Get session by ID with additional data
  async getSessionWithDetails(sessionId: string, userId: string) {
    const session = await this.getById(sessionId);
    if (!session) return null;
    
    // Get user progress for this session
    const progressService = new UserProgressService();
    const progress = await progressService.getUserProgress(userId);
    
    // Get user rating for this session
    const ratingService = new RatingService();
    const userRating = await ratingService.getUserRating(userId, sessionId);
    
    // Get similar sessions
    const similarSessions = await this.getSimilarSessions(sessionId, session.category);
    
    return {
      ...session,
      userProgress: progress?.completedSessions.find(s => s.sessionId === sessionId),
      userRating,
      similarSessions
    };
  }

  // Get similar sessions
  private async getSimilarSessions(
    excludeSessionId: string, 
    category: string,
    limit: number = 3
  ): Promise<MeditationSession[]> {
    return this.query(
      [
        ['category', '==', category],
        ['id', '!=', excludeSessionId]
      ],
      ['playCount', 'desc'],
      limit
    );
  }

  // Increment play count
  async incrementPlayCount(sessionId: string): Promise<void> {
    await this.collection.doc(sessionId).update({
      playCount: firebase.firestore.FieldValue.increment(1),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}

class SeriesService extends BaseApiService<MeditationSeries> {
  constructor() {
    super('meditation_series');
  }

  // Get featured series
  async getFeaturedSeries(limit: number = 5): Promise<MeditationSeries[]> {
    return this.query(
      [['isFeatured', '==', true]],
      ['createdAt', 'desc'],
      limit
    );
  }

  // Get series with sessions
  async getSeriesWithSessions(seriesId: string): Promise<{
    series: MeditationSeries;
    sessions: MeditationSession[];
  } | null> {
    const series = await this.getById(seriesId);
    if (!series) return null;
    
    const meditationService = new MeditationService();
    const sessions = await Promise.all(
      series.sessions.map(sessionId => meditationService.getById(sessionId))
    );
    
    return {
      series,
      sessions: sessions.filter(Boolean) as MeditationSession[]
    };
  }
}

class UserProgressService extends BaseApiService<UserProgress> {
  constructor() {
    super('user_progress');
  }

  // Get or create user progress
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    const progress = await this.query([['userId', '==', userId]], undefined, 1);
    
    if (progress.length > 0) {
      return progress[0];
    }
    
    // Create new progress record
    const newProgress: Omit<UserProgress, 'id'> = {
      userId,
      completedSessions: [],
      inProgressSessions: [],
      totalMinutesMeditated: 0,
      currentStreak: 0,
      favoriteCategories: [],
      achievements: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp() as any,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp() as any
    };
    
    const docRef = await this.collection.add(newProgress);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as UserProgress;
  }

  // Add completed session
  async addCompletedSession(
    userId: string,
    sessionId: string,
    durationCompleted: number
  ): Promise<void> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return;
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Check if session is already completed
    const existingIndex = progress.completedSessions.findIndex(
      s => s.sessionId === sessionId
    );
    
    const completedSession = {
      sessionId,
      completedAt: firebase.firestore.FieldValue.serverTimestamp(),
      durationCompleted,
      isFullyCompleted: durationCompleted >= 0.9 * 60 // 90% of session duration
    };
    
    if (existingIndex >= 0) {
      // Update existing
      progress.completedSessions[existingIndex] = completedSession;
    } else {
      // Add new
      progress.completedSessions.push(completedSession);
    }
    
    // Update streak
    const lastMeditationDate = progress.lastMeditationDate?.toDate() || new Date(0);
    const lastMeditationDay = new Date(
      lastMeditationDate.getFullYear(),
      lastMeditationDate.getMonth(),
      lastMeditationDate.getDate()
    );
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let { currentStreak } = progress;
    if (lastMeditationDay.getTime() === yesterday.getTime()) {
      // Consecutive day
      currentStreak += 1;
    } else if (lastMeditationDay.getTime() < yesterday.getTime()) {
      // Missed a day, reset streak
      currentStreak = 1;
    }
    // If same day, streak remains the same
    
    // Update progress
    await this.update(progress.id, {
      completedSessions: progress.completedSessions,
      inProgressSessions: progress.inProgressSessions.filter(s => s.sessionId !== sessionId),
      totalMinutesMeditated: firebase.firestore.FieldValue.increment(Math.floor(durationCompleted / 60)),
      currentStreak,
      lastMeditationDate: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  
  // Update in-progress session
  async updateInProgressSession(
    userId: string,
    sessionId: string,
    position: number
  ): Promise<void> {
    const progress = await this.getUserProgress(userId);
    if (!progress) return;
    
    const existingIndex = progress.inProgressSessions.findIndex(
      s => s.sessionId === sessionId
    );
    
    const inProgressSession = {
      sessionId,
      lastPlayedAt: firebase.firestore.FieldValue.serverTimestamp(),
      lastPosition: position
    };
    
    if (existingIndex >= 0) {
      progress.inProgressSessions[existingIndex] = inProgressSession;
    } else {
      progress.inProgressSessions.push(inProgressSession);
    }
    
    await this.update(progress.id, {
      inProgressSessions: progress.inProgressSessions,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  
  // Get user's in-progress sessions
  async getInProgressSessions(userId: string, limit: number = 5): Promise<{
    session: MeditationSession;
    lastPosition: number;
    lastPlayedAt: Date;
  }[]> {
    const progress = await this.getUserProgress(userId);
    if (!progress || progress.inProgressSessions.length === 0) return [];
    
    // Sort by last played
    const sortedSessions = [...progress.inProgressSessions].sort((a, b) => 
      (b.lastPlayedAt?.toDate()?.getTime() || 0) - (a.lastPlayedAt?.toDate()?.getTime() || 0)
    ).slice(0, limit);
    
    const meditationService = new MeditationService();
    const result = await Promise.all(
      sortedSessions.map(async (session) => {
        const sessionData = await meditationService.getById(session.sessionId);
        return {
          session: sessionData!,
          lastPosition: session.lastPosition,
          lastPlayedAt: session.lastPlayedAt?.toDate() || new Date()
        };
      })
    );
    
    return result.filter(item => item.session !== null);
  }
}

class FavoriteService extends BaseApiService<UserFavorite> {
  constructor() {
    super('user_favorites');
  }
  
  // Add to favorites
  async addFavorite(userId: string, sessionId: string): Promise<void> {
    const existing = await this.query([
      ['userId', '==', userId],
      ['sessionId', '==', sessionId]
    ]);
    
    if (existing.length === 0) {
      await this.create({
        userId,
        sessionId,
        favoritedAt: firebase.firestore.FieldValue.serverTimestamp()
      } as any);
      
      // Increment favorite count on session
      await firebase.firestore()
        .collection('meditation_sessions')
        .doc(sessionId)
        .update({
          favoriteCount: firebase.firestore.FieldValue.increment(1)
        });
    }
  }
  
  // Remove from favorites
  async removeFavorite(userId: string, sessionId: string): Promise<void> {
    const favorites = await this.query([
      ['userId', '==', userId],
      ['sessionId', '==', sessionId]
    ]);
    
    if (favorites.length > 0) {
      await this.delete(favorites[0].id);
      
      // Decrement favorite count on session
      await firebase.firestore()
        .collection('meditation_sessions')
        .doc(sessionId)
        .update({
          favoriteCount: firebase.firestore.FieldValue.increment(-1)
        });
    }
  }
  
  // Check if session is favorited
  async isFavorited(userId: string, sessionId: string): Promise<boolean> {
    const favorites = await this.query([
      ['userId', '==', userId],
      ['sessionId', '==', sessionId]
    ]);
    
    return favorites.length > 0;
  }
  
  // Get user's favorite sessions
  async getUserFavorites(userId: string, limit: number = 20): Promise<MeditationSession[]> {
    const favorites = await this.query(
      [['userId', '==', userId]],
      ['favoritedAt', 'desc'],
      limit
    );
    
    const meditationService = new MeditationService();
    const sessions = await Promise.all(
      favorites.map(fav => meditationService.getById(fav.sessionId))
    );
    
    return sessions.filter(Boolean) as MeditationSession[];
  }
}

class RatingService extends BaseApiService<UserRating> {
  constructor() {
    super('user_ratings');
  }
  
  // Add or update rating
  async rateSession(
    userId: string,
    sessionId: string,
    rating: number,
    comment?: string
  ): Promise<void> {
    const existing = await this.getUserRating(userId, sessionId);
    const now = firebase.firestore.FieldValue.serverTimestamp();
    
    if (existing) {
      // Update existing rating
      await this.update(existing.id, {
        rating,
        comment: comment || existing.comment,
        updatedAt: now
      });
    } else {
      // Create new rating
      await this.create({
        userId,
        sessionId,
        rating,
        comment,
        createdAt: now,
        updatedAt: now
      } as any);
    }
    
    // Update session's average rating
    await this.updateSessionRating(sessionId);
  }
  
  // Get user's rating for a session
  async getUserRating(userId: string, sessionId: string): Promise<UserRating | null> {
    const ratings = await this.query([
      ['userId', '==', userId],
      ['sessionId', '==', sessionId]
    ]);
    
    return ratings.length > 0 ? ratings[0] : null;
  }
  
  // Get all ratings for a session
  async getSessionRatings(
    sessionId: string,
    limit: number = 20,
    lastVisible?: any
  ): Promise<{ ratings: UserRating[], lastVisible: any }> {
    let query = this.collection
      .where('sessionId', '==', sessionId)
      .orderBy('createdAt', 'desc')
      .limit(limit);
    
    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }
    
    const snapshot = await query.get();
    const ratings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as UserRating[];
    
    return {
      ratings,
      lastVisible: snapshot.docs[snapshot.docs.length - 1]
    };
  }
  
  // Update session's average rating
  private async updateSessionRating(sessionId: string): Promise<void> {
    const ratings = await this.query([['sessionId', '==', sessionId]]);
    
    if (ratings.length === 0) return;
    
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = totalRating / ratings.length;
    
    await firebase.firestore()
      .collection('meditation_sessions')
      .doc(sessionId)
      .update({
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalRatings: ratings.length,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
  }
}

class CategoryService extends BaseApiService<Category> {
  constructor() {
    super('categories');
  }
  
  // Get all categories
  async getAllCategories(): Promise<Category[]> {
    return this.query(
      [],
      ['order', 'asc']
    );
  }
  
  // Get featured categories
  async getFeaturedCategories(limit: number = 5): Promise<Category[]> {
    return this.query(
      [['isFeatured', '==', true]],
      ['order', 'asc'],
      limit
    );
  }
  
  // Get category with sessions
  async getCategoryWithSessions(categoryId: string, limit: number = 10) {
    const category = await this.getById(categoryId);
    if (!category) return null;
    
    const meditationService = new MeditationService();
    const sessions = await meditationService.query(
      [['category', '==', categoryId]],
      ['createdAt', 'desc'],
      limit
    );
    
    return {
      category,
      sessions
    };
  }
}

class PlaylistService extends BaseApiService<Playlist> {
  constructor() {
    super('playlists');
  }
  
  // Get user's playlists
  async getUserPlaylists(userId: string): Promise<Playlist[]> {
    return this.query(
      [['userId', '==', userId]],
      ['updatedAt', 'desc']
    );
  }
  
  // Create a new playlist
  async createPlaylist(
    userId: string,
    name: string,
    description?: string,
    isPublic: boolean = false
  ): Promise<Playlist> {
    const now = firebase.firestore.FieldValue.serverTimestamp();
    
    const playlist: Omit<Playlist, 'id'> = {
      userId,
      name,
      description,
      sessions: [],
      isPublic,
      createdAt: now as any,
      updatedAt: now as any
    };
    
    const docRef = await this.collection.add(playlist);
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Playlist;
  }
  
  // Add session to playlist
  async addToPlaylist(playlistId: string, sessionId: string): Promise<void> {
    const playlist = await this.getById(playlistId);
    if (!playlist) throw new Error('Playlist not found');
    
    if (!playlist.sessions.includes(sessionId)) {
      await this.update(playlistId, {
        sessions: [...playlist.sessions, sessionId],
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
  }
  
  // Remove session from playlist
  async removeFromPlaylist(playlistId: string, sessionId: string): Promise<void> {
    const playlist = await this.getById(playlistId);
    if (!playlist) throw new Error('Playlist not found');
    
    const updatedSessions = playlist.sessions.filter(id => id !== sessionId);
    
    await this.update(playlistId, {
      sessions: updatedSessions,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
  
  // Get playlist with sessions
  async getPlaylistWithSessions(playlistId: string) {
    const playlist = await this.getById(playlistId);
    if (!playlist) return null;
    
    const meditationService = new MeditationService();
    const sessions = await Promise.all(
      playlist.sessions.map(sessionId => meditationService.getById(sessionId))
    );
    
    return {
      playlist,
      sessions: sessions.filter(Boolean) as MeditationSession[]
    };
  }
}

// Export service instances
export const meditationService = new MeditationService();
export const seriesService = new SeriesService();
export const userProgressService = new UserProgressService();
export const favoriteService = new FavoriteService();
export const ratingService = new RatingService();
export const categoryService = new CategoryService();
export const playlistService = new PlaylistService();

// Export types for easier imports
export type { 
  MeditationSession, 
  MeditationSeries, 
  UserProgress, 
  UserFavorite, 
  UserRating,
  Category,
  Playlist 
};
