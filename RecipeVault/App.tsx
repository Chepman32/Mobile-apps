import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';
import { RecipeVaultProvider } from './src/context/RecipeVaultContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Import screens (to be created)
import HomeScreen from './src/screens/HomeScreen';
import RecipesScreen from './src/screens/RecipesScreen';
import MealPlansScreen from './src/screens/MealPlansScreen';
import ShoppingScreen from './src/screens/ShoppingScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AddRecipeScreen from './src/screens/AddRecipeScreen';
import RecipeDetailsScreen from './src/screens/RecipeDetailsScreen';
import EditRecipeScreen from './src/screens/EditRecipeScreen';
import AddMealPlanScreen from './src/screens/AddMealPlanScreen';
import MealPlanDetailsScreen from './src/screens/MealPlanDetailsScreen';
import AddShoppingListScreen from './src/screens/AddShoppingListScreen';
import ShoppingListDetailsScreen from './src/screens/ShoppingListDetailsScreen';
import CookingSessionScreen from './src/screens/CookingSessionScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    tertiary: '#45B7D1',
    surface: '#FFFFFF',
    background: '#F8F9FA',
  },
};

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Recipes') {
            iconName = focused ? 'book-open-variant' : 'book-open-outline';
          } else if (route.name === 'Meal Plans') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Shopping') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'RecipeVault' }}
      />
      <Tab.Screen 
        name="Recipes" 
        component={RecipesScreen}
        options={{ title: 'My Recipes' }}
      />
      <Tab.Screen 
        name="Meal Plans" 
        component={MealPlansScreen}
        options={{ title: 'Meal Plans' }}
      />
      <Tab.Screen 
        name="Shopping" 
        component={ShoppingScreen}
        options={{ title: 'Shopping Lists' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <RecipeVaultProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            
            {/* Recipe Screens */}
            <Stack.Screen
              name="AddRecipe"
              component={AddRecipeScreen}
              options={{ title: 'Add Recipe' }}
            />
            <Stack.Screen
              name="RecipeDetails"
              component={RecipeDetailsScreen}
              options={{ title: 'Recipe Details' }}
            />
            <Stack.Screen
              name="EditRecipe"
              component={EditRecipeScreen}
              options={{ title: 'Edit Recipe' }}
            />
            
            {/* Meal Plan Screens */}
            <Stack.Screen
              name="AddMealPlan"
              component={AddMealPlanScreen}
              options={{ title: 'Add Meal Plan' }}
            />
            <Stack.Screen
              name="MealPlanDetails"
              component={MealPlanDetailsScreen}
              options={{ title: 'Meal Plan Details' }}
            />
            
            {/* Shopping List Screens */}
            <Stack.Screen
              name="AddShoppingList"
              component={AddShoppingListScreen}
              options={{ title: 'Add Shopping List' }}
            />
            <Stack.Screen
              name="ShoppingListDetails"
              component={ShoppingListDetailsScreen}
              options={{ title: 'Shopping List Details' }}
            />
            
            {/* Cooking Session Screens */}
            <Stack.Screen
              name="CookingSession"
              component={CookingSessionScreen}
              options={{ title: 'Cooking Session' }}
            />
            
            {/* Settings Screen */}
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{ title: 'Settings' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </RecipeVaultProvider>
    </PaperProvider>
  );
} 