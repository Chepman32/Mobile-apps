import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { LanguageFlashcardsProvider } from './src/context/LanguageFlashcardsContext';
import HomeScreen from './src/screens/HomeScreen';
import DecksScreen from './src/screens/DecksScreen';
import StudyScreen from './src/screens/StudyScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DeckDetailsScreen from './src/screens/DeckDetailsScreen';
import AddDeckScreen from './src/screens/AddDeckScreen';
import EditDeckScreen from './src/screens/EditDeckScreen';
import AddFlashcardScreen from './src/screens/AddFlashcardScreen';
import EditFlashcardScreen from './src/screens/EditFlashcardScreen';
import StudySessionScreen from './src/screens/StudySessionScreen';
import FlashcardReviewScreen from './src/screens/FlashcardReviewScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import StudyHistoryScreen from './src/screens/StudyHistoryScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Create Material Design 3 theme
const createTheme = (isDark: boolean = false) => {
  const baseTheme = isDark ? MD3DarkTheme : MD3LightTheme;
  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: '#6366f1',
      secondary: '#8b5cf6',
      tertiary: '#a855f7',
      surface: isDark ? '#1e1e1e' : '#ffffff',
      surfaceVariant: isDark ? '#2d2d2d' : '#f5f5f5',
      background: isDark ? '#121212' : '#fafafa',
      error: '#ef4444',
      onPrimary: '#ffffff',
      onSecondary: '#ffffff',
      onSurface: isDark ? '#ffffff' : '#000000',
      onBackground: isDark ? '#ffffff' : '#000000',
    },
  };
};

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof MaterialCommunityIcons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Decks') {
            iconName = focused ? 'cards' : 'cards-outline';
          } else if (route.name === 'Study') {
            iconName = focused ? 'school' : 'school-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'chart-line' : 'chart-line';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = 'help-circle-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e5e7eb',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Decks" 
        component={DecksScreen}
        options={{ title: 'Decks' }}
      />
      <Tab.Screen 
        name="Study" 
        component={StudyScreen}
        options={{ title: 'Study' }}
      />
      <Tab.Screen 
        name="Progress" 
        component={ProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6366f1',
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: { backgroundColor: '#fafafa' },
      }}
    >
      <Stack.Screen 
        name="Main" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DeckDetails" 
        component={DeckDetailsScreen}
        options={{ title: 'Deck Details' }}
      />
      <Stack.Screen 
        name="AddDeck" 
        component={AddDeckScreen}
        options={{ title: 'Create Deck' }}
      />
      <Stack.Screen 
        name="EditDeck" 
        component={EditDeckScreen}
        options={{ title: 'Edit Deck' }}
      />
      <Stack.Screen 
        name="AddFlashcard" 
        component={AddFlashcardScreen}
        options={{ title: 'Add Flashcard' }}
      />
      <Stack.Screen 
        name="EditFlashcard" 
        component={EditFlashcardScreen}
        options={{ title: 'Edit Flashcard' }}
      />
      <Stack.Screen 
        name="StudySession" 
        component={StudySessionScreen}
        options={{ title: 'Study Session' }}
      />
      <Stack.Screen 
        name="FlashcardReview" 
        component={FlashcardReviewScreen}
        options={{ title: 'Review Card' }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen 
        name="Achievements" 
        component={AchievementsScreen}
        options={{ title: 'Achievements' }}
      />
      <Stack.Screen 
        name="StudyHistory" 
        component={StudyHistoryScreen}
        options={{ title: 'Study History' }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const theme = createTheme(false); // Light theme by default

  return (
    <PaperProvider theme={theme}>
      <LanguageFlashcardsProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </LanguageFlashcardsProvider>
    </PaperProvider>
  );
} 