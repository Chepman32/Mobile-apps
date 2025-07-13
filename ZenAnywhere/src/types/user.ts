import firestore from '@react-native-firebase/firestore';

/**
 * User preferences type definition
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  notificationTime?: string; // e.g., '09:00'
  downloadQuality: 'low' | 'medium' | 'high';
  autoDownload: boolean;
  language: string; // ISO 639-1 language code
  playInBackground: boolean;
  dataSaver: boolean;
  sleepTimerDuration: number; // in minutes
}

/**
 * User subscription information
 */
export interface SubscriptionInfo {
  status: 'active' | 'canceled' | 'expired' | 'trial' | 'none';
  plan?: 'free' | 'premium' | 'pro';
  startDate?: firestore.Timestamp;
  endDate?: firestore.Timestamp;
  autoRenew: boolean;
  paymentMethod?: string;
  trialUsed: boolean;
}

/**
 * User statistics
 */
export interface UserStats {
  totalSessions: number;
  totalMinutes: number;
  streak: number;
  lastSessionDate?: firestore.Timestamp;
  favoriteCategory?: string;
  achievements: string[];
}

/**
 * User settings
 */
export interface UserSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  autoPlayNext: boolean;
  hideCompletedSessions: boolean;
  hideLockedContent: boolean;
  downloadOverWifiOnly: boolean;
  streamingQuality: 'low' | 'medium' | 'high';
}

/**
 * Main user type
 */
export interface User {
  // Core user info
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  phoneNumber?: string;
  
  // User metadata
  createdAt: firestore.Timestamp;
  updatedAt: firestore.Timestamp;
  lastLoginAt?: firestore.Timestamp;
  
  // User roles and permissions
  roles?: string[];
  isAnonymous: boolean;
  isEmailVerified: boolean;
  
  // User preferences and settings
  preferences: UserPreferences;
  settings: UserSettings;
  
  // Subscription and premium features
  subscription: SubscriptionInfo;
  
  // User statistics
  stats: UserStats;
  
  // Additional user data
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  
  // App-specific fields
  onboardingCompleted: boolean;
  favoriteSessions?: string[];
  completedSessions?: string[];
  inProgressSessions?: string[];
  
  // Timestamps for various user activities
  timestamps?: {
    lastSessionPlayed?: firestore.Timestamp;
    lastNotificationRead?: firestore.Timestamp;
    premiumActivatedAt?: firestore.Timestamp;
  };
}

/**
 * User update payload type
 */
export type UserUpdateData = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'stats' | 'subscription'>> & {
  updatedAt?: firestore.FieldValue;
  'preferences.theme'?: UserPreferences['theme'];
  'preferences.notifications'?: boolean;
  'settings.emailNotifications'?: boolean;
  'settings.pushNotifications'?: boolean;
};

/**
 * User registration data
 */
export interface RegistrationData {
  email: string;
  password: string;
  name: string;
  acceptTerms: boolean;
  marketingOptIn?: boolean;
  metadata?: {
    signupMethod?: 'email' | 'google' | 'apple' | 'facebook';
    ipAddress?: string;
    userAgent?: string;
  };
}

/**
 * User login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
