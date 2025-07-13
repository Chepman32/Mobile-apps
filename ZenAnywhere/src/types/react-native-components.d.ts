import * as React from 'react';
import { 
  ViewStyle, 
  TextStyle, 
  ImageStyle, 
  ImageSourcePropType,
  ImageBackgroundProps as RNImageBackgroundProps,
  TouchableOpacityProps as RNTouchableOpacityProps,
  ScrollViewProps as RNScrollViewProps,
  FlatListProps as RNFlatListProps,
  ActivityIndicatorProps as RNActivityIndicatorProps,
  SwitchProps as RNSwitchProps,
  StatusBarProps as RNStatusBarProps,
  ImageProps as RNImageProps,
  TextProps as RNTextProps,
  ViewProps as RNViewProps,
  ButtonProps as RNButtonProps
} from 'react-native';

declare module 'react-native' {
  // Re-export all the types we need
  export * from 'react-native';

  // StyleSheet
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

  // Components with their props
  export const View: React.ComponentType<RNViewProps>;
  export const Text: React.ComponentType<RNTextProps>;
  export const Button: React.ComponentType<RNButtonProps>;
  export const Image: React.ComponentType<RNImageProps>;
  export const ImageBackground: React.ComponentType<RNImageBackgroundProps>;
  export const TouchableOpacity: React.ComponentType<RNTouchableOpacityProps>;
  export const ScrollView: React.ComponentType<RNScrollViewProps>;
  export const FlatList: <T = any>(props: RNFlatListProps<T>) => React.ReactElement;
  export const ActivityIndicator: React.ComponentType<RNActivityIndicatorProps>;
  export const Switch: React.ComponentType<RNSwitchProps>;
  export const StatusBar: React.ComponentType<RNStatusBarProps>;
  
  // Hooks
  export function useColorScheme(): 'light' | 'dark' | null | undefined;
  
  // Utilities
  export const Dimensions: {
    get(dim: 'window' | 'screen'): { width: number; height: number; scale: number; fontScale: number };
    addEventListener(type: 'change', handler: () => void): void;
    removeEventListener(type: 'change', handler: () => void): void;
  };
}
