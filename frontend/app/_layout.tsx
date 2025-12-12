import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import SplashScreen from '../components/SplashScreen';
import ErrorBoundary from '../components/ErrorBoundary';
import { AuthProvider } from '../contexts/AuthContext';
import { Colors } from '../constants/colors';

/**
 * Root navigation component - no auth-based routing, just simple stack
 */
function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="plan-mode-selection" />
      <Stack.Screen name="weekly-plan" />
      <Stack.Screen name="recipe-browse" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

/**
 * Root Layout Component
 * Wraps the app with ErrorBoundary, AuthProvider, and handles splash screen
 */
export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDark,
  },
});
