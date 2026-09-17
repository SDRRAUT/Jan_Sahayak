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
  Camera
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import VisualJourneyTimeline from '../components/common/VisualJourneyTimeline';
import ResolutionVerificationCard from '../components/common/ResolutionVerificationCard';
import WhyExplainer from '../components/common/WhyExplainer';
import ResolutionIntelligenceCard from '../components/common/ResolutionIntelligenceCard';

export default function CitizenDetail() {
  const { id } = useParams();
  const { grievances, upvoteGrievance, respondInfo, reopenDispute, submitFeedback, user } = useApp();
  const [citizenReply, setCitizenReply] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [showSimulateResolution, setShowSimulateResolution] = useState(false);

  const item = grievances.find(g => g.id === id) || grievances[0];

  const handleSendClarification = async (requestId) => {
    if (!citizenReply.trim()) return;
    await respondInfo(item.id, requestId, citizenReply);
    setCitizenReply('');
    setActionMessage('Clarification submitted to officer on duty.');
  };

  const priorityReasons = [
    'Hazard severity classified from citizen verbatim text',
    `Location in ${item.location?.ward || 'Ward 14'} under active priority watch`,
    'Response SLA target calculated from municipal guidelines'
  ];

  return (
    <div className="section-spacing" style={{ paddingTop: '24px' }}>
      <div className="container">
        {/* Navigation back bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
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
            <span className="font-mono-numbers" style={{ fontSize: '12px', padding: '4px 12px', borderRadius: 'var(--radius-full)', background: '#F1F5F9', color: 'var(--color-text-secondary)' }}>
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

        {/* Action Alert Banner if present */}
        {actionMessage && (
          <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <CheckCircle2 style={{ width: '16px', height: '16px' }} />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* 6-Stage Visual Journey Stepper (Section 19) */}
        <div style={{ marginBottom: '24px' }}>
          <VisualJourneyTimeline
            status={showSimulateResolution ? 'RESOLVED' : item.status}
            createdAt={item.createdAt}
            officerName={item.officerName}
            department={item.department}
          />
        </div>

        {/* Main Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '32px',
          alignItems: 'start'
        }}>
          {/* Left Column (7 Cols): Grievance Detail & Actions */}
          <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
            
            {/* Closed Loop Resolution Verification (Section 20) */}
            {(item.status === 'RESOLVED' || showSimulateResolution) && (
              <div style={{ marginBottom: '24px' }}>
                <ResolutionVerificationCard
                  grievance={item}
                  onVerifyFixed={() => setActionMessage('✓ Resolution confirmed by citizen. Case closed.')}
                  onReopenDispute={(id, reason) => {
                    reopenDispute(id, reason);
                    setActionMessage('Case disputed and escalated to Superintending Engineer.');
                  }}
                  onSubmitFeedback={(id, rating, comm) => {
                    submitFeedback(id, rating, comm);
                    setActionMessage('Thank you! Your 5-star rating has been registered in the municipal audit register.');
                  }}
                />
              </div>
            )}

            {/* Main Grievance Information Card */}
            <div className="card" style={{ padding: '32px', marginBottom: '24px' }}>
              {/* Header Tags & Priority */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <span className="category-pill">{item.department}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 700,
                    background: item.status === 'RESOLVED' ? '#ECFDF5' : (item.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB'),
                    color: item.status === 'RESOLVED' ? '#065F46' : (item.urgency === 'CRITICAL' ? '#991B1B' : '#92400E')
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
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
                  Logged: {item.createdAt}
                </span>
              </div>

              {/* Title */}
              <h1 style={{ fontSize: '24px', lineHeight: 1.3, marginBottom: '16px', color: 'var(--color-text-primary)' }}>
                {item.title}
              </h1>

              {/* Raw Citizen Submission */}
              <div style={{
                padding: '16px',
                borderRadius: 'var(--radius-md)',
                background: '#F8F9FA',
                border: '1px solid var(--color-border-subtle)',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Citizen Report ({item.languageDetected}):
                </span>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
                  "{item.descriptionRaw}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '12px', color: 'var(--color-text-secondary)', flexWrap: 'wrap' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                    {item.location.area}, {item.location.ward}
                  </span>
                  <span>PIN: {item.location.pincode}</span>
                </div>
              </div>

              {/* Simulation Helper Button if not resolved */}
              {item.status !== 'RESOLVED' && (
                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>
                    Test resolution verification flow:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSimulateResolution(!showSimulateResolution)}
                    style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)' }}
                  >
                    {showSimulateResolution ? 'Reset to Active View' : 'Simulate Field Repair Verification →'}
                  </button>
                </div>
              )}
            </div>

            {/* AI Resolution Intelligence Card (Section 24) */}
            <div style={{ marginBottom: '24px' }}>
              <ResolutionIntelligenceCard
                title="RESOLUTION INTELLIGENCE"
                recommendedAction={item.recommendedResolution?.recommendedAction || "Inspect drainage infrastructure before initiating road resurfacing."}
                standardOperatingProcedure={item.recommendedResolution?.standardOperatingProcedure || "Municipal Standard Operating Procedure Sec-4B"}
                estimatedDuration="6 Hours"
                whyPoints={[
                  `${item.clusterCount || 12} similar complaints recorded in ${item.location?.ward || 'this ward'}`,
                  "Nearby locations experiencing secondary overflow",
                  "Previous related municipal repairs logged in knowledge base",
                  "Relevant engineering standard operating procedure verified",
                  "Location clustering pattern identified across adjacent corridors"
                ]}
                supportingEvidence={[
                  { label: `${item.clusterCount || 12} Similar Cases`, tag: item.location?.ward || 'Ward Area' },
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
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                background: '#FFFBEB',
                border: '1px solid #FDE68A',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#B45309' }}>
                  <HelpCircle style={{ width: '18px', height: '18px' }} />
                  <strong style={{ fontSize: '15px' }}>Clarification Requested by Officer</strong>
                </div>

                {item.informationRequests.map((req, i) => (
                  <div key={req.id || i} style={{ marginBottom: '14px' }}>
                    <p style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5, marginBottom: '8px' }}>
                      <strong>{req.askedBy} ({req.officerDesignation}): </strong>
                      "{req.question}"
                    </p>

                    {req.response ? (
                      <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #FCD34D', fontSize: '13px', color: '#92400E' }}>
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
                            height: '40px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid #FCD34D',
                            padding: '0 12px',
                            fontSize: '13px',
                            background: '#FFFFFF'
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSendClarification(req.id)}
                          className="btn-primary btn-sm"
                          style={{ height: '40px', background: '#B45309' }}
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
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <div className="icon-squircle" style={{ width: '32px', height: '32px' }}>
                  <MessageSquare style={{ width: '16px', height: '16px' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>Official Citizen Updates</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Plain-language dispatches sent to {item.citizenPhone}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: '#166534'
                }}>
                  <strong style={{ display: 'block', fontSize: '11px', color: '#15803D', marginBottom: '2px' }}>
                    WhatsApp Broadcast (Hindi)
                  </strong>
                  "{item.recommendedResolution?.citizenDraftHindi || 'आपकी शिकायत पर कार्यवाही शुरू कर दी गई है।'}"
                </div>

                <div style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8F9FA',
                  border: '1px solid var(--color-border-subtle)',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  color: 'var(--color-text-secondary)'
                }}>
                  <strong style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
                    SMS Notification (English)
                  </strong>
                  "{item.recommendedResolution?.citizenDraftEnglish || 'Field crew dispatched for grievance inspection.'}"
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (5 Cols): Grievance DNA & Assigned Officer */}
          <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Grievance DNA Component with Progressive Disclosure */}
              <div>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)', display: 'block', marginBottom: '10px' }}>
                  Underlying Intelligence
                </span>
                <GrievanceDnaCard dna={item.grievanceDna} compact={false} />
              </div>

              {/* Assigned Public Authority Card */}
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
                    <h3 style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}>{item.officerName}</h3>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block' }}>{item.officerDesignation}</span>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>{item.department}</span>
                  </div>
                </div>

                <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Target Resolution SLA:</span>
                    <strong className="font-mono-numbers">{item.slaDeadline}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>SLA Window Left:</span>
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
                  View in Officer Workspace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
