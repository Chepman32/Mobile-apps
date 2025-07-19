import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { TodoProvider } from './src/context/TodoContext';
import { createTheme } from '../shared/theme/AppTheme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import TasksScreen from './src/screens/TasksScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import EditTaskScreen from './src/screens/EditTaskScreen';
import TaskDetailScreen from './src/screens/TaskDetailScreen';
import AddCategoryScreen from './src/screens/AddCategoryScreen';

export type RootStackParamList = {
  Main: undefined;
  AddTask: { categoryId?: string };
  EditTask: { taskId: string };
  TaskDetail: { taskId: string };
  AddCategory: undefined;
};

export type TabParamList = {
  Home: undefined;
  Tasks: undefined;
  Categories: undefined;
  Analytics: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createStackNavigator<RootStackParamList>();
const theme = createTheme(false);

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Tasks':
              iconName = focused ? 'format-list-checks' : 'format-list-bulleted';
              break;
            case 'Categories':
              iconName = focused ? 'tag-multiple' : 'tag-multiple-outline';
              break;
            case 'Analytics':
              iconName = focused ? 'chart-pie' : 'chart-pie';
              break;
            case 'Settings':
              iconName = focused ? 'cog' : 'cog-outline';
              break;
            default:
              iconName = 'help-circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.outline,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen 
        name="Tasks" 
        component={TasksScreen}
        options={{ title: 'All Tasks' }}
      />
      <Tab.Screen 
        name="Categories" 
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{ title: 'Analytics' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <TodoProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
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
                component={TabNavigator}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="AddTask" 
                component={AddTaskScreen}
                options={{ title: 'Add Task' }}
              />
              <Stack.Screen 
                name="EditTask" 
                component={EditTaskScreen}
                options={{ title: 'Edit Task' }}
              />
              <Stack.Screen 
                name="TaskDetail" 
                component={TaskDetailScreen}
                options={{ title: 'Task Details' }}
              />
              <Stack.Screen 
                name="AddCategory" 
                component={AddCategoryScreen}
                options={{ title: 'Add Category' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </TodoProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 