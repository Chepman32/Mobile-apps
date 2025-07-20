import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { HabitTrackerProProvider } from './src/context/HabitTrackerProContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import AddHabitScreen from './src/screens/AddHabitScreen';
import EditHabitScreen from './src/screens/EditHabitScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import HabitsScreen from './src/screens/HabitsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import StreakScreen from './src/screens/StreakScreen';
import RemindersScreen from './src/screens/RemindersScreen';

export type RootStackParamList = {
  Home: undefined;
  AddHabit: undefined;
  EditHabit: { habitId: string };
  HabitDetail: { habitId: string };
  Habits: undefined;
  Progress: undefined;
  Analytics: undefined;
  Achievements: undefined;
  Settings: undefined;
  Profile: undefined;
  Streak: undefined;
  Reminders: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#6200ee',
    accent: '#03dac4',
    background: '#f6f6f6',
    surface: '#ffffff',
    text: '#000000',
    placeholder: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <HabitTrackerProProvider>
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
              options={{ title: 'Habit Tracker Pro' }}
            />
            <Stack.Screen 
              name="AddHabit" 
              component={AddHabitScreen} 
              options={{ title: 'Add New Habit' }}
            />
            <Stack.Screen 
              name="EditHabit" 
              component={EditHabitScreen} 
              options={{ title: 'Edit Habit' }}
            />
            <Stack.Screen 
              name="HabitDetail" 
              component={HabitDetailScreen} 
              options={{ title: 'Habit Details' }}
            />
            <Stack.Screen 
              name="Habits" 
              component={HabitsScreen} 
              options={{ title: 'All Habits' }}
            />
            <Stack.Screen 
              name="Progress" 
              component={ProgressScreen} 
              options={{ title: 'Progress' }}
            />
            <Stack.Screen 
              name="Analytics" 
              component={AnalyticsScreen} 
              options={{ title: 'Analytics' }}
            />
            <Stack.Screen 
              name="Achievements" 
              component={AchievementsScreen} 
              options={{ title: 'Achievements' }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen} 
              options={{ title: 'Settings' }}
            />
            <Stack.Screen 
              name="Profile" 
              component={ProfileScreen} 
              options={{ title: 'Profile' }}
            />
            <Stack.Screen 
              name="Streak" 
              component={StreakScreen} 
              options={{ title: 'Streaks' }}
            />
            <Stack.Screen 
              name="Reminders" 
              component={RemindersScreen} 
              options={{ title: 'Reminders' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </HabitTrackerProProvider>
    </PaperProvider>
  );
} 