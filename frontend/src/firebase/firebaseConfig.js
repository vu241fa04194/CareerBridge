import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Helper to sanitize environment variables (removes quotes, commas, whitespace)
const clean = (val) => {
  if (!val) return '';
  return String(val)
    .trim()
    .replace(/^["']+|["',;\s]+$/g, '')
    .trim();
};

const firebaseConfig = {
  apiKey: clean(import.meta.env.VITE_FIREBASE_API_KEY),
  authDomain: clean(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN),
  projectId: clean(import.meta.env.VITE_FIREBASE_PROJECT_ID),
  storageBucket: clean(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: clean(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID),
  appId: clean(import.meta.env.VITE_FIREBASE_APP_ID),
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey.length > 10 &&
    !firebaseConfig.apiKey.includes('your_')
  );
};

let app = null;
let auth = null;
let db = null;
let storage = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('🔥 Firebase initialized successfully for project:', firebaseConfig.projectId);
  } else {
    console.warn(
      '⚠️ Firebase configuration is missing or incomplete in frontend/.env.'
    );
  }
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
}

export { app, auth, db, storage, firebaseConfig };
export default app;
