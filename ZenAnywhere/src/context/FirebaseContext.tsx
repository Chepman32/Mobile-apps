import React, { createContext, useContext, useEffect, useState } from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { User } from '@types/user';
import { Alert } from 'react-native';

type FirebaseContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
};

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Handle user state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(
      async (firebaseUser: FirebaseAuthTypes.User | null) => {
        try {
          if (firebaseUser) {
            // Get user data from Firestore
            const userDoc = await firestore().collection('users').doc(firebaseUser.uid).get();
            
            if (userDoc.exists) {
              setUser({
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || undefined,
                ...userDoc.data(),
              } as User);
            } else {
              // Create user document if it doesn't exist
              const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || 'New User',
                photoURL: firebaseUser.photoURL || undefined,
                createdAt: firestore.FieldValue.serverTimestamp(),
                updatedAt: firestore.FieldValue.serverTimestamp(),
                preferences: {
                  theme: 'system',
                  notifications: true,
                  downloadQuality: 'medium',
                },
              };
              
              await firestore().collection('users').doc(firebaseUser.uid).set(newUser);
              setUser(newUser);
            }
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error('Error handling auth state change:', err);
          setError(err as Error);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Auth state change error:', err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (err) {
      console.error('Sign in error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Create user in Firebase Auth
      const { user: firebaseUser } = await auth().createUserWithEmailAndPassword(email, password);
      
      if (firebaseUser) {
        // Update user profile with display name
        await firebaseUser.updateProfile({
          displayName: name,
        });
        
        // Create user document in Firestore
        const newUser: User = {
          id: firebaseUser.uid,
          email: email,
          name: name,
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
          preferences: {
            theme: 'system',
            notifications: true,
            downloadQuality: 'medium',
          },
        };
        
        await firestore().collection('users').doc(firebaseUser.uid).set(newUser);
        setUser(newUser);
      }
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await auth().signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await auth().sendPasswordResetEmail(email);
      Alert.alert('Success', 'Password reset email sent. Please check your inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Update in Firestore
      await firestore().collection('users').doc(user.id).update({
        ...data,
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });
      
      // Update local state
      setUser(prev => ({
        ...prev!,
        ...data,
      }));
      
      // Update in Firebase Auth if name or photoURL changed
      if (data.name || data.photoURL) {
        await auth().currentUser?.updateProfile({
          displayName: data.name || user.name,
          photoURL: data.photoURL || user.photoURL,
        });
      }
      
      Alert.alert('Success', 'Profile updated successfully');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = (): FirebaseContextType => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

export default FirebaseContext;
