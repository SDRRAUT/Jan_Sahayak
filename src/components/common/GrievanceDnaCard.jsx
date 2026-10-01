import React, { useState } from 'react';
import { 
  Dna,
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Edit3, 
  X, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  Wrench,
  Clock,
  Layers,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import WhyExplainer from './WhyExplainer';

/**
 * Modern AI Analysis Panel (Signature Screen — Grievance DNA™)
 * Light, modern, beautiful design with high contrast, light color cards, and interactive metrics.
 */
export default function GrievanceDnaCard({ dna, isDark = false, compact = false, onAccept, onModify, onReject }) {
  const [showReasoning, setShowReasoning] = useState(true);
  const [actionState, setActionState] = useState(null); // 'ACCEPTED' | 'MODIFIED' | 'REJECTED' | null
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(null);

  if (!dna) return null;

  const category = dna.category || 'Solid Waste & Hazardous Burning';
  const department = dna.department || 'Municipal Corporation of Delhi (MCD)';
  const ward = dna.ward || 'Ward 22 (Mayur Vihar Ph-1)';
  const urgencyScore = dna.urgencyScore || 91;
  const confidence = dna.confidence || 97;
  const duplicateCount = dna.clusterCount || dna.duplicateCount || 11;
  const recommendation = dna.recommendedAction || 'Emergency mechanized clearance & thermal imaging inspection';
  const estTime = dna.estTime || '4-6 hours';
  const historicalSuccess = dna.historicalSuccess || '94%';

  const reasons = dna.reasons || [
    'Toxic smoke plume detected within 100m of residential towers & schools',
    'Recurring open dumping logged 4 times in 30 days without scheduled pickup',
    'High wind conditions accelerating air quality deterioration in local pocket',
    'Corridor clustering matches secondary overflow pattern across Mayur Vihar'
  ];

  const handleAction = (type) => {
    setActionState(type);
    if (type === 'ACCEPTED' && onAccept) onAccept();
    if (type === 'MODIFIED' && onModify) onModify();
    if (type === 'REJECTED' && onReject) onReject();
  };

  return (
    <div
      style={{
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1.5px solid #E2E8F0',
        boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
        transition: 'all 200ms ease'
      }}
    >
      {/* Top Banner Header: Grievance DNA™ & Confidence */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #EFF6FF 100%)',
        borderBottom: '1.5px solid #E2E8F0',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
            flexShrink: 0
          }}>
            <Dna style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '13.5px', letterSpacing: '-0.01em', color: '#0F172A' }}>
                PROBLEM SUMMARY (AI)
              </span>
              <span style={{ fontSize: '10.5px', color: '#0284C7', background: '#E0F2FE', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>AI Match</span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>
              Auto-matched from citizen photos & complaints
            </span>
          </div>
        </div>

        {/* Confidence Ring / Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '999px',
          background: '#ECFDF5',
          border: '1px solid #A7F3D0',
          color: '#059669'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }} />
          <span style={{ fontSize: '11.5px', fontWeight: 700 }}>
            AI Accuracy: {confidence}%
          </span>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 1. Category / Department / Location 3-Box Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}>
          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
              Category
            </span>
            <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block', lineHeight: 1.3 }}>
              {category}
            </strong>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
              Department
            </span>
            <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block', lineHeight: 1.3 }}>
              {department}
            </strong>
          </div>

          <div style={{
            padding: '12px',
            borderRadius: '12px',
            background: '#F8FAFC',
            border: '1.5px solid #E2E8F0'
          }}>
            <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
              Location
            </span>
            <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block', lineHeight: 1.3 }}>
              {ward.split('(')[0].trim()}
            </strong>
          </div>
        </div>

        {/* 2. Urgency Score Bar */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #FEF2F2 0%, #FFF5F5 100%)',
          border: '1.5px solid #FECACA'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              URGENCY INDEX
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', fontFamily: 'var(--font-mono, monospace)' }}>
                {urgencyScore}/100
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#EF4444',
                color: '#FFFFFF'
              }}>
                CRITICAL
              </span>
            </div>
          </div>

          <div style={{
            width: '100%',
            height: '7px',
            background: '#FEE2E2',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${urgencyScore}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
              borderRadius: '999px',
              transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>
        </div>

        {/* 3. AI Reasoning (Collapsible Accordion) */}
        <div style={{
          borderRadius: '14px',
          border: '1.5px solid #E2E8F0',
          overflow: 'hidden'
        }}>
          <button
            type="button"
            onClick={() => setShowReasoning(!showReasoning)}
            style={{
              width: '100%',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#F8FAFC',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Why AI Suggests This (Key Reasons)</span>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 500 }}>({reasons.length} clear points)</span>
            </span>
            {showReasoning ? <ChevronUp style={{ width: '16px', height: '16px', color: '#64748B' }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: '#64748B' }} />}
          </button>

          {showReasoning && (
            <div style={{ padding: '12px 16px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reasons.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#334155', lineHeight: 1.45 }}>
                  <span style={{ color: '#0284C7', fontWeight: 800, marginTop: '1px' }}>•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Duplicate Cluster & Similar Complaints */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
          border: '1.5px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '10px',
              background: '#F59E0B',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(245, 158, 11, 0.3)'
            }}>
              <Layers style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                {duplicateCount} Neighbor Complaints Grouped Together
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                {Array.from({ length: Math.min(duplicateCount, 11) }).map((_, idx) => (
                  <span
                    key={idx}
                    onMouseEnter={() => setActiveAvatarIndex(idx)}
                    onMouseLeave={() => setActiveAvatarIndex(null)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: idx < 3 ? '#EF4444' : '#F59E0B',
                      display: 'inline-block',
                      cursor: 'pointer',
                      transform: activeAvatarIndex === idx ? 'scale(1.4)' : 'scale(1)',
                      transition: 'transform 100ms ease'
                    }}
                    title={`Signal #${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#B45309', cursor: 'pointer' }}>
            See All Reports →
          </span>
        </div>

        {/* 5. AI Recommendation Box with Accept / Modify / Reject */}
        <div style={{
          padding: '16px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
          border: '1.5px solid #A7F3D0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '8px',
              background: '#059669',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles style={{ width: '13px', height: '13px' }} />
            </div>
            <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Suggested Next Action For Your Crew
            </span>
          </div>

          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#064E3B', marginBottom: '6px', lineHeight: 1.35 }}>
            {recommendation}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px', color: '#047857', marginBottom: '14px', flexWrap: 'wrap' }}>
            <span>Worked Before: <strong>{historicalSuccess} success rate</strong></span>
            <span>•</span>
            <span>Estimated Fix Time: <strong>{estTime}</strong></span>
          </div>

          {/* Action Feedback or Buttons */}
          {actionState ? (
            <div style={{
              padding: '10px 14px',
              borderRadius: '10px',
              background: actionState === 'ACCEPTED' ? '#DCFCE7' : actionState === 'MODIFIED' ? '#FEF3C7' : '#FEE2E2',
              color: actionState === 'ACCEPTED' ? '#166534' : actionState === 'MODIFIED' ? '#92400E' : '#991B1B',
              fontSize: '12.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                <span>
                  {actionState === 'ACCEPTED' && 'Action approved! Field repair crew has been notified.'}
                  {actionState === 'MODIFIED' && 'Plan updated with your notes.'}
                  {actionState === 'REJECTED' && 'Suggestion declined. Case marked for manual officer review.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActionState(null)}
                style={{ fontSize: '11px', textDecoration: 'underline', color: 'inherit', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }}
              >
                Reset
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleAction('ACCEPTED')}
                style={{
                  height: '34px',
                  padding: '0 14px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  border: 'none',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.25)',
                  transition: 'all 120ms ease'
                }}
              >
                <Check style={{ width: '14px', height: '14px' }} />
                <span>Approve & Send Crew</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('MODIFIED')}
                style={{
                  height: '34px',
                  padding: '0 12px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  color: '#334155',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: '1.5px solid #CBD5E1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
              >
                <Edit3 style={{ width: '13px', height: '13px' }} />
                <span>Edit Plan</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('REJECTED')}
                style={{
                  height: '34px',
                  padding: '0 10px',
                  borderRadius: '8px',
                  background: 'transparent',
                  color: '#DC2626',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '13px', height: '13px' }} />
                <span>Decline Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

