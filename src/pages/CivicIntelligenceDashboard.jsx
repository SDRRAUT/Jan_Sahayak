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
  CheckCircle2 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProblemSpreadMap from '../components/intelligence/ProblemSpreadMap';
import CrossDepartmentMatrix from '../components/intelligence/CrossDepartmentMatrix';
import CivicMemoryCard from '../components/intelligence/CivicMemoryCard';
import CivicSignalModal from '../components/intelligence/CivicSignalModal';
import LiveComplaintLinkageSection from '../components/intelligence/LiveComplaintLinkageSection';

export default function CivicIntelligenceDashboard() {
  const { civicIncidents = [], civicSignals = [], intelligenceMetrics = {} } = useApp();
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignalModal, setShowSignalModal] = useState(false);

  const filteredIncidents = civicIncidents.filter(inc => {
    const matchesStage = selectedStage === 'ALL' || inc.stage === selectedStage;
    const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inc.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="section-spacing" style={{ paddingTop: '28px', minHeight: '80vh' }}>
      <div className="container">
        {/* Top Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-divider)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="category-pill" style={{ background: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE' }}>
                <Sparkles style={{ width: '12px', height: '12px', color: '#4F46E5' }} />
                CIVIC INTELLIGENCE SUITE
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                • 100 Complaints → 1 Actionable Incident
              </span>
            </div>
            <h1 style={{ fontSize: '32px', color: 'var(--color-text-primary)', letterSpacing: '-0.025em' }}>
              Civic Intelligence & Emerging Problem Discovery
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px', maxWidth: '780px' }}>
              Synthesizes weak citizen signals, Complaint DNA, and historical memory to identify systemic infrastructure breakdowns before they overwhelm public authorities.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowSignalModal(true)}
              className="btn-primary"
              style={{
                height: '42px',
                fontSize: '13px',
                padding: '0 18px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Radio style={{ width: '15px', height: '15px' }} />
              <span>Report Civic Signal</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Intelligence Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: '#FFFFFF',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Active Civic Incidents
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {civicIncidents.length}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#DC2626' }}>
                (2 Multi-Ward)
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
              Clustered from 67 individual reports
            </span>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: '#FFFFFF',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Weak Signals Ingested
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#4338CA' }}>
                {civicSignals.length + 42}
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
                ↑ 34% early capture
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
              Pre-complaint citizen observations
            </span>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: '#FFFFFF',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Cross-Department Incidents
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: '#D97706' }}>
                2
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                (DJB + PWD + MCD)
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
              Shared infrastructure root issues
            </span>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: 'var(--radius-lg)',
            background: '#FFFFFF',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
              Avg Problem Discovery
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--color-primary)' }}>
                6.2h
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>
                (vs 96h legacy)
              </span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-secondary)', marginTop: '4px', display: 'block' }}>
              93.5% faster detection speed
            </span>
          </div>
        </div>

        {/* Live Citizen Signal Linkage & Incident Aggregation Engine */}
        <LiveComplaintLinkageSection />

        {/* Geographic Problem Spread Map */}
        <div style={{ marginBottom: '32px' }}>
          <ProblemSpreadMap incident={civicIncidents[0]} spreadGeo={civicIncidents[0]?.spreadGeo} />
        </div>

        {/* Section: Active Civic Incidents Workspace */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <h2 style={{ fontSize: '22px', color: 'var(--color-text-primary)' }}>
                Actionable Civic Incidents
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                Aggregated problem clusters under active multi-department investigation
              </p>
            </div>

            {/* Stage Filter Buttons & Search */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: 'var(--radius-full)' }}>
                {['ALL', 'CRITICAL', 'GROWING', 'EMERGING'].map((stg) => (
                  <button
                    key={stg}
                    type="button"
                    onClick={() => setSelectedStage(stg)}
                    style={{
                      fontSize: '11.5px',
                      fontWeight: selectedStage === stg ? 700 : 500,
                      padding: '4px 12px',
                      borderRadius: 'var(--radius-full)',
                      background: selectedStage === stg ? '#FFFFFF' : 'transparent',
                      color: selectedStage === stg ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      boxShadow: selectedStage === stg ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Incident Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  padding: '22px',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'all 150ms ease'
                }}
              >
                {/* Card Top Row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className={`stage-pill ${incident.stage?.toLowerCase()}`}>
                        ● {incident.stage}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                        {incident.id}
                      </span>
                      <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 600 }}>
                        {incident.stageVelocity}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '19px', color: 'var(--color-text-primary)' }}>
                      {incident.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Connected Signals</span>
                      <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                        {incident.signalCount || incident.complaintCount || 1} <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 400 }}>({incident.formalComplaintsCount || incident.complaintCount || 1} Formal + {incident.citizenObservationsCount || 0} Signals)</span>
                      </strong>
                    </div>

                    <Link
                      to={`/intelligence/incidents/${incident.id}`}
                      className="btn-primary"
                      style={{
                        height: '38px',
                        fontSize: '12.5px',
                        padding: '0 16px',
                        borderRadius: 'var(--radius-full)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <span>Investigate Incident</span>
                      <ArrowRight style={{ width: '13px', height: '13px' }} />
                    </Link>
                  </div>
                </div>

                <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  {incident.summary}
                </p>

                {/* Complaint DNA Chips */}
                {incident.complaintDna && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                    <span className="dna-chip">
                      <strong>Issue:</strong> {incident.complaintDna.issueType}
                    </span>
                    <span className="dna-chip">
                      <strong>Asset:</strong> {incident.complaintDna.asset}
                    </span>
                    <span className="dna-chip">
                      <strong>Jurisdiction:</strong> {incident.affectedArea}
                    </span>
                    <span className="dna-chip">
                      <strong>Population:</strong> {incident.affectedPopulation}
                    </span>
                  </div>
                )}

                {/* Bottom Row: Departments & Lead Root Cause */}
                <div style={{
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-divider)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  fontSize: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Departments:</span>
                    {(incident.departments || (incident.participatingDepartments || [incident.leadDepartment || 'MCD']).map(d => ({
                      name: typeof d === 'string' ? d : (d?.name || 'Department'),
                      cases: incident.complaintCount || 1,
                      lead: typeof d === 'string' ? d.includes(incident.leadDepartment?.split(' ')[0] || 'DJB') : !!d?.lead
                    }))).map((d) => (
                      <span
                        key={d.name}
                        style={{
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                          background: d.lead ? '#ECFDF5' : '#F1F5F9',
                          color: d.lead ? '#065F46' : '#475569',
                          fontWeight: 600,
                          fontSize: '11px',
                          border: d.lead ? '1px solid #A7F3D0' : '1px solid #E2E8F0'
                        }}
                      >
                        {d.name.split('(')[0].trim()} ({d.cases || 1}) {d.lead ? '★ Lead' : ''}
                      </span>
                    ))}
                  </div>

                  <div style={{ color: 'var(--color-text-muted)' }}>
                    First Detected: <strong>{(incident.firstDetectedAt && !incident.firstDetectedAt.includes('Invalid')) ? incident.firstDetectedAt : 'Recently observed'}</strong> • Status: <strong style={{ color: 'var(--color-primary)' }}>{incident.status}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Cross-Department Matrix & Civic Memory */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <CrossDepartmentMatrix crossDeptData={civicIncidents[0]?.crossDepartmentImpact} />
          <CivicMemoryCard memories={civicIncidents[0]?.civicMemory} />
        </div>
      </div>

      {/* Citizen Signal Submission Modal */}
      <CivicSignalModal
        isOpen={showSignalModal}
        onClose={() => setShowSignalModal(false)}
      />
    </div>
  );
}
