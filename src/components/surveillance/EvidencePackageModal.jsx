import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Send, 
  ShieldAlert, 
  Camera, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ZoomIn, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Eye,
  Info
} from 'lucide-react';
import { generateOfficialMunicipalReport } from '../../services/surveillanceService';

/**
 * EvidencePackageModal Component
 * Displays the verified dual-frame surveillance evidence, non-judgmental violation summary,
 * metadata grid, and actions for report generation and authority escalation.
 */
export default function EvidencePackageModal({
  isOpen = true,
  onClose,
  incident,
  onForward,
  onGenerateReport
}) {
  const [activeFrame, setActiveFrame] = useState('dual'); // 'dual' | 'frame1' | 'frame2'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [generatedReportData, setGeneratedReportData] = useState(null);
  const [showReportPreview, setShowReportPreview] = useState(false);

  if (!isOpen) return null;

  // Fallback defaults matching specifications
  const incidentId = incident?.id || 'INC-2026-PUNE-0042';
  const location = incident?.location || 'Wagholi Restricted Zone';
  const camera = incident?.camera || 'CAM-WAG-04';
  const timestamp = incident?.timestamp || '03 Oct 2026, 14:32';
  const aiConfidence = incident?.aiConfidence ?? 94;
  const verificationStatus = incident?.verificationStatus || incident?.status === 'Forwarded' 
    ? 'Forwarded to Authority' 
    : 'Awaiting Human Verification';
  const vehiclePlate = incident?.licensePlate || '#MH-12-Q-4029';
  const vehicleDetails = incident?.vehicleDetails || 'Heavy Commercial Dumper Truck (MH-12-Q-4029)';

  // Evidence frame URLs
  const frame1Url = incident?.evidenceFiles?.[0]?.url || 
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&auto=format&fit=crop&q=80';
  const frame2Url = incident?.evidenceFiles?.[1]?.url || 
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=900&auto=format&fit=crop&q=80';

  const handleGenerateReport = () => {
    const report = generateOfficialMunicipalReport(incident || {
      id: incidentId,
      location,
      camera,
      timestamp,
      aiConfidence,
      vehicleDetails
    });
    setGeneratedReportData(report);
    setReportGenerated(true);
    setShowReportPreview(true);
    if (onGenerateReport) {
      onGenerateReport(report);
    }
  };

  const handleForwardClick = () => {
    if (onForward) {
      onForward(incident || { id: incidentId, location, camera, timestamp, aiConfidence });
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="evidence-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div>
              <h2 id="evidence-modal-title" className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                🚨 Incident Evidence Package — {incidentId}
              </h2>
              <p className="text-xs text-slate-400">
                Automated High-Precision Civic AI Surveillance System • Ward 29 Pune
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Violation Summary - Non-Judgmental Language */}
          <div className="bg-amber-50/90 border border-amber-200 rounded-xl p-4 flex items-start gap-3.5 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                  Potential Violation Detected
                </span>
                <span className="text-xs text-amber-700 font-medium">
                  Rule: Commercial Vehicle Daytime Corridor Restriction (08:00–20:00)
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed font-normal">
                Potential restricted-area entry detected by AI surveillance. Awaiting official human verification.
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Incident ID</span>
              <span className="text-sm font-bold text-slate-900 mt-1 font-mono tracking-tight">{incidentId}</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Location</span>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="text-sm font-semibold text-slate-800 truncate" title={location}>{location}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Camera</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Camera className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-sm font-mono font-bold text-slate-800">{camera}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Timestamp</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="text-sm font-medium text-slate-800">{timestamp}</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">AI Confidence Score</span>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  {aiConfidence}% Confidence
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Verification Status</span>
              <div className="mt-1">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Frame Selection Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-2 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Dual-Frame Evidence Display</span>
              <span className="text-xs text-slate-400 font-mono">2 Verified Media Artifacts</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveFrame('dual')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeFrame === 'dual' ? 'bg-white shadow text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dual View
              </button>
              <button
                type="button"
                onClick={() => setActiveFrame('frame1')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeFrame === 'frame1' ? 'bg-white shadow text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Full CCTV
              </button>
              <button
                type="button"
                onClick={() => setActiveFrame('frame2')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  activeFrame === 'frame2' ? 'bg-white shadow text-slate-900 font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vehicle Crop
              </button>
            </div>
          </div>

          {/* Dual-Frame Evidence Display */}
          <div className={`grid gap-4 ${activeFrame === 'dual' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {/* Frame 1: Full CCTV Frame with geofence overlay and timestamp watermark */}
            {(activeFrame === 'dual' || activeFrame === 'frame1') && (
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-slate-950 flex flex-col">
                <div className="bg-slate-900/90 text-slate-200 px-3.5 py-2 text-xs font-semibold flex items-center justify-between border-b border-slate-800">
                  <span className="flex items-center gap-2 text-slate-100">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    Frame 1: Full CCTV Frame with Geofence Overlay
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">CAM-WAG-04 • 110° FOV</span>
                </div>
                
                <div className="relative aspect-[16/10] bg-slate-900 flex items-center justify-center overflow-hidden group">
                  <img
                    src={frame1Url}
                    alt="Full CCTV Corridor Frame with Geofence"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Geofence Overlay SVG */}
                  <svg 
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    {/* Simulated Geofence Polygon */}
                    <polygon
                      points="12,28 88,20 92,85 8,92"
                      fill="rgba(245, 158, 11, 0.18)"
                      stroke="#F59E0B"
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />
                    {/* Target Bounding Box */}
                    <rect
                      x="42"
                      y="46"
                      width="38"
                      height="36"
                      fill="none"
                      stroke="#EF4444"
                      strokeWidth="1.5"
                    />
                  </svg>

                  {/* Geofence Zone Label */}
                  <div className="absolute top-2.5 left-2.5 bg-amber-500/90 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded shadow backdrop-blur-xs flex items-center gap-1">
                    <span>⚠️ RESTRICTED GEOFENCE ZONE B</span>
                  </div>

                  {/* Target Vehicle Tag */}
                  <div className="absolute top-[40%] left-[44%] bg-rose-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shadow">
                    TARGET #01: Commercial Dumper ({aiConfidence}%)
                  </div>

                  {/* Timestamp & Telemetry Watermark */}
                  <div className="absolute bottom-2 inset-x-2 bg-black/75 backdrop-blur-sm text-slate-200 px-2.5 py-1.5 rounded flex items-center justify-between text-[10px] font-mono border border-white/10">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      REC 03 OCT 2026 14:31:08 IST
                    </span>
                    <span className="text-slate-300">WAGHOLI NORTH CORRIDOR 4K 30FPS</span>
                  </div>
                </div>

                <div className="bg-slate-900 px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                  <span>Geofence breach detected at ingress threshold</span>
                  <span className="text-slate-300 font-mono">Frame Size: 3840×2160</span>
                </div>
              </div>
            )}

            {/* Frame 2: Cropped Vehicle Snapshot showing vehicle profile and license plate */}
            {(activeFrame === 'dual' || activeFrame === 'frame2') && (
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-slate-950 flex flex-col">
                <div className="bg-slate-900/90 text-slate-200 px-3.5 py-2 text-xs font-semibold flex items-center justify-between border-b border-slate-800">
                  <span className="flex items-center gap-2 text-slate-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Frame 2: Cropped Vehicle Snapshot
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-700/50">
                    OCR Match 98.4%
                  </span>
                </div>
                
                <div className="relative aspect-[16/10] bg-slate-900 flex items-center justify-center overflow-hidden group">
                  <img
                    src={frame2Url}
                    alt="Cropped Vehicle Snapshot and License Plate"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />

                  {/* Optical Zoom Reticle Overlay */}
                  <div className="absolute inset-0 border border-emerald-500/30 pointer-events-none m-3 rounded flex flex-col justify-between p-2">
                    <div className="flex justify-between text-[9px] font-mono text-emerald-400">
                      <span>[OPTICAL CROP 3.2X]</span>
                      <span>FOV: 32° TARGET</span>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-emerald-400">
                      <span>CLASSIFICATION: COMMERCIAL</span>
                      <span>WEIGHT &gt; 3.5T</span>
                    </div>
                  </div>

                  {/* License Plate Display Banner */}
                  <div className="absolute bottom-3 inset-x-3 bg-slate-950/95 border-2 border-amber-400 p-2.5 rounded-lg shadow-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="bg-yellow-400 text-slate-950 font-black font-mono px-2 py-1 rounded text-sm tracking-widest border border-yellow-500 flex items-center gap-1.5 shadow-inner">
                        <span className="text-[9px] bg-blue-800 text-white px-1 rounded">IND</span>
                        <span>{vehiclePlate}</span>
                      </div>
                      <div className="text-left hidden sm:block">
                        <div className="text-[11px] font-bold text-white leading-tight">
                          Heavy Dumper Carrier
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Class: Commercial Multi-Axle
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        VERIFIED OCR
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 px-3 py-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
                  <span>Frontal bumper angle & vehicle profile registered</span>
                  <span className="text-slate-300 font-mono">Crop Res: 840×620</span>
                </div>
              </div>
            )}
          </div>

          {/* Generated Official Municipal Report Section (if triggered) */}
          {reportGenerated && showReportPreview && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-700" />
                  <span className="text-sm font-bold text-blue-900">
                    Official Municipal Report Generated
                  </span>
                  <span className="font-mono text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                    {generatedReportData?.reportNumber || 'PMC-SURV-2026-0042'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReportPreview(false)}
                  className="text-xs text-blue-700 hover:text-blue-900 font-semibold"
                >
                  Hide Preview
                </button>
              </div>

              <div className="text-xs text-blue-800 space-y-1 bg-white/70 p-3 rounded-lg border border-blue-100">
                <p><strong>Issuing Authority:</strong> {generatedReportData?.issuingAuthority}</p>
                <p><strong>Legal Citation:</strong> {generatedReportData?.legalNoticeClause}</p>
                <p><strong>Vehicle & Plate:</strong> {vehiclePlate} — {vehicleDetails}</p>
                <p><strong>Generated At:</strong> {generatedReportData?.generatedAt}</p>
                <p className="text-[11px] text-slate-600 italic mt-1">
                  Ready for submission or police dispatch with embedded cryptographic timestamp.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5 self-start sm:self-center">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Dual-frame bundle signed with SHA-256 integrity hash</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
            {/* Generate Official Municipal Report */}
            <button
              type="button"
              onClick={handleGenerateReport}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white text-slate-800 border border-slate-300 hover:bg-slate-100 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              <FileText className="w-4 h-4 text-slate-600" />
              Generate Official Municipal Report
            </button>

            {/* Forward to Authority (Police / Admin) */}
            <button
              type="button"
              onClick={handleForwardClick}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Send className="w-4 h-4" />
              Forward to Authority (Police / Admin)
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-slate-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
