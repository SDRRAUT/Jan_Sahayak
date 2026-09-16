import React, { useState } from 'react';
import { 
  FileText, 
  Brain, 
  Tag, 
  Building2, 
  AlertTriangle, 
  Copy, 
  Database, 
  Lightbulb, 
  UserCheck, 
  Wrench, 
  Star, 
  BarChart3, 
  Repeat, 
  MapPin, 
  ShieldAlert,
  ChevronRight,
  ArrowDown
} from 'lucide-react';

export const INTELLIGENCE_LOOP_STAGES = [
  {
    id: 1,
    title: 'Individual Grievance',
    icon: FileText,
    category: 'Citizen Intake',
    summary: 'Citizen submits complaint via natural Hindi, Hinglish, or English voice/text.',
    example: 'Aditya Verma reports: "Sector 14 Pocket 2 mein 3 din se ganda paani aa raha hai, bacche bimaar pad rahe hain."'
  },
  {
    id: 2,
    title: 'AI Understanding',
    icon: Brain,
    category: 'Natural Language Processing',
    summary: 'Language detection, keyword semantic extraction, and entity extraction.',
    example: 'Detected: Hinglish dialect. Extracted: "100mm Pipe", "Sector 14", "Contamination", "Health Hazard".'
  },
  {
    id: 3,
    title: 'Classification',
    icon: Tag,
    category: 'Taxonomy Engine',
    summary: 'Categorized into standard municipal taxonomy without requiring user knowledge.',
    example: 'Category: Water Supply & Biological Contamination.'
  },
  {
    id: 4,
    title: 'Department Routing',
    icon: Building2,
    category: 'Authority Assignment',
    summary: 'Automated direct assignment to exact executive jurisdiction (94.8% accuracy).',
    example: 'Assigned: Delhi Jal Board (DJB) • Executive Division North-West (Rohini).'
  },
  {
    id: 5,
    title: 'Priority & Severity Scoring',
    icon: AlertTriangle,
    category: 'Risk Evaluation',
    summary: 'Calculates public health index, life safety risk, and dynamic SLA urgency countdown.',
    example: 'Urgency Index: CRITICAL (94/100). SLA target assigned: 16 Hours.'
  },
  {
    id: 6,
    title: 'Similar & Duplicate Detection',
    icon: Copy,
    category: 'Cluster Deduplication',
    summary: 'Cross-checks spatial and temporal proximity across neighboring households.',
    example: 'Matched 18 identical complaints in 400m radius of Mother Dairy; grouped into Cluster CL-W14-WATER-03.'
  },
  {
    id: 7,
    title: 'Historical Case Retrieval (RAG)',
    icon: Database,
    category: 'Knowledge Base Retrieval',
    summary: 'Retrieves similar historical resolutions and proven field procedures from vector database.',
    example: 'Matched Case DJB-2025-081 (Pocket 1 valve failure resolved in 14 hrs using clamp replacement).'
  },
  {
    id: 8,
    title: 'Resolution Recommendation',
    icon: Lightbulb,
    category: 'Decision Support',
    summary: 'Synthesizes step-by-step SOP, required tools, and pre-drafts citizen notifications.',
    example: 'Recommended SOP: SOP-DJB-CONTAM-V4. Gear: 100mm Pipe Clamp, Hydraulic Pump, Chlorination Kit.'
  },
  {
    id: 9,
    title: 'Officer Decision & Dispatch',
    icon: UserCheck,
    category: 'Human Authority in the Loop',
    summary: 'Executive Engineer reviews 3-Bullet AI Brief and approves field dispatch order.',
    example: 'EE Sanjay Sharma approves work order DL-W14-0892; rapid response squad mobilized.'
  },
  {
    id: 10,
    title: 'Field Resolution & Signoff',
    icon: Wrench,
    category: 'Municipal Execution',
    summary: 'On-site maintenance team executes repair, conducts quality test, and uploads proof.',
    example: 'Valve clamp installed, pipeline flushed, and water sample chlorine test verified.'
  },
  {
    id: 11,
    title: 'Citizen Feedback & Audit',
    icon: Star,
    category: 'Verification Loop',
    summary: 'Automated SMS/WhatsApp notification to citizen with satisfaction verification.',
    example: 'Citizen rates resolution 5/5: "Ganda paani band ho gaya, thank you for quick action."'
  },
  {
    id: 12,
    title: 'Complaint Intelligence Aggregation',
    icon: BarChart3,
    category: 'Municipal Telemetry',
    summary: 'Resolution parameters, duration, cost, and asset wear logged to central repository.',
    example: 'Case telemetry logged: 14.2 hr resolution, ₹14,500 cost, asset: 1988 Cast-Iron valve.'
  },
  {
    id: 13,
    title: 'Recurring Issue & Hotspot Detection',
    icon: Repeat,
    category: 'Geospatial Analytics',
    summary: 'DBSCAN algorithms identify chronic recurring failures across seasonal ward cycles.',
    example: 'Flagged: Ward 14 has experienced 4 separate pipe failures along the same 1.2km line in 6 months.'
  },
  {
    id: 14,
    title: 'Systemic Root Cause & Policy Insight',
    icon: ShieldAlert,
    category: 'Macro Infrastructure Strategy',
    summary: 'Shifts governance from reactive complaint-patching to proactive capital replacement.',
    example: 'Systemic Recommendation: "Replace 35-year-old cast-iron piping in Rohini Pocket 2 with HDPE line (Est. ₹42 Lakhs) to permanently eliminate ₹18 Lakhs/year recurring emergency repairs."'
  }
];

export default function IntelligenceLoop({ activeIndex = null, onSelectStage = null }) {
  const [selectedStage, setSelectedStage] = useState(activeIndex || 0);

  const current = INTELLIGENCE_LOOP_STAGES[selectedStage];
  const IconComponent = current.icon;

  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 'var(--radius-xl)',
      border: '1px solid var(--color-border-subtle)',
      boxShadow: 'var(--shadow-card)',
      padding: '32px'
    }}>
      {/* Component Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div className="category-pill" style={{ marginBottom: '8px' }}>
            CORE PRODUCT ARCHITECTURE
          </div>
          <h3 style={{ fontSize: '24px', color: 'var(--color-text-primary)' }}>
            The 14-Stage Closed Intelligence Loop
          </h3>
          <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            Transforming isolated citizen grievances into systemic infrastructure planning.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
            Step {selectedStage + 1} of 14
          </span>
          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '9999px', background: 'var(--color-accent-tint)', color: 'var(--color-primary)', fontWeight: 700 }}>
            {current.category}
          </span>
        </div>
      </div>

      {/* Horizontal Scroller / Step Track */}
      <div style={{
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        paddingBottom: '16px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--color-divider)'
      }}>
        {INTELLIGENCE_LOOP_STAGES.map((st, idx) => {
          const isSelected = selectedStage === idx;
          const StageIcon = st.icon;
          return (
            <button
              key={st.id}
              onClick={() => {
                setSelectedStage(idx);
                if (onSelectStage) onSelectStage(idx);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                background: isSelected ? 'var(--color-primary)' : '#F1F5F9',
                color: isSelected ? '#FFFFFF' : 'var(--color-text-secondary)',
                border: isSelected ? '1px solid var(--color-primary)' : '1px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease',
                flexShrink: 0
              }}
            >
              <StageIcon style={{ width: '13px', height: '13px' }} />
              <span>{st.id}. {st.title}</span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Deep-Dive Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '24px',
        alignItems: 'center',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: '#F8F9FA',
        border: '1px solid var(--color-border-subtle)'
      }}>
        {/* Left Col: Explanation */}
        <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div className="icon-squircle" style={{ width: '42px', height: '42px' }}>
              <IconComponent style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>
                Stage {current.id}
              </span>
              <h4 style={{ fontSize: '20px', color: 'var(--color-text-primary)' }}>
                {current.title}
              </h4>
            </div>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-text-primary)', marginBottom: '16px' }}>
            {current.summary}
          </p>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSelectedStage(prev => (prev > 0 ? prev - 1 : 0))}
              disabled={selectedStage === 0}
              className="btn-secondary btn-sm"
              style={{ opacity: selectedStage === 0 ? 0.5 : 1 }}
            >
              Previous Stage
            </button>
            <button
              onClick={() => setSelectedStage(prev => (prev < 13 ? prev + 1 : 13))}
              disabled={selectedStage === 13}
              className="btn-primary btn-sm"
              style={{ opacity: selectedStage === 13 ? 0.5 : 1 }}
            >
              <span>Next Stage</span>
              <ChevronRight style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        {/* Right Col: Concrete Real-World Municipal Telemetry */}
        <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            border: '1px solid var(--color-border-subtle)',
            boxShadow: 'var(--shadow-xs)'
          }}>
            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: '6px' }}>
              Real Delhi Case Telemetry:
            </span>
            <p style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--color-text-primary)', fontStyle: 'italic' }}>
              {current.example}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
