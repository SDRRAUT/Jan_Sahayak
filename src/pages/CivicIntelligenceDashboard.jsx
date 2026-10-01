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
  Compass
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

        {/* ── 4 Executive Metric Tiles ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          marginBottom: '24px'
        }}>
          {/* KPI 1 */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                Active Civic Incidents
              </span>
              <AlertTriangle style={{ width: '16px', height: '16px', color: '#DC2626' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                {civicIncidents.length}
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#DC2626', background: '#FEF2F2', padding: '1px 6px', borderRadius: '6px' }}>
                2 Multi-Ward
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Synthesized from 67 citizen reports
            </span>
          </div>

          {/* KPI 2 */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                Early Signals Ingested
              </span>
              <Radio style={{ width: '16px', height: '16px', color: '#4F46E5' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#4338CA', fontFamily: 'var(--font-mono)' }}>
                {civicSignals.length + 42}
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: '6px' }}>
                ↑ 34% Early Catch
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Audio & pre-complaint hints
            </span>
          </div>

          {/* KPI 3 */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                Multi-Dept Operations
              </span>
              <Building2 style={{ width: '16px', height: '16px', color: '#D97706' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-mono)' }}>
                2
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#92400E', background: '#FEF3C7', padding: '1px 6px', borderRadius: '6px' }}>
                DJB + PWD + MCD
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              Joint inter-agency work orders
            </span>
          </div>

          {/* KPI 4 */}
          <div style={{
            padding: '16px 20px',
            borderRadius: '16px',
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.04em' }}>
                Avg Problem Discovery
              </span>
              <Clock style={{ width: '16px', height: '16px', color: '#059669' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                6.2h
              </span>
              <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '1px 6px', borderRadius: '6px' }}>
                93% Faster
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: '#64748B', marginTop: '4px', display: 'block' }}>
              vs 96h traditional manual triage
            </span>
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
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
          marginBottom: '24px',
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
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? '#0F172A' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: 'none',
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
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : '#475569'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

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
                <div style={{ display: 'flex', background: '#FFFFFF', padding: '3px', borderRadius: '999px', border: '1px solid #E2E8F0' }}>
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
                        background: selectedStage === stg ? '#0F172A' : 'transparent',
                        color: selectedStage === stg ? '#FFFFFF' : '#475569',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      {stg}
                    </button>
                  ))}
                </div>

                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ward, keyword..."
                    style={{
                      height: '36px',
                      borderRadius: '999px',
                      border: '1px solid #CBD5E1',
                      padding: '0 14px 0 32px',
                      fontSize: '12.5px',
                      background: '#FFFFFF',
                      color: '#0F172A',
                      width: '200px'
                    }}
                  />
                  <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '14px', height: '14px', color: '#94A3B8' }} />
                </div>
              </div>
            </div>

            {/* Incident Cards Stack */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
              {filteredIncidents.map((incident) => {
                const isCritical = incident.stage === 'CRITICAL';
                const isGrowing = incident.stage === 'GROWING';

                return (
                  <div
                    key={incident.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '20px',
                      border: isCritical ? '1.5px solid #FECACA' : (isGrowing ? '1.5px solid #FED7AA' : '1px solid #E2E8F0'),
                      padding: '24px',
                      boxShadow: '0 4px 18px rgba(15, 23, 42, 0.05)',
                      transition: 'transform 150ms ease, box-shadow 150ms ease'
                    }}
                  >
                    {/* Top Row: Stage Badge + ID + Actions */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px',
                      marginBottom: '14px'
                    }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            background: isCritical ? '#FEF2F2' : (isGrowing ? '#FFF7ED' : '#F0FDF4'),
                            color: isCritical ? '#DC2626' : (isGrowing ? '#EA580C' : '#16A34A'),
                            border: `1px solid ${isCritical ? '#FCA5A5' : (isGrowing ? '#FDBA74' : '#86EFAC')}`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            ● {incident.stage || 'ACTIVE'}
                          </span>

                          <span style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#64748B',
                            fontFamily: 'var(--font-mono)',
                            background: '#F1F5F9',
                            padding: '3px 8px',
                            borderRadius: '6px'
                          }}>
                            {incident.id}
                          </span>

                          <span style={{
                            fontSize: '11px',
                            color: '#DC2626',
                            fontWeight: 700,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '3px'
                          }}>
                            <TrendingUp style={{ width: '13px', height: '13px' }} />
                            {incident.stageVelocity || '+48% reports today'}
                          </span>

                          <span style={{
                            fontSize: '11px',
                            color: '#0369A1',
                            fontWeight: 600,
                            background: '#F0F9FF',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            border: '1px solid #BAE6FD'
                          }}>
                            📍 {incident.affectedArea || 'Ward 14 (Rohini)'}
                          </span>
                        </div>

                        <h3 style={{
                          fontSize: '18px',
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: 0,
                          lineHeight: 1.3
                        }}>
                          {incident.title}
                        </h3>
                      </div>

                      {/* Primary Action Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Link
                          to={`/intelligence/incidents/${incident.id}`}
                          style={{
                            height: '42px',
                            padding: '0 18px',
                            borderRadius: '999px',
                            background: '#0F172A',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 2px 8px rgba(15, 23, 42, 0.18)',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <span>Investigate Action Plan</span>
                          <ArrowRight style={{ width: '14px', height: '14px' }} />
                        </Link>
                      </div>
                    </div>

                    {/* Plain Language Summary */}
                    <p style={{
                      fontSize: '13.5px',
                      color: '#334155',
                      lineHeight: 1.5,
                      marginBottom: '16px',
                      background: '#F8FAFC',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1px solid #E2E8F0'
                    }}>
                      <strong>Problem Summary: </strong>
                      {incident.summary}
                    </p>

                    {/* 3 High-Impact Executive Metric Chips */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '10px',
                      marginBottom: '16px'
                    }}>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE'
                      }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', display: 'block' }}>
                          👥 Impacted Residents
                        </span>
                        <strong style={{ fontSize: '14px', color: '#1E3A8A' }}>
                          {incident.affectedPopulation || '1,250 Residents'} ({incident.signalCount || incident.complaintCount || 1} Reports)
                        </strong>
                      </div>

                      <div style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0'
                      }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', display: 'block' }}>
                          🏛️ Lead Municipal Agency
                        </span>
                        <strong style={{ fontSize: '14px', color: '#064E3B' }}>
                          {incident.leadDepartment || 'Delhi Jal Board (DJB)'}
                        </strong>
                      </div>

                      <div style={{
                        padding: '10px 14px',
                        borderRadius: '12px',
                        background: '#FEF3C7',
                        border: '1px solid #FDE68A'
                      }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', display: 'block' }}>
                          ⏱️ Fix SLA Target
                        </span>
                        <strong style={{ fontSize: '14px', color: '#78350F' }}>
                          {incident.slaHoursLeft ? `${incident.slaHoursLeft}h Remaining` : 'Within 24 Hours'}
                        </strong>
                      </div>
                    </div>

                    {/* Probable Root Cause Callout */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12.5px',
                      color: '#475569',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      background: '#FFFFFF',
                      border: '1px dashed #CBD5E1',
                      marginBottom: '14px'
                    }}>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>💡 Root Cause:</span>
                      <span>
                        {incident.rootCause?.probable_root_cause || 
                         (incident.rootCauseHypotheses?.[0]?.title) ||
                         'Underground drainage backpressure and pipeline joint compromise.'}
                      </span>
                    </div>

                    {/* Bottom Row: Coordinating Departments */}
                    <div style={{
                      paddingTop: '12px',
                      borderTop: '1px solid #F1F5F9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px',
                      fontSize: '12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#64748B', fontWeight: 700 }}>Coordinating Agencies:</span>
                        {(incident.departments || (incident.participatingDepartments || [incident.leadDepartment || 'DJB', 'PWD', 'MCD']).map(d => ({
                          name: typeof d === 'string' ? d : (d?.name || 'Department'),
                          cases: incident.complaintCount || 1,
                          lead: typeof d === 'string' ? d.includes(incident.leadDepartment?.split(' ')[0] || 'DJB') : !!d?.lead
                        }))).map((d) => (
                          <span
                            key={d.name}
                            style={{
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: d.lead ? '#ECFDF5' : '#F1F5F9',
                              color: d.lead ? '#065F46' : '#475569',
                              fontWeight: 700,
                              fontSize: '11px',
                              border: d.lead ? '1px solid #A7F3D0' : '1px solid #E2E8F0'
                            }}
                          >
                            {d.name.split('(')[0].trim()} {d.lead ? '★ Lead' : ''}
                          </span>
                        ))}
                      </div>

                      <div style={{ color: '#64748B', fontSize: '11.5px' }}>
                        First Detected: <strong>{(incident.firstDetectedAt && !incident.firstDetectedAt.includes('Invalid')) ? incident.firstDetectedAt : 'Recently observed'}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
