
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import SudokuScreen from './src/screens/SudokuScreen';
import CrosswordScreen from './src/screens/CrosswordScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Classic Puzzles' }} />
        <Stack.Screen name="Sudoku" component={SudokuScreen} options={{ title: 'Sudoku' }} />
        <Stack.Screen name="Crossword" component={CrosswordScreen} options={{ title: 'Crossword' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
