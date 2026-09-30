import React from 'react';
import { Check, Clock, UserCheck, Wrench, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * 6-Stage Human-Readable Citizen Visual Journey Timeline
 * Replaces cryptic "Pending" statuses with complete transparent progression.
 */
export default function VisualJourneyTimeline({
  status = 'IN_PROGRESS',
  createdAt = 'Recently',
  officerName = 'Duty Executive Engineer',
  department = 'Municipal Corporation of Delhi'
}) {
  // Map internal status to 6 journey stages
  const stages = [
    {
      id: 'submitted',
      label: 'Submitted',
      desc: 'Received via portal',
      icon: Check,
      time: createdAt,
      isPassed: true,
      isCurrent: false
    },
    {
      id: 'ai_analysed',
      label: 'AI Analysed',
      desc: 'Extracted context & DNA',
      icon: Sparkles,
      time: 'Completed',
      isPassed: true,
      isCurrent: false
    },
    {
      id: 'assigned',
      label: 'Assigned',
      desc: `Routed to ${department}`,
      icon: UserCheck,
      time: status === 'INGESTED' ? 'In queue' : 'Assigned',
      isPassed: status !== 'INGESTED' && status !== 'SUBMITTED',
      isCurrent: status === 'INGESTED' || status === 'TRIAGED'
    },
    {
      id: 'officer_reviewing',
      label: 'Officer Reviewing',
      desc: officerName || 'Duty Engineer',
      icon: Clock,
      time: status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' ? 'Inspected' : 'In progress',
      isPassed: status === 'IN_PROGRESS' || status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' || status === 'CLOSED',
      isCurrent: status === 'IN_PROGRESS' || status === 'UNDER_REVIEW' || status === 'INFO_REQUESTED'
    },
    {
      id: 'action_initiated',
      label: 'Action Initiated',
      desc: 'Field squad mobilized',
      icon: Wrench,
      time: status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' || status === 'CLOSED' ? 'Completed' : 'Mobilized',
      isPassed: status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' || status === 'CLOSED',
      isCurrent: status === 'IN_PROGRESS'
    },
    {
      id: 'citizen_verification',
      label: 'Citizen Verification',
      desc: status === 'RESOLVED_CONFIRMED' ? 'Verified by you' : (status === 'DISPUTE_REOPENED' ? 'Dispute under review' : 'Resident confirms fix'),
      icon: ShieldCheck,
      time: status === 'RESOLVED_CONFIRMED' ? 'Verified & Closed' : (status === 'RESOLVED' ? 'Awaiting your review' : (status === 'DISPUTE_REOPENED' ? 'Reopened by citizen' : 'Pending resolution')),
      isPassed: status === 'RESOLVED_CONFIRMED' || status === 'CLOSED',
      isCurrent: status === 'RESOLVED' || status === 'DISPUTE_REOPENED'
    }
  ];

  return (
    <div style={{ padding: 'clamp(14px, 3vw, 20px)', background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
          Resolution Journey
        </span>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)' }}>
          Live Step-by-Step Transparency
        </span>
      </div>

      {/* Desktop Stepper (>= 768px) */}
      <div className="vj-timeline-desktop">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = stage.isPassed;
          const isNow = stage.isCurrent;

          let badgeBg = '#F1F5F9';
          let badgeColor = '#94A3B8';

          if (isDone) {
            badgeBg = '#ECFDF5';
            badgeColor = '#065F46';
          }
          if (isNow) {
            badgeBg = '#0E5E3A';
            badgeColor = '#FFFFFF';
          }

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                background: isNow ? '#F8FDF9' : '#F8F9FA',
                border: isNow ? '1px solid #10B981' : '1px solid var(--color-border-subtle)',
                position: 'relative'
              }}
            >
              {/* Top Node Indicator */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
                <div style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: badgeBg,
                  color: badgeColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isNow ? '0 0 0 3px rgba(16, 185, 129, 0.2)' : 'none'
                }}>
                  <Icon style={{ width: '13px', height: '13px' }} />
                </div>
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                  0{idx + 1}
                </span>
              </div>

              {/* Title & Detail */}
              <strong style={{ fontSize: '12px', color: isNow ? 'var(--color-primary)' : 'var(--color-text-primary)', marginBottom: '2px' }}>
                {stage.label}
              </strong>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.3, marginBottom: '6px' }}>
                {stage.desc}
              </p>
              <span style={{ fontSize: '10px', color: isNow ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: isNow ? 600 : 400, marginTop: 'auto' }}>
                {stage.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Vertical Stepper with Continuous Connector Line (< 768px) */}
      <div className="vj-timeline-mobile">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = stage.isPassed;
          const isNow = stage.isCurrent;
          const isLast = idx === stages.length - 1;

          let badgeBg = '#F1F5F9';
          let badgeColor = '#94A3B8';

          if (isDone) {
            badgeBg = '#ECFDF5';
            badgeColor = '#065F46';
          }
          if (isNow) {
            badgeBg = '#0E5E3A';
            badgeColor = '#FFFFFF';
          }

          return (
            <div key={stage.id} className="vj-mobile-step">
              {/* Rail with Node and Connecting Line */}
              <div className="vj-mobile-rail">
                <div
                  className="vj-mobile-node"
                  style={{
                    background: badgeBg,
                    color: badgeColor,
                    boxShadow: isNow ? '0 0 0 3px rgba(16, 185, 129, 0.25)' : 'none'
                  }}
                >
                  <Icon style={{ width: '15px', height: '15px' }} />
                </div>
                {!isLast && (
                  <div
                    className={`vj-mobile-connector ${isDone ? 'active' : ''}`}
                    style={{
                      height: 'calc(100% - 24px)',
                      top: '28px'
                    }}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className={`vj-mobile-content ${isNow ? 'current' : ''}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <strong style={{ fontSize: '13px', color: isNow ? 'var(--color-primary)' : 'var(--color-text-primary)' }}>
                    {stage.label}
                  </strong>
                  <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)', background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>
                    0{idx + 1}
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.4, margin: '0 0 6px 0' }}>
                  {stage.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', flexWrap: 'wrap', gap: '4px' }}>
                  <span style={{ color: isNow ? 'var(--color-primary)' : 'var(--color-text-muted)', fontWeight: isNow ? 600 : 400 }}>
                    {stage.time}
                  </span>
                  {isDone && (
                    <span style={{ color: '#059669', fontSize: '10px', fontWeight: 700 }}>
                      ✓ Completed
                    </span>
                  )}
                  {isNow && (
                    <span style={{ color: '#0E5E3A', fontSize: '10px', fontWeight: 700, background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px' }}>
                      ● Current Stage
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
