import React, { useState } from 'react';
import { CheckCircle2, XCircle, Star, ShieldCheck, Camera, ArrowRight, MessageSquare, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Closed Loop Citizen Verification Card
 * Closes the municipal loop: Government Action -> Citizen Verification -> System Learning
 */
export default function ResolutionVerificationCard({
  grievance,
  onVerifyFixed,
  onReopenDispute,
  onSubmitFeedback
}) {
  const [verifiedStatus, setVerifiedStatus] = useState(null); // 'FIXED' | 'DISPUTED'
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [disputeReason, setDisputeReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFixed = async () => {
    setVerifiedStatus('FIXED');
    if (onVerifyFixed) {
      await onVerifyFixed(grievance.id);
    }
    try {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) return;
    if (onReopenDispute) {
      await onReopenDispute(grievance.id, disputeReason);
    }
    setSubmitted(true);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (onSubmitFeedback) {
      await onSubmitFeedback(grievance.id, rating, comment);
    }
    setSubmitted(true);
  };

  return (
    <div className="card" style={{ padding: '28px', border: '1px solid #10B981', background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FDF9 100%)' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#065F46' }}>
              Citizen Accountability Loop
            </span>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
              Is your problem actually solved?
            </h3>
          </div>
        </div>

        <span className="category-pill" style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }}>
          Action Reported by {grievance.department || 'Field Crew'}
        </span>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
        Municipal field teams reported this grievance as resolved. Under JanSahayak's closed-loop governance, <strong>only citizen confirmation</strong> closes the ticket permanently.
      </p>

      {/* Side-by-Side Evidence Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '24px',
        padding: '16px',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border-subtle)'
      }}>
        {/* Original Citizen Evidence */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Original Citizen Report
          </span>
          <div style={{ minHeight: '80px', borderRadius: 'var(--radius-sm)', background: '#F8F9FA', border: '1px dashed var(--color-border-medium)', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', fontStyle: 'italic', lineHeight: 1.4 }}>
              "{grievance.descriptionRaw?.slice(0, 120)}..."
            </p>
            {grievance.evidence?.hasPhoto && (
              <span style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Camera style={{ width: '12px', height: '12px' }} /> Photo Attached
              </span>
            )}
          </div>
        </div>

        {/* Official Resolution Evidence */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Field Resolution Evidence
          </span>
          <div style={{ minHeight: '80px', borderRadius: 'var(--radius-sm)', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: '#065F46', fontWeight: 500, lineHeight: 1.4 }}>
              {grievance.resolutionNotes || 'Repair squad replaced fractured 100mm valve clamp and verified normalized water pressure.'}
            </p>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Inspected by: {grievance.officerName || 'Duty Executive Engineer'}
            </span>
          </div>
        </div>
      </div>

      {/* Decision State */}
      {!verifiedStatus && !submitted ? (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleFixed}
              className="btn-primary"
              style={{ background: '#10B981', color: '#FFFFFF' }}
            >
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              <span>Yes, It's Fixed</span>
            </button>

            <button
              type="button"
              onClick={() => setVerifiedStatus('DISPUTED')}
              className="btn-secondary"
              style={{ borderColor: '#EF4444', color: '#991B1B' }}
            >
              <XCircle style={{ width: '16px', height: '16px', color: '#EF4444' }} />
              <span>No, The Problem Remains</span>
            </button>
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginTop: '10px' }}>
            If unresolved, your case is automatically escalated to the Superintending Engineer.
          </span>
        </div>
      ) : verifiedStatus === 'FIXED' && !submitted ? (
        /* Citizen 5-Star Rating Form */
        <form onSubmit={handleFeedbackSubmit} style={{ animation: 'fadeIn 200ms ease-out' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', border: '1px solid #A7F3D0', marginBottom: '16px' }}>
            <strong style={{ fontSize: '14px', color: '#065F46', display: 'block', marginBottom: '6px' }}>
              ✓ Thank you for confirming resolution!
            </strong>
            <p style={{ fontSize: '12px', color: '#065F46' }}>
              How satisfied were you with the speed and communication of the response crew?
            </p>

            {/* Stars */}
            <div style={{ display: 'flex', gap: '6px', margin: '12px 0' }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  style={{
                    fontSize: '22px',
                    color: s <= rating ? '#F59E0B' : '#D1D5DB',
                    background: 'transparent',
                    cursor: 'pointer',
                    padding: '2px'
                  }}
                >
                  ★
                </button>
              ))}
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-primary)', alignSelf: 'center', marginLeft: '6px' }}>
                {rating}/5 Stars
              </span>
            </div>

            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional comment for the ward council..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(15,23,42,0.12)',
                fontSize: '12px',
                resize: 'none'
              }}
            />

            <button type="submit" className="btn-primary btn-sm" style={{ marginTop: '10px' }}>
              Submit Citizen Verification
            </button>
          </div>
        </form>
      ) : verifiedStatus === 'DISPUTED' && !submitted ? (
        /* Dispute Form */
        <form onSubmit={handleDisputeSubmit} style={{ animation: 'fadeIn 200ms ease-out' }}>
          <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#FEF2F2', border: '1px solid #FECACA', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', marginBottom: '8px' }}>
              <AlertCircle style={{ width: '18px', height: '18px' }} />
              <strong style={{ fontSize: '13px' }}>Reopen Grievance with Escalation</strong>
            </div>
            <p style={{ fontSize: '12px', color: '#991B1B', marginBottom: '10px' }}>
              Please explain why the issue remains unresolved. This will immediately alert the Department Superintending Engineer.
            </p>
            <textarea
              rows={3}
              required
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="e.g. Water dirty again this morning; or crew excavated but didn't seal pipe..."
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid #F87171',
                fontSize: '13px',
                resize: 'none'
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" className="btn-primary btn-sm" style={{ background: '#DC2626', color: '#FFFFFF' }}>
                Submit Dispute Appeal
              </button>
              <button type="button" onClick={() => setVerifiedStatus(null)} className="btn-secondary btn-sm">
                Cancel
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981' }} />
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Your citizen response has been logged into the municipal audit trail.
          </span>
        </div>
      )}
    </div>
  );
}
