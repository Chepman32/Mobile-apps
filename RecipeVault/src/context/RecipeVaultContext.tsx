import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { RecipeVaultService } from '../services/RecipeVaultService';
import { AppState, AppAction } from '../types';

const service = new RecipeVaultService();

const initialState: AppState = {
  user: {
    id: '',
    name: '',
    email: '',
    dateJoined: '',
    preferences: {
      dietaryRestrictions: [],
      favoriteCuisines: [],
      cookingSkillLevel: 'beginner',
      units: 'metric',
    },
  },
  recipes: [],
  mealPlans: [],
  shoppingLists: [],
  cookingSessions: [],
  recipeCategories: [],
  cuisines: [],
  achievements: [],
  progress: [],
  statistics: {
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
  },
  notifications: [],
  calendarEvents: [],
  isLoading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'SET_RECIPES':
      return { ...state, recipes: action.payload };
    
    case 'ADD_RECIPE':
      return { ...state, recipes: [...state.recipes, action.payload] };
    
    case 'UPDATE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.map(recipe =>
          recipe.id === action.payload.id ? action.payload : recipe
        ),
      };
    
    case 'DELETE_RECIPE':
      return {
        ...state,
        recipes: state.recipes.filter(recipe => recipe.id !== action.payload),
      };
    
    case 'SET_MEAL_PLANS':
      return { ...state, mealPlans: action.payload };
    
    case 'ADD_MEAL_PLAN':
      return { ...state, mealPlans: [...state.mealPlans, action.payload] };
    
    case 'UPDATE_MEAL_PLAN':
      return {
        ...state,
        mealPlans: state.mealPlans.map(mealPlan =>
          mealPlan.id === action.payload.id ? action.payload : mealPlan
        ),
      };
    
    case 'DELETE_MEAL_PLAN':
      return {
        ...state,
        mealPlans: state.mealPlans.filter(mealPlan => mealPlan.id !== action.payload),
      };
    
    case 'SET_SHOPPING_LISTS':
      return { ...state, shoppingLists: action.payload };
    
    case 'ADD_SHOPPING_LIST':
      return { ...state, shoppingLists: [...state.shoppingLists, action.payload] };
    
    case 'UPDATE_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.map(shoppingList =>
          shoppingList.id === action.payload.id ? action.payload : shoppingList
        ),
      };
    
    case 'DELETE_SHOPPING_LIST':
      return {
        ...state,
        shoppingLists: state.shoppingLists.filter(shoppingList => shoppingList.id !== action.payload),
      };
    
    case 'SET_COOKING_SESSIONS':
      return { ...state, cookingSessions: action.payload };
    
    case 'ADD_COOKING_SESSION':
      return { ...state, cookingSessions: [...state.cookingSessions, action.payload] };
    
    case 'UPDATE_COOKING_SESSION':
      return {
        ...state,
        cookingSessions: state.cookingSessions.map(cookingSession =>
          cookingSession.id === action.payload.id ? action.payload : cookingSession
        ),
      };
    
    case 'DELETE_COOKING_SESSION':
      return {
        ...state,
        cookingSessions: state.cookingSessions.filter(cookingSession => cookingSession.id !== action.payload),
      };
    
    case 'SET_RECIPE_CATEGORIES':
      return { ...state, recipeCategories: action.payload };
    
    case 'SET_CUISINES':
      return { ...state, cuisines: action.payload };
    
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    
    case 'UPDATE_ACHIEVEMENT':
      return {
        ...state,
        achievements: state.achievements.map(achievement =>
          achievement.id === action.payload.id ? action.payload : achievement
        ),
      };
    
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    
    case 'SET_STATISTICS':
      return { ...state, statistics: action.payload };
    
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, action.payload] };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload ? { ...notification, isRead: true } : notification
        ),
      };
    
    case 'SET_CALENDAR_EVENTS':
      return { ...state, calendarEvents: action.payload };
    
    case 'ADD_CALENDAR_EVENT':
      return { ...state, calendarEvents: [...state.calendarEvents, action.payload] };
    
    case 'UPDATE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.map(calendarEvent =>
          calendarEvent.id === action.payload.id ? action.payload : calendarEvent
        ),
      };
    
    case 'DELETE_CALENDAR_EVENT':
      return {
        ...state,
        calendarEvents: state.calendarEvents.filter(calendarEvent => calendarEvent.id !== action.payload),
      };
    
    case 'CLEAR_ALL_DATA':
      return initialState;
    
    default:
      return state;
  }
}

interface RecipeVaultContextType {
  state: AppState;
  actions: {
    // User actions
    fetchUser: () => Promise<void>;
    updateUser: (user: any) => Promise<void>;
    
    // Recipe actions
    fetchRecipes: () => Promise<void>;
    addRecipe: (recipe: any) => Promise<void>;
    updateRecipe: (recipe: any) => Promise<void>;
    deleteRecipe: (recipeId: string) => Promise<void>;
    
    // Meal plan actions
    fetchMealPlans: () => Promise<void>;
    addMealPlan: (mealPlan: any) => Promise<void>;
    updateMealPlan: (mealPlan: any) => Promise<void>;
    deleteMealPlan: (mealPlanId: string) => Promise<void>;
    
    // Shopping list actions
    fetchShoppingLists: () => Promise<void>;
    addShoppingList: (shoppingList: any) => Promise<void>;
    updateShoppingList: (shoppingList: any) => Promise<void>;
    deleteShoppingList: (shoppingListId: string) => Promise<void>;
    generateShoppingListFromRecipes: (recipeIds: string[], servings?: number) => Promise<void>;
    
    // Cooking session actions
    fetchCookingSessions: () => Promise<void>;
    addCookingSession: (cookingSession: any) => Promise<void>;
    updateCookingSession: (cookingSession: any) => Promise<void>;
    deleteCookingSession: (cookingSessionId: string) => Promise<void>;
    
    // Category and cuisine actions
    fetchRecipeCategories: () => Promise<void>;
    fetchCuisines: () => Promise<void>;
    
    // Achievement actions
    fetchAchievements: () => Promise<void>;
    updateAchievement: (achievement: any) => Promise<void>;
    
    // Progress and statistics actions
    fetchProgress: () => Promise<void>;
    fetchStatistics: () => Promise<void>;
    updateRecipeStatistics: () => Promise<void>;
    
    // Notification actions
    fetchNotifications: () => Promise<void>;
    addNotification: (notification: any) => Promise<void>;
    markNotificationRead: (notificationId: string) => Promise<void>;
    
    // Calendar event actions
    fetchCalendarEvents: () => Promise<void>;
    addCalendarEvent: (calendarEvent: any) => Promise<void>;
    updateCalendarEvent: (calendarEvent: any) => Promise<void>;
    deleteCalendarEvent: (calendarEventId: string) => Promise<void>;
    
    // Data management actions
    fetchAllData: () => Promise<void>;
    exportData: () => Promise<string>;
    importData: (jsonData: string) => Promise<boolean>;
    clearAllData: () => Promise<void>;
  };
}

const RecipeVaultContext = createContext<RecipeVaultContextType | undefined>(undefined);

export function RecipeVaultProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    // User actions
    fetchUser: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const user = await service.getUser();
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch user' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    updateUser: async (user: any) => {
      try {
        await service.saveUser(user);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update user' });
      }
    },

    // Recipe actions
    fetchRecipes: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const recipes = await service.getRecipes();
        dispatch({ type: 'SET_RECIPES', payload: recipes });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch recipes' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    addRecipe: async (recipe: any) => {
      try {
        const newRecipe = await service.addRecipe(recipe);
        dispatch({ type: 'ADD_RECIPE', payload: newRecipe });
        await actions.updateRecipeStatistics();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add recipe' });
      }
    },

    updateRecipe: async (recipe: any) => {
      try {
        const updatedRecipe = await service.updateRecipe(recipe);
        dispatch({ type: 'UPDATE_RECIPE', payload: updatedRecipe });
        await actions.updateRecipeStatistics();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update recipe' });
      }
    },

    deleteRecipe: async (recipeId: string) => {
      try {
        await service.deleteRecipe(recipeId);
        dispatch({ type: 'DELETE_RECIPE', payload: recipeId });
        await actions.updateRecipeStatistics();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete recipe' });
      }
    },

    // Meal plan actions
    fetchMealPlans: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const mealPlans = await service.getMealPlans();
        dispatch({ type: 'SET_MEAL_PLANS', payload: mealPlans });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch meal plans' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    addMealPlan: async (mealPlan: any) => {
      try {
        const newMealPlan = await service.addMealPlan(mealPlan);
        dispatch({ type: 'ADD_MEAL_PLAN', payload: newMealPlan });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add meal plan' });
      }
    },

    updateMealPlan: async (mealPlan: any) => {
      try {
        const updatedMealPlan = await service.updateMealPlan(mealPlan);
        dispatch({ type: 'UPDATE_MEAL_PLAN', payload: updatedMealPlan });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update meal plan' });
      }
    },

    deleteMealPlan: async (mealPlanId: string) => {
      try {
        await service.deleteMealPlan(mealPlanId);
        dispatch({ type: 'DELETE_MEAL_PLAN', payload: mealPlanId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete meal plan' });
      }
    },

    // Shopping list actions
    fetchShoppingLists: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const shoppingLists = await service.getShoppingLists();
        dispatch({ type: 'SET_SHOPPING_LISTS', payload: shoppingLists });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch shopping lists' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    addShoppingList: async (shoppingList: any) => {
      try {
        const newShoppingList = await service.addShoppingList(shoppingList);
        dispatch({ type: 'ADD_SHOPPING_LIST', payload: newShoppingList });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add shopping list' });
      }
    },

    updateShoppingList: async (shoppingList: any) => {
      try {
        const updatedShoppingList = await service.updateShoppingList(shoppingList);
        dispatch({ type: 'UPDATE_SHOPPING_LIST', payload: updatedShoppingList });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update shopping list' });
      }
    },

    deleteShoppingList: async (shoppingListId: string) => {
      try {
        await service.deleteShoppingList(shoppingListId);
        dispatch({ type: 'DELETE_SHOPPING_LIST', payload: shoppingListId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete shopping list' });
      }
    },

    generateShoppingListFromRecipes: async (recipeIds: string[], servings: number = 1) => {
      try {
        const shoppingList = await service.generateShoppingListFromRecipes(recipeIds, servings);
        dispatch({ type: 'ADD_SHOPPING_LIST', payload: shoppingList });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to generate shopping list' });
      }
    },

    // Cooking session actions
    fetchCookingSessions: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const cookingSessions = await service.getCookingSessions();
        dispatch({ type: 'SET_COOKING_SESSIONS', payload: cookingSessions });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch cooking sessions' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    addCookingSession: async (cookingSession: any) => {
      try {
        const newCookingSession = await service.addCookingSession(cookingSession);
        dispatch({ type: 'ADD_COOKING_SESSION', payload: newCookingSession });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add cooking session' });
      }
    },

    updateCookingSession: async (cookingSession: any) => {
      try {
        const updatedCookingSession = await service.updateCookingSession(cookingSession);
        dispatch({ type: 'UPDATE_COOKING_SESSION', payload: updatedCookingSession });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update cooking session' });
      }
    },

    deleteCookingSession: async (cookingSessionId: string) => {
      try {
        await service.deleteCookingSession(cookingSessionId);
        dispatch({ type: 'DELETE_COOKING_SESSION', payload: cookingSessionId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete cooking session' });
      }
    },

    // Category and cuisine actions
    fetchRecipeCategories: async () => {
      try {
        const categories = await service.getRecipeCategories();
        dispatch({ type: 'SET_RECIPE_CATEGORIES', payload: categories });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch recipe categories' });
      }
    },

    fetchCuisines: async () => {
      try {
        const cuisines = await service.getCuisines();
        dispatch({ type: 'SET_CUISINES', payload: cuisines });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch cuisines' });
      }
    },

    // Achievement actions
    fetchAchievements: async () => {
      try {
        const achievements = await service.getAchievements();
        dispatch({ type: 'SET_ACHIEVEMENTS', payload: achievements });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch achievements' });
      }
    },

    updateAchievement: async (achievement: any) => {
      try {
        const updatedAchievement = await service.updateAchievement(achievement);
        dispatch({ type: 'UPDATE_ACHIEVEMENT', payload: updatedAchievement });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update achievement' });
      }
    },

    // Progress and statistics actions
    fetchProgress: async () => {
      try {
        const progress = await service.getProgress();
        dispatch({ type: 'SET_PROGRESS', payload: progress });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch progress' });
      }
    },

    fetchStatistics: async () => {
      try {
        const statistics = await service.getStatistics();
        dispatch({ type: 'SET_STATISTICS', payload: statistics });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch statistics' });
      }
    },

    updateRecipeStatistics: async () => {
      try {
        await service.updateRecipeStatistics();
        const statistics = await service.getStatistics();
        dispatch({ type: 'SET_STATISTICS', payload: statistics });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update statistics' });
      }
    },

    // Notification actions
    fetchNotifications: async () => {
      try {
        const notifications = await service.getNotifications();
        dispatch({ type: 'SET_NOTIFICATIONS', payload: notifications });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch notifications' });
      }
    },

    addNotification: async (notification: any) => {
      try {
        const newNotification = await service.addNotification(notification);
        dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add notification' });
      }
    },

    markNotificationRead: async (notificationId: string) => {
      try {
        await service.markNotificationRead(notificationId);
        dispatch({ type: 'MARK_NOTIFICATION_READ', payload: notificationId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to mark notification as read' });
      }
    },

    // Calendar event actions
    fetchCalendarEvents: async () => {
      try {
        const calendarEvents = await service.getCalendarEvents();
        dispatch({ type: 'SET_CALENDAR_EVENTS', payload: calendarEvents });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch calendar events' });
      }
    },

    addCalendarEvent: async (calendarEvent: any) => {
      try {
        const newCalendarEvent = await service.addCalendarEvent(calendarEvent);
        dispatch({ type: 'ADD_CALENDAR_EVENT', payload: newCalendarEvent });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to add calendar event' });
      }
    },

    updateCalendarEvent: async (calendarEvent: any) => {
      try {
        const updatedCalendarEvent = await service.updateCalendarEvent(calendarEvent);
        dispatch({ type: 'UPDATE_CALENDAR_EVENT', payload: updatedCalendarEvent });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to update calendar event' });
      }
    },

    deleteCalendarEvent: async (calendarEventId: string) => {
      try {
        await service.deleteCalendarEvent(calendarEventId);
        dispatch({ type: 'DELETE_CALENDAR_EVENT', payload: calendarEventId });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to delete calendar event' });
      }
    },

    // Data management actions
    fetchAllData: async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        await Promise.all([
          actions.fetchUser(),
          actions.fetchRecipes(),
          actions.fetchMealPlans(),
          actions.fetchShoppingLists(),
          actions.fetchCookingSessions(),
          actions.fetchRecipeCategories(),
          actions.fetchCuisines(),
          actions.fetchAchievements(),
          actions.fetchProgress(),
          actions.fetchStatistics(),
          actions.fetchNotifications(),
          actions.fetchCalendarEvents(),
        ]);
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch all data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },

    exportData: async (): Promise<string> => {
      try {
        return await service.exportData();
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to export data' });
        throw error;
      }
    },

    importData: async (jsonData: string): Promise<boolean> => {
      try {
        const success = await service.importData(jsonData);
        if (success) {
          await actions.fetchAllData();
        }
        return success;
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to import data' });
        return false;
      }
    },

    clearAllData: async () => {
      try {
        await service.clearAllData();
        dispatch({ type: 'CLEAR_ALL_DATA' });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to clear data' });
      }
    },
  };

  useEffect(() => {
    actions.fetchAllData();
  }, []);

  return (
    <RecipeVaultContext.Provider value={{ state, actions }}>
      {children}
    </RecipeVaultContext.Provider>
  );
}

export function useRecipeVault() {
  const context = useContext(RecipeVaultContext);
  if (context === undefined) {
    throw new Error('useRecipeVault must be used within a RecipeVaultProvider');
  }
  return context;
} 