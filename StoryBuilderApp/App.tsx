import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// Import screens and context
import { HomeScreen, CategoryScreen, PhraseScreen, FavoritesScreen, CreateStoryScreen } from './src/screens';
import { AppProvider } from './src/context/AppContext';
import { ThemeProvider, useTheme, themes } from './src/context/ThemeContext';

// Define types for navigation
import { RootStackParamList, TabParamList } from './src/types';

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Custom navigation themes
const MyLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: themes.light.primary,
    background: themes.light.background,
    card: themes.light.card,
    text: themes.light.text,
    border: themes.light.border,
  },
};

const MyDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: themes.dark.primary,
    background: themes.dark.background,
    card: themes.dark.card,
    text: themes.dark.text,
    border: themes.dark.border,
  },
};

function MainTabs() {
  const { colors } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Create') {
            iconName = focused ? 'create' : 'create-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        headerShown: false,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Create" component={CreateStoryScreen} options={{ title: 'Create' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  const { colors, theme, toggleTheme } = useTheme();
  
  // Theme toggle button component
  const ThemeToggleButton = () => (
    <TouchableOpacity 
      onPress={toggleTheme}
      style={{
        marginRight: 16,
        padding: 4,
      }}
    >
      <Ionicons 
        name={theme === 'dark' ? 'sunny' : 'moon'} 
        size={24} 
        color={colors.headerText}
      />
    </TouchableOpacity>
  );

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.headerText,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={MainTabs} 
        options={{ 
          headerShown: false,
          headerRight: () => <ThemeToggleButton />
        }} 
      />
      <Stack.Screen 
        name="Category" 
        component={CategoryScreen} 
        options={({ route }) => ({ 
          title: route.params?.categoryName || 'Category',
          headerRight: () => <ThemeToggleButton />
        })} 
      />
      <Stack.Screen
        name="Phrase"
        component={PhraseScreen}
        options={{
          title: 'Phrase',
          headerRight: () => <ThemeToggleButton />
        }}
      />
      <Stack.Screen
        name="CreateStory"
        component={CreateStoryScreen}
        options={{
          title: 'Create Story',
          headerRight: () => <ThemeToggleButton />
        }}
      />
    </Stack.Navigator>
  );
}

function Root() {
  const { theme } = useTheme();
  return (
    <NavigationContainer theme={theme === 'light' ? MyLightTheme : MyDarkTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <ThemeProvider>
          <Root />
        </ThemeProvider>
      </AppProvider>
    </SafeAreaProvider>
  );
}

