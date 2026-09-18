import React from 'react';
import { Check, Clock, UserCheck, Wrench, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

/**
 * 6-Stage Human-Readable Citizen Visual Journey Timeline
 * Replaces cryptic "Pending" statuses with complete transparent progression.
 * Light, modern, beautiful design with connected progress bar and stage status cards.
 */
export default function VisualJourneyTimeline({
  status = 'IN_PROGRESS',
  createdAt = 'Recently',
  officerName = 'Dr. K. S. Tyagi',
  department = 'Municipal Corporation of Delhi'
}) {
  // Map internal status to 6 journey stages
  const stages = [
    {
      id: 'submitted',
      label: 'Submitted',
      desc: 'Received via portal',
      icon: Check,
      time: createdAt || '18/9/2026, 12:47 am',
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
      desc: `Routed to ${department?.replace('Municipal Corporation of Delhi', 'MCD') || 'MCD'}`,
      icon: UserCheck,
      time: status === 'INGESTED' ? 'In queue' : 'Assigned',
      isPassed: status !== 'INGESTED' && status !== 'SUBMITTED',
      isCurrent: status === 'INGESTED' || status === 'TRIAGED'
    },
    {
      id: 'officer_reviewing',
      label: 'Officer Reviewing',
      desc: officerName || 'Dr. K. S. Tyagi',
      icon: Clock,
      time: status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' ? 'Inspected' : (status === 'IN_PROGRESS' ? 'Under Review' : 'Pending'),
      isPassed: status === 'IN_PROGRESS' || status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' || status === 'CLOSED',
      isCurrent: status === 'UNDER_REVIEW' || status === 'INFO_REQUESTED'
    },
    {
      id: 'action_initiated',
      label: 'Action Initiated',
      desc: 'Field squad mobilized',
      icon: Wrench,
      time: status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' || status === 'CLOSED' ? 'Completed' : (status === 'IN_PROGRESS' ? 'In Progress' : 'Queued'),
      isPassed: status === 'RESOLVED' || status === 'RESOLVED_CONFIRMED' || status === 'CLOSED',
      isCurrent: status === 'IN_PROGRESS'
    },
    {
      id: 'citizen_verification',
      label: 'Citizen Verification',
      desc: status === 'RESOLVED_CONFIRMED' ? 'Verified by resident' : (status === 'DISPUTE_REOPENED' ? 'Dispute under review' : 'Resident confirms fix'),
      time: status === 'RESOLVED_CONFIRMED' ? 'Verified & Closed' : (status === 'RESOLVED' ? 'Awaiting your review' : (status === 'DISPUTE_REOPENED' ? 'Reopened by citizen' : 'Final Step')),
      icon: ShieldCheck,
      isPassed: status === 'RESOLVED_CONFIRMED' || status === 'CLOSED',
      isCurrent: status === 'RESOLVED' || status === 'DISPUTE_REOPENED'
    }
  ];

  // Calculate current completion percentage
  const completedCount = stages.filter(s => s.isPassed).length;
  const currentIdx = stages.findIndex(s => s.isCurrent);
  const progressPercent = Math.min(100, Math.round(((completedCount + (currentIdx !== -1 ? 0.5 : 0)) / stages.length) * 100));

  return (
    <div style={{
      background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)',
      borderRadius: '18px',
      border: '1.5px solid #E2E8F0',
      padding: '24px',
      boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)'
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.01em' }}>
                Resolution Journey
              </h3>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#ECFDF5',
                color: '#059669',
                border: '1px solid #A7F3D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                Live Step-by-Step Transparency
              </span>
            </div>
          </div>
        </div>

        {/* Progress Metric Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Overall Progress</span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7' }}>{progressPercent}% Completed</div>
          </div>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: '#F1F5F9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <svg style={{ width: '42px', height: '42px', transform: 'rotate(-90deg)' }}>
              <circle cx="21" cy="21" r="17" fill="none" stroke="#E2E8F0" strokeWidth="3.5" />
              <circle
                cx="21"
                cy="21"
                r="17"
                fill="none"
                stroke="#0284C7"
                strokeWidth="3.5"
                strokeDasharray="106.8"
                strokeDashoffset={106.8 - (106.8 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <span style={{ position: 'absolute', fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>
              {completedCount}/6
            </span>
          </div>
        </div>
      </div>

      {/* Progress Track Line */}
      <div style={{ width: '100%', height: '4px', background: '#E2E8F0', borderRadius: '999px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{
          width: `${progressPercent}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #10B981 0%, #0284C7 100%)',
          borderRadius: '999px',
          transition: 'width 0.4s ease'
        }} />
      </div>

      {/* 6 Stage Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        position: 'relative'
      }}>
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = stage.isPassed;
          const isNow = stage.isCurrent;

          // Distinct beautiful light color card styles
          let cardBg = '#FFFFFF';
          let borderColor = '#E2E8F0';
          let iconBg = '#F1F5F9';
          let iconColor = '#64748B';
          let badgeBg = '#F8FAFC';
          let badgeColor = '#64748B';
          let boxShadow = '0 1px 3px rgba(0,0,0,0.02)';

          if (isDone) {
            cardBg = '#FFFFFF';
            borderColor = '#BBF7D0';
            iconBg = 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)';
            iconColor = '#059669';
            badgeBg = '#ECFDF5';
            badgeColor = '#047857';
            boxShadow = '0 2px 8px rgba(16, 185, 129, 0.08)';
          } else if (isNow) {
            cardBg = 'linear-gradient(180deg, #F0F9FF 0%, #FFFFFF 100%)';
            borderColor = '#38BDF8';
            iconBg = 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)';
            iconColor = '#FFFFFF';
            badgeBg = '#E0F2FE';
            badgeColor = '#0369A1';
            boxShadow = '0 4px 16px rgba(2, 132, 199, 0.15), 0 0 0 1px #38BDF8';
          }

          return (
            <div
              key={stage.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '14px',
                borderRadius: '14px',
                background: cardBg,
                border: `1.5px solid ${borderColor}`,
                boxShadow: boxShadow,
                position: 'relative',
                transition: 'all 0.2s ease'
              }}
            >
              {/* Card Top: Avatar & Number */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '10px',
                  background: iconBg,
                  color: iconColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isNow ? '0 2px 8px rgba(2, 132, 199, 0.3)' : 'none'
                }}>
                  <Icon style={{ width: '15px', height: '15px' }} />
                </div>
                <span style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 700,
                  color: isNow ? '#0284C7' : (isDone ? '#059669' : '#94A3B8'),
                  background: badgeBg,
                  padding: '1px 6px',
                  borderRadius: '6px'
                }}>
                  0{idx + 1}
                </span>
              </div>

              {/* Title & Description */}
              <strong style={{
                fontSize: '13px',
                fontWeight: 700,
                color: isNow ? '#0369A1' : '#0F172A',
                marginBottom: '4px',
                lineHeight: 1.3
              }}>
                {stage.label}
              </strong>
              <p style={{
                fontSize: '11.5px',
                color: '#475569',
                lineHeight: 1.35,
                margin: '0 0 10px 0',
                flex: 1
              }}>
                {stage.desc}
              </p>

              {/* Status Time Pill */}
              <div style={{
                fontSize: '10.5px',
                fontWeight: 600,
                color: badgeColor,
                background: badgeBg,
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                width: 'fit-content'
              }}>
                {isDone && <Check size={11} strokeWidth={3} />}
                {isNow && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0284C7', animation: 'pulse 1.5s infinite' }} />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '120px' }}>
                  {stage.time}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

