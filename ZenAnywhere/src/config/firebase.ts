// This file contains the Firebase configuration for the app
// Replace these values with your actual Firebase project configuration

// For web configuration
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// For native platforms (iOS/Android), we'll use google-services.json and GoogleService-Info.plist
// These files should be placed in the following locations:
// - Android: android/app/google-services.json
// - iOS: ios/GoogleService-Info.plist

// Environment validation
export const validateFirebaseConfig = () => {
  const requiredEnvVars = [
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
    'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'EXPO_PUBLIC_FIREBASE_APP_ID',
  ];

  const missingVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar] && !process.env[`REACT_APP_${envVar}`]
  );

  if (missingVars.length > 0) {
    console.warn(
      'Warning: The following Firebase environment variables are missing:\n',
      missingVars.join('\n'),
      '\n\nPlease add them to your .env file or set them in your environment.'
    );
    return false;
  }

  return true;
};

// Check if we're running in a web environment
export const isWeb = typeof window !== 'undefined';

// Check if we're running in a development environment
export const isDev = process.env.NODE_ENV === 'development';

// Firebase emulator settings
export const EMULATOR_HOST = isWeb ? 'localhost' : '10.0.2.2'; // 10.0.2.2 for Android emulator

export const USE_FIREBASE_EMULATOR = isDev;

export const EMULATOR_PORTS = {
  auth: 9099,
  firestore: 8080,
  storage: 9199,
  functions: 5001,
};

// Initialize Firebase emulators if in development mode
export const initializeEmulators = async () => {
  if (!USE_FIREBASE_EMULATOR) return;

  try {
    const { initializeApp, getApps } = await import('firebase/app');
    const { getAuth, connectAuthEmulator } = await import('firebase/auth');
    const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore');
    const { getStorage, connectStorageEmulator } = await import('firebase/storage');
    const { getFunctions, connectFunctionsEmulator } = await import('firebase/functions');

    // Initialize Firebase if not already initialized
    if (getApps().length === 0) {
      initializeApp(firebaseConfig);
    }

    // Connect to emulators
    if (process.env.NODE_ENV === 'development') {
      // Auth emulator
      if (!window.emulatorConfig?.auth) {
        connectAuthEmulator(
          getAuth(),
          `http://${EMULATOR_HOST}:${EMULATOR_PORTS.auth}`,
          { disableWarnings: true }
        );
        window.emulatorConfig = { ...(window.emulatorConfig || {}), auth: true };
      }

      // Firestore emulator
      if (!window.emulatorConfig?.firestore) {
        connectFirestoreEmulator(
          getFirestore(),
          EMULATOR_HOST,
          EMULATOR_PORTS.firestore
        );
        window.emulatorConfig = { ...(window.emulatorConfig || {}), firestore: true };
      }

      // Storage emulator
      if (!window.emulatorConfig?.storage) {
        connectStorageEmulator(
          getStorage(),
          EMULATOR_HOST,
          EMULATOR_PORTS.storage
        );
        window.emulatorConfig = { ...(window.emulatorConfig || {}), storage: true };
      }

      // Functions emulator
      if (!window.emulatorConfig?.functions) {
        connectFunctionsEmulator(
          getFunctions(),
          EMULATOR_HOST,
          EMULATOR_PORTS.functions
        );
        window.emulatorConfig = { ...(window.emulatorConfig || {}), functions: true };
      }

      console.log('Firebase emulators connected');
    }
  } catch (error) {
    console.error('Error initializing Firebase emulators:', error);
  }
};

// Declare window type for emulator config
declare global {
  interface Window {
    emulatorConfig?: {
      auth?: boolean;
      firestore?: boolean;
      storage?: boolean;
      functions?: boolean;
    };
  }
}
