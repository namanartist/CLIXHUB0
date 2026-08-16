import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC3LNIY5nSznH0BJQQg_YK9I9kJTni-LX4",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "clix-decf9.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://clix-decf9-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "clix-decf9",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "clix-decf9.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "818156692685",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:818156692685:web:331f586859424bccebb584",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-9WWLEGGJVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const storage = getStorage(app);
export const firestore = getFirestore(app);

// Initialize Analytics (optional/supported in browser environment)
export let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {});
}

export default app;
