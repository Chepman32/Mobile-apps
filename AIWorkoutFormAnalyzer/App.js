
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WorkoutListScreen from './src/screens/WorkoutListScreen';
import WorkoutAnalysisScreen from './src/screens/WorkoutAnalysisScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="WorkoutList">
        <Stack.Screen name="WorkoutList" component={WorkoutListScreen} options={{ title: 'Workout Form Analyzer' }} />
        <Stack.Screen name="WorkoutAnalysis" component={WorkoutAnalysisScreen} options={{ title: 'Analyze Form' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
