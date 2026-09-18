import React from 'react';
import { History, BookOpen, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CivicMemoryCard({ memories = [] }) {
  const records = Array.isArray(memories) && memories.length > 0
    ? memories
    : (memories?.previous_incidents && memories.previous_incidents.length > 0)
      ? memories.previous_incidents
      : [
    {
      year: "2025",
      date: "14 June 2025",
      incidentId: "DJB-HIST-2025-081",
      title: "Emergency Pipe Clamp Installed (Pocket 1)",
      actionTaken: "Installed temporary metal clamp on old cast-iron pipe",
      outcome: "Stopped the leak for 7 months, but pipe cracked again nearby due to water pressure.",
      lessonsLearned: "Clamping old iron pipes without replacing the section causes another leak within a year."
    },
    {
      year: "2024",
      date: "22 March 2024",
      incidentId: "DJB-HIST-2024-412",
      title: "Tar Paved Over Sunken Road (Mother Dairy Crossing)",
      actionTaken: "Paved fresh tar over sunken road without fixing the leaking pipe below",
      outcome: "Road sank and cracked open again after 8 weeks during monsoon rain.",
      lessonsLearned: "Never pave tar over a street before fixing the leaking pipe underneath."
    }
  ];

  const warrantyStatus = memories?.warranty_info || 'No active warranty recorded';

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-subtle)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F0FDF4', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', display: 'block' }}>
              📚 STREET REPAIR HISTORY
            </span>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
              What Worked & What Failed Here Before
            </h3>
          </div>
        </div>

        <span style={{
          fontSize: '11px',
          fontWeight: 700,
          padding: '3px 10px',
          borderRadius: 'var(--radius-full)',
          background: '#F1F5F9',
          color: '#475569',
          border: '1px solid #CBD5E1'
        }}>
          {records.length} Past Repairs Found
        </span>
      </div>

      {/* Recurrence Warning Banner */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: '#FEF2F2',
        border: '1px solid #FCA5A5',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <AlertCircle style={{ width: '16px', height: '16px', color: '#DC2626', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '12.5px', color: '#991B1B', lineHeight: 1.4 }}>
          <strong>⚠️ Past Lesson Warning:</strong> Quick road surface patches on this street failed within 2 to 7 months in the past. Replacing the broken pipe section once prevents the road from sinking again and saves public money.
        </div>
      </div>

      {/* Historical Cases Timeline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {records.map((rec, idx) => (
          <div
            key={rec.incidentId || idx}
            style={{
              padding: '14px 16px',
              borderRadius: 'var(--radius-md)',
              background: '#F8FAFC',
              border: '1px solid var(--color-border-subtle)',
              borderLeft: '4px solid var(--color-primary)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                  {rec.title}
                </strong>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-text-muted)' }}>
                  ({rec.incidentId})
                </span>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-muted)' }}>
                {rec.date}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '10px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  What Was Done:
                </span>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {rec.actionTaken}
                </p>
              </div>

              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
                  What Happened After:
                </span>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  {rec.outcome}
                </p>
              </div>
            </div>

            <div style={{
              marginTop: '10px',
              paddingTop: '8px',
              borderTop: '1px solid var(--color-divider)',
              fontSize: '11.5px',
              color: 'var(--color-primary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <CheckCircle2 style={{ width: '14px', height: '14px', flexShrink: 0 }} />
              <span>Key Lesson for Officers: {rec.lessonsLearned}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Contractor / Asset Warranty Registry Status */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid var(--color-divider)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '11px',
        color: 'var(--color-text-muted)'
      }}>
        <span>Contractor Warranty Check:</span>
        <span style={{
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 'var(--radius-sm)',
          background: warrantyStatus.includes('Active') ? '#ECFDF5' : '#F8FAFC',
          color: warrantyStatus.includes('Active') ? '#065F46' : 'var(--color-text-secondary)',
          border: '1px solid var(--color-border-subtle)'
        }}>
          {warrantyStatus}
        </span>
      </div>
    </div>
  );
}
