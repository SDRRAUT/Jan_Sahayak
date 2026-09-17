import React, { useState } from 'react';
import { PlayCircle, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Users, ArrowRight, Zap, RefreshCw } from 'lucide-react';

export default function ActionSimulationCard({ simulations = [], onSelectAction, incidentId }) {
  const defaultSims = simulations.length > 0 ? simulations : [
    {
      id: "SIM-A",
      title: "Option A: Rapid Temporary Clamping (Split-Sleeve)",
      description: "Excavate single 1.5m pit at Mother Dairy booth and install emergency stainless steel split-sleeve clamp.",
      timeToIntervention: "4–6 Hours",
      expectedResolutionTime: "Same Day (6 Hours)",
      affectedPopulationReduction: "80% immediate relief",
      recurrenceRisk: "HIGH (65% probability of recurrence within 6 months)",
      resourceRequirement: "Low (1 Repair Squad + 4 Technicians)",
      costScore: "₹18,000",
      coordinationRequired: "DJB only",
      confidence: "High",
      recommendationVerdict: "SUB-OPTIMAL: High risk of repeated pavement collapse and secondary contamination."
    },
    {
      id: "SIM-B",
      title: "Option B: Full 24-Meter Ductile Iron Segment Replacement & PWD Road Re-bedding",
      description: "Comprehensive replacement of aged 1988 line with modern polyurethane-lined ductile iron + PWD granular sub-base reconstruction.",
      timeToIntervention: "18–24 Hours",
      expectedResolutionTime: "36 Hours (Temporary water tankers provided)",
      affectedPopulationReduction: "98% permanent fix",
      recurrenceRisk: "LOW (< 5% recurrence over 15 years)",
      resourceRequirement: "High (DJB Trenching Unit + PWD Roller Squad)",
      costScore: "₹1,45,000",
      coordinationRequired: "DJB + PWD + Delhi Traffic Police",
      confidence: "High",
      recommendationVerdict: "RECOMMENDED: Eliminates long-term civic disruption and complies with Zero Dead-End mandate."
    },
    {
      id: "SIM-C",
      title: "Option C: Multi-Department Joint Field Inspection & Pressure Testing",
      description: "Before mechanical excavation, run acoustic leak correlation and dye testing across DJB and MCD assets.",
      timeToIntervention: "2–3 Hours",
      expectedResolutionTime: "8 Hours (Diagnostic phase only)",
      affectedPopulationReduction: "0% (Diagnostic only)",
      recurrenceRisk: "N/A",
      resourceRequirement: "Medium (Diagnostic Engineers from DJB & PWD)",
      costScore: "₹6,500",
      coordinationRequired: "DJB + MCD",
      confidence: "Very High",
      recommendationVerdict: "Essential first step before executing Option B."
    }
  ];

  const [selectedSimId, setSelectedSimId] = useState(defaultSims[1]?.id || defaultSims[0]?.id);
  const activeSim = defaultSims.find(s => s.id === selectedSimId) || defaultSims[0];

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--color-border-subtle)',
      padding: '20px',
      boxShadow: 'var(--shadow-card)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PlayCircle style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', letterSpacing: '0.05em', display: 'block' }}>
              Decision Support System
            </span>
            <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>
              Action Simulation & Scenario Projection Sandbox
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
          {defaultSims.length} Action Scenarios Modeled
        </span>
      </div>

      {/* Model Disclaimer Notice */}
      <div style={{
        padding: '10px 14px',
        borderRadius: 'var(--radius-md)',
        background: '#F8FAFC',
        border: '1px solid var(--color-border-subtle)',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '11.5px',
        color: 'var(--color-text-secondary)'
      }}>
        <ShieldCheck style={{ width: '15px', height: '15px', color: 'var(--color-primary)', flexShrink: 0 }} />
        <span>
          <strong>Estimated Scenario Projection:</strong> Outcomes are calculated by the Decision Engine based on Delhi infrastructure history and SCADA logs. Requires human officer authorization.
        </span>
      </div>

      {/* Scenario Selector Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${defaultSims.length}, 1fr)`,
        gap: '8px',
        marginBottom: '16px'
      }}>
        {defaultSims.map((sim) => {
          const isSelected = sim.id === selectedSimId;
          const isRecommended = sim.recommendationVerdict.includes('RECOMMENDED');

          return (
            <button
              key={sim.id}
              type="button"
              onClick={() => setSelectedSimId(sim.id)}
              style={{
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: isSelected ? '#F0FDF4' : '#FFFFFF',
                border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                textAlign: 'left',
                transition: 'all 150ms ease',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                  {sim.id}
                </span>
                {isRecommended && (
                  <span style={{
                    fontSize: '9px',
                    fontWeight: 700,
                    background: '#0E5E3A',
                    color: '#FFFFFF',
                    padding: '1px 6px',
                    borderRadius: '9999px'
                  }}>
                    RECOMMENDED
                  </span>
                )}
              </div>
              <strong style={{ fontSize: '12.5px', color: 'var(--color-text-primary)', display: 'block', lineHeight: 1.3 }}>
                {sim.title.split(':')[1]?.trim() || sim.title}
              </strong>
            </button>
          );
        })}
      </div>

      {/* Active Scenario Detail Card */}
      {activeSim && (
        <div style={{
          padding: '16px',
          borderRadius: 'var(--radius-lg)',
          background: '#F8FAFC',
          border: '1px solid var(--color-border-subtle)'
        }}>
          <div style={{ marginBottom: '14px' }}>
            <h4 style={{ fontSize: '15px', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              {activeSim.title}
            </h4>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
              {activeSim.description}
            </p>
          </div>

          {/* 4 Key Projected Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                Time to Intervention
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                {activeSim.timeToIntervention}
              </strong>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                Resolution Time
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                {activeSim.expectedResolutionTime}
              </strong>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                Recurrence Risk
              </span>
              <strong style={{
                fontSize: '13px',
                color: activeSim.recurrenceRisk.includes('HIGH') || activeSim.recurrenceRisk.includes('CRITICAL') ? '#DC2626' : '#10B981'
              }}>
                {activeSim.recurrenceRisk}
              </strong>
            </div>

            <div style={{ padding: '10px 12px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>
                Estimated Cost Score
              </span>
              <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
                {activeSim.costScore}
              </strong>
            </div>
          </div>

          {/* Coordination & Verdict */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            paddingTop: '12px',
            borderTop: '1px solid var(--color-divider)'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
              Coordination: <strong>{activeSim.coordinationRequired}</strong> • Confidence: <strong>{activeSim.confidence}</strong>
            </div>

            {onSelectAction && (
              <button
                type="button"
                onClick={() => onSelectAction(activeSim)}
                className="btn-primary"
                style={{ height: '36px', fontSize: '12.5px', padding: '0 16px', borderRadius: 'var(--radius-full)' }}
              >
                <span>Adopt Scenario for Verification</span>
                <ArrowRight style={{ width: '13px', height: '13px' }} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
