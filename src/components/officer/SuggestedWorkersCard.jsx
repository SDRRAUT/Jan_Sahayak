import React, { useState, useMemo } from 'react';
import { 
  Sparkles, Wrench, ShieldCheck, MapPin, ArrowRight, 
  CheckCircle2, Clock, Phone, ExternalLink, AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { matchWorkersForComplaint } from '../../services/workerMatchingService';
import BookWorkerModal from '../worker/BookWorkerModal';

export default function SuggestedWorkersCard({ complaint }) {
  const { workers = [], workerOrders = [] } = useApp();
  const [selectedWorkerForBooking, setSelectedWorkerForBooking] = useState(null);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Match nearby workers based on complaint text, ward, and urgency
  const matchResult = useMemo(() => {
    if (!complaint) return null;
    return matchWorkersForComplaint(complaint, workers);
  }, [complaint, workers]);

  // Find any active or completed orders attached to this complaint
  const attachedOrders = useMemo(() => {
    if (!complaint) return [];
    return workerOrders.filter(o => o.complaintId === complaint.id);
  }, [complaint, workerOrders]);

  if (!complaint || !matchResult) return null;

  const { categoryConfig, rationale, recommendations } = matchResult;

  const handleOpenBookModal = (worker) => {
    setSelectedWorkerForBooking(worker);
    setIsBookModalOpen(true);
  };

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 4px 18px -2px rgba(15, 23, 42, 0.05)',
      marginBottom: '20px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: '#F0FDF4',
            color: '#16A34A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #BBF7D0'
          }}>
            <Sparkles style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
              Field Workforce Recommendation (AI)
            </h3>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Autonomous technician matching based on complaint DNA & Wagholi proximity
            </div>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '999px',
          padding: '4px 12px'
        }}>
          <span style={{ fontSize: '13px' }}>{categoryConfig.icon}</span>
          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#1D4ED8' }}>
            Recommended Trade: {categoryConfig.name}
          </span>
        </div>
      </div>

      {/* AI Rationale banner */}
      <div style={{
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '10px 14px',
        fontSize: '12px',
        color: '#475569',
        marginBottom: '16px',
        lineHeight: 1.5
      }}>
        <strong style={{ color: '#0F172A' }}>AI Diagnosis: </strong>
        {rationale}
      </div>

      {/* Existing Linked Work Orders Banner */}
      {attachedOrders.length > 0 && (
        <div style={{
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#16A34A' }} />
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#065F46' }}>
              Active Field Work Order Dispatched ({attachedOrders.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {attachedOrders.map(order => (
              <div 
                key={order.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  border: '1px solid #D1FAE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                    #{order.id} · {order.workerName} ({order.workerCategory})
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Scheduled: {order.scheduledTime} · Fare: ₹{order.estimatedFare}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: order.status === 'COMPLETED' ? '#DCFCE7' : order.status === 'IN_PROGRESS' ? '#FEF3C7' : '#EFF6FF',
                    color: order.status === 'COMPLETED' ? '#166534' : order.status === 'IN_PROGRESS' ? '#92400E' : '#1D4ED8'
                  }}>
                    {order.status.replace('_', ' ')}
                  </span>
                  <a 
                    href={`tel:${order.workerPhone}`}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      background: '#F1F5F9',
                      color: '#0F172A',
                      fontSize: '11px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Phone style={{ width: '11px', height: '11px' }} /> Call
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Workers List */}
      <div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
          Available Wagholi Technicians ({recommendations.length})
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {recommendations.slice(0, 3).map(rec => {
            const { worker, compatibilityScore, distanceKm, isAvailable, estimatedFare } = rec;

            return (
              <div
                key={worker.id}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '14px',
                  background: isAvailable ? '#FFFFFF' : '#FAFAFA',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={worker.avatar}
                        alt={worker.name}
                        style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                            {worker.name}
                          </span>
                          {worker.isVerified && (
                            <ShieldCheck style={{ width: '14px', height: '14px', color: '#16A34A' }} />
                          )}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          ⭐ {worker.rating} · {worker.experienceYears} yrs exp
                        </div>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: isAvailable ? '#DCFCE7' : '#FEF3C7',
                      color: isAvailable ? '#15803D' : '#B45309'
                    }}>
                      {isAvailable ? 'AVAILABLE' : 'BUSY'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#475569', marginBottom: '6px' }}>
                    <MapPin style={{ width: '12px', height: '12px', color: '#2563EB', flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {worker.ward} (~{distanceKm} km away)
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '10px' }}>
                    {worker.skills?.slice(0, 2).map((skill, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: '10px',
                          background: '#F1F5F9',
                          color: '#475569',
                          padding: '2px 6px',
                          borderRadius: '6px'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}>
                  <div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Est. Municipal Rate</div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#16A34A', fontFamily: 'monospace' }}>
                      ₹{estimatedFare}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenBookModal(worker)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#16A34A',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 6px rgba(22,163,74,0.25)'
                    }}
                  >
                    <span>1-Click Dispatch</span>
                    <ArrowRight style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Booking Modal */}
      {selectedWorkerForBooking && (
        <BookWorkerModal
          worker={selectedWorkerForBooking}
          complaint={complaint}
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          onSuccess={() => setIsBookModalOpen(false)}
        />
      )}
    </div>
  );
}
