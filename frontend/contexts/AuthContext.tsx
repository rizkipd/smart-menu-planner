/**
 * Authentication Context
 * Provides centralized auth state management across the app
 *
 * NOTE: Firebase native modules don't work in Expo Go.
 * This context gracefully handles the case when Firebase is unavailable
 * and allows the app to run in "demo mode" without authentication.
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user type for when Firebase is not available
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: MockUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isFirebaseAvailable: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => void;
  setDemoMode: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Check if Firebase is available (will fail in Expo Go)
let FirebaseAuthService: any = null;
let isFirebaseAvailable = false;

try {
  // Dynamic import to catch the error
  FirebaseAuthService = require('../services/firebaseAuthService').FirebaseAuthService;
  isFirebaseAvailable = true;
} catch (error) {
  console.log('Firebase not available (running in Expo Go). Using demo mode.');
  isFirebaseAvailable = false;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [demoMode, setDemoModeState] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    if (isFirebaseAvailable && FirebaseAuthService) {
      // Set up Firebase auth state listener
      try {
        unsubscribe = FirebaseAuthService.onAuthStateChanged((firebaseUser: any) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
            });
          } else {
            setUser(null);
          }
          setIsLoading(false);
        });
      } catch (error) {
        console.error('Firebase auth listener error:', error);
        setIsLoading(false);
      }
    } else {
      // Firebase not available - just mark as loaded
      setIsLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    try {
      if (isFirebaseAvailable && FirebaseAuthService) {
        await FirebaseAuthService.signOut();
      }
      setUser(null);
      setDemoModeState(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  const refreshUser = () => {
    if (isFirebaseAvailable && FirebaseAuthService) {
      const currentUser = FirebaseAuthService.getCurrentUser();
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        });
      }
    }
  };

  const setDemoMode = (enabled: boolean) => {
    setDemoModeState(enabled);
    if (enabled) {
      // Create a mock demo user
      setUser({
        uid: 'demo-user',
        email: 'demo@example.com',
        displayName: 'Demo User',
      });
    } else {
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user || demoMode,
    isFirebaseAvailable,
    signOut,
    refreshUser,
    setDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
