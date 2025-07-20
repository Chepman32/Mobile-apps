import { MMKV } from 'react-native-mmkv';
import {
  CreativePrompt,
  CreativeProject,
  CreativeIdea,
  UserProfile,
  Achievement,
  AppSettings,
  CreativeStatistics,
  InspirationQuote,
  CreativeChallenge,
  CreativeResource,
  ProjectStep,
} from '../types';

class CreativeSparkService {
  private storage: MMKV;

  constructor() {
    this.storage = new MMKV();
    this.seedDefaultData();
  }

  // Storage Keys
  private readonly KEYS = {
    PROMPTS: 'creative_spark_prompts',
    PROJECTS: 'creative_spark_projects',
    IDEAS: 'creative_spark_ideas',
    USER_PROFILE: 'creative_spark_user_profile',
    ACHIEVEMENTS: 'creative_spark_achievements',
    SETTINGS: 'creative_spark_settings',
    QUOTES: 'creative_spark_quotes',
    CHALLENGES: 'creative_spark_challenges',
    RESOURCES: 'creative_spark_resources',
  };

  private seedDefaultData() {
    // Seed default prompts if none exist
    if (!this.storage.contains(this.KEYS.PROMPTS)) {
      const defaultPrompts: CreativePrompt[] = [
        {
          id: '1',
          title: 'Write a Short Story',
          description: 'Create a compelling short story in 500 words or less. Focus on character development and emotional impact.',
          category: 'writing',
          difficulty: 'beginner',
          tags: ['fiction', 'storytelling', 'character'],
          estimatedTime: 60,
          materials: ['Pen and paper', 'Computer', 'Writing app'],
          steps: [
            'Choose a main character',
            'Define the conflict',
            'Write the opening scene',
            'Develop the plot',
            'Create a satisfying ending'
          ],
          inspiration: 'Think about a moment that changed your life or someone else\'s.',
          examples: ['A chance encounter on a train', 'A letter found in an old book'],
          isFavorite: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Paint with Coffee',
          description: 'Create a beautiful painting using coffee as your medium. Experiment with different concentrations for various shades.',
          category: 'art',
          difficulty: 'intermediate',
          tags: ['painting', 'coffee', 'experimental'],
          estimatedTime: 90,
          materials: ['Coffee grounds', 'Water', 'Paper', 'Brushes'],
          steps: [
            'Brew different concentrations of coffee',
            'Sketch your design lightly',
            'Start with light washes',
            'Build up darker areas',
            'Add details and highlights'
          ],
          inspiration: 'Nature scenes work particularly well with coffee tones.',
          examples: ['Landscape painting', 'Portrait', 'Abstract art'],
          isFavorite: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Compose a Melody',
          description: 'Write a simple melody using any instrument or digital tool. Focus on creating an emotional connection.',
          category: 'music',
          difficulty: 'beginner',
          tags: ['composition', 'melody', 'emotion'],
          estimatedTime: 45,
          materials: ['Any instrument', 'Recording device', 'Notation software'],
          steps: [
            'Choose a key and time signature',
            'Start with a simple rhythm',
            'Create a memorable opening phrase',
            'Develop the melody',
            'Add variation and repetition'
          ],
          inspiration: 'Think about a feeling or memory you want to express.',
          examples: ['Happy birthday variations', 'Nature sounds', 'Childhood memories'],
          isFavorite: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '4',
          title: 'Design a Logo',
          description: 'Create a simple but memorable logo for a fictional company or organization.',
          category: 'design',
          difficulty: 'intermediate',
          tags: ['logo', 'branding', 'graphic design'],
          estimatedTime: 120,
          materials: ['Design software', 'Sketchbook', 'Pencils'],
          steps: [
            'Research the company/industry',
            'Brainstorm concepts',
            'Sketch initial ideas',
            'Refine the best concept',
            'Create final digital version'
          ],
          inspiration: 'Look at successful logos and analyze what makes them work.',
          examples: ['Tech startup', 'Local restaurant', 'Environmental NGO'],
          isFavorite: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '5',
          title: 'Macro Photography',
          description: 'Take close-up photographs of everyday objects to reveal their hidden beauty and texture.',
          category: 'photography',
          difficulty: 'beginner',
          tags: ['macro', 'photography', 'texture'],
          estimatedTime: 60,
          materials: ['Camera or smartphone', 'Good lighting', 'Interesting objects'],
          steps: [
            'Find interesting objects',
            'Set up good lighting',
            'Get close to your subject',
            'Focus carefully',
            'Experiment with angles'
          ],
          inspiration: 'Look for patterns, textures, and details you normally miss.',
          examples: ['Flower petals', 'Kitchen utensils', 'Fabric textures'],
          isFavorite: false,
          isCompleted: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      this.storage.set(this.KEYS.PROMPTS, JSON.stringify(defaultPrompts));
    }

    // Seed default achievements
    if (!this.storage.contains(this.KEYS.ACHIEVEMENTS)) {
      const defaultAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Spark',
          description: 'Complete your first creative prompt',
          icon: '🌟',
          category: 'completion',
          requirement: { type: 'projects', value: 1 },
          unlocked: false,
          progress: 0,
          rarity: 'common',
        },
        {
          id: '2',
          title: 'Creative Streak',
          description: 'Complete 7 projects in a row',
          icon: '🔥',
          category: 'streak',
          requirement: { type: 'streak', value: 7 },
          unlocked: false,
          progress: 0,
          rarity: 'uncommon',
        },
        {
          id: '3',
          title: 'Multi-Talented',
          description: 'Complete projects in 5 different categories',
          icon: '🎨',
          category: 'creativity',
          requirement: { type: 'categories', value: 5 },
          unlocked: false,
          progress: 0,
          rarity: 'rare',
        },
        {
          id: '4',
          title: 'Time Master',
          description: 'Spend 100 hours on creative projects',
          icon: '⏰',
          category: 'skill',
          requirement: { type: 'time', value: 6000 },
          unlocked: false,
          progress: 0,
          rarity: 'epic',
        },
        {
          id: '5',
          title: 'Creative Master',
          description: 'Complete 50 projects with high ratings',
          icon: '👑',
          category: 'special',
          requirement: { type: 'projects', value: 50 },
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
          dailyInspiration: true,
          projectReminders: true,
          achievementNotifications: true,
          weeklyReports: true,
        },
        privacy: {
          shareProjects: false,
          shareProgress: false,
          allowComments: false,
        },
        creativity: {
          autoSuggestions: true,
          difficultyPreference: 'beginner',
          timePreference: 'medium',
          categoryPreference: ['writing', 'art', 'music'],
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
        name: 'Creative User',
        interests: ['writing', 'art', 'music'],
        skillLevel: 'beginner',
        preferredCategories: ['writing', 'art', 'music'],
        totalProjects: 0,
        completedProjects: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        preferences: {
          theme: 'auto',
          notifications: {
            dailyInspiration: true,
            projectReminders: true,
            achievementNotifications: true,
            weeklyReports: true,
          },
          privacy: {
            shareProjects: false,
            shareProgress: false,
            allowComments: false,
          },
          creativity: {
            autoSuggestions: true,
            difficultyPreference: 'beginner',
            timePreference: 'medium',
            categoryPreference: ['writing', 'art', 'music'],
          },
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.storage.set(this.KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
    }

    // Seed inspiration quotes
    if (!this.storage.contains(this.KEYS.QUOTES)) {
      const defaultQuotes: InspirationQuote[] = [
        {
          id: '1',
          text: 'Creativity is intelligence having fun.',
          author: 'Albert Einstein',
          category: 'art',
          isFavorite: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          text: 'The only way to do great work is to love what you do.',
          author: 'Steve Jobs',
          category: 'business',
          isFavorite: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          text: 'Every artist was first an amateur.',
          author: 'Ralph Waldo Emerson',
          category: 'art',
          isFavorite: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '4',
          text: 'Music is the universal language of mankind.',
          author: 'Henry Wadsworth Longfellow',
          category: 'music',
          isFavorite: false,
          createdAt: new Date().toISOString(),
        },
        {
          id: '5',
          text: 'Design is not just what it looks like and feels like. Design is how it works.',
          author: 'Steve Jobs',
          category: 'design',
          isFavorite: false,
          createdAt: new Date().toISOString(),
        },
      ];
      this.storage.set(this.KEYS.QUOTES, JSON.stringify(defaultQuotes));
    }
  }

  // Prompt Management
  async getPrompts(): Promise<CreativePrompt[]> {
    try {
      const data = this.storage.getString(this.KEYS.PROMPTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting prompts:', error);
      return [];
    }
  }

  async getPrompt(id: string): Promise<CreativePrompt | null> {
    try {
      const prompts = await this.getPrompts();
      return prompts.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error getting prompt:', error);
      return null;
    }
  }

  async addPrompt(prompt: Omit<CreativePrompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreativePrompt> {
    try {
      const prompts = await this.getPrompts();
      const newPrompt: CreativePrompt = {
        ...prompt,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      prompts.push(newPrompt);
      this.storage.set(this.KEYS.PROMPTS, JSON.stringify(prompts));
      return newPrompt;
    } catch (error) {
      console.error('Error adding prompt:', error);
      throw error;
    }
  }

  async updatePrompt(id: string, updates: Partial<CreativePrompt>): Promise<CreativePrompt | null> {
    try {
      const prompts = await this.getPrompts();
      const index = prompts.findIndex(p => p.id === id);
      
      if (index === -1) return null;
      
      prompts[index] = {
        ...prompts[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.PROMPTS, JSON.stringify(prompts));
      return prompts[index];
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
  }

  async deletePrompt(id: string): Promise<boolean> {
    try {
      const prompts = await this.getPrompts();
      const filtered = prompts.filter(p => p.id !== id);
      this.storage.set(this.KEYS.PROMPTS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting prompt:', error);
      return false;
    }
  }

  // Project Management
  async getProjects(): Promise<CreativeProject[]> {
    try {
      const data = this.storage.getString(this.KEYS.PROJECTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }

  async getProject(id: string): Promise<CreativeProject | null> {
    try {
      const projects = await this.getProjects();
      return projects.find(p => p.id === id) || null;
    } catch (error) {
      console.error('Error getting project:', error);
      return null;
    }
  }

  async addProject(project: Omit<CreativeProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreativeProject> {
    try {
      const projects = await this.getProjects();
      const newProject: CreativeProject = {
        ...project,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      projects.push(newProject);
      this.storage.set(this.KEYS.PROJECTS, JSON.stringify(projects));
      
      // Update user statistics
      await this.updateUserStatistics();
      
      return newProject;
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<CreativeProject>): Promise<CreativeProject | null> {
    try {
      const projects = await this.getProjects();
      const index = projects.findIndex(p => p.id === id);
      
      if (index === -1) return null;
      
      projects[index] = {
        ...projects[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.PROJECTS, JSON.stringify(projects));
      
      // Update user statistics
      await this.updateUserStatistics();
      
      return projects[index];
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string): Promise<boolean> {
    try {
      const projects = await this.getProjects();
      const filtered = projects.filter(p => p.id !== id);
      this.storage.set(this.KEYS.PROJECTS, JSON.stringify(filtered));
      
      // Update user statistics
      await this.updateUserStatistics();
      
      return true;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  }

  // Idea Management
  async getIdeas(): Promise<CreativeIdea[]> {
    try {
      const data = this.storage.getString(this.KEYS.IDEAS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting ideas:', error);
      return [];
    }
  }

  async getIdea(id: string): Promise<CreativeIdea | null> {
    try {
      const ideas = await this.getIdeas();
      return ideas.find(i => i.id === id) || null;
    } catch (error) {
      console.error('Error getting idea:', error);
      return null;
    }
  }

  async addIdea(idea: Omit<CreativeIdea, 'id' | 'createdAt' | 'updatedAt'>): Promise<CreativeIdea> {
    try {
      const ideas = await this.getIdeas();
      const newIdea: CreativeIdea = {
        ...idea,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      ideas.push(newIdea);
      this.storage.set(this.KEYS.IDEAS, JSON.stringify(ideas));
      return newIdea;
    } catch (error) {
      console.error('Error adding idea:', error);
      throw error;
    }
  }

  async updateIdea(id: string, updates: Partial<CreativeIdea>): Promise<CreativeIdea | null> {
    try {
      const ideas = await this.getIdeas();
      const index = ideas.findIndex(i => i.id === id);
      
      if (index === -1) return null;
      
      ideas[index] = {
        ...ideas[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      
      this.storage.set(this.KEYS.IDEAS, JSON.stringify(ideas));
      return ideas[index];
    } catch (error) {
      console.error('Error updating idea:', error);
      throw error;
    }
  }

  async deleteIdea(id: string): Promise<boolean> {
    try {
      const ideas = await this.getIdeas();
      const filtered = ideas.filter(i => i.id !== id);
      this.storage.set(this.KEYS.IDEAS, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error('Error deleting idea:', error);
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
          dailyInspiration: true,
          projectReminders: true,
          achievementNotifications: true,
          weeklyReports: true,
        },
        privacy: {
          shareProjects: false,
          shareProgress: false,
          allowComments: false,
        },
        creativity: {
          autoSuggestions: true,
          difficultyPreference: 'beginner',
          timePreference: 'medium',
          categoryPreference: ['writing', 'art', 'music'],
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

  // Statistics
  async getStatistics(): Promise<CreativeStatistics> {
    try {
      const projects = await this.getProjects();
      const completedProjects = projects.filter(p => p.status === 'completed');
      const totalTimeSpent = projects.reduce((sum, p) => sum + (p.actualTime || 0), 0);
      const averageProjectTime = completedProjects.length > 0 ? totalTimeSpent / completedProjects.length : 0;
      
      // Calculate category breakdown
      const categoryBreakdown = projects.reduce((acc, project) => {
        acc[project.category] = (acc[project.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      // Calculate monthly progress
      const monthlyProgress = projects.reduce((acc, project) => {
        const month = new Date(project.createdAt).toISOString().slice(0, 7);
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      return {
        totalProjects: projects.length,
        completedProjects: completedProjects.length,
        totalTimeSpent,
        averageProjectTime,
        currentStreak: 0, // Would need to calculate based on completion dates
        longestStreak: 0, // Would need to calculate based on completion dates
        favoriteCategory: Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0] || 'art',
        categoryBreakdown: Object.entries(categoryBreakdown).map(([category, count]) => ({ category, count })),
        monthlyProgress: Object.entries(monthlyProgress).map(([month, projects]) => ({ month, projects })),
        skillProgress: [], // Would need to calculate based on project complexity and ratings
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        totalProjects: 0,
        completedProjects: 0,
        totalTimeSpent: 0,
        averageProjectTime: 0,
        currentStreak: 0,
        longestStreak: 0,
        favoriteCategory: 'art',
        categoryBreakdown: [],
        monthlyProgress: [],
        skillProgress: [],
      };
    }
  }

  private async updateUserStatistics(): Promise<void> {
    try {
      const statistics = await this.getStatistics();
      const profile = await this.getUserProfile();
      
      if (profile) {
        await this.updateUserProfile({
          totalProjects: statistics.totalProjects,
          completedProjects: statistics.completedProjects,
          totalTimeSpent: statistics.totalTimeSpent,
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
      const projects = await this.getProjects();
      
      const unlockedAchievements: Achievement[] = [];
      
      for (const achievement of achievements) {
        if (achievement.unlocked) continue;
        
        let progress = 0;
        let shouldUnlock = false;
        
        switch (achievement.requirement.type) {
          case 'projects':
            progress = statistics.totalProjects;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'streak':
            progress = statistics.currentStreak;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'time':
            progress = statistics.totalTimeSpent;
            shouldUnlock = progress >= achievement.requirement.value;
            break;
          case 'categories':
            const uniqueCategories = new Set(projects.map(p => p.category)).size;
            progress = uniqueCategories;
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
        prompts: await this.getPrompts(),
        projects: await this.getProjects(),
        ideas: await this.getIdeas(),
        userProfile: await this.getUserProfile(),
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
      
      if (data.prompts) this.storage.set(this.KEYS.PROMPTS, JSON.stringify(data.prompts));
      if (data.projects) this.storage.set(this.KEYS.PROJECTS, JSON.stringify(data.projects));
      if (data.ideas) this.storage.set(this.KEYS.IDEAS, JSON.stringify(data.ideas));
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
      this.storage.delete(this.KEYS.PROMPTS);
      this.storage.delete(this.KEYS.PROJECTS);
      this.storage.delete(this.KEYS.IDEAS);
      this.storage.delete(this.KEYS.USER_PROFILE);
      this.storage.delete(this.KEYS.ACHIEVEMENTS);
      this.storage.delete(this.KEYS.SETTINGS);
      this.storage.delete(this.KEYS.QUOTES);
      this.storage.delete(this.KEYS.CHALLENGES);
      this.storage.delete(this.KEYS.RESOURCES);
      
      // Re-seed default data
      this.seedDefaultData();
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export default new CreativeSparkService(); 