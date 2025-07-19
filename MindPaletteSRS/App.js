
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeckListScreen from './src/screens/DeckListScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeckList">
        <Stack.Screen name="DeckList" component={DeckListScreen} options={{ title: 'MindPalette SRS' }} />
        <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ title: 'Flashcards' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
