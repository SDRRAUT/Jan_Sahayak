import React, { useState } from 'react';
import { Layers, MapPin, Eye, Clock, ShieldCheck, ChevronRight, Activity } from 'lucide-react';

export default function ProblemSpreadMap({ incident, spreadGeo = [] }) {
  const [activeLayer, setActiveLayer] = useState('spread'); // 'signals' | 'cluster' | 'spread' | 'hotspot'
  const [selectedDay, setSelectedDay] = useState(2); // 0 = Day 1, 1 = Day 3, 2 = Day 5

  const dataPoints = spreadGeo.length > 0 ? spreadGeo : [
    { step: "Day 1 (Sep 12)", ward: "Ward 12 (Origin)", lat: 28.7160, lng: 77.1230, radiusMeters: 140, signalCount: 2, label: "Initial weak signal at pipeline valve pit", color: "#10B981" },
    { step: "Day 3 (Sep 14)", ward: "Ward 12 & Ward 14 (Pocket 1)", lat: 28.7175, lng: 77.1248, radiusMeters: 420, signalCount: 18, label: "Subsurface spread to Pocket 1 residential loop", color: "#F59E0B" },
    { step: "Day 5 (Sep 16-17)", ward: "Ward 12, 13 & 14 (Arterial Corridor)", lat: 28.7190, lng: 77.1270, radiusMeters: 920, signalCount: 37, label: "Full corridor impact: drinking water + road dip + drain backflow", color: "#EF4444" }
  ];

  const currentPoint = dataPoints[selectedDay] || dataPoints[dataPoints.length - 1];

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-subtle)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Top Header & Layer Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', display: 'block' }}>
            Geographic Intelligence Engine
          </span>
          <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
            Problem Spread & Corridor Progression Map
          </h3>
        </div>

        {/* Layer Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F1F5F9', padding: '3px', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => setActiveLayer('spread')}
            style={{
              fontSize: '11px',
              fontWeight: activeLayer === 'spread' ? 700 : 500,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: activeLayer === 'spread' ? '#FFFFFF' : 'transparent',
              color: activeLayer === 'spread' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeLayer === 'spread' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Temporal Spread
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('signals')}
            style={{
              fontSize: '11px',
              fontWeight: activeLayer === 'signals' ? 700 : 500,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: activeLayer === 'signals' ? '#FFFFFF' : 'transparent',
              color: activeLayer === 'signals' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeLayer === 'signals' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Citizen Signals
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('cluster')}
            style={{
              fontSize: '11px',
              fontWeight: activeLayer === 'cluster' ? 700 : 500,
              padding: '4px 10px',
              borderRadius: 'var(--radius-sm)',
              background: activeLayer === 'cluster' ? '#FFFFFF' : 'transparent',
              color: activeLayer === 'cluster' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeLayer === 'cluster' ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            Cluster Boundary
          </button>
        </div>
      </div>

      {/* Interactive Time Progression Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <Clock style={{ width: '14px', height: '14px', color: 'var(--color-text-muted)' }} />
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
          Temporal Progression:
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {dataPoints.map((dp, idx) => (
            <button
              key={dp.step}
              type="button"
              onClick={() => setSelectedDay(idx)}
              style={{
                fontSize: '11.5px',
                fontWeight: selectedDay === idx ? 700 : 500,
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: selectedDay === idx ? dp.color : '#F8FAFC',
                color: selectedDay === idx ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: `1px solid ${selectedDay === idx ? dp.color : 'var(--color-border-subtle)'}`,
                transition: 'all 150ms ease'
              }}
            >
              {dp.step.split(' ')[0]} ({dp.signalCount} signals)
            </button>
          ))}
        </div>
      </div>

      {/* Visual Canvas / Map Container */}
      <div style={{
        position: 'relative',
        height: '320px',
        borderRadius: 'var(--radius-md)',
        background: '#0B1914',
        overflow: 'hidden',
        border: '1px solid var(--color-border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Geographic Grid Lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }}>
          <defs>
            <pattern id="civic-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10B981" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#civic-grid)" />

          {/* Road Network Vectors */}
          <path d="M 50 160 Q 240 180 500 130 T 900 190" fill="none" stroke="#64748B" strokeWidth="6" strokeLinecap="round" />
          <path d="M 300 40 L 320 280" fill="none" stroke="#64748B" strokeWidth="4" />
          <path d="M 580 40 Q 560 180 580 280" fill="none" stroke="#64748B" strokeWidth="4" />

          {/* Subsoil Pipeline Corridor */}
          <path d="M 220 160 L 650 170" fill="none" stroke="#0284C7" strokeWidth="3" strokeDasharray="6,4" />

          {/* Ward Boundaries */}
          <text x="80" y="70" fill="#475569" fontSize="11" fontWeight="700">WARD 12 (PITAMPURA)</text>
          <text x="360" y="70" fill="#475569" fontSize="11" fontWeight="700">WARD 14 (ROHINI SEC 14)</text>
          <text x="680" y="70" fill="#475569" fontSize="11" fontWeight="700">WARD 13 (SECTOR 13)</text>
        </svg>

        {/* Dynamic Spread Circles */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Signal Origin Pin */}
          <div style={{
            position: 'absolute',
            top: '48%',
            left: '30%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div style={{
              width: selectedDay >= 0 ? '60px' : '30px',
              height: selectedDay >= 0 ? '60px' : '30px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1.5px solid #10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse 2s infinite'
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <span style={{ fontSize: '10px', color: '#A7F3D0', fontWeight: 700, marginTop: '4px', textShadow: '0 1px 2px #000' }}>
              Day 1 Origin
            </span>
          </div>

          {/* Day 3 Spread Circle */}
          {selectedDay >= 1 && (
            <div style={{
              position: 'absolute',
              top: '52%',
              left: '46%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: selectedDay >= 1 ? '140px' : '40px',
                height: selectedDay >= 1 ? '140px' : '40px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.18)',
                border: '1.5px dashed #F59E0B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#FDE68A', fontWeight: 700, marginTop: '4px', textShadow: '0 1px 2px #000' }}>
                Day 3: Pocket 1 Spread
              </span>
            </div>
          )}

          {/* Day 5 Critical Corridor Circle */}
          {selectedDay >= 2 && (
            <div style={{
              position: 'absolute',
              top: '54%',
              left: '60%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <div style={{
                width: '230px',
                height: '190px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.22)',
                border: '2px solid #EF4444',
                boxShadow: '0 0 25px rgba(239, 68, 68, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: '#EF4444' }} />
              </div>
              <span style={{ fontSize: '10px', color: '#FECACA', fontWeight: 700, marginTop: '4px', textShadow: '0 1px 2px #000' }}>
                Day 5: Multi-Ward Corridor Impact
              </span>
            </div>
          )}
        </div>

        {/* Live Legend Overlay */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(11, 25, 20, 0.88)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 12px',
          color: '#FFFFFF'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 700, marginBottom: '4px', color: '#E2E8F0' }}>
            Active Viewport: {currentPoint.ward}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: '#94A3B8' }}>
            <span>Radius: <strong>{currentPoint.radiusMeters}m</strong></span>
            <span>•</span>
            <span>Signals: <strong>{currentPoint.signalCount}</strong></span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Footer */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '11.5px',
        color: 'var(--color-text-muted)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
          <span><strong>Privacy Protected:</strong> Coordinates aggregated at 100m corridor resolution to safeguard citizen privacy.</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)' }}>
          Lat: {currentPoint.lat.toFixed(4)}, Lng: {currentPoint.lng.toFixed(4)}
        </span>
      </div>
    </div>
  );
}
