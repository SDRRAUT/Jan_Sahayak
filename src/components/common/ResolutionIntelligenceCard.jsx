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
  ChevronRight,
  Sparkles,
  Bot,
  Wrench,
  Users,
  CheckCircle2
} from 'lucide-react';
import WhyExplainer from './WhyExplainer';

/**
 * AI Smart Action Plan (Formerly Resolution Intelligence Card)
 * Rebuilt for 100% simple, plain English that anyone understands at a glance.
 * "AI suggests the fix. The Officer makes the decision."
 */
export default function ResolutionIntelligenceCard({
  title = "SMART ACTION PLAN",
  recommendedAction = "Inspect and fix underground water valve before paving the street.",
  standardOperatingProcedure = "Official Repair Rule #4B",
  estimatedDuration = "6 Hours",
  whyPoints = [
    "12 neighbors from Ward 18 reported the exact same dirty water problem",
    "Dirty water is leaking underground towards the Mother Dairy junction",
    "Same repair worked in 14 hours last year under Emergency Rule #14",
    "Fix can be completed in 6 hours, well within the 12-hour deadline"
  ],
  supportingEvidence = [
    { label: "12 Neighbor Reports", tag: "Ward 18 (Rohini)" },
    { label: "Government Rulebook", tag: "SOP Sec-4B" },
    { label: "Past Fix Succeeded", tag: "Case #JS-0891" },
    { label: "Water Leak Map", tag: "Mother Dairy Junction" }
  ],
  engineeringReasoning = "Fixing the pipe first stops dirty water from leaking and saves the new road from breaking again.",
  potentialSlaRisk = "Safe to dispatch. Work will finish 6 hours before the 12-hour citizen deadline.",
  decisionStatus = null, // null | 'APPROVED' | 'MODIFIED' | 'MORE_EVIDENCE_REQUESTED'
  onApprove,
  onModify,
  onRequestMoreEvidence
}) {
  const [activeEvidenceTab, setActiveEvidenceTab] = useState(null);

  return (
    <div style={{
      borderRadius: '20px',
      background: '#FFFFFF',
      border: '1.5px solid #E2E8F0',
      boxShadow: '0 4px 20px -4px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03)',
      overflow: 'hidden'
    }}>
      {/* Card Header Bar */}
      <div style={{
        padding: '16px 20px',
        background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
        borderBottom: '1.5px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)',
            flexShrink: 0
          }}>
            <Sparkles style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <strong style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.01em' }}>
                💡 SMART ACTION PLAN
              </strong>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Bot size={12} />
                AI Suggested Fix
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#475569', display: 'block', marginTop: '2px' }}>
              Based on: <strong>{standardOperatingProcedure}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '999px',
            background: '#FFFFFF',
            border: '1px solid #CBD5E1',
            color: '#0F172A',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
          }}>
            <Clock style={{ width: '13px', height: '13px', color: '#0284C7' }} />
            Est. Fix: {estimatedDuration}
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '999px',
            background: '#EFF6FF',
            color: '#1D4ED8',
            border: '1px solid #BFDBFE'
          }}>
            🧑‍💼 Officer Decides
          </span>
        </div>
      </div>

      {/* Main Content Body */}
      <div style={{ padding: '22px' }}>
        {/* Recommended Next Action Callout Banner */}
        <div style={{
          padding: '16px 18px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
          border: '1.5px solid #86EFAC',
          marginBottom: '20px',
          boxShadow: '0 2px 10px rgba(16, 185, 129, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span style={{ fontSize: '15px' }}>🎯</span>
            <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#065F46' }}>
              RECOMMENDED STEP FOR YOUR CREW
            </span>
          </div>
          <p style={{
            fontSize: '16px',
            fontWeight: 800,
            color: '#064E3B',
            margin: '0 0 6px 0',
            lineHeight: 1.45
          }}>
            "{recommendedAction}"
          </p>
          <div style={{ fontSize: '12.5px', color: '#047857', lineHeight: 1.4 }}>
            <strong>Why this matters: </strong>
            <span>{engineeringReasoning}</span>
          </div>
        </div>

        {/* Why? Signature Section */}
        <div style={{
          padding: '18px',
          borderRadius: '16px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px' }}>💡</span>
              <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em', color: '#0F172A' }}>
                WHY THIS IS THE RIGHT FIX ({whyPoints.length} CLEAR REASONS)
              </span>
            </div>
            <WhyExplainer
              label="Check Details"
              title="How AI Verified This Recommendation"
              reasons={whyPoints}
              align="right"
            />
          </div>

          {/* 4 Clear Reasons Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {whyPoints.map((pt, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
                fontSize: '13px',
                color: '#1E293B',
                background: '#FFFFFF',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <span style={{ color: '#059669', fontWeight: 800, fontSize: '15px', lineHeight: 1, flexShrink: 0 }}>✓</span>
                <span style={{ lineHeight: 1.45, fontWeight: 500 }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Supporting Evidence Pills / Proof */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px' }}>🔍</span>
            <span style={{
              fontSize: '11.5px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: '#475569'
            }}>
              PROOF FROM NEIGHBORHOOD & PAST RECORDS (Click to see proof)
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
                  borderRadius: '12px',
                  background: activeEvidenceTab === idx ? '#EFF6FF' : '#F8FAFC',
                  border: `1.5px solid ${activeEvidenceTab === idx ? '#2563EB' : '#CBD5E1'}`,
                  fontSize: '12.5px',
                  color: activeEvidenceTab === idx ? '#1D4ED8' : '#334155',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <span>{ev.label}</span>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '6px',
                  background: activeEvidenceTab === idx ? '#DBEAFE' : '#E2E8F0',
                  color: activeEvidenceTab === idx ? '#1E40AF' : '#475569'
                }}>
                  {ev.tag}
                </span>
                <ChevronRight style={{ width: '13px', height: '13px', opacity: 0.7 }} />
              </button>
            ))}
          </div>

          {/* Evidence Details drawer if clicked */}
          {activeEvidenceTab !== null && (
            <div style={{
              marginTop: '12px',
              padding: '14px 18px',
              borderRadius: '12px',
              background: '#F0F9FF',
              border: '1px solid #BAE6FD',
              fontSize: '13px',
              color: '#0369A1',
              lineHeight: 1.5
            }}>
              <strong style={{ color: '#0C4A6E', display: 'block', marginBottom: '3px' }}>
                Proof Details: {supportingEvidence[activeEvidenceTab].label}
              </strong>
              <p style={{ margin: 0 }}>
                Historical records and nearby complaints confirm that the water leak starts at this exact spot. Fixing the underground pipe now prevents water contamination across all homes on this street.
              </p>
            </div>
          )}
        </div>

        {/* SLA & Time Safety Note */}
        <div style={{
          padding: '10px 14px',
          borderRadius: '10px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          fontSize: '12.5px',
          color: '#065F46',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 style={{ width: '16px', height: '16px', color: '#10B981', flexShrink: 0 }} />
          <span><strong>Time & Deadline Check: </strong>{potentialSlaRisk}</span>
        </div>

        {/* Human Review & Decision Toolbar */}
        <div style={{
          paddingTop: '18px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ width: '18px', height: '18px', color: '#059669' }} />
            <span style={{ fontSize: '12.5px', color: '#475569' }}>
              <strong style={{ color: '#0F172A' }}>Officer in Control:</strong> AI suggests. You authorize and send the team.
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onRequestMoreEvidence}
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                height: '38px',
                padding: '0 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#334155',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Ask Citizen For Info
            </button>

            <button
              type="button"
              onClick={onModify}
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                height: '38px',
                padding: '0 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1.5px solid #CBD5E1',
                color: '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 150ms ease'
              }}
            >
              <Edit3 style={{ width: '13px', height: '13px' }} />
              <span>Change Fix Details</span>
            </button>

            <button
              type="button"
              onClick={onApprove}
              style={{
                fontSize: '13px',
                fontWeight: 800,
                height: '38px',
                padding: '0 18px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)',
                transition: 'all 150ms ease'
              }}
            >
              <Check style={{ width: '15px', height: '15px' }} />
              <span>Approve & Send Field Team</span>
            </button>
          </div>
        </div>

        {decisionStatus && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '12px',
            background: decisionStatus === 'APPROVED' ? '#ECFDF5' : '#FFFBEB',
            border: `1.5px solid ${decisionStatus === 'APPROVED' ? '#A7F3D0' : '#FDE68A'}`,
            color: decisionStatus === 'APPROVED' ? '#065F46' : '#92400E',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Check style={{ width: '15px', height: '15px' }} />
            <span>✓ Your decision was logged: {decisionStatus.replace(/_/g, ' ')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

