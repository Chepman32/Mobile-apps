import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { NomadFitProvider } from './src/context/NomadFitContext';
import { RootStackParamList, TabParamList } from './src/types';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import WorkoutsScreen from './src/screens/WorkoutsScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import WorkoutDetailsScreen from './src/screens/WorkoutDetailsScreen';
import AddWorkoutScreen from './src/screens/AddWorkoutScreen';
import ExerciseDetailsScreen from './src/screens/ExerciseDetailsScreen';
import AddExerciseScreen from './src/screens/AddExerciseScreen';
import WorkoutTemplatesScreen from './src/screens/WorkoutTemplatesScreen';
import CreateTemplateScreen from './src/screens/CreateTemplateScreen';
import EditTemplateScreen from './src/screens/EditTemplateScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import WorkoutHistoryScreen from './src/screens/WorkoutHistoryScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4a90e2',
    secondary: '#50c878',
    tertiary: '#ff6b6b',
    surface: '#ffffff',
    background: '#f8f9fa',
    outline: '#e0e0e0',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onSurface: '#1a1a1a',
    onBackground: '#1a1a1a',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Workouts') {
            iconName = focused ? 'fitness' : 'fitness-outline';
          } else if (route.name === 'Progress') {
            iconName = focused ? 'analytics' : 'analytics-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'ellipse-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurface,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
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
        name="Workouts" 
        component={WorkoutsScreen}
        options={{ title: 'Workouts' }}
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

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NomadFitProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Main"
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary,
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Main" 
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="WorkoutDetails" 
                component={WorkoutDetailsScreen}
                options={{ title: 'Workout Details' }}
              />
              <Stack.Screen 
                name="AddWorkout" 
                component={AddWorkoutScreen}
                options={{ 
                  title: 'Start Workout',
                  presentation: 'modal'
                }}
              />
              <Stack.Screen 
                name="ExerciseDetails" 
                component={ExerciseDetailsScreen}
                options={{ title: 'Exercise Details' }}
              />
              <Stack.Screen 
                name="AddExercise" 
                component={AddExerciseScreen}
                options={{ 
                  title: 'Add Exercise',
                  presentation: 'modal'
                }}
              />
              <Stack.Screen 
                name="WorkoutTemplates" 
                component={WorkoutTemplatesScreen}
                options={{ title: 'Workout Templates' }}
              />
              <Stack.Screen 
                name="CreateTemplate" 
                component={CreateTemplateScreen}
                options={{ 
                  title: 'Create Template',
                  presentation: 'modal'
                }}
              />
              <Stack.Screen 
                name="EditTemplate" 
                component={EditTemplateScreen}
                options={{ title: 'Edit Template' }}
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
                name="WorkoutHistory" 
                component={WorkoutHistoryScreen}
                options={{ title: 'Workout History' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="light" />
        </NomadFitProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
