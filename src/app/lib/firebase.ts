import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDptAnDuEg5pZtgyRUUVxYRELi39vfJggY',
  authDomain: 'vit-26885.firebaseapp.com',
  projectId: 'vit-26885',
  storageBucket: 'vit-26885.firebasestorage.app',
  messagingSenderId: '241016663577',
  appId: '1:241016663577:web:2aadcb942632c8ec2f4488',
  measurementId: 'G-80ETXDGB0G',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(firebaseApp);

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });
