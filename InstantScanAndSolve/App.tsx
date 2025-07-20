import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { InstantScanAndSolveProvider } from './src/context/InstantScanAndSolveContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import ScanScreen from './src/screens/ScanScreen';
import SolveScreen from './src/screens/SolveScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import OfflineScreen from './src/screens/OfflineScreen';
import TutorialScreen from './src/screens/TutorialScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import CameraScreen from './src/screens/CameraScreen';
import EditScreen from './src/screens/EditScreen';
import ShareScreen from './src/screens/ShareScreen';

export type RootStackParamList = {
  Home: undefined;
  Scan: { mode?: 'math' | 'text' | 'object' };
  Solve: { problemId: string };
  History: undefined;
  Settings: undefined;
  Profile: undefined;
  Offline: undefined;
  Tutorial: undefined;
  Results: { problemId: string };
  Camera: { mode: string };
  Edit: { problemId: string };
  Share: { problemId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196f3',
    accent: '#ff9800',
    background: '#f5f5f5',
    surface: '#ffffff',
    text: '#000000',
    placeholder: '#666666',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <InstantScanAndSolveProvider>
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
              options={{ title: 'Instant Scan & Solve' }}
            />
            <Stack.Screen 
              name="Scan" 
              component={ScanScreen} 
              options={{ title: 'Scan Problem' }}
            />
            <Stack.Screen 
              name="Solve" 
              component={SolveScreen} 
              options={{ title: 'Solve Problem' }}
            />
            <Stack.Screen 
              name="History" 
              component={HistoryScreen} 
              options={{ title: 'History' }}
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
              name="Offline" 
              component={OfflineScreen} 
              options={{ title: 'Offline Mode' }}
            />
            <Stack.Screen 
              name="Tutorial" 
              component={TutorialScreen} 
              options={{ title: 'Tutorial' }}
            />
            <Stack.Screen 
              name="Results" 
              component={ResultsScreen} 
              options={{ title: 'Results' }}
            />
            <Stack.Screen 
              name="Camera" 
              component={CameraScreen} 
              options={{ title: 'Camera' }}
            />
            <Stack.Screen 
              name="Edit" 
              component={EditScreen} 
              options={{ title: 'Edit Problem' }}
            />
            <Stack.Screen 
              name="Share" 
              component={ShareScreen} 
              options={{ title: 'Share' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </InstantScanAndSolveProvider>
    </PaperProvider>
  );
} 