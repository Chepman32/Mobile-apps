import { NavigationProp, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/app-navigation';

// Re-export types for convenience
export type { NavigationProp, RouteProp };

// Type safe navigation props for screens
export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

// Helper to create navigation props for testing
export const createNavigationProps = <T extends keyof RootStackParamList>(
  props: Partial<ScreenProps<T>> = {}
): ScreenProps<T> => ({
  navigation: {
    navigate: jest.fn(),
    goBack: jest.fn(),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    isFocused: jest.fn().mockReturnValue(true),
    canGoBack: jest.fn().mockReturnValue(true),
    reset: jest.fn(),
    dispatch: jest.fn(),
    getParent: jest.fn(),
    getState: jest.fn(),
    getId: jest.fn(),
    ...props.navigation,
  } as any,
  route: {
    key: '1',
    name: 'MockScreen' as T,
    params: {},
    path: undefined,
    ...props.route,
  } as any,
});

// Navigation utility functions
export const navigationUtils = {
  // Add any navigation utility functions here
  // Example:
  // goToScreen: (navigation: NavigationProp<RootStackParamList, keyof RootStackParamList>, screen: T, params?: any) => {
  //   navigation.navigate(screen as any, params);
  // },
};
