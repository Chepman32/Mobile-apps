
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DeckListScreen from './src/screens/DeckListScreen';
import FlashcardScreen from './src/screens/FlashcardScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="DeckList">
        <Stack.Screen name="DeckList" component={DeckListScreen} options={{ title: 'Study Cards' }} />
        <Stack.Screen name="Flashcard" component={FlashcardScreen} options={{ title: 'Flashcards' }} />
        <Stack.Screen name="Analytics" component={AnalyticsScreen} options={{ title: 'Analytics' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
