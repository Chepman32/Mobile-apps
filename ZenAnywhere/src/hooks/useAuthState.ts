import { useState, useEffect, useCallback } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { User } from '@types/user';
import { useFirebase } from '@context/FirebaseContext';

/**
 * Custom hook to handle authentication state and user data
 * @returns Object containing user, loading state, and auth methods
 */
const useAuthState = () => {
  const { user, loading, error, ...firebaseActions } = useFirebase();
  const [isInitializing, setIsInitializing] = useState(true);
  const [authUser, setAuthUser] = useState<FirebaseAuthTypes.User | null>(null);

  // Handle auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      (firebaseUser) => {
        setAuthUser(firebaseUser);
        if (isInitializing) {
          setIsInitializing(false);
        }
      },
      (err) => {
        console.error('Auth state change error:', err);
        setIsInitializing(false);
      }
    );

    return () => unsubscribe();
  }, [isInitializing]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return authUser !== null;
  }, [authUser]);

  // Check if user has specific role
  const hasRole = useCallback(
    (role: string) => {
      if (!user || !user.roles) return false;
      return user.roles.includes(role);
    },
    [user]
  );

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback(
    (roles: string[]) => {
      if (!user || !user.roles) return false;
      return roles.some(role => user.roles?.includes(role));
    },
    [user]
  );

  // Get user display name or fallback to email
  const getDisplayName = useCallback(() => {
    if (user?.name) return user.name;
    if (authUser?.displayName) return authUser.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  }, [user, authUser]);

  // Get user avatar URL or fallback to default
  const getAvatarUrl = useCallback(() => {
    if (user?.photoURL) return user.photoURL;
    if (authUser?.photoURL) return authUser.photoURL;
    return null;
  }, [user, authUser]);

  // Check if user has completed onboarding
  const hasCompletedOnboarding = useCallback(() => {
    return user?.onboardingCompleted === true;
  }, [user]);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    try {
      if (authUser) {
        await authUser.reload();
        setAuthUser(auth.currentUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      throw error;
    }
  }, [authUser]);

  return {
    // State
    user,
    authUser,
    loading: loading || isInitializing,
    error,
    
    // Authentication state
    isAuthenticated,
    isInitializing,
    
    // User info
    displayName: getDisplayName(),
    avatarUrl: getAvatarUrl(),
    email: user?.email || authUser?.email || '',
    emailVerified: authUser?.emailVerified || false,
    
    // Permissions
    hasRole,
    hasAnyRole,
    hasCompletedOnboarding,
    
    // Actions
    refreshUser,
    ...firebaseActions,
  };
};

export default useAuthState;
