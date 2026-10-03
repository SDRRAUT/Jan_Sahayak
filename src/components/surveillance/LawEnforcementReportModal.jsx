import React, { useState } from 'react';
import { 
  Printer, 
  Send, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  X, 
  Building2, 
  FileText, 
  Camera, 
  User, 
  AlertTriangle,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LawEnforcementReportModal({
  isOpen = true,
  onClose,
  reportData,
  onSendToAdministrator,
  onDispatchSquad
}) {
  const [isSent, setIsSent] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [adminNote, setAdminNote] = useState(
    'Directing Municipal Enforcement Unit to initiate statutory penalty under solid waste & public transit guidelines.'
  );

  if (!isOpen || !reportData) return null;

  const {
    id = 'INC-2026-PUNE-0043',
    reportNumber = `PMC-ENF-2026-${String(reportData?.id || '0043').replace(/\D/g, '').slice(-4)}`,
    area = reportData?.location || 'Wagholi Lake Perimeter & Kesnand Culvert (Ward 29)',
    problem = reportData?.violation || 'Illegal Solid Waste & Plastic Sacks Dumping in Lake Waterbody',
    offenderDetails = reportData?.offenderDetails || reportData?.vehicleDetails || 'Motorcycle Rider (MH-12-EA-9142)',
    timestamp = reportData?.timestamp || 'Today, 12:40',
    camera = reportData?.camera || 'CAM-WAG-07 (Perimeter)',
    aiConfidence = reportData?.aiConfidence ?? 96,
    imageUrl = reportData?.evidenceFiles?.[0]?.url || '/surveillance/violation_dumping_lake.jpg',
    legalClause = 'Under Section 268/269 of Indian Penal Code & PMC Solid Waste Rules 2016'
  } = reportData;

  const handlePrint = () => {
    window.print();
  };

  const handleSendAdmin = () => {
    setIsSent(true);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
    } catch (_) {}
    if (onSendToAdministrator) {
      onSendToAdministrator(reportData, adminNote);
    }
  };

  const handleCopy = (text) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
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
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto'
      }}
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      <div
        style={{
          background: '#FFFFFF',
          width: '100%',
          maxWidth: '720px',
          borderRadius: '20px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '94vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
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
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShieldAlert style={{ width: '20px', height: '20px', color: '#F87171' }} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
                Official Law Violation Report — {reportNumber}
              </h2>
              <p style={{ fontSize: '11.5px', color: '#94A3B8', margin: '2px 0 0 0' }}>
                Pune Municipal Corporation • AI Civic Surveillance Evidence Dossier
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
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
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '16px', height: '16px' }} />
          </button>
        </div>

        {/* Scrollable Report Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Government Official Citation Banner */}
          <div
            style={{
              border: '1px solid #E2E8F0',
              borderRadius: '14px',
              background: '#F8FAFC',
              padding: '16px 18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                  CIVIC LAW BREACH INCIDENT
                </span>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', marginTop: '2px' }}>
                  {id}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#64748B' }}>
                  AI DETECTION ACCURACY
                </span>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#059669', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                  <ShieldCheck style={{ width: '14px', height: '14px' }} />
                  {aiConfidence}% Verified
                </div>
              </div>
            </div>

            {/* Minimalist 2-Field Report: Area & Problem */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
              {/* Area */}
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin style={{ width: '13px', height: '13px', color: '#E11D48' }} />
                  Area / Location
                </span>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                  {area}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Feeder Camera: <strong style={{ color: '#2563EB' }}>{camera}</strong>
                </div>
              </div>

              {/* Problem / What rule was broken */}
              <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #CBD5E1' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle style={{ width: '13px', height: '13px', color: '#DC2626' }} />
                  Problem / Rule Broken
                </span>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', marginTop: '4px', lineHeight: 1.4 }}>
                  {problem}
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                  Legal Reference: {legalClause}
                </div>
              </div>
            </div>

            {/* Offender Identification */}
            <div style={{ background: '#FFFFFF', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User style={{ width: '15px', height: '15px', color: '#2563EB' }} />
                <span style={{ fontSize: '12px', color: '#334155' }}>
                  Identified Offender / Vehicle: <strong>{offenderDetails}</strong>
                </span>
              </div>
              <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: '12px', height: '12px' }} />
                {timestamp}
              </span>
            </div>
          </div>

          {/* Photographic Evidence of Rule Breaker */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera style={{ width: '15px', height: '15px', color: '#059669' }} />
                Photographic Evidence Captured By AI Surveillance
              </span>
              <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700, background: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                Verified Proof
              </span>
            </div>

            {/* Evidence Image Container */}
            <div
              style={{
                position: 'relative',
                borderRadius: '14px',
                overflow: 'hidden',
                background: '#070D0A',
                border: '1px solid #CBD5E1',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                aspectRatio: '16 / 10'
              }}
            >
              <img
                src={imageUrl}
                alt="Law breaker photographic evidence"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* Top Warning Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(220, 38, 38, 0.95)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>🚨 LAW BREACH RECORDED</span>
              </div>

              {/* Bottom Watermark HUD */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  right: '10px',
                  background: 'rgba(15, 23, 42, 0.85)',
                  backdropFilter: 'blur(4px)',
                  color: '#FFFFFF',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '10.5px',
                  fontFamily: "'JetBrains Mono', monospace",
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <span style={{ color: '#34D399', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                  {camera} • REC {timestamp} IST
                </span>
                <span style={{ color: '#FDE047', fontWeight: 700 }}>
                  CONFIDENCE: {aiConfidence}%
                </span>
              </div>
            </div>
          </div>

          {/* Success Banner if Sent to Administrator */}
          {isSent && (
            <div
              style={{
                background: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 style={{ width: '22px', height: '22px', color: '#059669', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#064E3B' }}>
                    Dossier Successfully Forwarded to Ward Administrator!
                  </div>
                  <div style={{ fontSize: '11px', color: '#047857' }}>
                    Official Notice REF-2026-ADM-0043 registered for statutory penalty & enforcement.
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('REF-2026-ADM-0043')}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #A7F3D0',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: '#065F46',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copiedRef ? <Check style={{ width: '12px', height: '12px' }} /> : <Copy style={{ width: '12px', height: '12px' }} />}
                REF-2026-ADM-0043
              </button>
            </div>
          )}
        </div>

        {/* ─── The 3 Action Buttons Footer ─────────────────────────────────── */}
        <div
          style={{
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
            Official Civic Enforcement Action Dispatch
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {/* Option 1: Print Report */}
            <button
              type="button"
              onClick={handlePrint}
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
              <Printer style={{ width: '15px', height: '15px', color: '#475569' }} />
              <span>Print Report</span>
            </button>

            {/* Option 2: Send to Administrator */}
            <button
              type="button"
              onClick={handleSendAdmin}
              disabled={isSent}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: isSent ? '#059669' : '#2563EB',
                color: '#FFFFFF',
                border: 'none',
                cursor: isSent ? 'default' : 'pointer',
                boxShadow: '0 2px 8px rgba(37, 99, 235, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              {isSent ? (
                <>
                  <CheckCircle2 style={{ width: '15px', height: '15px' }} />
                  <span>Sent to Administrator</span>
                </>
              ) : (
                <>
                  <Building2 style={{ width: '15px', height: '15px' }} />
                  <span>Send to Administrator</span>
                </>
              )}
            </button>

            {/* Option 3: Dispatch Squad / Take Action */}
            <button
              type="button"
              onClick={() => {
                if (onDispatchSquad) onDispatchSquad(reportData);
                onClose();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '12.5px',
                fontWeight: 700,
                background: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
                transition: 'all 0.15s ease'
              }}
            >
              <Zap style={{ width: '15px', height: '15px' }} />
              <span>Dispatch Flying Squad</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
