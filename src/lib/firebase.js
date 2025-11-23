'use client';

import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from 'react';

// Konfigurasi Firebase Anda
const firebaseConfig = {
  apiKey: "AIzaSyAqZJQ-JNu5XB9ueE_P6P3EVZLnj64MAP0",
  authDomain: "cvbuilder-70d2b.firebaseapp.com",
  projectId: "cvbuilder-70d2b",
  storageBucket: "cvbuilder-70d2b.appspot.com",
  messagingSenderId: "985002956189",
  appId: "1:985002956189:web:21d4b0cf004824f0b1cb74",
  measurementId: "G-N7RDWJPYVC"
};

// Inisialisasi Firebase dengan cara yang aman untuk mencegah inisialisasi ganda
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Inisialisasi dan ekspor services yang aman untuk diimpor di server & client
export const auth = getAuth(app);
export const db = getFirestore(app);

// Buat Auth Context
const AuthContext = createContext({});

// Auth Provider Component
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Fungsi-fungsi auth
  const signup = async (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    return firebaseSignOut(auth);
  };

  const updateUserProfile = async (displayName, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL
    });
  };

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook untuk menggunakan auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth harus digunakan di dalam AuthProvider');
  }
  return context;
}

// Fungsi untuk logout (backward compatibility)
export const signOut = () => {
  return firebaseSignOut(auth);
};