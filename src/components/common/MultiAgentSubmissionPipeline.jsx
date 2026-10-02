import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Loader2, 
  Activity, 
  Zap, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

const PIPELINE_DURATION_SEC = 15;

export const AGENT_SPECS = [
  {
    id: 1,
    name: 'Indic NLU & Voice Agent',
    marathiName: 'भाषा व उच्चार विश्लेषण दूत',
    role: 'Speech & Dialect Normalization',
    icon: Volume2,
    color: '#2563EB',
    bgLight: '#EFF6FF',
    borderLight: '#BFDBFE',
    startSec: 0.0,
    endSec: 2.0,
    activeDescription: 'Transcribing voice tokens & extracting intent from Marathi/Hindi/English...',
    completedDescription: 'Dialect normalized • Problem intent indexed'
  },
  {
    id: 2,
    name: 'Vision & Geotag Authenticator',
    marathiName: 'छायाचित्र व जीपीएस सत्यापन दूत',
    role: 'EXIF & Physical Hazard Verification',
    icon: Eye,
    color: '#7C3AED',
    bgLight: '#F5F3FF',
    borderLight: '#DDD6FE',
    startSec: 1.8,
    endSec: 4.0,
    activeDescription: 'Scanning image EXIF coordinates & validating problem authenticity...',
    completedDescription: 'Geotag matched • Structural hazard verified'
  },
  {
    id: 3,
    name: 'Geo-Spatial & PMRDA Router',
    marathiName: 'भू-स्थानिक प्रभाग निश्चिती दूत',
    role: 'Ward Geofence & Boundary Lock',
    icon: MapPin,
    color: '#059669',
    bgLight: '#ECFDF5',
    borderLight: '#A7F3D0',
    startSec: 3.8,
    endSec: 6.0,
    activeDescription: 'Pinpointing GPS coords to Wagholi Municipal Ward & PMRDA grid...',
    completedDescription: 'Geofence locked: Wagholi Ward 29 (Ivy Estate & Kesnand Rd)'
  },
  {
    id: 4,
    name: 'Systemic DNA & Cluster Engine',
    marathiName: 'तक्रार जनुकीय व क्लस्टर विश्लेषक',
    role: '128-Dim Vector Similarity Match',
    icon: Layers,
    color: '#D97706',
    bgLight: '#FFFBEB',
    borderLight: '#FDE68A',
    startSec: 5.8,
    endSec: 8.0,
    activeDescription: 'Generating 128-dim Complaint DNA & cross-checking 500+ past clusters...',
    completedDescription: 'Cosine similarity matched: Ward 29 Active Cluster'
  },
  {
    id: 5,
    name: 'Inter-Agency Jurisdiction Classifier',
    marathiName: 'आंतर-विभागीय अधिकार क्षेत्र दूत',
    role: 'Municipal Authority Allocation',
    icon: Building2,
    color: '#0284C7',
    bgLight: '#F0F9FF',
    borderLight: '#BAE6FD',
    startSec: 7.8,
    endSec: 10.0,
    activeDescription: 'Triaging responsibility across PMC Water, PWD Road & MSEDCL Power...',
    completedDescription: 'Primary: PMC Water Supply Dept • Interlock: PWD Pune'
  },
  {
    id: 6,
    name: 'Dynamic SLA & Risk Predictor',
    marathiName: 'वेळ मर्यादा व धोका अंदाज दूत',
    role: 'Citizen SLA & Escalation Deadline',
    icon: Clock,
    color: '#DC2626',
    bgLight: '#FEF2F2',
    borderLight: '#FECACA',
    startSec: 9.8,
    endSec: 12.0,
    activeDescription: 'Evaluating neighborhood risk score & weather vulnerability...',
    completedDescription: 'Statutory 12-Hour Redressal SLA window minted'
  },
  {
    id: 7,
    name: 'SOP & Auto-Work-Order Synthesizer',
    marathiName: 'दुरुस्ती कृती आराखडा दूत',
    role: 'Engineering SOP & Equipment Dispatch',
    icon: FileText,
    color: '#0D9488',
    bgLight: '#F0FDFA',
    borderLight: '#99F6E4',
    startSec: 11.8,
    endSec: 13.5,
    activeDescription: 'Synthesizing standard repair procedure #14 & tooling specs...',
    completedDescription: 'Engineering SOP #14 formulated • Crew alert queued'
  },
  {
    id: 8,
    name: 'Municipal Token & Citizen Notifier',
    marathiName: 'अधिकृत टोकन व नागरिक सूचना दूत',
    role: 'Cryptographic Ticket Minting',
    icon: ShieldCheck,
    color: '#16A34A',
    bgLight: '#F0FDF4',
    borderLight: '#BBF7D0',
    startSec: 13.3,
    endSec: 15.0,
    activeDescription: 'Minting immutable municipal grievance ID & Jan-Suchna broadcast...',
    completedDescription: 'Ticket ID minted • SMS & Portal telemetry synced'
  }
];

export default function MultiAgentSubmissionPipeline({
  grievanceDraft = {},
  onComplete = () => {}
}) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isDoneAll, setIsDoneAll] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.min(PIPELINE_DURATION_SEC, (now - startTime) / 1000);
      setElapsedSec(elapsed);

      if (elapsed >= PIPELINE_DURATION_SEC) {
        setIsDoneAll(true);
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round((elapsedSec / PIPELINE_DURATION_SEC) * 100));
  const remainingSec = Math.max(0, (PIPELINE_DURATION_SEC - elapsedSec)).toFixed(1);

  return (
    <div style={{
      padding: 'clamp(18px, 3.5vw, 32px)',
      background: '#FFFFFF',
      borderRadius: '24px',
      color: '#0F172A',
      position: 'relative'
    }}>
      {/* Header Bar */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '4px 14px',
          borderRadius: '999px',
          background: '#ECFDF5',
          border: '1.5px solid #A7F3D0',
          color: '#065F46',
          fontSize: '12px',
          fontWeight: 800,
          marginBottom: '8px'
        }}>
          <Activity style={{ width: '14px', height: '14px', animation: 'pulse 1.5s infinite', color: '#059669' }} />
          <span>8-AGENT AUTONOMOUS MUNICIPAL ORCHESTRATION</span>
        </div>

        <h2 style={{
          fontSize: 'clamp(20px, 4vw, 26px)',
          fontWeight: 900,
          color: '#0F172A',
          margin: '0 0 4px 0',
          letterSpacing: '-0.02em'
        }}>
          Processing Grievance Across 8 AI Agents
        </h2>

        <p style={{
          fontSize: '13px',
          color: '#64748B',
          maxWidth: '620px',
          margin: '0 auto',
          lineHeight: 1.45
        }}>
          Each specialized municipal agent processes one step sequentially in <strong>Wagholi, Pune</strong> before generating your official ticket.
        </p>
      </div>

      {/* Live 15-Second Timer & Progress Bar */}
      <div style={{
        background: '#F8FAFC',
        border: '1.5px solid #E2E8F0',
        borderRadius: '16px',
        padding: '14px 18px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          marginBottom: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#0F172A',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }}>
              <Zap style={{ width: '16px', height: '16px', fill: '#10B981' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '13px', color: '#0F172A' }}>
                  Sequential Pipeline
                </strong>
                <span style={{
                  fontSize: '10.5px',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: '6px',
                  background: isDoneAll ? '#ECFDF5' : '#EFF6FF',
                  color: isDoneAll ? '#047857' : '#1D4ED8'
                }}>
                  {progressPercent}% Complete
                </span>
              </div>
              <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                Wagholi Ward 27-31 • PMC Pune Municipal Corporation
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '999px',
            padding: '5px 12px'
          }}>
            <Clock style={{ width: '14px', height: '14px', color: '#2563EB' }} />
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
              {isDoneAll ? '0.0s' : `${remainingSec}s`}
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#E2E8F0',
          borderRadius: '999px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)',
            borderRadius: '999px',
            transition: 'width 60ms linear'
          }} />
        </div>
      </div>


      {/* Action Submit Button that Appears When 15s Finishes */}
      {isDoneAll ? (
        <div style={{ textAlign: 'center', animation: 'fadeIn 300ms ease' }}>
          <button
            type="button"
            onClick={onComplete}
            style={{
              width: '100%',
              padding: '14px 24px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0E5E3A 0%, #064E3B 100%)',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '15px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(14, 94, 58, 0.35)',
              transition: 'all 200ms ease'
            }}
          >
            <Sparkles style={{ width: '18px', height: '18px' }} />
            <span>View Generated Municipal Ticket (#PN-2026-WAG)</span>
            <ArrowRight style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '10px',
          fontSize: '12px',
          color: '#64748B',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px'
        }}>
          <Loader2 style={{ width: '14px', height: '14px', animation: 'spin 1.5s linear infinite', color: '#2563EB' }} />
          <span>All 8 AI agents are coordinating in parallel. Ticket button will unlock at 15.0s...</span>
        </div>
      )}
    </div>
  );
}
