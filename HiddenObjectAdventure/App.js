
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import HiddenObjectScreen from './src/screens/HiddenObjectScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LevelSelect">
        <Stack.Screen name="LevelSelect" component={LevelSelectScreen} options={{ title: 'Hidden Object Adventure' }} />
        <Stack.Screen name="HiddenObject" component={HiddenObjectScreen} options={{ title: 'Find Objects' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
