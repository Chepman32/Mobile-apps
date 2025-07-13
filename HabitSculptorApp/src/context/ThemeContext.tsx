import React, { createContext, useState, useEffect, useContext } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const themes = {
  light: {
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#333333',
    subtext: '#888888',
    primary: '#4a6fa5',
    accent: '#4ECDC4',
    border: '#e0e6ed',
    seperator: '#f0f0f0',
    danger: '#ff6b6b',
    switchTrack: '#f0f0f0',
    placeholder: '#999999',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    primary: '#6a8fcc',
    accent: '#4ECDC4',
    border: '#333333',
    seperator: '#2a2a2a',
    danger: '#ff8a8a',
    switchTrack: '#3a3a3a',
    placeholder: '#777777',
  },
};

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: typeof themes.light;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: themes.light,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemTheme = useColorScheme() || 'light';
  const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme) {
          setTheme(savedTheme as 'light' | 'dark');
        } else {
          setTheme(systemTheme);
        }
      } catch (error) {
        console.error('Failed to load theme from storage', error);
        setTheme(systemTheme);
      }
    };

    loadTheme();
  }, [systemTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error('Failed to save theme to storage', error);
    }
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
