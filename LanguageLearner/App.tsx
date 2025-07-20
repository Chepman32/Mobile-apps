import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { LanguageLearnerProvider } from './src/context/LanguageLearnerContext';

// Screens
import HomeScreen from './src/screens/HomeScreen';
import LessonScreen from './src/screens/LessonScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';
import GrammarScreen from './src/screens/GrammarScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import QuizScreen from './src/screens/QuizScreen';
import ConversationScreen from './src/screens/ConversationScreen';
import DictionaryScreen from './src/screens/DictionaryScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';

export type RootStackParamList = {
  Home: undefined;
  Lesson: { lessonId: string };
  Practice: { lessonId?: string };
  Vocabulary: undefined;
  Grammar: undefined;
  Progress: undefined;
  Profile: undefined;
  Settings: undefined;
  Quiz: { lessonId: string };
  Conversation: { topic: string };
  Dictionary: undefined;
  Achievements: undefined;
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
      <LanguageLearnerProvider>
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
              options={{ title: 'Language Learner' }}
            />
            <Stack.Screen 
              name="Lesson" 
              component={LessonScreen} 
              options={{ title: 'Lesson' }}
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
              name="Grammar" 
              component={GrammarScreen} 
              options={{ title: 'Grammar' }}
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
              name="Quiz" 
              component={QuizScreen} 
              options={{ title: 'Quiz' }}
            />
            <Stack.Screen 
              name="Conversation" 
              component={ConversationScreen} 
              options={{ title: 'Conversation' }}
            />
            <Stack.Screen 
              name="Dictionary" 
              component={DictionaryScreen} 
              options={{ title: 'Dictionary' }}
            />
            <Stack.Screen 
              name="Achievements" 
              component={AchievementsScreen} 
              options={{ title: 'Achievements' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </LanguageLearnerProvider>
    </PaperProvider>
  );
} 