import React from 'react';
import { Check, Clock, UserCheck, Wrench, ShieldCheck, Sparkles } from 'lucide-react';

/**
 * 6-Stage Human-Readable Citizen Visual Journey Timeline
 * Replaces cryptic "Pending" statuses with complete transparent progression.
 */
export default function VisualJourneyTimeline({
  status = 'IN_PROGRESS',
  createdAt = 'Sep 16, 09:30 AM',
  officerName = 'Er. Sanjay Sharma (AEE)',
  department = 'Delhi Jal Board (DJB)'
}) {
  // Map internal status to 6 journey stages
  const stages = [
    {
      id: 'submitted',
      label: 'Submitted',
      desc: 'Received via voice/text',
      icon: Check,
      time: createdAt,
      isPassed: true,
      isCurrent: false
    },
    {
      id: 'ai_analysed',
      label: 'AI Analysed',
      desc: 'Extracted context & severity',
      icon: Sparkles,
      time: '1 min after',
      isPassed: true,
      isCurrent: false
    },
    {
      id: 'assigned',
      label: 'Assigned',
      desc: `Routed to ${department}`,
      icon: UserCheck,
      time: '45 mins after',
      isPassed: status !== 'SUBMITTED',
      isCurrent: status === 'SUBMITTED' || status === 'TRIAGED'
    },
    {
      id: 'officer_reviewing',
      label: 'Officer Reviewing',
      desc: officerName,
      icon: Clock,
      time: 'In progress',
      isPassed: status === 'IN_PROGRESS' || status === 'RESOLVED' || status === 'CLOSED',
      isCurrent: status === 'IN_PROGRESS' || status === 'UNDER_REVIEW' || status === 'INFO_REQUESTED'
    },
    {
      id: 'action_initiated',
      label: 'Action Initiated',
      desc: 'Field squad mobilized',
      icon: Wrench,
      time: status === 'RESOLVED' || status === 'CLOSED' ? 'Completed' : 'Expected today',
      isPassed: status === 'RESOLVED' || status === 'CLOSED',
      isCurrent: status === 'IN_PROGRESS'
    },
    {
      id: 'citizen_verification',
      label: 'Citizen Verification',
      desc: 'Resident confirms fix',
      icon: ShieldCheck,
      time: status === 'RESOLVED' || status === 'CLOSED' ? 'Awaiting your review' : 'Pending resolution',
      isPassed: status === 'CLOSED',
      isCurrent: status === 'RESOLVED'
    }
  ];

  return (
    <div style={{ padding: '20px', background: '#FFFFFF', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)' }}>
          Resolution Journey
        </span>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)' }}>
          Live Step-by-Step Transparency
        </span>
      </div>

      {/* Horizontal / Responsive Stepper */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
        gap: '12px',
        position: 'relative'
      }}>
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = stage.isPassed;
          const isNow = stage.isCurrent;

          let badgeBg = '#F1F5F9';
          let badgeColor = '#94A3B8';
          let borderColor = 'transparent';

          if (isDone) {
            badgeBg = '#ECFDF5';
            badgeColor = '#065F46';
          }
          if (isNow) {
            badgeBg = '#0E5E3A';
            badgeColor = '#FFFFFF';
            borderColor = 'rgba(14, 94, 58, 0.3)';
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
    </div>
  );
}
