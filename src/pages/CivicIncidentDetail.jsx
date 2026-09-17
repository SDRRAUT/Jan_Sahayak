import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Sparkles, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Check, 
  X, 
  Layers, 
  Network, 
  TrendingUp, 
  Search, 
  FileText,
  FileCheck2,
  PlayCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProblemStageIndicator from '../components/intelligence/ProblemStageIndicator';
import ProblemSpreadMap from '../components/intelligence/ProblemSpreadMap';
import CrossDepartmentMatrix from '../components/intelligence/CrossDepartmentMatrix';
import CivicMemoryCard from '../components/intelligence/CivicMemoryCard';
import ActionSimulationCard from '../components/intelligence/ActionSimulationCard';
import WhyExplainer from '../components/common/WhyExplainer';

export default function CivicIncidentDetail() {
  const { id } = useParams();
  const { civicIncidents = [], recordIncidentDecision, verifyIncidentResolution, user } = useApp();
  
  const incident = civicIncidents.find(inc => inc.id === id) || civicIncidents[0];

  // Human decision state
  const [selectedDecision, setSelectedDecision] = useState('ACCEPT_RECOMMENDATION');
  const [actionChoice, setActionChoice] = useState(incident?.simulations?.[1]?.title || 'Option B: Full 24-Meter Ductile Iron Segment Replacement');
  const [officerNote, setOfficerNote] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState(false);

  // Closed-loop verification state
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationSubmitting, setVerificationSubmitting] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  if (!incident) {
    return (
      <div className="container section-spacing">
        <p>Civic Incident not found.</p>
        <Link to="/intelligence" className="btn-primary" style={{ marginTop: '16px' }}>Back to Dashboard</Link>
      </div>
    );
  }

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    recordIncidentDecision(incident.id, {
      decision: selectedDecision,
      actionSelected: actionChoice,
      notes: officerNote || 'Verified against ground signals and telemetry records.'
    });
    setDecisionSuccess(true);
    setTimeout(() => setDecisionSuccess(false), 4000);
  };

  const handleSelectSimAction = (sim) => {
    setActionChoice(sim.title);
    setSelectedDecision('ACCEPT_RECOMMENDATION');
    const el = document.getElementById('human-decision-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleVerify = async (isConfirmed) => {
    setVerificationSubmitting(true);
    await verifyIncidentResolution(incident.id, isConfirmed, verificationNotes);
    setVerificationSubmitting(false);
    setVerificationMessage(
      isConfirmed
        ? '✓ Ground resolution confirmed! Incident officially verified and closed with citizen consensus.'
        : '⚠ Problem persistence logged! Incident automatically reopened for re-intervention.'
    );
    setTimeout(() => setVerificationMessage(''), 6000);
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '28px', minHeight: '90vh' }}>
      <div className="container">
        {/* Back Link & Breadcrumb */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link
            to="/intelligence"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-primary)'
            }}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            <span>Back to Civic Intelligence Dashboard</span>
          </Link>

          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
            INCIDENT ID: {incident.id}
          </span>
        </div>

        {/* Section 1: Top Incident Header & Overview */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-subtle)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span className={`stage-pill ${incident.stage?.toLowerCase()}`}>
                  ● {incident.stage} STAGE
                </span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: incident.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                  color: incident.severity === 'CRITICAL' ? '#DC2626' : '#D97706'
                }}>
                  Severity: {incident.severity}
                </span>
                <span style={{ fontSize: '12px', color: '#DC2626', fontWeight: 600 }}>
                  {incident.stageVelocity}
                </span>
              </div>

              <h1 style={{ fontSize: '28px', color: 'var(--color-text-primary)', letterSpacing: '-0.025em', marginBottom: '6px' }}>
                {incident.title}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '14px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                  {incident.affectedArea}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                  {incident.affectedPopulation}
                </span>
                <span>•</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock style={{ width: '14px', height: '14px', color: 'var(--color-text-muted)' }} />
                  First Detected: {(incident.firstDetectedAt && !incident.firstDetectedAt.includes('Invalid')) ? incident.firstDetectedAt : 'Recently observed'}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>
                Total Connected Signals
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-primary)' }}>
                {incident.signalCount || incident.complaintCount || 1}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>
                {incident.formalComplaintsCount || incident.complaintCount || 1} Formal + {incident.citizenObservationsCount || 0} Observations
              </span>
            </div>
          </div>

          <p style={{ fontSize: '14.5px', color: 'var(--color-text-secondary)', lineHeight: 1.6, borderTop: '1px solid var(--color-divider)', paddingTop: '16px' }}>
            {incident.summary}
          </p>
        </div>

        {/* Section 2: Problem Escalation Stage Indicator */}
        <div style={{ marginBottom: '28px' }}>
          <ProblemStageIndicator
            stage={incident.stage}
            velocity={incident.stageVelocity}
            signalCount={incident.signalCount}
            reason="Velocity exceeded 200% over 5 days; joint leak softening road subsoil and contaminating potable supply line."
          />
        </div>

        {/* Section 3: Complaint DNA Specification */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          padding: '20px',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles style={{ width: '16px', height: '16px', color: '#4F46E5' }} />
              <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
                Complaint DNA & Semantic Fingerprint
              </h3>
            </div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
              DNA-CORRIDOR-14C
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '16px' }}>
            <div className="dna-chip" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <strong>Issue Type</strong>
              <span>{incident.complaintDna?.issueType}</span>
            </div>
            <div className="dna-chip" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <strong>Sub-Issue</strong>
              <span>{incident.complaintDna?.subIssue}</span>
            </div>
            <div className="dna-chip" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <strong>Affected Asset</strong>
              <span>{incident.complaintDna?.asset}</span>
            </div>
            <div className="dna-chip" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <strong>Service Domain</strong>
              <span>{incident.complaintDna?.service}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                Observed Symptoms:
              </span>
              <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {incident.complaintDna?.symptoms?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                Key Entities & Landmarks:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {incident.complaintDna?.entities?.map((e, i) => (
                  <span key={i} style={{ fontSize: '11.5px', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)', padding: '3px 8px', borderRadius: 'var(--radius-sm)' }}>
                    📍 {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 4 & 5: Problem Timeline & Problem Spread Map */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {/* Visual Problem Timeline */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '20px',
            boxShadow: 'var(--shadow-card)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
                Problem Timeline
              </h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                From 1st Signal to Incident
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative' }}>
              {incident.timeline?.map((step, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: idx === 0 ? '#F0FDF4' : '#F8FAFC',
                    border: '1px solid var(--color-border-subtle)',
                    borderLeft: `4px solid ${idx === incident.timeline.length - 1 ? '#DC2626' : 'var(--color-primary)'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      {step.stage}
                    </strong>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                      {step.date}, {step.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                    {step.desc}
                  </p>
                  <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px', display: 'block' }}>
                    Source: <strong>{step.source}</strong> (Cumulative: {step.count} signals)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Problem Spread Map */}
          <div>
            <ProblemSpreadMap incident={incident} spreadGeo={incident.spreadGeo} />
          </div>
        </div>

        {/* Section 6: Root Cause Hypotheses (Evidence-Backed) */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-border-subtle)',
          padding: '20px',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                Diagnostic Hypotheses (Evidence-Linked)
              </span>
              <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
                Root Cause Hypotheses
              </h3>
            </div>
            <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
              ⚠ Requires Field Verification
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {incident.rootCauseHypotheses?.map((hyp) => (
              <div
                key={hyp.id}
                style={{
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8FAFC',
                  border: '1px solid var(--color-border-subtle)',
                  borderLeft: '4px solid #4F46E5'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong style={{ fontSize: '14.5px', color: 'var(--color-text-primary)' }}>
                      {hyp.title}
                    </strong>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                      ({hyp.id})
                    </span>
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    background: hyp.confidence === 'HIGH' ? '#ECFDF5' : '#FFFBEB',
                    color: hyp.confidence === 'HIGH' ? '#065F46' : '#92400E'
                  }}>
                    ● Confidence: {hyp.confidence} ({hyp.confidenceScore}%)
                  </span>
                </div>

                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  Supporting Evidence Signals:
                </span>
                <ul style={{ paddingLeft: '18px', fontSize: '12.5px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                  {hyp.evidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>

                <div style={{
                  paddingTop: '8px',
                  borderTop: '1px solid var(--color-divider)',
                  fontSize: '11.5px',
                  color: '#4338CA',
                  fontWeight: 600
                }}>
                  Recommended Verification: {hyp.recommendedVerification}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 7 & 8: Cross-Department Impact & Civic Memory */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          <CrossDepartmentMatrix crossDeptData={incident.crossDepartmentImpact} />
          <CivicMemoryCard memories={incident.civicMemory} />
        </div>

        {/* Section 9, 10 & 11: Action Simulation Engine */}
        <div style={{ marginBottom: '28px' }}>
          <ActionSimulationCard
            simulations={incident.simulations}
            onSelectAction={handleSelectSimAction}
            incidentId={incident.id}
          />
        </div>

        {/* Section 11B: Closed-Loop Citizen Verification & Audit */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-border-subtle)',
          padding: '24px 28px',
          boxShadow: 'var(--shadow-card)',
          marginBottom: '28px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
                  Section 20 Protocol
                </span>
                <h3 style={{ fontSize: '20px', color: 'var(--color-text-primary)' }}>
                  Closed-Loop Citizen Verification & Physical Audit
                </h3>
              </div>
            </div>

            <span style={{
              fontSize: '12px',
              fontWeight: 700,
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              background: incident.verificationStatus === 'VERIFIED' ? '#ECFDF5' : incident.verificationStatus === 'REOPENED' ? '#FEF2F2' : '#FFFBEB',
              color: incident.verificationStatus === 'VERIFIED' ? '#065F46' : incident.verificationStatus === 'REOPENED' ? '#DC2626' : '#D97706',
              border: '1px solid currentColor'
            }}>
              ● Status: {incident.verificationStatus || 'PENDING_FIELD_WORK'} ({incident.status})
            </span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
            A civic incident cannot be marked officially resolved by administrative closure alone. Municipal resolution requires ground audit confirmation and citizen verification.
          </p>

          <div style={{
            background: '#F8FAFC',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '6px', color: 'var(--color-text-primary)' }}>
              Citizen / Field Inspector Observation Notes:
            </label>
            <textarea
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              placeholder="e.g. Ground culvert inspected — stormwater drained completely, road traffic restored without waterlogging."
              rows={2}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-medium)',
                fontSize: '13px',
                marginBottom: '12px'
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
              <button
                type="button"
                disabled={verificationSubmitting}
                onClick={() => handleVerify(false)}
                style={{
                  height: '38px',
                  padding: '0 18px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  fontWeight: 600,
                  background: '#FFFFFF',
                  color: '#DC2626',
                  border: '1.5px solid #F87171',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <X style={{ width: '14px', height: '14px' }} />
                <span>Issue Persists (Reopen Incident)</span>
              </button>

              <button
                type="button"
                disabled={verificationSubmitting}
                onClick={() => handleVerify(true)}
                className="btn-primary"
                style={{
                  height: '38px',
                  padding: '0 20px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                <Check style={{ width: '15px', height: '15px' }} />
                <span>Verify Ground Resolution</span>
              </button>
            </div>
          </div>

          {verificationMessage && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: verificationMessage.includes('verified') ? '#ECFDF5' : '#FEF2F2',
              color: verificationMessage.includes('verified') ? '#065F46' : '#991B1B',
              fontSize: '13px',
              fontWeight: 600
            }}>
              {verificationMessage}
            </div>
          )}

          {/* Verification Audit Trail */}
          {incident.verificationAudit && incident.verificationAudit.length > 0 && (
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-divider)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Audit Register of Verification Submissions:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {incident.verificationAudit.map((va, i) => (
                  <div key={i} style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)', fontSize: '12px' }}>
                    <strong>{va.result === 'VERIFIED' ? '✓ Verified by Citizen' : '⚠ Issue Flagged by Citizen'}: {va.verifiedBy}</strong> — <span style={{ color: 'var(--color-text-muted)' }}>{va.verifiedAt}</span>
                    {va.notes && <div style={{ color: 'var(--color-text-secondary)', marginTop: '2px' }}>"{va.notes}"</div>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 12: Human Decision Recording Workspace */}
        <div
          id="human-decision-section"
          style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            border: '2px solid var(--color-primary)',
            padding: '24px 28px',
            boxShadow: 'var(--shadow-card)',
            marginBottom: '40px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#F0FDF4', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileCheck2 style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Authoritative Protocol Execution
                </span>
                <h3 style={{ fontSize: '20px', color: 'var(--color-text-primary)' }}>
                  Human Decision Recording & Action Authorization
                </h3>
              </div>
            </div>

            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Logged Officer: <strong>{user?.name || 'Er. Sanjay Sharma (AEE)'}</strong>
            </span>
          </div>

          <form onSubmit={handleDecisionSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '16px' }}>
              {[
                { key: 'ACCEPT_RECOMMENDATION', label: '✓ Accept Recommendation', desc: 'Authorize proposed simulation scenario' },
                { key: 'MODIFY_RECOMMENDATION', label: '✎ Modify Scenario', desc: 'Adjust equipment or scope parameters' },
                { key: 'REQUEST_VERIFICATION', label: '🔍 Field Diagnostic First', desc: 'Deploy acoustic sensor before excavation' },
                { key: 'REJECT_RECOMMENDATION', label: '✕ Reject / De-escalate', desc: 'False positive or separate cause' }
              ].map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedDecision(opt.key)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: selectedDecision === opt.key ? '#F0FDF4' : '#F8FAFC',
                    border: selectedDecision === opt.key ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                    textAlign: 'left'
                  }}
                >
                  <strong style={{ fontSize: '13px', color: selectedDecision === opt.key ? 'var(--color-primary)' : 'var(--color-text-primary)', display: 'block' }}>
                    {opt.label}
                  </strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {opt.desc}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Action Details */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                Target Operational Action:
              </label>
              <input
                type="text"
                value={actionChoice}
                onChange={(e) => setActionChoice(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-medium)',
                  fontSize: '13px',
                  fontWeight: 600
                }}
                required
              />
            </div>

            {/* Officer Field Notes */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, display: 'block', marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                Authoritative Field Verification Notes & Audit Rationale:
              </label>
              <textarea
                value={officerNote}
                onChange={(e) => setOfficerNote(e.target.value)}
                placeholder="e.g. Ground acoustic correlation confirmed ductile fracture at joint 14. Authorizing emergency replacement squad with PWD coordination."
                rows={2}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border-medium)',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              {decisionSuccess ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10B981', fontWeight: 700, fontSize: '13px' }}>
                  <CheckCircle2 style={{ width: '18px', height: '18px' }} />
                  <span>Human decision successfully recorded and committed to the municipal audit trail!</span>
                </div>
              ) : (
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
                  All authorizations are cryptographically hashed and logged to the central audit register.
                </span>
              )}

              <button
                type="submit"
                className="btn-primary"
                style={{ height: '42px', padding: '0 24px', borderRadius: 'var(--radius-full)', fontSize: '13.5px' }}
              >
                <span>Commit & Authorize Decision</span>
                <Check style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          </form>

          {/* Past Decisions Log */}
          {incident.humanDecisions && incident.humanDecisions.length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--color-divider)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Audit Log of Prior Officer Decisions:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {incident.humanDecisions.map((dec, i) => (
                  <div key={dec.id || i} style={{ padding: '10px 12px', borderRadius: 'var(--radius-sm)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <strong>{dec.decision} by {dec.officer}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{dec.timestamp}</span>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', margin: '2px 0' }}>
                      Action: <em>{dec.actionSelected}</em>
                    </p>
                    {dec.notes && (
                      <span style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                        Note: {dec.notes}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
