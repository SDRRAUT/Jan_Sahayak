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
  Eye,
  Camera,
  Wrench,
  Activity,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

export default function TerritoryProblemModal({ isOpen, onClose, selectedWard = 'Ward 14 (Rohini Sector 14 & Wagholi Sub-Division)' }) {
  const { getTerritoryProblemBreakdown, grievances = [], civicIncidents = [] } = useApp();
  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'pending' | 'solved' | 'mapped'
  const [filterArea, setFilterArea] = useState('ALL');

  if (!isOpen) return null;

  const territoryData = getTerritoryProblemBreakdown(selectedWard);

  // Filter complaints by sub-area if selected
  const filterList = (list) => {
    if (filterArea === 'ALL') return list;
    return list.filter(g => {
      const area = (g.location?.area || g.location?.ward || '').toLowerCase();
      return area.includes(filterArea.toLowerCase());
    });
  };

  const currentList = filterList(
    activeTab === 'today' ? territoryData.today :
    activeTab === 'pending' ? territoryData.pending :
    activeTab === 'solved' ? territoryData.solved :
    territoryData.mapped
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.45)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '28px',
        maxWidth: '1160px',
        width: '100%',
        maxHeight: '92vh',
        minHeight: '640px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -10px rgba(15, 23, 42, 0.25), 0 0 1px 1px rgba(15, 23, 42, 0.08)',
        border: '1.5px solid #E2E8F0',
        overflow: 'hidden',
        animation: 'modalCenterScale 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* ── Light & Airy Modal Header ── */}
        <div style={{
          padding: '22px 28px',
          borderBottom: '1.5px solid #E2E8F0',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 50%, #EFF6FF 100%)',
          color: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '11px',
                fontWeight: 800,
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '3px 10px',
                borderRadius: '999px',
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Compass style={{ width: '13px', height: '13px', color: '#059669' }} />
                🏛️ MUNICIPAL TERRITORY INTELLIGENCE
              </span>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: 600 }}>
                Zone North-West & Wagholi Municipal Sub-Division • Live Jurisdiction Feed
              </span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
              {selectedWard} Territory Problem Explorer
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
            title="Close Explorer"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>

        {/* ── Priority High-Impact Urgent Banner (Light Rose Theme) ── */}
        <div style={{
          background: '#FFF1F2',
          borderBottom: '1px solid #FECDD3',
          padding: '12px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#E11D48',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)'
            }}>
              🚨
            </span>
            <div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#9F1239' }}>
                Active Priority Hotspot: Wagholi Baif Road Market & Ivy Estate Water Corridor
              </span>
              <span style={{ fontSize: '12px', color: '#BE123C', display: 'block' }}>
                42 combined citizen reports • Solid waste accumulation & feeder line rupture • Emergency squads active
              </span>
            </div>
          </div>

          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            background: '#FFE4E6',
            color: '#E11D48',
            border: '1px solid #FDA4AF',
            padding: '3px 12px',
            borderRadius: '999px'
          }}>
            URGENT ATTENTION
          </span>
        </div>

        {/* ── Main Tabs Bar with Sub-Area Filter Dropdown beside AI Hotspots ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 28px',
          background: '#F8FAFC',
          borderBottom: '1.5px solid #E2E8F0',
          overflowX: 'auto',
          flexShrink: 0
        }}>
          {[
            { id: 'today', label: "📅 Today's Fresh Problems", count: filterList(territoryData.today).length, color: '#2563EB', activeBg: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)' },
            { id: 'pending', label: '⏳ Ongoing & Dispatched', count: filterList(territoryData.pending).length, color: '#D97706', activeBg: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)' },
            { id: 'solved', label: '🟢 Verified Solved', count: filterList(territoryData.solved).length, color: '#059669', activeBg: 'linear-gradient(135deg, #047857 0%, #059669 100%)' },
            { id: 'mapped', label: '🧬 AI Clustered Hotspots', count: `${filterList(territoryData.mapped).length} Groups`, color: '#4F46E5', activeBg: 'linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? tab.activeBg : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: `1px solid ${isActive ? 'transparent' : '#CBD5E1'}`,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(15, 23, 42, 0.16)' : '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 150ms ease'
                }}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '1px 8px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : tab.color
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}

          {/* ── Area Filter Dropdown (Beside AI Hotspots) ── */}
          <div style={{
            marginLeft: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '14px',
            padding: '7px 14px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
            whiteSpace: 'nowrap'
          }}>
            <MapPin style={{ width: '15px', height: '15px', color: '#6366F1', flexShrink: 0 }} />
            <label htmlFor="areaFilterSelect" style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>
              Area:
            </label>
            <select
              id="areaFilterSelect"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                outline: 'none',
                paddingRight: '4px'
              }}
            >
              <option value="ALL">🚩 All Wagholi & Ward 14</option>
              <option value="baif">🗑️ Baif Road Market</option>
              <option value="kesnand">💧 Ivy Estate / Kesnand Rd</option>
              <option value="nagar">🛣️ Nagar Road Highway</option>
              <option value="ubale">🌊 Ubale Nagar</option>
              <option value="sector 14">🏛️ Rohini Sector 14</option>
            </select>
          </div>
        </div>

        {/* ── Modal Body: Visual Responsive Card Grid ── */}
        <div style={{
          padding: '24px 28px',
          overflowY: 'auto',
          flex: 1,
          background: '#F8FAFC'
        }}>
          {currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '18px', border: '1px dashed #CBD5E1' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', margin: 0 }}>No issues found for this area filter</h4>
              <p style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>Try selecting "All Wagholi & Ward 14" to see all territory reports.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '18px'
            }}>
              {currentList.map((g) => {
                const isCritical = g.urgency === 'CRITICAL';
                const isResolved = g.status === 'RESOLVED';
                const isPending = g.status === 'IN_PROGRESS' || g.status === 'ACTION_DISPATCHED';

                const cardBg = isResolved ? '#F0FDF4' : '#FFFFFF';
                const cardBorder = isCritical ? '1.5px solid #FECACA' : (isResolved ? '1.5px solid #86EFAC' : '1px solid #E2E8F0');

                // Determine representative visual image
                const displayImage = g.photoUrl || g.evidence?.photoUrl || (
                  g.category?.includes('Water') ? '/civic-problems/water_pipe_leak.jpg' :
                  g.category?.includes('Sanitation') ? '/civic-problems/roadside_garbage_heap.jpg' :
                  g.category?.includes('Roads') ? '/civic-problems/pothole_broken_drain_grate.jpg' :
                  g.category?.includes('Electricity') ? '/civic-problems/ai_dangling_power_cables.jpg' :
                  '/civic-problems/open_sewage_nullah_garbage.jpg'
                );

                return (
                  <div
                    key={g.id}
                    style={{
                      background: cardBg,
                      border: cardBorder,
                      borderRadius: '18px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 150ms ease, box-shadow 150ms ease'
                    }}
                  >
                    {/* Visual Photo Header */}
                    <div style={{ position: 'relative', height: '140px', width: '100%', background: '#0F172A', overflow: 'hidden' }}>
                      <img 
                        src={displayImage} 
                        alt={g.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />

                      {/* Top Badges Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        right: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          background: isCritical ? '#EF4444' : (isResolved ? '#059669' : '#D97706'),
                          color: '#FFFFFF',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          {isResolved ? <CheckCircle2 style={{ width: '11px', height: '11px' }} /> : <AlertTriangle style={{ width: '11px', height: '11px' }} />}
                          {isResolved ? 'RESOLVED' : (g.urgency || 'ACTIVE')}
                        </span>

                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          background: 'rgba(15, 23, 42, 0.85)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {g.id}
                        </span>
                      </div>

                      {/* Bottom Category Chip */}
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '10px'
                      }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#0F172A',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}>
                          {g.category || 'Civic Problem'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        {/* Landmark / Area */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#64748B', marginBottom: '6px' }}>
                          <MapPin style={{ width: '12px', height: '12px', color: '#059669', flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, color: '#334155' }}>
                            {g.location?.area || g.location?.ward || 'Wagholi, Pune'}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: '0 0 6px 0', lineHeight: 1.35 }}>
                          {g.title}
                        </h4>

                        {/* Short Visual DNA / Summary */}
                        <p style={{ fontSize: '12px', color: '#64748B', margin: '0 0 12px 0', lineHeight: 1.4 }}>
                          {g.descriptionRaw?.slice(0, 95) || 'Citizen observation logged.'}...
                        </p>
                      </div>

                      {/* Footer Meta & Action Button */}
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '10px',
                          borderTop: '1px solid #F1F5F9',
                          marginBottom: '12px',
                          fontSize: '11px',
                          color: '#64748B'
                        }}>
                          <span>👨‍💼 {g.officerName || 'Field Team'}</span>
                          {isPending && (
                            <span style={{ color: '#D97706', fontWeight: 700 }}>
                              ⏱️ {g.slaHoursLeft || 6}h Target
                            </span>
                          )}
                          {isResolved && (
                            <span style={{ color: '#059669', fontWeight: 700 }}>
                              ⭐ 5.0 Rating
                            </span>
                          )}
                        </div>

                        <Link
                          to={`/citizen/complaints/${g.id}`}
                          onClick={onClose}
                          style={{
                            width: '100%',
                            padding: '9px 14px',
                            borderRadius: '12px',
                            background: isResolved ? '#059669' : (isCritical ? '#0F172A' : '#2563EB'),
                            color: '#FFFFFF',
                            fontSize: '12.5px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.1)',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <Eye style={{ width: '13px', height: '13px' }} />
                          <span>Inspect Problem & Evidence</span>
                          <ArrowRight style={{ width: '12px', height: '12px' }} />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal Footer ── */}
        <div style={{
          padding: '14px 28px',
          background: '#FFFFFF',
          borderTop: '1.5px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '12.5px', color: '#64748B' }}>
            Territory Status: <strong style={{ color: '#0F172A' }}>{currentList.length} grievances</strong> actively monitored across Wagholi & Ward 14.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ borderRadius: '999px', padding: '8px 20px', fontSize: '13px', fontWeight: 700 }}
          >
            Close Explorer
          </button>
        </div>

      </div>
    </div>
  );
}
