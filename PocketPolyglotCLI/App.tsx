import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { PocketPolyglotCLIProvider } from './src/context/PocketPolyglotCLIContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import TranslationScreen from './src/screens/TranslationScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import ConversationScreen from './src/screens/ConversationScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OfflineScreen from './src/screens/OfflineScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';

export type RootStackParamList = {
  Home: undefined;
  Translation: { text?: string };
  Dictionary: { word?: string };
  Conversation: { topic?: string };
  Flashcards: undefined;
  Progress: undefined;
  Profile: undefined;
  Settings: undefined;
  Offline: undefined;
  History: undefined;
  Favorites: undefined;
  Achievements: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#9c27b0',
    accent: '#ff9800',
    background: '#fafafa',
    surface: '#ffffff',
    text: '#212121',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <PocketPolyglotCLIProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Pocket Polyglot CLI' }}
            />
            <Stack.Screen 
              name="Translation" 
              component={TranslationScreen} 
              options={{ title: 'Translation' }}
            />
            <Stack.Screen 
              name="Dictionary" 
              component={DictionaryScreen} 
              options={{ title: 'Dictionary' }}
            />
            <Stack.Screen 
              name="Conversation" 
              component={ConversationScreen} 
              options={{ title: 'Conversation' }}
            />
            <Stack.Screen 
              name="Flashcards" 
              component={FlashcardsScreen} 
              options={{ title: 'Flashcards' }}
            />
            <Stack.Screen 
              name="Progress" 
              component={ProgressScreen} 
              options={{ title: 'Progress' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Profile' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ title: 'Settings' }}
            />
            <Stack.Screen 
              name="Offline" 
              component={OfflineScreen} 
              options={{ title: 'Offline Mode' }}
            />
            <Stack.Screen 
              name="History" 
              component={HistoryScreen} 
              options={{ title: 'History' }}
            />
            <Stack.Screen 
              name="Favorites" 
              component={FavoritesScreen} 
              options={{ title: 'Favorites' }}
            />
            <Stack.Screen 
              name="Achievements" 
              component={AchievementsScreen} 
              options={{ title: 'Achievements' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </PocketPolyglotCLIProvider>
    </PaperProvider>
  );
} 