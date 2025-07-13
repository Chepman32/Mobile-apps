import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof lightColors;
};

const lightColors = {
  background: '#FFFFFF',
  card: '#F8F9FA',
  text: '#212529',
  subtext: '#6C757D',
  primary: '#4A6FA5',
  accent: '#6A8FC7',
  border: '#DEE2E6',
  seperator: '#E9ECEF',
  danger: '#DC3545',
  switchTrack: '#E9ECEF',
  placeholder: '#ADB5BD',
};

const darkColors = {
  background: '#121212',
  card: '#1E1E1E',
  text: '#E9ECEF',
  subtext: '#ADB5BD',
  primary: '#6A8FC7',
  accent: '#8FB2E3',
  border: '#495057',
  seperator: '#343A40',
  danger: '#E35D6A',
  switchTrack: '#495057',
  placeholder: '#6C757D',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme || 'light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'dark' ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
