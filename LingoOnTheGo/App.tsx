import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { LingoOnTheGoProvider } from './src/context/LingoOnTheGoContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PhrasebookScreen from './src/screens/PhrasebookScreen';
import TranslationScreen from './src/screens/TranslationScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import OfflineScreen from './src/screens/OfflineScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';

export type RootStackParamList = {
  Home: undefined;
  Phrasebook: { category?: string };
  Translation: { text?: string };
  Practice: { mode?: 'vocabulary' | 'phrases' | 'grammar' };
  Vocabulary: undefined;
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
    primary: '#3f51b5',
    accent: '#ff9800',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#212121',
    placeholder: '#757575',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <LingoOnTheGoProvider>
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
              options={{ title: 'Lingo On The Go' }}
            />
            <Stack.Screen 
              name="Phrasebook" 
              component={PhrasebookScreen} 
              options={{ title: 'Phrasebook' }}
            />
            <Stack.Screen 
              name="Translation" 
              component={TranslationScreen} 
              options={{ title: 'Translation' }}
            />
            <Stack.Screen 
              name="Practice" 
              component={PracticeScreen} 
              options={{ title: 'Practice' }}
            />
            <Stack.Screen 
              name="Vocabulary" 
              component={VocabularyScreen} 
              options={{ title: 'Vocabulary' }}
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
      </LingoOnTheGoProvider>
    </PaperProvider>
  );
}
