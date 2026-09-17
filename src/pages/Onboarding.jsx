import React from 'react';
import { useApp } from '../context/AppContext';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

export default function Onboarding() {
  const { enterApp } = useApp();

  const handleEnter = () => {
    if (enterApp) enterApp();
  };

  return <OnboardingFlow onComplete={handleEnter} />;
}
