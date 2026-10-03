import React, { useState } from 'react';
import { 
  Camera, 
  Car, 
  MapPin, 
  Clock, 
  ShieldAlert, 
  Eye, 
  Send, 
  CheckCircle, 
  Zap, 
  ChevronRight, 
  Check, 
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  X
} from 'lucide-react';
import { SURVEILLANCE_STATUSES } from '../../data/surveillanceData';
import EvidencePackageModal from './EvidencePackageModal';
import AuthorityEscalationModal from './AuthorityEscalationModal';

const WORKFLOW_STEPS = SURVEILLANCE_STATUSES || [
  'Detected',
  'Evidence Captured',
  'Report Generated',
  'Forwarded',
  'Under Human Review',
  'Action Taken',
  'Resolved'
];

export default function SurveillanceTicketCard({
  incident,
  onViewEvidence,
  onForward,
  onTakeAction,
  onResolve,
  onStatusChange
}) {
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showEscalationModal, setShowEscalationModal] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(incident?.status || 'Detected');

  // Fallbacks per specification
  const incidentId = incident?.id || 'INC-2026-PUNE-0042';
  const violation = incident?.violation || 'Restricted Area Entry (Unauthorized Heavy Vehicle)';
  const location = incident?.location || 'Wagholi Restricted Zone';
  const camera = incident?.camera || 'CAM-WAG-04';
  const timestamp = incident?.timestamp || 'Today, 14:32';
  const vehicleDetails = incident?.vehicleDetails || 'Heavy Dumper Truck (MH-12-Q-4029)';
  const aiConfidence = incident?.aiConfidence ?? 94;
  const officialReference = incident?.officialReference;
  const authorityRecipient = incident?.authorityRecipient;

  // Find step index in 7-stage workflow
  const currentStepIndex = Math.max(0, WORKFLOW_STEPS.indexOf(currentStatus));

  const handleOpenEvidence = () => {
    if (onViewEvidence) {
      onViewEvidence(incident);
    } else {
      setShowEvidenceModal(true);
    }
  };

  const handleOpenForward = () => {
    if (onForward) {
      onForward(incident);
    } else {
      setShowEscalationModal(true);
    }
  };

  const handleTakeActionClick = () => {
    if (onTakeAction) {
      onTakeAction(incident);
    } else {
      setShowActionDialog(true);
    }
  };

  const handleResolveClick = () => {
    if (onResolve) {
      onResolve(incident);
    } else {
      setShowResolveDialog(true);
    }
  };

  const confirmAction = (actionName) => {
    const nextStatus = 'Action Taken';
    setCurrentStatus(nextStatus);
    setShowActionDialog(false);
    if (onStatusChange) {
      onStatusChange(incidentId, nextStatus, actionName);
    }
  };

  const confirmResolve = () => {
    const nextStatus = 'Resolved';
    setCurrentStatus(nextStatus);
    setShowResolveDialog(false);
    if (onStatusChange) {
      onStatusChange(incidentId, nextStatus, 'Incident verified and closed');
    }
  };

  return (
    <div 
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* ─── Top Header Strip ───────────────────────────────────────────── */}
      <div 
        style={{
          background: '#F8FAFC',
          padding: '12px 18px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span 
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              fontWeight: 800,
              color: '#0F172A',
              background: '#E2E8F0',
              padding: '3px 8px',
              borderRadius: '6px'
            }}
          >
            {incidentId}
          </span>
          <span 
            style={{
              fontSize: '12px',
              color: '#64748B',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Clock style={{ width: '13px', height: '13px', color: '#94A3B8' }} />
            {timestamp}
          </span>
        </div>

        {/* Tags: Camera, Vehicle, Confidence */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Camera Tag */}
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              background: '#EFF6FF',
              color: '#1D4ED8',
              border: '1px solid #BFDBFE'
            }}
          >
            <Camera style={{ width: '12px', height: '12px', color: '#2563EB' }} />
            {camera}
          </span>

          {/* Vehicle Tag */}
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              background: '#F1F5F9',
              color: '#334155',
              border: '1px solid #CBD5E1'
            }}
          >
            <Car style={{ width: '12px', height: '12px', color: '#64748B' }} />
            <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={vehicleDetails}>
              {vehicleDetails}
            </span>
          </span>

          {/* Confidence Pill */}
          <span 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '11.5px',
              fontWeight: 800,
              background: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0'
            }}
          >
            <span 
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px #10B981'
              }} 
            />
            {aiConfidence}% Confidence
          </span>
        </div>
      </div>

      {/* ─── Main Body ──────────────────────────────────────────────────── */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Violation & Location */}
        <div>
          <h3 
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#0F172A',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              margin: '0 0 4px 0'
            }}
          >
            <ShieldAlert style={{ width: '18px', height: '18px', color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
            <span>{violation}</span>
          </h3>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              color: '#64748B',
              paddingLeft: '26px'
            }}
          >
            <MapPin style={{ width: '14px', height: '14px', color: '#94A3B8', flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{location}</span>
          </div>
        </div>

        {/* Status Workflow Progression Stepper */}
        <div 
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>
              Workflow Status Progression
            </span>
            <span 
              style={{
                fontWeight: 600,
                color: '#334155',
                background: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid #CBD5E1'
              }}
            >
              Step {currentStepIndex + 1} of {WORKFLOW_STEPS.length}: <strong style={{ color: '#2563EB' }}>{currentStatus}</strong>
            </span>
          </div>

          {/* Stepper horizontal row */}
          <div style={{ overflowX: 'auto', paddingBottom: '4px', paddingTop: '2px' }}>
            <div style={{ display: 'flex', alignItems: 'center', minWidth: 'max-content', gap: '5px' }}>
              {WORKFLOW_STEPS.map((step, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                let pillBg = '#FFFFFF';
                let pillColor = '#64748B';
                let pillBorder = '#E2E8F0';
                let pillWeight = 500;

                if (isPast) {
                  pillBg = '#ECFDF5';
                  pillColor = '#065F46';
                  pillBorder = '#A7F3D0';
                  pillWeight = 700;
                } else if (isCurrent) {
                  pillBg = '#2563EB';
                  pillColor = '#FFFFFF';
                  pillBorder = '#1D4ED8';
                  pillWeight = 800;
                }

                return (
                  <React.Fragment key={step}>
                    <div 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '10.5px',
                        fontWeight: pillWeight,
                        background: pillBg,
                        color: pillColor,
                        border: `1px solid ${pillBorder}`,
                        transition: 'all 0.15s ease'
                      }}
                      title={`Status: ${step}`}
                    >
                      {isPast ? (
                        <Check style={{ width: '12px', height: '12px', color: '#059669' }} />
                      ) : isCurrent ? (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFFFFF' }} />
                      ) : (
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }} />
                      )}
                      <span>{step}</span>
                    </div>

                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <ChevronRight 
                        style={{
                          width: '12px',
                          height: '12px',
                          flexShrink: 0,
                          color: idx < currentStepIndex ? '#059669' : '#CBD5E1'
                        }} 
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Escalation details if forwarded */}
        {(officialReference || authorityRecipient) && (
          <div 
            style={{
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '12px',
              color: '#1E3A8A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 style={{ width: '15px', height: '15px', color: '#2563EB', flexShrink: 0 }} />
              <span>Escalated to: <strong>{authorityRecipient || 'Police / Municipal Authority'}</strong></span>
            </div>
            {officialReference && (
              <span 
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  background: '#DBEAFE',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#1E40AF'
                }}
              >
                {officialReference}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ─── Action Buttons Footer ───────────────────────────────────────── */}
      <div 
        style={{
          background: '#F8FAFC',
          padding: '12px 18px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* View Evidence */}
          <button
            type="button"
            onClick={handleOpenEvidence}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: '#FFFFFF',
              color: '#1E293B',
              border: '1px solid #CBD5E1',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              transition: 'all 0.15s ease'
            }}
          >
            <Eye style={{ width: '13px', height: '13px', color: '#475569' }} />
            <span>View Evidence</span>
          </button>

          {/* Forward */}
          <button
            type="button"
            onClick={handleOpenForward}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: '#EFF6FF',
              color: '#1D4ED8',
              border: '1px solid #BFDBFE',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <Send style={{ width: '13px', height: '13px', color: '#2563EB' }} />
            <span>Forward</span>
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Take Action */}
          <button
            type="button"
            onClick={handleTakeActionClick}
            disabled={currentStatus === 'Resolved'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: currentStatus === 'Resolved' ? '#F1F5F9' : '#D97706',
              color: currentStatus === 'Resolved' ? '#94A3B8' : '#FFFFFF',
              border: 'none',
              cursor: currentStatus === 'Resolved' ? 'not-allowed' : 'pointer',
              boxShadow: currentStatus === 'Resolved' ? 'none' : '0 2px 6px rgba(217, 119, 6, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap style={{ width: '13px', height: '13px' }} />
            <span>Take Action</span>
          </button>

          {/* Resolve */}
          <button
            type="button"
            onClick={handleResolveClick}
            disabled={currentStatus === 'Resolved'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: currentStatus === 'Resolved' ? '#E2E8F0' : '#059669',
              color: currentStatus === 'Resolved' ? '#64748B' : '#FFFFFF',
              border: 'none',
              cursor: currentStatus === 'Resolved' ? 'not-allowed' : 'pointer',
              boxShadow: currentStatus === 'Resolved' ? 'none' : '0 2px 6px rgba(5, 150, 105, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            <CheckCircle style={{ width: '13px', height: '13px' }} />
            <span>{currentStatus === 'Resolved' ? 'Resolved' : 'Resolve'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Modals if not externally controlled */}
      {showEvidenceModal && (
        <EvidencePackageModal
          isOpen={showEvidenceModal}
          onClose={() => setShowEvidenceModal(false)}
          incident={incident}
          onForward={() => {
            setShowEvidenceModal(false);
            setShowEscalationModal(true);
          }}
        />
      )}

      {showEscalationModal && (
        <AuthorityEscalationModal
          isOpen={showEscalationModal}
          onClose={() => setShowEscalationModal(false)}
          incident={incident}
          onSuccess={(res) => {
            setCurrentStatus('Forwarded');
            if (onStatusChange) {
              onStatusChange(incidentId, 'Forwarded', res.selectedAuthority);
            }
          }}
        />
      )}

      {/* Action Selection Dialog */}
      {showActionDialog && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          role="dialog"
          aria-modal="true"
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '22px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              border: '1px solid #CBD5E1',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h4 style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap style={{ width: '16px', height: '16px', color: '#D97706' }} />
                Dispatch Enforcement Action
              </h4>
              <button
                type="button"
                onClick={() => setShowActionDialog(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8' }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
            
            <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
              Select an action to execute on vehicle <strong>{vehicleDetails}</strong> for incident {incidentId}:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                type="button"
                onClick={() => confirmAction('Dispatched On-Ground Flying Squad')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                🚔 Dispatch On-Ground Flying Squad
              </button>
              <button
                type="button"
                onClick={() => confirmAction('Issued E-Challan Penalty')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                📄 Issue Automated E-Challan Penalty (₹5,000)
              </button>
              <button
                type="button"
                onClick={() => confirmAction('Flagged Transport Permit for Revocation')}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  background: '#F8FAFC',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#0F172A',
                  cursor: 'pointer'
                }}
              >
                🚫 Flag Commercial Transport Permit
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowActionDialog(false)}
              style={{
                width: '100%',
                padding: '9px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                background: '#F1F5F9',
                fontSize: '12px',
                fontWeight: 600,
                color: '#475569',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Resolve Confirmation Dialog */}
      {showResolveDialog && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          role="dialog"
          aria-modal="true"
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '22px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              border: '1px solid #CBD5E1',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px'
            }}
          >
            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle style={{ width: '18px', height: '18px', color: '#059669' }} />
              Mark Incident as Resolved
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
              Are you sure you want to mark incident <strong>{incidentId}</strong> as Resolved? This verifies that corrective action or verification is complete.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setShowResolveDialog(false)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  background: '#F1F5F9',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#475569',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResolve}
                style={{
                  padding: '7px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#059669',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                }}
              >
                Confirm Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
