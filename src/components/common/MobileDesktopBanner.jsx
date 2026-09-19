import React, { useState, useEffect } from 'react';
import { Monitor, ChevronRight, X } from 'lucide-react';

/**
 * MobileDesktopBanner
 * Full-screen overlay on mobile viewports (< 768px) — fits any phone screen.
 */
export default function MobileDesktopBanner() {
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
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
        background: 'linear-gradient(160deg, #0F172A 0%, #1E293B 55%, #0C1A33 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 20px',
        textAlign: 'center',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
        overflowY: 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* Dismiss X */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        style={{
          position: 'absolute',
          top: '14px',
          right: '14px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#94A3B8',
          flexShrink: 0,
        }}
        title="Continue on mobile anyway"
      >
        <X size={14} />
      </button>

      {/* Icon */}
      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          boxShadow: '0 0 28px rgba(37,99,235,0.45)',
          flexShrink: 0,
        }}
      >
        <Monitor size={30} color="#FFFFFF" />
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: '20px',
          fontWeight: 800,
          color: '#F1F5F9',
          marginBottom: '8px',
          lineHeight: 1.2,
          letterSpacing: '-0.02em',
        }}
      >
        Best Viewed on Desktop
      </h1>

      {/* Sub-text */}
      <p
        style={{
          fontSize: '13px',
          color: '#94A3B8',
          lineHeight: 1.55,
          maxWidth: '300px',
          marginBottom: '18px',
        }}
      >
        Enable{' '}
        <strong style={{ color: '#CBD5E1' }}>Desktop Mode</strong>{' '}
        in your browser for the full JanSahayak experience.
      </p>

      {/* Steps card */}
      <div
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: '14px',
          padding: '14px 18px',
          width: '100%',
          maxWidth: '320px',
          textAlign: 'left',
          marginBottom: '18px',
          boxSizing: 'border-box',
        }}
      >
        <p
          style={{
            fontSize: '10px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748B',
            marginBottom: '12px',
          }}
        >
          How to switch
        </p>

        {[
          { step: '1', text: 'Tap the ⋮ or ⋯ menu in your browser' },
          { step: '2', text: 'Select "Desktop Site" or "Request Desktop Site"' },
          { step: '3', text: 'Page reloads in full desktop view' },
        ].map(({ step, text }) => (
          <div
            key={step}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                minWidth: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #2563EB, #1D4ED8)',
                color: '#FFF',
                fontSize: '10px',
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
            <span style={{ fontSize: '12.5px', color: '#CBD5E1', lineHeight: 1.45 }}>
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Continue anyway */}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#475569',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '3px',
          textDecoration: 'underline',
          textUnderlineOffset: '3px',
          padding: 0,
          marginBottom: '32px',
        }}
      >
        <span>Continue on mobile anyway</span>
        <ChevronRight size={12} />
      </button>

      {/* Branding */}
      <p
        style={{
          position: 'absolute',
          bottom: '12px',
          fontSize: '10px',
          color: '#1E293B',
          fontWeight: 700,
          letterSpacing: '0.05em',
          userSelect: 'none',
        }}
      >
        JANSAHAYAK · Civic Intelligence Platform
      </p>
    </div>
  );
}
