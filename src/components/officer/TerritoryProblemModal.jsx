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
  Compass,
  Phone,
  Send,
  Truck,
  FileText,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';
import { maskCitizenName, maskCitizenPhone } from '../../utils/privacy';

export default function TerritoryProblemModal({ isOpen, onClose, selectedWard = 'Wagholi Municipal Ward 27-31' }) {
  const { 
    getTerritoryProblemBreakdown, 
    grievances = [], 
    setGrievances,
    resolveGrievance,
    dispatchWorkOrder
  } = useApp();

  const [activeTab, setActiveTab] = useState('today'); // 'today' | 'pending' | 'solved' | 'mapped'
  const [filterArea, setFilterArea] = useState('ALL');
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);

  if (!isOpen) return null;

  const territoryData = getTerritoryProblemBreakdown('Wagholi');

  // Filter complaints by sub-area if selected
  const filterList = (list) => {
    if (filterArea === 'ALL') return list;
    return list.filter(g => {
      const area = (g.location?.area || g.location?.ward || '').toLowerCase();
      return area.includes(filterArea.toLowerCase());
    });
  };

  const rawList = activeTab === 'today' ? territoryData.today :
    activeTab === 'pending' ? territoryData.pending :
    activeTab === 'solved' ? territoryData.solved :
    territoryData.mapped;

  // Urgency rank ordering (Critical -> High -> Medium -> Low)
  const urgencyRank = { 'CRITICAL': 1, 'HIGH': 2, 'MEDIUM': 3, 'LOW': 4 };

  const currentList = [...filterList(rawList)].sort((a, b) => {
    const rankA = urgencyRank[a.urgency] || 5;
    const rankB = urgencyRank[b.urgency] || 5;
    if (rankA !== rankB) return rankA - rankB;
    return (b.urgencyScore || 0) - (a.urgencyScore || 0);
  });

  // Handle Quick Officer Action from Modal Drawer
  const handleOfficerAction = (grievanceId, actionType) => {
    let newStatus = 'IN_PROGRESS';
    let msg = 'Action applied successfully.';

    if (actionType === 'DISPATCH') {
      newStatus = 'ACTION_DISPATCHED';
      msg = '🚀 Emergency Field Squad & Work Order Dispatched!';
      if (dispatchWorkOrder) {
        dispatchWorkOrder(grievanceId, { squad: 'Wagholi Rapid Repair Unit' });
      }
    } else if (actionType === 'IN_PROGRESS') {
      newStatus = 'IN_PROGRESS';
      msg = '🛠️ Status updated to In Progress.';
    } else if (actionType === 'RESOLVE') {
      newStatus = 'RESOLVED';
      msg = '✅ Issue verified & marked RESOLVED.';
      if (resolveGrievance) {
        resolveGrievance(grievanceId, 'Inspected on-site, repair completed and tested by Wagholi field engineer.', '/civic-problems/water_pipe_leak.jpg');
      }
    }

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          status: newStatus,
          timeline: [
            ...(g.timeline || []),
            {
              stage: actionType === 'DISPATCH' ? 'Work Order Dispatched' : (actionType === 'RESOLVE' ? 'Resolved & Verified' : 'Work In Progress'),
              time: 'Just now',
              detail: `Officer updated status to ${newStatus} from Wagholi Territory Command`,
              status: 'completed'
            }
          ]
        };
      }
      return g;
    }));

    if (selectedGrievance && selectedGrievance.id === grievanceId) {
      setSelectedGrievance(prev => ({ ...prev, status: newStatus }));
    }

    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

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
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '1240px',
        width: '100%',
        maxHeight: '92vh',
        minHeight: '620px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px -10px rgba(15, 23, 42, 0.25), 0 0 1px 1px rgba(15, 23, 42, 0.08)',
        border: '1.5px solid #E2E8F0',
        overflow: 'hidden',
        animation: 'modalCenterScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
      }}>
        
        {/* ── Simple, Clean & Modern Modal Header ── */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1.5px solid #E2E8F0',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 50%, #EFF6FF 100%)',
          color: '#0F172A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              boxShadow: '0 4px 10px rgba(16, 185, 129, 0.25)',
              flexShrink: 0
            }}>
              🏛️
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '19px', fontWeight: 800, margin: 0, color: '#0F172A', letterSpacing: '-0.02em' }}>
                  Wagholi Municipal Problems
                </h2>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  background: '#ECFDF5',
                  color: '#065F46',
                  border: '1px solid #A7F3D0',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  {currentList.length} Ground Grievances
                </span>
              </div>
              <p style={{ margin: '1px 0 0 0', fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                Live Territorial Feed • Wagholi Ward & Sub-Division Jurisdiction
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#F1F5F9',
              border: '1px solid #CBD5E1',
              color: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              flexShrink: 0
            }}
            title="Close Explorer"
          >
            <X style={{ width: '17px', height: '17px' }} />
          </button>
        </div>

        {/* ── Compact Priority Hotspot Banner ── */}
        <div style={{
          background: '#FFF1F2',
          borderBottom: '1px solid #FECDD3',
          padding: '9px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>🚨</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#9F1239' }}>
              Active Hotspot: Wagholi Baif Road Market & Ivy Estate Water Corridor
            </span>
            <span style={{ fontSize: '11.5px', color: '#BE123C' }}>
              • 42 citizen reports • Emergency squads mobilized
            </span>
          </div>

          <span style={{
            fontSize: '10.5px',
            fontWeight: 800,
            background: '#FFE4E6',
            color: '#E11D48',
            border: '1px solid #FDA4AF',
            padding: '2px 9px',
            borderRadius: '999px'
          }}>
            URGENT ATTENTION
          </span>
        </div>

        {/* ── Main Tabs Bar with Area Filter Dropdown beside AI Hotspots ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '10px 24px',
          background: '#F8FAFC',
          borderBottom: '1.5px solid #E2E8F0',
          overflowX: 'auto',
          flexShrink: 0,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
            {[
              { id: 'today', label: "📅 Today's Problems", count: filterList(territoryData.today).length, color: '#2563EB', activeBg: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)' },
              { id: 'pending', label: '⏳ Ongoing & Dispatched', count: filterList(territoryData.pending).length, color: '#D97706', activeBg: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)' },
              { id: 'solved', label: '🟢 Verified Solved', count: filterList(territoryData.solved).length, color: '#059669', activeBg: 'linear-gradient(135deg, #047857 0%, #059669 100%)' },
              { id: 'mapped', label: '🧬 AI Hotspots', count: `${filterList(territoryData.mapped).length} Groups`, color: '#4F46E5', activeBg: 'linear-gradient(135deg, #4338CA 0%, #4F46E5 100%)' }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '12px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? 800 : 600,
                    background: isActive ? tab.activeBg : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#475569',
                    border: `1px solid ${isActive ? 'transparent' : '#CBD5E1'}`,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    boxShadow: isActive ? '0 3px 10px rgba(15, 23, 42, 0.12)' : '0 1px 2px rgba(0,0,0,0.03)',
                    transition: 'all 150ms ease'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    padding: '1px 7px',
                    borderRadius: '999px',
                    background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : tab.color
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Area Filter Dropdown placed right beside tabs ── */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '12px',
            padding: '5px 12px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)',
            whiteSpace: 'nowrap'
          }}>
            <MapPin style={{ width: '14px', height: '14px', color: '#6366F1', flexShrink: 0 }} />
            <label htmlFor="areaFilterSelect" style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}>
              Area:
            </label>
            <select
              id="areaFilterSelect"
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '12px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                outline: 'none',
                paddingRight: '2px'
              }}
            >
              <option value="ALL">🚩 All Wagholi & Ward 14</option>
              <option value="baif">🗑️ Baif Road Market</option>
              <option value="kesnand">💧 Ivy Estate / Kesnand Rd</option>
              <option value="nagar">🛣️ Nagar Road Highway</option>
              <option value="ubale">🌊 Ubale Nagar</option>
              <option value="domkhel">🎓 Raisoni / Domkhel</option>
              <option value="sector 14">🏛️ Rohini Sector 14</option>
            </select>
          </div>
        </div>

        {/* ── Toast Alert for Action Success ── */}
        {actionSuccessMsg && (
          <div style={{
            background: '#ECFDF5',
            borderBottom: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '8px 24px',
            fontSize: '12.5px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        {/* ── Modal Body: 4 Cards Per Line Grid (Severity Sorted & Color-Coded) ── */}
        <div style={{
          padding: '18px 24px',
          overflowY: 'auto',
          flex: 1,
          background: '#F8FAFC'
        }}>
          {currentList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '18px', border: '1px dashed #CBD5E1' }}>
              <div style={{ fontSize: '36px', marginBottom: '8px' }}>🔍</div>
              <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', margin: 0 }}>No issues found for this filter</h4>
              <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>Try selecting "All Wagholi & Ward 14" to see all reports.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '14px'
            }}>
              {currentList.map((g) => {
                const isCritical = g.urgency === 'CRITICAL';
                const isHigh = g.urgency === 'HIGH';
                const isMedium = g.urgency === 'MEDIUM';
                const isResolved = g.status === 'RESOLVED' || g.status === 'ACTION_COMPLETED';
                const isPending = g.status === 'IN_PROGRESS' || g.status === 'ACTION_DISPATCHED';

                // Severity border and shadow color code: Red -> Orange/Amber -> Green
                let cardBorder = '1.5px solid #E2E8F0';
                let cardShadow = '0 3px 10px rgba(15, 23, 42, 0.04)';
                let cardBg = '#FFFFFF';
                let topHighlightBar = '#94A3B8';
                let badgeBg = '#64748B';

                if (isCritical) {
                  cardBorder = '1.5px solid #FDA4AF'; // Red border
                  cardShadow = '0 4px 14px rgba(225, 29, 72, 0.1)'; // Red shadow
                  cardBg = '#FFFDFD';
                  topHighlightBar = '#EF4444';
                  badgeBg = '#EF4444';
                } else if (isHigh || isMedium) {
                  cardBorder = '1.5px solid #FDE68A'; // Orange/Amber border
                  cardShadow = '0 4px 14px rgba(217, 119, 6, 0.1)'; // Orange shadow
                  cardBg = '#FFFDF5';
                  topHighlightBar = isHigh ? '#F59E0B' : '#FBBF24';
                  badgeBg = '#D97706';
                } else if (isResolved) {
                  cardBorder = '1.5px solid #A7F3D0'; // Green border
                  cardShadow = '0 4px 14px rgba(16, 185, 129, 0.1)'; // Green shadow
                  cardBg = '#F0FDF4';
                  topHighlightBar = '#10B981';
                  badgeBg = '#059669';
                }

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
                    onClick={() => setSelectedGrievance(g)}
                    style={{
                      background: cardBg,
                      border: cardBorder,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      boxShadow: cardShadow,
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'transform 150ms ease, box-shadow 150ms ease',
                      height: '100%'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = isCritical 
                        ? '0 8px 20px rgba(225, 29, 72, 0.18)' 
                        : (isResolved ? '0 8px 20px rgba(16, 185, 129, 0.18)' : '0 8px 20px rgba(217, 119, 6, 0.18)');
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = cardShadow;
                    }}
                  >
                    {/* Top Color Accent Line */}
                    <div style={{ height: '3px', width: '100%', background: topHighlightBar }} />

                    {/* Compact Visual Photo Header (Height: 105px) */}
                    <div style={{ position: 'relative', height: '105px', width: '100%', background: '#0F172A', overflow: 'hidden' }}>
                      <img 
                        src={displayImage} 
                        alt={g.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />

                      {/* Top Badges Overlay */}
                      <div style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        right: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 800,
                          padding: '2px 7px',
                          borderRadius: '999px',
                          background: badgeBg,
                          color: '#FFFFFF',
                          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          {isResolved ? <CheckCircle2 style={{ width: '10px', height: '10px' }} /> : (isCritical ? '🔥' : '⚡')}
                          {isResolved ? 'RESOLVED' : (g.urgency || 'ACTIVE')}
                        </span>

                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 700,
                          background: 'rgba(15, 23, 42, 0.82)',
                          backdropFilter: 'blur(4px)',
                          color: '#FFFFFF',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-mono)'
                        }}>
                          {g.id}
                        </span>
                      </div>

                      {/* Bottom Category Tag */}
                      <div style={{
                        position: 'absolute',
                        bottom: '6px',
                        left: '8px'
                      }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          background: 'rgba(255, 255, 255, 0.95)',
                          color: '#0F172A',
                          padding: '2px 6px',
                          borderRadius: '5px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                        }}>
                          {g.category?.split('&')[0]?.trim() || 'Civic'}
                        </span>
                      </div>
                    </div>

                    {/* Card Body (Compact & Tight) */}
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        {/* Area Landmark */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                          <MapPin style={{ width: '11px', height: '11px', color: '#059669', flexShrink: 0 }} />
                          <span style={{ fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {g.location?.area || g.location?.ward || 'Wagholi, Pune'}
                          </span>
                        </div>

                        {/* Title (2 lines clamp) */}
                        <h4 style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          color: '#0F172A',
                          margin: '0 0 6px 0',
                          lineHeight: 1.3,
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '34px'
                        }}>
                          {g.title}
                        </h4>
                      </div>

                      {/* Card Footer: SLA & Click Trigger */}
                      <div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingTop: '8px',
                          borderTop: '1px solid #F1F5F9',
                          marginBottom: '8px',
                          fontSize: '10.5px',
                          color: '#64748B'
                        }}>
                          <span>👨‍💼 {g.officerName?.split(' ')[0] || 'Field Team'}</span>
                          {isPending && (
                            <span style={{ color: '#D97706', fontWeight: 700 }}>
                              ⏱️ {g.slaHoursLeft || 6}h SLA
                            </span>
                          )}
                          {isResolved && (
                            <span style={{ color: '#059669', fontWeight: 700 }}>
                              ✅ Solved
                            </span>
                          )}
                          {!isPending && !isResolved && (
                            <span style={{ color: isCritical ? '#EF4444' : '#D97706', fontWeight: 700 }}>
                              🔥 Score {g.urgencyScore || 90}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedGrievance(g);
                          }}
                          style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: '10px',
                            background: isResolved ? '#059669' : (isCritical ? '#0F172A' : '#2563EB'),
                            color: '#FFFFFF',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            boxShadow: '0 2px 5px rgba(15, 23, 42, 0.08)',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <Eye style={{ width: '12px', height: '12px' }} />
                          <span>Inspect & Resolve</span>
                          <ChevronRight style={{ width: '12px', height: '12px' }} />
                        </button>
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
          padding: '12px 24px',
          background: '#FFFFFF',
          borderTop: '1.5px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Territory Status: <strong style={{ color: '#0F172A' }}>{currentList.length} grievances</strong> actively mapped across Wagholi Ward.
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
            style={{ borderRadius: '999px', padding: '6px 18px', fontSize: '12.5px', fontWeight: 700 }}
          >
            Close Explorer
          </button>
        </div>

      </div>

      {/* ── Rich Full Information & Officer Action Modal Drawer ── */}
      {selectedGrievance && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10001,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: '24px',
            maxWidth: '960px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.35)',
            border: '1.5px solid #E2E8F0',
            overflow: 'hidden',
            animation: 'modalCenterScale 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
          }}>
            {/* Action Drawer Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1.5px solid #E2E8F0',
              background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: selectedGrievance.urgency === 'CRITICAL' ? '#EF4444' : '#F59E0B',
                    color: '#FFFFFF'
                  }}>
                    {selectedGrievance.urgency} URGENCY
                  </span>
                  <span style={{ fontSize: '12px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                    {selectedGrievance.id}
                  </span>
                  <span style={{ fontSize: '12px', color: '#38BDF8' }}>
                    • {selectedGrievance.category}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
                  {selectedGrievance.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {/* Action Drawer Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1, background: '#F8FAFC' }}>
              
              {/* Photo & Reporter Summary Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '20px', marginBottom: '20px' }}>
                {/* Photo */}
                <div style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  background: '#0F172A',
                  position: 'relative',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }}>
                  <img
                    src={selectedGrievance.photoUrl || selectedGrievance.evidence?.photoUrl || '/civic-problems/water_pipe_leak.jpg'}
                    alt={selectedGrievance.title}
                    style={{ width: '100%', height: '220px', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    right: '10px',
                    background: 'rgba(15, 23, 42, 0.85)',
                    backdropFilter: 'blur(6px)',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '11px'
                  }}>
                    <div style={{ fontWeight: 700, color: '#4ADE80' }}>
                      ✓ AI Verified Ground Evidence ({Math.round((selectedGrievance.evidence?.confidenceScore || 0.98) * 100)}%)
                    </div>
                    <div style={{ color: '#94A3B8' }}>{selectedGrievance.evidence?.detectedIssue || 'Civic Infrastructure Defect'}</div>
                  </div>
                </div>

                {/* Citizen & Location Metadata */}
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      📍 Location & Citizen Report
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '12px' }}>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Area / Ward</span>
                        <strong style={{ color: '#0F172A' }}>{selectedGrievance.location?.area || 'Wagholi'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>GPS Coordinates</span>
                        <strong style={{ color: '#0F172A', fontFamily: 'var(--font-mono)' }}>
                          {selectedGrievance.location?.lat || 18.5780}, {selectedGrievance.location?.lng || 73.9790}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Citizen Reporter</span>
                        <strong style={{ color: '#0F172A' }}>{maskCitizenName(selectedGrievance.citizenName || 'Resident')}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Contact Channel</span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#065F46',
                          background: '#ECFDF5',
                          border: '1px solid #A7F3D0',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          display: 'inline-block'
                        }}>
                          {maskCitizenPhone(selectedGrievance.citizenPhone)}
                        </span>
                      </div>
                    </div>

                    <div style={{ background: '#F1F5F9', borderRadius: '10px', padding: '10px 12px', fontSize: '12.5px', color: '#334155' }}>
                      <strong>Citizen Description:</strong> "{selectedGrievance.descriptionRaw || selectedGrievance.title}"
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', fontSize: '11.5px', color: '#64748B' }}>
                    <span>📅 Logged: <strong>{selectedGrievance.createdAt || 'Today'}</strong></span>
                    <span>⏳ SLA Deadline: <strong style={{ color: '#DC2626' }}>{selectedGrievance.slaDeadline || 'Today 6 PM'}</strong></span>
                  </div>
                </div>
              </div>

              {/* AI Complaint DNA & Root Cause Analysis */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '18px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <Cpu style={{ width: '16px', height: '16px', color: '#6366F1' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                    AI Complaint DNA & Hazard Analysis
                  </h4>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Urgency Metric</span>
                    <strong style={{ fontSize: '16px', color: selectedGrievance.urgencyScore >= 90 ? '#EF4444' : '#D97706' }}>
                      {selectedGrievance.urgencyScore || 90}/100
                    </strong>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Health & Safety Risk</span>
                    <strong style={{ fontSize: '14px', color: '#DC2626' }}>
                      {selectedGrievance.grievanceDna?.healthRiskLevel || 'HIGH RISK'}
                    </strong>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>Cluster / Duplication</span>
                    <strong style={{ fontSize: '13px', color: '#4F46E5' }}>
                      {selectedGrievance.clusterTitle || `${selectedGrievance.clusterCount || 1} Correlated Reports`}
                    </strong>
                  </div>
                </div>

                {/* AI Officer Brief Bullets */}
                {selectedGrievance.aiOfficerBrief && selectedGrievance.aiOfficerBrief.length > 0 && (
                  <div style={{ background: '#EFF6FF', borderRadius: '10px', padding: '10px 14px', border: '1px solid #BFDBFE' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#1E40AF', display: 'block', marginBottom: '4px' }}>
                      🤖 AI Executive Officer Brief:
                    </span>
                    <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '12px', color: '#1E3A8A', lineHeight: 1.4 }}>
                      {selectedGrievance.aiOfficerBrief.map((brief, idx) => (
                        <li key={idx}>{brief}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Recommended Solution & SOP Guidance */}
              <div style={{
                background: 'linear-gradient(135deg, #FFFFFF 0%, #F0FDF4 100%)',
                borderRadius: '16px',
                border: '1.5px solid #86EFAC',
                padding: '18px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <Wrench style={{ width: '16px', height: '16px', color: '#059669' }} />
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#065F46', margin: 0 }}>
                    💡 AI Recommended Resolution & Standard Operating Procedure (SOP)
                  </h4>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                  {selectedGrievance.recommendedResolution?.primaryAction || 'Deploy Field Engineering Unit for On-Site Rectification'}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '12px' }}>
                  <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>SOP Code</span>
                    <strong>{selectedGrievance.recommendedResolution?.standardOperatingProcedure || 'PMC-SOP-EMERGENCY-V1'}</strong>
                  </div>
                  <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Est. Repair Duration</span>
                    <strong style={{ color: '#059669' }}>{selectedGrievance.recommendedResolution?.estimatedFixTime || '3 Hours'}</strong>
                  </div>
                </div>

                {/* Equipment Required Chips */}
                {selectedGrievance.recommendedResolution?.equipmentRequired && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#065F46' }}>Required Machinery:</span>
                    {selectedGrievance.recommendedResolution.equipmentRequired.map((eq, idx) => (
                      <span key={idx} style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        background: '#DCFCE7',
                        color: '#166534',
                        padding: '2px 8px',
                        borderRadius: '999px',
                        border: '1px solid #BBF7D0'
                      }}>
                        ⚙️ {eq}
                      </span>
                    ))}
                  </div>
                )}

                {/* AI Drafted Citizen Message */}
                {selectedGrievance.recommendedResolution?.citizenDraftHindi && (
                  <div style={{ background: '#FFFFFF', borderRadius: '8px', padding: '8px 12px', border: '1px solid #E2E8F0', fontSize: '11.5px', color: '#475569' }}>
                    <strong>📢 Citizen SMS Draft (Hindi):</strong> {selectedGrievance.recommendedResolution.citizenDraftHindi}
                  </div>
                )}
              </div>

              {/* Officer Direct Action Buttons */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: '1.5px solid #CBD5E1',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block' }}>
                    Officer Action Controls
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                    Current Status: <span style={{ color: selectedGrievance.status === 'RESOLVED' ? '#059669' : '#D97706' }}>{selectedGrievance.status}</span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => handleOfficerAction(selectedGrievance.id, 'DISPATCH')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: '#1E293B',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Truck style={{ width: '14px', height: '14px' }} />
                    <span>Dispatch Squad</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOfficerAction(selectedGrievance.id, 'IN_PROGRESS')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: '#D97706',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Wrench style={{ width: '14px', height: '14px' }} />
                    <span>Mark In Progress</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOfficerAction(selectedGrievance.id, 'RESOLVE')}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '12px',
                      background: '#059669',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                    <span>Mark Resolved & Verified</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Action Drawer Footer */}
            <div style={{
              padding: '12px 24px',
              borderTop: '1px solid #E2E8F0',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <Link
                to={`/citizen/complaints/${selectedGrievance.id}`}
                onClick={onClose}
                style={{
                  fontSize: '12.5px',
                  color: '#2563EB',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Open in Full Case Workspace</span>
                <ExternalLink style={{ width: '13px', height: '13px' }} />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedGrievance(null)}
                className="btn-secondary"
                style={{ borderRadius: '999px', padding: '6px 18px', fontSize: '12px', fontWeight: 700 }}
              >
                Back to Explorer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
