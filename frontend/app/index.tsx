import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert } from 'react-native';
import LoginScreen from '../components/LoginScreen';
import SignUpScreen from '../components/SignUpScreen';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const { setDemoMode } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    router.replace('/plan-mode-selection');
  };

  const handleQuickDemo = () => {
    // Set demo mode for the user context
    setDemoMode(true);
    // Navigate directly to tabs
    router.replace('/(tabs)');
  };

  const handleSignUp = () => {
    setIsSignUp(true);
  };

  const handleSignUpComplete = (credentials: { name: string; email: string; password: string }) => {
    console.log('Account created:', credentials.email);
    setIsSignUp(false);
    // After successful sign up, user can login with credentials
    Alert.alert(
      'Account Created',
      'Your account has been created. You can now sign in with your credentials.',
      [{ text: 'OK', onPress: () => setIsSignUp(false) }]
    );
  };

  const handleBackToLogin = () => {
    setIsSignUp(false);
  };

  if (isSignUp) {
    return (
      <SignUpScreen
        onSignUp={handleSignUpComplete}
        onBackToLogin={handleBackToLogin}
        isLoading={isLoading}
      />
    );
  }

  return (
    <LoginScreen 
      onLogin={handleLogin}
      onQuickDemo={handleQuickDemo}
      onSignUp={handleSignUp}
    />
  );
}