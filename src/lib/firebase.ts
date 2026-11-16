import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore, initializeFirestore, type Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** False until the EXPO_PUBLIC_FIREBASE_* keys are set; the app then runs in local demo mode. */
export const firebaseReady = !!(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | undefined;
let auth: FirebaseAuth.Auth | undefined;
let db: Firestore | undefined;

if (firebaseReady) {
  const fresh = getApps().length === 0;
  app = fresh ? initializeApp(config) : getApp();
  // On native, keep the session across launches; the React Native build of firebase/auth exports this helper.
  const rnPersistence = (FirebaseAuth as unknown as { getReactNativePersistence?: (s: typeof AsyncStorage) => FirebaseAuth.Persistence }).getReactNativePersistence;
  auth =
    fresh && Platform.OS !== 'web' && rnPersistence
      ? FirebaseAuth.initializeAuth(app, { persistence: rnPersistence(AsyncStorage) })
      : FirebaseAuth.getAuth(app);
  // Optional profile fields are left undefined rather than stripped by hand before every write.
  db = fresh ? initializeFirestore(app, { ignoreUndefinedProperties: true }) : getFirestore(app);
}

export { auth, db };
