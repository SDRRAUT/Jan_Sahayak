import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Building2, 
  Shield, 
  Car, 
  FileCheck, 
  MapPin, 
  AlertCircle, 
  Copy, 
  Check, 
  Loader2,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { escalateSurveillanceIncident as defaultEscalateService } from '../../services/surveillanceService';

const AUTHORITIES = [
  {
    id: 'police',
    label: '👮 Police Station (Wagholi Traffic & Law Enforcement)',
    subtitle: 'Immediate traffic enforcement & on-ground vehicle interception unit',
    department: 'Pune City Police — Traffic Division'
  },
  {
    id: 'admin',
    label: '🏛️ Government Administrator (Municipal Ward Executive)',
    subtitle: 'Municipal Ward 29 executive office for official notice & statutory penalty',
    department: 'PMC Ward 29 Administration'
  },
  {
    id: 'traffic',
    label: '🚦 Traffic Department (PMC Traffic Cell)',
    subtitle: 'Smart City central control room & corridor timing violation logs',
    department: 'PMC Traffic & Transport Planning'
  }
];

export default function AuthorityEscalationModal({
  isOpen = true,
  onClose,
  incident,
  escalateSurveillanceIncident = defaultEscalateService,
  onSuccess
}) {
  const [selectedAuthority, setSelectedAuthority] = useState(
    '👮 Police Station (Wagholi Traffic & Law Enforcement)'
  );
  const [dispatchNotes, setDispatchNotes] = useState(
    'AI surveillance detected unauthorized heavy commercial vehicle breach during peak hours. Requesting on-ground patrol verification.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [copiedRef, setCopiedRef] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Fallbacks per specification
  const incidentId = incident?.id || 'INC-2026-PUNE-0042';
  const issue = incident?.violation || 'Restricted Area Entry';
  const evidenceCount = incident?.evidenceFiles?.length || 2;
  const location = incident?.location || 'Wagholi Restricted Zone';

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      // Call the escalation handler
      const result = await escalateSurveillanceIncident(
        incidentId,
        selectedAuthority,
        dispatchNotes
      );

      setSubmissionResult(result);
      setIsSubmitted(true);

      // Trigger celebratory confetti for successful governance escalation
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.6 }
        });
      } catch (_) {}
    } catch (err) {
      console.error('[AuthorityEscalationModal] Escalation error:', err);
      setErrorMsg(err.message || 'Failed to dispatch report. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitted && onSuccess) {
      onSuccess(submissionResult);
    }
    if (onClose) {
      onClose();
    }
  };

  const handleCopyRef = (ref) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(ref);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="escalation-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '640px',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '92vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ─── Header ──────────────────────────────────────────────────────── */}
        <div 
          style={{
            background: '#0F172A',
            color: '#FFFFFF',
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #1E293B'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div 
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(37, 99, 235, 0.25)',
                border: '1px solid rgba(59, 130, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Shield style={{ width: '18px', height: '18px', color: '#60A5FA' }} />
            </div>
            <div>
              <h2 
                id="escalation-modal-title" 
                style={{
                  fontSize: '17px',
                  fontWeight: 800,
                  color: '#FFFFFF',
                  margin: 0
                }}
              >
                Forward Incident Report to Authority
              </h2>
              <p style={{ fontSize: '12px', color: '#94A3B8', margin: '3px 0 0 0' }}>
                Official Municipal Escalation & Law Enforcement Dispatch
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1E293B',
              border: 'none',
              color: '#94A3B8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* ─── Modal Body ─────────────────────────────────────────────────── */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Report Preview Summary Card */}
              <div 
                style={{
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '16px'
                }}
              >
                <span 
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#64748B',
                    display: 'block',
                    marginBottom: '10px'
                  }}
                >
                  Report Preview Summary
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '12px' }}>
                  <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '10px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>Incident</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>{incidentId}</span>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '10px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>Issue</span>
                    <span style={{ fontWeight: 700, color: '#B91C1C', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>{issue}</span>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '10px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>Evidence</span>
                    <span style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                      <FileCheck style={{ width: '13px', height: '13px', color: '#059669', flexShrink: 0 }} />
                      {evidenceCount} Verified Files
                    </span>
                  </div>
                  <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '10px', borderRadius: '10px' }}>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '11px', fontWeight: 600 }}>Location</span>
                    <span style={{ fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={location}>
                      <MapPin style={{ width: '13px', height: '13px', color: '#2563EB', flexShrink: 0 }} />
                      {location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authority Selection Radio Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#334155', display: 'block' }}>
                  Select Authority Destination
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {AUTHORITIES.map((auth) => {
                    const isSelected = selectedAuthority === auth.label;
                    return (
                      <label
                        key={auth.id}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '14px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #2563EB' : '1px solid #CBD5E1',
                          background: isSelected ? '#EFF6FF' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.12)' : 'none'
                        }}
                      >
                        <input
                          type="radio"
                          name="authority"
                          value={auth.label}
                          checked={isSelected}
                          onChange={() => setSelectedAuthority(auth.label)}
                          style={{ marginTop: '3px', accentColor: '#2563EB', cursor: 'pointer' }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 700, color: isSelected ? '#1E40AF' : '#0F172A' }}>
                            {auth.label}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            {auth.subtitle}
                          </div>
                          <div style={{ fontSize: '11px', color: '#2563EB', fontWeight: 600, marginTop: '2px' }}>
                            {auth.department}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Officer Dispatch Notes / Remarks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label htmlFor="dispatch-notes" style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#334155' }}>
                    Officer Dispatch Notes / Remarks
                  </label>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>Attached to official civic dispatch</span>
                </div>
                <textarea
                  id="dispatch-notes"
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="Enter dispatch notes, vehicle description, or specific inspection instructions..."
                  style={{
                    width: '100%',
                    fontSize: '13px',
                    padding: '12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {errorMsg && (
                <div style={{ padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: '10px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0, color: '#DC2626' }} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#475569',
                    background: '#F1F5F9',
                    border: '1px solid #CBD5E1',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: isSubmitting ? '#93C5FD' : '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                      <span>Sending Official Report...</span>
                    </>
                  ) : (
                    <>
                      <Send style={{ width: '15px', height: '15px' }} />
                      <span>Send Official Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success Confirmation State */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div 
                style={{
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div 
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#D1FAE5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <CheckCircle2 style={{ width: '24px', height: '24px', color: '#059669' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#064E3B', margin: 0 }}>
                      ✅ Report successfully forwarded to {selectedAuthority}
                    </h3>
                    <p style={{ fontSize: '12px', color: '#047857', margin: '3px 0 0 0' }}>
                      The official enforcement package has been logged in the Municipal Central Dispatch registry.
                    </p>
                  </div>
                </div>

                <div 
                  style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #A7F3D0',
                    borderRadius: '12px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    fontSize: '12.5px',
                    color: '#0F172A'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #D1FAE5' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Official Reference:</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>
                        {submissionResult?.officialReference || 'REF-2026-0042'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyRef(submissionResult?.officialReference || 'REF-2026-0042')}
                        style={{
                          background: '#F1F5F9',
                          border: '1px solid #CBD5E1',
                          borderRadius: '4px',
                          padding: '3px 6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#475569'
                        }}
                        title="Copy Reference"
                      >
                        {copiedRef ? <Check style={{ width: '13px', height: '13px', color: '#059669' }} /> : <Copy style={{ width: '13px', height: '13px' }} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Status updated to:</span>
                    <span 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '3px 9px',
                        borderRadius: '999px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        background: '#DBEAFE',
                        color: '#1E40AF',
                        border: '1px solid #93C5FD'
                      }}
                    >
                      {submissionResult?.status || 'Forwarded to Authority'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Target Authority:</span>
                    <span style={{ fontWeight: 600, color: '#0F172A' }}>{selectedAuthority}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, color: '#475569' }}>Time Dispatched:</span>
                    <span style={{ fontFamily: 'monospace', color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '12px', height: '12px', color: '#64748B' }} />
                      {submissionResult?.timestamp || 'Today, 14:35 IST'}
                    </span>
                  </div>

                  {dispatchNotes && (
                    <div style={{ paddingTop: '8px', borderTop: '1px solid #D1FAE5', color: '#475569', fontSize: '11.5px', fontStyle: 'italic', background: 'rgba(248, 250, 252, 0.7)', padding: '8px', borderRadius: '6px' }}>
                      &quot;{dispatchNotes}&quot;
                    </div>
                  )}
                </div>
              </div>

              {/* Success Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingTop: '4px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 700,
                    background: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(15, 23, 42, 0.25)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  Close & Return
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
