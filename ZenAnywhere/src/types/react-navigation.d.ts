import * as React from 'react';

// Base types that will be exported
type RootStackParamList = {
  Home: undefined;
  Category: { categoryId: string; categoryName: string };
  Player: { sessionId: string; sessionName: string };
  Settings: undefined;
};

type NativeStackNavigationOptions = {
  title?: string;
  headerShown?: boolean;
  headerStyle?: any;
  headerTitleStyle?: any;
  headerTintColor?: string;
  headerBackTitle?: string;
  headerBackTitleVisible?: boolean;
  headerRight?: (props: { tintColor?: string }) => React.ReactNode;
  headerLeft?: (props: { tintColor?: string }) => React.ReactNode;
  presentation?: 'card' | 'modal' | 'transparentModal' | 'containedModal' | 'containedTransparentModal' | 'fullScreenModal' | 'formSheet';
  animation?: 'default' | 'fade' | 'flip' | 'none' | 'simple_push' | 'slide_from_bottom' | 'slide_from_right' | 'slide_from_left' | 'slide_from_top';
};

type NativeStackNavigationProp<T extends keyof RootStackParamList> = {
  navigate<RouteName extends keyof RootStackParamList>(
    name: RouteName,
    params?: RootStackParamList[RouteName]
  ): void;
  goBack(): void;
  setOptions(options: Partial<NativeStackNavigationOptions>): void;
  addListener(event: string, callback: () => void): () => void;
  isFocused(): boolean;
};

// Export the types
export {
  RootStackParamList,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
};

declare module '@react-navigation/native' {
  import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

  export type NavigationRoute<ParamList extends ParamListBase, RouteName extends keyof ParamList> = {
    key: string;
    name: RouteName;
    params: ParamList[RouteName];
  };

  export type ParamListBase = {
    [key: string]: object | undefined;
  };

  export type NavigationProp<ParamList extends ParamListBase = any, RouteName extends keyof ParamList = string> = {
    navigate<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
    goBack(): void;
    setOptions(options: Partial<NativeStackNavigationOptions>): void;
    addListener(event: string, callback: () => void): () => void;
    isFocused(): boolean;
  };

  export function useNavigation<T = any>(): T;
  export function useRoute<T = any>(): { params: T };
  export function useTheme(): Theme;
  
  export interface Theme {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      card: string;
      text: string;
      border: string;
      notification: string;
    };
  }

  export const NavigationContainer: React.ComponentType<{
    theme?: Theme;
    children?: React.ReactNode;
    onReady?: () => void;
  }>;
}

declare module '@react-navigation/native-stack' {
  import { ParamListBase, NavigationProp } from '@react-navigation/native';
  
  export type NativeStackNavigationProp<ParamList extends ParamListBase> = NavigationProp<ParamList>;
  
  export type NativeStackNavigationOptions = {
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
  };
  
  export function createNativeStackNavigator<ParamList extends ParamListBase>(): {
    Navigator: React.ComponentType<{
      initialRouteName?: keyof ParamList;
      screenOptions?: NativeStackNavigationOptions | ((props: {
        route: { name: keyof ParamList };
        navigation: any;
      }) => NativeStackNavigationOptions);
      children?: React.ReactNode;
    }>;
    
    Screen: <RouteName extends keyof ParamList>({
      name,
      component,
      options,
    }: {
      name: RouteName;
      component: React.ComponentType<any>;
      options?: NativeStackNavigationOptions | ((props: {
        route: { params: ParamList[RouteName] };
        navigation: any;
      }) => NativeStackNavigationOptions);
    }) => null;
  };
}

declare global {
  namespace ReactNavigation {
    interface RootParamList {
      Home: undefined;
      Category: { categoryId: string; categoryName: string };
      Player: { sessionId: string; sessionName: string };
      Settings: undefined;
    }
  }
}
