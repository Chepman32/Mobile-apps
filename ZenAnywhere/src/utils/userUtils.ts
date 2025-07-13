import { User, UserPreferences, UserStats, SubscriptionInfo } from '@types/user';
import { Platform } from 'react-native';
import { format } from 'date-fns';

/**
 * Get the user's display name with fallback options
 */
export const getDisplayName = (user: Partial<User> | null | undefined): string => {
  if (!user) return 'User';
  if (user.name) return user.name;
  if (user.email) return user.email.split('@')[0];
  return 'User';
};

/**
 * Get the user's initials for avatar placeholders
 */
export const getInitials = (name: string): string => {
  if (!name) return 'U';
  
  const names = name.trim().split(' ');
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  
  return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
};

/**
 * Get the appropriate avatar URL with fallback to a placeholder
 */
export const getAvatarUrl = (user: Partial<User> | null | undefined): string | null => {
  if (!user) return null;
  if (user.photoURL) return user.photoURL;
  
  // Generate a placeholder avatar based on user's name or email
  const name = getDisplayName(user);
  const initials = getInitials(name);
  
  // You can use a placeholder service like ui-avatars.com or implement your own
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random`;
};

/**
 * Format the user's join date
 */
export const formatJoinDate = (timestamp: any): string => {
  if (!timestamp) return 'Member since recently';
  
  try {
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `Member since ${format(date, 'MMMM yyyy')}`;
  } catch (error) {
    console.error('Error formatting join date:', error);
    return 'Member';
  }
};

/**
 * Check if the user has an active subscription
 */
export const hasActiveSubscription = (user: Partial<User> | null | undefined): boolean => {
  if (!user?.subscription) return false;
  
  const { status } = user.subscription;
  return status === 'active' || status === 'trial';
};

/**
 * Get the user's subscription status as a human-readable string
 */
export const getSubscriptionStatus = (user: Partial<User> | null | undefined): string => {
  if (!user?.subscription) return 'Free';
  
  const { status, plan } = user.subscription;
  
  switch (status) {
    case 'active':
      return `${plan ? `${plan.charAt(0).toUpperCase() + plan.slice(1)}` : 'Premium'}`;
    case 'trial':
      return 'Trial';
    case 'canceled':
      return 'Canceled';
    case 'expired':
      return 'Expired';
    default:
      return 'Free';
  }
};

/**
 * Format the user's session count
 */
export const formatSessionCount = (stats: UserStats | undefined): string => {
  if (!stats?.totalSessions) return 'No sessions yet';
  return `${stats.totalSessions} session${stats.totalSessions !== 1 ? 's' : ''} completed`;
};

/**
 * Format the user's total listening time
 */
export const formatListeningTime = (stats: UserStats | undefined): string => {
  if (!stats?.totalMinutes) return 'No listening time yet';
  
  const hours = Math.floor(stats.totalMinutes / 60);
  const minutes = stats.totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  
  return `${minutes} min`;
};

/**
 * Get the default user preferences
 */
export const getDefaultPreferences = (): UserPreferences => ({
  theme: 'system',
  notifications: true,
  downloadQuality: 'medium',
  autoDownload: false,
  language: 'en',
  playInBackground: true,
  dataSaver: false,
  sleepTimerDuration: 30, // 30 minutes
});

/**
 * Get the default user stats
 */
export const getDefaultStats = (): UserStats => ({
  totalSessions: 0,
  totalMinutes: 0,
  streak: 0,
  achievements: [],
});

/**
 * Get the default subscription info
 */
export const getDefaultSubscription = (): SubscriptionInfo => ({
  status: 'none',
  plan: 'free',
  autoRenew: false,
  trialUsed: false,
});

/**
 * Check if the user is new (created within the last 7 days)
 */
export const isNewUser = (user: Partial<User> | null | undefined): boolean => {
  if (!user?.createdAt) return false;
  
  try {
    const createdAt = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return createdAt > weekAgo;
  } catch (error) {
    console.error('Error checking if user is new:', error);
    return false;
  }
};

/**
 * Get the appropriate greeting based on the time of day
 */
export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Get the user's preferred theme (light/dark)
 * This should be used with the theme context
 */
export const getPreferredTheme = (preferences: UserPreferences): 'light' | 'dark' => {
  if (preferences.theme === 'system') {
    // Use the device's color scheme
    return Platform.OS === 'web' 
      ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      : 'light'; // Default to light for native if not web
  }
  
  return preferences.theme || 'light';
};

/**
 * Format the user's streak count
 */
export const formatStreak = (streak: number | undefined): string => {
  if (!streak) return 'Start a streak!';
  if (streak === 1) return '1 day';
  return `${streak} days`;
};
