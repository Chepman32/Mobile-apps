import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    primaryContainer: '#bb86fc',
    secondary: '#03dac6',
    secondaryContainer: '#03dac6',
    tertiary: '#ff6b6b',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#ffffff',
    error: '#b00020',
    errorContainer: '#fcd8df',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#000000',
    onBackground: '#000000',
    onError: '#ffffff',
    outline: '#e0e0e0',
    shadow: '#000000',
  },
  roundness: 8,
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc',
    primaryContainer: '#6200ee',
    secondary: '#03dac6',
    secondaryContainer: '#03dac6',
    tertiary: '#ff6b6b',
    surface: '#121212',
    surfaceVariant: '#1e1e1e',
    background: '#121212',
    error: '#cf6679',
    errorContainer: '#b00020',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onSurface: '#ffffff',
    onBackground: '#ffffff',
    onError: '#000000',
    outline: '#333333',
    shadow: '#000000',
  },
  roundness: 8,
};

export interface AppColors {
  success: string;
  warning: string;
  info: string;
  card: string;
  border: string;
  notification: string;
}

export const appColors: AppColors = {
  success: '#4caf50',
  warning: '#ff9800',
  info: '#2196f3',
  card: '#ffffff',
  border: '#e0e0e0',
  notification: '#f44336',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  body1: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6.27,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10.32,
    elevation: 8,
  },
};

export type Theme = typeof lightTheme & {
  appColors: AppColors;
  spacing: typeof spacing;
  typography: typeof typography;
  shadows: typeof shadows;
};

export const createTheme = (isDark: boolean = false): Theme => ({
  ...(isDark ? darkTheme : lightTheme),
  appColors,
  spacing,
  typography,
  shadows,
}); 