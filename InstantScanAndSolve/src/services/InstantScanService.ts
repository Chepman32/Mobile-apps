import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  ScanResult,
  UserProfile,
  Achievement,
  AppSettings,
  ScanSession,
  Subject,
  ScanError,
  ExportData,
  ImportData,
  ScanStatistics,
  SolutionStep,
  AlternativeSolution,
  RelatedProblem,
} from '../types';

class InstantScanService {
  private static instance: InstantScanService;
  private scanResults: ScanResult[] = [];
  private userProfile: UserProfile | null = null;
  private achievements: Achievement[] = [];
  private appSettings: AppSettings | null = null;
  private scanSessions: ScanSession[] = [];
  private subjects: Subject[] = [];
  private scanErrors: ScanError[] = [];

  static getInstance(): InstantScanService {
    if (!InstantScanService.instance) {
      InstantScanService.instance = new InstantScanService();
    }
    return InstantScanService.instance;
  }

  // Data seeding
  async seedData(): Promise<void> {
    const seeded = await AsyncStorage.getItem('instant_scan_seeded');
    if (seeded) return;

    // Seed subjects
    const defaultSubjects: Subject[] = [
      {
        id: '1',
        name: 'Mathematics',
        icon: '📐',
        description: 'Algebra, calculus, geometry, and more',
        categories: [
          {
            id: '1',
            name: 'Algebra',
            description: 'Linear equations, quadratic equations, polynomials',
            examples: ['2x + 5 = 13', 'x² - 4x + 4 = 0', '3x + 2y = 8'],
            commonFormulas: ['ax + b = c', 'x = (-b ± √(b² - 4ac)) / 2a'],
            tips: ['Isolate the variable', 'Use the quadratic formula', 'Check your answer'],
          },
          {
            id: '2',
            name: 'Geometry',
            description: 'Shapes, areas, volumes, and theorems',
            examples: ['Find the area of a circle', 'Calculate the hypotenuse', 'Volume of a cylinder'],
            commonFormulas: ['A = πr²', 'a² + b² = c²', 'V = πr²h'],
            tips: ['Draw a diagram', 'Use the Pythagorean theorem', 'Remember π ≈ 3.14'],
          },
        ],
        difficulty: 'intermediate',
        isEnabled: true,
        scanCount: 0,
        successRate: 0,
      },
      {
        id: '2',
        name: 'Physics',
        icon: '⚡',
        description: 'Mechanics, electricity, thermodynamics',
        categories: [
          {
            id: '1',
            name: 'Mechanics',
            description: 'Motion, forces, energy, and momentum',
            examples: ['Calculate velocity', 'Find acceleration', 'Work and energy'],
            commonFormulas: ['v = d/t', 'F = ma', 'KE = ½mv²'],
            tips: ['Draw a free-body diagram', 'Use SI units', 'Check units'],
          },
        ],
        difficulty: 'advanced',
        isEnabled: true,
        scanCount: 0,
        successRate: 0,
      },
      {
        id: '3',
        name: 'Chemistry',
        icon: '🧪',
        description: 'Reactions, equations, and molecular structures',
        categories: [
          {
            id: '1',
            name: 'Stoichiometry',
            description: 'Chemical equations and mole calculations',
            examples: ['Balance equations', 'Calculate moles', 'Limiting reactants'],
            commonFormulas: ['n = m/M', 'PV = nRT', 'C = n/V'],
            tips: ['Balance atoms first', 'Use the mole ratio', 'Check your units'],
          },
        ],
        difficulty: 'intermediate',
        isEnabled: true,
        scanCount: 0,
        successRate: 0,
      },
    ];

    // Seed user profile
    const defaultUserProfile: UserProfile = {
      id: '1',
      username: 'ProblemSolver',
      email: 'solver@example.com',
      avatar: '🎯',
      joinDate: new Date().toISOString(),
      totalScans: 0,
      totalSolved: 0,
      favoriteSubjects: ['Mathematics', 'Physics'],
      skillLevel: 'beginner',
      preferences: {
        theme: 'light',
        notifications: true,
        autoSave: true,
        highQualityScan: true,
        showSteps: true,
        defaultSubject: 'Mathematics',
        language: 'en',
        units: 'metric',
      },
      statistics: {
        totalScans: 0,
        successfulScans: 0,
        averageConfidence: 0,
        favoriteSubjects: {},
        scanHistory: [],
        accuracyRate: 0,
        averageProcessingTime: 0,
        subjectsMastered: [],
        subjectsNeedingWork: [],
      },
    };

    // Seed achievements
    const defaultAchievements: Achievement[] = [
      {
        id: '1',
        name: 'First Scan',
        description: 'Complete your first problem scan',
        icon: '📸',
        condition: 'scans_completed',
        threshold: 1,
        reward: 'Unlock advanced scanning features',
        isUnlocked: false,
        progress: 0,
      },
      {
        id: '2',
        name: 'Math Master',
        description: 'Solve 10 mathematics problems',
        icon: '📐',
        condition: 'math_problems_solved',
        threshold: 10,
        reward: 'Access to advanced math tools',
        isUnlocked: false,
        progress: 0,
      },
      {
        id: '3',
        name: 'Speed Demon',
        description: 'Solve 5 problems in under 2 minutes each',
        icon: '⚡',
        condition: 'fast_solutions',
        threshold: 5,
        reward: 'Priority processing queue',
        isUnlocked: false,
        progress: 0,
      },
      {
        id: '4',
        name: 'Accuracy Expert',
        description: 'Maintain 95% accuracy over 20 scans',
        icon: '🎯',
        condition: 'high_accuracy',
        threshold: 20,
        reward: 'Advanced error correction',
        isUnlocked: false,
        progress: 0,
      },
    ];

    // Seed app settings
    const defaultAppSettings: AppSettings = {
      theme: 'light',
      autoSave: true,
      highQualityScan: true,
      showSteps: true,
      notifications: true,
      soundEnabled: true,
      vibrationEnabled: true,
      dataBackupEnabled: true,
      cloudSyncEnabled: false,
      scanQuality: 'high',
      processingMode: 'balanced',
    };

    await this.saveSubjects(defaultSubjects);
    await this.saveUserProfile(defaultUserProfile);
    await this.saveAchievements(defaultAchievements);
    await this.saveAppSettings(defaultAppSettings);
    await AsyncStorage.setItem('instant_scan_seeded', 'true');
  }

  // Scan Results CRUD operations
  async getScanResults(): Promise<ScanResult[]> {
    const stored = await AsyncStorage.getItem('scan_results');
    this.scanResults = stored ? JSON.parse(stored) : [];
    return this.scanResults;
  }

  async getScanResultById(id: string): Promise<ScanResult | null> {
    const scanResults = await this.getScanResults();
    return scanResults.find(scan => scan.id === id) || null;
  }

  async createScanResult(scanResult: Omit<ScanResult, 'id' | 'scannedAt'>): Promise<ScanResult> {
    const newScanResult: ScanResult = {
      ...scanResult,
      id: Date.now().toString(),
      scannedAt: new Date().toISOString(),
    };

    this.scanResults.unshift(newScanResult);
    await this.saveScanResults();
    await this.updateUserStats();
    await this.checkAchievements();
    return newScanResult;
  }

  async updateScanResult(id: string, updates: Partial<ScanResult>): Promise<ScanResult | null> {
    const index = this.scanResults.findIndex(scan => scan.id === id);
    if (index === -1) return null;

    this.scanResults[index] = {
      ...this.scanResults[index],
      ...updates,
    };

    await this.saveScanResults();
    return this.scanResults[index];
  }

  async deleteScanResult(id: string): Promise<boolean> {
    const index = this.scanResults.findIndex(scan => scan.id === id);
    if (index === -1) return false;

    this.scanResults.splice(index, 1);
    await this.saveScanResults();
    await this.updateUserStats();
    return true;
  }

  // User Profile operations
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

  // App Settings operations
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

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    const stored = await AsyncStorage.getItem('subjects');
    this.subjects = stored ? JSON.parse(stored) : [];
    return this.subjects;
  }

  async updateSubject(id: string, updates: Partial<Subject>): Promise<Subject | null> {
    const index = this.subjects.findIndex(subject => subject.id === id);
    if (index === -1) return null;

    this.subjects[index] = { ...this.subjects[index], ...updates };
    await this.saveSubjects();
    return this.subjects[index];
  }

  // Scan Session operations
  async getScanSessions(): Promise<ScanSession[]> {
    const stored = await AsyncStorage.getItem('scan_sessions');
    this.scanSessions = stored ? JSON.parse(stored) : [];
    return this.scanSessions;
  }

  async createScanSession(session: Omit<ScanSession, 'id' | 'startTime'>): Promise<ScanSession> {
    const newSession: ScanSession = {
      ...session,
      id: Date.now().toString(),
      startTime: new Date().toISOString(),
    };

    this.scanSessions.unshift(newSession);
    await this.saveScanSessions();
    return newSession;
  }

  async updateScanSession(id: string, updates: Partial<ScanSession>): Promise<ScanSession | null> {
    const index = this.scanSessions.findIndex(session => session.id === id);
    if (index === -1) return null;

    this.scanSessions[index] = {
      ...this.scanSessions[index],
      ...updates,
    };

    await this.saveScanSessions();
    return this.scanSessions[index];
  }

  // Statistics
  async getScanStatistics(): Promise<ScanStatistics> {
    const scanResults = await this.getScanResults();
    const userProfile = await this.getUserProfile();

    const totalScans = scanResults.length;
    const successfulScans = scanResults.filter(scan => scan.confidence > 70).length;
    const averageConfidence = totalScans > 0 
      ? scanResults.reduce((sum, scan) => sum + scan.confidence, 0) / totalScans 
      : 0;

    const favoriteSubjects = scanResults.reduce((acc, scan) => {
      acc[scan.subject] = (acc[scan.subject] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentActivity = scanResults.slice(0, 10);

    const accuracyRate = totalScans > 0 ? (successfulScans / totalScans) * 100 : 0;
    const averageProcessingTime = totalScans > 0 
      ? scanResults.reduce((sum, scan) => sum + scan.processingTime, 0) / totalScans 
      : 0;

    // Mock weekly and monthly data
    const weeklyProgress: any[] = [];
    const monthlyTrends: any[] = [];

    return {
      totalScans,
      successfulScans,
      averageConfidence,
      favoriteSubjects,
      recentActivity,
      accuracyRate,
      averageProcessingTime,
      subjectsMastered: Object.keys(favoriteSubjects).filter(subject => 
        favoriteSubjects[subject] >= 5
      ),
      subjectsNeedingWork: Object.keys(favoriteSubjects).filter(subject => 
        favoriteSubjects[subject] < 3
      ),
      weeklyProgress,
      monthlyTrends,
    };
  }

  // Achievement checking
  private async checkAchievements(): Promise<void> {
    const scanResults = await this.getScanResults();
    const achievements = await this.getAchievements();

    // Check First Scan achievement
    const firstScanAchievement = achievements.find(a => a.id === '1');
    if (firstScanAchievement && !firstScanAchievement.isUnlocked && scanResults.length >= 1) {
      await this.unlockAchievement('1');
    }

    // Check Math Master achievement
    const mathMasterAchievement = achievements.find(a => a.id === '2');
    const mathProblems = scanResults.filter(scan => scan.subject === 'Mathematics');
    if (mathMasterAchievement && !mathMasterAchievement.isUnlocked && mathProblems.length >= 10) {
      await this.unlockAchievement('2');
    }

    // Check Speed Demon achievement
    const speedDemonAchievement = achievements.find(a => a.id === '3');
    const fastScans = scanResults.filter(scan => scan.processingTime < 120000); // 2 minutes
    if (speedDemonAchievement && !speedDemonAchievement.isUnlocked && fastScans.length >= 5) {
      await this.unlockAchievement('3');
    }

    // Check Accuracy Expert achievement
    const accuracyExpertAchievement = achievements.find(a => a.id === '4');
    const highAccuracyScans = scanResults.filter(scan => scan.confidence >= 95);
    if (accuracyExpertAchievement && !accuracyExpertAchievement.isUnlocked && highAccuracyScans.length >= 20) {
      await this.unlockAchievement('4');
    }
  }

  // User stats update
  private async updateUserStats(): Promise<void> {
    const scanResults = await this.getScanResults();
    const userProfile = await this.getUserProfile();

    if (userProfile) {
      const statistics = await this.getScanStatistics();
      await this.updateUserProfile({
        totalScans: statistics.totalScans,
        totalSolved: statistics.successfulScans,
        statistics,
      });
    }
  }

  // Data export/import
  async exportData(): Promise<ExportData> {
    const scanResults = await this.getScanResults();
    const userProfile = await this.getUserProfile();
    const achievements = await this.getAchievements();
    const appSettings = await this.getAppSettings();
    const scanSessions = await this.getScanSessions();
    const subjects = await this.getSubjects();

    return {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      scanResults,
      userProfile,
      achievements,
      appSettings,
      scanSessions,
      subjects,
    };
  }

  async importData(data: ImportData): Promise<boolean> {
    try {
      if (data.scanResults) {
        this.scanResults = data.scanResults;
        await this.saveScanResults();
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

      if (data.scanSessions) {
        this.scanSessions = data.scanSessions;
        await this.saveScanSessions();
      }

      if (data.subjects) {
        this.subjects = data.subjects;
        await this.saveSubjects();
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
      'scan_results',
      'user_profile',
      'achievements',
      'app_settings',
      'scan_sessions',
      'subjects',
      'instant_scan_seeded',
    ]);

    this.scanResults = [];
    this.userProfile = null;
    this.achievements = [];
    this.appSettings = null;
    this.scanSessions = [];
    this.subjects = [];
  }

  // File operations
  async exportScanAsImage(scanResult: ScanResult): Promise<string> {
    const fileName = `scan_${scanResult.id}_${Date.now()}.png`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    // Create a simple text representation for now
    const content = `Scan: ${scanResult.problemText}\nSolution: ${scanResult.solution}\nSubject: ${scanResult.subject}`;
    await FileSystem.writeAsStringAsync(fileUri, content);
    
    return fileUri;
  }

  async shareScanResult(scanResult: ScanResult): Promise<void> {
    const fileUri = await this.exportScanAsImage(scanResult);
    await Sharing.shareAsync(fileUri);
  }

  // Mock scanning functionality
  async scanProblem(imageUri: string, subject: string): Promise<ScanResult> {
    // Simulate processing time
    const processingTime = Math.random() * 5000 + 2000; // 2-7 seconds
    await new Promise(resolve => setTimeout(resolve, processingTime));

    // Mock problem text and solution
    const mockProblems = {
      'Mathematics': [
        { problem: 'Solve for x: 2x + 5 = 13', solution: 'x = 4', steps: [
          { id: '1', stepNumber: 1, description: 'Subtract 5 from both sides', explanation: '2x + 5 - 5 = 13 - 5' },
          { id: '2', stepNumber: 2, description: 'Simplify', explanation: '2x = 8' },
          { id: '3', stepNumber: 3, description: 'Divide both sides by 2', explanation: 'x = 4' },
        ]},
        { problem: 'Find the area of a circle with radius 5', solution: 'A = 25π', steps: [
          { id: '1', stepNumber: 1, description: 'Use the area formula', explanation: 'A = πr²' },
          { id: '2', stepNumber: 2, description: 'Substitute r = 5', explanation: 'A = π(5)²' },
          { id: '3', stepNumber: 3, description: 'Calculate', explanation: 'A = 25π' },
        ]},
      ],
      'Physics': [
        { problem: 'Calculate the velocity of an object that travels 100m in 10s', solution: 'v = 10 m/s', steps: [
          { id: '1', stepNumber: 1, description: 'Use the velocity formula', explanation: 'v = d/t' },
          { id: '2', stepNumber: 2, description: 'Substitute values', explanation: 'v = 100/10' },
          { id: '3', stepNumber: 3, description: 'Calculate', explanation: 'v = 10 m/s' },
        ]},
      ],
      'Chemistry': [
        { problem: 'Balance the equation: H₂ + O₂ → H₂O', solution: '2H₂ + O₂ → 2H₂O', steps: [
          { id: '1', stepNumber: 1, description: 'Count atoms on each side', explanation: 'Left: 2H, 2O. Right: 2H, 1O' },
          { id: '2', stepNumber: 2, description: 'Balance oxygen', explanation: 'Add coefficient 2 to H₂O' },
          { id: '3', stepNumber: 3, description: 'Balance hydrogen', explanation: 'Add coefficient 2 to H₂' },
        ]},
      ],
    };

    const problems = mockProblems[subject as keyof typeof mockProblems] || mockProblems['Mathematics'];
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];

    const confidence = Math.random() * 30 + 70; // 70-100%

    return {
      id: Date.now().toString(),
      imageUri,
      problemText: randomProblem.problem,
      solution: randomProblem.solution,
      scannedAt: new Date().toISOString(),
      subject,
      difficulty: Math.random() > 0.5 ? 'medium' : 'easy',
      confidence,
      processingTime,
      isBookmarked: false,
      tags: [subject.toLowerCase()],
      notes: '',
      category: subject === 'Mathematics' ? 'math' : subject === 'Physics' ? 'science' : 'other',
      subcategory: 'general',
      steps: randomProblem.steps,
      alternativeSolutions: [],
      relatedProblems: [],
    };
  }

  // Private save methods
  private async saveScanResults(): Promise<void> {
    await AsyncStorage.setItem('scan_results', JSON.stringify(this.scanResults));
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

  private async saveSubjects(subjects?: Subject[]): Promise<void> {
    if (subjects) this.subjects = subjects;
    await AsyncStorage.setItem('subjects', JSON.stringify(this.subjects));
  }

  private async saveScanSessions(): Promise<void> {
    await AsyncStorage.setItem('scan_sessions', JSON.stringify(this.scanSessions));
  }
}

export default InstantScanService; 