import { MMKV } from 'react-native-mmkv';
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

class DigitalDetoxService {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV();
    this.seedDefaultData();
  }

  // Storage Keys
  private readonly KEYS = {
    CHALLENGES: 'digital_detox_challenges',
    SESSIONS: 'digital_detox_sessions',
    USER_PROFILE: 'digital_detox_user_profile',
    GOALS: 'digital_detox_goals',
    ACHIEVEMENTS: 'digital_detox_achievements',
    SETTINGS: 'digital_detox_settings',
    SESSION_STATE: 'digital_detox_session_state',
    STATISTICS: 'digital_detox_statistics',
  };

  private seedDefaultData() {
    // Seed default challenges if none exist
    if (!this.storage.contains(this.KEYS.CHALLENGES)) {
      const defaultChallenges: Challenge[] = [
        {
          id: '1',
          name: 'Focus Mode',
          description: 'Stay focused on work without social media distractions',
          durationMinutes: 25,
          category: 'focus',
          difficulty: 'easy',
          icon: '🎯',
          color: '#4CAF50',
          tips: [
            'Put your phone in another room',
            'Use website blockers',
            'Set specific work hours',
          ],
          benefits: [
            'Improved concentration',
            'Higher productivity',
            'Better work quality',
          ],
          isCustom: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Social Media Detox',
          description: 'Take a break from all social media platforms',
          durationMinutes: 60,
          category: 'social',
          difficulty: 'medium',
          icon: '📱',
          color: '#2196F3',
          tips: [
            'Delete apps temporarily',
            'Log out of all accounts',
            'Find alternative activities',
          ],
          benefits: [
            'Reduced anxiety',
            'More real connections',
            'Better mental health',
          ],
          isCustom: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Gaming Break',
          description: 'Take a break from video games and gaming content',
          durationMinutes: 120,
          category: 'gaming',
          difficulty: 'hard',
          icon: '🎮',
          color: '#FF9800',
          tips: [
            'Uninstall games temporarily',
            'Find outdoor activities',
            'Connect with non-gaming friends',
          ],
          benefits: [
            'More physical activity',
            'Better sleep',
            'New hobbies',
          ],
          isCustom: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          name: 'Entertainment Detox',
          description: 'Avoid streaming services and entertainment apps',
          durationMinutes: 180,
          category: 'entertainment',
          difficulty: 'expert',
          icon: '📺',
          color: '#9C27B0',
          tips: [
            'Cancel streaming subscriptions',
            'Read books instead',
            'Explore creative hobbies',
          ],
          benefits: [
            'More reading time',
            'Creative pursuits',
            'Better focus',
          ],
          isCustom: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          name: 'Productivity Boost',
          description: 'Focus on productive tasks without digital distractions',
          durationMinutes: 90,
          category: 'productivity',
          difficulty: 'medium',
          icon: '⚡',
          color: '#F44336',
          tips: [
            'Use productivity apps',
            'Set clear goals',
            'Track your progress',
          ],
          benefits: [
            'Accomplish more tasks',
            'Better time management',
            'Increased satisfaction',
          ],
          isCustom: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.storage.set(this.KEYS.CHALLENGES, JSON.stringify(defaultChallenges));
    }

    // Seed default achievements
    if (!this.storage.contains(this.KEYS.ACHIEVEMENTS)) {
      const defaultAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Step',
          description: 'Complete your first detox session',
          icon: '🌟',
          category: 'sessions',
          requirement: { type: 'sessions', value: 1 },
          unlocked: false,
          progress: 0,
          rarity: 'common',
        },
        {
          id: '2',
          title: 'Streak Master',
          description: 'Maintain a 7-day streak',
          icon: '🔥',
          category: 'streak',
          requirement: { type: 'streak', value: 7 },
          unlocked: false,
          progress: 0,
          rarity: 'uncommon',
        },
        {
          id: '3',
          title: 'Hour Warrior',
          description: 'Complete 10 hours of detox sessions',
          icon: '⏰',
          category: 'duration',
          requirement: { type: 'minutes', value: 600 },
          unlocked: false,
          progress: 0,
          rarity: 'rare',
        },
        {
          id: '4',
          title: 'Dedication',
          description: 'Complete 50 sessions',
          icon: '💎',
          category: 'sessions',
          requirement: { type: 'sessions', value: 50 },
          unlocked: false,
          progress: 0,
          rarity: 'epic',
        },
        {
          id: '5',
          title: 'Digital Master',
          description: 'Complete 100 hours of detox sessions',
          icon: '👑',
          category: 'duration',
          requirement: { type: 'minutes', value: 6000 },
          unlocked: false,
          progress: 0,
          rarity: 'legendary',
        },
      ];
      this.storage.set(this.KEYS.ACHIEVEMENTS, JSON.stringify(defaultAchievements));
    }

    // Seed default settings
    if (!this.storage.contains(this.KEYS.SETTINGS)) {
      const defaultSettings: AppSettings = {
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
      };
      this.storage.set(this.KEYS.SETTINGS, JSON.stringify(defaultSettings));
    }

    // Initialize user profile if not exists
    if (!this.storage.contains(this.KEYS.USER_PROFILE)) {
      const defaultProfile: UserProfile = {
        id: '1',
        name: 'User',
        totalSessions: 0,
        totalMinutes: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageSessionDuration: 0,
        favoriteChallenges: [],
        goals: [],
        preferences: {
          theme: 'auto',
          notifications: {
            sessionReminders: true,
            goalReminders: true,
            streakReminders: true,
            weeklyReports: true,
          },
          privacy: {
            shareStats: false,
            shareAchievements: false,
          },
          sound: {
            sessionStart: true,
            sessionEnd: true,
            achievements: true,
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.storage.set(this.KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
    }
  }

  // Challenge Management
  async getChallenges(): Promise<Challenge[]> {
    try {
      const data = this.storage.getString(this.KEYS.CHALLENGES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting challenges:', error);
      return [];
    }
  }

  async getChallenge(id: string): Promise<Challenge | null> {
    try {
      const challenges = await this.getChallenges();
      return challenges.find(c => c.id === id) || null;
    } catch (error) {
      console.error('Error getting challenge:', error);
      return null;
    }
  }

  async addChallenge(challenge: Omit<Challenge, 'id' | 'createdAt' | 'updatedAt'>): Promise<Challenge> {
    try {
      const challenges = await this.getChallenges();
      const newChallenge: Challenge = {
        ...challenge,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      challenges.push(newChallenge);
      this.storage.set(this.KEYS.CHALLENGES, JSON.stringify(challenges));
      return newChallenge;
    } catch (error) {
      console.error('Error adding challenge:', error);
      throw error;
    }
  }

  async updateChallenge(id: string, updates: Partial<Challenge>): Promise<Challenge | null> {
    try {
      const challenges = await this.getChallenges();
      const index = challenges.findIndex(c => c.id === id);
      
      if (index === -1) return null;
      
      challenges[index] = {
        ...challenges[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.CHALLENGES, JSON.stringify(challenges));
      return challenges[index];
    } catch (error) {
      console.error('Error updating challenge:', error);
      throw error;
    }
  }

  async deleteChallenge(id: string): Promise<boolean> {
    try {
      const challenges = await this.getChallenges();
      const filtered = challenges.filter(c => c.id !== id);
      this.storage.set(this.KEYS.CHALLENGES, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting challenge:', error);
      return false;
    }
  }

  // Session Management
  async getSessions(): Promise<Session[]> {
    try {
      const data = this.storage.getString(this.KEYS.SESSIONS);
      const sessions = data ? JSON.parse(data) : [];
      
      // Populate challenge data for each session
      const challenges = await this.getChallenges();
      return sessions.map(session => ({
        ...session,
        challenge: challenges.find(c => c.id === session.challengeId) || {
          id: session.challengeId,
          name: 'Unknown Challenge',
          description: '',
          durationMinutes: 0,
          category: 'custom',
          difficulty: 'easy',
          icon: '❓',
          color: '#666',
          tips: [],
          benefits: [],
          isCustom: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      }));
    } catch (error) {
      console.error('Error getting sessions:', error);
      return [];
    }
  }

  async getSession(id: string): Promise<Session | null> {
    try {
      const sessions = await this.getSessions();
      return sessions.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  async addSession(session: Omit<Session, 'id' | 'createdAt' | 'updatedAt'>): Promise<Session> {
    try {
      const sessions = await this.getSessions();
      const newSession: Session = {
        ...session,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      sessions.push(newSession);
      this.storage.set(this.KEYS.SESSIONS, JSON.stringify(sessions));
      
      // Update user profile statistics
      await this.updateUserStatistics();
      
      return newSession;
    } catch (error) {
      console.error('Error adding session:', error);
      throw error;
    }
  }

  async updateSession(id: string, updates: Partial<Session>): Promise<Session | null> {
    try {
      const sessions = await this.getSessions();
      const index = sessions.findIndex(s => s.id === id);
      
      if (index === -1) return null;
      
      sessions[index] = {
        ...sessions[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.SESSIONS, JSON.stringify(sessions));
      
      // Update user profile statistics
      await this.updateUserStatistics();
      
      return sessions[index];
    } catch (error) {
      console.error('Error updating session:', error);
      throw error;
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    try {
      const sessions = await this.getSessions();
      const filtered = sessions.filter(s => s.id !== id);
      this.storage.set(this.KEYS.SESSIONS, JSON.stringify(filtered));
      
      // Update user profile statistics
      await this.updateUserStatistics();
      
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  // User Profile Management
  async getUserProfile(): Promise<UserProfile | null> {
    try {
      const data = this.storage.getString(this.KEYS.USER_PROFILE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const profile = await this.getUserProfile();
      if (!profile) return null;
      
      const updatedProfile: UserProfile = {
        ...profile,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.USER_PROFILE, JSON.stringify(updatedProfile));
      return updatedProfile;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  // Goal Management
  async getGoals(): Promise<Goal[]> {
    try {
      const profile = await this.getUserProfile();
      return profile?.goals || [];
    } catch (error) {
      console.error('Error getting goals:', error);
      return [];
    }
  }

  async addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Goal> {
    try {
      const profile = await this.getUserProfile();
      if (!profile) throw new Error('User profile not found');
      
      const newGoal: Goal = {
        ...goal,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedGoals = [...profile.goals, newGoal];
      await this.updateUserProfile({ goals: updatedGoals });
      
      return newGoal;
    } catch (error) {
      console.error('Error adding goal:', error);
      throw error;
    }
  }

  async updateGoal(id: string, updates: Partial<Goal>): Promise<Goal | null> {
    try {
      const profile = await this.getUserProfile();
      if (!profile) return null;
      
      const goals = profile.goals.map(goal => 
        goal.id === id 
          ? { ...goal, ...updates, updatedAt: new Date().toISOString() }
          : goal
      );
      
      await this.updateUserProfile({ goals });
      return goals.find(g => g.id === id) || null;
    } catch (error) {
      console.error('Error updating goal:', error);
      throw error;
    }
  }

  async deleteGoal(id: string): Promise<boolean> {
    try {
      const profile = await this.getUserProfile();
      if (!profile) return false;
      
      const goals = profile.goals.filter(goal => goal.id !== id);
      await this.updateUserProfile({ goals });
      
      return true;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  }

  // Achievement Management
  async getAchievements(): Promise<Achievement[]> {
    try {
      const data = this.storage.getString(this.KEYS.ACHIEVEMENTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting achievements:', error);
      return [];
    }
  }

  async updateAchievement(id: string, updates: Partial<Achievement>): Promise<Achievement | null> {
    try {
      const achievements = await this.getAchievements();
      const index = achievements.findIndex(a => a.id === id);
      
      if (index === -1) return null;
      
      achievements[index] = {
        ...achievements[index],
        ...updates,
      };
      
      this.storage.set(this.KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
      return achievements[index];
    } catch (error) {
      console.error('Error updating achievement:', error);
      throw error;
    }
  }

  // Settings Management
  async getSettings(): Promise<AppSettings> {
    try {
      const data = this.storage.getString(this.KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
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
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      throw error;
    }
  }

  async updateSettings(updates: Partial<AppSettings>): Promise<AppSettings> {
    try {
      const settings = await this.getSettings();
      const updatedSettings: AppSettings = {
        ...settings,
        ...updates,
      };
      
      this.storage.set(this.KEYS.SETTINGS, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }

  // Session State Management
  async getSessionState(): Promise<SessionState | null> {
    try {
      const data = this.storage.getString(this.KEYS.SESSION_STATE);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting session state:', error);
      return null;
    }
  }

  async updateSessionState(state: Partial<SessionState>): Promise<SessionState> {
    try {
      const currentState = await this.getSessionState();
      const updatedState: SessionState = {
        currentSession: null,
        timer: {
          isActive: false,
          isPaused: false,
          seconds: 0,
          minutes: 0,
          hours: 0,
          totalSeconds: 0,
          targetSeconds: 0,
        },
        isInSession: false,
        sessionStartTime: null,
        interruptions: 0,
        ...currentState,
        ...state,
      };
      
      this.storage.set(this.KEYS.SESSION_STATE, JSON.stringify(updatedState));
      return updatedState;
    } catch (error) {
      console.error('Error updating session state:', error);
      throw error;
    }
  }

  // Statistics
  async getStatistics(): Promise<Statistics> {
    try {
      const sessions = await this.getSessions();
      const completedSessions = sessions.filter(s => s.completed);
      
      const totalSessions = completedSessions.length;
      const totalMinutes = completedSessions.reduce((sum, s) => sum + s.duration, 0);
      const averageSessionDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;
      
      // Calculate streak
      const sortedSessions = completedSessions
        .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
      
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      
      for (let i = 0; i < sortedSessions.length; i++) {
        const session = sortedSessions[i];
        const sessionDate = new Date(session.completedAt!).toDateString();
        const prevSessionDate = i > 0 ? new Date(sortedSessions[i - 1].completedAt!).toDateString() : null;
        
        if (prevSessionDate === sessionDate) {
          tempStreak++;
        } else {
          if (tempStreak > longestStreak) longestStreak = tempStreak;
          tempStreak = 1;
        }
      }
      
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      currentStreak = tempStreak;
      
      const completionRate = sessions.length > 0 ? (completedSessions.length / sessions.length) * 100 : 0;
      
      // Weekly and monthly breakdown
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const weeklyMinutes = completedSessions
        .filter(s => new Date(s.completedAt!) >= weekAgo)
        .reduce((sum, s) => sum + s.duration, 0);
      
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const monthlyMinutes = completedSessions
        .filter(s => new Date(s.completedAt!) >= monthAgo)
        .reduce((sum, s) => sum + s.duration, 0);
      
      // Category breakdown
      const categoryBreakdown = completedSessions.reduce((acc, session) => {
        const category = session.challenge.category;
        acc[category] = (acc[category] || 0) + session.duration;
        return acc;
      }, {} as Record<string, number>);
      
      // Mood trends (last 7 days)
      const recentSessions = completedSessions
        .filter(s => new Date(s.completedAt!) >= weekAgo)
        .filter(s => s.moodAfter !== undefined);
      
      const moodTrends = recentSessions.map(session => ({
        date: new Date(session.completedAt!).toISOString().split('T')[0],
        averageMood: session.moodAfter,
      }));
      
      return {
        totalSessions,
        totalMinutes,
        averageSessionDuration,
        currentStreak,
        longestStreak,
        completionRate,
        weeklyMinutes: [{ date: new Date().toISOString().split('T')[0], minutes: weeklyMinutes }],
        monthlyMinutes: [{ month: new Date().toISOString().slice(0, 7), minutes: monthlyMinutes }],
        categoryBreakdown: Object.entries(categoryBreakdown).map(([category, minutes]) => ({ category, minutes })),
        moodTrends,
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
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
      };
    }
  }

  private async updateUserStatistics(): Promise<void> {
    try {
      const statistics = await this.getStatistics();
      const profile = await this.getUserProfile();
      
      if (profile) {
        await this.updateUserProfile({
          totalSessions: statistics.totalSessions,
          totalMinutes: statistics.totalMinutes,
          averageSessionDuration: statistics.averageSessionDuration,
          currentStreak: statistics.currentStreak,
          longestStreak: statistics.longestStreak,
        });
      }
    } catch (error) {
      console.error('Error updating user statistics:', error);
    }
  }

  // Utility Methods
  async checkAchievements(): Promise<Achievement[]> {
    try {
      const achievements = await this.getAchievements();
      const statistics = await this.getStatistics();
      const sessions = await this.getSessions();
      
      const unlockedAchievements: Achievement[] = [];
      
      for (const achievement of achievements) {
        if (achievement.unlocked) continue;
        
        let progress = 0;
        let shouldUnlock = false;
        
        switch (achievement.requirement.type) {
          case 'sessions':
            progress = statistics.totalSessions;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'minutes':
            progress = statistics.totalMinutes;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'streak':
            progress = statistics.currentStreak;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
        }
        
        if (shouldUnlock) {
          achievement.unlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          achievement.progress = progress;
          unlockedAchievements.push(achievement);
          
          await this.updateAchievement(achievement.id, {
            unlocked: true,
            unlockedAt: achievement.unlockedAt,
            progress: achievement.progress,
          });
        } else {
          achievement.progress = progress;
          await this.updateAchievement(achievement.id, { progress: achievement.progress });
        }
      }
      
      return unlockedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  async exportData(): Promise<string> {
    try {
      const data = {
        challenges: await this.getChallenges(),
        sessions: await this.getSessions(),
        userProfile: await this.getUserProfile(),
        goals: await this.getGoals(),
        achievements: await this.getAchievements(),
        settings: await this.getSettings(),
        statistics: await this.getStatistics(),
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };
      
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  async importData(dataString: string): Promise<boolean> {
    try {
      const data = JSON.parse(dataString);
      
      if (data.challenges) this.storage.set(this.KEYS.CHALLENGES, JSON.stringify(data.challenges));
      if (data.sessions) this.storage.set(this.KEYS.SESSIONS, JSON.stringify(data.sessions));
      if (data.userProfile) this.storage.set(this.KEYS.USER_PROFILE, JSON.stringify(data.userProfile));
      if (data.achievements) this.storage.set(this.KEYS.ACHIEVEMENTS, JSON.stringify(data.achievements));
      if (data.settings) this.storage.set(this.KEYS.SETTINGS, JSON.stringify(data.settings));
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      this.storage.delete(this.KEYS.CHALLENGES);
      this.storage.delete(this.KEYS.SESSIONS);
      this.storage.delete(this.KEYS.USER_PROFILE);
      this.storage.delete(this.KEYS.GOALS);
      this.storage.delete(this.KEYS.ACHIEVEMENTS);
      this.storage.delete(this.KEYS.SETTINGS);
      this.storage.delete(this.KEYS.SESSION_STATE);
      this.storage.delete(this.KEYS.STATISTICS);
      
      // Re-seed default data
      this.seedDefaultData();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export default new DigitalDetoxService(); 