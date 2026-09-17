import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

export default function Onboarding() {
  const navigate = useNavigate();
  const { enterApp, hasEnteredApp } = useApp();

  const handleEnter = () => {
    enterApp();
    navigate('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'radial-gradient(120% 80% at 50% 0%, #ECFDF5 0%, #F8FAFC 45%, #F1F5F9 100%)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Full-Screen Dedicated Top Bar (NO App Navbar above it) */}
      <header style={{
        width: '100%',
        height: '74px',
        padding: '0 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(15, 23, 42, 0.08)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        {/* Brand Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <img 
            src="/logo.png" 
            alt="JanSahayak" 
            style={{ 
              height: '46px', 
              width: 'auto', 
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 6px rgba(14, 94, 58, 0.25))' 
            }} 
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                JanSahayak
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                background: '#ECFDF5',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#065F46',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 700
              }}>
                <span className="status-dot active" style={{ width: '5px', height: '5px' }} />
                WELCOME INTRO
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>
              AI-Powered Public Grievance Intelligence & Redressal Platform
            </span>
          </div>
        </div>

        {/* Action Button: Skip & Enter App */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={handleEnter}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 22px',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '13.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 3px 12px rgba(14, 94, 58, 0.28)',
              transition: 'all 150ms ease'
            }}
          >
            <span>{hasEnteredApp ? 'Return to App' : 'Skip & Enter App'}</span>
            <ArrowRight style={{ width: '15px', height: '15px' }} />
          </button>
        </div>
      </header>

      {/* Main Full-Screen Content Area */}
      <div style={{ flex: 1, padding: '32px 16px 64px 16px', display: 'flex', justifyContent: 'center' }}>
        <OnboardingFlow onComplete={handleEnter} />
      </div>
    </div>
  );
}
