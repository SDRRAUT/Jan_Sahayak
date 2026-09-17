import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Layers, 
  Wrench, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  Check 
} from 'lucide-react';
import WhyExplainer from './WhyExplainer';

/**
 * Grievance DNA Component (Refactored)
 * Follows the core principle: "DON'T SHOW THE AI. SHOW WHAT THE AI UNDERSTANDS."
 * Features progressive disclosure for technical metadata.
 */
export default function GrievanceDnaCard({ dna, isDark = false, compact = false }) {
  const [showTechnical, setShowTechnical] = useState(false);

  if (!dna) return null;

  // Extract human values
  const category = dna.category || 'Water Supply & Contamination';
  const ward = dna.ward || 'Ward 14 (Rohini Sector 14)';
  const duration = dna.duration || '3 days';
  const estimatedImpact = dna.impactHouseholds || '~450 households';
  const priority = dna.urgency || 'HIGH';
  const relatedCount = dna.clusterCount || dna.duplicateCount || 17;
  const nearbyLocations = dna.nearbyCount || 4;
  const recommendedAction = dna.recommendedAction || 'Inspect local supply infrastructure & 100mm junction clamp';

  const priorityReasons = [
    'Biohazard risk: Contaminated water mixed with sewage line',
    '3 days continuous citizen reports without municipal closure',
    `${relatedCount} identical complaints logged in the same 400m perimeter`,
    'Nearby public school & Mother Dairy booth impacted',
    'Historical precedent: Similar incident escalated in Oct 2025'
  ];

  return (
    <div
      style={{
        background: isDark ? 'var(--color-surface-inset-card)' : '#FFFFFF',
        color: isDark ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
        borderRadius: 'var(--radius-lg)',
        border: isDark ? '1px solid var(--color-border-dark)' : '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-card)',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Top Header: Understands */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', paddingBottom: '10px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(15,23,42,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: isDark ? 'rgba(79,70,229,0.2)' : 'var(--color-ai-tint)', color: isDark ? '#A5B4FC' : 'var(--color-ai-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles style={{ width: '14px', height: '14px' }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: isDark ? '#A5B4FC' : 'var(--color-ai-text)' }}>
            JanSahayak Understands
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: priority === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
            color: priority === 'CRITICAL' ? '#991B1B' : '#92400E',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            ● Priority: {priority}
          </span>
          <WhyExplainer
            label="Why?"
            title={`Why ${priority} Priority?`}
            reasons={priorityReasons}
            align="right"
          />
        </div>
      </div>

      {/* 01: Extracted Key Insights (Clean 2x2 Grid) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
        marginBottom: '16px'
      }}>
        <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: isDark ? 'rgba(255,255,255,0.04)' : '#F8F9FA', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.04)' }}>
          <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
            Category
          </span>
          <strong style={{ fontSize: '13px', color: isDark ? '#FFFFFF' : 'var(--color-text-primary)' }}>
            {category}
          </strong>
        </div>

        <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: isDark ? 'rgba(255,255,255,0.04)' : '#F8F9FA', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.04)' }}>
          <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
            Location
          </span>
          <strong style={{ fontSize: '13px', color: isDark ? '#FFFFFF' : 'var(--color-text-primary)' }}>
            {ward.split('(')[0]}
          </strong>
        </div>

        <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: isDark ? 'rgba(255,255,255,0.04)' : '#F8F9FA', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.04)' }}>
          <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
            Duration
          </span>
          <strong style={{ fontSize: '13px', color: isDark ? '#FFFFFF' : 'var(--color-text-primary)' }}>
            {duration}
          </strong>
        </div>

        <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: isDark ? 'rgba(255,255,255,0.04)' : '#F8F9FA', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.04)' }}>
          <span style={{ fontSize: '11px', color: isDark ? '#94A3B8' : 'var(--color-text-muted)', display: 'block', marginBottom: '2px' }}>
            Est. Citizen Impact
          </span>
          <strong style={{ fontSize: '13px', color: isDark ? '#FFFFFF' : 'var(--color-text-primary)' }}>
            {estimatedImpact}
          </strong>
        </div>
      </div>

      {/* 02: Pattern Detected */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: isDark ? 'rgba(245, 158, 11, 0.12)' : '#FFFBEB',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#92400E' }}>
            Pattern Detected
          </span>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>
            Possible Systemic Issue
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#78350F', margin: 0, lineHeight: 1.4 }}>
          <strong>{relatedCount} related complaints</strong> detected across <strong>{nearbyLocations} nearby locations</strong> in the last 72 hours.
        </p>
      </div>

      {/* 03: Recommended Action */}
      <div style={{
        padding: '12px 14px',
        borderRadius: 'var(--radius-md)',
        background: isDark ? 'rgba(16, 185, 129, 0.12)' : '#ECFDF5',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        marginBottom: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Wrench style={{ width: '13px', height: '13px', color: '#065F46' }} />
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#065F46' }}>
            Recommended Action
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#065F46', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
          {recommendedAction}
        </p>
      </div>

      {/* 04: Progressive Disclosure Button */}
      {!compact && (
        <div style={{ paddingTop: '8px', borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(15,23,42,0.06)' }}>
          <button
            type="button"
            onClick={() => setShowTechnical(!showTechnical)}
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: isDark ? '#A5B4FC' : 'var(--color-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 0'
            }}
          >
            <span>{showTechnical ? 'Hide Technical Metadata' : 'View AI Reasoning & Metadata →'}</span>
            {showTechnical ? <ChevronUp style={{ width: '12px', height: '12px' }} /> : <ChevronDown style={{ width: '12px', height: '12px' }} />}
          </button>

          {showTechnical && (
            <div style={{ marginTop: '10px', padding: '10px', borderRadius: 'var(--radius-sm)', background: isDark ? 'rgba(0,0,0,0.2)' : '#F1F5F9', fontSize: '11px', color: isDark ? '#94A3B8' : 'var(--color-text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>DNA Identifier:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{dna.dnaId || 'DNA-W14-892'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Routing Confidence:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--color-primary)' }}>{dna.departmentConfidence || 98.4}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Target SLA:</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>12 Hours</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Precedent Retrieval:</span>
                <span>DJB SOP #14 (Clamp Replacement)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
