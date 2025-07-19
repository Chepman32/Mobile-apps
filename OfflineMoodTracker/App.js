
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MoodEntryScreen from './src/screens/MoodEntryScreen';
import MoodHistoryScreen from './src/screens/MoodHistoryScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MoodEntry">
        <Stack.Screen name="MoodEntry" component={MoodEntryScreen} options={{ title: 'Mood Tracker' }} />
        <Stack.Screen name="MoodHistory" component={MoodHistoryScreen} options={{ title: 'Mood History' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
