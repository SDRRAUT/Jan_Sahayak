import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Volume2, Shield, CheckCircle2 } from 'lucide-react';
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
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: '#0F172A',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Crisp background image with dark vignette overlay for 100% text readability */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.82) 0%, rgba(15, 23, 42, 0.92) 100%), url(${onboardingBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.90,
          zIndex: 1,
          pointerEvents: 'none'
        }} 
      />

      {/* Ambient background glow orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(50px)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* Main Brand Glass Card for High-Contrast Readable Text */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '560px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        backdropFilter: 'blur(24px)',
        borderRadius: '28px',
        padding: '36px 32px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.12)'
      }}>
        {/* National / Trust Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(12px)',
          fontSize: '12.5px',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          animation: 'fadeIn 0.8s ease'
        }}>
          <span style={{ fontSize: '15px' }}>🇮🇳</span>
          <span>Digital India Civic Intelligence Platform</span>
        </div>

        {/* Logo Container with Smooth Reveal & Backlight */}
        <div style={{
          position: 'relative',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Logo Glow Ring */}
          <div style={{
            position: 'absolute',
            inset: '-16px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #10B981, #3B82F6, #F59E0B, #10B981)',
            filter: 'blur(20px)',
            opacity: 0.75,
            animation: 'spin 10s linear infinite'
          }} />

          {/* Logo Card with Glassmorphism */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '28px',
            background: 'rgba(255, 255, 255, 0.98)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px',
            transform: 'scale(1)',
            transition: 'transform 0.4s ease'
          }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak Logo" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
              }}
            />
          </div>
        </div>

        {/* Platform Title & Slogan */}
        <h1 style={{
          fontSize: '38px',
          fontWeight: 900,
          letterSpacing: '-0.03em',
          margin: '0 0 6px 0',
          color: '#FFFFFF',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
        }}>
          JanSahayak
        </h1>
        <p style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#38BDF8',
          margin: '0 0 12px 0',
          letterSpacing: '0.02em',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
        }}>
          जन सहायक • Aapki Awaaz, Ab Samjhi Jayegi
        </p>
        <p style={{
          fontSize: '15px',
          color: '#F1F5F9',
          fontWeight: 500,
          maxWidth: '460px',
          lineHeight: 1.55,
          margin: '0 0 28px 0',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)'
        }}>
          Empowering citizens with AI problem discovery, instant department routing, and verified resolution tracking.
        </p>

        {/* 4-Second Animated Progress Bar */}
        <div style={{ width: '100%', maxWidth: '420px', marginBottom: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12.5px',
            fontWeight: 700,
            color: '#F8FAFC',
            marginBottom: '8px',
            textShadow: '0 1px 4px rgba(0,0,0,0.6)'
          }}>
            <span>{getStatusText()}</span>
            <span style={{ color: isReady ? '#34D399' : '#38BDF8', fontWeight: 800, fontSize: '13.5px' }}>
              {isReady ? '100%' : `${Math.round(progress)}%`}
            </span>
          </div>

          <div style={{
            height: '8px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.18)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 50%, #6366F1 100%)',
              borderRadius: '999px',
              transition: 'width 60ms linear',
              boxShadow: '0 0 16px rgba(59, 130, 246, 0.8)'
            }} />
          </div>
        </div>

        {/* Action Button: Start Experience + Audio */}
        <button
          type="button"
          onClick={onStart}
          style={{
            height: '54px',
            padding: '0 38px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '16px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 12px 36px rgba(16, 185, 129, 0.55), 0 0 0 2px rgba(255, 255, 255, 0.3)',
            transform: isReady ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 250ms ease',
            letterSpacing: '-0.01em'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = isReady ? 'scale(1.04)' : 'scale(1)'; }}
        >
          <Volume2 style={{ width: '20px', height: '20px' }} />
          <span>Start Platform & Audio Tour</span>
          <ArrowRight style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Subtle helper note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '18px',
          fontSize: '12.5px',
          fontWeight: 600,
          color: '#E2E8F0',
          textShadow: '0 1px 4px rgba(0,0,0,0.6)'
        }}>
          <Sparkles style={{ width: '14px', height: '14px', color: '#F59E0B' }} />
          <span>Audio narration in Hindi/English will guide your tour</span>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
