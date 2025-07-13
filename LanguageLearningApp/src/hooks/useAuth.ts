import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api, checkNetworkStatus } from '@services/api';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '@context/ThemeContext';
import { AppError } from '@utils/errorHandling';
import { Alert } from 'react-native';

type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    dailyReminder: boolean;
    targetLanguage: string;
  };
  stats: {
    streak: number;
    level: number;
    xp: number;
    totalXp: number;
  };
};

type AuthResponse = {
  user: User;
  token: string;
  refreshToken: string;
};

const AUTH_QUERY_KEY = ['auth'];

// Mock authentication for now - replace with actual API calls
export const useAuth = () => {
  const queryClient = useQueryClient();
  const navigation = useNavigation();
  const { setTheme } = useTheme();

  // Check if user is authenticated
  const { data: user, isLoading } = useQuery<User | null>({
    queryKey: AUTH_QUERY_KEY,
    queryFn: async () => {
      try {
        // In a real app, verify the token with the server
        const token = await AsyncStorage.getItem('auth_token');
        if (!token) return null;
        
        // Here you would typically validate the token with your backend
        // For now, we'll just return mock user data
        return {
          id: '1',
          email: 'user@example.com',
          name: 'John Doe',
          preferences: {
            theme: 'system',
            notifications: true,
            dailyReminder: true,
            targetLanguage: 'es',
          },
          stats: {
            streak: 7,
            level: 3,
            xp: 450,
            totalXp: 1250,
          },
        };
      } catch (error) {
        console.error('Auth error:', error);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Login mutation
  const loginMutation = useMutation<AuthResponse, AppError, { email: string; password: string }>({
    mutationFn: async ({ email, password }) => {
      const isConnected = await checkNetworkStatus();
      
      if (!isConnected) {
        throw new AppError(
          'No internet connection',
          'Please check your internet connection and try again',
          { component: 'useAuth', method: 'login' }
        );
      }

      // In a real app, this would be an actual API call
      // For now, simulate a network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful login
      if (email && password) {
        const mockUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          preferences: {
            theme: 'system',
            notifications: true,
            dailyReminder: true,
            targetLanguage: 'es',
          },
          stats: {
            streak: 7,
            level: 3,
            xp: 450,
            totalXp: 1250,
          },
        };

        return {
          user: mockUser,
          token: 'mock-jwt-token',
          refreshToken: 'mock-refresh-token',
        };
      } else {
        throw new AppError(
          'Invalid credentials',
          'Please check your email and password',
          { component: 'useAuth', method: 'login' }
        );
      }
    },
    onSuccess: async (data) => {
      // Store tokens
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('refresh_token', data.refreshToken);
      
      // Update user data in cache
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      
      // Update theme based on user preferences
      if (data.user.preferences.theme) {
        setTheme(data.user.preferences.theme);
      }
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    },
  });

  // Signup mutation
  const signupMutation = useMutation<AuthResponse, AppError, { email: string; password: string; name: string }>({
    mutationFn: async ({ email, password, name }) => {
      const isConnected = await checkNetworkStatus();
      
      if (!isConnected) {
        throw new AppError(
          'No internet connection',
          'Please check your internet connection and try again',
          { component: 'useAuth', method: 'signup' }
        );
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate successful signup
      const mockUser: User = {
        id: '1',
        email,
        name,
        preferences: {
          theme: 'system',
          notifications: true,
          dailyReminder: true,
          targetLanguage: 'es',
        },
        stats: {
          streak: 0,
          level: 1,
          xp: 0,
          totalXp: 0,
        },
      };

      return {
        user: mockUser,
        token: 'mock-jwt-token',
        refreshToken: 'mock-refresh-token',
      };
    },
    onSuccess: async (data) => {
      // Store tokens
      await AsyncStorage.setItem('auth_token', data.token);
      await AsyncStorage.setItem('refresh_token', data.refreshToken);
      
      // Update user data in cache
      queryClient.setQueryData(AUTH_QUERY_KEY, data.user);
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    },
  });

  // Logout function
  const logout = useCallback(async () => {
    try {
      // Clear tokens
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      
      // Clear all queries
      await queryClient.clear();
      
      // Reset navigation to auth screen
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  }, [navigation, queryClient]);

  // Update user preferences
  const updatePreferences = useMutation(
    async (updates: Partial<User['preferences']>) => {
      if (!user) throw new Error('Not authenticated');
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        ...user,
        preferences: {
          ...user.preferences,
          ...updates,
        },
      };
    },
    {
      onSuccess: (updatedUser) => {
        queryClient.setQueryData(AUTH_QUERY_KEY, updatedUser);
        
        // Update theme if it was changed
        if (updatedUser.preferences.theme) {
          setTheme(updatedUser.preferences.theme);
        }
      },
    }
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    loginLoading: loginMutation.isLoading,
    signup: signupMutation.mutateAsync,
    signupLoading: signupMutation.isLoading,
    logout,
    updatePreferences: updatePreferences.mutateAsync,
    updatePreferencesLoading: updatePreferences.isLoading,
  };
};

// Hook to check auth state
// export const useRequireAuth = (redirectTo = 'Auth') => {
//   const { user, isLoading } = useAuth();
//   const navigation = useNavigation();
//   const isMounted = useRef(true);

//   useEffect(() => {
//     return () => {
//       isMounted.current = false;
//     };
//   }, []);

//   useEffect(() => {
//     if (!isLoading && !user && isMounted.current) {
//       navigation.navigate(redirectTo as never);
//     }
//   }, [user, isLoading, navigation, redirectTo]);

//   return { user, isLoading };
// };

export default useAuth;
