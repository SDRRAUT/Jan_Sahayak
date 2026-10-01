import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MapPin, 
  Layers, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Radio, 
  Send,
  Eye,
  Shield,
  Filter,
  Flame,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import WhyExplainer from '../components/common/WhyExplainer';
import LeafletMap from '../components/common/LeafletMap';
import { maskCitizenName } from '../utils/privacy';

export default function AdminHeatmap() {
  const [searchParams] = useSearchParams();
  const { grievances = [], clusters = [], metrics } = useApp();
  const targetCaseId = searchParams.get('caseId');
  const latestGrievance = (targetCaseId ? grievances.find(g => g.id === targetCaseId) : null) || grievances[0];
  const [selectedWard, setSelectedWard] = useState('Ward 14 (Rohini Sector 14)');
  const [selectedCluster, setSelectedCluster] = useState(clusters[0]);
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [useRealMap, setUseRealMap] = useState(true);
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [wardDrawerDismissed, setWardDrawerDismissed] = useState(false);
  const [legendOpen, setLegendOpen] = useState(false);

  const wardStats = [
    { ward: 'Ward 14 (Rohini)', category: 'Water Supply', active: 18, critical: 1, resolved: 14, status: 'HIGH_ALERT', trend: '+48% this week', lat: 28.7175, lng: 77.1248 },
    { ward: 'Ward 8 (Lajpat Nagar)', category: 'Electricity', active: 7, critical: 0, resolved: 22, status: 'NORMAL', trend: '+12% this week', lat: 28.5677, lng: 77.2433 },
    { ward: 'Ward 22 (Mayur Vihar)', category: 'Roads', active: 11, critical: 0, resolved: 31, status: 'NORMAL', trend: '-8% this week', lat: 28.6096, lng: 77.2965 },
    { ward: 'Ward 5 (Kalkaji)', category: 'Water Supply', active: 9, critical: 1, resolved: 19, status: 'HIGH_ALERT', trend: '+22% this week', lat: 28.5367, lng: 77.2570 },
    { ward: 'Ward 19 (Karol Bagh)', category: 'Sanitation', active: 4, critical: 0, resolved: 28, status: 'RESOLVED', trend: '-40% this week', lat: 28.6517, lng: 77.1906 }
  ];

  const categories = ['ALL', 'Water', 'Roads', 'Sanitation', 'Electricity', 'Other'];

  const filteredWards = wardStats.filter(w => {
    if (categoryFilter === 'ALL') return true;
    if (categoryFilter === 'Water') return w.category === 'Water Supply';
    if (categoryFilter === 'Roads') return w.category === 'Roads';
    if (categoryFilter === 'Sanitation') return w.category === 'Sanitation';
    if (categoryFilter === 'Electricity') return w.category === 'Electricity';
    return true;
  });

  const selectedWardInfo = wardStats.find(w => selectedWard.includes(w.ward.split(' ')[1])) || wardStats[0];

  const handleSelectWard = (wardName) => {
    setSelectedWard(wardName);
    setWardDrawerDismissed(false);
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } catch(e) {}
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '28px' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-divider)'
        }}>
          <div>
            <div className="category-pill" style={{ marginBottom: '8px' }}>
              MUNICIPAL COMMAND CENTER • GEOSPATIAL INTELLIGENCE
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--color-text-primary)' }}>
              Civic Intelligence Map & Hotspot Matrix
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              Answering <strong>WHERE</strong> public problems are emerging with real-time ward clustering & root-cause detection.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '12px', fontWeight: 700 }}>
              <span className="status-dot active"></span>
              <span>SCADA & Municipal GIS Feed Online</span>
            </div>
            <Link to="/officer" className="btn-secondary btn-sm">
              Open Officer Triage Queue →
            </Link>
          </div>
        </div>

        {/* TOP OF ADMINISTRATION PANEL: LIVE INBOUND INCIDENT QUEUE */}
        {latestGrievance && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(90deg, #F0FDF4 0%, #EFF6FF 100%)',
            border: '1.5px solid #86EFAC',
            marginBottom: '20px',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', background: '#059669', color: '#FFFFFF' }}>
                    ● TOP OF ADMINISTRATION QUEUE
                  </span>
                  <strong style={{ fontSize: '13px', color: '#065F46' }}>
                    #{latestGrievance.id}: {latestGrievance.title}
                  </strong>
                  <span style={{ fontSize: '11px', color: '#047857' }}>
                    ({latestGrievance.createdAt || 'Just now'})
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#047857', marginTop: '3px' }}>
                  Reported in <strong>{latestGrievance.location?.ward || 'Ward 14'}</strong> by {maskCitizenName(latestGrievance.citizenName || 'Citizen')} • Assigned to <strong>{latestGrievance.officerName || latestGrievance.department || 'DJB'}</strong> • Target SLA: 24h
                </div>
              </div>
            </div>

            <Link
              to={`/officer?caseId=${latestGrievance.id}`}
              className="btn-primary btn-sm"
              style={{ background: '#059669', borderColor: '#059669', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Inspect in Officer Workspace →</span>
            </Link>
          </div>
        )}

        {/* SECTION 17: EMERGING THIS WEEK CALLOUT BANNER */}
        <div style={{
          padding: '16px 20px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(90deg, #FEF2F2 0%, #FFFBEB 100%)',
          border: '1px solid #FECACA',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#DC2626',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Flame style={{ width: '18px', height: '18px' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '13px', color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  EMERGING THIS WEEK: WARD 14 PIPELINE PRESSURE DROP
                </strong>
                <span style={{ fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: '#DC2626', color: '#FFFFFF' }}>
                  +48% SPIKE
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#7F1D1D', margin: '2px 0 0 0' }}>
                18 separate citizen submissions in Rohini Sector 14 correlate with 40m crack near Mother Dairy booster valve.
              </p>
            </div>
          </div>

          <Link
            to="/officer/complaints/GRV-2025-001"
            className="btn-primary btn-sm"
            style={{ background: '#DC2626', borderColor: '#DC2626' }}
          >
            <span>Inspect Hotspot Grievances →</span>
          </Link>
        </div>

        {/* 4 Summary Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          marginBottom: '28px'
        }}>
          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Active Macro Clusters
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', marginTop: '4px' }}>
              {clusters.length}
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-accent)' }}>Grouping 36 Individual Cases</span>
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Deduplication Rate
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', marginTop: '4px' }}>
              64.2%
            </div>
            <span style={{ fontSize: '11px', color: '#059669' }}>Eliminated Redundant Dispatches</span>
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Predicted SLA Breaches
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#EF4444', marginTop: '4px' }}>
              2 Wards
            </div>
            <span style={{ fontSize: '11px', color: '#EF4444' }}>Ward 14 (DJB) & Ward 5 (BSES)</span>
          </div>

          <div className="card" style={{ padding: '16px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
              Citizen Satisfaction Index
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-text-primary)', marginTop: '4px' }}>
              91.6%
            </div>
            <span style={{ fontSize: '11px', color: 'var(--color-primary)' }}>Based on Verified Case Audits</span>
          </div>
        </div>

        {/* Geospatial Map Visualizer & Ward Selection */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          alignItems: 'start',
          marginBottom: '32px'
        }}>
          {/* Map Surface (7 Cols) */}
          <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
            <div className="card" style={{ padding: 'clamp(14px, 3vw, 24px)' }}>
              
              {/* Desktop Category Filter Pills */}
              <div className="desktop-only" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Filter Map by Civic Domain:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategoryFilter(cat)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '9999px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: categoryFilter === cat ? 'none' : '1px solid var(--color-border-medium)',
                          background: categoryFilter === cat ? 'var(--color-primary)' : '#FFFFFF',
                          color: categoryFilter === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                          cursor: 'pointer',
                          transition: 'all 150ms ease'
                        }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Map Engine Toggle Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '12px',
                padding: '6px 12px',
                background: '#F8FAFC',
                borderRadius: '8px',
                border: '1px solid var(--color-border-subtle, #E2E8F0)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers style={{ width: '14px', height: '14px', color: 'var(--color-primary, #10B981)' }} />
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-secondary, #64748B)' }}>
                    Map Engine:
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => setUseRealMap(true)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: useRealMap ? '1px solid var(--color-primary, #10B981)' : '1px solid #CBD5E1',
                      background: useRealMap ? 'var(--color-primary, #10B981)' : '#FFFFFF',
                      color: useRealMap ? '#FFFFFF' : '#475569',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: useRealMap ? '#FFFFFF' : '#10B981' }} />
                    Live Leaflet / OSM
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseRealMap(false)}
                    style={{
                      padding: '3px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      border: !useRealMap ? '1px solid var(--color-primary, #10B981)' : '1px solid #CBD5E1',
                      background: !useRealMap ? 'var(--color-primary, #10B981)' : '#FFFFFF',
                      color: !useRealMap ? '#FFFFFF' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                  >
                    Simulated Canvas
                  </button>
                </div>
              </div>

              {useRealMap ? (
                <LeafletMap
                  wards={filteredWards}
                  selectedWard={selectedWard}
                  onSelectWard={handleSelectWard}
                  height="clamp(360px, 55vh, 600px)"
                  initialLayer="osm"
                />
              ) : (
                /* Graphical Ward Map Simulator with Touch-Optimized Leaflet Controls */
                <div 
                  className="gis-map-viewport"
                style={{
                  height: 'clamp(340px, 55vh, 600px)',
                  borderRadius: 'var(--radius-md)',
                  background: '#0B1914',
                  position: 'relative',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  touchAction: 'pan-y',
                  overscrollBehavior: 'contain'
                }}
              >
                {/* Real Cartographic GIS Leaflet Basemap */}
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}>
                  <LeafletMap
                    wards={filteredWards}
                    selectedWard={selectedWard}
                    onSelectWard={handleSelectWard}
                    height="100%"
                    initialLayer="dark"
                  />
                </div>
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(ellipse at center, rgba(11, 25, 20, 0.2) 0%, rgba(11, 25, 20, 0.7) 100%)',
                  pointerEvents: 'none'
                }} />

                {/* Mobile Floating Filter Trigger Button (< 768px) */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="mobile-only-flex"
                  aria-label="Open ward and category filters"
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    zIndex: 22,
                    alignItems: 'center',
                    gap: '6px',
                    padding: '7px 12px',
                    minHeight: '36px',
                    borderRadius: '9999px',
                    background: 'rgba(15, 23, 42, 0.92)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#FFFFFF',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.35)',
                    touchAction: 'manipulation'
                  }}
                >
                  <Filter style={{ width: '13px', height: '13px', color: '#10B981' }} />
                  <span>Filter: {categoryFilter}</span>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    background: 'var(--color-primary)',
                    padding: '1px 6px',
                    borderRadius: '999px'
                  }}>
                    {filteredWards.length}
                  </span>
                </button>

                {/* Leaflet-Style Touch Zoom Controls (Min 36x36px Touch Target) */}
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  zIndex: 22
                }}>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.min(1.6, Number((prev + 0.2).toFixed(1))))}
                    title="Zoom In"
                    aria-label="Zoom in map"
                    className="map-touch-btn"
                    style={{
                      minWidth: '36px',
                      minHeight: '36px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                  >
                    <ZoomIn style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(prev => Math.max(0.9, Number((prev - 0.2).toFixed(1))))}
                    title="Zoom Out"
                    aria-label="Zoom out map"
                    className="map-touch-btn"
                    style={{
                      minWidth: '36px',
                      minHeight: '36px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                  >
                    <ZoomOut style={{ width: '16px', height: '16px' }} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel(1)}
                    title="Reset Zoom"
                    aria-label="Reset map zoom"
                    className="map-touch-btn"
                    style={{
                      minWidth: '36px',
                      minHeight: '36px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'rgba(15, 23, 42, 0.88)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                  >
                    <RotateCcw style={{ width: '14px', height: '14px' }} />
                  </button>
                </div>

                {/* Simulated Ward Zones (Scale with Zoom Level, Finger-Friendly Touch Hitboxes) */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                  pointerEvents: 'none'
                }}>
                  {wardStats.map((w, idx) => {
                    const positions = [
                      { top: '25%', left: '30%' }, // Ward 14 Rohini
                      { top: '65%', left: '60%' }, // Ward 8 Lajpat Nagar
                      { top: '45%', left: '75%' }, // Ward 22 Mayur Vihar
                      { top: '75%', left: '45%' }, // Ward 5 Kalkaji
                      { top: '40%', left: '45%' }  // Ward 19 Karol Bagh
                    ];
                    const pos = positions[idx];
                    const isSelected = selectedWard.includes(w.ward.split(' ')[1]);

                    return (
                      <button
                        key={w.ward}
                        type="button"
                        onClick={() => handleSelectWard(w.ward)}
                        aria-label={`Select ${w.ward}: ${w.active} active cases`}
                        style={{
                          position: 'absolute',
                          top: pos.top,
                          left: pos.left,
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '4px',
                          cursor: 'pointer',
                          zIndex: isSelected ? 15 : 10,
                          background: 'transparent',
                          border: 'none',
                          padding: '6px',
                          minWidth: '40px',
                          minHeight: '40px',
                          pointerEvents: 'auto',
                          touchAction: 'manipulation'
                        }}
                      >
                        {/* Pulse circle pin */}
                        <div style={{
                          width: isSelected ? '32px' : '26px',
                          height: isSelected ? '32px' : '26px',
                          borderRadius: '50%',
                          background: w.critical > 0 ? '#EF4444' : (w.active > 10 ? '#F59E0B' : '#10B981'),
                          border: '3px solid #FFFFFF',
                          boxShadow: w.critical > 0 ? '0 0 20px rgba(239, 68, 68, 0.85)' : '0 0 16px rgba(16, 185, 129, 0.55)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 800,
                          transition: 'all 200ms ease'
                        }}>
                          {w.active}
                        </div>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: isSelected ? '#10B981' : '#F8FAFC',
                          background: 'rgba(11, 25, 20, 0.88)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          border: isSelected ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.15)',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.5)'
                        }}>
                          {w.ward}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Desktop Map Legend */}
                <div 
                  className="desktop-only"
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(11, 25, 20, 0.9)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '11px',
                    color: '#F8FAFC',
                    display: 'flex',
                    gap: '12px',
                    zIndex: 16
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} /> Critical Cluster
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> Elevated Anomaly
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} /> Normal Resolution
                  </span>
                </div>

                {/* Mobile Collapsible Legend Trigger */}
                <div 
                  className="mobile-only"
                  style={{
                    position: 'absolute',
                    top: '56px',
                    left: '12px',
                    zIndex: 21
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setLegendOpen(!legendOpen)}
                    style={{
                      padding: '4px 10px',
                      minHeight: '36px',
                      borderRadius: '999px',
                      background: 'rgba(11, 25, 20, 0.90)',
                      backdropFilter: 'blur(6px)',
                      border: '1px solid rgba(255,255,255,0.18)',
                      color: '#F8FAFC',
                      fontSize: '10.5px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      cursor: 'pointer',
                      touchAction: 'manipulation'
                    }}
                  >
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }} />
                    <span>Legend {legendOpen ? '▾' : '▸'}</span>
                  </button>

                  {legendOpen && (
                    <div style={{
                      marginTop: '4px',
                      background: 'rgba(11, 25, 20, 0.96)',
                      backdropFilter: 'blur(10px)',
                      padding: '8px 10px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.18)',
                      fontSize: '10.5px',
                      color: '#F8FAFC',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '5px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.5)'
                    }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} /> Critical Cluster
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} /> Elevated Anomaly
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} /> Normal Resolution
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile Ward Telemetry Panel Docked at Bottom of Map */}
                {selectedWard && !wardDrawerDismissed && (
                  <div
                    className="mobile-only bottom-sheet-slide"
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      zIndex: 25,
                      background: 'rgba(11, 25, 20, 0.96)',
                      backdropFilter: 'blur(12px)',
                      borderTop: '1.5px solid rgba(16, 185, 129, 0.45)',
                      borderRadius: '16px 16px 0 0',
                      padding: '12px 14px 14px',
                      color: '#FFFFFF',
                      boxShadow: '0 -6px 24px rgba(0,0,0,0.65)'
                    }}
                  >
                    {/* Drawer Drag Pill */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                      <div style={{ width: '32px', height: '3.5px', borderRadius: '2px', background: 'rgba(255,255,255,0.25)' }} />
                    </div>

                    {/* Ward Title & Dismiss Button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0, flex: 1 }}>
                        <MapPin style={{ width: '15px', height: '15px', color: '#10B981', flexShrink: 0 }} />
                        <strong style={{ fontSize: '13px', fontWeight: 800, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {selectedWardInfo.ward}
                        </strong>
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: selectedWardInfo.critical > 0 ? '#EF4444' : '#10B981',
                          color: '#FFFFFF',
                          flexShrink: 0
                        }}>
                          {selectedWardInfo.status}
                        </span>
                      </div>

                      {/* Finger-friendly Dismiss Button (min-width: 36px, min-height: 36px) */}
                      <button
                        type="button"
                        onClick={() => setWardDrawerDismissed(true)}
                        aria-label="Dismiss Ward Telemetry Panel"
                        style={{
                          minWidth: '36px',
                          minHeight: '36px',
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.12)',
                          border: 'none',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          touchAction: 'manipulation',
                          flexShrink: 0
                        }}
                      >
                        <X style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>

                    {/* 3 Telemetry Metrics */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      marginBottom: '10px',
                      textAlign: 'center'
                    }}>
                      <div>
                        <span style={{ fontSize: '9.5px', color: '#94A3B8', display: 'block' }}>Active Cases</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: selectedWardInfo.critical > 0 ? '#F87171' : '#34D399' }}>
                          {selectedWardInfo.active}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '9.5px', color: '#94A3B8', display: 'block' }}>Critical</span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: selectedWardInfo.critical > 0 ? '#EF4444' : '#94A3B8' }}>
                          {selectedWardInfo.critical}
                        </span>
                      </div>
                      <div>
                        <span style={{ fontSize: '9.5px', color: '#94A3B8', display: 'block' }}>Trend</span>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: selectedWardInfo.trend.includes('+') ? '#F87171' : '#34D399' }}>
                          {selectedWardInfo.trend}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <a
                      href="#root-cause-cluster"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        width: '100%',
                        minHeight: '36px',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: 'var(--color-primary)',
                        color: '#FFFFFF',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        textDecoration: 'none',
                        touchAction: 'manipulation'
                      }}
                    >
                      <span>Inspect Correlated Root-Cause Cluster</span>
                      <ArrowRight style={{ width: '13px', height: '13px' }} />
                    </a>
                  </div>
                )}

                {/* Mobile Restore Telemetry Pill (shown when dismissed) */}
                {wardDrawerDismissed && (
                  <button
                    type="button"
                    onClick={() => setWardDrawerDismissed(false)}
                    className="mobile-only-flex"
                    style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      zIndex: 22,
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      minHeight: '36px',
                      borderRadius: '999px',
                      background: 'rgba(11, 25, 20, 0.94)',
                      backdropFilter: 'blur(8px)',
                      border: '1px solid rgba(16, 185, 129, 0.45)',
                      color: '#34D399',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      touchAction: 'manipulation',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.35)'
                    }}
                  >
                    <MapPin style={{ width: '12px', height: '12px' }} />
                    <span>{selectedWardInfo.ward.split('(')[0]} Telemetry ▴</span>
                  </button>
                )}
              </div>
              )}

              {/* Desktop Ward Breakdown Grid */}
              <div 
                className="desktop-only"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                  gap: '8px', 
                  marginTop: '16px' 
                }}
              >
                {filteredWards.map((w) => (
                  <button
                    key={w.ward}
                    type="button"
                    onClick={() => handleSelectWard(w.ward)}
                    style={{
                      padding: '10px',
                      borderRadius: 'var(--radius-sm)',
                      background: selectedWard.includes(w.ward.split(' ')[1]) ? 'var(--color-accent-tint)' : '#F8F9FA',
                      border: selectedWard.includes(w.ward.split(' ')[1]) ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                      textAlign: 'left',
                      transition: 'all 150ms ease',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, display: 'block', color: 'var(--color-text-primary)' }}>
                      {w.ward}
                    </span>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ fontSize: '12px', color: w.critical > 0 ? '#EF4444' : 'var(--color-text-secondary)', fontWeight: 600 }}>
                        {w.active} Cases
                      </span>
                      <span style={{ fontSize: '10px', color: w.trend.includes('+') ? '#DC2626' : '#059669' }}>
                        {w.trend}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Bottom Sheet Drawer for Filters & Ward Selector (< 768px) */}
          {mobileFilterOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                background: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(4px)'
              }}
              onClick={() => setMobileFilterOpen(false)}
            >
              <div
                className="bottom-sheet-slide"
                style={{
                  background: '#FFFFFF',
                  borderTopLeftRadius: '20px',
                  borderTopRightRadius: '20px',
                  maxHeight: '80vh',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 -10px 40px rgba(0,0,0,0.25)'
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Pull Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 4px' }}>
                  <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#CBD5E1' }} />
                </div>

                {/* Sheet Header */}
                <div style={{
                  padding: '8px 20px 14px',
                  borderBottom: '1px solid var(--color-divider)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--color-text-primary)' }}>
                      Ward & Domain Filters
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '2px 0 0 0' }}>
                      Filter hotspot map by domain & inspect ward telemetry
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    style={{
                      minWidth: '36px',
                      minHeight: '36px',
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#F1F5F9',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#475569',
                      touchAction: 'manipulation'
                    }}
                    aria-label="Close filters"
                  >
                    <X style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>

                {/* Sheet Body */}
                <div style={{ padding: '16px 20px 24px', overflowY: 'auto' }}>
                  {/* Category Filter Pills */}
                  <div style={{ marginBottom: '18px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                      Filter by Civic Domain:
                    </span>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategoryFilter(cat)}
                          style={{
                            padding: '6px 14px',
                            minHeight: '36px',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            border: categoryFilter === cat ? 'none' : '1px solid var(--color-border-medium)',
                            background: categoryFilter === cat ? 'var(--color-primary)' : '#F8FAFC',
                            color: categoryFilter === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            touchAction: 'manipulation'
                          }}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ward List */}
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                      Select Ward to Inspect ({filteredWards.length}):
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
                      {filteredWards.map((w) => {
                        const isSelected = selectedWard.includes(w.ward.split(' ')[1]);
                        return (
                          <button
                            key={w.ward}
                            type="button"
                            onClick={() => {
                              handleSelectWard(w.ward);
                              setMobileFilterOpen(false);
                            }}
                            style={{
                              padding: '12px 14px',
                              minHeight: '44px',
                              borderRadius: 'var(--radius-sm)',
                              background: isSelected ? 'var(--color-accent-tint)' : '#F8FAFC',
                              border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              textAlign: 'left',
                              cursor: 'pointer',
                              touchAction: 'manipulation'
                            }}
                          >
                            <div>
                              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                                {w.ward}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)', display: 'block', marginTop: '2px' }}>
                                {w.category} • {w.trend}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '2px 8px',
                                borderRadius: '999px',
                                background: w.critical > 0 ? '#FEE2E2' : '#E2E8F0',
                                color: w.critical > 0 ? '#DC2626' : '#334155'
                              }}>
                                {w.active} Cases
                              </span>
                              {isSelected && <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>✓</span>}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Root Cause Cluster Inspector (5 Cols) */}
          <div style={{ gridColumn: 'span 5' }} className="hero-right-col" id="root-cause-cluster">
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>
                  Active Root-Cause Cluster
                </span>
                <span className="category-pill" style={{ height: '22px', fontSize: '10px' }}>
                  {selectedCluster.clusterCount || 18} Reports Merged
                </span>
              </div>

              <h3 style={{ fontSize: '20px', lineHeight: 1.3, marginBottom: '8px' }}>
                {selectedCluster.title}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#FEF2F2', color: '#991B1B' }}>
                  {selectedCluster.severity}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {selectedCluster.department}
                </span>
              </div>

              {/* Pinpointed Root Cause */}
              <div style={{
                padding: '14px',
                borderRadius: 'var(--radius-md)',
                background: '#F8F9FA',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    Identified Root Cause:
                  </span>
                  <WhyExplainer
                    label="Why this root cause?"
                    title="Spatial Telemetry Corroboration"
                    reasons={[
                      'Pressure drop recorded across 3 adjacent junctions',
                      'Contamination complaints report identical odor & timing',
                      '18 corroborating citizen GPS reports within 400m radius'
                    ]}
                    align="right"
                  />
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', lineHeight: 1.5, margin: 0 }}>
                  "{selectedCluster.rootCause}"
                </p>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                  Impact Area: <strong>{selectedCluster.impactRadius}</strong>
                </div>
              </div>

              {/* Bulk Citizen Notification Action */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <Send style={{ width: '14px', height: '14px', color: '#15803D' }} />
                  <strong style={{ fontSize: '12px', color: '#15803D' }}>
                    Bulk Broadcast to All {selectedCluster.clusterCount || 18} Linked Citizens
                  </strong>
                </div>
                <p style={{ fontSize: '12px', color: '#166534', lineHeight: 1.4, marginBottom: '12px' }}>
                  Sends simultaneous WhatsApp status updates in regional dialects to all households who filed reports in this cluster.
                </p>
                <button
                  type="button"
                  onClick={handleBroadcast}
                  className="btn-primary btn-sm"
                  style={{ width: '100%', background: 'var(--color-primary)' }}
                >
                  Broadcast Emergency Update
                </button>
              </div>

              {broadcastSent && (
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: '#ECFDF5', color: '#065F46', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                  <span>Broadcast transmitted to 18 phone numbers via JanSahayak Gateway.</span>
                </div>
              )}

              <Link
                to="/officer/complaints/GRV-2025-001"
                className="btn-secondary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Inspect Associated Grievances →
              </Link>
            </div>

            {/* Stage 14: Systemic Root Cause & Proactive Capital Insight */}
            <div className="card" style={{ padding: '24px', background: '#FFFFFF', border: '1px solid #E2E8F0', marginTop: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span className="category-pill" style={{ background: '#FEF3C7', color: '#92400E', borderColor: '#FDE68A' }}>
                  SYSTEMIC POLICY INSIGHT
                </span>
              </div>
              <h4 style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Proactive Capital Infrastructure Replacement
              </h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
                Telemetry indicates 4 separate pipeline fractures along Rohini Sector 14's 35-year-old cast-iron conduit in the last 6 months.
              </p>
              <div style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: '#F8F9FA', border: '1px solid #E2E8F0', fontSize: '12px', lineHeight: 1.5 }}>
                <strong style={{ color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                  Algorithmic Recommendation for Municipal Budget:
                </strong>
                Replace 4.2 km aging Cast-Iron trunk line with high-density polyethylene (HDPE) piping. Estimated Capex: <strong>₹42 Lakhs</strong>. Eliminates estimated recurring emergency excavation losses of <strong>₹18.4 Lakhs/year</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
