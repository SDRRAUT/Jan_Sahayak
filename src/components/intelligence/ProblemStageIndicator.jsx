import React from 'react';
import { AlertTriangle, TrendingUp, ShieldAlert, CheckCircle2, Clock } from 'lucide-react';

export default function ProblemStageIndicator({ 
  stage = 'GROWING', 
  velocity = '+240% in 5 days', 
  signalCount = 37,
  reason = 'Signal velocity exceeded 200% with multi-department failure and acute biological hazard.'
}) {
  const STAGES = [
    { key: 'NORMAL', label: 'Normal Baseline', desc: 'Isolated weak signals', color: '#64748B' },
    { key: 'GROWING', label: 'Growing Pattern', desc: 'Frequency accelerating (+240%)', color: '#D97706' },
    { key: 'EMERGING', label: 'Emerging Crisis', desc: 'Cross-ward multi-dept spread', color: '#EA580C' },
    { key: 'CRITICAL', label: 'Critical Incident', desc: 'Severe public safety hazard', color: '#DC2626' }
  ];

  const currentIdx = STAGES.findIndex(s => s.key === stage) !== -1 
    ? STAGES.findIndex(s => s.key === stage) 
    : 1;

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-subtle)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: stage === 'CRITICAL' ? '#FEF2F2' : (stage === 'GROWING' ? '#FFFBEB' : '#F1F5F9'),
            color: stage === 'CRITICAL' ? '#DC2626' : (stage === 'GROWING' ? '#D97706' : '#64748B'),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', display: 'block' }}>
              Problem Escalation Engine
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
                Stage: <span style={{ color: STAGES[currentIdx].color }}>{STAGES[currentIdx].label}</span>
              </h3>
              <span className={`stage-pill ${stage.toLowerCase()}`}>
                ● {stage}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Velocity Trend</span>
            <strong style={{ fontSize: '14px', color: '#DC2626', fontFamily: 'var(--font-mono)' }}>{velocity}</strong>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Connected Signals</span>
            <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>{signalCount}</strong>
          </div>
        </div>
      </div>

      {/* Stage Progression Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '16px',
        position: 'relative'
      }}>
        {STAGES.map((s, idx) => {
          const isActive = idx <= currentIdx;
          const isCurrent = idx === currentIdx;

          return (
            <div
              key={s.key}
              style={{
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                background: isCurrent ? `${s.color}12` : (isActive ? '#F8FAFC' : '#F8FAFC'),
                border: isCurrent ? `2px solid ${s.color}` : '1px solid var(--color-border-subtle)',
                position: 'relative',
                transition: 'all 150ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  color: isCurrent ? s.color : (isActive ? 'var(--color-text-secondary)' : 'var(--color-text-muted)')
                }}>
                  {s.label.split(' ')[0]}
                </span>
                {isCurrent && (
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    background: s.color,
                    color: '#FFFFFF',
                    padding: '1px 6px',
                    borderRadius: '9999px'
                  }}>
                    ACTIVE
                  </span>
                )}
              </div>
              <p style={{ fontSize: '11px', color: isCurrent ? 'var(--color-text-primary)' : 'var(--color-text-muted)', lineHeight: 1.3 }}>
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Reason / Contributing Factors Box */}
      <div style={{
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        background: '#FFFBEB',
        border: '1px solid #FDE68A',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <AlertTriangle style={{ width: '16px', height: '16px', color: '#D97706', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12px', color: '#92400E', lineHeight: 1.4 }}>
          <strong>Escalation Diagnostic:</strong> {reason}
        </div>
      </div>
    </div>
  );
}
