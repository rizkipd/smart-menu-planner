import React from 'react';
import { useRouter } from 'expo-router';
import LoginScreen from '../components/LoginScreen';

export default function Index() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/plan-mode-selection');
  };

  const handleQuickDemo = () => {
    router.push('/(tabs)');
  };

  const handleSignUp = () => {
    // TODO: Implement sign up flow
    console.log('Sign up pressed');
  };

  return (
    <LoginScreen 
      onLogin={handleLogin}
      onQuickDemo={handleQuickDemo}
      onSignUp={handleSignUp}
    />
  );
}