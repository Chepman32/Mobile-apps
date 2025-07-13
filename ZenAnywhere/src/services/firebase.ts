import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import { Platform } from 'react-native';

// Initialize Firebase
const initializeFirebase = () => {
  if (__DEV__) {
    // Disable persistence in development to avoid Firestore cache issues
    firestore().settings({
      persistence: false,
      cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED,
    });
    
    // Disable analytics in development
    analytics().setAnalyticsCollectionEnabled(false);
    
    // Enable crashlytics in debug mode for testing
    if (__DEV__) {
      crashlytics().setCrashlyticsCollectionEnabled(true);
    }
  }
  
  console.log('Firebase initialized');
};

// Auth Service
const authService = {
  // Get current user
  getCurrentUser: () => auth().currentUser,
  
  // Email/Password authentication
  signInWithEmail: async (email: string, password: string) => {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      await analytics().logLogin({ method: 'email' });
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  
  // Sign up with email/password
  signUpWithEmail: async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user?.updateProfile({ displayName });
      await analytics().logSignUp({ method: 'email' });
      return userCredential.user;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },
  
  // Sign out
  signOut: async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
  
  // Password reset
  resetPassword: async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },
  
  // Auth state listener
  onAuthStateChanged: (callback: (user: any) => void) => {
    return auth().onAuthStateChanged(callback);
  },
};

// Firestore Service
const db = firestore();

const firestoreService = {
  // User data
  users: db.collection('users'),
  
  // Get user document
  getUser: async (userId: string) => {
    try {
      const doc = await db.collection('users').doc(userId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },
  
  // Update user document
  updateUser: async (userId: string, data: any) => {
    try {
      await db.collection('users').doc(userId).update(data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },
  
  // Get meditation sessions
  getMeditationSessions: async (category?: string) => {
    try {
      let query: any = db.collection('meditations');
      
      if (category) {
        query = query.where('category', '==', category);
      }
      
      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting meditations:', error);
      throw error;
    }
  },
  
  // Get single meditation session
  getMeditationSession: async (id: string) => {
    try {
      const doc = await db.collection('meditations').doc(id).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error('Error getting meditation:', error);
      throw error;
    }
  },
  
  // Add user favorite
  addFavorite: async (userId: string, meditationId: string) => {
    try {
      await db.collection('users').doc(userId).update({
        favorites: firestore.FieldValue.arrayUnion(meditationId),
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  },
  
  // Remove user favorite
  removeFavorite: async (userId: string, meditationId: string) => {
    try {
      await db.collection('users').doc(userId).update({
        favorites: firestore.FieldValue.arrayRemove(meditationId),
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  },
};

// Storage Service
const storageService = {
  // Upload user avatar
  uploadAvatar: async (userId: string, uri: string) => {
    try {
      const filename = `avatars/${userId}-${Date.now()}`;
      const reference = storage().ref(filename);
      
      // For Android, we need to convert the file URI to a Blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const task = reference.put(blob);
      
      // Wait for upload to complete
      await task;
      
      // Get the download URL
      const downloadURL = await reference.getDownloadURL();
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  },
  
  // Get download URL for audio file
  getAudioUrl: async (path: string) => {
    try {
      return await storage().ref(path).getDownloadURL();
    } catch (error) {
      console.error('Error getting audio URL:', error);
      throw error;
    }
  },
};

// Analytics Service
const analyticsService = {
  // Log custom event
  logEvent: async (name: string, params?: any) => {
    if (__DEV__) return; // Skip in development
    
    try {
      await analytics().logEvent(name, params);
    } catch (error) {
      console.error('Analytics error:', error);
    }
  },
  
  // Set user properties
  setUserProperties: async (userId: string, properties: any) => {
    if (__DEV__) return; // Skip in development
    
    try {
      await Promise.all([
        analytics().setUserId(userId),
        ...Object.entries(properties).map(([key, value]) => 
          analytics().setUserProperty(key, String(value))
        ),
      ]);
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  },
};

// Crashlytics Service
const crashlyticsService = {
  // Log error to Crashlytics
  recordError: (error: Error) => {
    if (__DEV__) {
      console.error(error);
      return;
    }
    crashlytics().recordError(error);
  },
  
  // Set user identifier for crash reporting
  setUser: (user: any) => {
    if (!user) return;
    
    crashlytics().setUserId(user.uid);
    if (user.email) {
      crashlytics().setAttribute('email', user.email);
    }
    if (user.displayName) {
      crashlytics().setAttribute('username', user.displayName);
    }
  },
};

export {
  initializeFirebase,
  authService,
  firestoreService,
  storageService,
  analyticsService,
  crashlyticsService,
};
