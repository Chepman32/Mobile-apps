import { NavigationProp as BaseNavigationProp } from '@react-navigation/native';
import { RouteProp as BaseRouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the root parameter list type
export type RootStackParamList = {
  // Auth Stack
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  
  // Main Tabs
  Main: undefined;
  Auth: undefined;
  
  // Home Stack
  Home: undefined;
  FeaturedMeditation: { id: string; title: string };
  
  // Discover Stack
  Discover: undefined;
  Category: { categoryId: string; categoryName: string };
  
  // Player
  Player: { 
    sessionId: string; 
    sessionName: string;
    duration?: number;
    imageUrl?: string;
    description?: string;
  };
  
  // Library
  Library: undefined;
  Favorites: undefined;
  Downloads: undefined;
  
  // Profile
  Profile: undefined;
  EditProfile: undefined;
  Settings: undefined;
  NotificationSettings: undefined;
  Subscription: undefined;
  HelpCenter: undefined;
  About: undefined;
  
  // Modals
  PlayerModal: { sessionId: string; sessionName: string };
  PremiumModal: undefined;
};

// Extend the global ReactNavigation namespace
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Navigation prop type
type NavigationProp<T extends keyof RootStackParamList> = 
  NativeStackNavigationProp<RootStackParamList, T>;

// Route prop type
type RouteProp<T extends keyof RootStackParamList> = 
  BaseRouteProp<RootStackParamList, T>;

// Screen props type
type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NavigationProp<T>;
  route: RouteProp<T>;
};

export type {
  NavigationProp,
  RouteProp,
  ScreenProps
};
