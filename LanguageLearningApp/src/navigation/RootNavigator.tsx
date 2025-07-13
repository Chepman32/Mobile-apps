import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '@types/navigation';
import MainTabNavigator from './MainTabNavigator';
import { OnboardingScreen, QuizScreen, ResultsScreen, AuthScreen } from '@screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const isFirstLaunch = false; // This will be replaced with actual logic
  const isAuthenticated = false; // This will be replaced with actual auth logic

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        {isFirstLaunch ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : !isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            <Stack.Screen 
              name="Quiz" 
              component={QuizScreen} 
              options={{
                headerShown: true,
                headerTitle: 'Quiz',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen 
              name="Results" 
              component={ResultsScreen} 
              options={{
                headerShown: true,
                headerTitle: 'Quiz Results',
                headerLeft: () => null, // Prevent going back to quiz
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
