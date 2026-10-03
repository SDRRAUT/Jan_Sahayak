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

      // Trigger soft celebratory confetti for successful governance escalation
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="escalation-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 id="escalation-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
                Forward Incident Report to Authority
              </h2>
              <p className="text-xs text-slate-400">
                Official Municipal Escalation & Law Enforcement Dispatch
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Report Preview Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
                  Report Preview Summary
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-white border border-slate-200/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block font-medium">Incident</span>
                    <span className="font-mono font-bold text-slate-900 text-xs sm:text-sm">{incidentId}</span>
                  </div>
                  <div className="bg-white border border-slate-200/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block font-medium">Issue</span>
                    <span className="font-semibold text-rose-700 text-xs sm:text-sm">{issue}</span>
                  </div>
                  <div className="bg-white border border-slate-200/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block font-medium">Evidence</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {evidenceCount} Verified Media Files
                    </span>
                  </div>
                  <div className="bg-white border border-slate-200/80 p-2.5 rounded-lg">
                    <span className="text-slate-400 block font-medium">Location</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5 truncate" title={location}>
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Authority Selection Radio Options */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                  Select Authority Destination
                </label>
                <div className="space-y-2">
                  {AUTHORITIES.map((auth) => {
                    const isSelected = selectedAuthority === auth.label;
                    return (
                      <label
                        key={auth.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-blue-50/70 border-blue-500 shadow-sm ring-1 ring-blue-500/20' 
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="authority"
                          value={auth.label}
                          checked={isSelected}
                          onChange={() => setSelectedAuthority(auth.label)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                        />
                        <div className="space-y-0.5 flex-1">
                          <div className="text-sm font-semibold text-slate-900">
                            {auth.label}
                          </div>
                          <div className="text-xs text-slate-500">
                            {auth.subtitle}
                          </div>
                          <div className="text-[11px] text-blue-700 font-medium">
                            {auth.department}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Officer Dispatch Notes / Remarks */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="dispatch-notes" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Officer Dispatch Notes / Remarks
                  </label>
                  <span className="text-[11px] text-slate-400">Attached to official civic dispatch</span>
                </div>
                <textarea
                  id="dispatch-notes"
                  rows={3}
                  value={dispatchNotes}
                  onChange={(e) => setDispatchNotes(e.target.value)}
                  placeholder="Enter dispatch notes, vehicle description, or specific inspection instructions..."
                  className="w-full text-xs sm:text-sm p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-800 placeholder-slate-400 bg-white"
                />
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Official Report...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Official Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Success Confirmation State */
            <div className="space-y-5 py-2 text-center sm:text-left">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-emerald-950">
                      ✅ Report successfully forwarded to {selectedAuthority}
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      The official enforcement package has been logged in the Municipal Central Dispatch registry.
                    </p>
                  </div>
                </div>

                <div className="bg-white/90 border border-emerald-200 rounded-xl p-4 space-y-2.5 text-xs text-slate-800">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-100">
                    <span className="font-semibold text-slate-600">Official Reference:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {submissionResult?.officialReference || 'REF-2026-0042'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyRef(submissionResult?.officialReference || 'REF-2026-0042')}
                        className="p-1 rounded hover:bg-slate-100 text-slate-500"
                        title="Copy Reference"
                      >
                        {copiedRef ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">Status updated to:</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      {submissionResult?.status || 'Forwarded to Authority'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">Target Authority:</span>
                    <span className="font-medium text-slate-800">{selectedAuthority}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">Time Dispatched:</span>
                    <span className="font-mono text-slate-700 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {submissionResult?.timestamp || 'Today, 14:35 IST'}
                    </span>
                  </div>

                  {dispatchNotes && (
                    <div className="pt-2 border-t border-emerald-100 text-slate-600 text-[11px] italic bg-slate-50/60 p-2 rounded">
                      &quot;{dispatchNotes}&quot;
                    </div>
                  )}
                </div>
              </div>

              {/* Success Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-slate-400"
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
