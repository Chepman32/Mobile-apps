
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ErgonomicAnalysisScreen from './src/screens/ErgonomicAnalysisScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="ErgonomicAnalysis">
        <Stack.Screen name="ErgonomicAnalysis" component={ErgonomicAnalysisScreen} options={{ title: 'Ergonomic Assistant' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
