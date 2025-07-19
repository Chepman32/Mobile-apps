
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutListScreen from './src/screens/WorkoutListScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WorkoutList">
        <Stack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: 'Fit-in-7 Micro-HIIT' }} />
        <Stack.Screen name="Workout" component={WorkoutScreen} options={{ title: 'Workout' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
