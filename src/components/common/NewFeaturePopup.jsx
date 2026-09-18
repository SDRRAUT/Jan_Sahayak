import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  X, 
  Users, 
  Building2, 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Zap, 
  ShieldCheck, 
  TrendingUp,
  MapPin,
  Clock,
  HeartHandshake
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NewFeaturePopup() {
  const { user, token } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);

  useEffect(() => {
    // Only schedule popup when user is logged in
    if (!token && !user) return;

    // Check if user already saw the popup in this session
    try {
      const hasSeen = sessionStorage.getItem('jansahayak_workforce_popup_shown');
      if (hasSeen === 'true') return;
    } catch (e) {}

    // Wait 1 minute (60,000ms) after login before displaying popup
    showTimerRef.current = setTimeout(() => {
      setIsOpen(true);
      setCountdown(5);

      try {
        sessionStorage.setItem('jansahayak_workforce_popup_shown', 'true');
      } catch (e) {}

      // Countdown ticker every 1s
      let timeLeft = 5;
      countdownIntervalRef.current = setInterval(() => {
        timeLeft -= 1;
        setCountdown(Math.max(0, timeLeft));
        if (timeLeft <= 0) {
          clearInterval(countdownIntervalRef.current);
        }
      }, 1000);

      // Automatically hide after exactly 5 seconds (5000ms)
      hideTimerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 5000);

    }, 60000); // 1 minute delay

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [user, token]);

  const handleClose = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '560px',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '24px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05)',
        overflow: 'hidden',
        fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Top Gradient Banner */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              flexShrink: 0
            }}>
              <HeartHandshake size={22} />
            </div>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>
                <Sparkles size={12} />
                <span>UPCOMING FEATURE PREVIEW</span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>
                JanSahayak Civic Workforce
              </h2>
              <p style={{ fontSize: '12.5px', color: '#E0F2FE', margin: '2px 0 0 0' }}>
                Connecting Local Workers with Civic Government Tasks
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '22px 24px' }}>
          {/* Concept Callout */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: '#F0F9FF',
            border: '1.5px solid #BAE6FD',
            marginBottom: '18px'
          }}>
            <p style={{ fontSize: '13.5px', color: '#0369A1', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
              Similar to how ride platforms connect passengers with nearby drivers, <strong>JanSahayak</strong> will connect municipal departments with <strong>verified local workers & tradespeople</strong> available to resolve civic grievances.
            </p>
          </div>

          {/* 3-Way Mutual Benefit Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            {/* For Workers */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 14px',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#ECFDF5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Briefcase size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '2px' }}>
                  For Local Workers & Skilled Trades:
                </strong>
                <span style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45, display: 'block' }}>
                  Get legitimate government project opportunities, guaranteed direct DBT payouts, and verified experience badges.
                </span>
              </div>
            </div>

            {/* For Government */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 14px',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#EFF6FF',
                color: '#2563EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Building2 size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '2px' }}>
                  For Government & Civic Officers:
                </strong>
                <span style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45, display: 'block' }}>
                  Instant access to verified local manpower for drainage repairs, road patch-ups, and waste clearance — beating SLA targets faster.
                </span>
              </div>
            </div>

            {/* For Citizens */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '12px 14px',
              background: '#FFFFFF',
              border: '1.5px solid #E2E8F0',
              borderRadius: '14px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#F5F3FF',
                color: '#7C3AED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <Users size={16} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '2px' }}>
                  For Citizens & Neighborhoods:
                </strong>
                <span style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45, display: 'block' }}>
                  Complaints get fixed in hours instead of weeks, with local neighbors empowered to build better communities.
                </span>
              </div>
            </div>
          </div>

          {/* Action Footer & 5s Auto-Dismiss Progress Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid #E2E8F0',
            flexWrap: 'wrap'
          }}>
            {/* Countdown Badge & Live Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '11.5px',
                fontWeight: 700,
                color: '#0284C7',
                background: '#E0F2FE',
                padding: '3px 10px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <Clock size={12} />
                <span>Auto-closing in {countdown}s</span>
              </span>
              <div style={{
                width: '60px',
                height: '4px',
                background: '#E2E8F0',
                borderRadius: '999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(countdown / 5) * 100}%`,
                  height: '100%',
                  background: '#0284C7',
                  borderRadius: '999px',
                  transition: 'width 1s linear'
                }} />
              </div>
            </div>

            <button
              onClick={handleClose}
              style={{
                padding: '9px 20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>Explore Platform</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
