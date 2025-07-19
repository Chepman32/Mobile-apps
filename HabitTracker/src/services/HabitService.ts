import { MMKV } from 'react-native-mmkv';
import { 
  Habit, 
  HabitEntry, 
  HabitCategory, 
  Achievement, 
  HabitTemplate,
  DailyGoal,
  WeeklyReview,
  HabitReminder,
  UserSettings,
  MotivationalQuote,
  HabitStats,
  MonthlyProgress,
  HabitInsight,
  HabitFrequency,
  AchievementType,
  DEFAULT_HABIT_CATEGORIES,
  HABIT_TEMPLATES
} from '../types';

const storage = new MMKV();

export class HabitService {
  private static instance: HabitService;
  private readonly HABITS_KEY = 'habits';
  private readonly ENTRIES_KEY = 'habit_entries';
  private readonly CATEGORIES_KEY = 'habit_categories';
  private readonly ACHIEVEMENTS_KEY = 'achievements';
  private readonly TEMPLATES_KEY = 'habit_templates';
  private readonly GOALS_KEY = 'daily_goals';
  private readonly REVIEWS_KEY = 'weekly_reviews';
  private readonly REMINDERS_KEY = 'habit_reminders';
  private readonly SETTINGS_KEY = 'user_settings';
  private readonly QUOTES_KEY = 'motivational_quotes';
  private readonly INSIGHTS_KEY = 'habit_insights';

  public static getInstance(): HabitService {
    if (!HabitService.instance) {
      HabitService.instance = new HabitService();
    }
    return HabitService.instance;
  }

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    // Initialize default categories if not exist
    const categories = this.getCategories();
    if (categories.length === 0) {
      DEFAULT_HABIT_CATEGORIES.forEach(category => {
        this.addCategory({
          ...category,
          id: this.generateId(),
          habitCount: 0,
          createdAt: new Date().toISOString(),
        });
      });
    }

    // Initialize habit templates if not exist
    const templates = this.getTemplates();
    if (templates.length === 0) {
      HABIT_TEMPLATES.forEach(template => {
        this.addTemplate({
          ...template,
          id: this.generateId(),
        });
      });
    }

    // Initialize default settings
    const settings = this.getSettings();
    if (!settings) {
      this.updateSettings({
        id: 'user_settings',
        theme: 'system',
        notificationsEnabled: true,
        dailyReminderTime: '09:00',
        weeklyReviewDay: 0, // Sunday
        firstDayOfWeek: 1, // Monday
        defaultHabitFrequency: 'daily',
        motivationalQuotes: true,
        streakFreezeEnabled: false,
        dataBackupEnabled: true,
        language: 'en',
        updatedAt: new Date().toISOString(),
      });
    }

    this.generateDailyQuotes();
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private parseDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00.000Z');
  }

  // HABIT MANAGEMENT
  public getHabits(): Habit[] {
    const data = storage.getString(this.HABITS_KEY);
    return data ? JSON.parse(data) : [];
  }

  public getHabit(id: string): Habit | null {
    const habits = this.getHabits();
    return habits.find(habit => habit.id === id) || null;
  }

  public addHabit(habitData: Omit<Habit, 'id' | 'createdAt' | 'updatedAt' | 'streak' | 'bestStreak' | 'totalCompletions'>): string {
    const habits = this.getHabits();
    const id = this.generateId();
    
    const newHabit: Habit = {
      ...habitData,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      streak: 0,
      bestStreak: 0,
      totalCompletions: 0,
    };

    habits.push(newHabit);
    storage.set(this.HABITS_KEY, JSON.stringify(habits));

    // Update category count
    this.updateCategoryHabitCount(habitData.category, 1);

    // Create daily goal for today if not exists
    this.ensureDailyGoal(new Date());

    // Check for achievements
    this.checkAchievements();

    return id;
  }

  public updateHabit(id: string, updates: Partial<Habit>): boolean {
    const habits = this.getHabits();
    const index = habits.findIndex(habit => habit.id === id);
    
    if (index === -1) return false;

    const oldCategory = habits[index].category;
    habits[index] = {
      ...habits[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    storage.set(this.HABITS_KEY, JSON.stringify(habits));

    // Update category counts if category changed
    if (updates.category && updates.category !== oldCategory) {
      this.updateCategoryHabitCount(oldCategory, -1);
      this.updateCategoryHabitCount(updates.category, 1);
    }

    return true;
  }

  public deleteHabit(id: string): boolean {
    const habits = this.getHabits();
    const habitIndex = habits.findIndex(habit => habit.id === id);
    
    if (habitIndex === -1) return false;

    const habit = habits[habitIndex];
    habits.splice(habitIndex, 1);
    storage.set(this.HABITS_KEY, JSON.stringify(habits));

    // Update category count
    this.updateCategoryHabitCount(habit.category, -1);

    // Delete related entries
    const entries = this.getEntries();
    const filteredEntries = entries.filter(entry => entry.habitId !== id);
    storage.set(this.ENTRIES_KEY, JSON.stringify(filteredEntries));

    // Delete related reminders
    const reminders = this.getReminders();
    const filteredReminders = reminders.filter(reminder => reminder.habitId !== id);
    storage.set(this.REMINDERS_KEY, JSON.stringify(filteredReminders));

    return true;
  }

  // HABIT ENTRIES & TRACKING
  public getEntries(): HabitEntry[] {
    const data = storage.getString(this.ENTRIES_KEY);
    return data ? JSON.parse(data) : [];
  }

  public getEntriesForHabit(habitId: string): HabitEntry[] {
    const entries = this.getEntries();
    return entries.filter(entry => entry.habitId === habitId);
  }

  public getEntriesForDate(date: Date): HabitEntry[] {
    const dateString = this.formatDate(date);
    const entries = this.getEntries();
    return entries.filter(entry => entry.date === dateString);
  }

  public getEntryForHabitAndDate(habitId: string, date: Date): HabitEntry | null {
    const dateString = this.formatDate(date);
    const entries = this.getEntries();
    return entries.find(entry => entry.habitId === habitId && entry.date === dateString) || null;
  }

  public markHabitComplete(habitId: string, date: Date, count: number = 1, notes?: string, mood?: 1 | 2 | 3 | 4 | 5): boolean {
    const habit = this.getHabit(habitId);
    if (!habit) return false;

    const dateString = this.formatDate(date);
    const entries = this.getEntries();
    const existingEntryIndex = entries.findIndex(entry => entry.habitId === habitId && entry.date === dateString);

    const entryData = {
      id: existingEntryIndex >= 0 ? entries[existingEntryIndex].id : this.generateId(),
      habitId,
      date: dateString,
      completed: true,
      count,
      notes,
      mood,
      createdAt: existingEntryIndex >= 0 ? entries[existingEntryIndex].createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (existingEntryIndex >= 0) {
      entries[existingEntryIndex] = entryData;
    } else {
      entries.push(entryData);
    }

    storage.set(this.ENTRIES_KEY, JSON.stringify(entries));

    // Update habit stats
    this.updateHabitStats(habitId);

    // Update daily goal
    this.updateDailyGoalProgress(date);

    // Check achievements
    this.checkAchievements();

    // Generate insights
    this.generateInsights();

    return true;
  }

  public markHabitIncomplete(habitId: string, date: Date): boolean {
    const dateString = this.formatDate(date);
    const entries = this.getEntries();
    const entryIndex = entries.findIndex(entry => entry.habitId === habitId && entry.date === dateString);

    if (entryIndex >= 0) {
      entries[entryIndex].completed = false;
      entries[entryIndex].count = 0;
      entries[entryIndex].updatedAt = new Date().toISOString();
      storage.set(this.ENTRIES_KEY, JSON.stringify(entries));
    }

    // Update habit stats
    this.updateHabitStats(habitId);

    // Update daily goal
    this.updateDailyGoalProgress(date);

    return true;
  }

  private updateHabitStats(habitId: string): void {
    const habit = this.getHabit(habitId);
    if (!habit) return;

    const entries = this.getEntriesForHabit(habitId);
    const completedEntries = entries.filter(entry => entry.completed);

    // Calculate current streak
    const currentStreak = this.calculateCurrentStreak(habitId);
    const bestStreak = Math.max(currentStreak, habit.bestStreak);
    const totalCompletions = completedEntries.reduce((sum, entry) => sum + entry.count, 0);

    this.updateHabit(habitId, {
      streak: currentStreak,
      bestStreak,
      totalCompletions,
    });
  }

  private calculateCurrentStreak(habitId: string): number {
    const entries = this.getEntriesForHabit(habitId);
    const completedEntries = entries.filter(entry => entry.completed).sort((a, b) => b.date.localeCompare(a.date));

    if (completedEntries.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    let currentDate = new Date(today);

    // Check if today or yesterday was completed
    const todayString = this.formatDate(today);
    const yesterdayString = this.formatDate(new Date(today.getTime() - 24 * 60 * 60 * 1000));
    
    const todayEntry = completedEntries.find(entry => entry.date === todayString);
    const yesterdayEntry = completedEntries.find(entry => entry.date === yesterdayString);

    if (!todayEntry && !yesterdayEntry) return 0;

    // Start from yesterday if today is not completed
    if (!todayEntry && yesterdayEntry) {
      currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    }

    // Count consecutive days backwards
    for (let i = 0; i < completedEntries.length; i++) {
      const dateString = this.formatDate(currentDate);
      const entry = completedEntries.find(entry => entry.date === dateString);
      
      if (entry && entry.completed) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    return streak;
  }

  // CATEGORIES
  public getCategories(): HabitCategory[] {
    const data = storage.getString(this.CATEGORIES_KEY);
    return data ? JSON.parse(data) : [];
  }

  public getCategory(id: string): HabitCategory | null {
    const categories = this.getCategories();
    return categories.find(category => category.id === id) || null;
  }

  public addCategory(category: HabitCategory): string {
    const categories = this.getCategories();
    categories.push(category);
    storage.set(this.CATEGORIES_KEY, JSON.stringify(categories));
    return category.id;
  }

  public updateCategory(id: string, updates: Partial<HabitCategory>): boolean {
    const categories = this.getCategories();
    const index = categories.findIndex(category => category.id === id);
    
    if (index === -1) return false;

    categories[index] = { ...categories[index], ...updates };
    storage.set(this.CATEGORIES_KEY, JSON.stringify(categories));
    return true;
  }

  public deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const category = categories.find(cat => cat.id === id);
    
    if (!category || category.isDefault) return false;

    const filteredCategories = categories.filter(category => category.id !== id);
    storage.set(this.CATEGORIES_KEY, JSON.stringify(filteredCategories));
    return true;
  }

  private updateCategoryHabitCount(categoryName: string, delta: number): void {
    const categories = this.getCategories();
    const category = categories.find(cat => cat.name === categoryName);
    
    if (category) {
      category.habitCount = Math.max(0, category.habitCount + delta);
      storage.set(this.CATEGORIES_KEY, JSON.stringify(categories));
    }
  }

  // ACHIEVEMENTS
  public getAchievements(): Achievement[] {
    const data = storage.getString(this.ACHIEVEMENTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  public getUnlockedAchievements(): Achievement[] {
    return this.getAchievements().filter(achievement => achievement.unlockedAt);
  }

  public unlockAchievement(achievementId: string): boolean {
    const achievements = this.getAchievements();
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement || achievement.unlockedAt) return false;

    achievement.unlockedAt = new Date().toISOString();
    storage.set(this.ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    
    // Generate celebration insight
    this.addInsight({
      type: 'celebration',
      title: 'Achievement Unlocked! 🏆',
      message: `Congratulations! You've earned "${achievement.title}"`,
      actionable: false,
      priority: 'high',
    });

    return true;
  }

  private checkAchievements(): void {
    const habits = this.getHabits();
    const achievements = this.getAchievements();
    const unlockedIds = new Set(achievements.filter(a => a.unlockedAt).map(a => a.id));

    // Initialize achievement templates if empty
    if (achievements.length === 0) {
      this.initializeAchievements();
    }

    // Check various achievement conditions
    habits.forEach(habit => {
      // Streak achievements
      if (habit.streak >= 7 && !unlockedIds.has('week_streak')) {
        this.unlockAchievement('week_streak');
      }
      if (habit.streak >= 30 && !unlockedIds.has('month_streak')) {
        this.unlockAchievement('month_streak');
      }
      if (habit.streak >= 100 && !unlockedIds.has('hundred_streak')) {
        this.unlockAchievement('hundred_streak');
      }

      // Completion achievements
      if (habit.totalCompletions >= 50 && !unlockedIds.has('fifty_completions')) {
        this.unlockAchievement('fifty_completions');
      }
      if (habit.totalCompletions >= 365 && !unlockedIds.has('year_completions')) {
        this.unlockAchievement('year_completions');
      }
    });

    // Overall achievements
    const totalHabits = habits.length;
    if (totalHabits >= 5 && !unlockedIds.has('habit_collector')) {
      this.unlockAchievement('habit_collector');
    }
    if (totalHabits >= 20 && !unlockedIds.has('habit_master')) {
      this.unlockAchievement('habit_master');
    }
  }

  private initializeAchievements(): void {
    const achievements: Achievement[] = [
      { id: 'first_habit', title: 'Getting Started', description: 'Create your first habit', icon: 'rocket-launch', type: 'milestone', requirement: 1 },
      { id: 'week_streak', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'fire', type: 'streak', requirement: 7 },
      { id: 'month_streak', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: 'trophy', type: 'streak', requirement: 30 },
      { id: 'hundred_streak', title: 'Century Club', description: 'Maintain a 100-day streak', icon: 'star', type: 'streak', requirement: 100 },
      { id: 'fifty_completions', title: 'Half Century', description: 'Complete 50 habit instances', icon: 'medal', type: 'completion', requirement: 50 },
      { id: 'year_completions', title: 'Annual Achiever', description: 'Complete 365 habit instances', icon: 'crown', type: 'completion', requirement: 365 },
      { id: 'habit_collector', title: 'Habit Collector', description: 'Create 5 different habits', icon: 'collection', type: 'milestone', requirement: 5 },
      { id: 'habit_master', title: 'Habit Master', description: 'Create 20 different habits', icon: 'expert', type: 'milestone', requirement: 20 },
    ];

    storage.set(this.ACHIEVEMENTS_KEY, JSON.stringify(achievements));
  }

  // TEMPLATES
  public getTemplates(): HabitTemplate[] {
    const data = storage.getString(this.TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  }

  public addTemplate(template: HabitTemplate): string {
    const templates = this.getTemplates();
    templates.push(template);
    storage.set(this.TEMPLATES_KEY, JSON.stringify(templates));
    return template.id;
  }

  // DAILY GOALS
  public getDailyGoals(): DailyGoal[] {
    const data = storage.getString(this.GOALS_KEY);
    return data ? JSON.parse(data) : [];
  }

  public getDailyGoal(date: Date): DailyGoal | null {
    const dateString = this.formatDate(date);
    const goals = this.getDailyGoals();
    return goals.find(goal => goal.date === dateString) || null;
  }

  public ensureDailyGoal(date: Date): DailyGoal {
    const existing = this.getDailyGoal(date);
    if (existing) return existing;

    const activeHabits = this.getHabits().filter(habit => habit.isActive);
    const dailyHabits = activeHabits.filter(habit => habit.frequency === 'daily');

    const goal: DailyGoal = {
      id: this.generateId(),
      date: this.formatDate(date),
      targetHabits: dailyHabits.length,
      completedHabits: 0,
      isAchieved: false,
      createdAt: new Date().toISOString(),
    };

    const goals = this.getDailyGoals();
    goals.push(goal);
    storage.set(this.GOALS_KEY, JSON.stringify(goals));

    return goal;
  }

  private updateDailyGoalProgress(date: Date): void {
    const goal = this.ensureDailyGoal(date);
    const entries = this.getEntriesForDate(date);
    const completedToday = entries.filter(entry => entry.completed).length;

    goal.completedHabits = completedToday;
    goal.isAchieved = completedToday >= goal.targetHabits;

    const goals = this.getDailyGoals();
    const index = goals.findIndex(g => g.id === goal.id);
    if (index >= 0) {
      goals[index] = goal;
      storage.set(this.GOALS_KEY, JSON.stringify(goals));
    }
  }

  // ANALYTICS & STATS
  public getHabitStats(habitId: string): HabitStats | null {
    const habit = this.getHabit(habitId);
    if (!habit) return null;

    const entries = this.getEntriesForHabit(habitId);
    const completedEntries = entries.filter(entry => entry.completed);

    if (completedEntries.length === 0) {
      return {
        habitId,
        totalEntries: 0,
        completionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        averagePerWeek: 0,
        averagePerMonth: 0,
        bestMonth: '',
        worstMonth: '',
        consistency: 0,
        momentum: 'stable',
      };
    }

    const totalEntries = entries.length;
    const completionRate = totalEntries > 0 ? (completedEntries.length / totalEntries) * 100 : 0;

    // Calculate averages
    const daysWithData = this.getDaysBetween(new Date(completedEntries[completedEntries.length - 1].date), new Date());
    const weeksWithData = Math.max(1, Math.ceil(daysWithData / 7));
    const monthsWithData = Math.max(1, Math.ceil(daysWithData / 30));

    const averagePerWeek = completedEntries.length / weeksWithData;
    const averagePerMonth = completedEntries.length / monthsWithData;

    // Calculate monthly performance
    const monthlyStats = this.getMonthlyCompletions(habitId);
    const months = Object.keys(monthlyStats);
    const bestMonth = months.reduce((best, month) => 
      monthlyStats[month] > (monthlyStats[best] || 0) ? month : best, months[0] || '');
    const worstMonth = months.reduce((worst, month) => 
      monthlyStats[month] < (monthlyStats[worst] || Infinity) ? month : worst, months[0] || '');

    // Calculate consistency (how regular the completions are)
    const consistency = this.calculateConsistency(completedEntries);

    // Calculate momentum (recent trend)
    const momentum = this.calculateMomentum(completedEntries);

    return {
      habitId,
      totalEntries,
      completionRate,
      currentStreak: habit.streak,
      longestStreak: habit.bestStreak,
      averagePerWeek,
      averagePerMonth,
      bestMonth,
      worstMonth,
      consistency,
      momentum,
      lastCompleted: completedEntries.length > 0 ? completedEntries[0].date : undefined,
    };
  }

  private getDaysBetween(start: Date, end: Date): number {
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  private getMonthlyCompletions(habitId: string): { [month: string]: number } {
    const entries = this.getEntriesForHabit(habitId);
    const completedEntries = entries.filter(entry => entry.completed);

    return completedEntries.reduce((acc, entry) => {
      const month = entry.date.substring(0, 7); // YYYY-MM
      acc[month] = (acc[month] || 0) + entry.count;
      return acc;
    }, {} as { [month: string]: number });
  }

  private calculateConsistency(entries: HabitEntry[]): number {
    if (entries.length < 2) return 100;

    // Calculate variance in gaps between completions
    const dates = entries.map(entry => new Date(entry.date)).sort((a, b) => a.getTime() - b.getTime());
    const gaps = [];
    
    for (let i = 1; i < dates.length; i++) {
      const gap = this.getDaysBetween(dates[i - 1], dates[i]);
      gaps.push(gap);
    }

    const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
    const variance = gaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / gaps.length;
    const standardDeviation = Math.sqrt(variance);

    // Lower deviation = higher consistency
    const consistency = Math.max(0, 100 - (standardDeviation * 10));
    return Math.min(100, consistency);
  }

  private calculateMomentum(entries: HabitEntry[]): 'increasing' | 'decreasing' | 'stable' {
    if (entries.length < 7) return 'stable';

    const sortedEntries = entries.sort((a, b) => b.date.localeCompare(a.date));
    const recentWeek = sortedEntries.slice(0, 7);
    const previousWeek = sortedEntries.slice(7, 14);

    const recentCount = recentWeek.filter(entry => entry.completed).length;
    const previousCount = previousWeek.filter(entry => entry.completed).length;

    if (recentCount > previousCount) return 'increasing';
    if (recentCount < previousCount) return 'decreasing';
    return 'stable';
  }

  // INSIGHTS
  public getInsights(): HabitInsight[] {
    const data = storage.getString(this.INSIGHTS_KEY);
    return data ? JSON.parse(data) : [];
  }

  public addInsight(insight: Omit<HabitInsight, 'id' | 'createdAt' | 'isRead'>): string {
    const insights = this.getInsights();
    const newInsight: HabitInsight = {
      ...insight,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    insights.push(newInsight);
    storage.set(this.INSIGHTS_KEY, JSON.stringify(insights));
    return newInsight.id;
  }

  public markInsightAsRead(id: string): boolean {
    const insights = this.getInsights();
    const insight = insights.find(i => i.id === id);
    
    if (!insight) return false;

    insight.isRead = true;
    storage.set(this.INSIGHTS_KEY, JSON.stringify(insights));
    return true;
  }

  private generateInsights(): void {
    const habits = this.getHabits();
    const today = new Date();

    habits.forEach(habit => {
      const stats = this.getHabitStats(habit.id);
      if (!stats) return;

      // Low completion rate warning
      if (stats.completionRate < 30 && stats.totalEntries >= 7) {
        this.addInsight({
          type: 'warning',
          title: 'Low Completion Rate',
          message: `${habit.name} has a ${stats.completionRate.toFixed(0)}% completion rate. Consider adjusting the difficulty.`,
          habitId: habit.id,
          actionable: true,
          action: 'adjust_difficulty',
          priority: 'medium',
        });
      }

      // Streak celebration
      if (habit.streak > 0 && habit.streak % 7 === 0) {
        this.addInsight({
          type: 'celebration',
          title: 'Streak Milestone! 🔥',
          message: `Amazing! You're on a ${habit.streak}-day streak with ${habit.name}!`,
          habitId: habit.id,
          actionable: false,
          priority: 'high',
        });
      }

      // Momentum insights
      if (stats.momentum === 'increasing') {
        this.addInsight({
          type: 'celebration',
          title: 'Building Momentum! 📈',
          message: `Great job! ${habit.name} is showing positive momentum this week.`,
          habitId: habit.id,
          actionable: false,
          priority: 'medium',
        });
      }
    });
  }

  // MOTIVATIONAL QUOTES
  public getTodaysQuote(): MotivationalQuote | null {
    const quotes = this.getQuotes();
    if (quotes.length === 0) return null;

    // Use date as seed for consistent daily quote
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const index = dayOfYear % quotes.length;
    
    return quotes[index];
  }

  private getQuotes(): MotivationalQuote[] {
    const data = storage.getString(this.QUOTES_KEY);
    return data ? JSON.parse(data) : [];
  }

  private generateDailyQuotes(): void {
    const quotes = this.getQuotes();
    if (quotes.length > 0) return;

    const defaultQuotes: MotivationalQuote[] = [
      { id: '1', text: 'We are what we repeatedly do. Excellence, then, is not an act, but a habit.', author: 'Aristotle', category: 'motivation', isLiked: false },
      { id: '2', text: 'The secret of getting ahead is getting started.', author: 'Mark Twain', category: 'motivation', isLiked: false },
      { id: '3', text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier', category: 'success', isLiked: false },
      { id: '4', text: 'Motivation is what gets you started. Habit is what keeps you going.', author: 'Jim Ryun', category: 'habits', isLiked: false },
      { id: '5', text: 'First we make our habits, then our habits make us.', author: 'Charles C. Noble', category: 'habits', isLiked: false },
    ];

    storage.set(this.QUOTES_KEY, JSON.stringify(defaultQuotes));
  }

  // SETTINGS
  public getSettings(): UserSettings | null {
    const data = storage.getString(this.SETTINGS_KEY);
    return data ? JSON.parse(data) : null;
  }

  public updateSettings(settings: UserSettings): void {
    storage.set(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  // REMINDERS
  public getReminders(): HabitReminder[] {
    const data = storage.getString(this.REMINDERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  public addReminder(reminder: Omit<HabitReminder, 'id'>): string {
    const reminders = this.getReminders();
    const newReminder: HabitReminder = {
      ...reminder,
      id: this.generateId(),
    };

    reminders.push(newReminder);
    storage.set(this.REMINDERS_KEY, JSON.stringify(reminders));
    return newReminder.id;
  }

  public updateReminder(id: string, updates: Partial<HabitReminder>): boolean {
    const reminders = this.getReminders();
    const index = reminders.findIndex(reminder => reminder.id === id);
    
    if (index === -1) return false;

    reminders[index] = { ...reminders[index], ...updates };
    storage.set(this.REMINDERS_KEY, JSON.stringify(reminders));
    return true;
  }

  public deleteReminder(id: string): boolean {
    const reminders = this.getReminders();
    const filteredReminders = reminders.filter(reminder => reminder.id !== id);
    storage.set(this.REMINDERS_KEY, JSON.stringify(filteredReminders));
    return true;
  }

  // DATA EXPORT/IMPORT
  public exportData(): string {
    const data = {
      habits: this.getHabits(),
      entries: this.getEntries(),
      categories: this.getCategories(),
      achievements: this.getAchievements(),
      settings: this.getSettings(),
      reminders: this.getReminders(),
      exportDate: new Date().toISOString(),
    };

    return JSON.stringify(data, null, 2);
  }

  public importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.habits) storage.set(this.HABITS_KEY, JSON.stringify(data.habits));
      if (data.entries) storage.set(this.ENTRIES_KEY, JSON.stringify(data.entries));
      if (data.categories) storage.set(this.CATEGORIES_KEY, JSON.stringify(data.categories));
      if (data.achievements) storage.set(this.ACHIEVEMENTS_KEY, JSON.stringify(data.achievements));
      if (data.settings) storage.set(this.SETTINGS_KEY, JSON.stringify(data.settings));
      if (data.reminders) storage.set(this.REMINDERS_KEY, JSON.stringify(data.reminders));

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // UTILITY METHODS
  public clearAllData(): void {
    storage.delete(this.HABITS_KEY);
    storage.delete(this.ENTRIES_KEY);
    storage.delete(this.CATEGORIES_KEY);
    storage.delete(this.ACHIEVEMENTS_KEY);
    storage.delete(this.TEMPLATES_KEY);
    storage.delete(this.GOALS_KEY);
    storage.delete(this.REVIEWS_KEY);
    storage.delete(this.REMINDERS_KEY);
    storage.delete(this.SETTINGS_KEY);
    storage.delete(this.QUOTES_KEY);
    storage.delete(this.INSIGHTS_KEY);
    
    this.initializeDefaults();
  }

  public getOverallStats(): {
    totalHabits: number;
    activeHabits: number;
    totalCompletions: number;
    longestStreak: number;
    averageCompletionRate: number;
    unlockedAchievements: number;
  } {
    const habits = this.getHabits();
    const activeHabits = habits.filter(habit => habit.isActive);
    const achievements = this.getUnlockedAchievements();

    const totalCompletions = habits.reduce((sum, habit) => sum + habit.totalCompletions, 0);
    const longestStreak = Math.max(...habits.map(habit => habit.bestStreak), 0);
    
    const completionRates = habits.map(habit => {
      const stats = this.getHabitStats(habit.id);
      return stats ? stats.completionRate : 0;
    });
    const averageCompletionRate = completionRates.length > 0 
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length 
      : 0;

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      totalCompletions,
      longestStreak,
      averageCompletionRate,
      unlockedAchievements: achievements.length,
    };
  }
}

export default HabitService.getInstance(); 