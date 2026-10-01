import React, { useState } from 'react';
import { Radio, Volume2, VolumeX, X, Zap } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function JanSuchnaBanner({ citizenWard = 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)' }) {
  const { janSuchnaList = [] } = useApp();
  const [dismissedIds, setDismissedIds] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);

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
        const text = `जन सूचना अलर्ट. ${current.title}. अवधि: ${current.duration}. ${current.instructions}. हेल्पलाइन: ${current.helpline}`;
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
      marginBottom: '16px',
      borderRadius: '12px',
      background: '#1E1B4B',
      border: '1px solid #3730A3',
      overflow: 'hidden'
    }}>
      {/* Top strip */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(99, 102, 241, 0.15)',
        borderBottom: '1px solid rgba(99,102,241,0.2)'
      }}>
        <Radio style={{ width: '12px', height: '12px', color: '#F59E0B' }} />
        <span style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.08em', color: '#F59E0B', textTransform: 'uppercase' }}>
          जन सूचना (Jan Suchna)
        </span>
        <span style={{ fontSize: '10px', color: '#818CF8', marginLeft: 'auto' }}>
          {current.ward}
        </span>
        <span style={{
          fontSize: '10px', fontWeight: 700,
          background: 'rgba(239,68,68,0.2)',
          color: '#FCA5A5',
          border: '1px solid rgba(239,68,68,0.3)',
          padding: '1px 7px', borderRadius: '999px'
        }}>
          {current.duration}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '12px 16px' }}>
        {/* Title row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <p style={{ margin: '0 0 4px 0', fontSize: '13.5px', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.3 }}>
              <Zap style={{ width: '13px', height: '13px', color: '#F59E0B', display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
              {current.title}
            </p>
            <p style={{ margin: 0, fontSize: '12px', color: '#A5B4FC', lineHeight: 1.4 }}>
              {current.instructions}
            </p>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <button
              type="button"
              onClick={handleSpeak}
              title={isSpeaking ? 'Stop audio' : 'Audio guide (Hindi)'}
              style={{
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: isSpeaking ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: isSpeaking ? '#34D399' : '#A5B4FC',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              {isSpeaking
                ? <VolumeX style={{ width: '13px', height: '13px' }} />
                : <Volume2 style={{ width: '13px', height: '13px' }} />}
            </button>
            <button
              type="button"
              onClick={() => setDismissedIds(prev => [...prev, current.id])}
              aria-label="Dismiss"
              style={{
                width: '30px', height: '30px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#94A3B8',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <X style={{ width: '13px', height: '13px' }} />
            </button>
          </div>
        </div>

        {/* Footer meta */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '11px', color: '#6366F1' }}>
          <span style={{ color: '#818CF8' }}>{current.startTime} · {current.duration}</span>
          <span style={{ color: '#6366F1' }}>{current.department}</span>
          <span style={{ color: '#F59E0B', fontWeight: 700 }}>📞 {current.helpline}</span>
        </div>
      </div>
    </div>
  );
}
