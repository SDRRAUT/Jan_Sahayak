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
  const verificationStatus = incident?.verificationStatus || (incident?.status === 'Forwarded' 
    ? 'Forwarded to Authority' 
    : 'Awaiting Human Verification');
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
      aria-labelledby="evidence-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div 
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '860px',
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
          <div>
            <h2 
              id="evidence-modal-title" 
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🚨 Incident Evidence Package — {incidentId}
            </h2>
            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '3px 0 0 0' }}>
              Automated High-Precision Civic AI Surveillance System • Ward 29 Pune
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
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

        {/* ─── Modal Scrollable Body ────────────────────────────────────────── */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Violation Summary - Non-Judgmental Language */}
          <div 
            style={{
              background: '#FFFBEB',
              border: '1px solid #FDE68A',
              borderRadius: '14px',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <div 
              style={{
                padding: '8px',
                borderRadius: '8px',
                background: '#FEF3C7',
                color: '#B45309',
                flexShrink: 0,
                marginTop: '2px'
              }}
            >
              <ShieldAlert style={{ width: '20px', height: '20px', color: '#B45309' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span 
                  style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#92400E',
                    background: '#FDE68A',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Potential Violation Detected
                </span>
                <span style={{ fontSize: '12px', color: '#B45309', fontWeight: 600 }}>
                  Rule: Commercial Vehicle Daytime Corridor Restriction (08:00–20:00)
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '13.5px', color: '#334155', lineHeight: 1.5 }}>
                Potential restricted-area entry detected by AI surveillance. Awaiting official human verification.
              </p>
            </div>
          </div>

          {/* Metadata Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '10px'
            }}
          >
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>Incident ID</span>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>{incidentId}</div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>Location</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                <MapPin style={{ width: '14px', height: '14px', color: '#E11D48', flexShrink: 0 }} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={location}>{location}</span>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>Camera</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '4px', fontFamily: "'JetBrains Mono', monospace" }}>
                <Camera style={{ width: '14px', height: '14px', color: '#2563EB', flexShrink: 0 }} />
                <span>{camera}</span>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>Timestamp</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#0F172A', marginTop: '4px' }}>
                <Calendar style={{ width: '14px', height: '14px', color: '#64748B', flexShrink: 0 }} />
                <span>{timestamp}</span>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>AI Confidence Score</span>
              <div style={{ marginTop: '4px' }}>
                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 800,
                    background: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
                  {aiConfidence}% Confidence
                </span>
              </div>
            </div>

            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B' }}>Verification Status</span>
              <div style={{ marginTop: '4px' }}>
                <span 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    background: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FDE68A'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#F59E0B' }} />
                  {verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Frame Selection Tabs Strip */}
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #E2E8F0',
              paddingBottom: '8px',
              paddingTop: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#334155' }}>
                Dual-Frame Evidence Display
              </span>
              <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
                2 Verified Media Artifacts
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
              {[
                { id: 'dual', label: 'Dual View' },
                { id: 'frame1', label: 'Full CCTV' },
                { id: 'frame2', label: 'Vehicle Crop' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFrame(tab.id)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: activeFrame === tab.id ? '#FFFFFF' : 'transparent',
                    color: activeFrame === tab.id ? '#0F172A' : '#64748B',
                    fontSize: '11.5px',
                    fontWeight: activeFrame === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    boxShadow: activeFrame === tab.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dual-Frame Evidence Display Grid */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: activeFrame === 'dual' ? 'repeat(auto-fit, minmax(360px, 1fr))' : '1fr',
              gap: '16px'
            }}
          >
            {/* Frame 1: Full CCTV Frame with geofence overlay and timestamp watermark */}
            {(activeFrame === 'dual' || activeFrame === 'frame1') && (
              <div 
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: '#070D0A',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <div 
                  style={{
                    background: '#0F172A',
                    color: '#E2E8F0',
                    padding: '8px 14px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #1E293B'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F1F5F9' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EF4444' }} />
                    Frame 1: Full CCTV Frame with Geofence Overlay
                  </span>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: '#94A3B8' }}>CAM-WAG-04 • 110° FOV</span>
                </div>
                
                <div style={{ position: 'relative', aspectRatio: '16 / 10', background: '#070D0A', overflow: 'hidden' }}>
                  <img
                    src={frame1Url}
                    alt="Full CCTV Corridor Frame with Geofence"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  {/* Geofence Overlay SVG */}
                  <svg 
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <polygon
                      points="12,28 88,20 92,85 8,92"
                      fill="rgba(245, 158, 11, 0.18)"
                      stroke="#F59E0B"
                      strokeWidth="1.2"
                      strokeDasharray="2,2"
                    />
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
                  <div 
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      background: 'rgba(245, 158, 11, 0.95)',
                      color: '#070D0A',
                      fontSize: '10px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.3)'
                    }}
                  >
                    ⚠️ RESTRICTED GEOFENCE ZONE B
                  </div>

                  {/* Target Vehicle Tag */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '40%',
                      left: '44%',
                      background: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '9.5px',
                      fontFamily: 'monospace',
                      fontWeight: 800,
                      padding: '3px 7px',
                      borderRadius: '4px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                    }}
                  >
                    TARGET #01: Commercial Dumper ({aiConfidence}%)
                  </div>

                  {/* Timestamp & Telemetry Watermark */}
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      backdropFilter: 'blur(3px)',
                      color: '#E2E8F0',
                      padding: '6px 10px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '10px',
                      fontFamily: "'JetBrains Mono', monospace",
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#34D399' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                      REC 03 OCT 2026 14:31:08 IST
                    </span>
                    <span style={{ color: '#CBD5E1' }}>WAGHOLI NORTH CORRIDOR 4K 30FPS</span>
                  </div>
                </div>

                <div 
                  style={{
                    background: '#0F172A',
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #1E293B'
                  }}
                >
                  <span>Geofence breach detected at ingress threshold</span>
                  <span style={{ color: '#CBD5E1', fontFamily: 'monospace' }}>Frame Size: 3840×2160</span>
                </div>
              </div>
            )}

            {/* Frame 2: Cropped Vehicle Snapshot showing vehicle profile and license plate */}
            {(activeFrame === 'dual' || activeFrame === 'frame2') && (
              <div 
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  background: '#070D0A',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <div 
                  style={{
                    background: '#0F172A',
                    color: '#E2E8F0',
                    padding: '8px 14px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #1E293B'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#F1F5F9' }}>
                    <ShieldCheck style={{ width: '14px', height: '14px', color: '#34D399' }} />
                    Frame 2: Cropped Vehicle Snapshot
                  </span>
                  <span 
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '10px',
                      color: '#34D399',
                      background: 'rgba(6, 78, 59, 0.7)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    OCR Match 98.4%
                  </span>
                </div>
                
                <div style={{ position: 'relative', aspectRatio: '16 / 10', background: '#070D0A', overflow: 'hidden' }}>
                  <img
                    src={frame2Url}
                    alt="Cropped Vehicle Snapshot and License Plate"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />

                  {/* Optical Reticle Overlay */}
                  <div 
                    style={{
                      position: 'absolute',
                      inset: '10px',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      pointerEvents: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'monospace', color: '#34D399' }}>
                      <span>[OPTICAL CROP 3.2X]</span>
                      <span>FOV: 32° TARGET</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'monospace', color: '#34D399' }}>
                      <span>CLASSIFICATION: COMMERCIAL</span>
                      <span>WEIGHT &gt; 3.5T</span>
                    </div>
                  </div>

                  {/* License Plate Display Banner */}
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '10px',
                      right: '10px',
                      background: 'rgba(7, 13, 10, 0.95)',
                      border: '2px solid #F59E0B',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div 
                        style={{
                          background: '#FBBF24',
                          color: '#0F172A',
                          fontWeight: 900,
                          fontFamily: "'JetBrains Mono', monospace",
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '13px',
                          letterSpacing: '0.12em',
                          border: '1px solid #D97706',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        <span style={{ fontSize: '8px', background: '#1E3A8A', color: '#FFFFFF', padding: '1px 3px', borderRadius: '2px' }}>IND</span>
                        <span>{vehiclePlate}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#FFFFFF' }}>Heavy Dumper Carrier</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>Class: Commercial Multi-Axle</div>
                      </div>
                    </div>

                    <div>
                      <span 
                        style={{
                          fontSize: '10px',
                          color: '#34D399',
                          fontWeight: 800,
                          background: '#064E3B',
                          padding: '3px 7px',
                          borderRadius: '4px',
                          border: '1px solid #059669'
                        }}
                      >
                        VERIFIED OCR
                      </span>
                    </div>
                  </div>
                </div>

                <div 
                  style={{
                    background: '#0F172A',
                    padding: '8px 12px',
                    fontSize: '11px',
                    color: '#94A3B8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderTop: '1px solid #1E293B'
                  }}
                >
                  <span>Frontal bumper angle & vehicle profile registered</span>
                  <span style={{ color: '#CBD5E1', fontFamily: 'monospace' }}>Crop Res: 840×620</span>
                </div>
              </div>
            )}
          </div>

          {/* Generated Official Municipal Report Section */}
          {reportGenerated && showReportPreview && (
            <div 
              style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                borderRadius: '14px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText style={{ width: '16px', height: '16px', color: '#1D4ED8' }} />
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#1E3A8A' }}>
                    Official Municipal Report Generated
                  </span>
                  <span 
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '11px',
                      background: '#DBEAFE',
                      color: '#1E40AF',
                      padding: '2px 7px',
                      borderRadius: '4px',
                      fontWeight: 700
                    }}
                  >
                    {generatedReportData?.reportNumber || 'PMC-SURV-2026-0042'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowReportPreview(false)}
                  style={{ background: 'none', border: 'none', fontSize: '12px', color: '#2563EB', fontWeight: 700, cursor: 'pointer' }}
                >
                  Hide Preview
                </button>
              </div>

              <div 
                style={{
                  fontSize: '12px',
                  color: '#1E40AF',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  border: '1px solid #DBEAFE'
                }}
              >
                <div><strong>Issuing Authority:</strong> {generatedReportData?.issuingAuthority}</div>
                <div><strong>Legal Citation:</strong> {generatedReportData?.legalNoticeClause}</div>
                <div><strong>Vehicle & Plate:</strong> {vehiclePlate} — {vehicleDetails}</div>
                <div><strong>Generated At:</strong> {generatedReportData?.generatedAt}</div>
                <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic', marginTop: '4px' }}>
                  Ready for submission or police dispatch with embedded cryptographic timestamp.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── Action Buttons Footer ───────────────────────────────────────── */}
        <div 
          style={{
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Info style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
            <span>Dual-frame bundle signed with SHA-256 integrity hash</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Generate Official Municipal Report */}
            <button
              type="button"
              onClick={handleGenerateReport}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 15px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: '#FFFFFF',
                color: '#1E293B',
                border: '1px solid #CBD5E1',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.15s ease'
              }}
            >
              <FileText style={{ width: '15px', height: '15px', color: '#64748B' }} />
              Generate Official Municipal Report
            </button>

            {/* Forward to Authority */}
            <button
              type="button"
              onClick={handleForwardClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              <Send style={{ width: '15px', height: '15px' }} />
              Forward to Authority (Police / Admin)
            </button>

            {/* Close */}
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 600,
                background: '#E2E8F0',
                color: '#475569',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
