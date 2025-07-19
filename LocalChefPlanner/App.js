
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RecipeListScreen from './src/screens/RecipeListScreen';
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';
import MenuPlannerScreen from './src/screens/MenuPlannerScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RecipeList">
        <Stack.Screen name="RecipeList" component={RecipeListScreen} options={{ title: 'LocalChef Planner' }} />
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} options={{ title: 'Recipe Details' }} />
        <Stack.Screen name="MenuPlanner" component={MenuPlannerScreen} options={{ title: 'Menu Planner' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
