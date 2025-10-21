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

  return (
    <LoginScreen 
      onLogin={handleLogin}
      onQuickDemo={handleQuickDemo}
    />
  );
}