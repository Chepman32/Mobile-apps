import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { AppProvider } from './src/context/AppContext';
import { RootStackParamList, TabParamList } from './src/types';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import ChallengeScreen from './src/screens/ChallengeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom theme
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#4CAF50',
    secondary: '#2196F3',
    tertiary: '#FF9800',
    error: '#F44336',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F0F0F0',
    onSurface: '#1C1B1F',
    onSurfaceVariant: '#49454F',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4CAF50',
    secondary: '#2196F3',
    tertiary: '#FF9800',
    error: '#F44336',
    background: '#121212',
    surface: '#1E1E1E',
    surfaceVariant: '#2D2D2D',
    onSurface: '#E6E1E5',
    onSurfaceVariant: '#CAC4D0',
  },
};

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Challenges') {
            iconName = focused ? 'target' : 'target';
          } else if (route.name === 'Sessions') {
            iconName = focused ? 'clock' : 'clock-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else {
            iconName = 'circle';
          }

          return <TabBarIcon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E0E0E0',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Challenges" 
        component={ChallengesScreen}
        options={{ title: 'Challenges' }}
      />
      <Tab.Screen 
        name="Sessions" 
        component={SessionsScreen}
        options={{ title: 'Sessions' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function TabBarIcon({ name, color, size }: { name: string; color: string; size: number }) {
  return (
    <Text style={{ color, fontSize: size }}>
      {name === 'home' ? '🏠' : 
       name === 'home-outline' ? '🏠' :
       name === 'target' ? '🎯' :
       name === 'clock' ? '⏰' :
       name === 'clock-outline' ? '⏰' :
       name === 'account' ? '👤' :
       name === 'account-outline' ? '👤' : '●'}
    </Text>
  );
}

// Placeholder screens for tabs
function ChallengesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Challenges Screen</Text>
    </View>
  );
}

function SessionsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Sessions Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: '#FFFFFF',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen
              name="MainTabs"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Digital Detox' }}
            />
            <Stack.Screen
              name="Challenge"
              component={ChallengeScreen}
              options={{ title: 'Challenge Details' }}
            />
            <Stack.Screen
              name="Session"
              component={SessionScreen}
              options={{ title: 'Session Details' }}
            />
            <Stack.Screen
              name="ActiveSession"
              component={ActiveSessionScreen}
              options={{ title: 'Active Session' }}
            />
            <Stack.Screen
              name="SessionComplete"
              component={SessionCompleteScreen}
              options={{ title: 'Session Complete' }}
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
              name="Statistics"
              component={StatisticsScreen}
              options={{ title: 'Statistics' }}
            />
            <Stack.Screen
              name="Achievements"
              component={AchievementsScreen}
              options={{ title: 'Achievements' }}
            />
            <Stack.Screen
              name="Goals"
              component={GoalsScreen}
              options={{ title: 'Goals' }}
            />
            <Stack.Screen
              name="AddGoal"
              component={AddGoalScreen}
              options={{ title: 'Add Goal' }}
            />
            <Stack.Screen
              name="EditGoal"
              component={EditGoalScreen}
              options={{ title: 'Edit Goal' }}
            />
            <Stack.Screen
              name="AddChallenge"
              component={AddChallengeScreen}
              options={{ title: 'Add Challenge' }}
            />
            <Stack.Screen
              name="EditChallenge"
              component={EditChallengeScreen}
              options={{ title: 'Edit Challenge' }}
            />
            <Stack.Screen
              name="History"
              component={HistoryScreen}
              options={{ title: 'History' }}
            />
            <Stack.Screen
              name="SessionHistory"
              component={SessionHistoryScreen}
              options={{ title: 'Session History' }}
            />
            <Stack.Screen
              name="GoalDetails"
              component={GoalDetailsScreen}
              options={{ title: 'Goal Details' }}
            />
            <Stack.Screen
              name="AchievementDetails"
              component={AchievementDetailsScreen}
              options={{ title: 'Achievement Details' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </PaperProvider>
  );
}

// Placeholder components for screens that will be implemented
import { View, Text } from 'react-native';

function SessionScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Session Screen</Text>
    </View>
  );
}

function ActiveSessionScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Active Session Screen</Text>
    </View>
  );
}

function SessionCompleteScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Session Complete Screen</Text>
    </View>
  );
}

function StatisticsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Statistics Screen</Text>
    </View>
  );
}

function AchievementsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Achievements Screen</Text>
    </View>
  );
}

function GoalsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Goals Screen</Text>
    </View>
  );
}

function AddGoalScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Add Goal Screen</Text>
    </View>
  );
}

function EditGoalScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Edit Goal Screen</Text>
    </View>
  );
}

function AddChallengeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Add Challenge Screen</Text>
    </View>
  );
}

function EditChallengeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Edit Challenge Screen</Text>
    </View>
  );
}

function SessionHistoryScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Session History Screen</Text>
    </View>
  );
}

function GoalDetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Goal Details Screen</Text>
    </View>
  );
}

function AchievementDetailsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Achievement Details Screen</Text>
    </View>
  );
}
