declare module '@react-navigation/native-stack' {
  import * as React from 'react';
  import { ParamListBase } from '@react-navigation/native';

  export type NativeStackNavigationOptions = {
    title?: string;
    headerShown?: boolean;
    headerStyle?: {
      backgroundColor?: string;
      elevation?: number;
      shadowOpacity?: number;
      shadowOffset?: { width: number; height: number };
      shadowRadius?: number;
      shadowColor?: string;
    };
    headerTitleStyle?: {
      color?: string;
      fontSize?: number;
      fontWeight?: string;
    };
    headerTintColor?: string;
    headerBackTitle?: string;
    headerBackTitleVisible?: boolean;
    headerRight?: (props: { tintColor?: string }) => React.ReactNode;
    headerLeft?: (props: { tintColor?: string }) => React.ReactNode;
    presentation?: 'card' | 'modal' | 'transparentModal' | 'containedModal' | 'containedTransparentModal' | 'fullScreenModal' | 'formSheet';
    animation?: 'default' | 'fade' | 'flip' | 'none' | 'simple_push' | 'slide_from_bottom' | 'slide_from_right' | 'slide_from_left' | 'slide_from_top';
  };

  export type NativeStackNavigationProp<ParamList extends ParamListBase, RouteName extends keyof ParamList = string> = {
    navigate<RouteName extends keyof ParamList>(
      name: RouteName,
      params?: ParamList[RouteName]
    ): void;
    goBack(): void;
    setOptions(options: Partial<NativeStackNavigationOptions>): void;
    addListener(event: string, callback: () => void): () => void;
    isFocused(): boolean;
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
