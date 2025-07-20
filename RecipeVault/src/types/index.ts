// RecipeVault Types

export interface User {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
  preferences: {
    dietaryRestrictions: string[];
    favoriteCuisines: string[];
    cookingSkillLevel: 'beginner' | 'intermediate' | 'advanced';
    units: 'metric' | 'imperial';
  };
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: Ingredient[];
  instructions: string[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  cuisine: string;
  category: string;
  tags: string[];
  image?: string;
  nutrition: NutritionInfo;
  rating: number;
  timesCooked: number;
  lastCooked?: string;
  isFavorite: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
}

export interface MealPlan {
  id: string;
  title: string;
  description: string;
  date: string;
  meals: PlannedMeal[];
  totalCalories: number;
  totalPrepTime: number;
  notes: string;
  createdAt: string;
}

export interface PlannedMeal {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: string;
  recipeTitle: string;
  servings: number;
  notes: string;
}

export interface ShoppingList {
  id: string;
  title: string;
  items: ShoppingItem[];
  totalEstimatedCost: number;
  isCompleted: boolean;
  createdAt: string;
  completedAt?: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
  isChecked: boolean;
  estimatedCost: number;
  notes: string;
}

export interface RecipeCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  recipeCount: number;
}

export interface Cuisine {
  id: string;
  name: string;
  description: string;
  flag: string;
  recipeCount: number;
}

export interface CookingSession {
  id: string;
  recipeId: string;
  recipeTitle: string;
  date: string;
  duration: number; // in minutes
  rating: number;
  notes: string;
  modifications: string[];
  photos: string[];
}

export interface RecipeTemplate {
  id: string;
  name: string;
  description: string;
  baseIngredients: Ingredient[];
  baseInstructions: string[];
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'recipe_count' | 'cooking_streak' | 'cuisine_master' | 'meal_planner' | 'shopping_saver';
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface Progress {
  id: string;
  date: string;
  recipesCooked: number;
  totalCookTime: number;
  averageRating: number;
  newRecipesTried: number;
  mealPlansCreated: number;
  shoppingListsCompleted: number;
}

export interface Statistics {
  totalRecipes: number;
  totalCookTime: number;
  averageRating: number;
  favoriteCuisine: string;
  mostCookedRecipe: string;
  cookingStreak: number;
  totalMealPlans: number;
  totalShoppingLists: number;
  averagePrepTime: number;
  averageCookTime: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'meal_reminder' | 'shopping_reminder' | 'cooking_tip' | 'achievement';
  isRead: boolean;
  createdAt: string;
  scheduledFor?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'meal_plan' | 'cooking_session' | 'shopping_trip';
  recipeId?: string;
  mealPlanId?: string;
  shoppingListId?: string;
  color: string;
}

export interface AppState {
  user: User;
  recipes: Recipe[];
  mealPlans: MealPlan[];
  shoppingLists: ShoppingList[];
  cookingSessions: CookingSession[];
  recipeCategories: RecipeCategory[];
  cuisines: Cuisine[];
  achievements: Achievement[];
  progress: Progress[];
  statistics: Statistics;
  notifications: Notification[];
  calendarEvents: CalendarEvent[];
  isLoading: boolean;
  error: string | null;
}

export type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_RECIPES'; payload: Recipe[] }
  | { type: 'ADD_RECIPE'; payload: Recipe }
  | { type: 'UPDATE_RECIPE'; payload: Recipe }
  | { type: 'DELETE_RECIPE'; payload: string }
  | { type: 'SET_MEAL_PLANS'; payload: MealPlan[] }
  | { type: 'ADD_MEAL_PLAN'; payload: MealPlan }
  | { type: 'UPDATE_MEAL_PLAN'; payload: MealPlan }
  | { type: 'DELETE_MEAL_PLAN'; payload: string }
  | { type: 'SET_SHOPPING_LISTS'; payload: ShoppingList[] }
  | { type: 'ADD_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'UPDATE_SHOPPING_LIST'; payload: ShoppingList }
  | { type: 'DELETE_SHOPPING_LIST'; payload: string }
  | { type: 'SET_COOKING_SESSIONS'; payload: CookingSession[] }
  | { type: 'ADD_COOKING_SESSION'; payload: CookingSession }
  | { type: 'UPDATE_COOKING_SESSION'; payload: CookingSession }
  | { type: 'DELETE_COOKING_SESSION'; payload: string }
  | { type: 'SET_RECIPE_CATEGORIES'; payload: RecipeCategory[] }
  | { type: 'SET_CUISINES'; payload: Cuisine[] }
  | { type: 'SET_ACHIEVEMENTS'; payload: Achievement[] }
  | { type: 'UPDATE_ACHIEVEMENT'; payload: Achievement }
  | { type: 'SET_PROGRESS'; payload: Progress[] }
  | { type: 'SET_STATISTICS'; payload: Statistics }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_CALENDAR_EVENTS'; payload: CalendarEvent[] }
  | { type: 'ADD_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'UPDATE_CALENDAR_EVENT'; payload: CalendarEvent }
  | { type: 'DELETE_CALENDAR_EVENT'; payload: string }
  | { type: 'CLEAR_ALL_DATA' }; 