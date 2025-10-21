import React from 'react';
import { useRouter } from 'expo-router';
import PlanModeSelection from '../components/PlanModeSelection';

export default function PlanModeSelectionPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handlePlanSelect = (selectedMode: any) => {
    // Store selected mode in context/state if needed
    router.push('/weekly-plan');
  };

  return (
    <PlanModeSelection 
      onBack={handleBack}
      onPlanSelect={handlePlanSelect}
    />
  );
}