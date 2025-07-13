import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeType = 'light' | 'dark' | 'system';

type ThemeColors = {
  // Background colors
  background: string;
  card: string;
  modal: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // UI colors
  border: string;
  notification: string;
  disabled: string;
  
  // Additional colors
  white: string;
  black: string;
  gray: string;
  grayLight: string;
  grayDark: string;
};

type ThemeContextType = {
  theme: ThemeType;
  colors: ThemeColors;
  toggleTheme: (theme: ThemeType) => void;
  isDark: boolean;
};

const lightColors: ThemeColors = {
  // Background colors
  background: '#FFFFFF',
  card: '#F8F9FA',
  modal: 'rgba(0, 0, 0, 0.5)',
  
  // Text colors
  text: '#212529',
  textSecondary: '#6C757D',
  
  // Primary colors
  primary: '#4361EE',
  primaryLight: '#4895EF',
  primaryDark: '#3A0CA3',
  
  // Status colors
  success: '#4BB543',
  warning: '#F9C74F',
  error: '#EF233C',
  info: '#4CC9F0',
  
  // UI colors
  border: '#E9ECEF',
  notification: '#FF6B6B',
  disabled: '#ADB5BD',
  
  // Additional colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  grayLight: '#E9ECEF',
  grayDark: '#343A40',
};

const darkColors: ThemeColors = {
  // Background colors
  background: '#121212',
  card: '#1E1E1E',
  modal: 'rgba(0, 0, 0, 0.7)',
  
  // Text colors
  text: '#F8F9FA',
  textSecondary: '#ADB5BD',
  
  // Primary colors
  primary: '#4CC9F0',
  primaryLight: '#4895EF',
  primaryDark: '#3A0CA3',
  
  // Status colors
  success: '#70E000',
  warning: '#F9C74F',
  error: '#FF6B6B',
  info: '#4CC9F0',
  
  // UI colors
  border: '#343A40',
  notification: '#FF6B6B',
  disabled: '#495057',
  
  // Additional colors
  white: '#FFFFFF',
  black: '#000000',
  gray: '#6C757D',
  grayLight: '#343A40',
  grayDark: '#212529',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<ThemeType>('system');
  const [isReady, setIsReady] = useState(false);

  // Load saved theme from storage
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@theme');
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setTheme(savedTheme as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme', error);
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  // Toggle theme and save to storage
  const toggleTheme = async (newTheme: ThemeType) => {
    try {
      setTheme(newTheme);
      await AsyncStorage.setItem('@theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme', error);
    }
  };

  // Determine which colors to use based on theme
  const getColors = (): ThemeColors => {
    if (theme === 'system') {
      return systemColorScheme === 'dark' ? darkColors : lightColors;
    }
    return theme === 'dark' ? darkColors : lightColors;
  };

  const colors = getColors();
  const isDark = (theme === 'system' && systemColorScheme === 'dark') || theme === 'dark';

  if (!isReady) {
    return null; // Or a loading indicator
  }

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
