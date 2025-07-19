
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ReadingScreen from './src/screens/ReadingScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Reading">
        <Stack.Screen name="Reading" component={ReadingScreen} options={{ title: 'Speed Reading Trainer' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Reading Analytics' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
