import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  Send, 
  Filter, 
  RefreshCw, 
  Activity, 
  Layers, 
  Play, 
  Check, 
  Clock, 
  MapPin, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Radio, 
  SlidersHorizontal,
  Building2,
  Car,
  Table,
  LayoutGrid,
  Search,
  ExternalLink,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  SURVEILLANCE_HOTSPOTS, 
  INITIAL_SURVEILLANCE_INCIDENTS,
  SURVEILLANCE_STATUSES,
  SURVEILLANCE_AUTHORITIES
} from '../data/surveillanceData';
import {
  CctvFeedViewer,
  SurveillanceAgentTelemetry,
  SurveillanceTicketCard,
  EvidencePackageModal,
  AuthorityEscalationModal,
  LawEnforcementReportCard,
  LawEnforcementReportModal
} from '../components/surveillance';

export default function CivicSurveillanceHub() {
  const navigate = useNavigate();
  
  const {
    surveillanceHotspots = SURVEILLANCE_HOTSPOTS,
    surveillanceIncidents = INITIAL_SURVEILLANCE_INCIDENTS,
    activeSurveillanceHotspot = 'HOTSPOT-WAG-01',
    activateHotspotSurveillance,
    escalateSurveillanceIncident,
    updateSurveillanceIncidentStatus,
    addSurveillanceIncident
  } = useApp();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Active Hotspot
  const currentHotspot = useMemo(() => {
    return surveillanceHotspots.find(h => h.id === activeSurveillanceHotspot) || surveillanceHotspots[0] || {
      id: 'HOTSPOT-WAG-01',
      name: 'Wagholi Main Road Restricted Zone',
      ward: 'Wagholi Ward 29 (Kesnand & Main Road Corridor)',
      category: 'Restricted-area entry / illegal heavy vehicle movement',
      citizenComplaintsCount: 12,
      similarIncidentsCount: 7,
      patternDetected: 'HIGH',
      monitoringStatus: 'ACTIVE',
      activeCamerasCount: 3,
      ruleConfig: {
        ruleId: 'RULE-WAG-RESTRICTED-09',
        description: 'No commercial heavy vehicles (>3.5T) allowed between 08:00 - 20:00 without municipal permit',
        confidenceThreshold: 85
      }
    };
  }, [surveillanceHotspots, activeSurveillanceHotspot]);

  // Surveillance Status toggle
  const [isMonitoringActive, setIsMonitoringActive] = useState(
    currentHotspot?.monitoringStatus === 'ACTIVE'
  );

  // Selected Camera for CCTV feed viewer
  const [selectedCameraId, setSelectedCameraId] = useState('CAM-WAG-04');

  // Filter tabs for Incidents list: 'ALL' | 'PENDING' | 'FORWARDED' | 'RESOLVED'
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modal states
  const [selectedEvidenceIncident, setSelectedEvidenceIncident] = useState(null);
  const [selectedEscalateIncident, setSelectedEscalateIncident] = useState(null);

  // Quick Action Dialog state for manual inline action
  const [actionDialogState, setActionDialogState] = useState({
    isOpen: false,
    incident: null,
    actionType: '',
    note: ''
  });

  // Hotspot Activation Handler
  const handleToggleMonitoring = () => {
    const nextState = !isMonitoringActive;
    setIsMonitoringActive(nextState);
    if (activateHotspotSurveillance && currentHotspot?.id) {
      activateHotspotSurveillance(currentHotspot.id);
    }
  };

  // Filtered Incidents calculation
  const filteredIncidents = useMemo(() => {
    return surveillanceIncidents.filter(inc => {
      // Search matching
      const matchesSearch = searchQuery === '' || 
        inc.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.violation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.vehicleDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.camera?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Tab filtering
      if (activeFilterTab === 'PENDING') {
        return inc.status === 'Detected' || 
               inc.status === 'Evidence Captured' || 
               inc.status === 'Report Generated' || 
               inc.status === 'Under Human Review';
      }
      if (activeFilterTab === 'FORWARDED') {
        return inc.status === 'Forwarded' || inc.status === 'Action Taken';
      }
      if (activeFilterTab === 'RESOLVED') {
        return inc.status === 'Resolved';
      }
      return true; // 'ALL'
    });
  }, [surveillanceIncidents, activeFilterTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: surveillanceIncidents.length,
      pending: surveillanceIncidents.filter(i => 
        i.status === 'Detected' || 
        i.status === 'Evidence Captured' || 
        i.status === 'Report Generated' || 
        i.status === 'Under Human Review'
      ).length,
      forwarded: surveillanceIncidents.filter(i => 
        i.status === 'Forwarded' || 
        i.status === 'Action Taken'
      ).length,
      resolved: surveillanceIncidents.filter(i => i.status === 'Resolved').length
    };
  }, [surveillanceIncidents]);

  // Handlers for ticket actions
  const handleAcknowledgeIncident = (incident) => {
    if (updateSurveillanceIncidentStatus) {
      updateSurveillanceIncidentStatus(incident.id, 'Under Human Review', 'Duty Officer acknowledged and initiated verification');
    }
  };

  const handleOpenActionDialog = (incident, actionType = 'Action Taken') => {
    setActionDialogState({
      isOpen: true,
      incident,
      actionType,
      note: actionType === 'Resolved' 
        ? 'Challan issued and heavy vehicle escorted out of corridor. Case closed.' 
        : 'Traffic interceptor squad deployed to Kesnand junction for spot fine.'
    });
  };

  const handleConfirmActionDialog = () => {
    if (actionDialogState.incident && updateSurveillanceIncidentStatus) {
      updateSurveillanceIncidentStatus(
        actionDialogState.incident.id, 
        actionDialogState.actionType, 
        actionDialogState.note
      );
    }
    setActionDialogState({ isOpen: false, incident: null, actionType: '', note: '' });
  };

  // Status badge styling helper
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Detected':
        return { background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECACA' };
      case 'Evidence Captured':
        return { background: '#FFFBEB', color: '#B45309', border: '1px solid #FDE68A' };
      case 'Report Generated':
        return { background: '#FAF5FF', color: '#6B21A8', border: '1px solid #E9D5FF' };
      case 'Forwarded':
        return { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' };
      case 'Under Human Review':
        return { background: '#FFF7ED', color: '#C2410C', border: '1px solid #FFEDD5' };
      case 'Action Taken':
        return { background: '#EEF2FF', color: '#4338CA', border: '1px solid #C7D2FE' };
      case 'Resolved':
        return { background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0' };
      default:
        return { background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' };
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', paddingBottom: '80px', color: '#0F172A', fontFamily: 'inherit' }}>
      
      {/* ══════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BREADCRUMB & HEADER STRIP
         ══════════════════════════════════════════════════════════════════════ */}
      <div style={{
        background: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px 24px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Left: Breadcrumbs & Back */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              onClick={() => navigate('/officer')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 120ms ease'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F1F5F9'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFFFFF'}
            >
              <ArrowLeft style={{ width: '14px', height: '14px', color: '#64748B' }} />
              <span>Back to Officer Workspace</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94A3B8' }}>
              <span>/</span>
              <span style={{ color: '#64748B' }}>Wagholi Sub-Division</span>
              <span>/</span>
              <strong style={{ color: '#047857' }}>Surveillance Hub</strong>
            </div>
          </div>

          {/* Right: Monitoring Pill & Live Stream Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '12px',
              fontWeight: 800
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444', animation: 'pulse 1.5s infinite' }} />
              🔴 Civic Monitoring Zone: ACTIVE
            </span>

            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '999px',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              color: '#1D4ED8',
              fontSize: '12px',
              fontWeight: 700
            }}>
              <Zap style={{ width: '12px', height: '12px', color: '#2563EB' }} />
              Dual-Agent Optical Pipe Online
            </span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* ══════════════════════════════════════════════════════════════════════
            2. HERO TITLE & CONTEXT BANNER
           ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 50%, #EFF6FF 100%)',
          borderRadius: '24px',
          padding: '24px 28px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          {/* Overline Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 800,
              padding: '3px 10px',
              borderRadius: '999px',
              background: '#FFFFFF',
              color: '#065F46',
              border: '1px solid #A7F3D0'
            }}>
              <Camera style={{ width: '12px', height: '12px', color: '#059669' }} />
              CCTV AI SURVEILLANCE & ESCALATION
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#64748B',
              background: '#FFFFFF',
              padding: '3px 9px',
              borderRadius: '999px',
              border: '1px solid #CBD5E1'
            }}>
              Auto-sync: 3s 🔄
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.025em',
            margin: '0 0 6px 0',
            lineHeight: 1.25
          }}>
            AI Civic Surveillance & Hotspot Escalation Hub
          </h1>

          <p style={{
            fontSize: '13.5px',
            color: '#64748B',
            margin: 0,
            maxWidth: '740px',
            lineHeight: 1.5
          }}>
            Autonomous CCTV monitoring, real-time violation detection, and closed-loop authority escalation for high-density complaint hotspots.
          </p>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            3. HOTSPOT INFORMATION CARD (WAGHOLI RESTRICTED ZONE)
           ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          borderTop: '4px solid #059669',
          padding: '20px 24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              {/* Hotspot Header Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#F1F5F9',
                  color: '#334155',
                  fontFamily: 'monospace'
                }}>
                  HOTSPOT #{currentHotspot.id}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0369A1',
                  background: '#F0F9FF',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid #BAE6FD',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <MapPin style={{ width: '11px', height: '11px' }} />
                  {currentHotspot.ward}
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#B45309',
                  background: '#FFFBEB',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  border: '1px solid #FDE68A'
                }}>
                  ⚠️ Pattern: {currentHotspot.patternDetected}
                </span>
              </div>

              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                {currentHotspot.name}
              </h2>

              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '0 0 14px 0', lineHeight: 1.5, maxWidth: '820px' }}>
                {currentHotspot.ruleConfig?.description || 'Municipal Rule #09: Daytime Heavy Vehicle Ban (08:00 - 20:00). High recurring citizen grievance clustering triggered autonomous surveillance camera binding to automatically capture and dispatch indisputable violation packages.'}
              </p>

              {/* Hotspot Metric Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: '#FEF2F2',
                  border: '1px solid #FECACA',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#B91C1C'
                }}>
                  <strong>{currentHotspot.citizenComplaintsCount || 12}</strong> Citizen Complaints Clustered
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#92400E'
                }}>
                  <strong>{currentHotspot.similarIncidentsCount || 7}</strong> Similar Past Incidents
                </span>

                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#065F46'
                }}>
                  <Camera style={{ width: '12px', height: '12px', color: '#059669' }} />
                  <strong>{currentHotspot.activeCamerasCount || 3}</strong> Active CCTV Feeds
                </span>
              </div>
            </div>

            {/* Action Toggle Button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
              <button
                type="button"
                onClick={handleToggleMonitoring}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isMonitoringActive ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' : '#475569',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: isMonitoringActive ? '0 4px 14px rgba(5, 150, 105, 0.3)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isMonitoringActive ? '#86EFAC' : '#94A3B8' }} />
                <span>{isMonitoringActive ? '🟢 Monitoring Active' : 'Activate AI Surveillance'}</span>
              </button>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                {isMonitoringActive ? 'Autonomous optical triggers active' : 'Click to enable live surveillance'}
              </span>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            4. TOP 4 METRICS COUNTER CARDS
           ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {/* Card 1 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Hotspots Active
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
              1 <span style={{ fontSize: '14px', fontWeight: 600, color: '#059669' }}>Ward 29</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              Wagholi Restricted Corridor
            </div>
          </div>

          {/* Card 2 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Live Cameras
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
              3 <span style={{ fontSize: '14px', fontWeight: 600, color: '#2563EB' }}>Online</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              CAM-WAG-04, 02, 07 Connected
            </div>
          </div>

          {/* Card 3 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              AI Detection Accuracy
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
              94.2%
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              Dual-Agent Optical Flow
            </div>
          </div>

          {/* Card 4 */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '16px 20px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Incidents & Escalations
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
              {surveillanceIncidents.length} <span style={{ fontSize: '14px', fontWeight: 600, color: '#D97706' }}>({tabCounts.pending} Pending)</span>
            </div>
            <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
              {tabCounts.forwarded} Forwarded to Authorities
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            5. MAIN 2-COLUMN SPLIT WORKSPACE
           ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          
          {/* ─────────────────────────────────────────────────────────────────
              LEFT COLUMN: LIVE CCTV FEED VIEWER & TELEMETRY HUD
             ───────────────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* CCTV Live Feed Player */}
            <CctvFeedViewer
              selectedCameraId={selectedCameraId}
              onCameraChange={(camId) => setSelectedCameraId(camId)}
              onViolationDetected={(violationData) => {
                if (addSurveillanceIncident) {
                  addSurveillanceIncident(violationData);
                }
              }}
            />

            {/* Agent 1 Real-time Telemetry HUD */}
            <SurveillanceAgentTelemetry
              activeCamera={selectedCameraId}
              isViolationActive={false}
              simStep={0}
            />
          </div>

          {/* ─────────────────────────────────────────────────────────────────
              RIGHT COLUMN: INCIDENTS LOG & LAW ENFORCEMENT REPORT DOSSIERS
             ───────────────────────────────────────────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* 1. Incidents & Evidence Box */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '20px 24px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
            {/* Section Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', borderBottom: '1px solid #F1F5F9', pb: '14px', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert style={{ width: '18px', height: '18px', color: '#D97706' }} />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Surveillance Incidents & Evidence
                </h3>
              </div>
              
              {/* View Mode Toggle: Cards / Table */}
              <div style={{ display: 'flex', alignItems: 'center', background: '#F1F5F9', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                <button
                  type="button"
                  onClick={() => setViewMode('cards')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'cards' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'cards' ? '#0F172A' : '#64748B',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  Cards View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('table')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: viewMode === 'table' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'table' ? '#0F172A' : '#64748B',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  Table View
                </button>
              </div>
            </div>

            {/* Filter Tabs Strip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: `All (${tabCounts.all})` },
                { id: 'PENDING', label: `Pending Review (${tabCounts.pending})` },
                { id: 'FORWARDED', label: `Forwarded (${tabCounts.forwarded})` },
                { id: 'RESOLVED', label: `Resolved (${tabCounts.resolved})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFilterTab(tab.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: activeFilterTab === tab.id ? '1px solid #059669' : '1px solid #E2E8F0',
                    background: activeFilterTab === tab.id ? '#ECFDF5' : '#FFFFFF',
                    color: activeFilterTab === tab.id ? '#065F46' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search style={{ width: '14px', height: '14px', color: '#94A3B8', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search incident ID, vehicle #, location, camera..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  fontSize: '12.5px',
                  color: '#0F172A',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Incident List Body */}
            {filteredIncidents.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: '#F8FAFC',
                borderRadius: '12px',
                border: '1px solid #E2E8F0'
              }}>
                <CheckCircle2 style={{ width: '32px', height: '32px', color: '#059669', margin: '0 auto 10px auto' }} />
                <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block' }}>No Incidents Found</strong>
                <p style={{ fontSize: '12px', color: '#64748B', margin: '4px 0 0 0' }}>
                  No surveillance incidents match this filter. Run a live simulation to generate a new incident.
                </p>
              </div>
            ) : viewMode === 'cards' ? (
              /* Cards View */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredIncidents.map(inc => (
                  <SurveillanceTicketCard
                    key={inc.id}
                    incident={inc}
                    onViewEvidence={() => setSelectedEvidenceIncident(inc)}
                    onForward={() => setSelectedEscalateIncident(inc)}
                    onTakeAction={() => handleOpenActionDialog(inc, 'Action Taken')}
                    onResolve={() => handleOpenActionDialog(inc, 'Resolved')}
                  />
                ))}
              </div>
            ) : (
              /* Table View matching Section 8 */
              <div style={{ overflowX: 'auto', border: '1px solid #E2E8F0', borderRadius: '12px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#64748B', fontWeight: 700 }}>
                      <th style={{ padding: '10px 12px' }}>Incident</th>
                      <th style={{ padding: '10px 12px' }}>Location</th>
                      <th style={{ padding: '10px 12px' }}>Issue</th>
                      <th style={{ padding: '10px 12px' }}>Evidence</th>
                      <th style={{ padding: '10px 12px' }}>Confidence</th>
                      <th style={{ padding: '10px 12px' }}>Status</th>
                      <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.map(inc => {
                      const badgeStyle = getStatusBadgeStyle(inc.status);
                      return (
                        <tr key={inc.id} style={{ borderBottom: '1px solid #F1F5F9', background: '#FFFFFF' }}>
                          <td style={{ padding: '12px', fontFamily: 'monospace', fontWeight: 800, color: '#0F172A' }}>
                            {inc.id}
                            <span style={{ display: 'block', fontSize: '10.5px', color: '#94A3B8', fontFamily: 'inherit', fontWeight: 400 }}>
                              {inc.timestamp}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: '#334155' }}>
                            <strong style={{ display: 'block', fontSize: '12px' }}>{inc.location}</strong>
                            <span style={{ fontSize: '11px', color: '#64748B' }}>{inc.camera}</span>
                          </td>
                          <td style={{ padding: '12px', color: '#334155', maxWidth: '180px' }}>
                            <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={inc.violation}>
                              {inc.violation}
                            </div>
                            <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                              {inc.vehicleDetails?.split('(')[1]?.replace(')', '') || inc.vehicleDetails}
                            </span>
                          </td>
                          <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedEvidenceIncident(inc)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                background: '#F1F5F9',
                                border: '1px solid #CBD5E1',
                                color: '#334155',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              <FileText style={{ width: '12px', height: '12px', color: '#059669' }} />
                              <span>{inc.evidenceFiles?.length || 2} Files</span>
                            </button>
                          </td>
                          <td style={{ padding: '12px', fontWeight: 800, color: '#047857' }}>
                            {inc.aiConfidence}%
                          </td>
                          <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 8px',
                              borderRadius: '999px',
                              fontSize: '11px',
                              fontWeight: 700,
                              ...badgeStyle
                            }}>
                              {inc.status}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                type="button"
                                onClick={() => setSelectedEvidenceIncident(inc)}
                                title="View Evidence"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  color: '#334155',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                View
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedEscalateIncident(inc)}
                                title="Forward to Authority"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: '#EFF6FF',
                                  border: '1px solid #BFDBFE',
                                  color: '#1D4ED8',
                                  fontSize: '11.5px',
                                  fontWeight: 700,
                                  cursor: 'pointer'
                                }}
                              >
                                Forward
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Chain of Custody Notice */}
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #DCFCE7',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11.5px',
              color: '#166534'
            }}>
              <ShieldCheck style={{ width: '16px', height: '16px', color: '#059669', flexShrink: 0 }} />
              <span>
                <strong>Autonomous Chain of Custody:</strong> All CCTV snapshots and bounding boxes are cryptographically sealed with timestamp watermarks. No automatic legal fines are issued without authorized human verification.
              </span>
            </div>
          </div>

          {/* 2. Law Breaker Incident Dossier & Minimalist Reports (In that free space) */}
            <LawEnforcementReportCard
              onEscalateToAdmin={(dossier) => {
                if (escalateSurveillanceIncident) {
                  escalateSurveillanceIncident(
                    dossier.id,
                    '🏛️ Government Administrator (Municipal Ward Executive)',
                    `Official civic violation report: ${dossier.problem} at ${dossier.area}. Identified offender: ${dossier.offenderDetails}. Requesting administrative penalty order.`
                  );
                }
              }}
              onDispatchSquad={(dossier) => {
                handleOpenActionDialog(dossier, 'Action Taken');
              }}
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. MODALS
         ══════════════════════════════════════════════════════════════════════ */}
      {/* Evidence Package Modal */}
      {selectedEvidenceIncident && (
        <EvidencePackageModal
          isOpen={Boolean(selectedEvidenceIncident)}
          onClose={() => setSelectedEvidenceIncident(null)}
          incident={selectedEvidenceIncident}
          onForward={() => {
            const inc = selectedEvidenceIncident;
            setSelectedEvidenceIncident(null);
            setSelectedEscalateIncident(inc);
          }}
        />
      )}

      {/* Authority Escalation Modal */}
      {selectedEscalateIncident && (
        <AuthorityEscalationModal
          isOpen={Boolean(selectedEscalateIncident)}
          onClose={() => setSelectedEscalateIncident(null)}
          incident={selectedEscalateIncident}
        />
      )}

      {/* Inline Quick Action / Resolution Dialog */}
      {actionDialogState.isOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '480px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap style={{ width: '16px', height: '16px', color: '#059669' }} />
                <span>Record Municipal {actionDialogState.actionType}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActionDialogState({ isOpen: false, incident: null, actionType: '', note: '' })}
                style={{ background: 'transparent', border: 'none', fontSize: '18px', color: '#94A3B8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Incident ID:</div>
              <strong style={{ fontSize: '13px', color: '#0F172A', fontFamily: 'monospace' }}>
                {actionDialogState.incident?.id} ({actionDialogState.incident?.location})
              </strong>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '6px' }}>
                Official Action / Closeout Remarks:
              </label>
              <textarea
                rows={3}
                value={actionDialogState.note}
                onChange={e => setActionDialogState(prev => ({ ...prev, note: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => setActionDialogState({ isOpen: false, incident: null, actionType: '', note: '' })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActionDialog}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  background: '#059669',
                  border: 'none',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                }}
              >
                Confirm {actionDialogState.actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
