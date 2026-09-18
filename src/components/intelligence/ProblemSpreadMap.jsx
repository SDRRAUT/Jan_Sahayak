import React, { useState } from 'react';
import { 
  Layers, 
  MapPin, 
  Eye, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Activity, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Compass,
  Radio,
  Sparkles
} from 'lucide-react';

export default function ProblemSpreadMap({ incident, spreadGeo = [] }) {
  const [activeLayer, setActiveLayer] = useState('spread'); // 'spread' | 'signals' | 'cluster'
  const [selectedDay, setSelectedDay] = useState(2); // 0 = Day 1, 1 = Day 3, 2 = Day 5
  const [mapMode, setMapMode] = useState('dark'); // 'dark' | 'satellite'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const dataPoints = spreadGeo.length > 0 ? spreadGeo : [
    { 
      step: "Day 1 (Sep 12)", 
      ward: "Ward 12 (Pitampura Valve Pit)", 
      lat: 28.7160, 
      lng: 77.1230, 
      radiusMeters: 140, 
      signalCount: 2, 
      label: "Origin: Valve pit fracture near Madhuban Chowk", 
      color: "#10B981",
      posX: 28,
      posY: 48
    },
    { 
      step: "Day 3 (Sep 14)", 
      ward: "Ward 14 (Rohini Sec 14 Pocket 1)", 
      lat: 28.7175, 
      lng: 77.1248, 
      radiusMeters: 420, 
      signalCount: 18, 
      label: "Subsurface seep along Dr. K.N. Katju Marg to Pocket 1", 
      color: "#F59E0B",
      posX: 46,
      posY: 51
    },
    { 
      step: "Day 5 (Sep 16-17)", 
      ward: "Corridor: Rohini Sec 14, Pitampura & Sec 13", 
      lat: 28.7190, 
      lng: 77.1270, 
      radiusMeters: 920, 
      signalCount: 37, 
      label: "Critical multi-ward impact across feeder pipeline line", 
      color: "#EF4444",
      posX: 64,
      posY: 53
    }
  ];

  // Specific citizen report signal points along actual streets
  const citizenSignals = [
    { id: 'SIG-1', x: 27, y: 49, title: 'Low pressure & chlorine smell', time: 'Day 1' },
    { id: 'SIG-2', x: 31, y: 46, title: 'Valve pit seeping water', time: 'Day 1' },
    { id: 'SIG-3', x: 44, y: 53, title: 'Road dampness on Katju Marg', time: 'Day 2' },
    { id: 'SIG-4', x: 48, y: 48, title: 'Turbid tap water in Pocket 1', time: 'Day 3' },
    { id: 'SIG-5', x: 50, y: 56, title: 'Drain backflow near community center', time: 'Day 3' },
    { id: 'SIG-6', x: 62, y: 50, title: 'Water puddle on arterial road', time: 'Day 4' },
    { id: 'SIG-7', x: 66, y: 55, title: 'Contaminated supply in school zone', time: 'Day 5' },
    { id: 'SIG-8', x: 68, y: 46, title: 'Road cavity under bus corridor', time: 'Day 5' }
  ];

  const currentPoint = dataPoints[selectedDay] || dataPoints[dataPoints.length - 1];

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(1.6, Math.max(0.9, Number((prev + delta).toFixed(1)))));
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg, 16px)',
      border: '1px solid var(--color-border-subtle, #E2E8F0)',
      padding: '20px',
      boxShadow: 'var(--shadow-card, 0 4px 20px rgba(0,0,0,0.05))',
      fontFamily: 'var(--font-sans, inherit)'
    }}>
      {/* Top Header & Layer Toggles */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              color: '#0E5E3A', 
              letterSpacing: '0.06em',
              background: '#DCFCE7',
              padding: '2px 8px',
              borderRadius: '999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Compass style={{ width: '12px', height: '12px' }} />
              📍 LIVE PROBLEM MAP
            </span>
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-primary, #0F172A)', marginTop: '4px', margin: 0 }}>
            Where The Problem Started & Where It Is Spreading
          </h3>
        </div>

        {/* Map Mode & Layer Switchers */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Basemap Switcher (Real Satellite vs Real Street GIS) */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '3px', 
            background: '#F8FAFC', 
            padding: '3px', 
            borderRadius: '10px',
            border: '1px solid #E2E8F0'
          }}>
            <button
              type="button"
              onClick={() => setMapMode('dark')}
              style={{
                fontSize: '11px',
                fontWeight: mapMode === 'dark' ? 800 : 600,
                padding: '4px 10px',
                borderRadius: '7px',
                background: mapMode === 'dark' ? '#0F172A' : 'transparent',
                color: mapMode === 'dark' ? '#FFFFFF' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 150ms ease'
              }}
            >
              <span>🗺️ Street Map</span>
            </button>
            <button
              type="button"
              onClick={() => setMapMode('satellite')}
              style={{
                fontSize: '11px',
                fontWeight: mapMode === 'satellite' ? 800 : 600,
                padding: '4px 10px',
                borderRadius: '7px',
                background: mapMode === 'satellite' ? '#0F172A' : 'transparent',
                color: mapMode === 'satellite' ? '#FFFFFF' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 150ms ease'
              }}
            >
              <span>🛰️ Satellite View</span>
            </button>
          </div>

          {/* Layer Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
            <button
              type="button"
              onClick={() => setActiveLayer('spread')}
              style={{
                fontSize: '11px',
                fontWeight: activeLayer === 'spread' ? 700 : 500,
                padding: '4px 10px',
                borderRadius: '7px',
                background: activeLayer === 'spread' ? '#FFFFFF' : 'transparent',
                color: activeLayer === 'spread' ? '#0E5E3A' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeLayer === 'spread' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Day-by-Day Spread
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('signals')}
              style={{
                fontSize: '11px',
                fontWeight: activeLayer === 'signals' ? 700 : 500,
                padding: '4px 10px',
                borderRadius: '7px',
                background: activeLayer === 'signals' ? '#FFFFFF' : 'transparent',
                color: activeLayer === 'signals' ? '#0E5E3A' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeLayer === 'signals' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Citizen Complaints
            </button>
            <button
              type="button"
              onClick={() => setActiveLayer('cluster')}
              style={{
                fontSize: '11px',
                fontWeight: activeLayer === 'cluster' ? 700 : 500,
                padding: '4px 10px',
                borderRadius: '7px',
                background: activeLayer === 'cluster' ? '#FFFFFF' : 'transparent',
                color: activeLayer === 'cluster' ? '#0E5E3A' : '#64748B',
                border: 'none',
                cursor: 'pointer',
                boxShadow: activeLayer === 'cluster' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              Affected Area
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Time Progression Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <Clock style={{ width: '14px', height: '14px', color: 'var(--color-text-muted, #64748B)' }} />
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted, #64748B)' }}>
            Timeline:
          </span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {dataPoints.map((dp, idx) => (
              <button
                key={dp.step}
                type="button"
                onClick={() => setSelectedDay(idx)}
                style={{
                  fontSize: '11.5px',
                  fontWeight: selectedDay === idx ? 800 : 600,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  background: selectedDay === idx ? dp.color : '#F8FAFC',
                  color: selectedDay === idx ? '#FFFFFF' : 'var(--color-text-secondary, #475569)',
                  border: `1.5px solid ${selectedDay === idx ? dp.color : '#E2E8F0'}`,
                  cursor: 'pointer',
                  boxShadow: selectedDay === idx ? `0 2px 8px ${dp.color}44` : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                {dp.step.split(' ')[0]} ({dp.signalCount} signals)
              </button>
            ))}
          </div>
        </div>

        {/* Corridor Stage Alert */}
        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          color: currentPoint.color,
          background: `${currentPoint.color}18`,
          border: `1px solid ${currentPoint.color}44`,
          padding: '3px 10px',
          borderRadius: '999px'
        }}>
          ● {currentPoint.label}
        </span>
      </div>

      {/* Visual Canvas / Map Container with REAL MAP IMAGE */}
      <div style={{
        position: 'relative',
        height: '380px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1.5px solid #1E293B',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0B1520'
      }}>
        {/* REAL MAP IMAGE BASEMAP */}
        <div style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          backgroundImage: mapMode === 'satellite' 
            ? 'url("/delhi-gis-map-satellite.jpg")' 
            : 'url("/delhi-gis-map-dark.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), background-image 300ms ease',
          filter: mapMode === 'satellite' ? 'brightness(0.92) contrast(1.08)' : 'brightness(1.02)'
        }} />

        {/* Subtle Dark Vignette & Geographic Mesh Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: mapMode === 'satellite'
            ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.15) 0%, rgba(10,25,35,0.65) 100%)'
            : 'radial-gradient(ellipse at center, rgba(11,21,32,0.1) 0%, rgba(11,21,32,0.55) 100%)',
          pointerEvents: 'none'
        }} />

        {/* Subsoil Pipeline Corridor Vector & Road Corridor Overlay */}
        <svg style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Main Pipeline Corridor Trace */}
          <path 
            d="M 270 190 Q 450 198 650 205" 
            fill="none" 
            stroke="#38BDF8" 
            strokeWidth="3.5" 
            strokeDasharray="8,5" 
            style={{ filter: 'drop-shadow(0 0 6px #0284C7)' }}
          />

          {/* Subterranean Joint Leak Indicator */}
          <circle cx="280" cy="190" r="6" fill="#38BDF8" opacity="0.8" />
          <circle cx="455" cy="198" r="7" fill="#F59E0B" opacity="0.85" />
          <circle cx="645" cy="205" r="9" fill="#EF4444" opacity="0.9" />

          {/* Ward Connection Arcs */}
          {activeLayer === 'cluster' && (
            <polygon 
              points="240,160 480,140 680,170 660,260 430,270 250,240" 
              fill="rgba(239, 68, 68, 0.14)" 
              stroke="#EF4444" 
              strokeWidth="2" 
              strokeDasharray="5,4"
            />
          )}
        </svg>

        {/* Dynamic Spread Intelligence Overlays */}
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          width: '100%', 
          height: '100%',
          transform: `scale(${zoomLevel})`,
          transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* DAY 1 ORIGIN MARKER */}
          <div 
            style={{
              position: 'absolute',
              top: '48%',
              left: '28%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              zIndex: 10
            }}
            onMouseEnter={() => setHoveredPoint(dataPoints[0])}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <div style={{
              width: selectedDay >= 0 ? '64px' : '36px',
              height: selectedDay >= 0 ? '64px' : '36px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.22)',
              border: '2px solid #10B981',
              boxShadow: '0 0 16px rgba(16, 185, 129, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 300ms ease'
            }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: '#10B981',
                border: '2px solid #FFFFFF',
                boxShadow: '0 0 8px #10B981'
              }} />
            </div>
            <div style={{ 
              fontSize: '10px', 
              color: '#FFFFFF', 
              fontWeight: 800, 
              marginTop: '4px', 
              background: 'rgba(5, 150, 105, 0.88)',
              padding: '2px 8px',
              borderRadius: '999px',
              border: '1px solid #34D399',
              boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
              whiteSpace: 'nowrap'
            }}>
              Day 1 Origin (Valve Pit)
            </div>
          </div>

          {/* DAY 3 POCKET 1 SPREAD ZONE */}
          {selectedDay >= 1 && (
            <div 
              style={{
                position: 'absolute',
                top: '51%',
                left: '46%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 9
              }}
              onMouseEnter={() => setHoveredPoint(dataPoints[1])}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <div style={{
                width: selectedDay >= 1 ? '150px' : '50px',
                height: selectedDay >= 1 ? '150px' : '50px',
                borderRadius: '50%',
                background: 'rgba(245, 158, 11, 0.22)',
                border: '2px dashed #F59E0B',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.45)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 300ms ease'
              }}>
                <div style={{ 
                  width: '13px', 
                  height: '13px', 
                  borderRadius: '50%', 
                  background: '#F59E0B',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 0 8px #F59E0B'
                }} />
              </div>
              <div style={{ 
                fontSize: '10px', 
                color: '#FFFFFF', 
                fontWeight: 800, 
                marginTop: '4px', 
                background: 'rgba(217, 119, 6, 0.92)',
                padding: '2px 8px',
                borderRadius: '999px',
                border: '1px solid #FBBF24',
                boxShadow: '0 2px 6px rgba(0,0,0,0.5)',
                whiteSpace: 'nowrap'
              }}>
                Day 3: Pocket 1 Residential Loop
              </div>
            </div>
          )}

          {/* DAY 5 MULTI-WARD CORRIDOR CRITICAL IMPACT */}
          {selectedDay >= 2 && (
            <div 
              style={{
                position: 'absolute',
                top: '53%',
                left: '64%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 8
              }}
              onMouseEnter={() => setHoveredPoint(dataPoints[2])}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <div style={{
                width: '240px',
                height: '210px',
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.25)',
                border: '2.5px solid #EF4444',
                boxShadow: '0 0 35px rgba(239, 68, 68, 0.55), inset 0 0 20px rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 300ms ease'
              }}>
                <div style={{ 
                  width: '16px', 
                  height: '16px', 
                  borderRadius: '50%', 
                  background: '#EF4444',
                  border: '2.5px solid #FFFFFF',
                  boxShadow: '0 0 12px #EF4444'
                }} />
              </div>
              <div style={{ 
                fontSize: '10.5px', 
                color: '#FFFFFF', 
                fontWeight: 800, 
                marginTop: '4px', 
                background: 'rgba(220, 38, 38, 0.95)',
                padding: '3px 10px',
                borderRadius: '999px',
                border: '1px solid #F87171',
                boxShadow: '0 3px 10px rgba(0,0,0,0.6)',
                whiteSpace: 'nowrap'
              }}>
                Day 5: Multi-Ward Arterial Corridor
              </div>
            </div>
          )}

          {/* CITIZEN SIGNAL PINS (Shown when Citizen Signals layer active) */}
          {activeLayer === 'signals' && citizenSignals.map((sig) => (
            <div
              key={sig.id}
              style={{
                position: 'absolute',
                top: `${sig.y}%`,
                left: `${sig.x}%`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                zIndex: 12
              }}
              title={`${sig.title} (${sig.time})`}
            >
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#38BDF8',
                border: '2px solid #FFFFFF',
                boxShadow: '0 0 10px #0284C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0F172A',
                fontSize: '9px',
                fontWeight: 900
              }}>
                •
              </div>
            </div>
          ))}
        </div>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            background: 'rgba(15, 23, 42, 0.92)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${hoveredPoint.color}`,
            borderRadius: '10px',
            padding: '10px 14px',
            color: '#FFFFFF',
            zIndex: 30,
            maxWidth: '280px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: hoveredPoint.color, marginBottom: '2px' }}>
              {hoveredPoint.step}
            </div>
            <div style={{ fontSize: '12.5px', fontWeight: 700, marginBottom: '4px' }}>
              {hoveredPoint.ward}
            </div>
            <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: 1.4 }}>
              {hoveredPoint.label}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '10px', color: '#94A3B8' }}>
              <span>Radius: <strong>{hoveredPoint.radiusMeters}m</strong></span>
              <span>•</span>
              <span>Signals: <strong>{hoveredPoint.signalCount} verified</strong></span>
            </div>
          </div>
        )}

        {/* Zoom & Pan Overlay Controls */}
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          zIndex: 20
        }}>
          <button
            type="button"
            onClick={() => handleZoom(0.2)}
            title="Zoom In"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '15px'
            }}
          >
            <ZoomIn style={{ width: '15px', height: '15px' }} />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(-0.2)}
            title="Zoom Out"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <ZoomOut style={{ width: '15px', height: '15px' }} />
          </button>
          <button
            type="button"
            onClick={resetZoom}
            title="Reset View"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <RotateCcw style={{ width: '13px', height: '13px' }} />
          </button>
        </div>

        {/* Live GIS Telemetry Badge */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          right: '12px',
          background: 'rgba(11, 21, 32, 0.92)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          padding: '8px 14px',
          color: '#FFFFFF',
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, marginBottom: '2px', color: '#38BDF8' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38BDF8', animation: 'pulse 1.5s infinite' }} />
            <span>Active Viewport: {currentPoint.ward.split('(')[0]}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10.5px', color: '#94A3B8' }}>
            <span>Radius: <strong>{currentPoint.radiusMeters}m</strong></span>
            <span>•</span>
            <span>Signals: <strong>{currentPoint.signalCount} verified</strong></span>
            <span>•</span>
            <span>Scale: <strong>{Math.round(zoomLevel * 100)}%</strong></span>
          </div>
        </div>

        {/* Street & Ward Legend on bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: 'rgba(11, 21, 32, 0.85)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '6px 10px',
          color: '#CBD5E1',
          fontSize: '10px',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '12px', height: '3px', background: '#38BDF8', display: 'inline-block' }} />
            <span>Feeder Pipeline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', display: 'inline-block' }} />
            <span>Corridor Impact</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            <span>Origin Point</span>
          </div>
        </div>
      </div>

      {/* Privacy Guarantee & GPS Coordinates Footer */}
      <div style={{
        marginTop: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '11.5px',
        color: 'var(--color-text-muted, #64748B)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck style={{ width: '14px', height: '14px', color: '#0E5E3A' }} />
          <span><strong>🔒 Citizen Privacy Protected:</strong> Exact house numbers are hidden to protect privacy. Complaints are shown by street area.</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: '#64748B' }}>
            Map View: <strong>{mapMode === 'satellite' ? 'Satellite Photo' : 'Street Map'}</strong>
          </span>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontWeight: 700, color: '#0F172A' }}>
            Lat: {currentPoint.lat.toFixed(4)}, Lng: {currentPoint.lng.toFixed(4)}
          </span>
        </div>
      </div>
    </div>
  );
}
