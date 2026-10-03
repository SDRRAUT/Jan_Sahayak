import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Activity, 
  ShieldAlert, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  Terminal, 
  Clock, 
  MapPin, 
  Radio, 
  Layers, 
  RefreshCw, 
  Play, 
  Pause, 
  Copy, 
  Check, 
  ChevronRight,
  Filter,
  Eye,
  Sliders
} from 'lucide-react';

/**
 * SurveillanceAgentTelemetry Component
 * Displays real-time operational telemetry for Agent 1 (Surveillance Agent):
 * - Status header with CCTV connection, Agent status, location, and live scan counter
 * - 4 AI status cards (Scene Analysis, Rule Monitoring, Evidence Capture, Incident Detection)
 * - Live rolling telemetry terminal log with simulated optical tokens and frame events
 */
export default function SurveillanceAgentTelemetry({
  isViolationActive = false,
  simStep = 0,
  activeCamera = 'CAM-WAG-04',
  className = ''
}) {
  // Live relative "Last scan: X sec ago" counter
  const [scanSecondsAgo, setScanSecondsAgo] = useState(2);
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // ALL | OPTICAL | DETECTION | VIOLATION
  const terminalEndRef = useRef(null);

  // Initial telemetry logs
  const [logs, setLogs] = useState([
    {
      id: 1,
      time: '14:31:58.102',
      frame: 4027,
      type: 'OPTICAL',
      token: '[OPTICAL_FLOW]',
      message: 'Frame #4027: Road clear, 0 anomalies, vector flow stable (dx: +0.02, dy: -0.01)',
      severity: 'info'
    },
    {
      id: 2,
      time: '14:31:59.450',
      frame: 4028,
      type: 'SCENE',
      token: '[SCENE_SCAN]',
      message: 'Frame #4028: Wagholi Corridor ambient illumination 680 lux, visibility index 99.4%',
      severity: 'info'
    },
    {
      id: 3,
      time: '14:32:01.015',
      frame: 4029,
      type: 'OPTICAL',
      token: '[OPTICAL_FLOW]',
      message: 'Frame #4029: Road clear, 0 anomalies. Commuter lane velocity: 28 km/h avg',
      severity: 'info'
    },
    {
      id: 4,
      time: '14:32:03.220',
      frame: 4030,
      type: 'DETECTION',
      token: '[DETECTION]',
      message: 'Frame #4030: Vehicle class 4 (HCV) approaching boundary (x: 480, y: 140, w: 84, h: 42)',
      severity: 'warning'
    },
    {
      id: 5,
      time: '14:32:04.780',
      frame: 4031,
      type: 'DETECTION',
      token: '[GEOFENCE]',
      message: 'Frame #4031: Evaluating distance to Sector-B hazard polygon: 12.8m remaining',
      severity: 'warning'
    }
  ]);

  // Handle continuous relative scan timer
  useEffect(() => {
    const timer = setInterval(() => {
      setScanSecondsAgo((prev) => {
        if (prev >= 4) return 0; // resets every 4 seconds to simulate fresh scan cycle
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Periodic simulated optical frame telemetry generator
  useEffect(() => {
    const logInterval = setInterval(() => {
      setLogs((prevLogs) => {
        // Keep max 35 logs to prevent memory bloat
        const trimmed = prevLogs.slice(-30);
        const nextFrame = (trimmed[trimmed.length - 1]?.frame || 4035) + 1;
        const now = new Date();
        const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;

        let newEntry;
        if (isViolationActive) {
          // Violation-related stream token
          const tokens = [
            {
              type: 'VIOLATION',
              token: '[BREACH_EVAL]',
              message: `Frame #${nextFrame}: Sector-B geofence breach sustained. Plate MH-12-Q-4029 lock active`,
              severity: 'error'
            },
            {
              type: 'DETECTION',
              token: '[AI_TRACK]',
              message: `Frame #${nextFrame}: YOLO-Civic-v11 tracking vector locked at (x: 360, y: 275). Speed: 38 km/h`,
              severity: 'warning'
            },
            {
              type: 'DETECTION',
              token: '[ANPR_STREAM]',
              message: `Frame #${nextFrame}: ANPR confidence score: 96.8% (HCV Multi-Axle)`,
              severity: 'warning'
            }
          ];
          newEntry = {
            id: Date.now() + Math.random(),
            time: timeStr,
            frame: nextFrame,
            ...tokens[Math.floor(Math.random() * tokens.length)]
          };
        } else {
          // Normal optical ambient tokens
          const ambientTokens = [
            {
              type: 'OPTICAL',
              token: '[OPTICAL_FLOW]',
              message: `Frame #${nextFrame}: Road clear, 0 anomalies, vector delta within baseline`,
              severity: 'info'
            },
            {
              type: 'SCENE',
              token: '[FRAME_PASS]',
              message: `Frame #${nextFrame}: Sector-B geofence barrier verified. 0 unauthorized heavy vehicles`,
              severity: 'info'
            },
            {
              type: 'OPTICAL',
              token: '[TRACK_PASS]',
              message: `Frame #${nextFrame}: Commuter vehicles: 2 passing in outer safe lane`,
              severity: 'info'
            }
          ];
          newEntry = {
            id: Date.now() + Math.random(),
            time: timeStr,
            frame: nextFrame,
            ...ambientTokens[Math.floor(Math.random() * ambientTokens.length)]
          };
        }

        return [...trimmed, newEntry];
      });
    }, 2800);

    return () => clearInterval(logInterval);
  }, [isViolationActive]);

  // Append critical violation logs when simStep changes or violation activates
  useEffect(() => {
    if (simStep === 2) {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now(),
          time: timeStr,
          frame: 4032,
          type: 'VIOLATION',
          token: '[RULE_BREACH]',
          message: '🚨 Frame #4032: Geofence Sector-B entered by Heavy Dumper Truck (MH-12-Q-4029)',
          severity: 'error'
        }
      ]);
    } else if (simStep === 3) {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          time: timeStr,
          frame: 4033,
          type: 'VIOLATION',
          token: '[INCIDENT_CONFIRM]',
          message: '🚨 Frame #4033: Violation confirmed under Rule #09: Daytime Heavy Vehicle Ban (Confidence: 94%)',
          severity: 'error'
        },
        {
          id: Date.now() + 2,
          time: timeStr,
          frame: 4034,
          type: 'VIOLATION',
          token: '[EVIDENCE_SNAP]',
          message: '📸 Frame #4034: Dual-frame snap triggered (EV-01: Wide Angle, EV-02: Plate Crop)',
          severity: 'error'
        }
      ]);
    } else if (simStep === 4) {
      const now = new Date();
      const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      setLogs((prev) => [
        ...prev,
        {
          id: Date.now() + 3,
          time: timeStr,
          frame: 4035,
          type: 'VIOLATION',
          token: '[TICKET_DISPATCH]',
          message: '⚡ Frame #4035: Autonomous Incident Ticket INC-2026-PUNE-0042 compiled and forwarded to Investigation Pipeline',
          severity: 'error'
        }
      ]);
    }
  }, [simStep]);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    if (autoScroll && terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const copyTelemetryLogs = () => {
    const text = logs.map(l => `${l.time} [Frame #${l.frame}] ${l.token} ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredLogs = logs.filter((log) => {
    if (filterType === 'OPTICAL') return log.type === 'OPTICAL';
    if (filterType === 'DETECTION') return log.type === 'DETECTION';
    if (filterType === 'VIOLATION') return log.type === 'VIOLATION';
    return true;
  });

  return (
    <div 
      className={`surveillance-telemetry-container ${className}`}
      style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid rgba(15, 23, 42, 0.1)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}
    >
      {/* 1. Header with Status Indicators */}
      <div 
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          paddingBottom: '16px',
          borderBottom: '1px solid rgba(15, 23, 42, 0.08)'
        }}
      >
        {/* Left Side: CCTV & Agent Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {/* CCTV Online Badge */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 10px',
              borderRadius: '20px',
              background: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <span 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 6px #10B981'
              }} 
            />
            CCTV ONLINE
          </div>

          {/* Surveillance Agent ACTIVE */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              borderRadius: '20px',
              background: '#EEF2FF',
              border: '1px solid #C7D2FE',
              color: '#3730A3',
              fontSize: '12px',
              fontWeight: 700
            }}
          >
            <span 
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4F46E5',
                boxShadow: '0 0 8px rgba(79, 70, 229, 0.6)',
                animation: 'pulse 1.5s infinite'
              }} 
            />
            🧠 Surveillance Agent ACTIVE
          </div>

          {/* Location Badge */}
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '20px',
              background: '#F8FAFC',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              color: '#334155',
              fontSize: '12px',
              fontWeight: 600
            }}
          >
            <MapPin size={13} color="#0E5E3A" />
            Monitoring: Wagholi Restricted Zone
          </div>
        </div>

        {/* Right Side: Dynamic Last Scan Counter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '6px',
              background: '#F1F5F9',
              color: '#64748B',
              fontSize: '11px',
              fontWeight: 600
            }}
          >
            <Clock size={12} />
            <span>
              Last scan:{' '}
              <strong style={{ color: '#0F172A' }}>
                {scanSecondsAgo === 0 ? 'Just now' : `${scanSecondsAgo} sec ago`}
              </strong>
            </span>
          </div>

          <div 
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px',
              background: '#E8F7F0',
              color: '#0E5E3A',
              fontSize: '11px',
              fontWeight: 700
            }}
          >
            <Activity size={12} />
            Latency: 18ms
          </div>
        </div>
      </div>

      {/* 2. Four AI Status Indicators */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '12px'
        }}
      >
        {/* Indicator 1: Scene Analysis (Continuous Optical Flow) */}
        <div 
          style={{
            background: '#F8FAFC',
            borderRadius: '12px',
            border: '1px solid rgba(15, 23, 42, 0.08)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 6px #10B981'
                }} 
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Scene Analysis
              </span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: '#ECFDF5', color: '#065F46' }}>
              30 FPS
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#047857' }}>
            Continuous Optical Flow
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
            Farneback vector tracking active • 0 frame jitter • MOG2 background subtraction clean.
          </div>
        </div>

        {/* Indicator 2: Rule Monitoring (Rule #09: Heavy Vehicle Ban) */}
        <div 
          style={{
            background: isViolationActive ? '#FEF2F2' : '#F8FAFC',
            borderRadius: '12px',
            border: isViolationActive ? '1px solid #FCA5A5' : '1px solid rgba(15, 23, 42, 0.08)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isViolationActive ? '#EF4444' : '#10B981',
                  boxShadow: `0 0 6px ${isViolationActive ? '#EF4444' : '#10B981'}`
                }} 
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: isViolationActive ? '#991B1B' : '#0F172A' }}>
                Rule Monitoring
              </span>
            </div>
            <span 
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: isViolationActive ? '#FEE2E2' : '#E8F7F0',
                color: isViolationActive ? '#991B1B' : '#0E5E3A'
              }}
            >
              {isViolationActive ? 'BREACH ACTIVE' : 'ENFORCING'}
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: isViolationActive ? '#DC2626' : '#0E5E3A' }}>
            Rule #09: Heavy Vehicle Ban
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
            {isViolationActive 
              ? 'Unauthorized Heavy Commercial Truck in Wagholi Sector-B geofence.' 
              : 'Active restriction window (08:00 - 20:00). HCVs >3.5T prohibited.'}
          </div>
        </div>

        {/* Indicator 3: Evidence Capture (Dual-Frame Auto-Snap) */}
        <div 
          style={{
            background: isViolationActive ? '#FFFBEB' : '#F8FAFC',
            borderRadius: '12px',
            border: isViolationActive ? '1px solid #FDE68A' : '1px solid rgba(15, 23, 42, 0.08)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isViolationActive ? '#F59E0B' : '#10B981',
                  boxShadow: `0 0 6px ${isViolationActive ? '#F59E0B' : '#10B981'}`
                }} 
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Evidence Capture
              </span>
            </div>
            <span 
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: isViolationActive ? '#FEF3C7' : '#ECFDF5',
                color: isViolationActive ? '#92400E' : '#065F46'
              }}
            >
              {isViolationActive ? 'CAPTURED' : 'STANDBY'}
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#D97706' }}>
            Dual-Frame Auto-Snap
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
            {isViolationActive
              ? 'Package ready: EV-01 (110° Wide Angle) + EV-02 (ANPR Optical Crop).'
              : 'Dual trigger ready: Contextual wide corridor frame + ANPR plate crop.'}
          </div>
        </div>

        {/* Indicator 4: Incident Detection (Confidence Scoring) */}
        <div 
          style={{
            background: isViolationActive ? '#EEF2FF' : '#F8FAFC',
            borderRadius: '12px',
            border: isViolationActive ? '1px solid #C7D2FE' : '1px solid rgba(15, 23, 42, 0.08)',
            padding: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span 
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isViolationActive ? '#4F46E5' : '#10B981',
                  boxShadow: `0 0 6px ${isViolationActive ? '#4F46E5' : '#10B981'}`
                }} 
              />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                Incident Detection
              </span>
            </div>
            <span 
              style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: isViolationActive ? '#E0E7FF' : '#ECFDF5',
                color: isViolationActive ? '#3730A3' : '#065F46'
              }}
            >
              {isViolationActive ? '94% CONF' : 'NOMINAL'}
            </span>
          </div>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#4F46E5' }}>
            Confidence Scoring
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', lineHeight: '1.4' }}>
            {isViolationActive 
              ? 'YOLO-Civic-v11 scored 94.2% match against municipal violation criteria.' 
              : 'Model threshold: 85% • Continuous tensor inference at 18ms latency.'}
          </div>
        </div>
      </div>

      {/* 3. Live Rolling Telemetry Log (Terminal Style) */}
      <div 
        style={{
          background: '#0B1914',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.4)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Terminal Header */}
        <div 
          style={{
            background: '#132A22',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          {/* Left: Terminal Dots & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#EF4444' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#F59E0B' }} />
              <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#10B981' }} />
            </div>
            <span 
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                color: '#E2E8F0',
                letterSpacing: '0.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Terminal size={13} color="#10B981" />
              SURVEILLANCE_AGENT_V11_STREAM.LOG
            </span>
          </div>

          {/* Right: Filter Pills & Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Filter buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              {['ALL', 'OPTICAL', 'DETECTION', 'VIOLATION'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilterType(tab)}
                  style={{
                    background: filterType === tab ? 'rgba(16, 185, 129, 0.25)' : 'transparent',
                    border: filterType === tab ? '1px solid #10B981' : '1px solid transparent',
                    color: filterType === tab ? '#6EE7B7' : '#94A3B8',
                    borderRadius: '4px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Auto-scroll toggle */}
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              title={autoScroll ? "Pause autoscroll" : "Enable autoscroll"}
              style={{
                background: autoScroll ? 'rgba(255, 255, 255, 0.08)' : 'rgba(239, 68, 68, 0.2)',
                border: 'none',
                color: autoScroll ? '#E2E8F0' : '#FCA5A5',
                borderRadius: '4px',
                padding: '3px 6px',
                fontSize: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              {autoScroll ? <Pause size={10} /> : <Play size={10} />}
              {autoScroll ? 'Scroll' : 'Paused'}
            </button>

            {/* Copy button */}
            <button
              onClick={copyTelemetryLogs}
              title="Copy telemetry log"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                color: '#CBD5E1',
                borderRadius: '4px',
                padding: '3px 6px',
                fontSize: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              {copied ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Terminal Log Output Window */}
        <div 
          style={{
            height: '180px',
            overflowY: 'auto',
            padding: '12px 14px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            lineHeight: '1.6',
            color: '#CBD5E1',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}
        >
          {filteredLogs.map((log) => {
            let tokenColor = '#38BDF8'; // cyan for optical
            let rowBg = 'transparent';
            if (log.severity === 'error') {
              tokenColor = '#F87171'; // red
              rowBg = 'rgba(239, 68, 68, 0.12)';
            } else if (log.severity === 'warning') {
              tokenColor = '#FBBF24'; // amber
              rowBg = 'rgba(245, 158, 11, 0.08)';
            } else if (log.token === '[OPTICAL_FLOW]') {
              tokenColor = '#34D399'; // green
            }

            return (
              <div 
                key={log.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  background: rowBg,
                  padding: '2px 4px',
                  borderRadius: '4px'
                }}
              >
                <span style={{ color: '#64748B', userSelect: 'none', minWidth: '78px' }}>
                  {log.time}
                </span>
                <span style={{ color: tokenColor, fontWeight: 700, minWidth: '105px' }}>
                  {log.token}
                </span>
                <span style={{ color: log.severity === 'error' ? '#FECACA' : '#E2E8F0', flex: 1 }}>
                  {log.message}
                </span>
              </div>
            );
          })}
          <div ref={terminalEndRef} />
        </div>
      </div>
    </div>
  );
}
