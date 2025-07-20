import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Context
import { PlantCareGuideProvider } from './src/context/PlantCareGuideContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import PlantsScreen from './src/screens/PlantsScreen';
import PlantDetailScreen from './src/screens/PlantDetailScreen';
import AddPlantScreen from './src/screens/AddPlantScreen';
import CareScheduleScreen from './src/screens/CareScheduleScreen';
import CareLogsScreen from './src/screens/CareLogsScreen';
import GrowthTrackingScreen from './src/screens/GrowthTrackingScreen';
import RemindersScreen from './src/screens/RemindersScreen';
import TipsScreen from './src/screens/TipsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EditPlantScreen from './src/screens/EditPlantScreen';
import AddCareLogScreen from './src/screens/AddCareLogScreen';
import AddGrowthTrackingScreen from './src/screens/AddGrowthTrackingScreen';
import AddReminderScreen from './src/screens/AddReminderScreen';
import PlantDatabaseScreen from './src/screens/PlantDatabaseScreen';
import TroubleshootingScreen from './src/screens/TroubleshootingScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Types
import { RootStackParamList, TabParamList } from './src/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom theme colors
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50',
    secondary: '#8BC34A',
    tertiary: '#CDDC39',
    surface: '#F5F5F5',
    surfaceVariant: '#E8F5E8',
    background: '#FFFFFF',
    error: '#F44336',
    onPrimary: '#FFFFFF',
    onSecondary: '#000000',
    onSurface: '#1C1B1F',
    onBackground: '#1C1B1F',
  },
};

const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#81C784',
    secondary: '#A5D6A7',
    tertiary: '#C5E1A5',
    surface: '#1C1B1F',
    surfaceVariant: '#2D2D2D',
    background: '#121212',
    error: '#EF5350',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
  },
};

function TabNavigator() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Plants') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Care') {
            iconName = focused ? 'water' : 'water-outline';
          } else if (route.name === 'Growth') {
            iconName = focused ? 'trending-up' : 'trending-up-outline';
          } else if (route.name === 'Tips') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
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
          color: theme.colors.onSurface,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Plant Care Guide' }}
      />
      <Tab.Screen 
        name="Plants" 
        component={PlantsScreen}
        options={{ title: 'My Plants' }}
      />
      <Tab.Screen 
        name="Care" 
        component={CareScheduleScreen}
        options={{ title: 'Care Schedule' }}
      />
      <Tab.Screen 
        name="Growth" 
        component={GrowthTrackingScreen}
        options={{ title: 'Growth Tracking' }}
      />
      <Tab.Screen 
        name="Tips" 
        component={TipsScreen}
        options={{ title: 'Care Tips' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? customDarkTheme : customLightTheme;

  return (
    <PlantCareGuideProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
              headerTitleStyle: {
                color: theme.colors.onSurface,
              },
              cardStyle: {
                backgroundColor: theme.colors.background,
              },
            }}
          >
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PlantDetail"
              component={PlantDetailScreen}
              options={{ title: 'Plant Details' }}
            />
            <Stack.Screen
              name="AddPlant"
              component={AddPlantScreen}
              options={{ title: 'Add Plant' }}
            />
            <Stack.Screen
              name="EditPlant"
              component={EditPlantScreen}
              options={{ title: 'Edit Plant' }}
            />
            <Stack.Screen
              name="CareLogs"
              component={CareLogsScreen}
              options={{ title: 'Care Logs' }}
            />
            <Stack.Screen
              name="AddCareLog"
              component={AddCareLogScreen}
              options={{ title: 'Add Care Log' }}
            />
            <Stack.Screen
              name="AddGrowthTracking"
              component={AddGrowthTrackingScreen}
              options={{ title: 'Add Growth Tracking' }}
            />
            <Stack.Screen
              name="Reminders"
              component={RemindersScreen}
              options={{ title: 'Reminders' }}
            />
            <Stack.Screen
              name="AddReminder"
              component={AddReminderScreen}
              options={{ title: 'Add Reminder' }}
            />
            <Stack.Screen
              name="PlantDatabase"
              component={PlantDatabaseScreen}
              options={{ title: 'Plant Database' }}
            />
            <Stack.Screen
              name="Troubleshooting"
              component={TroubleshootingScreen}
              options={{ title: 'Troubleshooting' }}
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
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </PlantCareGuideProvider>
  );
} 