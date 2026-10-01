import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Layers, 
  Network, 
  Users, 
  ArrowRight, 
  Sparkles,
  Building,
  Flame,
  Check,
  Filter,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function TerritoryProblemModal({ isOpen, onClose, selectedWard = 'Ward 14 (Rohini Sector 14)' }) {
  const { getTerritoryProblemBreakdown, grievances = [], civicIncidents = [] } = useApp();
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'pending' | 'solved' | 'mapped'
  const [filterPocket, setFilterPocket] = useState('ALL');

  if (!isOpen) return null;

  const territoryData = getTerritoryProblemBreakdown(selectedWard);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '920px',
        width: '100%',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -12px rgba(15, 23, 42, 0.4)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        animation: 'modalCenterScale 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* ── Modal Header ── */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F1F5F9',
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                background: '#10B981',
                color: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '999px',
                letterSpacing: '0.02em'
              }}>
                🏛️ MUNICIPAL TERRITORY JURISDICTION
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                Zone North-West • Official Duty Boundary
              </span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
              {selectedWard} Territory Problem Explorer
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 150ms ease'
            }}
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* ── Priority Red-Alert Highlight Section ── */}
        <div style={{
          background: '#FFF1F2',
          borderBottom: '1px solid #FECDD3',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#E11D48',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              flexShrink: 0
            }}>
              🚨
            </span>
            <div>
              <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#9F1239' }}>
                Priority Urgent Area: Pocket 2 Main Trunkline Corridor
              </span>
              <span style={{ fontSize: '11.5px', color: '#BE123C', display: 'block' }}>
                14 linked complaints • Subsurface drinking water contamination risk • Emergency squad mobilised
              </span>
            </div>
          </div>

          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            background: '#FFE4E6',
            color: '#E11D48',
            border: '1px solid #FDA4AF',
            padding: '3px 10px',
            borderRadius: '999px'
          }}>
            URGENT ATTENTION
          </span>
        </div>

        {/* ── 4 Navigation Tabs ── */}
        <div style={{
          display: 'flex',
          gap: '6px',
          padding: '12px 24px',
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {[
            { id: 'today', label: "📅 Today's Problems", count: territoryData.today.length, color: '#2563EB', bg: '#EFF6FF' },
            { id: 'pending', label: '⏳ Pending Repairs', count: territoryData.pending.length, color: '#D97706', bg: '#FEF3C7' },
            { id: 'solved', label: '🟢 All Solved & Verified', count: territoryData.solved.length, color: '#059669', bg: '#ECFDF5' },
            { id: 'mapped', label: '🧬 Mapped vs Unique', count: `${territoryData.mapped.length} Clustered`, color: '#4F46E5', bg: '#EEF2FF' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontSize: '12.5px',
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? '#0F172A' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: `1px solid ${isActive ? '#0F172A' : '#CBD5E1'}`,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 2px 6px rgba(15, 23, 42, 0.15)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 800,
                  padding: '1px 7px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255, 255, 255, 0.22)' : tab.bg,
                  color: isActive ? '#FFFFFF' : tab.color
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Modal Body / Content ── */}
        <div style={{
          padding: '20px 24px',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          
          {/* TAB 1: TODAY'S PROBLEMS */}
          {activeTab === 'today' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  Fresh Complaints Ingested Today ({territoryData.today.length})
                </span>
                <span style={{ fontSize: '11px', color: '#64748B' }}>
                  Sorted by urgency & arrival time
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {territoryData.today.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: '#FFFFFF',
                      border: g.urgency === 'CRITICAL' ? '1.5px solid #FECACA' : '1px solid #E2E8F0',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '999px',
                          background: g.urgency === 'CRITICAL' ? '#FEF2F2' : '#EFF6FF',
                          color: g.urgency === 'CRITICAL' ? '#DC2626' : '#2563EB',
                          border: `1px solid ${g.urgency === 'CRITICAL' ? '#FCA5A5' : '#BFDBFE'}`
                        }}>
                          {g.urgency || 'MEDIUM'}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                          {g.id}
                        </span>
                        <span style={{ fontSize: '11px', color: '#64748B' }}>
                          📍 {g.location?.area || 'Sector 14'}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>
                        {g.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                        {g.descriptionRaw?.slice(0, 100) || 'Citizen reported issue.'}...
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link
                        to={`/citizen/complaints/${g.id}`}
                        onClick={onClose}
                        style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          padding: '7px 14px',
                          borderRadius: '999px',
                          background: '#0F172A',
                          color: '#FFFFFF',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>Inspect</span>
                        <ArrowRight style={{ width: '12px', height: '12px' }} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PENDING REPAIRS */}
          {activeTab === 'pending' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                  Ongoing Ground Work & Assigned Squads ({territoryData.pending.length})
                </span>
                <span style={{ fontSize: '11px', color: '#D97706', fontWeight: 700 }}>
                  ⏱️ SLA Deadlines Active
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {territoryData.pending.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '10px'
                    }}
                  >
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '999px',
                          background: '#FEF3C7',
                          color: '#B45309',
                          border: '1px solid #FCD34D'
                        }}>
                          ● IN PROGRESS
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', fontFamily: 'var(--font-mono)' }}>
                          {g.id}
                        </span>
                        <span style={{ fontSize: '11px', color: '#78350F' }}>
                          ⏱️ Fix Target: {g.slaHoursLeft || 18}h Left
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', margin: '0 0 2px 0' }}>
                        {g.title}
                      </h4>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                        Assigned Officer: <strong>{g.officerName || 'Er. Sanjay Sharma'}</strong> • Department: {g.department}
                      </p>
                    </div>

                    <Link
                      to={`/citizen/complaints/${g.id}`}
                      onClick={onClose}
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '7px 14px',
                        borderRadius: '999px',
                        background: '#D97706',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>Update Status</span>
                      <ArrowRight style={{ width: '12px', height: '12px' }} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SOLVED & VERIFIED (ALL GREEN CARDS) */}
          {activeTab === 'solved' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#065F46' }}>
                  🟢 Verified Solved Cases in {selectedWard} ({territoryData.solved.length})
                </span>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                  ✓ 100% Citizen Verified
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {territoryData.solved.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: '#F0FDF4',
                      border: '1.5px solid #86EFAC',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: '#DCFCE7',
                          color: '#15803D',
                          border: '1px solid #BBF7D0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                          RESOLVED & VERIFIED
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#166534', fontFamily: 'var(--font-mono)' }}>
                          {g.id}
                        </span>
                      </div>

                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', background: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
                        ⭐ Citizen Rating: 5.0 / 5.0
                      </span>
                    </div>

                    <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {g.title}
                    </h4>

                    <p style={{ fontSize: '12px', color: '#166534', margin: 0, lineHeight: 1.4 }}>
                      <strong>Resolution Note: </strong>{g.resolutionNotes || 'Defect rectified on ground, pipeline pressure stabilized, and quality test verified.'}
                    </p>

                    <div style={{
                      paddingTop: '8px',
                      borderTop: '1px solid #BBF7D0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11.5px',
                      color: '#15803D'
                    }}>
                      <span>Officer: <strong>{g.officerName || 'Er. Sanjay Sharma'}</strong></span>
                      <span>Verified: <strong>Ground Photo & GPS Confirmed ✓</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MAPPED VS UNIQUE PROBLEM AGGREGATOR */}
          {activeTab === 'mapped' && (
            <div>
              <div style={{
                background: '#EEF2FF',
                borderRadius: '14px',
                padding: '14px 18px',
                border: '1px solid #C7D2FE',
                marginBottom: '16px'
              }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#3730A3', margin: '0 0 4px 0' }}>
                  🧬 AI Problem Deduplication & Incident Mapping
                </h4>
                <p style={{ fontSize: '12px', color: '#4338CA', margin: 0, lineHeight: 1.4 }}>
                  Civic Intelligence links multiple identical complaints in the same corridor into <strong>1 Systemic Incident</strong>, saving officer manpower and avoiding duplicate repair orders.
                </p>
              </div>

              {/* Mapped Clusters */}
              <div style={{ marginBottom: '20px' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                  🔗 Clustered & Mapped Problems ({territoryData.mapped.length} Reports $\rightarrow$ 1 Incident)
                </h5>

                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#FFFFFF',
                  border: '1.5px solid #818CF8',
                  boxShadow: '0 4px 14px rgba(79, 70, 229, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#4338CA', background: '#EEF2FF', padding: '2px 8px', borderRadius: '6px' }}>
                      CLUSTER ID: CL-ROHINI-01
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                      1 Work Order Dispatched (0 Duplicates)
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0' }}>
                    Rohini Sector 14 Main Water Line Contamination & Pressure Drop
                  </h4>

                  <p style={{ fontSize: '12.5px', color: '#475569', marginBottom: '10px' }}>
                    18 separate citizens reported discolored tap water in Pocket 2. Instead of dispatching 18 inspection vans, all complaints are linked under Incident <strong>INC-2026-DEL-14</strong>.
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {territoryData.mapped.slice(0, 6).map((g) => (
                      <span key={g.id} style={{ fontSize: '11px', background: '#F1F5F9', color: '#334155', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        ● {g.id} ({g.citizenName || 'Citizen'})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Standalone Unique Complaints */}
              <div>
                <h5 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '10px' }}>
                  📌 Standalone Unique Complaints ({territoryData.unique.length})
                </h5>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {territoryData.unique.map((g) => (
                    <div key={g.id} style={{ padding: '12px 14px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', fontFamily: 'var(--font-mono)' }}>{g.id}</span>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{g.title}</div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '999px' }}>
                        Individual Task
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ── Modal Footer ── */}
        <div style={{
          padding: '14px 24px',
          background: '#FAFAFC',
          borderTop: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Territory Status: <strong>All {territoryData.total} complaints mapped & monitored in real-time</strong>
          </span>

          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: '999px',
              background: '#0F172A',
              color: '#FFFFFF',
              fontSize: '12.5px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
}
