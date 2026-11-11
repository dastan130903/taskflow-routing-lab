import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  getAuth,
  GoogleAuthProvider,
} from 'firebase/auth';

// Firebase's web configuration is supplied by the student's .env.local file.
// Vite exposes variables starting with VITE_ to the browser.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);

const firebaseApp = firebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const googleProvider = new GoogleAuthProvider();
export { browserLocalPersistence };
