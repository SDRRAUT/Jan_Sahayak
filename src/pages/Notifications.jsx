import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Check, 
  X, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Notifications() {
  const navigate = useNavigate();
  const { grievances, verifyGrievance, disputeGrievance } = useApp();

  // Find verification-pending grievances
  const pendingVerifications = grievances.filter(g => g.status === 'VERIFICATION_PENDING');

  return (
    <div className="section-spacing" style={{ paddingTop: '28px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div className="category-pill" style={{ marginBottom: '6px' }}>
              <Bell style={{ width: '13px', height: '13px' }} />
              <span>CITIZEN ALERTS & DISPATCHES</span>
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, margin: 0 }}>
              Notifications & Action Requests
            </h1>
          </div>
          <Link to="/citizen" className="btn-secondary btn-sm" style={{ minHeight: '44px' }}>
            Back to Dashboard
          </Link>
        </div>

        {/* SECTION 7: URGENT VERIFICATION ACTION REQUESTS */}
        {pendingVerifications.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#B45309', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Timer style={{ width: '18px', height: '18px', color: '#D97706' }} />
              <span>Action Required: Resolution Verifications (4-Day Window)</span>
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {pendingVerifications.map(item => {
                const deadline = item.verification_deadline ? new Date(item.verification_deadline).getTime() : Date.now() + 4 * 86400000;
                const diff = Math.max(0, deadline - Date.now());
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '20px',
                      background: '#FFFBEB',
                      border: '2px solid #F59E0B',
                      borderRadius: 'var(--radius-lg)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '15px', color: '#78350F' }}>
                        Your complaint #{item.id} has been marked resolved.
                      </strong>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: '#FEF3C7',
                        border: '1px solid #FCD34D',
                        fontSize: '11px',
                        fontWeight: 800,
                        color: '#92400E'
                      }}>
                        Verification closes in: {days} days {hours} hours
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#92400E', margin: '0 0 14px 0', lineHeight: 1.5 }}>
                      Officer {item.officerName || 'assigned'} has completed repair work for: "<strong>{item.title}</strong>".
                      Please verify on-site and confirm or dispute within 4 days.
                    </p>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => verifyGrievance(item.id, 'Confirmed resolved via notifications')}
                        style={{
                          minHeight: '44px',
                          padding: '0 18px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#059669',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                        <span>Issue Resolved</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate(`/citizen/complaints/${item.id}`)}
                        style={{
                          minHeight: '44px',
                          padding: '0 16px',
                          borderRadius: 'var(--radius-sm)',
                          background: '#FFFFFF',
                          color: '#DC2626',
                          border: '1px solid #FCA5A5',
                          fontSize: '13px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Issue Not Resolved
                      </button>

                      <Link
                        to={`/citizen/complaints/${item.id}`}
                        style={{
                          minHeight: '44px',
                          padding: '0 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: 'var(--color-primary)',
                          marginLeft: 'auto'
                        }}
                      >
                        <span>View Ticket Details</span>
                        <ArrowRight style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* GENERAL STATUS NOTIFICATIONS */}
        <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px' }}>
          Recent Activity & SMS/WhatsApp Broadcasts
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {grievances.slice(0, 5).map(g => (
            <div
              key={g.id}
              className="card"
              style={{
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: g.status.includes('RESOLVED') ? '#ECFDF5' : '#EFF6FF',
                  color: g.status.includes('RESOLVED') ? '#059669' : '#2563EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {g.status.includes('RESOLVED') ? <CheckCircle2 style={{ width: '18px', height: '18px' }} /> : <Clock style={{ width: '18px', height: '18px' }} />}
                </div>

                <div>
                  <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-text-primary)' }}>
                    Ticket #{g.id}: {g.status.replace(/_/g, ' ')}
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {g.title} • {g.department || g.category}
                  </span>
                </div>
              </div>

              <Link
                to={`/citizen/complaints/${g.id}`}
                className="btn-secondary btn-sm"
                style={{ minHeight: '44px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <span>Track</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
