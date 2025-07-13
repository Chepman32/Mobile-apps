import * as React from 'react';
import { ViewStyle, TextStyle } from 'react-native';

type RootStackParamList = {
  Home: undefined;
  Category: { categoryId: string; categoryName: string };
  Player: { sessionId: string; sessionName: string };
  Settings: undefined;
};

type NativeStackNavigationOptions = {
  title?: string;
  headerShown?: boolean;
  headerStyle?: ViewStyle;
  headerTitleStyle?: TextStyle;
  headerTintColor?: string;
  headerBackTitle?: string;
  headerBackTitleVisible?: boolean;
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  headerLeft?: (props: { tintColor?: string }) => React.ReactNode;
  presentation?: 'card' | 'modal' | 'transparentModal' | 'containedModal' | 'containedTransparentModal' | 'fullScreenModal' | 'formSheet';
  animation?: 'default' | 'fade' | 'flip' | 'none' | 'simple_push' | 'slide_from_bottom' | 'slide_from_right' | 'slide_from_left' | 'slide_from_top';
  contentStyle?: ViewStyle;
};

declare module '@react-navigation/native-stack' {
  export function createNativeStackNavigator(): {
    Navigator: React.ComponentType<{
      screenOptions?: NativeStackNavigationOptions;
      children?: React.ReactNode;
    }>;
    Screen: React.ComponentType<{
      name: keyof RootStackParamList;
      component: React.ComponentType<any>;
      options?: NativeStackNavigationOptions;
    }>;
  };

  export type NativeStackNavigationOptions = NativeStackNavigationOptions;
}

declare module '@react-navigation/native' {
  export function useTheme(): {
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
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
