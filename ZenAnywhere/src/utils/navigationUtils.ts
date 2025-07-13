import { CommonActions } from '@react-navigation/native';
import { navigationRef } from '@navigation/navigationService';
import type { RootStackParamList } from '../types/app-navigation';

/**
 * Type-safe navigation helper
 */
type NavigateParams<T extends keyof RootStackParamList> = 
  undefined extends RootStackParamList[T]
    ? [screen: T] | [screen: T, params: RootStackParamList[T]]
    : [screen: T, params: RootStackParamList[T]];

/**
 * Navigate to a screen with type safety
 */
export function navigate<T extends keyof RootStackParamList>(
  ...args: NavigateParams<T>
) {
  if (navigationRef.isReady()) {
    const [screen, params] = args;
    // @ts-ignore - TypeScript has issues with the type inference here
    navigationRef.navigate(screen, params);
  }
}

/**
 * Navigate back to a specific screen in the stack
 */
export function navigateBackTo<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.navigate({
        name: routeName,
        params,
      })
    );
  }
}

/**
 * Reset the navigation stack and navigate to a specific screen
 */
export function resetTo<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
  }
}

/**
 * Get the current route parameters
 * @returns The current route parameters or null if not available
 */
export function getCurrentRouteParams<T extends keyof RootStackParamList>(): RootStackParamList[T] | null {
  if (!navigationRef.isReady()) return null;
  
  const currentRoute = navigationRef.getCurrentRoute();
  return (currentRoute?.params as RootStackParamList[T]) || null;
}

/**
 * Check if the current screen is in the navigation stack
 */
export function isScreenInStack<RouteName extends keyof RootStackParamList>(
  routeName: RouteName
): boolean {
  if (!navigationRef.isReady()) return false;
  
  const state = navigationRef.getRootState();
  return state.routes.some(route => route.name === routeName);
}

/**
 * Get the previous route name
 * @returns The name of the previous route or null if not available
 */
export function getPreviousRouteName(): string | null {
  if (!navigationRef.isReady()) return null;
  
  const state = navigationRef.getRootState();
  if (state.routes.length < 2) return null;
  
  return state.routes[state.routes.length - 2].name;
}

/**
 * Navigate to a screen and remove all previous screens from the stack
 */
export function replace<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
  }
}

/**
 * Navigate to a screen with a custom transition
 */
export function navigateWithTransition<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName],
  transitionConfig: {
    animation?: 'fade' | 'slide_from_right' | 'slide_from_bottom' | 'none';
    duration?: number;
  } = {}
) {
  if (navigationRef.isReady()) {
    // @ts-ignore - TypeScript has issues with the type inference here
    navigationRef.navigate({
      name: routeName,
      params,
      merge: true,
      // @ts-ignore - This is a valid property but not in the type definitions
      animation: transitionConfig.animation || 'default',
      animationDuration: transitionConfig.duration,
    });
  }
}
