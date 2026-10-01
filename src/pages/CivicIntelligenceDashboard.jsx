import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  Network, 
  MapPin, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Search, 
  Filter, 
  Radio, 
  Users, 
  Layers, 
  CheckCircle2,
  Activity,
  Zap,
  Building2,
  Flame,
  FileCheck,
  Compass,
  LayoutList,
  LayoutGrid,
  Table2,
  AlignJustify,
  Rows3
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProblemSpreadMap from '../components/intelligence/ProblemSpreadMap';
import CrossDepartmentMatrix from '../components/intelligence/CrossDepartmentMatrix';
import CivicMemoryCard from '../components/intelligence/CivicMemoryCard';
import CivicSignalModal from '../components/intelligence/CivicSignalModal';
import LiveComplaintLinkageSection from '../components/intelligence/LiveComplaintLinkageSection';
import TerritoryProblemModal from '../components/officer/TerritoryProblemModal';
import JanSuchnaModal from '../components/officer/JanSuchnaModal';

export default function CivicIntelligenceDashboard() {
  const { civicIncidents = [], civicSignals = [], intelligenceMetrics = {} } = useApp();
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'map' | 'clustering' | 'coordination'
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [showTerritoryModal, setShowTerritoryModal] = useState(false);
  const [showJanSuchnaModal, setShowJanSuchnaModal] = useState(false);
  const [viewMode, setViewMode] = useState('detail'); // 'detail' | 'compact' | 'grid' | 'table' | 'minimal'

  const filteredIncidents = civicIncidents.filter(inc => {
    const matchesStage = selectedStage === 'ALL' || inc.stage === selectedStage;
    const matchesSearch = (inc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inc.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inc.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inc.affectedArea || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="section-spacing" style={{ paddingTop: '24px', minHeight: '85vh', background: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* ── Top Header Banner (Center Aligned & Refined Muted Styling) ── */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 32px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 2px 12px rgba(15, 23, 42, 0.03)',
          marginBottom: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Overline Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 11px',
              borderRadius: '999px',
              background: '#F1F5F9',
              color: '#475569',
              border: '1px solid #CBD5E1',
              letterSpacing: '0.02em'
            }}>
              <Sparkles style={{ width: '12px', height: '12px', color: '#6366F1' }} />
              CIVIC INTELLIGENCE HUB
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#065F46',
              background: '#F0FDF4',
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid #A7F3D0'
            }}>
              ● 100 Complaints → 1 Actionable Plan
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.025em',
            margin: '0 0 6px 0',
            lineHeight: 1.25
          }}>
            Civic Intelligence & Emerging Problem Discovery
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '13.5px',
            color: '#64748B',
            margin: '0 auto',
            maxWidth: '740px',
            lineHeight: 1.5,
            fontWeight: 500
          }}>
            Detects early community warning signals, clusters duplicate complaints into unified incidents, and coordinates joint municipal repair teams.
          </p>

          {/* Center-Aligned Action Buttons with Calmer, Refined Colors */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            {/* Button 1: Territory Problem Explorer */}
            <button
              type="button"
              onClick={() => setShowTerritoryModal(true)}
              style={{
                height: '40px',
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '0 18px',
                borderRadius: '999px',
                background: '#0F172A',
                color: '#FFFFFF',
                border: '1px solid #0F172A',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                boxShadow: '0 2px 6px rgba(15, 23, 42, 0.12)',
                transition: 'all 150ms ease'
              }}
            >
              <Compass style={{ width: '14px', height: '14px', color: '#38BDF8' }} />
              <span>🗺️ Territory Problem Explorer</span>
            </button>

            {/* Button 2: Jan Suchna Broadcast */}
            <button
              type="button"
              onClick={() => setShowJanSuchnaModal(true)}
              style={{
                height: '40px',
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '0 18px',
                borderRadius: '999px',
                background: '#FFFFFF',
                color: '#334155',
                border: '1.5px solid #CBD5E1',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                transition: 'all 150ms ease'
              }}
            >
              <Radio style={{ width: '14px', height: '14px', color: '#D97706' }} />
              <span>📢 Create Jan Suchna Broadcast</span>
            </button>

            {/* Button 3: Report Early Warning Signal */}
            <button
              type="button"
              onClick={() => setShowSignalModal(true)}
              style={{
                height: '40px',
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '0 18px',
                borderRadius: '999px',
                background: '#F8FAFC',
                color: '#475569',
                border: '1.5px solid #E2E8F0',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)',
                transition: 'all 150ms ease'
              }}
            >
              <Radio style={{ width: '14px', height: '14px', color: '#059669' }} />
              <span>+ Report Signal</span>
            </button>
          </div>
        </div>

        {/* ── 4 Executive Metric Tiles (Minimalist & Easy to Read) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* KPI 1 - Light Red/Rose */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)',
            border: '1px solid #FECACA',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>
                Active Incidents
              </span>
              <AlertTriangle style={{ width: '15px', height: '15px', color: '#DC2626' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#7F1D1D' }}>
                {civicIncidents.length}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', background: '#FFFFFF', border: '1px solid #FCA5A5', padding: '2px 8px', borderRadius: '6px' }}>
                2 Multi-Ward
              </span>
            </div>
          </div>

          {/* KPI 2 - Light Indigo/Purple */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            border: '1px solid #C7D2FE',
            boxShadow: '0 2px 6px rgba(79, 70, 229, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#3730A3' }}>
                Signals Detected
              </span>
              <Radio style={{ width: '15px', height: '15px', color: '#4F46E5' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#312E81' }}>
                {civicSignals.length + 42}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#FFFFFF', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '6px' }}>
                +34% Early
              </span>
            </div>
          </div>

          {/* KPI 3 - Light Amber/Orange */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            boxShadow: '0 2px 6px rgba(217, 119, 6, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>
                Joint Operations
              </span>
              <Building2 style={{ width: '15px', height: '15px', color: '#D97706' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#78350F' }}>
                2
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', background: '#FFFFFF', border: '1px solid #FCD34D', padding: '2px 8px', borderRadius: '6px' }}>
                Multi-Agency
              </span>
            </div>
          </div>

          {/* KPI 4 - Light Emerald/Green */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '1px solid #A7F3D0',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#065F46' }}>
                Avg Discovery Speed
              </span>
              <Clock style={{ width: '15px', height: '15px', color: '#059669' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#064E3B' }}>
                6.2h
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#FFFFFF', border: '1px solid #6EE7B7', padding: '2px 8px', borderRadius: '6px' }}>
                93% Faster
              </span>
            </div>
          </div>
        </div>

        {/* ── 4 Streamlined Navigation Tabs ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {[
            { id: 'incidents', label: '🚨 Active Incidents & Radar', badge: filteredIncidents.length },
            { id: 'map', label: '🗺️ Problem Spread Map', badge: 'Live GIS' },
            { id: 'clustering', label: '⚡ How AI Clusters Complaints', badge: '3-Step Flow' },
            { id: 'coordination', label: '🤝 Multi-Agency Coordination', badge: 'RACI Matrix' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? '#090D16' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: isActive ? '1px solid #000000' : 'none',
                  boxShadow: isActive ? '0 3px 10px rgba(0, 0, 0, 0.25)' : 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 150ms ease'
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: isActive ? '#1E293B' : '#F1F5F9',
                    color: isActive ? '#38BDF8' : '#475569',
                    border: isActive ? '1px solid #334155' : 'none'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dark prominent divider line under navigation */}
        <div style={{ height: '2px', background: '#334155', borderRadius: '999px', marginBottom: '24px', opacity: 0.85 }} />

        {/* ══════════════════════════════════════════════════════════
            TAB 1: ACTIVE INCIDENTS & RADAR
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'incidents' && (
          <div>
            {/* Filter Bar & Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Active Civic Incidents ({filteredIncidents.length})
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px', margin: 0 }}>
                  Grouped problem clusters currently under active multi-department remediation
                </p>
              </div>

              {/* Stage Filter Buttons & Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', background: '#FFFFFF', padding: '3px', borderRadius: '999px', border: '1.5px solid #A7F3D0', boxShadow: '0 1px 3px rgba(16, 185, 129, 0.08)' }}>
                  {['ALL', 'CRITICAL', 'GROWING', 'EMERGING'].map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setSelectedStage(stg)}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: selectedStage === stg ? 700 : 500,
                        padding: '4px 12px',
                        borderRadius: '999px',
                        border: 'none',
                        background: selectedStage === stg ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                        color: selectedStage === stg ? '#FFFFFF' : '#065F46',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        boxShadow: selectedStage === stg ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
                      }}
                    >
                      {stg}
                    </button>
                  ))}
                </div>

                {/* Light styled search box */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ward, keyword..."
                    style={{
                      height: '36px',
                      borderRadius: '999px',
                      border: '1.5px solid #BAE6FD',
                      padding: '0 14px 0 32px',
                      fontSize: '12.5px',
                      background: '#F0F9FF',
                      color: '#0369A1',
                      fontWeight: 500,
                      width: '210px',
                      boxShadow: '0 1px 3px rgba(2, 132, 199, 0.08)'
                    }}
                  />
                  <Search style={{ position: 'absolute', left: '11px', top: '11px', width: '14px', height: '14px', color: '#0284C7' }} />
                </div>

                {/* Light styled View Mode Toggles */}
                <div style={{
                  display: 'flex',
                  background: '#F8FAFC',
                  padding: '3px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  gap: '3px',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
                }}>
                  {[
                    { id: 'detail',  Icon: AlignJustify, title: 'Detail View' },
                    { id: 'compact', Icon: LayoutList,   title: 'Compact View' },
                    { id: 'grid',    Icon: LayoutGrid,   title: 'Grid View' },
                    { id: 'table',   Icon: Table2,       title: 'Table View' },
                    { id: 'minimal', Icon: Rows3,        title: 'Minimal View' },
                  ].map(({ id, Icon, title }) => (
                    <button
                      key={id}
                      type="button"
                      title={title}
                      onClick={() => setViewMode(id)}
                      style={{
                        width: '30px', height: '30px',
                        borderRadius: '7px',
                        border: 'none',
                        background: viewMode === id ? '#FFFFFF' : 'transparent',
                        color: viewMode === id ? '#0284C7' : '#64748B',
                        boxShadow: viewMode === id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 120ms ease'
                      }}
                    >
                      <Icon style={{ width: '14px', height: '14px' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ MULTI-VIEW INCIDENT RENDERER ═══ */}

            {/* VIEW 1 — DETAIL (default): Full expanded cards */}
            {viewMode === 'detail' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
                {filteredIncidents.map((incident) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <div key={incident.id} style={{ background: '#FFFFFF', borderRadius: '20px', border: isCritical ? '1.5px solid #FECACA' : isGrowing ? '1.5px solid #FED7AA' : '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 18px rgba(15,23,42,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: isCritical ? '#FEF2F2' : isGrowing ? '#FFF7ED' : '#F0FDF4', color: isCritical ? '#DC2626' : isGrowing ? '#EA580C' : '#16A34A', border: isCritical ? '1px solid #FCA5A5' : isGrowing ? '1px solid #FDBA74' : '1px solid #86EFAC' }}>● {incident.stage || 'ACTIVE'}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', fontFamily: 'monospace', background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>{incident.id}</span>
                            <span style={{ fontSize: '11px', color: '#0369A1', fontWeight: 600, background: '#F0F9FF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #BAE6FD' }}>📍 {incident.affectedArea || 'Ward 29'}</span>
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>{incident.title}</h3>
                        </div>
                        {/* Green Investigate Action Plan Button */}
                        <Link to={`/intelligence/incidents/${incident.id}`} style={{
                          height: '42px',
                          padding: '0 20px',
                          borderRadius: '999px',
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                          transition: 'all 150ms ease'
                        }}>
                          <span>Investigate Action Plan</span><ArrowRight style={{ width: '15px', height: '15px' }} />
                        </Link>
                      </div>
                      <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5, marginBottom: '16px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}><strong>Problem Summary: </strong>{incident.summary}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}><span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', display: 'block' }}>👥 Impacted Residents</span><strong style={{ fontSize: '14px', color: '#1E3A8A' }}>{incident.affectedPopulation || '~120 Citizens'} ({incident.signalCount || incident.complaintCount || 1} Reports)</strong></div>
                        <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}><span style={{ fontSize: '10.5px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', display: 'block' }}>🏛️ Lead Municipal Agency</span><strong style={{ fontSize: '14px', color: '#064E3B' }}>{incident.leadDepartment || 'PMC Water Supply Department'}</strong></div>
                        <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#FEF3C7', border: '1px solid #FDE68A' }}><span style={{ fontSize: '10.5px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', display: 'block' }}>⏱️ Fix SLA Target</span><strong style={{ fontSize: '14px', color: '#78350F' }}>{incident.slaHoursLeft ? `${incident.slaHoursLeft}h Remaining` : 'Within 24 Hours'}</strong></div>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', padding: '8px 12px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', marginBottom: '14px' }}><span style={{ fontWeight: 700, color: '#0F172A' }}>💡 Root Cause: </span>{incident.rootCause?.probable_root_cause || incident.rootCauseHypotheses?.[0]?.title || 'Infrastructure capacity constraint.'}</div>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}><span style={{ color: '#64748B', fontWeight: 700 }}>Coordinating Agencies:</span><span style={{ padding: '2px 8px', borderRadius: '999px', background: '#ECFDF5', color: '#065F46', fontWeight: 700, fontSize: '11px', border: '1px solid #A7F3D0' }}>{(incident.leadDepartment || 'PMC').split('(')[0].trim()} ★ Lead</span></div>
                        <span style={{ color: '#64748B', fontSize: '11.5px' }}>First Detected: <strong>{incident.firstDetectedAt && !incident.firstDetectedAt.includes('Invalid') ? incident.firstDetectedAt : 'Recently'}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 2 — COMPACT: Slim rows */}
            {viewMode === 'compact' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                {filteredIncidents.map((incident) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <div key={incident.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FFFFFF', borderRadius: '12px', border: isCritical ? '1px solid #FECACA' : isGrowing ? '1px solid #FED7AA' : '1px solid #E2E8F0', padding: '12px 16px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isCritical ? '#EF4444' : isGrowing ? '#F97316' : '#22C55E', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', fontFamily: 'monospace', flexShrink: 0 }}>{incident.id}</span>
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{incident.title}</span>
                      <span style={{ fontSize: '11px', color: '#64748B', flexShrink: 0 }}>{incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', flexShrink: 0 }}>{incident.leadDepartment?.split('(')[0]?.trim() || 'PMC'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: incident.slaHoursLeft < 6 ? '#EF4444' : '#059669', background: incident.slaHoursLeft < 6 ? '#FEF2F2' : '#ECFDF5', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>{incident.slaHoursLeft ? `${incident.slaHoursLeft}h` : '24h'} SLA</span>
                      <Link to={`/intelligence/incidents/${incident.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#059669', color: '#FFFFFF', textDecoration: 'none', flexShrink: 0, boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)' }}><ArrowRight style={{ width: '14px', height: '14px' }} /></Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 3 — GRID: 2-column cards */}
            {viewMode === 'grid' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {filteredIncidents.map((incident) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <div key={incident.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: isCritical ? '1.5px solid #FECACA' : isGrowing ? '1.5px solid #FED7AA' : '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: isCritical ? '#FEF2F2' : isGrowing ? '#FFF7ED' : '#F0FDF4', color: isCritical ? '#DC2626' : isGrowing ? '#EA580C' : '#16A34A' }}>● {incident.stage || 'ACTIVE'}</span>
                        <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>{incident.id}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A', lineHeight: 1.35 }}>{incident.title}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: 1.4, flex: 1 }}>{(incident.summary || '').slice(0, 100)}{incident.summary?.length > 100 ? '…' : ''}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: '#0369A1', background: '#F0F9FF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #BAE6FD' }}>📍 {incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</span>
                        <span style={{ fontSize: '11px', color: '#92400E', background: '#FEF3C7', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FDE68A' }}>⏱️ {incident.slaHoursLeft ? `${incident.slaHoursLeft}h` : '24h'}</span>
                      </div>
                      <Link to={`/intelligence/incidents/${incident.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)' }}>Investigate <ArrowRight style={{ width: '13px', height: '13px' }} /></Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 4 — TABLE: Spreadsheet-style */}
            {viewMode === 'table' && (
              <div style={{ marginBottom: '32px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      {['Stage', 'ID', 'Title', 'Area', 'Lead Dept', 'Reports', 'SLA', ''].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.map((incident, idx) => {
                      const isCritical = incident.stage === 'CRITICAL';
                      const isGrowing  = incident.stage === 'GROWING';
                      return (
                        <tr key={incident.id} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                          <td style={{ padding: '10px 14px' }}><span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', background: isCritical ? '#FEF2F2' : isGrowing ? '#FFF7ED' : '#F0FDF4', color: isCritical ? '#DC2626' : isGrowing ? '#EA580C' : '#16A34A' }}>● {incident.stage || 'ACTIVE'}</span></td>
                          <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748B', fontSize: '11px' }}>{incident.id}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A', maxWidth: '260px' }}>{incident.title}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{incident.leadDepartment?.split('(')[0]?.trim() || 'PMC'}</td>
                          <td style={{ padding: '10px 14px', color: '#0F172A', fontWeight: 700, textAlign: 'center' }}>{incident.signalCount || incident.complaintCount || 1}</td>
                          <td style={{ padding: '10px 14px' }}><span style={{ fontWeight: 700, color: incident.slaHoursLeft < 6 ? '#EF4444' : '#059669' }}>{incident.slaHoursLeft ? `${incident.slaHoursLeft}h` : '24h'}</span></td>
                          <td style={{ padding: '10px 14px' }}><Link to={`/intelligence/incidents/${incident.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '28px', padding: '0 10px', borderRadius: '6px', background: '#059669', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 1px 4px rgba(5, 150, 105, 0.25)' }}>View <ArrowRight style={{ width: '11px', height: '11px' }} /></Link></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 5 — MINIMAL: Ultra-clean text list */}
            {viewMode === 'minimal' && (
              <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column' }}>
                {filteredIncidents.map((incident, idx) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <Link key={incident.id} to={`/intelligence/incidents/${incident.id}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 4px', borderBottom: '1px solid #F1F5F9', textDecoration: 'none', transition: 'background 120ms ease' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isCritical ? '#EF4444' : isGrowing ? '#F97316' : '#22C55E', flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>{incident.title}</span>
                      <span style={{ fontSize: '11.5px', color: '#94A3B8', flexShrink: 0 }}>{incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: isCritical ? '#EF4444' : isGrowing ? '#F97316' : '#22C55E', flexShrink: 0 }}>{incident.stage}</span>
                      <ArrowRight style={{ width: '14px', height: '14px', color: '#CBD5E1', flexShrink: 0 }} />
                    </Link>
                  );
                })}
              </div>
            )}

            </div>
          )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2: GEOSPATIAL PROBLEM SPREAD MAP
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'map' && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  🗺️ Geospatial Problem Spread Map
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Visualize how unaddressed pipeline or drainage issues spread across neighborhood wards over time.
                </p>
              </div>
            </div>

            <ProblemSpreadMap incident={civicIncidents[0]} spreadGeo={civicIncidents[0]?.spreadGeo} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 3: AI COMPLAINT CLUSTERING FLOW
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'clustering' && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                ⚡ How AI Combines 100 Citizen Complaints into 1 Action Plan
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
                Instead of creating 100 separate tickets for the same broken pipe, JanSahayak uses Complaint DNA & geospatial proximity to link them together into a single municipal work order.
              </p>
            </div>

            <LiveComplaintLinkageSection />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 4: MULTI-AGENCY COORDINATION & MEMORY
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'coordination' && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                🤝 Inter-Department Coordination & Historical Memory
              </h3>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
                Clear breakdown of lead vs supporting departments to prevent blame games and check recurring problem patterns from previous years.
              </p>
            </div>

            <div className="responsive-side-by-side" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              <CrossDepartmentMatrix crossDeptData={civicIncidents[0]?.crossDepartmentImpact} />
              <CivicMemoryCard memories={civicIncidents[0]?.civicMemory} />
            </div>
          </div>
        )}

      </div>

      {/* Territory Problem Explorer Modal (Today, Pending, Solved + Wagholi Pockets) */}
      <TerritoryProblemModal
        isOpen={showTerritoryModal}
        onClose={() => setShowTerritoryModal(false)}
        selectedWard="Wagholi Municipal Ward 27-31"
      />

      {/* Jan Suchna (जन सूचना) Broadcast Modal */}
      <JanSuchnaModal
        isOpen={showJanSuchnaModal}
        onClose={() => setShowJanSuchnaModal(false)}
      />

      {/* Citizen Signal Submission Modal */}
      <CivicSignalModal
        isOpen={showSignalModal}
        onClose={() => setShowSignalModal(false)}
      />
    </div>
  );
}
