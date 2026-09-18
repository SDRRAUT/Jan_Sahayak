import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Volume2, Shield, CheckCircle2 } from 'lucide-react';

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
      background: 'linear-gradient(145deg, #070B14 0%, #0F172A 45%, #0B192C 100%)',
      color: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Ambient background glow orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '380px',
        height: '380px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '20%',
        width: '420px',
        height: '420px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(0,0,0,0) 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none'
      }} />

      {/* Main Brand Card */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '540px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* National / Trust Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(12px)',
          fontSize: '12px',
          fontWeight: 600,
          color: '#E2E8F0',
          marginBottom: '28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          animation: 'fadeIn 0.8s ease'
        }}>
          <span style={{ fontSize: '14px' }}>🇮🇳</span>
          <span>Digital India Civic Intelligence Platform</span>
        </div>

        {/* Logo Container with Smooth Reveal & Backlight */}
        <div style={{
          position: 'relative',
          marginBottom: '24px',
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
            opacity: 0.6,
            animation: 'spin 10s linear infinite'
          }} />

          {/* Logo Card with Glassmorphism */}
          <div style={{
            position: 'relative',
            width: '120px',
            height: '120px',
            borderRadius: '28px',
            background: 'rgba(255, 255, 255, 0.96)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(255, 255, 255, 0.5)',
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
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))'
              }}
            />
          </div>
        </div>

        {/* Platform Title & Slogan */}
        <h1 style={{
          fontSize: '36px',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: '0 0 6px 0',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          JanSahayak
        </h1>
        <p style={{
          fontSize: '15px',
          fontWeight: 500,
          color: '#38BDF8',
          margin: '0 0 10px 0',
          letterSpacing: '0.02em'
        }}>
          जन सहायक • Aapki Awaaz, Ab Samjhi Jayegi
        </p>
        <p style={{
          fontSize: '13.5px',
          color: '#94A3B8',
          maxWidth: '420px',
          lineHeight: 1.5,
          margin: '0 0 32px 0'
        }}>
          Empowering citizens with AI problem discovery, instant department routing, and verified resolution tracking.
        </p>

        {/* 4-Second Animated Progress Bar */}
        <div style={{ width: '100%', maxWidth: '380px', marginBottom: '28px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            fontWeight: 600,
            color: '#94A3B8',
            marginBottom: '8px'
          }}>
            <span>{getStatusText()}</span>
            <span style={{ color: isReady ? '#10B981' : '#38BDF8' }}>
              {isReady ? '100%' : `${Math.round(progress)}%`}
            </span>
          </div>

          <div style={{
            height: '6px',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.12)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 50%, #6366F1 100%)',
              borderRadius: '999px',
              transition: 'width 60ms linear',
              boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)'
            }} />
          </div>
        </div>

        {/* Action Button: Start Experience + Audio */}
        <button
          type="button"
          onClick={onStart}
          style={{
            height: '52px',
            padding: '0 36px',
            borderRadius: '999px',
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            color: '#FFFFFF',
            border: 'none',
            fontSize: '15px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.2)',
            transform: isReady ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 250ms ease',
            letterSpacing: '-0.01em'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = isReady ? 'scale(1.04)' : 'scale(1)'; }}
        >
          <Volume2 style={{ width: '18px', height: '18px' }} />
          <span>Start Platform & Audio Tour</span>
          <ArrowRight style={{ width: '16px', height: '16px' }} />
        </button>

        {/* Subtle helper note */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '16px',
          fontSize: '11.5px',
          color: '#64748B'
        }}>
          <Sparkles style={{ width: '12px', height: '12px', color: '#F59E0B' }} />
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
