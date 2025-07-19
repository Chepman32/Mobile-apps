
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import GoalListScreen from './src/screens/GoalListScreen';
import AddGoalScreen from './src/screens/AddGoalScreen';
import ProgressScreen from './src/screens/ProgressScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="GoalList">
        <Stack.Screen name="GoalList" component={GoalListScreen} options={{ title: 'Fitness Goals' }} />
        <Stack.Screen name="AddGoal" component={AddGoalScreen} options={{ title: 'Add New Goal' }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Goal Progress' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
