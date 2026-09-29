import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  Building2, 
  CheckCircle2, 
  ThumbsUp, 
  MessageSquare, 
  ShieldCheck, 
  Share2, 
  PhoneCall, 
  Send,
  AlertCircle,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  XCircle,
  Calendar,
  Timer
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';

export default function CitizenDetail() {
  const { id } = useParams();
  const { 
    grievances, 
    upvoteGrievance, 
    respondInfo, 
    reopenDispute, 
    verifyGrievance,
    disputeGrievance,
    triggerVerificationTimeout,
    submitFeedback, 
    user 
  } = useApp();

  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [citizenReply, setCitizenReply] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [actionMessage, setActionMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const item = grievances.find(g => g.id === id) || grievances[0];

  // Calculate 4-day remaining countdown
  const getVerificationCountdown = () => {
    if (!item) return { days: 4, hours: 0, expired: false, label: '4 days 0 hours' };
    
    const deadlineStr = item.verification_deadline || 
      (item.verification_started_at ? new Date(new Date(item.verification_started_at).getTime() + 4 * 86400000).toISOString() : null);
    
    if (!deadlineStr) return { days: 4, hours: 0, expired: false, label: '4 days 0 hours' };

    const deadline = new Date(deadlineStr).getTime();
    const now = Date.now();
    const diff = deadline - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, expired: true, label: 'Expired' };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return { days, hours, expired: false, label: `${days} days ${hours} hours` };
  };

  const countdown = getVerificationCountdown();

  // Citizen Confirmation: Issue Resolved
  const handleConfirmResolution = async () => {
    setIsVerifying(true);
    try {
      await verifyGrievance(item.id, 'Citizen confirmed resolution on-site.');
      setActionMessage('Thank you! Resolution confirmed. Grievance marked RESOLVED_CONFIRMED.');
    } catch (err) {
      setActionMessage('Failed to confirm resolution.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Citizen Dispute: Issue Not Resolved
  const handleDisputeResolution = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;

    setIsVerifying(true);
    try {
      await disputeGrievance(item.id, disputeReason);
      setShowDisputeForm(false);
      setDisputeReason('');
      setActionMessage('Dispute registered. Ticket reopened and escalated for re-investigation.');
    } catch (err) {
      setActionMessage('Failed to register dispute.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Simulation test: Trigger 4-Day Timeout
  const handleSimulateAutoSolve = async () => {
    try {
      await triggerVerificationTimeout();
      setActionMessage('4-Day verification scheduler triggered. Expired cases auto-resolved.');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendClarification = async (requestId) => {
    if (!citizenReply.trim()) return;
    await respondInfo(item.id, requestId, citizenReply);
    setCitizenReply('');
    setActionMessage('Clarification submitted to officer on duty.');
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    await submitFeedback(item.id, feedbackRating, userComment);
    setFeedbackSent(true);
  };

  if (!item) {
    return (
      <div className="section-spacing" style={{ paddingTop: '40px', textAlign: 'center' }}>
        <h2>Grievance Not Found</h2>
        <Link to="/citizen" className="btn-primary" style={{ marginTop: '16px' }}>Return to Dashboard</Link>
      </div>
    );
  }

  const isPendingVerification = item.status === 'VERIFICATION_PENDING';
  const isAutoResolved = item.status === 'AUTO_RESOLVED' || item.auto_closed;
  const isCitizenConfirmed = item.status === 'RESOLVED_CONFIRMED';
  const isDisputed = item.status === 'DISPUTE_REOPENED';

  return (
    <div className="section-spacing" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      <div className="container">
        {/* Navigation back bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <Link
            to="/citizen"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-primary)',
              minHeight: '44px'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            <span>Back to Citizen Portal</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="font-mono-numbers" style={{ fontSize: '12px', padding: '4px 10px', borderRadius: 'var(--radius-full)', background: '#F1F5F9', color: 'var(--color-text-secondary)' }}>
              Ticket: {item.id}
            </span>
            <button
              onClick={() => upvoteGrievance(item.id)}
              className="btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', minHeight: '44px' }}
            >
              <ThumbsUp style={{ width: '13px', height: '13px' }} />
              <span>Upvote ({item.upvotes || 1})</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4-DAY CITIZEN VERIFICATION BANNER & ACTIONS (SECTION 6 & 7) */}
        {/* ========================================================================= */}
        {isPendingVerification && (
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-xl)',
            background: '#FFFBEB',
            border: '2px solid #F59E0B',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Timer style={{ width: '28px', height: '28px', color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div className="category-pill" style={{ background: '#FEF3C7', color: '#92400E', border: '1px solid #FDE68A', marginBottom: '6px' }}>
                    ACTION REQUIRED: RESOLUTION VERIFICATION
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#78350F', margin: '0 0 6px 0', fontWeight: 800 }}>
                    Please Verify Municipal Work
                  </h3>
                  <p style={{ fontSize: '14px', color: '#92400E', margin: 0, lineHeight: 1.5, maxWidth: '650px' }}>
                    Your complaint #{item.id} has been marked resolved by <strong>{item.officerName || 'the assigned authority'}</strong>.
                    Please verify the resolution within 4 days. If no response is received, it will automatically close.
                  </p>
                </div>
              </div>

              {/* Countdown badge */}
              <div style={{
                padding: '12px 18px',
                borderRadius: 'var(--radius-lg)',
                background: '#FFFFFF',
                border: '2px solid #FCD34D',
                textAlign: 'center',
                minWidth: '160px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#B45309', display: 'block' }}>
                  Verification closes in:
                </span>
                <strong style={{ fontSize: '16px', color: '#D97706', display: 'block', marginTop: '2px' }}>
                  {countdown.label}
                </strong>
              </div>
            </div>

            {/* Direct Verification Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'wrap',
              paddingTop: '16px',
              borderTop: '1px solid #FDE68A'
            }}>
              <button
                type="button"
                onClick={handleConfirmResolution}
                disabled={isVerifying}
                style={{
                  minHeight: '48px',
                  padding: '0 24px',
                  borderRadius: 'var(--radius-md)',
                  background: '#059669',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isVerifying ? 'not-allowed' : 'pointer',
                  boxShadow: 'var(--shadow-xs)'
                }}
              >
                <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                <span>Issue Resolved (Confirm)</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDisputeForm(!showDisputeForm)}
                disabled={isVerifying}
                style={{
                  minHeight: '48px',
                  padding: '0 20px',
                  borderRadius: 'var(--radius-md)',
                  background: '#FFFFFF',
                  color: '#DC2626',
                  border: '2px solid #DC2626',
                  fontSize: '14px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: isVerifying ? 'not-allowed' : 'pointer'
                }}
              >
                <XCircle style={{ width: '18px', height: '18px' }} />
                <span>Issue Not Resolved (Dispute)</span>
              </button>

              {/* Development / Testing Quick Auto-Solve Simulation */}
              <button
                type="button"
                onClick={handleSimulateAutoSolve}
                style={{
                  marginLeft: 'auto',
                  border: 'none',
                  background: 'none',
                  color: '#92400E',
                  fontSize: '11px',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                [Dev Test: Simulate 4-Day Timeout]
              </button>
            </div>

            {/* Dispute Input Form */}
            {showDisputeForm && (
              <form onSubmit={handleDisputeResolution} style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #FCD34D' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#92400E', marginBottom: '6px' }}>
                  Why is the issue still not resolved?
                </label>
                <textarea
                  rows={3}
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  placeholder="e.g., The pipeline was patched temporarily but water contamination started again this morning..."
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid #F87171',
                    padding: '12px',
                    fontSize: '13px',
                    marginBottom: '10px',
                    background: '#FFFFFF',
                    boxSizing: 'border-box'
                  }}
                  required
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={isVerifying || !disputeReason.trim()}
                    style={{
                      minHeight: '44px',
                      padding: '0 20px',
                      borderRadius: 'var(--radius-md)',
                      background: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Submit Dispute & Reopen Grievance
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDisputeForm(false)}
                    style={{
                      minHeight: '44px',
                      padding: '0 16px',
                      borderRadius: 'var(--radius-md)',
                      background: '#FFFFFF',
                      border: '1px solid var(--color-border-medium)',
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* AUTO RESOLVED STATUS NOTICE */}
        {isAutoResolved && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <CheckCircle2 style={{ width: '22px', height: '22px', color: '#16A34A', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '14px', color: '#166534', display: 'block' }}>
                Resolution method: Automatic closure after 4-day verification window
              </strong>
              <span style={{ fontSize: '12px', color: '#15803D' }}>
                Verification period ended. This complaint was automatically closed because no citizen response was received within the 4-day window.
              </span>
            </div>
          </div>
        )}

        {/* CITIZEN CONFIRMED NOTICE */}
        {isCitizenConfirmed && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <ShieldCheck style={{ width: '22px', height: '22px', color: '#059669', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '14px', color: '#065F46', display: 'block' }}>
                ✓ Resolution Confirmed by Citizen
              </strong>
              <span style={{ fontSize: '12px', color: '#047857' }}>
                Verified by citizen on {item.verified_at ? new Date(item.verified_at).toLocaleDateString() : 'site'}. Closed with full satisfaction.
              </span>
            </div>
          </div>
        )}

        {/* DISPUTE REOPENED NOTICE */}
        {isDisputed && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            background: '#FEF2F2',
            border: '1px solid #FECACA',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <RotateCcw style={{ width: '22px', height: '22px', color: '#DC2626', flexShrink: 0 }} />
            <div>
              <strong style={{ fontSize: '14px', color: '#991B1B', display: 'block' }}>
                Grievance Reopened via Citizen Dispute
              </strong>
              <span style={{ fontSize: '12px', color: '#B91C1C' }}>
                Reason: "{item.dispute_reason || 'Citizen indicated issue is still recurring'}". Re-assigned for supervisor investigation.
              </span>
            </div>
          </div>
        )}

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Column (7 Cols): Grievance Detail & Visual Timeline */}
          <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
            <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
              {/* Header tags */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="category-pill">{item.department || item.category}</span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: item.status.includes('RESOLVED') ? '#ECFDF5' : (item.status === 'VERIFICATION_PENDING' ? '#FEF3C7' : (item.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB')),
                  color: item.status.includes('RESOLVED') ? '#065F46' : (item.status === 'VERIFICATION_PENDING' ? '#92400E' : (item.urgency === 'CRITICAL' ? '#991B1B' : '#92400E'))
                }}>
                  ● {item.status.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                  Logged: {item.createdAt || 'Recent'}
                </span>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: '24px', lineHeight: 1.3, marginBottom: '16px', fontWeight: 800 }}>
                {item.title}
              </h2>

              {/* Raw Citizen Submission */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: '#F8F9FA',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '24px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Original Citizen Report ({item.languageDetected || 'Natural Language'}):
                </span>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-primary)', margin: 0 }}>
                  "{item.descriptionRaw || item.description}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                    {item.location?.area || item.area || 'Pocket 2'}, {item.location?.ward || item.ward || 'Ward 14'}
                  </span>
                  <span>PIN: {item.location?.pincode || item.pincode || '110085'}</span>
                  {item.location?.latitude && (
                    <span style={{ fontFamily: 'monospace' }}>
                      GPS: {Number(item.location.latitude).toFixed(4)}, {Number(item.location.longitude).toFixed(4)} ({item.location.source || 'gps'})
                    </span>
                  )}
                </div>
              </div>

              {actionMessage && (
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>{actionMessage}</span>
                </div>
              )}

              {/* Information Requests from Authorities */}
              {item.informationRequests && item.informationRequests.length > 0 && (
                <div style={{
                  padding: '20px',
                  borderRadius: 'var(--radius-md)',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#B45309' }}>
                    <HelpCircle style={{ width: '18px', height: '18px' }} />
                    <strong style={{ fontSize: '14px' }}>Clarification Requested by Authority</strong>
                  </div>

                  {item.informationRequests.map((req, i) => (
                    <div key={req.id || i} style={{ marginBottom: '12px' }}>
                      <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5, marginBottom: '6px' }}>
                        <strong>{req.askedBy} ({req.officerDesignation}): </strong>
                        "{req.question}"
                      </p>

                      {req.response ? (
                        <div style={{ padding: '8px 12px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #FCD34D', fontSize: '12px', color: '#92400E' }}>
                          <strong>Your Reply: </strong> {req.response} ({req.answeredAt})
                        </div>
                      ) : (
                        <div style={{ marginTop: '8px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input
                              type="text"
                              value={citizenReply}
                              onChange={(e) => setCitizenReply(e.target.value)}
                              placeholder="Type your clarification to the officer..."
                              style={{
                                flex: 1,
                                height: '38px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid #FCD34D',
                                padding: '0 10px',
                                fontSize: '12px',
                                background: '#FFFFFF'
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleSendClarification(req.id)}
                              className="btn-primary btn-sm"
                              style={{ height: '38px', background: '#B45309' }}
                            >
                              <Send style={{ width: '13px', height: '13px' }} />
                              <span>Reply</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Visual Resolution Timeline */}
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>
                Resolution Progress Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative', paddingLeft: '24px' }}>
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  bottom: '10px',
                  left: '7px',
                  width: '2px',
                  background: 'var(--color-border-medium)'
                }} />

                {(item.timeline || [
                  { stage: 'Grievance Submitted', detail: 'Received and verified via multi-modal AI.', time: 'Initial', status: 'completed' },
                  { stage: 'Department Dispatched', detail: `Assigned to ${item.department || 'Municipal Corporation'}.`, time: 'T+2h', status: 'completed' },
                  { stage: 'Field Inspection', detail: 'Officer inspecting site.', time: 'In Progress', status: 'in_progress' }
                ]).map((step, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute',
                      left: '-24px',
                      top: '2px',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      background: step.status === 'completed' ? 'var(--color-primary)' : (step.status === 'in_progress' ? '#F59E0B' : '#FFFFFF'),
                      border: '2px solid',
                      borderColor: step.status === 'completed' ? 'var(--color-primary)' : (step.status === 'in_progress' ? '#F59E0B' : 'var(--color-border-medium)'),
                      boxShadow: step.status === 'in_progress' ? '0 0 0 4px rgba(245, 158, 11, 0.2)' : 'none'
                    }} />

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                          {step.stage}
                        </strong>
                        <span className="font-mono-numbers" style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {step.time}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '2px', lineHeight: 1.5 }}>
                        {step.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Plain Language Notifications Feed */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div className="icon-squircle" style={{ width: '32px', height: '32px' }}>
                  <MessageSquare style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px', margin: 0 }}>Citizen Broadcast Updates (SMS & WhatsApp)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Automated alerts sent to {item.citizenPhone || 'registered mobile'}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: '#166534'
                }}>
                  <strong style={{ display: 'block', fontSize: '11px', color: '#15803D', marginBottom: '2px' }}>
                    WhatsApp Broadcast • Sent in Hindi
                  </strong>
                  "{item.recommendedResolution?.citizenDraftHindi || `नमस्ते! आपकी शिकायत #${item.id} पर काम शुरू हो चुका है। जनसहायक ट्रैकिंग लिंक पर लाइव स्थिति देखें।`}"
                </div>

                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: '#F8F9FA',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary)'
                }}>
                  <strong style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    SMS Notification • Sent in English
                  </strong>
                  "{item.recommendedResolution?.citizenDraftEnglish || `Jan Sahayak Alert: Grievance #${item.id} has been acknowledged by ${item.department || 'the relevant department'}.`}"
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Assigned Officer & Grievance DNA */}
          <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Grievance DNA Component */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', display: 'block', marginBottom: '10px' }}>
                  Active Intelligence DNA™
                </span>
                <GrievanceDnaCard dna={item.grievanceDna} compact={false} />
              </div>

              {/* Assigned Officer Card */}
              <div className="card" style={{ padding: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '12px' }}>
                  Assigned Public Authority
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '15px'
                  }}>
                    {item.officerName ? item.officerName.substring(3, 5) : 'EE'}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', color: 'var(--color-text-primary)', margin: 0 }}>{item.officerName || 'Er. R.K. Sharma'}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block' }}>{item.officerDesignation || 'Executive Engineer (Civil)'}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>{item.department || 'Delhi Jal Board'}</span>
                  </div>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Target SLA:</span>
                    <strong className="font-mono-numbers">{item.slaDeadline || '24h Window'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Hours Remaining:</span>
                    <strong className="font-mono-numbers" style={{ color: (item.slaHoursLeft || 12) < 6 ? '#EF4444' : '#10B981' }}>
                      {item.slaHoursLeft || 12} Hours
                    </strong>
                  </div>
                </div>

                <Link
                  to={`/officer/complaints/${item.id}`}
                  className="btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center', minHeight: '44px' }}
                >
                  Inspect in Officer Workspace
                </Link>
              </div>

              {/* Citizen Satisfaction Feedback Form */}
              <div className="card" style={{ padding: '24px' }}>
                <h4 style={{ fontSize: '15px', marginBottom: '6px' }}>Citizen Satisfaction</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                  Rate the speed and responsiveness of this municipal service.
                </p>

                {feedbackSent ? (
                  <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', color: '#065F46', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                    <span>Thank you! Your feedback has been logged into the public satisfaction matrix.</span>
                  </div>
                ) : (
                  <form onSubmit={handleRatingSubmit}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          style={{
                            fontSize: '22px',
                            color: star <= feedbackRating ? '#F59E0B' : '#E2E8F0',
                            padding: '4px',
                            minWidth: '44px',
                            minHeight: '44px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          ★
                        </button>
                      ))}
                    </div>

                    <textarea
                      rows={2}
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      placeholder="Optional comments for municipal records..."
                      style={{
                        width: '100%',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border-medium)',
                        padding: '8px 12px',
                        fontSize: '12px',
                        marginBottom: '10px',
                        boxSizing: 'border-box'
                      }}
                    />

                    <button type="submit" className="btn-primary btn-sm" style={{ width: '100%', minHeight: '44px' }}>
                      Submit Feedback
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
