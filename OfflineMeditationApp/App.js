
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MeditationSessionScreen from './src/screens/MeditationSessionScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MeditationSession">
        <Stack.Screen name="MeditationSession" component={MeditationSessionScreen} options={{ title: 'Meditation App' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Meditation Analytics' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
