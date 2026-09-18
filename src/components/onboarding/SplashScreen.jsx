import React, { useState, useEffect } from 'react';
import { Volume2, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export default function SplashScreen({ onStart }) {
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const durationMs = 3600;
    const intervalMs = 36;
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

    return () => clearInterval(timer);
  }, []);

  const getStatusText = () => {
    if (progress < 30) return 'Connecting Municipal AI Engine...';
    if (progress < 70) return 'Mapping Multi-Department DNA & GIS Nodes...';
    if (progress < 95) return 'Calibrating Multilingual Voice Triage...';
    return 'Civic Network Ready';
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      backgroundColor: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Soft Ethereal Atmospheric Background Glows matching reference design */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '-15%',
          right: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(147, 197, 253, 0.45) 0%, rgba(199, 210, 254, 0.25) 40%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none'
        }}
      />
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-15%',
          left: '-10%',
          width: '650px',
          height: '650px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(196, 181, 253, 0.40) 0%, rgba(221, 214, 254, 0.20) 45%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '30%',
          left: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167, 243, 208, 0.35) 0%, rgba(255, 255, 255, 0) 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Interactive Stage Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1040px',
        minHeight: '520px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 2
      }}>

        {/* SVG Network Circuit Lines branching from Title Box to Floating Integration Nodes */}
        <svg 
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible'
          }}
          viewBox="0 0 1000 500"
          fill="none"
        >
          {/* Left Branch Circuit Lines */}
          <path d="M 330 220 L 240 220 L 170 150 L 150 150" stroke="#E2E8F0" strokeWidth="1.6" strokeDasharray="3 3" />
          <path d="M 330 235 L 280 235 L 230 195 L 200 195" stroke="#CBD5E1" strokeWidth="1.8" />
          <path d="M 330 250 L 250 250 L 190 290 L 170 290" stroke="#CBD5E1" strokeWidth="1.8" />
          <path d="M 330 265 L 240 265 L 180 345 L 150 345" stroke="#E2E8F0" strokeWidth="1.6" strokeDasharray="3 3" />

          {/* Right Branch Circuit Lines */}
          <path d="M 670 220 L 760 220 L 830 145 L 850 145" stroke="#E2E8F0" strokeWidth="1.6" strokeDasharray="3 3" />
          <path d="M 670 235 L 720 235 L 775 190 L 805 190" stroke="#CBD5E1" strokeWidth="1.8" />
          <path d="M 670 250 L 730 250 L 785 285 L 815 285" stroke="#CBD5E1" strokeWidth="1.8" />
          <path d="M 670 265 L 755 265 L 825 340 L 850 340" stroke="#E2E8F0" strokeWidth="1.6" strokeDasharray="3 3" />

          {/* Circuit connection dots */}
          <circle cx="330" cy="220" r="3" fill="#94A3B8" />
          <circle cx="330" cy="235" r="3" fill="#10B981" />
          <circle cx="330" cy="250" r="3" fill="#3B82F6" />
          <circle cx="330" cy="265" r="3" fill="#94A3B8" />

          <circle cx="670" cy="220" r="3" fill="#94A3B8" />
          <circle cx="670" cy="235" r="3" fill="#F59E0B" />
          <circle cx="670" cy="250" r="3" fill="#6366F1" />
          <circle cx="670" cy="265" r="3" fill="#94A3B8" />
        </svg>

        {/* Floating Integration Node Pills (Left Side — Municipal Authorities) */}
        {/* Node L1: DJB */}
        <div style={{
          position: 'absolute',
          left: '10%',
          top: '23%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 4s ease-in-out infinite'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            💧
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>DJB Water</span>
        </div>

        {/* Node L2: PWD */}
        <div style={{
          position: 'absolute',
          left: '16%',
          top: '35%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 4.5s ease-in-out infinite 0.5s'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#F0FDF4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            🛣️
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>PWD Roads</span>
        </div>

        {/* Node L3: MCD */}
        <div style={{
          position: 'absolute',
          left: '13%',
          top: '55%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 4.2s ease-in-out infinite 1s'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#FEF3C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            ♻️
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>MCD Waste</span>
        </div>

        {/* Node L4: BSES */}
        <div style={{
          position: 'absolute',
          left: '10%',
          top: '68%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 5s ease-in-out infinite 1.5s'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#FEF2F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            ⚡
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>BSES Power</span>
        </div>

        {/* Floating Integration Node Pills (Right Side — Intelligence & AI Capabilities) */}
        {/* Node R1: Gemini 9-Agent */}
        <div style={{
          position: 'absolute',
          right: '9%',
          top: '22%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 4.3s ease-in-out infinite 0.2s'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#F5F3FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            🤖
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>Gemini DNA</span>
        </div>

        {/* Node R2: Indic Voice */}
        <div style={{
          position: 'absolute',
          right: '15%',
          top: '34%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 4.6s ease-in-out infinite 0.7s'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#FDF2F8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            🎙️
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>Indic Voice</span>
        </div>

        {/* Node R3: Real GIS Satellite */}
        <div style={{
          position: 'absolute',
          right: '13%',
          top: '54%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 4.8s ease-in-out infinite 1.2s'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#ECFEFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            🛰️
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>Satellite GIS</span>
        </div>

        {/* Node R4: Verified Resolution */}
        <div style={{
          position: 'absolute',
          right: '9%',
          top: '67%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 12px 6px 8px',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '999px',
          boxShadow: '0 8px 22px rgba(15, 23, 42, 0.07)',
          animation: 'floatSlow 5.2s ease-in-out infinite 1.6s'
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px'
          }}>
            🛡️
          </div>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1E293B' }}>Verified Fix</span>
        </div>

        {/* Central Card Hierarchy — Refined typography matching the reference design */}
        <div style={{
          position: 'relative',
          zIndex: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '560px',
          fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        }}>

          {/* Elegant Micro-Tag: { civic intelligence network } (Minimal, No bubble background) */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '12.5px',
            fontWeight: 500,
            color: '#7C3AED',
            letterSpacing: '0.01em',
            marginBottom: '14px'
          }}>
            {'{ civic intelligence network }'}
          </div>

          {/* Central Pill Title Box with Refined Geometric Typography */}
          <div style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 28px 10px 20px',
            background: '#FFFFFF',
            border: '1px solid #E5E7EB',
            borderRadius: '999px',
            boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(243, 244, 246, 0.8)',
            marginBottom: '16px'
          }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak" 
              style={{
                width: '30px',
                height: '30px',
                objectFit: 'contain'
              }}
            />
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: '32px',
              fontWeight: 700,
              letterSpacing: '-0.025em',
              color: '#111827',
              margin: 0,
              lineHeight: 1.1
            }}>
              JanSahayak
            </h1>
          </div>

          {/* Hindi Slogan in Refined Typography */}
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            color: '#059669',
            marginBottom: '14px',
            letterSpacing: '-0.01em'
          }}>
            जन सहायक • Aapki Awaaz, Ab Samjhi Jayegi
          </div>

          {/* Clean Subtitle Paragraph matching reference typography */}
          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '14px',
            lineHeight: 1.65,
            color: '#64748B',
            maxWidth: '480px',
            margin: '0 0 24px 0',
            fontWeight: 400
          }}>
            Simplify and streamline public grievance resolution with AI-native problem discovery, 
            instant multi-department routing, and verified field closure.
          </p>

          {/* Sleek Dark Pill CTA Button matching reference: "Book a demo • 15 minutes →" */}
          <button
            type="button"
            onClick={onStart}
            style={{
              height: '46px',
              padding: '0 26px',
              borderRadius: '999px',
              background: '#0F172A',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(15, 23, 42, 0.25)',
              transition: 'all 200ms ease',
              letterSpacing: '-0.01em'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 14px 30px rgba(15, 23, 42, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 25px rgba(15, 23, 42, 0.25)';
            }}
          >
            <Volume2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
            <span>Start Audio Tour • 2 minutes</span>
            <ArrowRight style={{ width: '15px', height: '15px', color: '#94A3B8' }} />
          </button>

          {/* Subtle Live Status & Animated Pulse Bar */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
            maxWidth: '320px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              fontSize: '11px',
              fontWeight: 600,
              color: '#94A3B8'
            }}>
              <span>{getStatusText()}</span>
              <span style={{ color: isReady ? '#059669' : '#6366F1', fontWeight: 700 }}>
                {isReady ? 'Ready' : `${Math.round(progress)}%`}
              </span>
            </div>

            <div style={{
              width: '100%',
              height: '4px',
              background: '#F1F5F9',
              borderRadius: '999px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #6366F1 0%, #10B981 100%)',
                borderRadius: '999px',
                transition: 'width 60ms linear'
              }} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
