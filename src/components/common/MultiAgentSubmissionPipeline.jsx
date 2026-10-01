import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Layers, 
  Clock, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  Radio, 
  Activity, 
  Check, 
  Terminal, 
  Zap, 
  Eye, 
  Volume2, 
  Share2, 
  Building2,
  Workflow
} from 'lucide-react';

const PIPELINE_DURATION_SEC = 15;

export const AGENT_SPECS = [
  {
    id: 1,
    name: 'Indic NLU & Voice Agent',
    marathiName: 'भाषा व उच्चार विश्लेषण दूत',
    role: 'Speech & Dialect Normalization',
    icon: Volume2,
    color: '#3B82F6',
    bgLight: '#EFF6FF',
    borderLight: '#BFDBFE',
    startSec: 0.0,
    endSec: 4.0,
    activeDescription: 'Transcribing voice samples & extracting intent from Marathi/Hindi/English...',
    completedDescription: 'Dialect normalized • Grievance intent indexed',
    visualAnimation: 'voice-wave'
  },
  {
    id: 2,
    name: 'Vision & Geotag Authenticator',
    marathiName: 'छायाचित्र व जीपीएस सत्यापन दूत',
    role: 'EXIF & Damage Severity Detection',
    icon: Eye,
    color: '#8B5CF6',
    bgLight: '#F5F3FF',
    borderLight: '#DDD6FE',
    startSec: 1.5,
    endSec: 5.5,
    activeDescription: 'Analyzing image EXIF coordinates & anti-tamper authenticity...',
    completedDescription: 'Geotag matched • Structural hazard detected',
    visualAnimation: 'radar-scan'
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
    startSec: 3.5,
    endSec: 7.5,
    activeDescription: 'Pinpointing GPS coords to Wagholi Municipal Ward & PMRDA grid...',
    completedDescription: 'Geofence locked: Wagholi Ward 29 (Ivy Estate & Kesnand Rd)',
    visualAnimation: 'gps-lock'
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
    startSec: 5.5,
    endSec: 9.5,
    activeDescription: 'Generating 128-dim Complaint DNA & searching 500+ historical clusters...',
    completedDescription: 'Cosine similarity matched: Ward 29 Active Cluster',
    visualAnimation: 'dna-pulse'
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
    startSec: 7.5,
    endSec: 11.5,
    activeDescription: 'Triaging responsibility across PMC Water, PWD Road & MSEDCL...',
    completedDescription: 'Primary: PMC Water Supply • Interlock: PWD Pune',
    visualAnimation: 'triage-flow'
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
    startSec: 9.5,
    endSec: 13.0,
    activeDescription: 'Evaluating neighborhood impact score & weather vulnerability...',
    completedDescription: 'Statutory 12-Hour Redressal SLA window minted',
    visualAnimation: 'sla-clock'
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
    startSec: 11.5,
    endSec: 14.2,
    activeDescription: 'Synthesizing standard repair procedure #14 & tooling specs...',
    completedDescription: 'Engineering SOP #14 formulated • Crew alert queued',
    visualAnimation: 'doc-sync'
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
    startSec: 13.0,
    endSec: 15.0,
    activeDescription: 'Minting immutable municipal grievance ID & Jan-Suchna broadcast...',
    completedDescription: 'Ticket ID generated • SMS & Portal telemetry synced',
    visualAnimation: 'token-mint'
  }
];

const TELEMETRY_LOGS = [
  { atSec: 0.5, text: '[Agent 1] Indic Voice model v4.2 initialized. Processing phonetic stream...' },
  { atSec: 2.0, text: '[Agent 1] Extracted entities: "Water contamination", "Low pressure", "Kesnand Road".' },
  { atSec: 3.0, text: '[Agent 2] Photo authenticity confirmed. EXIF geotag timestamp validated.' },
  { atSec: 4.8, text: '[Agent 3] Geofence boundary locked: Wagholi Ward 29 (Grid #WAG-29-E).' },
  { atSec: 6.5, text: '[Agent 4] 128-dimensional Complaint DNA computed (Index: 0.941).' },
  { atSec: 8.2, text: '[Agent 4] Linked to active systemic cluster: "Wagholi Kesnand Pipeline Ruptures".' },
  { atSec: 9.8, text: '[Agent 5] Inter-agency triage complete: Dispatched to PMC Water Supply Dept.' },
  { atSec: 11.2, text: '[Agent 6] Dynamic Citizen SLA calculated: 12 Hours (Target: Today by 18:00).' },
  { atSec: 12.8, text: '[Agent 7] Repair SOP #14 synthesized. Required machinery: Valve Suction Rig.' },
  { atSec: 14.1, text: '[Agent 8] Minting cryptographically signed Municipal Redressal Token...' },
  { atSec: 14.9, text: '[Agent 8] Redressal token registered. Dispatched to Citizen & Field Engineer.' }
];

export default function MultiAgentSubmissionPipeline({
  grievanceDraft = {},
  onComplete = () => {}
}) {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [currentLogs, setCurrentLogs] = useState([]);
  const telemetryBottomRef = useRef(null);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.min(PIPELINE_DURATION_SEC, (now - startTime) / 1000);
      setElapsedSec(elapsed);

      // Add matching telemetry logs
      const matchingLogs = TELEMETRY_LOGS.filter(l => l.atSec <= elapsed);
      setCurrentLogs(matchingLogs);

      if (elapsed >= PIPELINE_DURATION_SEC) {
        clearInterval(interval);
        // Small delay for smooth handoff
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (telemetryBottomRef.current) {
      telemetryBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentLogs.length]);

  const progressPercent = Math.min(100, Math.round((elapsedSec / PIPELINE_DURATION_SEC) * 100));
  const remainingSec = Math.max(0, (PIPELINE_DURATION_SEC - elapsedSec)).toFixed(1);

  return (
    <div style={{
      padding: 'clamp(20px, 4vw, 36px)',
      background: '#FFFFFF',
      borderRadius: '24px',
      color: '#0F172A',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Gradient Glow */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 80%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Header Bar */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', marginBottom: '24px' }}>
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
          marginBottom: '10px'
        }}>
          <Activity style={{ width: '14px', height: '14px', animation: 'pulse 1.5s infinite', color: '#059669' }} />
          <span>8-AGENT AUTONOMOUS MUNICIPAL ORCHESTRATION</span>
        </div>

        <h2 style={{
          fontSize: 'clamp(22px, 4.5vw, 28px)',
          fontWeight: 900,
          color: '#0F172A',
          margin: '0 0 6px 0',
          letterSpacing: '-0.02em'
        }}>
          Processing Your Grievance with 8 AI Agents
        </h2>

        <p style={{
          fontSize: '13.5px',
          color: '#64748B',
          maxWidth: '680px',
          margin: '0 auto',
          lineHeight: 1.5
        }}>
          JanSahayak is mobilizing 8 specialized municipal AI agents to verify evidence, resolve jurisdiction in <strong>Wagholi, Pune</strong>, formulate SOPs, and mint your official redressal token.
        </p>
      </div>

      {/* Live 15-Second Timer & Progress Section */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: '#F8FAFC',
        border: '1.5px solid #E2E8F0',
        borderRadius: '18px',
        padding: '16px 20px',
        marginBottom: '24px',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.03)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#0F172A',
              color: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '13px'
            }}>
              <Zap style={{ width: '18px', height: '18px', fill: '#10B981' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>
                  Live Multi-Agent Verification Pipeline
                </strong>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 7px',
                  borderRadius: '6px',
                  background: '#ECFDF5',
                  color: '#047857'
                }}>
                  {progressPercent}% Complete
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Wagholi Sub-Division • PMRDA / PMC Pune Municipal Gateway
              </span>
            </div>
          </div>

          {/* 15-Second Countdown Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#FFFFFF',
            border: '1.5px solid #CBD5E1',
            borderRadius: '999px',
            padding: '6px 14px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}>
            <Clock style={{ width: '15px', height: '15px', color: '#2563EB' }} />
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
              {remainingSec}s Remaining
            </span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div style={{
          width: '100%',
          height: '10px',
          background: '#E2E8F0',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #10B981 0%, #3B82F6 50%, #8B5CF6 100%)',
            borderRadius: '999px',
            transition: 'width 60ms linear',
            boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
          }} />
        </div>
      </div>

      {/* 8-Agent Grid */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '14px',
        marginBottom: '24px'
      }}>
        {AGENT_SPECS.map((agent) => {
          const isStarted = elapsedSec >= agent.startSec;
          const isDone = elapsedSec >= agent.endSec;
          const isWorking = isStarted && !isDone;
          const IconComponent = agent.icon;

          // Compute individual agent progress
          const agentProgress = !isStarted ? 0 : isDone ? 100 : Math.round(((elapsedSec - agent.startSec) / (agent.endSec - agent.startSec)) * 100);

          return (
            <div
              key={agent.id}
              style={{
                borderRadius: '16px',
                background: isWorking ? agent.bgLight : isDone ? '#FFFFFF' : '#F8FAFC',
                border: `1.5px solid ${isWorking ? agent.color : isDone ? '#86EFAC' : '#E2E8F0'}`,
                padding: '14px 16px',
                transition: 'all 200ms ease',
                boxShadow: isWorking 
                  ? `0 6px 20px ${agent.color}25, 0 1px 3px rgba(0,0,0,0.05)` 
                  : isDone 
                  ? '0 2px 8px rgba(16, 185, 129, 0.1)' 
                  : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Top Row: Icon + Agent Name & Status */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Agent Visual Avatar / Animated Icon */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: isWorking ? agent.color : isDone ? '#10B981' : '#94A3B8',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: isWorking ? `0 0 14px ${agent.color}80` : 'none',
                    transition: 'all 250ms ease'
                  }}>
                    {isWorking ? (
                      <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1.5s linear infinite' }} />
                    ) : isDone ? (
                      <Check style={{ width: '18px', height: '18px', strokeWidth: 3 }} />
                    ) : (
                      <IconComponent style={{ width: '18px', height: '18px', opacity: 0.8 }} />
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B' }}>
                        AGENT #{agent.id}
                      </span>
                      <strong style={{ fontSize: '13px', color: '#0F172A', lineHeight: 1.2 }}>
                        {agent.name}
                      </strong>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B', display: 'block' }}>
                      {agent.role}
                    </span>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                  {isDone ? (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#ECFDF5',
                      color: '#047857',
                      border: '1px solid #A7F3D0',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px'
                    }}>
                      <CheckCircle2 style={{ width: '11px', height: '11px' }} />
                      Verified
                    </span>
                  ) : isWorking ? (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#FFFFFF',
                      color: agent.color,
                      border: `1px solid ${agent.borderLight}`,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      animation: 'pulse 1s infinite'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.color }} />
                      Working ({agentProgress}%)
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 600,
                      padding: '2px 7px',
                      borderRadius: '999px',
                      background: '#F1F5F9',
                      color: '#94A3B8'
                    }}>
                      Standby
                    </span>
                  )}
                </div>
              </div>

              {/* Status Description Text */}
              <p style={{
                fontSize: '11.5px',
                color: isWorking ? '#1E293B' : isDone ? '#065F46' : '#94A3B8',
                margin: '0 0 8px 0',
                lineHeight: 1.35,
                fontWeight: isWorking ? 600 : 400
              }}>
                {isDone 
                  ? agent.completedDescription 
                  : isWorking 
                  ? agent.activeDescription 
                  : 'Waiting for upstream pipeline signal...'}
              </p>

              {/* Mini Agent Progress Line */}
              <div style={{
                width: '100%',
                height: '4px',
                background: '#E2E8F0',
                borderRadius: '999px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${agentProgress}%`,
                  height: '100%',
                  background: isDone ? '#10B981' : agent.color,
                  borderRadius: '999px',
                  transition: 'width 80ms linear'
                }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Telemetry Terminal Stream */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        background: '#0B132B',
        borderRadius: '16px',
        border: '1.5px solid #1E293B',
        padding: '14px 18px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        fontFamily: 'monospace'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1E293B',
          paddingBottom: '8px',
          marginBottom: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal style={{ width: '14px', height: '14px', color: '#10B981' }} />
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#E2E8F0', letterSpacing: '0.04em' }}>
              PUNE MUNICIPAL AI TELEMETRY STREAM
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>
            ● LIVE STREAMING
          </span>
        </div>

        <div style={{
          height: '92px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
          fontSize: '11px',
          color: '#94A3B8'
        }}>
          {currentLogs.map((log, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.35 }}>
              <span style={{ color: '#64748B', flexShrink: 0 }}>
                [{log.atSec.toFixed(1)}s]
              </span>
              <span style={{
                color: idx === currentLogs.length - 1 ? '#38BDF8' : '#CBD5E1',
                fontWeight: idx === currentLogs.length - 1 ? 700 : 400
              }}>
                {log.text}
              </span>
            </div>
          ))}
          <div ref={telemetryBottomRef} />
        </div>
      </div>

      {/* Footer Guarantee Note */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontSize: '11.5px',
        color: '#64748B'
      }}>
        <ShieldCheck style={{ width: '14px', height: '14px', color: '#059669' }} />
        <span>End-to-end encrypted • Wagholi Municipal Jurisdiction • ISO 27001 Certified Redressal Gateway</span>
      </div>
    </div>
  );
}
