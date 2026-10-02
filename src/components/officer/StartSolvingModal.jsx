import React, { useState, useMemo } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  Users, 
  Wrench, 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee, 
  CheckSquare, 
  Square, 
  Send, 
  AlertTriangle,
  Building2,
  FileCheck2,
  Truck,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { matchWorkersForComplaint } from '../../services/workerMatchingService';

export default function StartSolvingModal({
  incident,
  theme,
  isOpen,
  onClose,
  initialActionChoice
}) {
  const { 
    user, 
    workers = [], 
    grievances = [], 
    batchStartIncidentResolution 
  } = useApp();

  // Wizard Step: 1 = Initiate, 2 = AI Worker, 3 = Similar Complaints, 4 = Confirm & Dispatch, 5 = Success
  const [step, setStep] = useState(1);

  // Selected Action (default from parent simulation selection)
  const [selectedAction, setSelectedAction] = useState(
    initialActionChoice || incident?.simulations?.[1]?.title || 'Option B: Rapid Ground Replacement & Structural Re-bedding'
  );

  // AI Matching for Worker
  const matchResult = useMemo(() => {
    if (!incident) return null;
    const complaintProxy = {
      id: incident.id,
      title: incident.title,
      description: incident.summary || incident.title,
      category: incident.complaintDna?.issueType || incident.category || 'Water Supply',
      ward: incident.affectedArea,
      urgency: incident.severity === 'CRITICAL' ? 'CRITICAL' : 'HIGH'
    };
    return matchWorkersForComplaint(complaintProxy, workers);
  }, [incident, workers]);

  // Selected Worker state
  const topWorker = matchResult?.recommendations?.[0]?.worker || workers[0] || null;
  const [selectedWorkerId, setSelectedWorkerId] = useState(topWorker?.id || 'WRK-001');

  // Find similar / clustered complaints in the same ward/area
  const areaComplaints = useMemo(() => {
    if (!incident) return [];
    const areaLower = (incident.affectedArea || '').toLowerCase();
    const isDelhi = incident.id?.includes('DEL') || areaLower.includes('rohini');
    const isWagholi = incident.id?.includes('WAG') || areaLower.includes('wagholi');

    // 1. Complaints that match linked grievance IDs directly
    const linkedIds = incident.relatedGrievanceIds || [];

    // 2. Filter grievances in system matching this area or linked IDs
    const matched = grievances.filter(g => {
      if (linkedIds.includes(g.id)) return true;
      const gWard = (g.ward || '').toLowerCase();
      const gTitle = (g.title || '').toLowerCase();
      const gDesc = (g.description || '').toLowerCase();

      if (isDelhi) {
        return gWard.includes('rohini') || gWard.includes('ward 14') || g.id?.includes('DL-') || gTitle.includes('sector 14');
      }
      if (isWagholi) {
        return gWard.includes('wagholi') || gWard.includes('ward 29') || gWard.includes('ward 28') || g.id?.includes('PN-');
      }
      return gWard.includes(areaLower.slice(0, 10));
    });

    if (matched.length > 0) return matched;

    // Fallback realistic mock similar complaints for this ward if none exist
    if (isDelhi) {
      return [
        {
          id: 'DL-2026-W14-0892',
          citizenName: 'Aditya Verma',
          ward: 'Ward 14 (Rohini Sector 14 - Pocket 1)',
          category: 'Water Supply & Contamination',
          title: 'Brown tap water and foul odor in Pocket 1 tap lines',
          createdAt: '2 hours ago',
          status: 'PENDING'
        },
        {
          id: 'DL-2026-W14-0895',
          citizenName: 'Pooja Aggarwal',
          ward: 'Ward 14 (Rohini Sector 14 - Pocket 2)',
          category: 'Water Supply & Contamination',
          title: 'Acute pressure drop on 2nd and 3rd floors since morning supply',
          createdAt: '4 hours ago',
          status: 'PENDING'
        },
        {
          id: 'DL-2026-W14-0899',
          citizenName: 'Deepak Singhal',
          ward: 'Ward 14 (Rohini Sector 14 - Mother Dairy Junction)',
          category: 'Roads & Infrastructure',
          title: '35cm deep road cavity forming due to underground water seepage',
          createdAt: '1 hour ago',
          status: 'PENDING'
        }
      ];
    } else {
      return [
        {
          id: 'PN-2026-WAG-0101',
          citizenName: 'Santosh Gawade',
          ward: 'Wagholi Ward 29 (Ivy Estate Gate #1)',
          category: 'Water Supply & Contamination',
          title: 'Roadside potable water pipe rupture leaking continuously',
          createdAt: '3 hours ago',
          status: 'PENDING'
        },
        {
          id: 'PN-2026-WAG-0105',
          citizenName: 'Priyanka Jadhav',
          ward: 'Wagholi Ward 29 (Tower B & C)',
          category: 'Water Supply & Contamination',
          title: 'Drinking tap water smells foul like sewage backflow',
          createdAt: '5 hours ago',
          status: 'PENDING'
        },
        {
          id: 'PN-2026-WAG-0114',
          citizenName: 'Ritu Sharma',
          ward: 'Wagholi Ward 28 (Baif Road Junction)',
          category: 'Roads & Infrastructure',
          title: 'Asphalt depressed and soft near entrance due to subsoil seepage',
          createdAt: '2 hours ago',
          status: 'PENDING'
        }
      ];
    }
  }, [incident, grievances]);

  // Selected complaints checkboxes (default all checked for clustering)
  const [selectedComplaintIds, setSelectedComplaintIds] = useState(() => {
    return areaComplaints.map(c => c.id);
  });

  // Selected worker object
  const chosenWorker = workers.find(w => w.id === selectedWorkerId) || topWorker;

  // Officer Notes
  const [officerNotes, setOfficerNotes] = useState(
    `Authorized municipal execution under ${incident?.leadDepartment || 'Municipal Works'}. Dispatched technician to isolate and rectify core corridor fault.`
  );

  // Dispatching state & result
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dispatchedOrder, setDispatchedOrder] = useState(null);

  if (!isOpen || !incident) return null;

  const handleToggleComplaint = (id) => {
    setSelectedComplaintIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllComplaints = () => {
    if (selectedComplaintIds.length === areaComplaints.length) {
      setSelectedComplaintIds([]);
    } else {
      setSelectedComplaintIds(areaComplaints.map(c => c.id));
    }
  };

  const handleFinalDispatch = async () => {
    setIsSubmitting(true);

    try {
      const order = batchStartIncidentResolution({
        incidentId: incident.id,
        workerId: chosenWorker?.id || 'WRK-001',
        workerName: chosenWorker?.name || 'Ramesh Kumar',
        workerCategory: matchResult?.categoryConfig?.id || chosenWorker?.category || 'plumbing',
        estimatedFare: chosenWorker?.hourlyRate ? chosenWorker.hourlyRate * 2 : 450,
        serviceTitle: `${matchResult?.categoryConfig?.name || 'Technical'} Corridor Resolution (${incident.affectedArea.split('(')[0].trim()})`,
        location: {
          ward: incident.affectedArea,
          area: incident.affectedArea,
          city: incident.id?.includes('DEL') ? 'Delhi' : 'Pune'
        },
        selectedComplaintIds: selectedComplaintIds,
        actionSelected: selectedAction,
        officerNotes: officerNotes
      });

      setDispatchedOrder(order);
      setStep(5);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    } catch (err) {
      console.error('Dispatch error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '720px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        animation: 'fadeIn 180ms ease'
      }}>
        
        {/* ── Modal Header with Stepper ── */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #E2E8F0',
          background: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: theme.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF'
              }}>
                <Wrench style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
                  Municipal Ground Resolution Dispatch
                </h2>
                <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: theme.primary }}>{incident.id}</span>
                  <span>•</span>
                  <span>{incident.affectedArea.split('(')[0].trim()}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 120ms ease'
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          {/* Stepper Dots & Labels */}
          {step < 5 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              {[
                { num: 1, label: 'Initiate' },
                { num: 2, label: 'AI Worker' },
                { num: 3, label: 'Similar Complaints' },
                { num: 4, label: 'Confirm' }
              ].map((s) => {
                const isActive = step === s.num;
                const isPassed = step > s.num;
                return (
                  <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '6px', zIndex: 1 }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: isPassed ? '#10B981' : (isActive ? theme.primary : '#E2E8F0'),
                      color: isPassed || isActive ? '#FFFFFF' : '#64748B',
                      fontSize: '11px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 120ms ease'
                    }}>
                      {isPassed ? '✓' : s.num}
                    </div>
                    <span style={{
                      fontSize: '11.5px',
                      fontWeight: isActive ? 800 : 600,
                      color: isActive ? '#0F172A' : '#64748B'
                    }}>
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Modal Body Content (By Step) ── */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>

          {/* ══════════════════════════════════════════════════════════════
              STEP 1: INITIATE & STATUS UPDATE
             ══════════════════════════════════════════════════════════════ */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{
                background: '#F0FDF4',
                border: '1.5px solid #BBF7D0',
                borderRadius: '14px',
                padding: '16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <CheckCircle2 style={{ width: '22px', height: '22px', color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 800, color: '#166534' }}>
                    Immediate Ground Status Transition
                  </h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: '#166534', lineHeight: 1.5 }}>
                    By starting this workflow, incident <strong>{incident.id}</strong> status will transition from <strong>{incident.status}</strong> to <strong>Action In Progress</strong>. Affected citizens will be notified in real-time.
                  </p>
                </div>
              </div>

              {/* Execution Action Preview */}
              <div>
                <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                  Execution Work Scope / Strategy
                </label>
                <div style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0F172A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldCheck style={{ width: '18px', height: '18px', color: theme.primary }} />
                  <span>{selectedAction}</span>
                </div>
              </div>

              {/* Citizen Notification Preview Banner */}
              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '12px',
                color: '#1E40AF'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px' }}>
                  <span>🔔</span>
                  <span>Citizen Broadcast Preview (Ward Residents):</span>
                </div>
                <div style={{ fontStyle: 'italic', background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #DBEAFE', color: '#1E3A8A' }}>
                  "Municipal Officer {user?.name || 'Er. Sanjay Sharma'} has initiated on-ground resolution for your corridor grievance ({incident.id}). Field technician dispatch is currently being assigned."
                </div>
              </div>

              {/* Impact stats pill */}
              <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#475569' }}>
                <span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
                  👥 <strong>{incident.affectedPopulation}</strong>
                </span>
                <span style={{ background: '#F1F5F9', padding: '4px 10px', borderRadius: '6px' }}>
                  🏢 <strong>{incident.commercialImpact}</strong>
                </span>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 2: AI WORKER RECOMMENDATION
             ══════════════════════════════════════════════════════════════ */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: theme.tint,
                border: `1px solid ${theme.border}`,
                padding: '10px 14px',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles style={{ width: '16px', height: '16px', color: theme.primary }} />
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: theme.secondary }}>
                    Recommended Trade: {matchResult?.categoryConfig?.name || 'Plumbing & Water Distribution'}
                  </span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: theme.primary, background: '#FFFFFF', padding: '2px 8px', borderRadius: '999px' }}>
                  Jan_Sahayak Worker Network
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#64748B' }}>
                Select an available verified technician nearby to execute this repair:
              </div>

              {/* Workers List Radio Selection */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {workers.slice(0, 3).map((w, idx) => {
                  const isSelected = selectedWorkerId === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setSelectedWorkerId(w.id)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        background: isSelected ? '#F0FDF4' : '#FFFFFF',
                        border: isSelected ? '2px solid #16A34A' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 120ms ease',
                        boxShadow: isSelected ? '0 4px 12px rgba(22, 163, 74, 0.08)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Radio Check Circle */}
                        <div style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: isSelected ? '6px solid #16A34A' : '2px solid #CBD5E1',
                          background: '#FFFFFF',
                          transition: 'all 120ms ease'
                        }} />

                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: '#EFF6FF',
                          color: '#1D4ED8',
                          fontWeight: 800,
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {w.name.split(' ').map(n => n[0]).join('')}
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{w.name}</strong>
                            {w.verified && (
                              <span style={{ fontSize: '10px', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: '4px' }}>
                                VERIFIED
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                            <span>{w.category?.toUpperCase()}</span>
                            <span>•</span>
                            <span style={{ color: '#D97706', fontWeight: 700 }}>★ {w.rating || '4.9'} ({w.completedJobs || 34})</span>
                            <span>•</span>
                            <span>{w.experience || '6+ yrs exp'}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '10px', color: '#64748B', display: 'block' }}>Est. Fare</span>
                        <strong style={{ fontSize: '14px', color: '#0F172A' }}>
                          ₹{w.hourlyRate ? w.hourlyRate * 2 : (idx === 0 ? 450 : 520)}
                        </strong>
                        <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 700, display: 'block' }}>Available Now</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 3: CLUSTER SIMILAR COMPLAINTS IN AREA
             ══════════════════════════════════════════════════════════════ */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h4 style={{ margin: '0 0 2px 0', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                    Bundle Similar Ward Complaints ({selectedComplaintIds.length} of {areaComplaints.length} selected)
                  </h4>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Tick the complaints below to resolve them together in this single dispatch.
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSelectAllComplaints}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  {selectedComplaintIds.length === areaComplaints.length ? 'Deselect All' : 'Select All Similar'}
                </button>
              </div>

              {/* Complaints Checkbox List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
                {areaComplaints.map(comp => {
                  const isChecked = selectedComplaintIds.includes(comp.id);
                  return (
                    <div
                      key={comp.id}
                      onClick={() => handleToggleComplaint(comp.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        background: isChecked ? '#F0FDF4' : '#FFFFFF',
                        border: isChecked ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <div style={{ marginTop: '2px', color: isChecked ? '#16A34A' : '#94A3B8' }}>
                        {isChecked ? (
                          <CheckSquare style={{ width: '18px', height: '18px' }} />
                        ) : (
                          <Square style={{ width: '18px', height: '18px' }} />
                        )}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                          <span style={{ fontFamily: 'monospace', fontSize: '11px', fontWeight: 800, color: '#1D4ED8', background: '#EFF6FF', padding: '1px 6px', borderRadius: '4px' }}>
                            {comp.id}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            Citizen: <strong>{comp.citizenName || 'Resident'}</strong>
                          </span>
                          <span style={{ fontSize: '10.5px', color: '#94A3B8', marginLeft: 'auto' }}>
                            {comp.createdAt || 'Recent'}
                          </span>
                        </div>

                        <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                          {comp.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          📍 {comp.ward}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                borderRadius: '8px',
                padding: '10px 12px',
                fontSize: '11.5px',
                color: '#92400E'
              }}>
                ⚡ <strong>Clustering Benefit:</strong> All {selectedComplaintIds.length} ticked citizen grievances will simultaneously move to <strong>Action In Progress</strong>, and citizens will see technician <strong>{chosenWorker?.name}</strong> dispatched.
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 4: FINAL CONFIRMATION & START SOLVING
             ══════════════════════════════════════════════════════════════ */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '14px',
                padding: '16px'
              }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800, color: '#0F172A' }}>
                  Municipal Dispatch Summary
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block' }}>Assigned Technician:</span>
                    <strong style={{ color: '#0F172A', fontSize: '13px' }}>{chosenWorker?.name}</strong>
                    <span style={{ color: '#059669', display: 'block', fontSize: '11px' }}>({chosenWorker?.category?.toUpperCase()} • ★ {chosenWorker?.rating})</span>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', display: 'block' }}>Contract Fare Payout:</span>
                    <strong style={{ color: '#0F172A', fontSize: '13px' }}>₹{chosenWorker?.hourlyRate ? chosenWorker.hourlyRate * 2 : 450}</strong>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Direct Municipal Settlement</span>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', display: 'block' }}>Clustered Complaints:</span>
                    <strong style={{ color: '#1D4ED8', fontSize: '13px' }}>{selectedComplaintIds.length} Complaints Bundled</strong>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>All marked In Progress</span>
                  </div>

                  <div>
                    <span style={{ color: '#64748B', display: 'block' }}>Work Scope Strategy:</span>
                    <strong style={{ color: '#0F172A', fontSize: '12px' }}>{selectedAction.split(':')[0]}</strong>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px' }}>Zero Dead-End Standard</span>
                  </div>
                </div>
              </div>

              {/* Officer Notes textarea */}
              <div>
                <label style={{ fontSize: '11.5px', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Officer Dispatch Directive / Notes:
                </label>
                <textarea
                  value={officerNotes}
                  onChange={(e) => setOfficerNotes(e.target.value)}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    color: '#0F172A',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              {/* Big Start Solving Commit Box */}
              <div style={{
                background: '#ECFDF5',
                border: '1.5px solid #A7F3D0',
                borderRadius: '12px',
                padding: '14px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#065F46', marginBottom: '4px' }}>
                  Ready to launch ground resolution?
                </div>
                <div style={{ fontSize: '11.5px', color: '#047857' }}>
                  Clicking below will dispatch the work order, alert technician <strong>{chosenWorker?.name}</strong>, and notify all corridor residents.
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════
              STEP 5: DISPATCH SUCCESS CONFIRMATION
             ══════════════════════════════════════════════════════════════ */}
          {step === 5 && (
            <div style={{ textAlign: 'center', padding: '20px 10px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#DCFCE7',
                color: '#16A34A',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <CheckCircle2 style={{ width: '36px', height: '36px' }} />
              </div>

              <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                Ground Resolution Dispatched!
              </h3>
              <p style={{ margin: '0 auto 20px auto', fontSize: '13.5px', color: '#64748B', maxWidth: '480px', lineHeight: 1.5 }}>
                Work order <strong>{dispatchedOrder?.id}</strong> is assigned to <strong>{chosenWorker?.name}</strong>. Incident status updated to <strong>Action In Progress</strong>, and all {selectedComplaintIds.length} bundled complaints are updated in real-time.
              </p>

              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '14px 20px',
                maxWidth: '420px',
                margin: '0 auto 24px auto',
                fontSize: '12px',
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Assigned Worker:</span>
                  <strong>{chosenWorker?.name} ({chosenWorker?.category})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Order Status:</span>
                  <strong style={{ color: '#16A34A' }}>REQUESTED / DISPATCHED</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Citizen Alerts Sent:</span>
                  <strong style={{ color: '#2563EB' }}>{selectedComplaintIds.length} Citizens Notified</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                style={{
                  height: '42px',
                  padding: '0 28px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                Close & View Active Incident
              </button>
            </div>
          )}
        </div>

        {/* ── Modal Footer Controls ── */}
        {step < 5 && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            background: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                style={{
                  height: '38px',
                  padding: '0 16px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ArrowLeft style={{ width: '14px', height: '14px' }} />
                <span>Back</span>
              </button>
            ) : <div />}

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  style={{
                    height: '38px',
                    padding: '0 20px',
                    borderRadius: '8px',
                    border: 'none',
                    background: theme.primary,
                    color: '#FFFFFF',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: `0 2px 8px ${theme.shadow}`
                  }}
                >
                  <span>Continue</span>
                  <ArrowRight style={{ width: '14px', height: '14px' }} />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalDispatch}
                  style={{
                    height: '40px',
                    padding: '0 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  <span>⚡</span>
                  <span>{isSubmitting ? 'Dispatching...' : 'Start Solving & Dispatch'}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
