import React, { useState } from 'react';
import { 
  FileCheck, 
  HelpCircle, 
  Check, 
  Edit3, 
  ArrowRight, 
  ShieldCheck, 
  Layers, 
  FileText, 
  MapPin, 
  AlertCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import WhyExplainer from './WhyExplainer';

/**
 * AI Resolution Intelligence Card
 * The key innovation UI:
 * "AI recommends. Human reviews and decides."
 * Distinctly separates automated recommendation from human officer decision-making.
 */
export default function ResolutionIntelligenceCard({
  title = "RESOLUTION INTELLIGENCE",
  recommendedAction = "Inspect drainage infrastructure before initiating road resurfacing.",
  standardOperatingProcedure = "MCD Urban Drainage Standard Operating Procedure Sec-4B",
  estimatedDuration = "6 Hours",
  whyPoints = [
    "12 similar complaints recorded in Ward 18",
    "3 nearby locations experiencing secondary overflow",
    "2 previous related drainage repairs logged in 2024",
    "Relevant municipal engineering policy found",
    "Location clustering pattern detected across adjacent streets"
  ],
  supportingEvidence = [
    { label: "12 Similar Cases", tag: "Ward 18 Cluster", count: 12 },
    { label: "Relevant Policy", tag: "MCD Drain SOP 4B", count: null },
    { label: "Previous Resolution", tag: "Case #JS-0891 (Aug 2024)", count: null },
    { label: "Location Pattern", tag: "Drainage backpressure detected", count: null }
  ],
  engineeringReasoning = "Road resurfacing without sub-surface drainage inspection historically results in pavement collapse within 90 days due to monsoon water stagnation.",
  potentialSlaRisk = "Executing full drainage inspection will take 6h, remaining well within the 18h SLA window.",
  decisionStatus = null, // null | 'APPROVED' | 'MODIFIED' | 'MORE_EVIDENCE_REQUESTED'
  onApprove,
  onModify,
  onRequestMoreEvidence
}) {
  const [activeEvidenceTab, setActiveEvidenceTab] = useState(null);

  return (
    <div style={{
      borderRadius: 'var(--radius-lg)',
      background: '#FFFFFF',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden'
    }}>
      {/* Card Header Bar */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(90deg, #F0FDF4 0%, #F8FAFC 100%)',
        borderBottom: '1px solid #BBF7D0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#15803D',
            flexShrink: 0
          }}>
            <FileCheck style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ fontSize: '13px', letterSpacing: '0.04em', textTransform: 'uppercase', color: '#14532D' }}>
                {title}
              </strong>
              <span className="pilot-tag" style={{ background: '#DCFCE7', color: '#15803D', borderColor: '#BBF7D0' }}>
                AI Recommendation
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#166534', display: 'block' }}>
              Source Policy: {standardOperatingProcedure}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px',
            background: '#FFFFFF',
            border: '1px solid #BBF7D0',
            color: '#15803D',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Clock style={{ width: '12px', height: '12px' }} />
            Est. Fix: {estimatedDuration}
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: '9999px',
            background: '#EFF6FF',
            color: '#1E40AF',
            border: '1px solid #BFDBFE'
          }}>
            Human Approval Required
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div style={{ padding: '24px' }}>
        {/* Recommended Next Action Callout */}
        <div style={{
          padding: '18px',
          borderRadius: 'var(--radius-md)',
          background: '#F0FDF4',
          border: '1px solid #86EFAC',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#15803D', display: 'block', marginBottom: '6px' }}>
            Recommended Next Action
          </span>
          <p style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#14532D',
            margin: 0,
            lineHeight: 1.5
          }}>
            "{recommendedAction}"
          </p>
        </div>

        {/* Why? Signature Section */}
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          background: '#F8FAFC',
          border: '1px solid var(--color-border-subtle)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-primary)' }}>
                WHY THIS RECOMMENDATION?
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                ({whyPoints.length} verified factors)
              </span>
            </div>
            <WhyExplainer
              label="Audit Trace"
              title="Algorithmic Justification Trace"
              reasons={whyPoints}
              align="right"
            />
          </div>

          {/* Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '8px' }}>
            {whyPoints.map((pt, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '12px',
                color: 'var(--color-text-primary)',
                background: '#FFFFFF',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(15,23,42,0.06)'
              }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '13px', lineHeight: 1 }}>✓</span>
                <span style={{ lineHeight: 1.4 }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supporting Evidence Pills / Links */}
        <div style={{ marginBottom: '20px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--color-text-muted)',
            display: 'block',
            marginBottom: '10px'
          }}>
            Supporting Evidence & Precedents
          </span>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {supportingEvidence.map((ev, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveEvidenceTab(activeEvidenceTab === idx ? null : idx)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  background: activeEvidenceTab === idx ? '#EEF2FF' : '#FFFFFF',
                  border: `1px solid ${activeEvidenceTab === idx ? '#818CF8' : 'var(--color-border-medium)'}`,
                  fontSize: '12px',
                  color: activeEvidenceTab === idx ? '#3730A3' : 'var(--color-text-primary)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <span>{ev.label}</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: activeEvidenceTab === idx ? '#C7D2FE' : '#F1F5F9',
                  color: activeEvidenceTab === idx ? '#312E81' : 'var(--color-text-muted)'
                }}>
                  {ev.tag}
                </span>
                <ChevronRight style={{ width: '12px', height: '12px', opacity: 0.6 }} />
              </button>
            ))}
          </div>

          {/* Evidence Details drawer if clicked */}
          {activeEvidenceTab !== null && (
            <div style={{
              marginTop: '12px',
              padding: '14px 18px',
              borderRadius: 'var(--radius-sm)',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--color-text-primary)' }}>
                Evidence Record: {supportingEvidence[activeEvidenceTab].label}
              </strong>
              <p style={{ margin: '4px 0 0 0' }}>
                Corroborating record retrieved from municipal GIS & knowledge base. Field inspection report logs identical soil subsiding directly under adjacent stormwater catch-basins.
              </p>
            </div>
          )}
        </div>

        {/* Human Review & Decision Toolbar */}
        <div style={{
          paddingTop: '18px',
          borderTop: '1px solid var(--color-divider)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              <strong>Human-in-the-Loop Protocol:</strong> AI suggests. Officer authorizes and dispatches.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onRequestMoreEvidence}
              className="btn-secondary btn-sm"
              style={{ fontSize: '12px', height: '36px' }}
            >
              Request More Evidence
            </button>

            <button
              type="button"
              onClick={onModify}
              className="btn-secondary btn-sm"
              style={{ fontSize: '12px', height: '36px' }}
            >
              <Edit3 style={{ width: '13px', height: '13px' }} />
              <span>Modify</span>
            </button>

            <button
              type="button"
              onClick={onApprove}
              className="btn-primary btn-sm"
              style={{ fontSize: '12px', height: '36px', background: '#059669', borderColor: '#059669' }}
            >
              <Check style={{ width: '14px', height: '14px' }} />
              <span>Approve Recommendation</span>
            </button>
          </div>
        </div>

        {decisionStatus && (
          <div style={{
            marginTop: '16px',
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            background: decisionStatus === 'APPROVED' ? '#ECFDF5' : '#FFFBEB',
            border: `1px solid ${decisionStatus === 'APPROVED' ? '#A7F3D0' : '#FDE68A'}`,
            color: decisionStatus === 'APPROVED' ? '#065F46' : '#92400E',
            fontSize: '12px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Check style={{ width: '14px', height: '14px' }} />
            <span>Officer Action Logged: {decisionStatus.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}
