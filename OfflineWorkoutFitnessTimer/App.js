
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutListScreen from './src/screens/WorkoutListScreen';
import WorkoutTimerScreen from './src/screens/WorkoutTimerScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WorkoutList">
        <Stack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: 'Fitness Timer' }} />
        <Stack.Screen name="WorkoutTimer" component={WorkoutTimerScreen} options={{ title: 'Workout' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
