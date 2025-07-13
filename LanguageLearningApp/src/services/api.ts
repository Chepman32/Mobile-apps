import { Platform } from 'react-native';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { AppError, handleError } from '@utils/errorHandling';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://api.languageapp.com/v1';

const API_TIMEOUT = 30000; // 30 seconds

// Create a custom fetch with timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Platform': Platform.OS,
        'X-App-Version': '1.0.0',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AppError(
        errorData.message || 'API request failed',
        'Unable to connect to the server. Please try again later.',
        { component: 'api', method: 'fetchWithTimeout', params: { url } }
      );
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// API Methods
const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) => {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}${queryString}`, {
      method: 'GET',
    }) as Promise<T>;
  },

  post: <T>(endpoint: string, data: unknown) => {
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }) as Promise<T>;
  },

  put: <T>(endpoint: string, data: unknown) => {
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }) as Promise<T>;
  },

  delete: <T>(endpoint: string) => {
    return fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    }) as Promise<T>;
  },
};

// Offline Persistence
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'language-app-cache',
  throttleTime: 1000, // 1 second
});

// Network Status
const checkNetworkStatus = async () => {
  const netInfo = await NetInfo.fetch();
  return netInfo.isConnected ?? false;
};

// Configure Query Client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof AppError && error.originalError?.message?.includes('40')) {
          return false;
        }
        return failureCount < 3;
      },
      onError: (error) => handleError(error),
      networkMode: 'always', // Always try to fetch, but use cache when offline
    },
    mutations: {
      onError: (error) => handleError(error),
      retry: 1,
    },
  },
});

// Export everything
export { api, asyncStoragePersister, checkNetworkStatus };
export type { AppError } from '@utils/errorHandling';
