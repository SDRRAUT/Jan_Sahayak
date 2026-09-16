import React, { useState } from 'react';
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
  Send 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import { AlertCircle, HelpCircle } from 'lucide-react';

export default function CitizenDetail() {
  const { id } = useParams();
  const { grievances, upvoteGrievance, respondInfo, reopenDispute, submitFeedback, user } = useApp();
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [userComment, setUserComment] = useState('');
  const [citizenReply, setCitizenReply] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const item = grievances.find(g => g.id === id) || grievances[0];

  const handleSendClarification = async (requestId) => {
    if (!citizenReply.trim()) return;
    await respondInfo(item.id, requestId, citizenReply);
    setCitizenReply('');
    setActionMessage('Clarification submitted to officer on duty.');
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    await reopenDispute(item.id, disputeReason);
    setShowDisputeForm(false);
    setActionMessage('Case closure disputed. Escalated to Superintending Engineer.');
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    await submitFeedback(item.id, feedbackRating, userComment);
    setFeedbackSent(true);
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '24px' }}>
      <div className="container">
        {/* Navigation back bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <Link
            to="/citizen"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-primary)'
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
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <ThumbsUp style={{ width: '13px', height: '13px' }} />
              <span>Upvote ({item.upvotes || 1})</span>
            </button>
          </div>
        </div>

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
                <span className="category-pill">{item.department}</span>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '11px',
                  fontWeight: 700,
                  background: item.status === 'RESOLVED' ? '#ECFDF5' : (item.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB'),
                  color: item.status === 'RESOLVED' ? '#065F46' : (item.urgency === 'CRITICAL' ? '#991B1B' : '#92400E')
                }}>
                  ● {item.status.replace('_', ' ')}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                  Logged: {item.createdAt}
                </span>
              </div>

              {/* Title */}
              <h2 style={{ fontSize: '26px', lineHeight: 1.25, marginBottom: '16px' }}>
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
                  Original Citizen Report ({item.languageDetected}):
                </span>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
                  "{item.descriptionRaw}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                    {item.location.area}, {item.location.ward}
                  </span>
                  <span>PIN: {item.location.pincode}</span>
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

              {/* Dispute & Reopen Option for Resolved Cases */}
              {item.status === 'RESOLVED' && (
                <div style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8F9FA',
                  border: '1px solid var(--color-border-subtle)',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)', display: 'block' }}>
                      Unsatisfied with the Resolution?
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      You can dispute this closure within 72 hours for Senior Engineer re-investigation.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDisputeForm(!showDisputeForm)}
                    className="btn-secondary btn-sm"
                    style={{ color: '#B91C1C', borderColor: '#FECACA' }}
                  >
                    Dispute & Reopen Ticket
                  </button>
                </div>
              )}

              {showDisputeForm && (
                <form onSubmit={handleReopenSubmit} className="card" style={{ padding: '20px', background: '#FEF2F2', border: '1px solid #FCA5A5', marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', color: '#991B1B', marginBottom: '6px' }}>
                    Reason for Disputing Resolution
                  </h4>
                  <textarea
                    rows={3}
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describe why the issue was not solved satisfactorily (e.g. Water leak returned this morning)..."
                    style={{
                      width: '100%',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid #F87171',
                      padding: '10px',
                      fontSize: '13px',
                      marginBottom: '10px',
                      background: '#FFFFFF'
                    }}
                    required
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="submit" className="btn-primary btn-sm" style={{ background: '#DC2626' }}>
                      Confirm Escalated Dispute
                    </button>
                    <button type="button" onClick={() => setShowDisputeForm(false)} className="btn-secondary btn-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Visual Resolution Timeline */}
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>
                Resolution Progress Timeline
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', position: 'relative', paddingLeft: '24px' }}>
                {/* Vertical line indicator */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  bottom: '10px',
                  left: '7px',
                  width: '2px',
                  background: 'var(--color-border-medium)'
                }} />

                {item.timeline && item.timeline.map((step, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    {/* Circle Node */}
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

            {/* Plain Language WhatsApp/SMS Notifications Feed */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div className="icon-squircle" style={{ width: '32px', height: '32px' }}>
                  <MessageSquare style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h4 style={{ fontSize: '15px' }}>Citizen Broadcast Updates (SMS & WhatsApp)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Plain-language notifications sent to {item.citizenPhone}</p>
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
                  "{item.recommendedResolution?.citizenDraftHindi}"
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
                  "{item.recommendedResolution?.citizenDraftEnglish}"
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
                    <h4 style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>{item.officerName}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block' }}>{item.officerDesignation}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>{item.department}</span>
                  </div>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Target SLA:</span>
                    <strong className="font-mono-numbers">{item.slaDeadline}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Hours Remaining:</span>
                    <strong className="font-mono-numbers" style={{ color: item.slaHoursLeft < 6 ? '#EF4444' : '#10B981' }}>
                      {item.slaHoursLeft} Hours
                    </strong>
                  </div>
                </div>

                <Link
                  to={`/officer/complaints/${item.id}`}
                  className="btn-secondary btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
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
                            padding: '2px'
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
                        marginBottom: '10px'
                      }}
                    />

                    <button type="submit" className="btn-primary btn-sm" style={{ width: '100%' }}>
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
