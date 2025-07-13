import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@context/ThemeContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { navigationRef } from './navigationService';
import type { RootStackParamList } from '../types/app-navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  // Show loading screen while checking auth state
  if (isLoading) {
    return null; // Or a loading component
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={{
        dark: colors.theme === 'dark',
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.accent,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        {isAuthenticated ? (
          <Stack.Screen 
            name="Main" 
            component={MainNavigator} 
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen 
            name="Auth" 
            component={AuthNavigator} 
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
