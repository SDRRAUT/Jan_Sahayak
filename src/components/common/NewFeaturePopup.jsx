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
  const [isManual, setIsManual] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  
  const showTimerRef = useRef(null);
  const hideTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const countdownRef = useRef(5);

  // Listen for custom event to open announcement popup from profile dropdown or elsewhere
  useEffect(() => {
    const handleOpenAnnouncement = (event) => {
      // Clear any pending automated timers
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

      const manual = event?.detail?.manual ?? true;
      setIsManual(manual);
      setIsOpen(true);

      if (!manual) {
        setCountdown(5);
        countdownRef.current = 5;
        // Automated countdown
        countdownIntervalRef.current = setInterval(() => {
          countdownRef.current -= 1;
          setCountdown(Math.max(0, countdownRef.current));
          if (countdownRef.current <= 0) {
            clearInterval(countdownIntervalRef.current);
            setIsOpen(false);
          }
        }, 1000);
      }
    };

    window.addEventListener('open-jansahayak-announcement', handleOpenAnnouncement);
    return () => {
      window.removeEventListener('open-jansahayak-announcement', handleOpenAnnouncement);
    };
  }, []);

  // Popup schedule:
  //  Show #1  → 30s after login
  //  Show #2  → 30s after show #1 closes  (i.e. 30 + 5 + 30 ≈ 65s)
  //  Show #3+ → every 2 min after each auto-close, forever
  const showCounterRef = useRef(0);
  const repeatTimerRef = useRef(null);

  const showPopupAutomatic = () => {
    setIsManual(false);
    setIsOpen(true);
    setCountdown(5);
    countdownRef.current = 5;

    // Countdown ticker
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    countdownIntervalRef.current = setInterval(() => {
      countdownRef.current -= 1;
      setCountdown(Math.max(0, countdownRef.current));
      if (countdownRef.current <= 0) {
        clearInterval(countdownIntervalRef.current);
        setIsOpen(false);

        // Schedule next appearance
        showCounterRef.current += 1;
        const nextDelay = showCounterRef.current >= 2 ? 120000 : 30000; // 2 min after 2nd show, else 30s
        repeatTimerRef.current = setTimeout(showPopupAutomatic, nextDelay);
      }
    }, 1000);
  };

  useEffect(() => {
    // Only schedule popup when user is logged in
    if (!token && !user) return;

    // First appearance: 30 seconds after login
    showTimerRef.current = setTimeout(() => {
      showCounterRef.current = 1;
      showPopupAutomatic();
    }, 30000);

    return () => {
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token]);

  const handleClose = () => {
    // Stop any active countdown but keep repeat schedule alive
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    setIsOpen(false);

    // If manually closed, still schedule the next auto-show at the appropriate interval
    const nextDelay = showCounterRef.current >= 2 ? 120000 : 30000;
    if (repeatTimerRef.current) clearTimeout(repeatTimerRef.current);
    repeatTimerRef.current = setTimeout(showPopupAutomatic, nextDelay);
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(10px)',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1020px',
        maxHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
        borderRadius: '28px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 30px 80px -20px rgba(15, 23, 42, 0.35), 0 0 0 1px rgba(15, 23, 42, 0.06)',
        overflowY: 'auto',
        overflowX: 'hidden',
        fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Top Header Bar */}
        <div style={{
          padding: '24px 32px 20px 32px',
          background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 60%, #075985 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 400px' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.18)',
              backdropFilter: 'blur(12px)',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
              flexShrink: 0
            }}>
              <HeartHandshake size={28} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#FFFFFF',
                  color: '#0284C7',
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: 800,
                  letterSpacing: '0.03em',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)'
                }}>
                  <Sparkles size={13} style={{ color: '#0284C7' }} />
                  <span>WE ARE ADDING A NEW FEATURE SOON!</span>
                </span>
                <span style={{
                  fontSize: '12px',
                  color: '#BAE6FD',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Zap size={13} style={{ color: '#FDE047' }} />
                  Uber-Model for Civic Repairs
                </span>
              </div>
              <h2 style={{ fontSize: '23px', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', lineHeight: 1.25 }}>
                Connecting Local Workers with Government & Citizens
              </h2>
              <p style={{ fontSize: '13.5px', color: '#E0F2FE', margin: '4px 0 0 0', fontWeight: 500, lineHeight: 1.4 }}>
                A direct marketplace linking municipal teams with verified local tradespeople (plumbers, masons, electricians) to resolve civic issues on demand.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.38)';
              e.currentTarget.style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.transform = 'rotate(0deg)';
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Interactive How It Works Flow Ribbon */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
            border: '1.5px solid #BAE6FD',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#0284C7',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                flexShrink: 0
              }}>
                1
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>Grievance Logged</strong>
                <span style={{ fontSize: '12px', color: '#0369A1' }}>Citizen reports road/drain issue</span>
              </div>
            </div>

            <div style={{ color: '#0284C7', fontWeight: 800, fontSize: '18px', display: 'none', md: 'block' }}>➔</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#059669',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                flexShrink: 0
              }}>
                2
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>Local Squad Mobilized</strong>
                <span style={{ fontSize: '12px', color: '#047857' }}>Nearby tradespeople alerted & routed</span>
              </div>
            </div>

            <div style={{ color: '#0284C7', fontWeight: 800, fontSize: '18px', display: 'none', md: 'block' }}>➔</div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: '#4338CA',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '14px',
                flexShrink: 0
              }}>
                3
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>Rapid Fix & Direct Payout</strong>
                <span style={{ fontSize: '12px', color: '#3730A3' }}>Citizen verified + Instant DBT pay</span>
              </div>
            </div>
          </div>

          {/* Plain Language Explainer Callout */}
          <div style={{
            padding: '14px 18px',
            borderRadius: '16px',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#E0F2FE',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0
            }}>
              💡
            </div>
            <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.55 }}>
              <strong>The Goal:</strong> Just like ride apps connect passengers with nearby drivers, <strong>JanSahayak</strong> will connect municipal departments with <strong>verified local workers</strong> (electricians, plumbers, masons) to fix drainage, road, and civic problems faster, creating legitimate work and transparent payouts for everyone.
            </p>
          </div>

          {/* 3-Column Horizontal Grid for Stakeholders */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '18px'
          }}>
            {/* Card 1: For Workers */}
            <div
              onMouseEnter={() => setHoveredCard('workers')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                padding: '22px 20px',
                background: hoveredCard === 'workers' ? '#F0FDF4' : '#FFFFFF',
                border: hoveredCard === 'workers' ? '2px solid #059669' : '1.5px solid #E2E8F0',
                borderRadius: '20px',
                boxShadow: hoveredCard === 'workers' 
                  ? '0 16px 32px -8px rgba(5, 150, 105, 0.22), 0 4px 12px rgba(0,0,0,0.04)' 
                  : '0 4px 14px rgba(15, 23, 42, 0.04)',
                transform: hoveredCard === 'workers' ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#ECFDF5',
                  border: '1.5px solid #A7F3D0',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(5, 150, 105, 0.12)'
                }}>
                  <Briefcase size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    FOR LOCAL WORKERS
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                    Trades & Workforce
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0', flex: 1 }}>
                Plumbers, electricians, masons, and sanitation workers gain immediate access to paid municipal repair gigs in their own wards.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#065F46', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>Guaranteed Direct DBT Payouts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#065F46', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>Verified Govt Experience Badge</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#065F46', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#059669', flexShrink: 0 }} />
                  <span>Hyperlocal Flexible Availability</span>
                </div>
              </div>
            </div>

            {/* Card 2: For Government */}
            <div
              onMouseEnter={() => setHoveredCard('govt')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                padding: '22px 20px',
                background: hoveredCard === 'govt' ? '#EFF6FF' : '#FFFFFF',
                border: hoveredCard === 'govt' ? '2px solid #2563EB' : '1.5px solid #E2E8F0',
                borderRadius: '20px',
                boxShadow: hoveredCard === 'govt' 
                  ? '0 16px 32px -8px rgba(37, 99, 235, 0.22), 0 4px 12px rgba(0,0,0,0.04)' 
                  : '0 4px 14px rgba(15, 23, 42, 0.04)',
                transform: hoveredCard === 'govt' ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#EFF6FF',
                  border: '1.5px solid #BFDBFE',
                  color: '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.12)'
                }}>
                  <Building2 size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563EB', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    FOR MUNICIPAL GOVT
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                    Officers & Engineers
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0', flex: 1 }}>
                Instantly deploy on-demand local squads for drainage clearance, pothole patching, and streetlight fixes without tendering bottlenecks.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                  <span>Beat 48-Hour SLA Deadlines</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                  <span>Automated GPS & Photo Milestones</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#1E40AF', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#2563EB', flexShrink: 0 }} />
                  <span>Transparent Budget Tracking</span>
                </div>
              </div>
            </div>

            {/* Card 3: For Citizens */}
            <div
              onMouseEnter={() => setHoveredCard('citizens')}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                padding: '22px 20px',
                background: hoveredCard === 'citizens' ? '#F5F3FF' : '#FFFFFF',
                border: hoveredCard === 'citizens' ? '2px solid #7C3AED' : '1.5px solid #E2E8F0',
                borderRadius: '20px',
                boxShadow: hoveredCard === 'citizens' 
                  ? '0 16px 32px -8px rgba(124, 58, 237, 0.22), 0 4px 12px rgba(0,0,0,0.04)' 
                  : '0 4px 14px rgba(15, 23, 42, 0.04)',
                transform: hoveredCard === 'citizens' ? 'translateY(-4px)' : 'translateY(0)',
                transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'default'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: '#F5F3FF',
                  border: '1.5px solid #DDD6FE',
                  color: '#7C3AED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 10px rgba(124, 58, 237, 0.12)'
                }}>
                  <Users size={22} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#7C3AED', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    FOR CITIZENS
                  </span>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: '2px 0 0 0' }}>
                    Residents & Wards
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '12.5px', color: '#475569', lineHeight: 1.5, margin: '0 0 14px 0', flex: 1 }}>
                Complaints get resolved in hours instead of weeks, with local community members empowered to fix neighborhood issues together.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#5B21B6', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#7C3AED', flexShrink: 0 }} />
                  <span>4x Faster Problem Resolution</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#5B21B6', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#7C3AED', flexShrink: 0 }} />
                  <span>Live Field Worker Status Tracking</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#5B21B6', fontWeight: 600 }}>
                  <CheckCircle2 size={15} style={{ color: '#7C3AED', flexShrink: 0 }} />
                  <span>Citizen Review & Rating System</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer & Countdown Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            paddingTop: '18px',
            borderTop: '1.5px solid #E2E8F0',
            flexWrap: 'wrap'
          }}>
            {/* Left Status or Countdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {!isManual ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0284C7',
                    background: '#E0F2FE',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={13} />
                    <span>Auto-closing in {countdown}s</span>
                  </span>
                  <div style={{
                    width: '80px',
                    height: '5px',
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
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#059669',
                    background: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    padding: '5px 12px',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Sparkles size={13} />
                    <span>JanSahayak Civic Workforce • Q4 Roadmap</span>
                  </span>
                </div>
              )}
            </div>

            {/* Right Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleClose}
                style={{
                  padding: '10px 22px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '13.5px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(2, 132, 199, 0.45)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(2, 132, 199, 0.35)';
                }}
              >
                <span>Explore Platform</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
