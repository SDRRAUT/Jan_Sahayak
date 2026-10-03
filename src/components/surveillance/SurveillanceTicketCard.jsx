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
  Building2
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
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      {/* Top Header Strip */}
      <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-200/80 px-2 py-0.5 rounded">
            {incidentId}
          </span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {timestamp}
          </span>
        </div>

        {/* Tags: Camera, Vehicle, Confidence */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Camera Tag */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-blue-50 text-blue-700 border border-blue-200/70">
            <Camera className="w-3 h-3 text-blue-500" />
            {camera}
          </span>

          {/* Vehicle Tag */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Car className="w-3 h-3 text-slate-500" />
            <span className="truncate max-w-[170px]" title={vehicleDetails}>
              {vehicleDetails}
            </span>
          </span>

          {/* Confidence Pill */}
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {aiConfidence}% Confidence
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 sm:p-5 space-y-4 flex-1">
        {/* Violation & Location */}
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
            <span>{violation}</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 pl-6">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>

        {/* Status Workflow Pill / Stepper */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold uppercase tracking-wider text-slate-500">
              Workflow Status Progression
            </span>
            <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              Step {currentStepIndex + 1} of {WORKFLOW_STEPS.length}: <span className="text-blue-600 font-bold">{currentStatus}</span>
            </span>
          </div>

          {/* Horizontal scrollable workflow stepper */}
          <div className="overflow-x-auto pb-1 pt-1 scrollbar-thin">
            <div className="flex items-center min-w-max gap-1">
              {WORKFLOW_STEPS.map((step, idx) => {
                const isPast = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                let pillClass = 'bg-white text-slate-400 border-slate-200';
                if (isPast) {
                  pillClass = 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold';
                } else if (isCurrent) {
                  pillClass = 'bg-blue-600 text-white border-blue-600 font-bold shadow-xs';
                }

                return (
                  <React.Fragment key={step}>
                    <div 
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] border transition-all ${pillClass}`}
                      title={`Status: ${step}`}
                    >
                      {isPast ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : isCurrent ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                      )}
                      <span>{step}</span>
                    </div>

                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <ChevronRight 
                        className={`w-3 h-3 shrink-0 ${
                          idx < currentStepIndex ? 'text-emerald-500' : 'text-slate-300'
                        }`} 
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
          <div className="bg-blue-50/60 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-900 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Escalated to: <strong>{authorityRecipient || 'Police / Municipal Authority'}</strong></span>
            </div>
            {officialReference && (
              <span className="font-mono bg-blue-100 px-2 py-0.5 rounded text-[11px] font-bold text-blue-800">
                {officialReference}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="bg-slate-50/60 px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* View Evidence */}
          <button
            type="button"
            onClick={handleOpenEvidence}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>View Evidence</span>
          </button>

          {/* Forward */}
          <button
            type="button"
            onClick={handleOpenForward}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <Send className="w-3.5 h-3.5 text-blue-600" />
            <span>Forward</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Take Action */}
          <button
            type="button"
            onClick={handleTakeActionClick}
            disabled={currentStatus === 'Resolved'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Take Action</span>
          </button>

          {/* Resolve */}
          <button
            type="button"
            onClick={handleResolveClick}
            disabled={currentStatus === 'Resolved'}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus:outline-none focus:ring-2 ${
              currentStatus === 'Resolved'
                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs focus:ring-emerald-400'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Dispatch Enforcement Action
            </h4>
            <p className="text-xs text-slate-600">
              Select an action to execute on vehicle <strong>{vehicleDetails}</strong> for incident {incidentId}:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => confirmAction('Dispatched On-Ground Flying Squad')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800"
              >
                🚔 Dispatch On-Ground Flying Squad
              </button>
              <button
                type="button"
                onClick={() => confirmAction('Issued E-Challan Penalty')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800"
              >
                📄 Issue Automated E-Challan Penalty (₹5,000)
              </button>
              <button
                type="button"
                onClick={() => confirmAction('Flagged Transport Permit for Revocation')}
                className="w-full text-left p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-800"
              >
                🚫 Flag Commercial Transport Permit
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowActionDialog(false)}
              className="w-full py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Resolve Confirmation Dialog */}
      {showResolveDialog && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Mark Incident as Resolved
            </h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to mark incident <strong>{incidentId}</strong> as Resolved? This verifies that corrective action or verification is complete.
            </p>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowResolveDialog(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResolve}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
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
