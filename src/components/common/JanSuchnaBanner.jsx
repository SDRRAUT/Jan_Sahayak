import React, { useState } from 'react';
import { 
  Radio, 
  Clock, 
  MapPin, 
  Phone, 
  Volume2, 
  VolumeX, 
  X, 
  AlertCircle, 
  ChevronRight,
  ShieldAlert,
  Zap,
  Droplets
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function JanSuchnaBanner({ citizenWard = 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)' }) {
  const { janSuchnaList = [] } = useApp();
  const [dismissedIds, setDismissedIds] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Filter advisories matching this citizen's ward or citywide
  const activeAdvisories = janSuchnaList.filter(s => {
    if (dismissedIds.includes(s.id)) return false;
    if (s.status !== 'ACTIVE') return false;
    const sWard = (s.ward || '').toLowerCase();
    const cWard = (citizenWard || '').toLowerCase();
    return sWard.includes('all') || sWard.includes('wagholi') || cWard.includes(sWard.split('(')[0].trim());
  });

  if (activeAdvisories.length === 0) return null;

  const current = activeAdvisories[0];

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const text = `जन सूचना अलर्ट. ${current.title}. अवधि: ${current.duration}. कृपया ध्यान दें: ${current.instructions}. हेल्पलाइन: ${current.helpline}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  return (
    <div style={{
      marginBottom: '20px',
      borderRadius: '18px',
      background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
      color: '#FFFFFF',
      padding: '18px 22px',
      boxShadow: '0 8px 24px rgba(49, 46, 129, 0.25)',
      border: '1.5px solid #818CF8',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Element */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(245, 158, 11, 0.12)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', position: 'relative', zIndex: 2 }}>
        
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Top Badge Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              fontWeight: 800,
              background: '#F59E0B',
              color: '#78350F',
              padding: '2px 9px',
              borderRadius: '999px',
              letterSpacing: '0.02em'
            }}>
              <Radio style={{ width: '12px', height: '12px', animation: 'pulse 1.5s infinite' }} />
              📢 जन सूचना (JAN SUCHNA)
            </span>

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(255, 255, 255, 0.15)',
              color: '#FDE68A',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              📍 {current.ward}
            </span>

            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              background: 'rgba(239, 68, 68, 0.25)',
              color: '#FCA5A5',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              ⏱️ {current.duration} Outage
            </span>
          </div>

          {/* Title */}
          <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF', lineHeight: 1.3 }}>
            {current.title}
          </h3>

          {/* Instructions */}
          <p style={{ fontSize: '13px', color: '#E0E7FF', margin: '0 0 10px 0', lineHeight: 1.45, maxWidth: '760px' }}>
            {current.instructions}
          </p>

          {/* Metadata chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', fontSize: '11.5px', color: '#C7D2FE' }}>
            <span>Timing: <strong style={{ color: '#FFFFFF' }}>{current.startTime} ({current.duration})</strong></span>
            <span>•</span>
            <span>Department: <strong style={{ color: '#FFFFFF' }}>{current.department}</strong></span>
            <span>•</span>
            <span>Helpline: <strong style={{ color: '#FDE68A' }}>{current.helpline}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <button
            type="button"
            onClick={handleSpeak}
            style={{
              padding: '7px 14px',
              borderRadius: '999px',
              background: isSpeaking ? '#10B981' : 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {isSpeaking ? <VolumeX style={{ width: '14px', height: '14px' }} /> : <Volume2 style={{ width: '14px', height: '14px' }} />}
            <span>{isSpeaking ? 'Stop Audio' : 'Audio Guide (हिंदी)'}</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissedIds(prev => [...prev, current.id])}
            aria-label="Dismiss Advisory"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

      </div>
    </div>
  );
}
