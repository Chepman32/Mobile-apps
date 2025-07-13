import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const themes = {
  light: {
    background: '#f5f5f5',
    card: '#ffffff',
    text: '#333333',
    subtext: '#666666',
    primary: '#4a6fa5',
    primaryContrast: '#ffffff',
    border: '#dddddd',
    placeholder: '#aaaaaa',
    header: '#4a6fa5',
    headerText: '#ffffff',
    tabActive: '#4a6fa5',
    tabInactive: '#888888',
  },
  dark: {
    background: '#121212',
    card: '#1e1e1e',
    text: '#e0e0e0',
    subtext: '#a0a0a0',
    primary: '#6d9eeb',
    primaryContrast: '#000000',
    border: '#333333',
    placeholder: '#666666',
    header: '#1e1e1e',
    headerText: '#e0e0e0',
    tabActive: '#6d9eeb',
    tabInactive: '#777777',
  },
};

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: typeof themes.light;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      const systemTheme = Appearance.getColorScheme();
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setTheme(savedTheme);
      } else if (systemTheme) {
        setTheme(systemTheme);
      }
    };
    loadTheme();

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      AsyncStorage.getItem('theme').then((savedTheme: string | null) => {
        if (!savedTheme) {
          setTheme(colorScheme || 'light');
        }
      });
    });

    return () => subscription.remove();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const colors = themes[theme];

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
