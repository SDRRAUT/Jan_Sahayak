import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Volume2, Shield } from 'lucide-react';
import onboardingBg from '../../assets/onboarding-bg.jpg';

export default function SplashScreen({ onStart }) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const durationMs = 4000;
    const intervalMs = 40;
    const increment = (intervalMs / durationMs) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setIsReady(true);
          return 100;
        }
        return next;
      });
    }, intervalMs);

    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      clearInterval(countdownTimer);
    };
  }, []);

  const getStatusText = () => {
    if (progress < 30) return 'Initializing Public Grievance Engine...';
    if (progress < 65) return 'Connecting Municipal AI & Department DNA...';
    if (progress < 95) return 'Calibrating Multilingual Voice & Image Triage...';
    return 'System Ready • Click Start to Begin Audio Tour';
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '16px',
      boxSizing: 'border-box',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Crisp background image with 50% opacity matching Onboarding */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${onboardingBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.50,
          zIndex: 1,
          pointerEvents: 'none'
        }} 
      />

      {/* Central Card Matching Onboarding Theme & Layout */}
      <div style={{
        background: 'linear-gradient(155deg, #F0FDF4 0%, #DCFCE7 100%)',
        border: '1.5px solid #86EFAC',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 60px -10px rgba(5, 150, 105, 0.20), 0 0 0 1px rgba(16, 185, 129, 0.22)',
        padding: '20px 26px 20px 26px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>
        {/* Top Header Row matching OnboardingFlow */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid rgba(5, 150, 105, 0.16)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak Logo" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#1E2653', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                JanSahayak
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                AI Civic Resolution Platform
              </div>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.88)',
            border: '1px solid #86EFAC',
            borderRadius: '999px',
            padding: '4px 12px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#059669',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            <span>🇮🇳</span>
            <span>Digital India Initiative</span>
          </div>
        </div>

        {/* Central Emblem & Identity */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '8px 0 14px 0'
        }}>
          {/* Logo Card with Onboarding Styling */}
          <div style={{
            position: 'relative',
            width: '92px',
            height: '92px',
            borderRadius: '24px',
            background: '#FFFFFF',
            boxShadow: '0 12px 30px rgba(5, 150, 105, 0.16), 0 0 0 1px rgba(16, 185, 129, 0.20)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>

          {/* Title & Slogans */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            margin: '0 0 4px 0',
            color: '#0F172A'
          }}>
            JanSahayak
          </h1>

          <p style={{
            fontSize: '14.5px',
            fontWeight: 700,
            color: '#059669',
            margin: '0 0 8px 0',
            letterSpacing: '0.01em'
          }}>
            जन सहायक • Aapki Awaaz, Ab Samjhi Jayegi
          </p>

          <p style={{
            fontSize: '13px',
            color: '#475569',
            fontWeight: 500,
            maxWidth: '430px',
            lineHeight: 1.5,
            margin: '0 0 20px 0'
          }}>
            Empowering citizens with AI problem discovery, instant department routing, and verified resolution tracking.
          </p>

          {/* Animated Loading Progress Section */}
          <div style={{ width: '100%', maxWidth: '420px', marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#334155',
              marginBottom: '6px'
            }}>
              <span>{getStatusText()}</span>
              <span style={{ color: '#059669', fontWeight: 800 }}>
                {isReady ? '100%' : `${Math.round(progress)}%`}
              </span>
            </div>

            <div style={{
              height: '7px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.90)',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative',
              border: '1px solid #86EFAC'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #059669 0%, #10B981 100%)',
                borderRadius: '999px',
                transition: 'width 60ms linear'
              }} />
            </div>
          </div>

          {/* Action Button: Start Experience + Audio */}
          <button
            type="button"
            onClick={onStart}
            style={{
              height: '48px',
              padding: '0 32px',
              borderRadius: '999px',
              background: '#059669',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14.5px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
              transform: isReady ? 'scale(1.02)' : 'scale(1)',
              transition: 'all 200ms ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = isReady ? 'scale(1.02)' : 'scale(1)'; }}
          >
            <Volume2 style={{ width: '18px', height: '18px' }} />
            <span>Start Platform & Audio Tour</span>
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>

          {/* Subtle Helper Note */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '14px',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#64748B'
          }}>
            <Sparkles style={{ width: '13px', height: '13px', color: '#F59E0B' }} />
            <span>Audio narration in Hindi/English will guide your tour</span>
          </div>
        </div>
      </div>
    </div>
  );
}
