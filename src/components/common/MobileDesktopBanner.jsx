import React, { useState, useEffect } from 'react';
import { Monitor, ChevronRight, X } from 'lucide-react';

/**
 * MobileDesktopBanner
 * Shows a full-screen overlay on mobile viewports (< 768px) asking the
 * user to switch to Desktop Mode for the best experience.
 * Dismissed banner is remembered per session; reappears on next visit.
 */
export default function MobileDesktopBanner() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => {
      setIsMobile(window.innerWidth < 768);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!isMobile || dismissed) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 50%, #0C1A33 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      {/* Dismiss (continue anyway) */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#94A3B8',
        }}
        title="Continue on mobile anyway"
      >
        <X size={16} />
      </button>

      {/* Logo / Icon */}
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '22px',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px',
          boxShadow: '0 0 40px rgba(37,99,235,0.4)',
        }}
      >
        <Monitor size={40} color="#FFFFFF" />
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 800,
          color: '#F1F5F9',
          marginBottom: '12px',
          lineHeight: 1.25,
          letterSpacing: '-0.02em',
        }}
      >
        Best Viewed on Desktop
      </h1>

      {/* Sub-text */}
      <p
        style={{
          fontSize: '15px',
          color: '#94A3B8',
          lineHeight: 1.6,
          maxWidth: '320px',
          marginBottom: '32px',
        }}
      >
        JanSahayak is a rich civic platform built for desktop screens. Please
        enable <strong style={{ color: '#CBD5E1' }}>Desktop Mode</strong> in
        your browser for the full experience.
      </p>

      {/* Step-by-step instructions */}
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '16px',
          padding: '20px 24px',
          maxWidth: '340px',
          width: '100%',
          textAlign: 'left',
          marginBottom: '28px',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748B',
            marginBottom: '14px',
          }}
        >
          How to enable Desktop Mode
        </p>

        {[
          { step: '1', text: 'Tap the ⋮ or ⋯ menu in your browser' },
          { step: '2', text: 'Select "Desktop Site" or "Request Desktop Site"' },
          { step: '3', text: 'The page will reload in full desktop view' },
        ].map(({ step, text }) => (
          <div
            key={step}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <span
              style={{
                minWidth: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '1px',
              }}
            >
              {step}
            </span>
            <span style={{ fontSize: '13.5px', color: '#CBD5E1', lineHeight: 1.45 }}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Continue anyway link */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#475569',
          fontSize: '12.5px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          padding: 0,
        }}
      >
        <span>Continue on mobile anyway</span>
        <ChevronRight size={13} />
      </button>

      {/* Branding watermark */}
      <p
        style={{
          position: 'absolute',
          bottom: '20px',
          fontSize: '11px',
          color: '#334155',
          fontWeight: 600,
          letterSpacing: '0.04em',
        }}
      >
        JANSAHAYAK · Civic Intelligence Platform
      </p>
    </div>
  );
}
