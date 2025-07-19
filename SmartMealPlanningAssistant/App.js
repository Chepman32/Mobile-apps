
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MealPlanScreen from './src/screens/MealPlanScreen';
import RecipeListScreen from './src/screens/RecipeListScreen';
import ShoppingListScreen from './src/screens/ShoppingListScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="MealPlan" component={MealPlanScreen} />
      <Tab.Screen name="Recipes" component={RecipeListScreen} />
      <Tab.Screen name="ShoppingList" component={ShoppingListScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
