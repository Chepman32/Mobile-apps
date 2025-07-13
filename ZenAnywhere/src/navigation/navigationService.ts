import { createNavigationContainerRef } from '@react-navigation/native';

type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  // Add other screen params as needed
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Use this function to navigate to a specific route from outside React components
 * @param name - The name of the route to navigate to
 * @param params - Optional parameters to pass to the route
 */
export function navigate<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    // @ts-ignore - TypeScript has issues with the type inference here
    navigationRef.navigate(name, params);
  }
}

/**
 * Use this function to go back to the previous screen
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}

/**
 * Use this function to reset the navigation state
 * @param routeName - The name of the route to navigate to after reset
 * @param params - Optional parameters to pass to the route
 */
export function resetNavigation<RouteName extends keyof RootStackParamList>(
  routeName: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: routeName, params }],
    });
  }
}

/**
 * Get the current route name
 * @returns The name of the current route or null if not available
 */
export function getCurrentRouteName(): string | null {
  if (!navigationRef.isReady()) return null;
  
  const currentRoute = navigationRef.getCurrentRoute();
  return currentRoute?.name || null;
}

/**
 * Check if a specific route is currently active
 * @param routeName - The name of the route to check
 * @returns True if the route is active, false otherwise
 */
export function isRouteActive(routeName: string): boolean {
  if (!navigationRef.isReady()) return false;
  
  const currentRoute = navigationRef.getCurrentRoute();
  return currentRoute?.name === routeName;
}
