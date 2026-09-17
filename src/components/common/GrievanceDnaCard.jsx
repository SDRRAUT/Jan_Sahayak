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
  Layers
} from 'lucide-react';
import WhyExplainer from './WhyExplainer';

/**
 * Modern AI Analysis Panel (Signature Screen — Grievance DNA™)
 * Matches the specification in MODERN_UI_UX_GUIDE.md:
 * - Confidence bar & score (96%)
 * - Category / Department / Location 3-box grid
 * - Urgency score bar (87/100 CRITICAL)
 * - Collapsible AI reasoning checklist
 * - Duplicate cluster with indicators
 * - AI recommendation with Accept / Modify / Reject actions
 */
export default function GrievanceDnaCard({ dna, isDark = false, compact = false, onAccept, onModify, onReject }) {
  const [showReasoning, setShowReasoning] = useState(true);
  const [actionState, setActionState] = useState(null); // 'ACCEPTED' | 'MODIFIED' | 'REJECTED' | null
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(null);

  if (!dna) return null;

  const category = dna.category || 'Water Supply & Contamination';
  const department = dna.department || 'Delhi Jal Board (DJB)';
  const ward = dna.ward || 'Ward 14 (Rohini Sector 14)';
  const urgencyScore = dna.urgencyScore || 87;
  const confidence = dna.confidence || 96;
  const duplicateCount = dna.clusterCount || dna.duplicateCount || 12;
  const recommendation = dna.recommendedAction || 'Full 100mm pipeline sleeve replacement recommended';
  const estTime = dna.estTime || '3-5 days';
  const historicalSuccess = dna.historicalSuccess || '89%';

  const reasons = dna.reasons || [
    '200+ households affected across contiguous 400m utility corridor',
    'Issue recurred 3 times in 60 days — surface clamp repairs proved ineffective',
    'Active primary school & community milk booth located within 150m radius',
    'SCADA sensor confirms feeder line pressure deficit of 2.4 bar'
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
        background: isDark ? 'var(--color-surface-inset-card)' : '#FFFFFF',
        color: isDark ? 'var(--color-text-inverse)' : '#111827',
        borderRadius: '12px',
        border: isDark ? '1px solid #1F2937' : '1px solid #E5E7EB',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.06)',
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
        background: isDark ? 'rgba(255,255,255,0.02)' : '#FAFBFC',
        borderBottom: isDark ? '1px solid #1F2937' : '1px solid #E5E7EB'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #0F52BA 0%, #0A3D8F 100%)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(15, 82, 186, 0.3)'
          }}>
            <Sparkles style={{ width: '16px', height: '16px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '14px', letterSpacing: '-0.01em', color: isDark ? '#FFFFFF' : '#111827' }}>
                GRIEVANCE DNA™
              </span>
              <span style={{ fontSize: '10px', color: '#6B7280', fontWeight: 600 }}>v3.2</span>
            </div>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              Multi-modal synthesis & pattern identification
            </span>
          </div>
        </div>

        {/* Confidence Ring / Pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '9999px',
          background: '#EEF2FF',
          border: '1px solid #C7D2FE',
          color: '#0F52BA'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0F52BA' }} />
          <span style={{ fontSize: '12px', fontWeight: 700 }}>
            Confidence: {confidence}%
          </span>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* 1. Category / Department / Location 3-Box Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px'
        }}>
          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
            border: '1px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
              Category
            </span>
            <strong style={{ fontSize: '13px', color: isDark ? '#FFFFFF' : '#111827', display: 'block', lineHeight: 1.3 }}>
              {category}
            </strong>
          </div>

          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
            border: '1px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
              Department
            </span>
            <strong style={{ fontSize: '13px', color: isDark ? '#FFFFFF' : '#111827', display: 'block', lineHeight: 1.3 }}>
              {department}
            </strong>
          </div>

          <div style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC',
            border: '1px solid #E5E7EB'
          }}>
            <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '4px' }}>
              Location
            </span>
            <strong style={{ fontSize: '13px', color: isDark ? '#FFFFFF' : '#111827', display: 'block', lineHeight: 1.3 }}>
              {ward.split('(')[0].trim()}
            </strong>
          </div>
        </div>

        {/* 2. Urgency Score Bar */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '8px',
          background: isDark ? 'rgba(239, 68, 68, 0.08)' : '#FEF2F2',
          border: '1px solid #FECACA'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#991B1B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              URGENCY SCORE
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', fontFamily: 'var(--font-mono)' }}>
                {urgencyScore}/100
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '9999px',
                background: '#EF4444',
                color: '#FFFFFF'
              }}>
                CRITICAL
              </span>
            </div>
          </div>

          <div style={{
            width: '100%',
            height: '8px',
            background: '#FEE2E2',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${urgencyScore}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
              borderRadius: '9999px',
              transition: 'width 600ms cubic-bezier(0.16, 1, 0.3, 1)'
            }} />
          </div>
        </div>

        {/* 3. AI Reasoning (Collapsible Accordion) */}
        <div style={{
          borderRadius: '8px',
          border: '1px solid #E5E7EB',
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
              background: '#FAFBFC',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>AI Diagnostic Reasoning</span>
              <span style={{ fontSize: '11px', color: '#6B7280', fontWeight: 400 }}>({reasons.length} verified factors)</span>
            </span>
            {showReasoning ? <ChevronUp style={{ width: '16px', height: '16px', color: '#6B7280' }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: '#6B7280' }} />}
          </button>

          {showReasoning && (
            <div style={{ padding: '12px 16px', background: '#FFFFFF', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {reasons.map((r, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12.5px', color: '#374151', lineHeight: 1.4 }}>
                  <span style={{ color: '#0F52BA', fontWeight: 700, marginTop: '1px' }}>•</span>
                  <span>{r}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Duplicate Cluster & Similar Complaints */}
        <div style={{
          padding: '14px 16px',
          borderRadius: '8px',
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#F59E0B',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Layers style={{ width: '16px', height: '16px' }} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>
                {duplicateCount} Similar Complaints Clustered
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                {Array.from({ length: Math.min(duplicateCount, 12) }).map((_, idx) => (
                  <span
                    key={idx}
                    onMouseEnter={() => setActiveAvatarIndex(idx)}
                    onMouseLeave={() => setActiveAvatarIndex(null)}
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: idx < 4 ? '#EF4444' : '#F59E0B',
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

          <span style={{ fontSize: '12px', fontWeight: 700, color: '#B45309', cursor: 'pointer' }}>
            View All Cluster Signals →
          </span>
        </div>

        {/* 5. AI Recommendation Box with Accept / Modify / Reject */}
        <div style={{
          padding: '16px',
          borderRadius: '8px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: '#10B981',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles style={{ width: '13px', height: '13px' }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Recommended Engineering Action
            </span>
          </div>

          <div style={{ fontSize: '14px', fontWeight: 700, color: '#064E3B', marginBottom: '6px', lineHeight: 1.3 }}>
            {recommendation}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#047857', marginBottom: '14px' }}>
            <span>Based on 3 historical precedents (<strong>{historicalSuccess} success rate</strong>)</span>
            <span>•</span>
            <span>Est. Remediation: <strong>{estTime}</strong></span>
          </div>

          {/* Action Feedback or Buttons */}
          {actionState ? (
            <div style={{
              padding: '10px 14px',
              borderRadius: '6px',
              background: actionState === 'ACCEPTED' ? '#DCFCE7' : actionState === 'MODIFIED' ? '#FEF3C7' : '#FEE2E2',
              color: actionState === 'ACCEPTED' ? '#166534' : actionState === 'MODIFIED' ? '#92400E' : '#991B1B',
              fontSize: '12.5px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                <span>
                  {actionState === 'ACCEPTED' && 'Recommendation accepted. Work order dispatched to North-West DJB maintenance crew.'}
                  {actionState === 'MODIFIED' && 'Action modified. Engineering notes sent for supervisory sign-off.'}
                  {actionState === 'REJECTED' && 'Recommendation rejected. Re-routed for secondary manual inspection.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActionState(null)}
                style={{ fontSize: '11px', textDecoration: 'underline', color: 'inherit' }}
              >
                Reset
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={() => handleAction('ACCEPTED')}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  borderRadius: '6px',
                  background: '#0F52BA',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  border: 'none',
                  transition: 'all 120ms ease'
                }}
              >
                <Check style={{ width: '14px', height: '14px' }} />
                <span>Accept Recommendation</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('MODIFIED')}
                style={{
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '6px',
                  background: '#FFFFFF',
                  color: '#4B5563',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid #D1D5DB',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <Edit3 style={{ width: '13px', height: '13px' }} />
                <span>Modify</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction('REJECTED')}
                style={{
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '6px',
                  background: 'transparent',
                  color: '#EF4444',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <X style={{ width: '13px', height: '13px' }} />
                <span>Reject</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
