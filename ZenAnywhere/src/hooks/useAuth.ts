import { useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../types/app-navigation';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types
type User = {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscription: 'free' | 'premium';
  preferences: {
    theme: 'light' | 'dark' | 'system';
    notifications: boolean;
    downloadQuality: 'low' | 'medium' | 'high';
  };
};

type AuthState = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
};

const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isLoading: false,
    error: null,
  });

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  // Load user from storage on app start
  const loadUser = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      const userJson = await AsyncStorage.getItem('@user');
      const token = await AsyncStorage.getItem('@token');
      
      if (userJson && token) {
        const user = JSON.parse(userJson);
        setState({
          user,
          token,
          isLoading: false,
          error: null,
        });
        return user;
      }
      return null;
    } catch (error) {
      console.error('Failed to load user', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to load user data',
        isLoading: false,
      }));
      return null;
    }
  }, []);

  // Login user
  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockUser: User = {
        id: '1',
        email,
        name: 'John Doe',
        subscription: 'free',
        preferences: {
          theme: 'system',
          notifications: true,
          downloadQuality: 'medium',
        },
      };
      
      const mockToken = 'mock-jwt-token';
      
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('@token', mockToken);
      
      setState({
        user: mockUser,
        token: mockToken,
        isLoading: false,
        error: null,
      });
      
      return mockUser;
    } catch (error) {
      console.error('Login failed', error);
      setState(prev => ({
        ...prev,
        error: 'Login failed. Please check your credentials and try again.',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Sign up user
  const signUp = useCallback(async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockUser: User = {
        id: '1',
        email,
        name,
        subscription: 'free',
        preferences: {
          theme: 'system',
          notifications: true,
          downloadQuality: 'medium',
        },
      };
      
      const mockToken = 'mock-jwt-token';
      
      await AsyncStorage.setItem('@user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('@token', mockToken);
      
      setState({
        user: mockUser,
        token: mockToken,
        isLoading: false,
        error: null,
      });
      
      return mockUser;
    } catch (error) {
      console.error('Sign up failed', error);
      setState(prev => ({
        ...prev,
        error: 'Sign up failed. Please try again.',
        isLoading: false,
      }));
      throw error;
    }
  }, []);

  // Logout user
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('@user');
      await AsyncStorage.removeItem('@token');
      
      setState({
        user: null,
        token: null,
        isLoading: false,
        error: null,
      });
      
      // Navigate to welcome screen
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Logout failed', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to logout. Please try again.',
      }));
    }
  }, [navigation]);

  // Update user preferences
  const updatePreferences = useCallback(async (updates: Partial<User['preferences']>) => {
    if (!state.user) return;
    
    try {
      const updatedUser = {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...updates,
        },
      };
      
      await AsyncStorage.setItem('@user', JSON.stringify(updatedUser));
      
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
      
      return updatedUser;
    } catch (error) {
      console.error('Failed to update preferences', error);
      setState(prev => ({
        ...prev,
        error: 'Failed to update preferences',
      }));
      throw error;
    }
  }, [state.user]);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  return {
    ...state,
    login,
    signUp,
    logout,
    loadUser,
    updatePreferences,
    clearError,
  };
};

export default useAuth;
