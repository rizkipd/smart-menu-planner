import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import SplashScreen from '../components/SplashScreen';

export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

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