declare module '@react-navigation/native' {
  import * as React from 'react';
  
  export type Theme = {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  };

  export const DefaultTheme: Theme;
  export const DarkTheme: Theme;
  
  export const NavigationContainer: React.ComponentType<{
    theme?: Theme;
    children?: React.ReactNode;
    onReady?: () => void;
  }>;
  
  export function useTheme(): Theme;
  
  // Add other exports as needed
}
