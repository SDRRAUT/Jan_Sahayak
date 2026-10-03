import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Send, 
  Building2, 
  ShieldAlert, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Camera, 
  Clock, 
  User, 
  Zap, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import LawEnforcementReportModal from './LawEnforcementReportModal';

export const VIOLATION_DOSSIERS = [
  {
    id: 'INC-2026-PUNE-0045',
    reportNumber: 'PMC-ENF-2026-0045',
    title: 'Chemical Drum Waste Dumping',
    area: 'Wagholi Commercial Market & Auto Stand (Ward 29)',
    problem: 'Individual unloading and dumping industrial sludge from large blue drum directly into public street heap',
    offenderDetails: 'Male in yellow shirt • Hand dumping beside auto-rickshaw',
    timestamp: 'Today, 14:15 IST',
    camera: 'CAM-WAG-04 (Arterial Main)',
    aiConfidence: 98,
    imageUrl: '/surveillance/violation_drum_dumping.jpg',
    legalClause: 'Section 268/277 IPC & Hazardous/Commercial Waste Rules',
    status: 'Evidence Captured'
  },
  {
    id: 'INC-2026-PUNE-0044',
    reportNumber: 'PMC-ENF-2026-0044',
    title: 'Roadside Red Bucket Waste Dumping',
    area: 'Baif Road Commercial Market & Highway Corridor (Ward 29)',
    problem: 'Unauthorized dumping of commercial garbage container directly onto public roadway lane',
    offenderDetails: 'Individual emptying red bucket • Adjacent to handcart & auto',
    timestamp: 'Today, 09:20 IST',
    camera: 'CAM-WAG-02 (Junction)',
    aiConfidence: 97,
    imageUrl: '/surveillance/violation_bucket_dumping.jpg',
    legalClause: 'PMC Municipal Solid Waste Bylaws 2024 & Clean City Code',
    status: 'Detected'
  },
  {
    id: 'INC-2026-PUNE-0046',
    reportNumber: 'PMC-ENF-2026-0046',
    title: 'Two-Wheeler Plastic Plate Littering',
    area: 'Wagholi Main Arterial Road (Near Laxmi Chowk)',
    problem: 'Open littering and illegal dumping of single-use disposable plastic plates and debris on roadway margin',
    offenderDetails: 'Two-Wheeler Riders • White Honda Activa (MH-12-P-3318)',
    timestamp: 'Today, 12:40 IST',
    camera: 'CAM-WAG-07 (Perimeter)',
    aiConfidence: 95,
    imageUrl: '/surveillance/violation_scooter_litter.jpg',
    legalClause: 'Maharashtra Non-Biodegradable Garbage Control Act & SWM Rules',
    status: 'Evidence Captured'
  },
  {
    id: 'INC-2026-PUNE-0047',
    reportNumber: 'PMC-ENF-2026-0047',
    title: 'Market Entry Roadside Garbage Heap',
    area: 'Wagholi Commercial Market Entry (Ward 29)',
    problem: 'Persistent illegal roadside garbage dumping and plastic accumulation obstructing highway lane',
    offenderDetails: 'Multiple Commercial Transporters & Two-Wheelers',
    timestamp: 'Today, 11:30 IST',
    camera: 'CAM-WAG-02 (Junction)',
    aiConfidence: 94,
    imageUrl: '/surveillance/violation_market_road_dump.jpg',
    legalClause: 'Section 133 CrPC (Removal of Public Nuisance) & PMC Sanitation Bylaws',
    status: 'Detected'
  }
];

export default function LawEnforcementReportCard({
  onEscalateToAdmin,
  onDispatchSquad
}) {
  const [activeDossierIndex, setActiveDossierIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [sentReports, setSentReports] = useState({});

  const currentDossier = VIOLATION_DOSSIERS[activeDossierIndex];
  const isCurrentSent = Boolean(sentReports[currentDossier.id]);

  const handleSendToAdministrator = (dossier) => {
    setSentReports(prev => ({ ...prev, [dossier.id]: true }));
    try {
      confetti({ particleCount: 35, spread: 55, origin: { y: 0.6 } });
    } catch (_) {}
    if (onEscalateToAdmin) {
      onEscalateToAdmin(dossier);
    }
  };

  const handlePrint = () => {
    setShowModal(true);
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        padding: '20px 22px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '6px'
      }}
    >
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ShieldAlert style={{ width: '18px', height: '18px', color: '#DC2626' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              Law Breaker Incident Reports
              <span style={{ fontSize: '10.5px', background: '#FEE2E2', color: '#991B1B', padding: '2px 7px', borderRadius: '4px', fontWeight: 800 }}>
                {VIOLATION_DOSSIERS.length} Rule Breakers
              </span>
            </h3>
            <p style={{ fontSize: '11.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              Minimalist evidence reports of offenders captured breaking civic laws in Ward 29
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11.5px',
            fontWeight: 700,
            color: '#2563EB',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            padding: '5px 10px',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <span>Open Full Dossier</span>
          <ExternalLink style={{ width: '12px', height: '12px' }} />
        </button>
      </div>

      {/* ─── Selector Tabs Between Rule Breakers ───────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '6px' }}>
        {VIOLATION_DOSSIERS.map((dossier, idx) => {
          const isSelected = idx === activeDossierIndex;
          const isSent = Boolean(sentReports[dossier.id]);
          return (
            <button
              key={dossier.id}
              type="button"
              onClick={() => setActiveDossierIndex(idx)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '8px',
                fontSize: '11.5px',
                fontWeight: isSelected ? 800 : 600,
                background: isSelected ? '#0F172A' : '#F1F5F9',
                color: isSelected ? '#FFFFFF' : '#475569',
                border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                textAlign: 'left'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                #{idx + 1} {dossier.title}
              </span>
              {isSent ? (
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34D399', flexShrink: 0 }} title="Sent to Administrator" />
              ) : (
                <span style={{ fontSize: '10px', opacity: 0.75, flexShrink: 0 }}>{dossier.aiConfidence}%</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─── Minimalist Rule Breaker Report Details ────────────────────────── */}
      <div
        style={{
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          background: '#F8FAFC',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}
      >
        {/* Top Summary Banner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B' }}>
              OFFICIAL REPORT REF
            </span>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A', fontFamily: "'JetBrains Mono', monospace" }}>
              {currentDossier.reportNumber}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 800,
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0'
              }}
            >
              <ShieldCheck style={{ width: '13px', height: '13px', color: '#059669' }} />
              {currentDossier.aiConfidence}% AI Match
            </span>

            <span style={{ fontSize: '11px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock style={{ width: '12px', height: '12px' }} />
              {currentDossier.timestamp}
            </span>
          </div>
        </div>

        {/* Minimalist 2-Box Summary: Area and What problem he made */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
          {/* Area */}
          <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin style={{ width: '12px', height: '12px', color: '#E11D48' }} />
              Area / Location
            </span>
            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
              {currentDossier.area}
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
              Camera: {currentDossier.camera}
            </div>
          </div>

          {/* Problem / What rule he broke */}
          <div style={{ background: '#FFFFFF', padding: '12px 14px', borderRadius: '10px', border: '1px solid #FECACA' }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#DC2626', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <AlertTriangle style={{ width: '12px', height: '12px', color: '#DC2626' }} />
              Problem / Law Broken
            </span>
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#991B1B', marginTop: '4px', lineHeight: 1.4 }}>
              {currentDossier.problem}
            </div>
            <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '2px' }}>
              Offender: <strong>{currentDossier.offenderDetails}</strong>
            </div>
          </div>
        </div>

        {/* Evidence Image Preview */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
            <span style={{ fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Camera style={{ width: '13px', height: '13px', color: '#059669' }} />
              Photographic Proof of Rule Breaker
            </span>
            <span style={{ color: '#64748B', fontSize: '10px', fontFamily: 'monospace' }}>
              CCTV Verified Frame
            </span>
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#070D0A',
              border: '1px solid #CBD5E1',
              aspectRatio: '16 / 9.5',
              cursor: 'pointer'
            }}
            onClick={() => setShowModal(true)}
            title="Click to view full high-res report and zoom"
          >
            <img
              src={currentDossier.imageUrl}
              alt="Evidence of rule breaker"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />

            {/* Red Alert Pill on Image */}
            <div
              style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(220, 38, 38, 0.95)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
              }}
            >
              <span>🚨 RULE BREACH CAPTURED</span>
            </div>

            {/* Offender Tag on Image */}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '10px',
                right: '10px',
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(3px)',
                color: '#FFFFFF',
                padding: '6px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                fontFamily: "'JetBrains Mono', monospace",
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <span style={{ color: '#34D399' }}>{currentDossier.camera}</span>
              <span style={{ color: '#FDE047' }}>OFFENDER: {currentDossier.offenderDetails?.split('•')?.[0] || 'Target #01'}</span>
            </div>
          </div>
        </div>

        {/* ─── The 3 Action Buttons ───────────────────────────────────────── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'wrap',
            paddingTop: '6px',
            borderTop: '1px solid #E2E8F0'
          }}
        >
          {/* Option 1: Print Report */}
          <button
            type="button"
            onClick={handlePrint}
            style={{
              flex: '1 1 auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
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
            <Printer style={{ width: '14px', height: '14px', color: '#475569' }} />
            <span>Print Report</span>
          </button>

          {/* Option 2: Send to Administrator */}
          <button
            type="button"
            onClick={() => handleSendToAdministrator(currentDossier)}
            disabled={isCurrentSent}
            style={{
              flex: '1 1 auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: isCurrentSent ? '#059669' : '#2563EB',
              color: '#FFFFFF',
              border: 'none',
              cursor: isCurrentSent ? 'default' : 'pointer',
              boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {isCurrentSent ? (
              <>
                <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                <span>Sent to Administrator</span>
              </>
            ) : (
              <>
                <Building2 style={{ width: '14px', height: '14px' }} />
                <span>Send to Administrator</span>
              </>
            )}
          </button>

          {/* Option 3: Dispatch Flying Squad */}
          <button
            type="button"
            onClick={() => {
              if (onDispatchSquad) onDispatchSquad(currentDossier);
            }}
            style={{
              flex: '1 1 auto',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 700,
              background: '#D97706',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(217, 119, 6, 0.2)',
              transition: 'all 0.15s ease'
            }}
          >
            <Zap style={{ width: '14px', height: '14px' }} />
            <span>Dispatch Squad</span>
          </button>
        </div>
      </div>

      {/* Embedded Full Modal */}
      {showModal && (
        <LawEnforcementReportModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          reportData={currentDossier}
          allDossiers={VIOLATION_DOSSIERS}
          onSelectDossier={(dossier, idx) => {
            setActiveDossierIndex(idx);
          }}
          onSendToAdministrator={(rep) => handleSendToAdministrator(rep || currentDossier)}
          onDispatchSquad={(rep) => {
            if (onDispatchSquad) onDispatchSquad(rep || currentDossier);
          }}
        />
      )}
    </div>
  );
}
