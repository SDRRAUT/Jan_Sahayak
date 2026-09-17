import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

export default function Onboarding() {
  const navigate = useNavigate();
  const { enterApp } = useApp();

  const handleEnter = () => {
    enterApp();
    navigate('/');
  };

  return <OnboardingFlow onComplete={handleEnter} />;
}
