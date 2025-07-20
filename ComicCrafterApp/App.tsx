import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider } from './src/context/AppContext';
import HomeScreen from './src/screens/HomeScreen';
import EditorScreen from './src/screens/EditorScreen';
import CharactersScreen from './src/screens/CharactersScreen';
import TemplatesScreen from './src/screens/TemplatesScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ComicDetailScreen from './src/screens/ComicDetailScreen';
import CharacterDetailScreen from './src/screens/CharacterDetailScreen';
import TemplateDetailScreen from './src/screens/TemplateDetailScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Custom theme
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B6B',
    secondary: '#4ECDC4',
    tertiary: '#45B7D1',
    surface: '#FFFFFF',
    background: '#F8F9FA',
    error: '#FF5252',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#1C1B1F',
    onBackground: '#1C1B1F',
  },
};

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Editor') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Characters') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Templates') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'ComicCrafter' }}
      />
      <Tab.Screen 
        name="Editor" 
        component={EditorScreen}
        options={{ title: 'Editor' }}
      />
      <Tab.Screen 
        name="Characters" 
        component={CharactersScreen}
        options={{ title: 'Characters' }}
      />
      <Tab.Screen 
        name="Templates" 
        component={TemplatesScreen}
        options={{ title: 'Templates' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Main" 
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="ComicDetail" 
              component={ComicDetailScreen}
              options={{ title: 'Comic Details' }}
            />
            <Stack.Screen 
              name="CharacterDetail" 
              component={CharacterDetailScreen}
              options={{ title: 'Character Details' }}
            />
            <Stack.Screen 
              name="TemplateDetail" 
              component={TemplateDetailScreen}
              options={{ title: 'Template Details' }}
            />
            <Stack.Screen 
              name="Statistics" 
              component={StatisticsScreen}
              options={{ title: 'Statistics' }}
            />
            <Stack.Screen 
              name="Achievements" 
              component={AchievementsScreen}
              options={{ title: 'Achievements' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </PaperProvider>
  );
}
