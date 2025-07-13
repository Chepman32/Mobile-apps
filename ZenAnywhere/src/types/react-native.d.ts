import * as React from 'react';

declare module 'react-native' {
  export * from 'react-native/index';
  
  // Re-export types that might be needed
  export type { 
    ViewStyle, 
    TextStyle, 
    ImageStyle, 
    ViewProps, 
    TextProps, 
    ButtonProps,
    StyleProp,
    ImageSourcePropType,
    ImageBackgroundProps,
    TouchableOpacityProps,
    ScrollViewProps,
    FlatListProps,
    ActivityIndicatorProps,
    SwitchProps,
    StatusBarProps,
    Dimensions
  } from 'react-native';
  
  // Extend StyleSheet
  export interface StyleSheetProperties {
    [key: string]: ViewStyle | TextStyle | ImageStyle;
  }
  
  export interface StyleSheetStatic {
    create<T extends StyleSheetProperties | any>(styles: T): T;
    flatten: (style: StyleProp<any>) => any;
    absoluteFill: number;
    hairlineWidth: number;
  }
  
  export const StyleSheet: StyleSheetStatic;
  
  // Common components with their props
  export const View: React.ComponentType<ViewProps>;
  export const Text: React.ComponentType<TextProps>;
  export const Button: React.ComponentType<ButtonProps>;
  export const Image: React.ComponentType<ImageProps>;
  export const ImageBackground: React.ComponentType<ImageBackgroundProps>;
  export const TouchableOpacity: React.ComponentType<TouchableOpacityProps>;
  export const ScrollView: React.ComponentType<ScrollViewProps>;
  export const FlatList: React.ComponentType<FlatListProps<any>>;
  export const ActivityIndicator: React.ComponentType<ActivityIndicatorProps>;
  export const Switch: React.ComponentType<SwitchProps>;
  export const StatusBar: React.ComponentType<StatusBarProps>;
  
  // Hooks
  export function useColorScheme(): 'light' | 'dark' | null | undefined;
  
  // Other utilities
  export const Dimensions: {
    get(dim: 'window' | 'screen'): { width: number; height: number; scale: number; fontScale: number };
    addEventListener(type: 'change', handler: () => void): void;
    removeEventListener(type: 'change', handler: () => void): void;
  };
  
  // Add other components and types as needed
}
