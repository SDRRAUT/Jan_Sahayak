import React, { useState, useRef } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Camera, Star, AlertCircle, Upload, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

/**
 * Closed Loop Citizen Verification Card
 * Closes the municipal loop: Government Action -> Citizen Verification -> System Learning
 * Offers 3 distinct Citizen verification states:
 * 1. 😊 Yes, fixed
 * 2. 😐 Partially fixed
 * 3. 😟 Still a problem
 */
export default function ResolutionVerificationCard({
  grievance,
  onVerifyFixed,
  onReopenDispute,
  onSubmitFeedback
}) {
  const [selectedChoice, setSelectedChoice] = useState(null); // 'FIXED' | 'PARTIAL' | 'UNRESOLVED'
  const [comment, setComment] = useState('');
  const [evidencePhoto, setEvidencePhoto] = useState(null);
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  // If this grievance was already verified, display the historical verification record
  if (grievance?.citizenVerification || grievance?.status === 'RESOLVED_CONFIRMED') {
    const record = grievance.citizenVerification || {};
    return (
      <div className="card" style={{ padding: '24px', border: '1px solid #10B981', background: '#F0FDF4' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <CheckCircle2 style={{ width: '20px', height: '20px', color: '#059669' }} />
          <div>
            <strong style={{ fontSize: '15px', color: '#065F46', display: 'block' }}>
              Citizen Resolution Confirmed & Logged to Civic Memory
            </strong>
            <span style={{ fontSize: '12px', color: '#047857' }}>
              Verified: {record.verifiedAt ? new Date(record.verifiedAt).toLocaleString() : 'Recently'}
            </span>
          </div>
        </div>
        <p style={{ fontSize: '13px', color: '#065F46', lineHeight: 1.5, marginLeft: '30px' }}>
          "{record.feedbackText || 'Problem resolved on ground to citizen satisfaction.'}"
        </p>
      </div>
    );
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setEvidencePhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (!selectedChoice) return;
    setIsSubmitting(true);

    const photos = evidencePhoto ? [evidencePhoto] : [];

    try {
      if (selectedChoice === 'FIXED') {
        if (onVerifyFixed) {
          await onVerifyFixed(grievance.id, comment || 'Yes, fully fixed', photos);
        }
        if (onSubmitFeedback) {
          await onSubmitFeedback(grievance.id, rating, comment);
        }
        try {
          confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        } catch (e) {}
      } else if (selectedChoice === 'PARTIAL') {
        if (onReopenDispute) {
          await onReopenDispute(grievance.id, `[Partially Fixed] ${comment || 'Issue partially resolved but requires follow-up inspection.'}`, photos);
        }
      } else if (selectedChoice === 'UNRESOLVED') {
        if (onReopenDispute) {
          await onReopenDispute(grievance.id, `[Still a Problem] ${comment || 'Work reported as completed, but problem remains on ground.'}`, photos);
        }
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Verification submit error:', err);
    } finally {
      setIsSubmitting(false);
    }
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
              {grievance.resolutionNotes || 'Repair squad completed field inspection and intervention.'}
            </p>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
              Inspected by: {grievance.officerName || 'Duty Executive Engineer'}
            </span>
          </div>
        </div>
      </div>

      {submitted ? (
        <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F0FDF4', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 style={{ width: '20px', height: '20px', color: '#16A34A' }} />
          <div>
            <strong style={{ fontSize: '14px', color: '#166534', display: 'block' }}>
              Your verification has been recorded in the database.
            </strong>
            <span style={{ fontSize: '12px', color: '#15803D' }}>
              Audit entry created and sent to Civic Officer & Civic Memory.
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitVerification}>
          {/* 3 Real Citizen Choices */}
          <div style={{ marginBottom: '18px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '10px' }}>
              Select ground reality:
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setSelectedChoice('FIXED')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedChoice === 'FIXED' ? '2px solid #10B981' : '1px solid var(--color-border-medium)',
                  background: selectedChoice === 'FIXED' ? '#ECFDF5' : '#FFFFFF',
                  color: selectedChoice === 'FIXED' ? '#065F46' : 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  transition: 'all 150ms ease'
                }}
              >
                <span style={{ fontSize: '18px' }}>😊</span>
                <span>Yes, fixed</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChoice('PARTIAL')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedChoice === 'PARTIAL' ? '2px solid #F59E0B' : '1px solid var(--color-border-medium)',
                  background: selectedChoice === 'PARTIAL' ? '#FFFBEB' : '#FFFFFF',
                  color: selectedChoice === 'PARTIAL' ? '#92400E' : 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  transition: 'all 150ms ease'
                }}
              >
                <span style={{ fontSize: '18px' }}>😐</span>
                <span>Partially fixed</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedChoice('UNRESOLVED')}
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: selectedChoice === 'UNRESOLVED' ? '2px solid #EF4444' : '1px solid var(--color-border-medium)',
                  background: selectedChoice === 'UNRESOLVED' ? '#FEF2F2' : '#FFFFFF',
                  color: selectedChoice === 'UNRESOLVED' ? '#991B1B' : 'var(--color-text-primary)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  justifyContent: 'center',
                  transition: 'all 150ms ease'
                }}
              >
                <span style={{ fontSize: '18px' }}>😟</span>
                <span>Still a problem</span>
              </button>
            </div>
          </div>

          {/* If YES: Star Rating */}
          {selectedChoice === 'FIXED' && (
            <div style={{ marginBottom: '16px', padding: '14px', borderRadius: 'var(--radius-md)', background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534', display: 'block', marginBottom: '8px' }}>
                Rate Response Quality & Speed:
              </span>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
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
                      padding: '2px',
                      border: 'none'
                    }}
                  >
                    ★
                  </button>
                ))}
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#166534', alignSelf: 'center', marginLeft: '8px' }}>
                  {rating}/5 Stars
                </span>
              </div>
            </div>
          )}

          {/* Feedback or Dispute Explanation Box */}
          {selectedChoice && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', display: 'block', marginBottom: '6px' }}>
                {selectedChoice === 'FIXED' ? 'Add optional verification remarks:' : 'Please explain what remains unfixed (Required for escalation):'}
              </label>
              <textarea
                rows={3}
                required={selectedChoice !== 'FIXED'}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={selectedChoice === 'FIXED' ? 'Water pressure is clean and normal now, thank you.' : 'e.g. Debris was cleared but asphalt hole still open; or water is still discolored...'}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 'var(--radius-sm)',
                  border: selectedChoice === 'UNRESOLVED' ? '1px solid #F87171' : '1px solid var(--color-border-medium)',
                  fontSize: '13px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          )}

          {/* Optional Ground Photo Evidence */}
          {selectedChoice && (
            <div style={{ marginBottom: '20px' }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    height: '36px',
                    padding: '0 12px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-medium)',
                    background: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: 'var(--color-text-secondary)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer'
                  }}
                >
                  <Camera style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                  <span>{evidencePhoto ? 'Change Verification Photo' : 'Attach Verification Photo'}</span>
                </button>
                {evidencePhoto && (
                  <span style={{ fontSize: '11.5px', color: '#16A34A', fontWeight: 600 }}>
                    ✓ 1 Ground Photo Attached
                  </span>
                )}
              </div>
            </div>
          )}

          {selectedChoice && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
              style={{
                background: selectedChoice === 'UNRESOLVED' ? '#DC2626' : (selectedChoice === 'PARTIAL' ? '#D97706' : '#10B981'),
                color: '#FFFFFF'
              }}
            >
              {isSubmitting ? 'Recording Verification...' : (
                selectedChoice === 'FIXED' ? 'Confirm Resolution & Close Ticket' : 'Submit Reopen & Escalation Notice'
              )}
            </button>
          )}
        </form>
      )}
    </div>
  );
}

