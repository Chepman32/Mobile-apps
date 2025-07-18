import { MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    primaryContainer: '#bb86fc',
    secondary: '#03dac6',
    secondaryContainer: '#03dac6',
    surface: '#ffffff',
    surfaceVariant: '#f5f5f5',
    background: '#f5f5f5',
    error: '#b00020',
    errorContainer: '#fcd8df',
    onPrimary: '#ffffff',
    onSecondary: '#000000',
    onSurface: '#000000',
    onBackground: '#000000',
    onError: '#ffffff',
  },
  roundness: 8,
};

export default theme;