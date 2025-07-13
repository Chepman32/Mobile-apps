import { NavigationProp, RouteProp, ScreenProps, RootStackParamList } from './app-navigation';

// Re-export types from app-navigation for backward compatibility
export type { 
  NavigationProp, 
  RouteProp, 
  ScreenProps,
  RootStackParamList 
};

// Navigation prop type for root stack
export type RootStackNavigationProp<T extends keyof RootStackParamList> = NavigationProp<T>;

// Navigation props type for screens
export type NavigationProps = NavigationProp<keyof RootStackParamList>;

// Route props type for screens
export type RouteProps<T extends keyof RootStackParamList> = ScreenProps<T>;
