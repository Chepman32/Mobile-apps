import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  Comic,
  Panel,
  Character,
  StoryElement,
  Animation,
  SpeechBubble,
  ThoughtBubble,
  SoundEffect,
  Narration,
  UserProfile,
  Achievement,
  Template,
  PublishingSettings,
  AppSettings,
  ComicStatistics,
  ExportData,
  ImportData,
} from '../types';

class ComicCrafterService {
  private static instance: ComicCrafterService;
  private comics: Comic[] = [];
  private characters: Character[] = [];
  private templates: Template[] = [];
  private userProfile: UserProfile | null = null;
  private achievements: Achievement[] = [];
  private appSettings: AppSettings | null = null;
  private publishingSettings: PublishingSettings | null = null;

  static getInstance(): ComicCrafterService {
    if (!ComicCrafterService.instance) {
      ComicCrafterService.instance = new ComicCrafterService();
    }
    return ComicCrafterService.instance;
  }

  // Data seeding
  async seedData(): Promise<void> {
    const seeded = await AsyncStorage.getItem('comic_crafter_seeded');
    if (seeded) return;

    // Seed templates
    const defaultTemplates: Template[] = [
      {
        id: '1',
        name: 'Superhero Adventure',
        description: 'Classic superhero comic template',
        thumbnail: '🦸',
        panels: [
          { id: '1', type: 'action', content: 'Hero poses dramatically' },
          { id: '2', type: 'dialogue', content: 'Villain monologue' },
          { id: '3', type: 'climax', content: 'Epic battle scene' },
        ],
        characters: ['hero', 'villain', 'sidekick'],
        genre: 'superhero',
        difficulty: 'beginner',
      },
      {
        id: '2',
        name: 'Slice of Life',
        description: 'Everyday moments and emotions',
        thumbnail: '🏠',
        panels: [
          { id: '1', type: 'establishing', content: 'Home setting' },
          { id: '2', type: 'dialogue', content: 'Family conversation' },
          { id: '3', type: 'resolution', content: 'Warm moment' },
        ],
        characters: ['family', 'friends'],
        genre: 'slice-of-life',
        difficulty: 'beginner',
      },
      {
        id: '3',
        name: 'Sci-Fi Mystery',
        description: 'Futuristic detective story',
        thumbnail: '🚀',
        panels: [
          { id: '1', type: 'mystery', content: 'Strange discovery' },
          { id: '2', type: 'investigation', content: 'Clues gathering' },
          { id: '3', type: 'reveal', content: 'Truth uncovered' },
        ],
        characters: ['detective', 'suspect', 'witness'],
        genre: 'sci-fi',
        difficulty: 'intermediate',
      },
    ];

    // Seed characters
    const defaultCharacters: Character[] = [
      {
        id: '1',
        name: 'Hero',
        description: 'Brave protagonist',
        appearance: 'Tall, muscular, confident pose',
        personality: 'Courageous, determined, selfless',
        expressions: ['determined', 'happy', 'angry', 'sad'],
        poses: ['heroic', 'fighting', 'thinking', 'running'],
        colorScheme: '#FF6B6B',
        isCustom: false,
      },
      {
        id: '2',
        name: 'Villain',
        description: 'Cunning antagonist',
        appearance: 'Dark clothing, mysterious aura',
        personality: 'Cunning, ruthless, ambitious',
        expressions: ['evil', 'smug', 'angry', 'surprised'],
        poses: ['menacing', 'laughing', 'attacking', 'escaping'],
        colorScheme: '#4ECDC4',
        isCustom: false,
      },
      {
        id: '3',
        name: 'Sidekick',
        description: 'Loyal companion',
        appearance: 'Smaller, energetic, friendly',
        personality: 'Loyal, enthusiastic, supportive',
        expressions: ['excited', 'worried', 'happy', 'determined'],
        poses: ['supporting', 'cheering', 'helping', 'learning'],
        colorScheme: '#45B7D1',
        isCustom: false,
      },
    ];

    // Seed user profile
    const defaultUserProfile: UserProfile = {
      id: '1',
      username: 'ComicCreator',
      email: 'creator@example.com',
      avatar: '🎨',
      bio: 'Passionate comic creator',
      joinDate: new Date().toISOString(),
      totalComics: 0,
      totalPanels: 0,
      totalCharacters: 0,
      favoriteGenres: ['superhero', 'slice-of-life'],
      skillLevel: 'beginner',
      achievements: [],
      preferences: {
        theme: 'light',
        autoSave: true,
        gridSnap: true,
        showGuides: true,
      },
    };

    // Seed achievements
    const defaultAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Comic',
        description: 'Create your first comic',
        icon: '🎨',
        condition: 'comics_created',
        threshold: 1,
        reward: 'Unlock new templates',
        isUnlocked: false,
        progress: 0,
      },
      {
        id: '2',
        name: 'Character Creator',
        description: 'Create 5 custom characters',
        icon: '👤',
        condition: 'characters_created',
        threshold: 5,
        reward: 'Advanced character tools',
        isUnlocked: false,
        progress: 0,
      },
      {
        id: '3',
        name: 'Story Master',
        description: 'Complete 10 comics',
        icon: '📚',
        condition: 'comics_completed',
        threshold: 10,
        reward: 'Premium templates',
        isUnlocked: false,
        progress: 0,
      },
    ];

    // Seed app settings
    const defaultAppSettings: AppSettings = {
      theme: 'light',
      autoSave: true,
      autoSaveInterval: 30000,
      gridSnap: true,
      showGuides: true,
      showRulers: true,
      defaultCanvasSize: { width: 800, height: 600 },
      defaultPanelCount: 6,
      soundEnabled: true,
      notificationsEnabled: true,
      dataBackupEnabled: true,
      cloudSyncEnabled: false,
    };

    // Seed publishing settings
    const defaultPublishingSettings: PublishingSettings = {
      defaultFormat: 'web',
      imageQuality: 'high',
      compressionLevel: 80,
      includeMetadata: true,
      watermark: false,
      watermarkText: 'Created with ComicCrafter',
      exportFormats: ['png', 'jpg', 'pdf'],
      socialSharing: {
        twitter: true,
        instagram: true,
        facebook: true,
      },
      privacySettings: {
        publicByDefault: false,
        allowComments: true,
        allowSharing: true,
      },
    };

    await this.saveTemplates(defaultTemplates);
    await this.saveCharacters(defaultCharacters);
    await this.saveUserProfile(defaultUserProfile);
    await this.saveAchievements(defaultAchievements);
    await this.saveAppSettings(defaultAppSettings);
    await this.savePublishingSettings(defaultPublishingSettings);
    await AsyncStorage.setItem('comic_crafter_seeded', 'true');
  }

  // Comic CRUD operations
  async getComics(): Promise<Comic[]> {
    const stored = await AsyncStorage.getItem('comics');
    this.comics = stored ? JSON.parse(stored) : [];
    return this.comics;
  }

  async getComicById(id: string): Promise<Comic | null> {
    const comics = await this.getComics();
    return comics.find(comic => comic.id === id) || null;
  }

  async createComic(comic: Omit<Comic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Comic> {
    const newComic: Comic = {
      ...comic,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.comics.push(newComic);
    await this.saveComics();
    await this.updateUserStats();
    await this.checkAchievements();
    return newComic;
  }

  async updateComic(id: string, updates: Partial<Comic>): Promise<Comic | null> {
    const index = this.comics.findIndex(comic => comic.id === id);
    if (index === -1) return null;

    this.comics[index] = {
      ...this.comics[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveComics();
    return this.comics[index];
  }

  async deleteComic(id: string): Promise<boolean> {
    const index = this.comics.findIndex(comic => comic.id === id);
    if (index === -1) return false;

    this.comics.splice(index, 1);
    await this.saveComics();
    await this.updateUserStats();
    return true;
  }

  // Character CRUD operations
  async getCharacters(): Promise<Character[]> {
    const stored = await AsyncStorage.getItem('characters');
    this.characters = stored ? JSON.parse(stored) : [];
    return this.characters;
  }

  async createCharacter(character: Omit<Character, 'id'>): Promise<Character> {
    const newCharacter: Character = {
      ...character,
      id: Date.now().toString(),
    };

    this.characters.push(newCharacter);
    await this.saveCharacters();
    await this.updateUserStats();
    await this.checkAchievements();
    return newCharacter;
  }

  async updateCharacter(id: string, updates: Partial<Character>): Promise<Character | null> {
    const index = this.characters.findIndex(char => char.id === id);
    if (index === -1) return null;

    this.characters[index] = { ...this.characters[index], ...updates };
    await this.saveCharacters();
    return this.characters[index];
  }

  async deleteCharacter(id: string): Promise<boolean> {
    const index = this.characters.findIndex(char => char.id === id);
    if (index === -1) return false;

    this.characters.splice(index, 1);
    await this.saveCharacters();
    await this.updateUserStats();
    return true;
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    const stored = await AsyncStorage.getItem('templates');
    this.templates = stored ? JSON.parse(stored) : [];
    return this.templates;
  }

  async getTemplatesByGenre(genre: string): Promise<Template[]> {
    const templates = await this.getTemplates();
    return templates.filter(template => template.genre === genre);
  }

  // User profile operations
  async getUserProfile(): Promise<UserProfile | null> {
    const stored = await AsyncStorage.getItem('user_profile');
    this.userProfile = stored ? JSON.parse(stored) : null;
    return this.userProfile;
  }

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    if (!this.userProfile) return null;

    this.userProfile = { ...this.userProfile, ...updates };
    await this.saveUserProfile();
    return this.userProfile;
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    const stored = await AsyncStorage.getItem('achievements');
    this.achievements = stored ? JSON.parse(stored) : [];
    return this.achievements;
  }

  async unlockAchievement(id: string): Promise<Achievement | null> {
    const achievement = this.achievements.find(a => a.id === id);
    if (!achievement || achievement.isUnlocked) return null;

    achievement.isUnlocked = true;
    achievement.unlockedAt = new Date().toISOString();
    await this.saveAchievements();
    return achievement;
  }

  // App settings operations
  async getAppSettings(): Promise<AppSettings | null> {
    const stored = await AsyncStorage.getItem('app_settings');
    this.appSettings = stored ? JSON.parse(stored) : null;
    return this.appSettings;
  }

  async updateAppSettings(updates: Partial<AppSettings>): Promise<AppSettings | null> {
    if (!this.appSettings) return null;

    this.appSettings = { ...this.appSettings, ...updates };
    await this.saveAppSettings();
    return this.appSettings;
  }

  // Publishing settings operations
  async getPublishingSettings(): Promise<PublishingSettings | null> {
    const stored = await AsyncStorage.getItem('publishing_settings');
    this.publishingSettings = stored ? JSON.parse(stored) : null;
    return this.publishingSettings;
  }

  async updatePublishingSettings(updates: Partial<PublishingSettings>): Promise<PublishingSettings | null> {
    if (!this.publishingSettings) return null;

    this.publishingSettings = { ...this.publishingSettings, ...updates };
    await this.savePublishingSettings();
    return this.publishingSettings;
  }

  // Statistics
  async getComicStatistics(): Promise<ComicStatistics> {
    const comics = await this.getComics();
    const characters = await this.getCharacters();
    const userProfile = await this.getUserProfile();

    const totalComics = comics.length;
    const completedComics = comics.filter(comic => comic.status === 'completed').length;
    const totalPanels = comics.reduce((sum, comic) => sum + comic.panels.length, 0);
    const totalCharacters = characters.length;
    const customCharacters = characters.filter(char => char.isCustom).length;

    const genreStats = comics.reduce((acc, comic) => {
      acc[comic.genre] = (acc[comic.genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = comics
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);

    return {
      totalComics,
      completedComics,
      totalPanels,
      totalCharacters,
      customCharacters,
      genreStats,
      recentActivity,
      averageComicsPerMonth: totalComics / Math.max(1, userProfile?.joinDate ? 
        (new Date().getTime() - new Date(userProfile.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 30) : 1),
    };
  }

  // Achievement checking
  private async checkAchievements(): Promise<void> {
    const comics = await this.getComics();
    const characters = await this.getCharacters();
    const achievements = await this.getAchievements();

    // Check First Comic achievement
    const firstComicAchievement = achievements.find(a => a.id === '1');
    if (firstComicAchievement && !firstComicAchievement.isUnlocked && comics.length >= 1) {
      await this.unlockAchievement('1');
    }

    // Check Character Creator achievement
    const characterCreatorAchievement = achievements.find(a => a.id === '2');
    if (characterCreatorAchievement && !characterCreatorAchievement.isUnlocked && characters.length >= 5) {
      await this.unlockAchievement('2');
    }

    // Check Story Master achievement
    const storyMasterAchievement = achievements.find(a => a.id === '3');
    if (storyMasterAchievement && !storyMasterAchievement.isUnlocked && comics.length >= 10) {
      await this.unlockAchievement('3');
    }
  }

  // User stats update
  private async updateUserStats(): Promise<void> {
    const comics = await this.getComics();
    const characters = await this.getCharacters();
    const userProfile = await this.getUserProfile();

    if (userProfile) {
      await this.updateUserProfile({
        totalComics: comics.length,
        totalPanels: comics.reduce((sum, comic) => sum + comic.panels.length, 0),
        totalCharacters: characters.length,
      });
    }
  }

  // Data export/import
  async exportData(): Promise<ExportData> {
    const comics = await this.getComics();
    const characters = await this.getCharacters();
    const templates = await this.getTemplates();
    const userProfile = await this.getUserProfile();
    const achievements = await this.getAchievements();
    const appSettings = await this.getAppSettings();
    const publishingSettings = await this.getPublishingSettings();

    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      comics,
      characters,
      templates,
      userProfile,
      achievements,
      appSettings,
      publishingSettings,
    };
  }

  async importData(data: ImportData): Promise<boolean> {
    try {
      if (data.comics) {
        this.comics = data.comics;
        await this.saveComics();
      }

      if (data.characters) {
        this.characters = data.characters;
        await this.saveCharacters();
      }

      if (data.templates) {
        this.templates = data.templates;
        await this.saveTemplates();
      }

      if (data.userProfile) {
        this.userProfile = data.userProfile;
        await this.saveUserProfile();
      }

      if (data.achievements) {
        this.achievements = data.achievements;
        await this.saveAchievements();
      }

      if (data.appSettings) {
        this.appSettings = data.appSettings;
        await this.saveAppSettings();
      }

      if (data.publishingSettings) {
        this.publishingSettings = data.publishingSettings;
        await this.savePublishingSettings();
      }

      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  // Data clearing
  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      'comics',
      'characters',
      'templates',
      'user_profile',
      'achievements',
      'app_settings',
      'publishing_settings',
      'comic_crafter_seeded',
    ]);

    this.comics = [];
    this.characters = [];
    this.templates = [];
    this.userProfile = null;
    this.achievements = [];
    this.appSettings = null;
    this.publishingSettings = null;
  }

  // File operations
  async exportComicAsImage(comic: Comic): Promise<string> {
    // This would typically involve canvas rendering
    // For now, we'll create a placeholder
    const fileName = `comic_${comic.id}_${Date.now()}.png`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    // Create a simple text representation for now
    const content = `Comic: ${comic.title}\nPanels: ${comic.panels.length}\nGenre: ${comic.genre}`;
    await FileSystem.writeAsStringAsync(fileUri, content);
    
    return fileUri;
  }

  async shareComic(comic: Comic): Promise<void> {
    const fileUri = await this.exportComicAsImage(comic);
    await Sharing.shareAsync(fileUri);
  }

  // Private save methods
  private async saveComics(): Promise<void> {
    await AsyncStorage.setItem('comics', JSON.stringify(this.comics));
  }

  private async saveCharacters(): Promise<void> {
    await AsyncStorage.setItem('characters', JSON.stringify(this.characters));
  }

  private async saveTemplates(templates?: Template[]): Promise<void> {
    if (templates) this.templates = templates;
    await AsyncStorage.setItem('templates', JSON.stringify(this.templates));
  }

  private async saveUserProfile(profile?: UserProfile): Promise<void> {
    if (profile) this.userProfile = profile;
    await AsyncStorage.setItem('user_profile', JSON.stringify(this.userProfile));
  }

  private async saveAchievements(achievements?: Achievement[]): Promise<void> {
    if (achievements) this.achievements = achievements;
    await AsyncStorage.setItem('achievements', JSON.stringify(this.achievements));
  }

  private async saveAppSettings(settings?: AppSettings): Promise<void> {
    if (settings) this.appSettings = settings;
    await AsyncStorage.setItem('app_settings', JSON.stringify(this.appSettings));
  }

  private async savePublishingSettings(settings?: PublishingSettings): Promise<void> {
    if (settings) this.publishingSettings = settings;
    await AsyncStorage.setItem('publishing_settings', JSON.stringify(this.publishingSettings));
  }
}

export default ComicCrafterService; 