
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LevelSelectScreen from './src/screens/LevelSelectScreen';
import PuzzleScreen from './src/screens/PuzzleScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LevelSelect">
        <Stack.Screen name="LevelSelect" component={LevelSelectScreen} options={{ title: 'Circuit Puzzle' }} />
        <Stack.Screen name="Puzzle" component={PuzzleScreen} options={{ title: 'Puzzle' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
