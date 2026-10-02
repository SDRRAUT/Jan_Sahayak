import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, ShieldCheck, MapPin, Clock, Calendar, AlertTriangle, ArrowRight, IndianRupee, Sparkles, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateEstimatedFare, WAGHOLI_WARD_DISTANCES } from '../../services/fareEstimationService';
import { WORKER_CATEGORIES } from '../../data/mockWorkers';

const TIME_SLOTS = [
  'Immediate (Within 45 mins)',
  'Today: Morning (09:00 - 12:00)',
  'Today: Afternoon (13:00 - 17:00)',
  'Today: Evening (17:00 - 20:00)',
  'Tomorrow: Morning (09:00 - 12:00)'
];

export default function BookWorkerModal({ worker, complaint = null, isOpen, onClose, onSuccess }) {
  const { user, createWorkerOrder } = useApp();

  const isOfficerDispatch = Boolean(complaint || (user && user.role !== 'citizen'));

  const [description, setDescription] = useState(
    complaint 
      ? `Field remediation for Grievance #${complaint.id}: ${complaint.title}`
      : 'Immediate repair and inspection needed at premises.'
  );

  const [ward, setWard] = useState(
    complaint?.ward || user?.ward || 'Ward 28 - Ivy Estate / Pune-Nagar Hwy'
  );

  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [urgency, setUrgency] = useState(
    complaint?.urgency === 'CRITICAL' ? 'CRITICAL_EMERGENCY' : 
    complaint?.urgency === 'HIGH' ? 'URGENT' : 'NORMAL'
  );
  const [durationHours, setDurationHours] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);

  // Compute realistic distance based on worker ward and target ward
  const distanceKm = useMemo(() => {
    if (!worker) return 2.0;
    const workerWardKey = worker.ward || '';
    const targetWardKey = ward || '';
    const table = WAGHOLI_WARD_DISTANCES[workerWardKey];
    if (table && table[targetWardKey] !== undefined) {
      return table[targetWardKey];
    }
    return 1.8;
  }, [worker, ward]);

  // Live Dynamic Fare Estimation
  const fareBreakdown = useMemo(() => {
    if (!worker) return null;
    return calculateEstimatedFare({
      worker,
      durationHours: Number(durationHours) || 2,
      distanceKm,
      urgency,
      isInstitutional: isOfficerDispatch
    });
  }, [worker, durationHours, distanceKm, urgency, isOfficerDispatch]);

  if (!isOpen || !worker) return null;

  const categoryObj = WORKER_CATEGORIES.find(c => c.id === worker.category) || {
    name: worker.category,
    icon: '🔧'
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderPayload = {
      workerId: worker.id,
      workerName: worker.name,
      workerPhone: worker.phone,
      workerCategory: worker.category,
      workerAvatar: worker.avatar,
      requestedBy: isOfficerDispatch ? 'GOVERNMENT_OFFICER' : 'CITIZEN',
      customerName: user?.name || (isOfficerDispatch ? 'PMC Civic Officer' : 'Rahul Raut'),
      customerPhone: user?.phone || '+91 98234 56789',
      complaintId: complaint?.id || null,
      complaintTitle: complaint?.title || null,
      serviceTitle: description.trim(),
      ward: ward,
      urgency: urgency,
      scheduledTime: timeSlot,
      durationHours: Number(durationHours) || 2,
      distanceKm: distanceKm,
      estimatedFare: fareBreakdown?.totalEstimatedFare || 450,
      fareBreakdown: fareBreakdown,
      notes: isOfficerDispatch ? 'Dispatched via Jan_Sahayak Municipal Officer Console.' : 'Citizen direct booking.'
    };

    setTimeout(() => {
      const order = createWorkerOrder(orderPayload);
      setIsSubmitting(false);
      setCreatedOrder(order);
      setIsSuccess(true);

      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess(order);
        onClose();
      }, 1500);
    }, 700);
  };

  return (
    <div className="citizen-bottom-sheet-overlay" onClick={onClose} style={{ zIndex: 1100 }}>
      <div 
        className="citizen-bottom-sheet-content" 
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: '640px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        <div className="sheet-handle" />

        {/* Modal Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isOfficerDispatch 
            ? 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)' 
            : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 100%)',
          borderRadius: '24px 24px 0 0'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                {isOfficerDispatch ? 'Dispatch Municipal Field Worker' : 'Book Local Technician'}
              </h2>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: isOfficerDispatch ? '#166534' : '#1D4ED8',
                background: isOfficerDispatch ? '#BBF7D0' : '#DBEAFE',
                padding: '2px 8px',
                borderRadius: '999px'
              }}>
                {isOfficerDispatch ? 'PMC Official Dispatch' : 'Citizen Service'}
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748B' }}>
              Instant direct request delivered to technician's mobile dashboard.
            </p>
          </div>

          <button 
            type="button" 
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '6px',
              borderRadius: '8px'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {isSuccess ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: '#DCFCE7',
              color: '#16A34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 24px rgba(22,163,74,0.25)'
            }}>
              <CheckCircle2 style={{ width: '38px', height: '38px' }} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
              Work Order #{createdOrder?.id} Created!
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#475569' }}>
              Assigned to <strong>{worker.name}</strong>. Worker has been notified instantly.
            </p>
            <span style={{
              display: 'inline-block',
              background: '#F1F5F9',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#334155'
            }}>
              Status: Incoming Request Pending Acceptance
            </span>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} style={{ padding: '20px 24px' }}>
            {/* Worker Summary Card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 16px',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              marginBottom: '18px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
            }}>
              <img
                src={worker.avatar}
                alt={worker.name}
                style={{ width: '52px', height: '52px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                    {worker.name}
                  </h4>
                  {worker.isVerified && (
                    <span title="Verified" style={{ display: 'inline-flex', color: '#16A34A' }}>
                      <ShieldCheck style={{ width: '16px', height: '16px' }} />
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                  <span>{categoryObj.icon} {categoryObj.name}</span>
                  <span>·</span>
                  <span>⭐ {worker.rating} ({worker.completedJobs} jobs)</span>
                  <span>·</span>
                  <span>{worker.experienceYears} yrs exp</span>
                </div>
                <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '12px', height: '12px', color: '#2563EB' }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {worker.ward} (~{distanceKm} km away)
                  </span>
                </div>
              </div>
            </div>

            {/* If linked to a complaint, show complaint banner */}
            {complaint && (
              <div style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '12px',
                padding: '10px 14px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Building2 style={{ width: '18px', height: '18px', color: '#1D4ED8', flexShrink: 0 }} />
                <div style={{ fontSize: '12px', color: '#1E40AF', overflow: 'hidden' }}>
                  <strong>Linked to Grievance #{complaint.id}:</strong> {complaint.title}
                </div>
              </div>
            )}

            {/* Service Requirement */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                Service Description & Scope *
              </label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe the exact fault, pipeline issue, or repair needed..."
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {/* Ward Location & Time Slot */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Job Ward Location
                </label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={e => setWard(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Preferred Time Slot
                </label>
                <select
                  value={timeSlot}
                  onChange={e => setTimeSlot(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    background: '#FFFFFF'
                  }}
                >
                  {TIME_SLOTS.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Duration & Urgency */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Estimated Job Duration
                </label>
                <select
                  value={durationHours}
                  onChange={e => setDurationHours(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    background: '#FFFFFF'
                  }}
                >
                  <option value={1}>1 Hour (Minor repair)</option>
                  <option value={2}>2 Hours (Standard repair)</option>
                  <option value={3}>3 Hours (Extensive fitting)</option>
                  <option value={4}>4 Hours (Major overhaul)</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                  Priority / Urgency
                </label>
                <select
                  value={urgency}
                  onChange={e => setUrgency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12.5px',
                    boxSizing: 'border-box',
                    background: '#FFFFFF'
                  }}
                >
                  <option value="NORMAL">Normal Priority</option>
                  <option value="URGENT">Urgent (+20% surge)</option>
                  <option value="CRITICAL_EMERGENCY">Critical Emergency (+40% surge)</option>
                </select>
              </div>
            </div>

            {/* Dynamic Fare Estimation Breakdown */}
            {fareBreakdown && (
              <div style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '16px 18px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles style={{ width: '15px', height: '15px', color: '#2563EB' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                      Transparent Fare Estimation
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    Dynamic Wagholi Tariff Engine
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#475569' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Base Labor ({fareBreakdown.durationHours} hrs @ ₹{worker.baseFarePerHour}/hr)</span>
                    <span style={{ fontWeight: 600 }}>₹{fareBreakdown.baseLabor}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Travel & Proximity ({fareBreakdown.distanceKm} km in Wagholi)</span>
                    <span style={{ fontWeight: 600 }}>+₹{fareBreakdown.distanceCharge}</span>
                  </div>

                  {fareBreakdown.urgencySurcharge > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D97706' }}>
                      <span>Priority Rush Surcharge ({fareBreakdown.urgencyMultiplier}x)</span>
                      <span style={{ fontWeight: 600 }}>+₹{fareBreakdown.urgencySurcharge}</span>
                    </div>
                  )}

                  {fareBreakdown.institutionalDiscount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16A34A' }}>
                      <span>Municipal Institutional Rate (-15%)</span>
                      <span style={{ fontWeight: 600 }}>-₹{fareBreakdown.institutionalDiscount}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Platform & Insurance Escrow</span>
                    <span style={{ fontWeight: 600 }}>+₹{fareBreakdown.platformFee}</span>
                  </div>

                  <div style={{
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #CBD5E1',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                        Total Estimated Fare
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                        Payable after inspection & completion
                      </div>
                    </div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#16A34A', fontFamily: 'monospace' }}>
                      ₹{fareBreakdown.totalEstimatedFare}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  background: isOfficerDispatch ? '#16A34A' : '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: isOfficerDispatch 
                    ? '0 4px 14px rgba(22,163,74,0.35)' 
                    : '0 4px 14px rgba(37,99,235,0.35)'
                }}
              >
                <ArrowRight style={{ width: '15px', height: '15px' }} />
                <span>
                  {isSubmitting 
                    ? 'Creating Order...' 
                    : isOfficerDispatch 
                      ? 'Dispatch Technician Now' 
                      : `Confirm & Book (₹${fareBreakdown?.totalEstimatedFare || 450})`
                  }
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
