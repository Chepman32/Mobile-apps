
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeckListScreen from './src/screens/DeckListScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import CreateFlashcardScreen from './src/screens/CreateFlashcardScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeckList">
        <Stack.Screen name="DeckList" component={DeckListScreen} options={{ title: 'Flashcard Creator' }} />
        <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ title: 'Study Session' }} />
        <Stack.Screen name="CreateFlashcard" component={CreateFlashcardScreen} options={{ title: 'Create Flashcard' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
