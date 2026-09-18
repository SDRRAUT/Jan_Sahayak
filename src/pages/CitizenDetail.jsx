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
  Send,
  AlertCircle,
  HelpCircle,
  Camera,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import VisualJourneyTimeline from '../components/common/VisualJourneyTimeline';
import ResolutionVerificationCard from '../components/common/ResolutionVerificationCard';
import WhyExplainer from '../components/common/WhyExplainer';
import ResolutionIntelligenceCard from '../components/common/ResolutionIntelligenceCard';
import ProblemSpreadMap from '../components/intelligence/ProblemSpreadMap';

export default function CitizenDetail() {
  const { id } = useParams();
  const { grievances, upvoteGrievance, respondInfo, reopenDispute, submitFeedback, verifyResolution, user } = useApp();
  const [citizenReply, setCitizenReply] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const item = grievances.find(g => g.id === id) || grievances[0];

  const handleSendClarification = async (requestId) => {
    if (!citizenReply.trim()) return;
    await respondInfo(item.id, requestId, citizenReply);
    setCitizenReply('');
    setActionMessage('Clarification submitted to officer on duty.');
  };

  const priorityReasons = [
    'Hazard severity classified from citizen verbatim text',
    `Location in ${item.location?.ward || 'Ward 22 (Mayur Vihar Ph-1)'} under active priority watch`,
    'Response SLA target calculated from municipal guidelines'
  ];

  return (
    <div className="section-spacing" style={{ paddingTop: '20px', paddingBottom: '60px' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        {/* Navigation & Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <Link
            to="/citizen"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#0284C7',
              background: '#F0F9FF',
              padding: '6px 14px',
              borderRadius: '999px',
              border: '1px solid #BAE6FD',
              textDecoration: 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span>Back to Citizen Portal</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'var(--font-mono, monospace)',
              padding: '6px 14px',
              borderRadius: '999px',
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              color: '#334155'
            }}>
              Ticket #{item.id}
            </span>
            <button
              onClick={() => upvoteGrievance(item.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#FFFFFF',
                border: '1.5px solid #E2E8F0',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#0F172A',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0284C7';
                e.currentTarget.style.color = '#0284C7';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0';
                e.currentTarget.style.color = '#0F172A';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <ThumbsUp style={{ width: '13px', height: '13px', color: '#0284C7' }} />
              <span>Upvote ({item.upvotes || 1})</span>
            </button>
          </div>
        </div>

        {/* Action Alert Banner if present */}
        {actionMessage && (
          <div style={{
            padding: '12px 18px',
            borderRadius: '12px',
            background: '#ECFDF5',
            border: '1.5px solid #A7F3D0',
            color: '#065F46',
            fontSize: '13.5px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.1)'
          }}>
            <CheckCircle2 style={{ width: '18px', height: '18px', color: '#059669', flexShrink: 0 }} />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* 6-Stage Visual Journey Stepper */}
        <div style={{ marginBottom: '24px' }}>
          <VisualJourneyTimeline
            status={item.status}
            createdAt={item.createdAt}
            officerName={item.officerName}
            department={item.department}
          />
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left Column (7 Cols): Grievance Detail & Actions */}
          <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
            
            {/* Closed Loop Resolution Verification */}
            {(item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' || item.status === 'DISPUTE_REOPENED') && (
              <div style={{ marginBottom: '24px' }}>
                <ResolutionVerificationCard
                  grievance={item}
                  onVerifyFixed={async (id, feedbackText, evidencePhotos) => {
                    await verifyResolution(id, 'SATISFIED', feedbackText, evidencePhotos);
                    setActionMessage('✓ Resolution confirmed by citizen. Case closed and logged to Civic Memory.');
                  }}
                  onReopenDispute={async (id, reason, evidencePhotos) => {
                    await verifyResolution(id, 'DISPUTED', reason, evidencePhotos);
                    setActionMessage('Case disputed and re-escalated to Department Superintending Engineer.');
                  }}
                  onSubmitFeedback={async (id, rating, comm) => {
                    await submitFeedback(id, rating, comm);
                    setActionMessage('Thank you! Your citizen rating has been registered in the municipal audit register.');
                  }}
                />
              </div>
            )}

            {/* Main Grievance Information Card */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid #E2E8F0',
              padding: '28px',
              marginBottom: '24px',
              boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)'
            }}>
              {/* Header Tags & Priority */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span style={{
                  padding: '4px 12px',
                  borderRadius: '999px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD',
                  color: '#0369A1'
                }}>
                  {item.department}
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: '999px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    background: item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' ? '#ECFDF5' : (item.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB'),
                    color: item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' ? '#065F46' : (item.urgency === 'CRITICAL' ? '#991B1B' : '#92400E'),
                    border: `1px solid ${item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' ? '#A7F3D0' : (item.urgency === 'CRITICAL' ? '#FECACA' : '#FDE68A')}`
                  }}>
                    ● {item.urgency || 'HIGH'} Priority
                  </span>
                  <WhyExplainer
                    label="Why?"
                    title="Why this Priority?"
                    reasons={priorityReasons}
                    align="left"
                  />
                </div>

                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, marginLeft: 'auto' }}>
                  Logged: {item.createdAt}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.35, marginBottom: '16px', color: '#0F172A' }}>
                {item.title}
              </h1>

              {/* Raw Citizen Submission */}
              <div style={{
                padding: '18px 20px',
                borderRadius: '14px',
                background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
                border: '1.5px solid #E2E8F0',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
                    Citizen Report ({item.languageDetected || 'Hinglish (Confidence 99%)'}):
                  </span>
                  <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#0284C7', background: '#E0F2FE', padding: '2px 8px', borderRadius: '6px' }}>
                    Original Text Verified
                  </span>
                </div>

                <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#1E293B', fontWeight: 500, margin: '0 0 12px 0' }}>
                  "{item.descriptionRaw}"
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: '#475569', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px solid #E2E8F0' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontWeight: 600 }}>
                    <MapPin style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                    {item.location?.area || 'Sector 6 DDA Market Complex'}, {item.location?.ward || 'Ward 22 (Mayur Vihar Ph-1)'}
                  </span>
                  <span style={{ background: '#FFFFFF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #E2E8F0', fontWeight: 600 }}>
                    PIN: {item.location?.pincode || '110091'}
                  </span>
                  {item.location?.lat && (
                    <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11.5px', color: '#0369A1', background: '#F0F9FF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #BAE6FD' }}>
                      📍 {Number(item.location.lat).toFixed(4)}, {Number(item.location.lng).toFixed(4)}
                    </span>
                  )}
                </div>
              </div>

              {/* Real Evidence Section (Citizen Photo + Field Completion Photo) */}
              {(item.evidence?.photoUrl || item.resolutionPhotoUrl) && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: item.evidence?.photoUrl && item.resolutionPhotoUrl ? '1fr 1fr' : '1fr',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  {item.evidence?.photoUrl && (
                    <div style={{ border: '1.5px solid #E2E8F0', borderRadius: '14px', overflow: 'hidden', background: '#FFFFFF' }}>
                      <span style={{ display: 'block', padding: '8px 12px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '11.5px', fontWeight: 700, color: '#475569' }}>
                        Original Problem Evidence
                      </span>
                      <img src={item.evidence.photoUrl} alt="Reported problem" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                    </div>
                  )}
                  {item.resolutionPhotoUrl && (
                    <div style={{ border: '1.5px solid #BBF7D0', borderRadius: '14px', overflow: 'hidden', background: '#FFFFFF' }}>
                      <span style={{ display: 'block', padding: '8px 12px', background: '#F0FDF4', borderBottom: '1px solid #BBF7D0', fontSize: '11.5px', fontWeight: 700, color: '#166534' }}>
                        Officer Field Completion Photo
                      </span>
                      <img src={item.resolutionPhotoUrl} alt="Resolution work" style={{ width: '100%', height: '170px', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* AI Resolution Intelligence Card */}
            <div style={{ marginBottom: '24px' }}>
              <ResolutionIntelligenceCard
                title="RESOLUTION INTELLIGENCE"
                recommendedAction={item.recommendedResolution?.recommendedAction || "Inspect drainage infrastructure before initiating road resurfacing."}
                standardOperatingProcedure={item.recommendedResolution?.standardOperatingProcedure || "Municipal Standard Operating Procedure Sec-4B"}
                estimatedDuration="6 Hours"
                whyPoints={[
                  `${item.clusterCount || 11} similar complaints recorded in ${item.location?.ward || 'Ward 22 (Mayur Vihar Ph-1)'}`,
                  "Nearby locations experiencing secondary overflow",
                  "Previous related municipal repairs logged in knowledge base",
                  "Relevant engineering standard operating procedure verified",
                  "Location clustering pattern identified across adjacent corridors"
                ]}
                supportingEvidence={[
                  { label: `${item.clusterCount || 11} Similar Cases`, tag: item.location?.ward || 'Ward 22 (Mayur Vihar Ph-1)' },
                  { label: "Relevant Policy", tag: "SOP Sec-4B" },
                  { label: "Previous Resolution", tag: "Case #JS-0891" },
                  { label: "Location Pattern", tag: "Flow Telemetry" }
                ]}
                engineeringReasoning={item.recommendedResolution?.reasoning || "Sub-surface inspection prevents recurrence of structural failure."}
                potentialSlaRisk="Dispatch authorized within municipal SLA guidelines."
                onApprove={() => setActionMessage('Citizen endorsed the AI recommended resolution path.')}
                onModify={() => setActionMessage('Citizen suggested custom feedback on the resolution path.')}
                onRequestMoreEvidence={() => setActionMessage('Citizen requested more diagnostic telemetry.')}
              />
            </div>

            {/* Officer Information Requests & Citizen Clarification Chat */}
            {item.informationRequests && item.informationRequests.length > 0 && (
              <div style={{
                padding: '22px',
                borderRadius: '16px',
                background: '#FFFBEB',
                border: '1.5px solid #FDE68A',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(245, 158, 11, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#B45309' }}>
                  <HelpCircle style={{ width: '18px', height: '18px' }} />
                  <strong style={{ fontSize: '14.5px', fontWeight: 800 }}>Clarification Requested by Officer</strong>
                </div>

                {item.informationRequests.map((req, i) => (
                  <div key={req.id || i} style={{ marginBottom: '14px' }}>
                    <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5, marginBottom: '8px' }}>
                      <strong>{req.askedBy} ({req.officerDesignation}): </strong>
                      "{req.question}"
                    </p>

                    {req.response ? (
                      <div style={{ padding: '10px 14px', borderRadius: '10px', background: '#FFFFFF', border: '1px solid #FCD34D', fontSize: '13px', color: '#92400E' }}>
                        <strong>Your Reply: </strong> {req.response} ({req.answeredAt})
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={citizenReply}
                          onChange={(e) => setCitizenReply(e.target.value)}
                          placeholder="Type your clarification for the officer..."
                          style={{
                            flex: 1,
                            height: '42px',
                            borderRadius: '10px',
                            border: '1.5px solid #FCD34D',
                            padding: '0 14px',
                            fontSize: '13.5px',
                            background: '#FFFFFF',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSendClarification(req.id)}
                          style={{
                            height: '42px',
                            padding: '0 16px',
                            borderRadius: '10px',
                            background: '#B45309',
                            color: '#FFFFFF',
                            border: 'none',
                            fontWeight: 700,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Send style={{ width: '13px', height: '13px' }} />
                          <span>Reply</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* WhatsApp/SMS Broadcast Feed */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid #E2E8F0',
              padding: '24px',
              boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                }}>
                  <MessageSquare style={{ width: '17px', height: '17px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Official Citizen Updates</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>Plain-language dispatches sent to <strong>{item.citizenPhone || '+91 99532-88712'}</strong></p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* WhatsApp Broadcast */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
                  border: '1.5px solid #BBF7D0',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  color: '#14532D'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#15803D' }}>
                      WhatsApp Broadcast (Hindi)
                    </strong>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#059669', background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                      Delivered
                    </span>
                  </div>
                  "{item.recommendedResolution?.citizenDraftHindi || 'आपकी शिकायत पर कार्यवाही शुरू कर दी गई है।'}"
                </div>

                {/* SMS Broadcast */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #F0F9FF 0%, #EFF6FF 100%)',
                  border: '1.5px solid #BFDBFE',
                  fontSize: '13.5px',
                  lineHeight: 1.5,
                  color: '#1E3A8A'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#2563EB' }}>
                      SMS Notification (English)
                    </strong>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, color: '#2563EB', background: '#DBEAFE', padding: '1px 6px', borderRadius: '4px' }}>
                      Sent
                    </span>
                  </div>
                  "{item.recommendedResolution?.citizenDraftEnglish || 'Field crew dispatched for grievance inspection.'}"
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Grievance DNA, Assigned Officer, and Problem Spread GIS Map */}
          <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Grievance DNA Component with Progressive Disclosure */}
              <div>
                <span style={{
                  fontSize: '11.5px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '10px'
                }}>
                  <Sparkles size={14} />
                  Underlying Intelligence
                </span>
                <GrievanceDnaCard dna={item.grievanceDna} compact={false} />
              </div>

              {/* Geographic Intelligence Engine: Problem Spread & Corridor Progression Map */}
              <div>
                <ProblemSpreadMap incident={item} spreadGeo={item.spreadGeo} />
              </div>

              {/* Assigned Public Authority Card */}
              <div style={{
                background: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid #E2E8F0',
                padding: '24px',
                boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B', display: 'block', marginBottom: '14px' }}>
                  Assigned Public Authority
                </span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '16px',
                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                  }}>
                    {item.officerName ? item.officerName.substring(3, 5) : 'TY'}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {item.officerName || 'Dr. K. S. Tyagi'}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '2px' }}>
                      {item.officerDesignation || 'Superintending Engineer'}
                    </span>
                    <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 700 }}>
                      {item.department}
                    </span>
                  </div>
                </div>

                {/* SLA Meter */}
                <div style={{
                  padding: '14px 16px',
                  borderRadius: '14px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  fontSize: '12.5px',
                  color: '#334155',
                  lineHeight: 1.5,
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>Target Resolution SLA:</span>
                    <strong style={{ fontFamily: 'var(--font-mono, monospace)', color: '#0F172A' }}>{item.slaDeadline || '18/9/2026, 06:47 pm'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ color: '#64748B', fontWeight: 600 }}>SLA Window Left:</span>
                    <strong style={{
                      fontFamily: 'var(--font-mono, monospace)',
                      fontWeight: 800,
                      color: item.slaHoursLeft < 6 ? '#DC2626' : '#059669',
                      background: item.slaHoursLeft < 6 ? '#FEF2F2' : '#ECFDF5',
                      padding: '1px 8px',
                      borderRadius: '6px'
                    }}>
                      {item.slaHoursLeft || 18} Hours
                    </strong>
                  </div>

                  {/* Progress bar */}
                  <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{
                      width: '65%',
                      height: '100%',
                      background: item.slaHoursLeft < 6 ? '#EF4444' : 'linear-gradient(90deg, #10B981 0%, #0284C7 100%)',
                      borderRadius: '999px'
                    }} />
                  </div>
                </div>

                {user && user.role !== 'citizen' && (
                  <Link
                    to={`/officer/complaints/${item.id}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      background: '#F1F5F9',
                      color: '#0F172A',
                      fontWeight: 700,
                      fontSize: '12.5px',
                      textDecoration: 'none',
                      border: '1px solid #E2E8F0',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>View in Officer Workspace</span>
                    <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

