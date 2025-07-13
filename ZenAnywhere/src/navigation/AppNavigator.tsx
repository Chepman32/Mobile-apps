import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, StatusBar, StyleSheet } from 'react-native';
import type { RootStackParamList } from '../types/app-navigation';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@context/ThemeContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import SplashScreen from '@screens/common/SplashScreen';

// Create the stack navigator with our custom param list type
const Stack = createNativeStackNavigator<RootStackParamList>();

// Define custom header styles based on theme
const getHeaderStyles = (colors: any) => ({
  headerStyle: {
    backgroundColor: colors.card,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: 'bold',
    color: colors.text,
  },
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  contentStyle: { backgroundColor: colors.background },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 20,
  },
});

const AppNavigator: React.FC = () => {
  const { theme, colors } = useTheme();

  // Create a navigation theme based on the app theme
  const navTheme = (() => {
    return {
      ...(theme === 'dark' ? DarkTheme : DefaultTheme),
      colors: {
        ...(theme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
        background: colors.background,
        card: colors.card,
        text: colors.text,
        border: colors.border,
        notification: colors.notification || colors.primary,
      },
    };
  })();

  const headerStyles = getHeaderStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <NavigationContainer theme={navTheme}>
        <Stack.Navigator screenOptions={headerStyles as any}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen 
            name="Player" 
            component={PlayerScreen} 
            options={{
              title: 'Now Playing',
              headerShown: true,
              headerBackTitle: 'Back',
              headerBackTitleVisible: true,
              headerStyle: {
                backgroundColor: colors.card,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: colors.text,
                fontSize: 20,
                fontWeight: '600',
              },
              headerTintColor: colors.primary,
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              title: 'Settings',
              headerShown: true,
              presentation: 'modal',
              animation: 'slide_from_right',
              headerStyle: {
                backgroundColor: colors.card,
                elevation: 0,
                shadowOpacity: 0,
              },
              headerTitleStyle: {
                color: colors.text,
                fontSize: 20,
                fontWeight: '600',
              },
              headerTintColor: colors.primary,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default AppNavigator;
