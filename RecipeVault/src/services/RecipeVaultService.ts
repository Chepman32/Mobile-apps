import { MMKV } from 'react-native-mmkv';
import {
  User,
  Recipe,
  MealPlan,
  ShoppingList,
  CookingSession,
  RecipeCategory,
  Cuisine,
  Achievement,
  Progress,
  Statistics,
  Notification,
  CalendarEvent,
  Ingredient,
  NutritionInfo,
} from '../types';

const storage = new MMKV();

export class RecipeVaultService {
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private formatDate(date: Date): string {
    return date.toISOString();
  }

  // User Management
  async getUser(): Promise<User> {
    const userData = storage.getString('user');
    if (userData) {
      return JSON.parse(userData);
    }
    
    // Default user
    const defaultUser: User = {
      id: this.generateId(),
      name: 'Recipe Enthusiast',
      email: 'user@recipevault.com',
      dateJoined: this.formatDate(new Date()),
      preferences: {
        dietaryRestrictions: [],
        favoriteCuisines: ['Italian', 'Mexican', 'Asian'],
        cookingSkillLevel: 'intermediate',
        units: 'metric',
      },
    };
    
    await this.saveUser(defaultUser);
    return defaultUser;
  }

  async saveUser(user: User): Promise<void> {
    storage.set('user', JSON.stringify(user));
  }

  // Recipe Management
  async getRecipes(): Promise<Recipe[]> {
    const recipesData = storage.getString('recipes');
    return recipesData ? JSON.parse(recipesData) : [];
  }

  async saveRecipes(recipes: Recipe[]): Promise<void> {
    storage.set('recipes', JSON.stringify(recipes));
  }

  async addRecipe(recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
    const recipes = await this.getRecipes();
    const newRecipe: Recipe = {
      ...recipe,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
      updatedAt: this.formatDate(new Date()),
    };
    
    recipes.push(newRecipe);
    await this.saveRecipes(recipes);
    return newRecipe;
  }

  async updateRecipe(recipe: Recipe): Promise<Recipe> {
    const recipes = await this.getRecipes();
    const updatedRecipe = {
      ...recipe,
      updatedAt: this.formatDate(new Date()),
    };
    
    const index = recipes.findIndex(r => r.id === recipe.id);
    if (index !== -1) {
      recipes[index] = updatedRecipe;
      await this.saveRecipes(recipes);
    }
    
    return updatedRecipe;
  }

  async deleteRecipe(recipeId: string): Promise<void> {
    const recipes = await this.getRecipes();
    const filteredRecipes = recipes.filter(r => r.id !== recipeId);
    await this.saveRecipes(filteredRecipes);
  }

  // Meal Plan Management
  async getMealPlans(): Promise<MealPlan[]> {
    const mealPlansData = storage.getString('mealPlans');
    return mealPlansData ? JSON.parse(mealPlansData) : [];
  }

  async saveMealPlans(mealPlans: MealPlan[]): Promise<void> {
    storage.set('mealPlans', JSON.stringify(mealPlans));
  }

  async addMealPlan(mealPlan: Omit<MealPlan, 'id' | 'createdAt'>): Promise<MealPlan> {
    const mealPlans = await this.getMealPlans();
    const newMealPlan: MealPlan = {
      ...mealPlan,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
    };
    
    mealPlans.push(newMealPlan);
    await this.saveMealPlans(mealPlans);
    return newMealPlan;
  }

  async updateMealPlan(mealPlan: MealPlan): Promise<MealPlan> {
    const mealPlans = await this.getMealPlans();
    const index = mealPlans.findIndex(mp => mp.id === mealPlan.id);
    if (index !== -1) {
      mealPlans[index] = mealPlan;
      await this.saveMealPlans(mealPlans);
    }
    return mealPlan;
  }

  async deleteMealPlan(mealPlanId: string): Promise<void> {
    const mealPlans = await this.getMealPlans();
    const filteredMealPlans = mealPlans.filter(mp => mp.id !== mealPlanId);
    await this.saveMealPlans(filteredMealPlans);
  }

  // Shopping List Management
  async getShoppingLists(): Promise<ShoppingList[]> {
    const shoppingListsData = storage.getString('shoppingLists');
    return shoppingListsData ? JSON.parse(shoppingListsData) : [];
  }

  async saveShoppingLists(shoppingLists: ShoppingList[]): Promise<void> {
    storage.set('shoppingLists', JSON.stringify(shoppingLists));
  }

  async addShoppingList(shoppingList: Omit<ShoppingList, 'id' | 'createdAt'>): Promise<ShoppingList> {
    const shoppingLists = await this.getShoppingLists();
    const newShoppingList: ShoppingList = {
      ...shoppingList,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
    };
    
    shoppingLists.push(newShoppingList);
    await this.saveShoppingLists(shoppingLists);
    return newShoppingList;
  }

  async updateShoppingList(shoppingList: ShoppingList): Promise<ShoppingList> {
    const shoppingLists = await this.getShoppingLists();
    const index = shoppingLists.findIndex(sl => sl.id === shoppingList.id);
    if (index !== -1) {
      shoppingLists[index] = shoppingList;
      await this.saveShoppingLists(shoppingLists);
    }
    return shoppingList;
  }

  async deleteShoppingList(shoppingListId: string): Promise<void> {
    const shoppingLists = await this.getShoppingLists();
    const filteredShoppingLists = shoppingLists.filter(sl => sl.id !== shoppingListId);
    await this.saveShoppingLists(filteredShoppingLists);
  }

  // Cooking Session Management
  async getCookingSessions(): Promise<CookingSession[]> {
    const cookingSessionsData = storage.getString('cookingSessions');
    return cookingSessionsData ? JSON.parse(cookingSessionsData) : [];
  }

  async saveCookingSessions(cookingSessions: CookingSession[]): Promise<void> {
    storage.set('cookingSessions', JSON.stringify(cookingSessions));
  }

  async addCookingSession(cookingSession: Omit<CookingSession, 'id'>): Promise<CookingSession> {
    const cookingSessions = await this.getCookingSessions();
    const newCookingSession: CookingSession = {
      ...cookingSession,
      id: this.generateId(),
    };
    
    cookingSessions.push(newCookingSession);
    await this.saveCookingSessions(cookingSessions);
    return newCookingSession;
  }

  async updateCookingSession(cookingSession: CookingSession): Promise<CookingSession> {
    const cookingSessions = await this.getCookingSessions();
    const index = cookingSessions.findIndex(cs => cs.id === cookingSession.id);
    if (index !== -1) {
      cookingSessions[index] = cookingSession;
      await this.saveCookingSessions(cookingSessions);
    }
    return cookingSession;
  }

  async deleteCookingSession(cookingSessionId: string): Promise<void> {
    const cookingSessions = await this.getCookingSessions();
    const filteredCookingSessions = cookingSessions.filter(cs => cs.id !== cookingSessionId);
    await this.saveCookingSessions(filteredCookingSessions);
  }

  // Recipe Categories
  async getRecipeCategories(): Promise<RecipeCategory[]> {
    const categoriesData = storage.getString('recipeCategories');
    if (categoriesData) {
      return JSON.parse(categoriesData);
    }
    
    // Default categories
    const defaultCategories: RecipeCategory[] = [
      { id: '1', name: 'Breakfast', description: 'Morning meals', icon: 'food-croissant', color: '#FF6B6B', recipeCount: 0 },
      { id: '2', name: 'Lunch', description: 'Midday meals', icon: 'food', color: '#4ECDC4', recipeCount: 0 },
      { id: '3', name: 'Dinner', description: 'Evening meals', icon: 'food-variant', color: '#45B7D1', recipeCount: 0 },
      { id: '4', name: 'Desserts', description: 'Sweet treats', icon: 'cake-variant', color: '#96CEB4', recipeCount: 0 },
      { id: '5', name: 'Snacks', description: 'Quick bites', icon: 'food-apple', color: '#FFEAA7', recipeCount: 0 },
      { id: '6', name: 'Beverages', description: 'Drinks and cocktails', icon: 'cup-water', color: '#DDA0DD', recipeCount: 0 },
      { id: '7', name: 'Soups', description: 'Warm and comforting', icon: 'pot-steam', color: '#98D8C8', recipeCount: 0 },
      { id: '8', name: 'Salads', description: 'Fresh and healthy', icon: 'leaf', color: '#F7DC6F', recipeCount: 0 },
      { id: '9', name: 'Breads', description: 'Homemade breads', icon: 'bread-slice', color: '#BB8FCE', recipeCount: 0 },
      { id: '10', name: 'Pasta', description: 'Italian favorites', icon: 'food-fork-drink', color: '#85C1E9', recipeCount: 0 },
    ];
    
    await this.saveRecipeCategories(defaultCategories);
    return defaultCategories;
  }

  async saveRecipeCategories(categories: RecipeCategory[]): Promise<void> {
    storage.set('recipeCategories', JSON.stringify(categories));
  }

  // Cuisines
  async getCuisines(): Promise<Cuisine[]> {
    const cuisinesData = storage.getString('cuisines');
    if (cuisinesData) {
      return JSON.parse(cuisinesData);
    }
    
    // Default cuisines
    const defaultCuisines: Cuisine[] = [
      { id: '1', name: 'Italian', description: 'Mediterranean cuisine', flag: '🇮🇹', recipeCount: 0 },
      { id: '2', name: 'Mexican', description: 'Spicy and flavorful', flag: '🇲🇽', recipeCount: 0 },
      { id: '3', name: 'Asian', description: 'Eastern flavors', flag: '🇨🇳', recipeCount: 0 },
      { id: '4', name: 'American', description: 'Classic comfort food', flag: '🇺🇸', recipeCount: 0 },
      { id: '5', name: 'French', description: 'Elegant cuisine', flag: '🇫🇷', recipeCount: 0 },
      { id: '6', name: 'Indian', description: 'Spicy and aromatic', flag: '🇮🇳', recipeCount: 0 },
      { id: '7', name: 'Thai', description: 'Sweet and sour', flag: '🇹🇭', recipeCount: 0 },
      { id: '8', name: 'Japanese', description: 'Fresh and healthy', flag: '🇯🇵', recipeCount: 0 },
      { id: '9', name: 'Greek', description: 'Mediterranean classics', flag: '🇬🇷', recipeCount: 0 },
      { id: '10', name: 'Spanish', description: 'Tapas and paella', flag: '🇪🇸', recipeCount: 0 },
    ];
    
    await this.saveCuisines(defaultCuisines);
    return defaultCuisines;
  }

  async saveCuisines(cuisines: Cuisine[]): Promise<void> {
    storage.set('cuisines', JSON.stringify(cuisines));
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    const achievementsData = storage.getString('achievements');
    if (achievementsData) {
      return JSON.parse(achievementsData);
    }
    
    // Default achievements
    const defaultAchievements: Achievement[] = [
      { id: '1', title: 'First Recipe', description: 'Add your first recipe', type: 'recipe_count', icon: 'plus-circle', isUnlocked: false, progress: 0, target: 1 },
      { id: '2', title: 'Recipe Collector', description: 'Add 10 recipes', type: 'recipe_count', icon: 'book-open', isUnlocked: false, progress: 0, target: 10 },
      { id: '3', title: 'Master Chef', description: 'Add 50 recipes', type: 'recipe_count', icon: 'chef-hat', isUnlocked: false, progress: 0, target: 50 },
      { id: '4', title: 'Cooking Streak', description: 'Cook 7 days in a row', type: 'cooking_streak', icon: 'fire', isUnlocked: false, progress: 0, target: 7 },
      { id: '5', title: 'Cuisine Explorer', description: 'Try recipes from 5 different cuisines', type: 'cuisine_master', icon: 'earth', isUnlocked: false, progress: 0, target: 5 },
      { id: '6', title: 'Meal Planner', description: 'Create 5 meal plans', type: 'meal_planner', icon: 'calendar', isUnlocked: false, progress: 0, target: 5 },
      { id: '7', title: 'Shopping Pro', description: 'Complete 10 shopping lists', type: 'shopping_saver', icon: 'cart', isUnlocked: false, progress: 0, target: 10 },
      { id: '8', title: 'Perfect Score', description: 'Rate a recipe 5 stars', type: 'recipe_count', icon: 'star', isUnlocked: false, progress: 0, target: 1 },
    ];
    
    await this.saveAchievements(defaultAchievements);
    return defaultAchievements;
  }

  async saveAchievements(achievements: Achievement[]): Promise<void> {
    storage.set('achievements', JSON.stringify(achievements));
  }

  async updateAchievement(achievement: Achievement): Promise<Achievement> {
    const achievements = await this.getAchievements();
    const index = achievements.findIndex(a => a.id === achievement.id);
    if (index !== -1) {
      achievements[index] = achievement;
      await this.saveAchievements(achievements);
    }
    return achievement;
  }

  // Progress
  async getProgress(): Promise<Progress[]> {
    const progressData = storage.getString('progress');
    return progressData ? JSON.parse(progressData) : [];
  }

  async saveProgress(progress: Progress[]): Promise<void> {
    storage.set('progress', JSON.stringify(progress));
  }

  // Statistics
  async getStatistics(): Promise<Statistics> {
    const statisticsData = storage.getString('statistics');
    if (statisticsData) {
      return JSON.parse(statisticsData);
    }
    
    const defaultStatistics: Statistics = {
      totalRecipes: 0,
      totalCookTime: 0,
      averageRating: 0,
      favoriteCuisine: 'None',
      mostCookedRecipe: 'None',
      cookingStreak: 0,
      totalMealPlans: 0,
      totalShoppingLists: 0,
      averagePrepTime: 0,
      averageCookTime: 0,
    };
    
    await this.saveStatistics(defaultStatistics);
    return defaultStatistics;
  }

  async saveStatistics(statistics: Statistics): Promise<void> {
    storage.set('statistics', JSON.stringify(statistics));
  }

  // Notifications
  async getNotifications(): Promise<Notification[]> {
    const notificationsData = storage.getString('notifications');
    return notificationsData ? JSON.parse(notificationsData) : [];
  }

  async saveNotifications(notifications: Notification[]): Promise<void> {
    storage.set('notifications', JSON.stringify(notifications));
  }

  async addNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notifications = await this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: this.generateId(),
      createdAt: this.formatDate(new Date()),
    };
    
    notifications.push(newNotification);
    await this.saveNotifications(notifications);
    return newNotification;
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    const notifications = await this.getNotifications();
    const index = notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      notifications[index].isRead = true;
      await this.saveNotifications(notifications);
    }
  }

  // Calendar Events
  async getCalendarEvents(): Promise<CalendarEvent[]> {
    const calendarEventsData = storage.getString('calendarEvents');
    return calendarEventsData ? JSON.parse(calendarEventsData) : [];
  }

  async saveCalendarEvents(calendarEvents: CalendarEvent[]): Promise<void> {
    storage.set('calendarEvents', JSON.stringify(calendarEvents));
  }

  async addCalendarEvent(calendarEvent: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const calendarEvents = await this.getCalendarEvents();
    const newCalendarEvent: CalendarEvent = {
      ...calendarEvent,
      id: this.generateId(),
    };
    
    calendarEvents.push(newCalendarEvent);
    await this.saveCalendarEvents(calendarEvents);
    return newCalendarEvent;
  }

  async updateCalendarEvent(calendarEvent: CalendarEvent): Promise<CalendarEvent> {
    const calendarEvents = await this.getCalendarEvents();
    const index = calendarEvents.findIndex(ce => ce.id === calendarEvent.id);
    if (index !== -1) {
      calendarEvents[index] = calendarEvent;
      await this.saveCalendarEvents(calendarEvents);
    }
    return calendarEvent;
  }

  async deleteCalendarEvent(calendarEventId: string): Promise<void> {
    const calendarEvents = await this.getCalendarEvents();
    const filteredCalendarEvents = calendarEvents.filter(ce => ce.id !== calendarEventId);
    await this.saveCalendarEvents(filteredCalendarEvents);
  }

  // Data Export/Import
  async exportData(): Promise<string> {
    const data = {
      user: await this.getUser(),
      recipes: await this.getRecipes(),
      mealPlans: await this.getMealPlans(),
      shoppingLists: await this.getShoppingLists(),
      cookingSessions: await this.getCookingSessions(),
      recipeCategories: await this.getRecipeCategories(),
      cuisines: await this.getCuisines(),
      achievements: await this.getAchievements(),
      progress: await this.getProgress(),
      statistics: await this.getStatistics(),
      notifications: await this.getNotifications(),
      calendarEvents: await this.getCalendarEvents(),
      exportDate: this.formatDate(new Date()),
    };
    
    return JSON.stringify(data, null, 2);
  }

  async importData(jsonData: string): Promise<boolean> {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.user) await this.saveUser(data.user);
      if (data.recipes) await this.saveRecipes(data.recipes);
      if (data.mealPlans) await this.saveMealPlans(data.mealPlans);
      if (data.shoppingLists) await this.saveShoppingLists(data.shoppingLists);
      if (data.cookingSessions) await this.saveCookingSessions(data.cookingSessions);
      if (data.recipeCategories) await this.saveRecipeCategories(data.recipeCategories);
      if (data.cuisines) await this.saveCuisines(data.cuisines);
      if (data.achievements) await this.saveAchievements(data.achievements);
      if (data.progress) await this.saveProgress(data.progress);
      if (data.statistics) await this.saveStatistics(data.statistics);
      if (data.notifications) await this.saveNotifications(data.notifications);
      if (data.calendarEvents) await this.saveCalendarEvents(data.calendarEvents);
      
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      return false;
    }
  }

  async clearAllData(): Promise<void> {
    storage.clearAll();
  }

  // Utility Methods
  async generateShoppingListFromRecipes(recipeIds: string[], servings: number = 1): Promise<ShoppingList> {
    const recipes = await this.getRecipes();
    const selectedRecipes = recipes.filter(r => recipeIds.includes(r.id));
    
    const ingredients: { [key: string]: { amount: number; unit: string; notes?: string } } = {};
    
    selectedRecipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        if (ingredients[key]) {
          ingredients[key].amount += ingredient.amount * servings;
        } else {
          ingredients[key] = {
            amount: ingredient.amount * servings,
            unit: ingredient.unit,
            notes: ingredient.notes,
          };
        }
      });
    });
    
    const shoppingItems = Object.entries(ingredients).map(([name, data]) => ({
      id: this.generateId(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      amount: data.amount,
      unit: data.unit,
      category: 'General',
      isChecked: false,
      estimatedCost: 0,
      notes: data.notes || '',
    }));
    
    return {
      id: this.generateId(),
      title: `Shopping List - ${new Date().toLocaleDateString()}`,
      items: shoppingItems,
      totalEstimatedCost: 0,
      isCompleted: false,
      createdAt: this.formatDate(new Date()),
    };
  }

  async updateRecipeStatistics(): Promise<void> {
    const recipes = await this.getRecipes();
    const cookingSessions = await this.getCookingSessions();
    const mealPlans = await this.getMealPlans();
    const shoppingLists = await this.getShoppingLists();
    
    const statistics: Statistics = {
      totalRecipes: recipes.length,
      totalCookTime: cookingSessions.reduce((sum, cs) => sum + cs.duration, 0),
      averageRating: recipes.length > 0 ? recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length : 0,
      favoriteCuisine: this.getMostCommonCuisine(recipes),
      mostCookedRecipe: this.getMostCookedRecipe(recipes),
      cookingStreak: this.calculateCookingStreak(cookingSessions),
      totalMealPlans: mealPlans.length,
      totalShoppingLists: shoppingLists.length,
      averagePrepTime: recipes.length > 0 ? recipes.reduce((sum, r) => sum + r.prepTime, 0) / recipes.length : 0,
      averageCookTime: recipes.length > 0 ? recipes.reduce((sum, r) => sum + r.cookTime, 0) / recipes.length : 0,
    };
    
    await this.saveStatistics(statistics);
  }

  private getMostCommonCuisine(recipes: Recipe[]): string {
    const cuisineCounts: { [key: string]: number } = {};
    recipes.forEach(recipe => {
      cuisineCounts[recipe.cuisine] = (cuisineCounts[recipe.cuisine] || 0) + 1;
    });
    
    const sortedCuisines = Object.entries(cuisineCounts).sort((a, b) => b[1] - a[1]);
    return sortedCuisines.length > 0 ? sortedCuisines[0][0] : 'None';
  }

  private getMostCookedRecipe(recipes: Recipe[]): string {
    const sortedRecipes = recipes.sort((a, b) => b.timesCooked - a.timesCooked);
    return sortedRecipes.length > 0 ? sortedRecipes[0].title : 'None';
  }

  private calculateCookingStreak(cookingSessions: CookingSession[]): number {
    if (cookingSessions.length === 0) return 0;
    
    const sortedSessions = cookingSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= 1) {
        streak++;
        currentDate = sessionDate;
      } else {
        break;
      }
    }
    
    return streak;
  }
} 