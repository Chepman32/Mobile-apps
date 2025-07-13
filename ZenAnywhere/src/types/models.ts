import { Timestamp } from '@react-native-firebase/firestore';

export interface Duration {
  minutes: number;
  seconds: number;
}

export interface Media {
  id: string;
  url: string;
  duration: number; // in seconds
  size?: number; // in bytes
  mimeType?: string;
}

export interface MeditationSession {
  id: string;
  title: string;
  description: string;
  duration: number; // in seconds
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  instructor: string;
  audio: Media;
  imageUrl: string;
  isPremium: boolean;
  tags: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  playCount: number;
  averageRating?: number;
  totalRatings: number;
  backgroundSounds?: string[];
  isFeatured: boolean;
  isNew: boolean;
  seriesId?: string;
  orderInSeries?: number;
}

export interface MeditationSeries {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  sessions: string[]; // Array of session IDs
  totalDuration: number; // in seconds
  instructor: string;
  isPremium: boolean;
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isFeatured: boolean;
}

export interface UserProgress {
  userId: string;
  completedSessions: {
    sessionId: string;
    completedAt: Timestamp;
    durationCompleted: number; // in seconds
    isFullyCompleted: boolean;
  }[];
  inProgressSessions: {
    sessionId: string;
    lastPlayedAt: Timestamp;
    lastPosition: number; // in seconds
  }[];
  totalMinutesMeditated: number;
  currentStreak: number;
  lastMeditationDate?: Timestamp;
  favoriteCategories: string[];
  achievements: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserFavorite {
  id: string;
  userId: string;
  sessionId: string;
  favoritedAt: Timestamp;
}

export interface UserRating {
  id: string;
  userId: string;
  sessionId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  sessionCount: number;
  isFeatured: boolean;
  order?: number;
}

export interface BackgroundSound {
  id: string;
  name: string;
  description: string;
  audio: Media;
  imageUrl: string;
  category: string;
  duration: number; // in seconds
  isPremium: boolean;
  tags: string[];
}

export interface Playlist {
  id: string;
  userId: string;
  name: string;
  description?: string;
  sessions: string[]; // Array of session IDs
  imageUrl?: string;
  isPublic: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'reminder' | 'promotion' | 'achievement' | 'general';
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: Timestamp;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  features: string[];
  isPopular: boolean;
  trialPeriodDays?: number;
  discount?: {
    originalPrice: number;
    validUntil: Timestamp;
  };
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired' | 'trial';
  startDate: Timestamp;
  endDate: Timestamp;
  autoRenew: boolean;
  paymentMethod: string;
  lastBillingDate?: Timestamp;
  nextBillingDate?: Timestamp;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Timestamp;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'yearly';
  platform: 'ios' | 'android' | 'web';
  receipt?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
