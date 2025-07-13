export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  
  // Background colors
  background: string;
  surface: string;
  card: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;
  
  // UI elements
  border: string;
  separator: string;
  disabled: string;
  placeholder: string;
  
  // Gradients
  gradient1: string[];
  gradient2: string[];
  
  // Player controls
  playerBackground: string;
  playerControls: string;
  
  // Tab bar
  tabBar: string;
  tabBarActive: string;
  tabBarInactive: string;
  
  // Modal
  modalBackground: string;
  modalBackdrop: string;
  
  // Buttons
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonSecondary: string;
  buttonSecondaryText: string;
  buttonDisabled: string;
  buttonDisabledText: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeBorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
  circle: number;
}

export interface ThemeTypography {
  h1: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  h2: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  h3: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  h4: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  h5: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  body1: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  body2: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  caption: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
  };
  button: {
    fontSize: number;
    lineHeight: number;
    fontWeight: string;
    textTransform: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  };
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  typography: ThemeTypography;
  mode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

// Navigation theme based on our app theme
export const getNavigationTheme = (colors: ThemeColors) => ({
  dark: false, // We handle dark mode through our theme
  colors: {
    primary: colors.primary,
    background: colors.background,
    card: colors.card,
    text: colors.text,
    border: colors.border,
    notification: colors.primary,
  },
});
