import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  MapPin, 
  Send, 
  ArrowRight, 
  ShieldAlert, 
  FileCheck, 
  RefreshCw,
  Users,
  Search,
  Filter,
  Check,
  X,
  Edit3,
  Share2,
  FileText,
  Camera,
  Layers,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  History,
  GitBranch,
  ShieldCheck,
  TrendingUp,
  Activity,
  Eye,
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { analyzeGrievanceInput } from '../services/aiEngine';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import WhyExplainer from '../components/common/WhyExplainer';
import VisualJourneyTimeline from '../components/common/VisualJourneyTimeline';
import ResolutionVerificationCard from '../components/common/ResolutionVerificationCard';
import ResolutionIntelligenceCard from '../components/common/ResolutionIntelligenceCard';

export default function OfficerWorkspace() {
  const { id } = useParams();
  const { 
    grievances, 
    requestInfo, 
    resolveGrievance, 
    addInternalNote, 
    reassignGrievance, 
    escalateGrievance, 
    actionRecommendation, 
    transitionStatus,
    handleDuplicateAction,
    user 
  } = useApp();
  
  const currentOfficer = (user && user.role !== 'citizen') ? user : {
    name: 'Er. Sanjay Sharma',
    designation: 'Assistant Executive Engineer',
    department: 'Delhi Jal Board (DJB)',
    zone: 'Zone North-West (Rohini)'
  };

  // Selected grievance for deep workspace inspection
  const [selectedId, setSelectedId] = useState(id || grievances[0]?.id);
  const [activeAuthorityTab, setActiveAuthorityTab] = useState(id ? 'detail' : 'overview'); // 'overview' | 'queue' | 'detail' | 'map'
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [detailSubTab, setDetailSubTab] = useState('recommendation'); // 'recommendation' | 'brief' | 'duplicates' | 'history' | 'workflow' | 'notes'
  const [dispatchStatus, setDispatchStatus] = useState(null);

  // Modals
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationQuestion, setClarificationQuestion] = useState('');
  
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('Replacement clamp installed, line pressure normalized to 3.2 bar, and water quality chlorine test verified.');

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignOfficer, setReassignOfficer] = useState('Er. Vivek Nambiar (AEE Civil Lines)');
  const [reassignDepartment, setReassignDepartment] = useState(currentOfficer.department || 'Delhi Jal Board (DJB)');
  const [reassignReason, setReassignReason] = useState('Jurisdiction realignment for faster field arrival.');

  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('High-risk water contamination affecting pediatric ward proximity.');

  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifiedSopText, setModifiedSopText] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [targetNextStatus, setTargetNextStatus] = useState('IN_PROGRESS');
  const [transitionReason, setTransitionReason] = useState('');

  const [internalNoteInput, setInternalNoteInput] = useState('');

  // 4 AI Detected Issues for "What Needs Attention?"
  const emergingIssues = [
    {
      id: 'ISSUE-01',
      title: 'Water supply disruption & pressure drop',
      category: 'Water Supply',
      status: 'EMERGING',
      statusLabel: 'Emerging',
      badgeColor: '#DC2626',
      badgeBg: '#FEF2F2',
      badgeBorder: '#FECACA',
      wardsCount: 4,
      wards: 'Wards 12, 14, 15, 18',
      grievancesCount: 37,
      trend: 'Increasing frequency (+68% in 48h)',
      hypothesis: 'Possible common underground trunk line crack near Outer Ring Road junction.',
      recommendedAction: 'Isolate Sector 14 booster pump line & survey soil moisture with acoustic sensors',
      targetGrievanceId: 'GRV-2025-001'
    },
    {
      id: 'ISSUE-02',
      title: 'Streetlight feeder cable trip along ring corridor',
      category: 'Electricity & Lighting',
      status: 'GROWING',
      statusLabel: 'Growing',
      badgeColor: '#D97706',
      badgeBg: '#FFFBEB',
      badgeBorder: '#FDE68A',
      wardsCount: 3,
      wards: 'Wards 8, 9, 11',
      grievancesCount: 22,
      trend: 'Growing (+34% this week)',
      hypothesis: 'Phase unbalance tripping local MCB breakers during peak evening loads.',
      recommendedAction: 'Load-balance transformer 4B & replace burnt phase-isolator fuse',
      targetGrievanceId: 'GRV-2025-004'
    },
    {
      id: 'ISSUE-03',
      title: 'Sanitation & primary waste collection backlog',
      category: 'Sanitation',
      status: 'IMPROVING',
      statusLabel: 'Improving',
      badgeColor: '#2563EB',
      badgeBg: '#EFF6FF',
      badgeBorder: '#BFDBFE',
      wardsCount: 1,
      wards: 'Ward 19 (Karol Bagh)',
      grievancesCount: 14,
      trend: 'Improving (Down 40% after tipper reassignment)',
      hypothesis: 'Temporary fleet shortage remediated; transfer station operating at nominal capacity.',
      recommendedAction: 'Maintain current second-shift sweepers until buffer bins clear',
      targetGrievanceId: 'GRV-2025-003'
    },
    {
      id: 'ISSUE-04',
      title: 'Pipeline joint fracture remediated',
      category: 'Water Supply',
      status: 'RESOLVED',
      statusLabel: 'Resolved',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      wardsCount: 1,
      wards: 'Ward 14 (Rohini Sector 14)',
      grievancesCount: 18,
      trend: 'Physical remediation signed off by AEE',
      hypothesis: 'High-pressure clamp installed; citizen verification audit logged 94% approval.',
      recommendedAction: 'Archive cluster and record in municipal asset maintenance ledger',
      targetGrievanceId: 'GRV-2025-002'
    }
  ];

  // Filter queue
  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = !searchQuery || 
      g.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.location?.ward?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUrgency = urgencyFilter === 'ALL' || g.urgency === urgencyFilter;
    const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
    return matchesSearch && matchesUrgency && matchesStatus;
  });

  const activeItem = grievances.find(g => g.id === selectedId) || filteredGrievances[0] || grievances[0];

  // Dynamic deep AI analysis of active case
  const liveAnalysis = analyzeGrievanceInput(activeItem?.descriptionRaw || activeItem?.title || '', { ward: activeItem?.location?.ward });

  // 9-Stage Formal Workflow Status Definitions
  const workflowStages = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'AI_ANALYSED', label: 'AI Analysed' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'INFORMATION_REQUIRED', label: 'Info Required' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'ESCALATED', label: 'Escalated' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' }
  ];

  const currentStatusIndex = workflowStages.findIndex(s => s.key === (activeItem?.status || 'IN_PROGRESS'));

  // SLA Intelligence computation
  const targetSlaHours = activeItem?.slaHoursLeft ? activeItem.slaHoursLeft + 4 : (liveAnalysis.slaTargetHours || 12);
  const elapsedHours = 4.5;
  const remainingHours = activeItem?.slaHoursLeft !== undefined ? activeItem.slaHoursLeft : liveAnalysis.slaRemainingHours;
  const slaStatus = remainingHours <= 0 ? 'OVERDUE' : (remainingHours <= 6 ? 'AT_RISK' : 'ON_TRACK');

  // Handlers
  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    await resolveGrievance(activeItem.id, resolutionNotes);
    setDispatchStatus('RESOLVED');
    setShowResolutionModal(false);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch(e) {}
  };

  const handleClarificationSubmit = async (e) => {
    e.preventDefault();
    if (!clarificationQuestion.trim()) return;
    await requestInfo(activeItem.id, clarificationQuestion);
    setClarificationQuestion('');
    setShowClarificationModal(false);
    setDispatchStatus('CLARIFICATION_SENT');
  };

  const handleReassignSubmit = async (e) => {
    e.preventDefault();
    await reassignGrievance(activeItem.id, reassignOfficer, reassignDepartment, reassignReason);
    setShowReassignModal(false);
    setDispatchStatus('REASSIGNED');
  };

  const handleEscalateSubmit = async (e) => {
    e.preventDefault();
    await escalateGrievance(activeItem.id, escalateReason, 'Superintending Engineer');
    setShowEscalateModal(false);
    setDispatchStatus('ESCALATED');
  };

  const handleTransitionSubmit = async (e) => {
    e.preventDefault();
    await transitionStatus(activeItem.id, targetNextStatus, transitionReason || `Moved to ${targetNextStatus} by on-duty engineer`);
    setShowTransitionModal(false);
    setTransitionReason('');
    setDispatchStatus(`STATUS_UPDATED_${targetNextStatus}`);
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!internalNoteInput.trim()) return;
    await addInternalNote(activeItem.id, internalNoteInput);
    setInternalNoteInput('');
  };

  const handleAcceptRecommendation = async () => {
    await actionRecommendation(activeItem.id, 'ACCEPT');
    setDispatchStatus('APPROVED');
    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.8 } });
    } catch(e) {}
  };

  const handleModifyRecommendationSubmit = async (e) => {
    e.preventDefault();
    await actionRecommendation(activeItem.id, 'MODIFY', modifiedSopText);
    setShowModifyModal(false);
    setDispatchStatus('MODIFIED');
  };

  const handleRejectRecommendationSubmit = async (e) => {
    e.preventDefault();
    await actionRecommendation(activeItem.id, 'REJECT', null, rejectReason);
    setShowRejectModal(false);
    setDispatchStatus('REJECTED');
  };

  const openInspectionForCase = (caseId) => {
    setSelectedId(caseId);
    setActiveAuthorityTab('detail');
    setDispatchStatus(null);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '28px' }}>
      <div className="container">

        {/* 1. Officer Context & Authority Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-divider)'
        }}>
          <div>
            <div className="category-pill" style={{ marginBottom: '8px' }}>
              AUTHORITY WORKSPACE • CIVIC RESOLUTION CONSOLE
            </div>
            <h1 style={{ fontSize: '28px', color: 'var(--color-text-primary)' }}>
              {currentOfficer.name}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              {currentOfficer.designation} • <strong>{currentOfficer.department}</strong> • Jurisdiction: <strong>{currentOfficer.zone}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              background: slaStatus === 'AT_RISK' ? '#FFFBEB' : (slaStatus === 'OVERDUE' ? '#FEF2F2' : '#ECFDF5'),
              border: `1px solid ${slaStatus === 'AT_RISK' ? '#FDE68A' : (slaStatus === 'OVERDUE' ? '#FECACA' : '#A7F3D0')}`,
              color: slaStatus === 'AT_RISK' ? '#B45309' : (slaStatus === 'OVERDUE' ? '#991B1B' : '#065F46'),
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span className="status-dot active"></span>
              <span>Active Case SLA: {remainingHours}h Left</span>
            </div>

            <Link to="/admin" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin style={{ width: '13px', height: '13px' }} />
              <span>Full Ward Heatmap</span>
            </Link>
          </div>
        </div>

        {/* 2. Authority Navigation Tabs (Overview, Queue, Detail, Map) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '24px',
          background: '#F1F5F9',
          padding: '6px',
          borderRadius: 'var(--radius-md)',
          width: 'fit-content',
          flexWrap: 'wrap'
        }}>
          <button
            type="button"
            onClick={() => setActiveAuthorityTab('overview')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              background: activeAuthorityTab === 'overview' ? '#FFFFFF' : 'transparent',
              color: activeAuthorityTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeAuthorityTab === 'overview' ? 'var(--shadow-xs)' : 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Activity style={{ width: '14px', height: '14px' }} />
            <span>Overview & What Needs Attention</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAuthorityTab('queue')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              background: activeAuthorityTab === 'queue' ? '#FFFFFF' : 'transparent',
              color: activeAuthorityTab === 'queue' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeAuthorityTab === 'queue' ? 'var(--shadow-xs)' : 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <SlidersHorizontal style={{ width: '14px', height: '14px' }} />
            <span>Grievance Triage Queue ({filteredGrievances.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAuthorityTab('detail')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              background: activeAuthorityTab === 'detail' ? '#FFFFFF' : 'transparent',
              color: activeAuthorityTab === 'detail' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeAuthorityTab === 'detail' ? 'var(--shadow-xs)' : 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Eye style={{ width: '14px', height: '14px' }} />
            <span>Case Inspection (#{activeItem?.id || 'JS-10482'})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveAuthorityTab('map')}
            style={{
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              background: activeAuthorityTab === 'map' ? '#FFFFFF' : 'transparent',
              color: activeAuthorityTab === 'map' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              boxShadow: activeAuthorityTab === 'map' ? 'var(--shadow-xs)' : 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Compass style={{ width: '14px', height: '14px' }} />
            <span>Civic Hotspots</span>
          </button>
        </div>

        {/* 3. SECTION 22: WHAT NEEDS ATTENTION? (Prominent on Overview and top of dashboard) */}
        {(activeAuthorityTab === 'overview' || activeAuthorityTab === 'queue') && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="pilot-tag" style={{ background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA', marginBottom: '6px' }}>
                  CIVIC PATTERN RADAR
                </span>
                <h2 style={{ fontSize: '22px', color: 'var(--color-text-primary)', margin: 0 }}>
                  What Needs Attention?
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Macro issues surfaced across multi-ward telemetry. Ranked by urgency, spread, and service risk.
                </p>
              </div>

              {/* Status filter indicators */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#FEF2F2', color: '#DC2626', fontWeight: 700 }}>
                  ● Emerging (1)
                </span>
                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#FFFBEB', color: '#D97706', fontWeight: 700 }}>
                  ● Growing (1)
                </span>
                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#2563EB', fontWeight: 700 }}>
                  ● Improving (1)
                </span>
                <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#ECFDF5', color: '#059669', fontWeight: 700 }}>
                  ● Resolved (1)
                </span>
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {emergingIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="card"
                  style={{
                    padding: '20px',
                    border: `1px solid ${issue.badgeBorder}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    transition: 'all 200ms ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        background: issue.badgeBg,
                        color: issue.badgeColor,
                        border: `1px solid ${issue.badgeBorder}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em'
                      }}>
                        {issue.statusLabel}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                        {issue.wardsCount} Wards Affected
                      </span>
                    </div>

                    <h3 style={{ fontSize: '16px', lineHeight: 1.4, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                      {issue.title}
                    </h3>

                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                      <strong>Hypothesis: </strong>{issue.hypothesis}
                    </p>

                    <div style={{
                      padding: '10px 12px',
                      borderRadius: '6px',
                      background: '#F8FAFC',
                      border: '1px solid rgba(15,23,42,0.06)',
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      marginBottom: '14px',
                      lineHeight: 1.5
                    }}>
                      <div>📍 {issue.wards}</div>
                      <div>📈 {issue.grievancesCount} citizen reports • {issue.trend}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => openInspectionForCase(issue.targetGrievanceId)}
                    className="btn-secondary btn-sm"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      borderColor: issue.badgeBorder,
                      color: issue.badgeColor,
                      fontSize: '12px'
                    }}
                  >
                    <span>Investigate Cluster →</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. OVERVIEW MODE: Key Inquiries answered: What, Where, Patterns, Review */}
        {activeAuthorityTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
            {/* The 4 Core Questions Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px'
            }}>
              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  1. What Needs Attention?
                </span>
                <strong style={{ fontSize: '20px', color: '#DC2626', display: 'block', marginBottom: '4px' }}>
                  Water Supply in Rohini
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  37 complaints linked to Sector 14 booster trunk conduit. Immediate pressure test recommended.
                </p>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  2. Where is it Happening?
                </span>
                <strong style={{ fontSize: '20px', color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                  Wards 12, 14 & 18
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Clustered in 400m radius around Mother Dairy & Outer Ring Road feeder line.
                </p>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  3. What Patterns are Emerging?
                </span>
                <strong style={{ fontSize: '20px', color: '#D97706', display: 'block', marginBottom: '4px' }}>
                  Sub-surface Drainage Leak
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Road complaints in Ward 18 correlate directly with uninspected drainage backpressure.
                </p>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  4. What Should Be Reviewed?
                </span>
                <strong style={{ fontSize: '20px', color: '#059669', display: 'block', marginBottom: '4px' }}>
                  3 RAG SOP Recommendations
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Awaiting engineer sign-off to authorize work orders without unnecessary duplicate dispatches.
                </p>
              </div>
            </div>

            {/* Quick Link to Queue or Inspection */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => setActiveAuthorityTab('queue')}
                className="btn-primary"
              >
                <span>View Full Triage Queue ({grievances.length} Active Cases)</span>
                <ArrowRight className="btn-arrow" style={{ width: '16px', height: '16px' }} />
              </button>

              <button
                type="button"
                onClick={() => openInspectionForCase(activeItem?.id || 'GRV-2025-001')}
                className="btn-secondary"
              >
                <span>Inspect Priority Case #{activeItem?.id || 'GRV-2025-001'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. SPLIT WORKSPACE / QUEUE & CASE INSPECTION */}
        {(activeAuthorityTab === 'queue' || activeAuthorityTab === 'detail') && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Left Column (4 Cols): Priority Triage Queue & Search Filter */}
            <div style={{ gridColumn: activeAuthorityTab === 'queue' ? 'span 12' : 'span 4' }} className="hero-left-col">
              <div className="card" style={{ padding: '20px' }}>
                
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>
                    Grievance Queue ({filteredGrievances.length})
                  </span>
                  <span className="category-pill" style={{ height: '20px', fontSize: '10px' }}>
                    Live Queue
                  </span>
                </div>

                {/* Search Bar */}
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '15px', height: '15px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ID, keyword, or ward..."
                    style={{
                      width: '100%',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 10px 0 32px',
                      fontSize: '12px',
                      background: '#FFFFFF'
                    }}
                  />
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
                  {['ALL', 'CRITICAL', 'HIGH'].map((urg) => (
                    <button
                      key={urg}
                      type="button"
                      onClick={() => setUrgencyFilter(urg)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: urgencyFilter === urg ? 'none' : '1px solid var(--color-border-medium)',
                        background: urgencyFilter === urg ? 'var(--color-primary)' : '#FFFFFF',
                        color: urgencyFilter === urg ? '#FFFFFF' : 'var(--color-text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {urg}
                    </button>
                  ))}
                  {['IN_PROGRESS', 'RESOLVED'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(statusFilter === st ? 'ALL' : st)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        fontSize: '11px',
                        fontWeight: 600,
                        border: statusFilter === st ? 'none' : '1px solid var(--color-border-medium)',
                        background: statusFilter === st ? '#059669' : '#FFFFFF',
                        color: statusFilter === st ? '#FFFFFF' : 'var(--color-text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                {/* Triage items list */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  maxHeight: activeAuthorityTab === 'queue' ? 'none' : '720px',
                  overflowY: 'auto'
                }}>
                  {filteredGrievances.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      No matching grievances found in inbox.
                    </div>
                  ) : (
                    filteredGrievances.map((g) => {
                      const isSelected = g.id === activeItem?.id;
                      const itemHours = g.slaHoursLeft || 12;
                      const itemStatus = itemHours <= 0 ? 'OVERDUE' : (itemHours <= 6 ? 'AT_RISK' : 'ON_TRACK');

                      return (
                        <div
                          key={g.id}
                          onClick={() => {
                            setSelectedId(g.id);
                            setActiveAuthorityTab('detail');
                            setDispatchStatus(null);
                          }}
                          style={{
                            padding: '14px',
                            borderRadius: 'var(--radius-md)',
                            background: isSelected ? 'var(--color-accent-tint)' : '#FFFFFF',
                            border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                            cursor: 'pointer',
                            transition: 'all 150ms ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span className="font-mono-numbers" style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                              {g.id}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: '9999px',
                                background: g.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                                color: g.urgency === 'CRITICAL' ? '#991B1B' : '#92400E'
                              }}>
                                {g.urgency} ({g.urgencyScore || 85})
                              </span>
                              <WhyExplainer
                                label="Why?"
                                title={`Why ${g.urgency} Priority?`}
                                reasons={[
                                  'Duration exceeds municipal threshold',
                                  'Multiple adjacent household reports',
                                  'High-risk infrastructure keywords verified'
                                ]}
                                align="right"
                              />
                            </div>
                          </div>

                          <h4 style={{ fontSize: '13px', lineHeight: 1.4, marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                            {g.title}
                          </h4>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                            <span style={{ color: 'var(--color-text-muted)' }}>{g.department ? g.department.split('(')[0] : 'DJB'} • {g.location?.ward || 'Ward 14'}</span>
                            <span style={{
                              color: itemStatus === 'OVERDUE' ? '#DC2626' : (itemStatus === 'AT_RISK' ? '#D97706' : '#059669'),
                              fontWeight: 700
                            }}>
                              SLA: {itemHours}h ({itemStatus.replace('_', ' ')})
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (8 Cols): SECTION 23 GRIEVANCE DETAIL PAGE */}
            {activeAuthorityTab === 'detail' && (
              <div style={{ gridColumn: 'span 8' }} className="hero-right-col">
                <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
                  
                  {/* Header Bar of Selected Case (Section 23) */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="font-mono-numbers" style={{ fontSize: '13px', fontWeight: 800, background: '#F1F5F9', padding: '4px 10px', borderRadius: '4px' }}>
                        GRIEVANCE #{activeItem.id}
                      </span>
                      <span className="category-pill">{activeItem.category}</span>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        background: activeItem.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                        color: activeItem.urgency === 'CRITICAL' ? '#991B1B' : '#92400E'
                      }}>
                        ● {activeItem.urgency} PRIORITY
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        {activeItem.location?.ward || 'Ward 18'}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Citizen: <strong>{activeItem.citizenName || 'Aditya Verma'}</strong> ({activeItem.citizenPhone || '+91 98712-88210'})
                    </div>
                  </div>

                  <h2 style={{ fontSize: '24px', lineHeight: 1.3, marginBottom: '14px' }}>
                    {activeItem.title}
                  </h2>

                  {/* VISUAL JOURNEY TIMELINE (Section 23: Citizen Report → AI Understanding → Related Cases → Evidence → Recommendation → Officer Decision → Citizen Verification) */}
                  <div style={{ marginBottom: '20px' }}>
                    <VisualJourneyTimeline currentStep={activeItem.status === 'RESOLVED' ? 6 : 4} />
                  </div>

                  {/* SLA INTELLIGENCE METER */}
                  <div style={{
                    padding: '14px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: slaStatus === 'AT_RISK' ? '#FFFDF5' : (slaStatus === 'OVERDUE' ? '#FEF2F2' : '#F8F9FA'),
                    border: `1px solid ${slaStatus === 'AT_RISK' ? '#FDE68A' : (slaStatus === 'OVERDUE' ? '#FECACA' : 'var(--color-border-subtle)')}`,
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>SLA Target Window</span>
                        <strong className="font-mono-numbers" style={{ fontSize: '13px' }}>{targetSlaHours} Hours</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>Elapsed Time</span>
                        <strong className="font-mono-numbers" style={{ fontSize: '13px' }}>{elapsedHours} Hours</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>Remaining Time</span>
                        <strong className="font-mono-numbers" style={{ fontSize: '13px', color: slaStatus === 'OVERDUE' ? '#DC2626' : (slaStatus === 'AT_RISK' ? '#D97706' : '#059669') }}>
                          {remainingHours} Hours
                        </strong>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: slaStatus === 'OVERDUE' ? '#EF4444' : (slaStatus === 'AT_RISK' ? '#F59E0B' : '#059669'),
                        color: '#FFFFFF'
                      }}>
                        {slaStatus === 'AT_RISK' ? '⚠️ AT RISK OF BREACH' : (slaStatus === 'OVERDUE' ? '🚨 SLA BREACHED' : '✓ ON TRACK')}
                      </span>
                      <WhyExplainer
                        label="SLA Formula"
                        title="SLA Computation Factors"
                        reasons={[
                          'Category: Water & Sewage standard turnaround is 12 hours',
                          'Ward vulnerability score: Elevated (school zone)',
                          'Priority multiplier applied: 1.25x'
                        ]}
                        align="right"
                      />
                    </div>
                  </div>

                  {/* Formal Workflow Progression Stepper */}
                  <div style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: '#F8F9FA',
                    border: '1px solid var(--color-border-subtle)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <GitBranch style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                        <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-primary)' }}>
                          Formal Workflow Stage
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTransitionModal(true)}
                        className="btn-secondary btn-sm"
                        style={{ height: '28px', fontSize: '11px' }}
                      >
                        Advance Status →
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', overflowX: 'auto', gap: '4px', paddingBottom: '4px' }}>
                      {workflowStages.map((stage, idx) => {
                        const isPassed = idx < currentStatusIndex;
                        const isCurrent = idx === currentStatusIndex;
                        return (
                          <div key={stage.key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <div style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              background: isCurrent ? 'var(--color-primary)' : (isPassed ? '#DCFCE7' : '#FFFFFF'),
                              color: isCurrent ? '#FFFFFF' : (isPassed ? '#15803D' : 'var(--color-text-muted)'),
                              border: isCurrent ? 'none' : '1px solid rgba(15,23,42,0.08)',
                              fontSize: '10px',
                              fontWeight: 700,
                              whiteSpace: 'nowrap'
                            }}>
                              {isPassed ? '✓ ' : ''}{stage.label}
                            </div>
                            {idx < workflowStages.length - 1 && (
                              <span style={{ color: 'var(--color-border-medium)', fontSize: '10px' }}>›</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Toolbar: Clarify, Reassign, Escalate, Resolve */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexWrap: 'wrap',
                    padding: '10px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: '#FFFFFF',
                    border: '1px solid var(--color-border-subtle)',
                    marginBottom: '20px'
                  }}>
                    <button
                      type="button"
                      onClick={handleAcceptRecommendation}
                      className="btn-primary btn-sm"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      <Check style={{ width: '13px', height: '13px' }} />
                      <span>Accept SOP & Dispatch Crew</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowClarificationModal(true)}
                      className="btn-secondary btn-sm"
                      style={{ borderColor: '#FCD34D', color: '#B45309' }}
                    >
                      <MessageSquare style={{ width: '13px', height: '13px' }} />
                      <span>Request Info</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowReassignModal(true)}
                      className="btn-secondary btn-sm"
                    >
                      <Users style={{ width: '13px', height: '13px' }} />
                      <span>Reassign</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowEscalateModal(true)}
                      className="btn-secondary btn-sm"
                      style={{ borderColor: '#FECACA', color: '#B91C1C' }}
                    >
                      <AlertOctagon style={{ width: '13px', height: '13px' }} />
                      <span>Escalate</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowResolutionModal(true)}
                      className="btn-secondary btn-sm"
                      style={{ borderColor: '#86EFAC', color: '#14532D', marginLeft: 'auto' }}
                    >
                      <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                      <span>Attach Evidence & Resolve</span>
                    </button>
                  </div>

                  {/* Status Banner after action */}
                  {dispatchStatus && (
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)',
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      color: '#065F46',
                      fontSize: '12px',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '16px'
                    }}>
                      <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                      <span>Action processed successfully: {dispatchStatus}</span>
                    </div>
                  )}

                  {/* Deep Inspection Sub-Tabs */}
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'recommendation', label: 'Resolution Intelligence' },
                      { id: 'brief', label: 'Citizen Report & DNA' },
                      { id: 'duplicates', label: `Duplicate Review (${liveAnalysis.duplicateCandidates?.length || 0})` },
                      { id: 'verification', label: 'Resolution Verification' },
                      { id: 'history', label: `Historical Precedents (${liveAnalysis.historicalCases?.length || 0})` },
                      { id: 'notes', label: `Internal Notes (${activeItem.internalNotes?.length || 0})` }
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDetailSubTab(t.id)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          border: 'none',
                          background: detailSubTab === t.id ? 'var(--color-primary)' : '#F1F5F9',
                          color: detailSubTab === t.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                          cursor: 'pointer'
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* SUB-TAB 1: SECTION 24 RESOLUTION INTELLIGENCE CARD */}
                  {detailSubTab === 'recommendation' && (
                    <div style={{ marginBottom: '20px' }}>
                      <ResolutionIntelligenceCard
                        title="RESOLUTION INTELLIGENCE"
                        recommendedAction={liveAnalysis.aiRecommendation?.recommendedAction || "Inspect drainage infrastructure before initiating road resurfacing."}
                        standardOperatingProcedure={liveAnalysis.aiRecommendation?.standardOperatingProcedure || "Municipal Standard Operating Procedure Sec-4B"}
                        estimatedDuration="6 Hours"
                        whyPoints={[
                          `${liveAnalysis.duplicateCandidates?.length || 12} similar complaints recorded in ${activeItem.location?.ward || 'Ward 18'}`,
                          "3 nearby locations experiencing secondary drainage overflow",
                          "2 previous related drainage repairs logged in municipal ledger",
                          "Relevant standard operating procedure found and verified",
                          "Location clustering pattern detected across adjacent transit corridor"
                        ]}
                        supportingEvidence={[
                          { label: `${liveAnalysis.duplicateCandidates?.length || 12} Similar Cases`, tag: activeItem.location?.ward || 'Ward 18' },
                          { label: "Relevant Policy", tag: "SOP Sec-4B" },
                          { label: "Previous Resolution", tag: "Case #JS-0891" },
                          { label: "Location Pattern", tag: "Drainage Backpressure" }
                        ]}
                        engineeringReasoning={liveAnalysis.aiRecommendation?.reasoning || "Sub-surface inspection prevents premature resurfacing failures."}
                        potentialSlaRisk={liveAnalysis.aiRecommendation?.potentialSlaImplications || "Dispatch can be executed within the 12h SLA deadline."}
                        decisionStatus={dispatchStatus}
                        onApprove={handleAcceptRecommendation}
                        onModify={() => {
                          setModifiedSopText(liveAnalysis.aiRecommendation?.recommendedAction || '');
                          setShowModifyModal(true);
                        }}
                        onRequestMoreEvidence={() => setShowClarificationModal(true)}
                      />
                    </div>
                  )}

                  {/* SUB-TAB 2: CITIZEN REPORT & GRIEVANCE DNA */}
                  {detailSubTab === 'brief' && (
                    <div>
                      {/* Original Citizen Submission */}
                      <div style={{
                        padding: '16px 18px',
                        borderRadius: 'var(--radius-md)',
                        background: '#F8F9FA',
                        border: '1px solid var(--color-border-subtle)',
                        marginBottom: '18px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                            Original Citizen Submission ({liveAnalysis.detectedLang}):
                          </span>
                          <span style={{ fontSize: '10px', color: '#059669', fontWeight: 700 }}>
                            ✓ Verbatim Record Preserved
                          </span>
                        </div>
                        <p style={{ fontSize: '14px', color: 'var(--color-text-primary)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                          "{activeItem.descriptionRaw || activeItem.title}"
                        </p>
                        {liveAnalysis.translatedText && liveAnalysis.translatedText !== activeItem.descriptionRaw && (
                          <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(15,23,42,0.06)', fontSize: '12px' }}>
                            <strong style={{ color: 'var(--color-primary)' }}>Official English Translation: </strong>
                            <span style={{ color: 'var(--color-text-secondary)' }}>"{liveAnalysis.translatedText}"</span>
                          </div>
                        )}
                      </div>

                      {/* Classification Grid */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                        gap: '12px',
                        padding: '14px',
                        borderRadius: 'var(--radius-md)',
                        background: '#FFFFFF',
                        border: '1px solid var(--color-border-medium)',
                        marginBottom: '18px',
                        fontSize: '12px'
                      }}>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Department</span>
                          <strong style={{ color: 'var(--color-primary)' }}>{liveAnalysis.department}</strong>
                          <span style={{ fontSize: '10px', color: '#059669', display: 'block' }}>{liveAnalysis.confidence}% Confidence</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Subcategory</span>
                          <strong>{liveAnalysis.subcategory}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Priority</span>
                          <strong style={{ color: activeItem.urgency === 'CRITICAL' ? '#DC2626' : '#D97706' }}>{liveAnalysis.priority}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 700 }}>Severity</span>
                          <strong style={{ color: activeItem.urgency === 'CRITICAL' ? '#DC2626' : '#D97706' }}>{activeItem.urgency} ({activeItem.urgencyScore || 94})</strong>
                        </div>
                      </div>

                      {/* Grievance DNA Component */}
                      <GrievanceDnaCard dna={activeItem.grievanceDna} compact={false} />
                    </div>
                  )}

                  {/* SUB-TAB 3: DUPLICATE CANDIDATES & HUMAN-IN-THE-LOOP REVIEW */}
                  {detailSubTab === 'duplicates' && (
                    <div>
                      <div style={{
                        padding: '12px 16px',
                        borderRadius: 'var(--radius-md)',
                        background: '#EFF6FF',
                        border: '1px solid #BFDBFE',
                        fontSize: '12px',
                        color: '#1E40AF',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <ShieldCheck style={{ width: '18px', height: '18px', flexShrink: 0 }} />
                        <span>
                          <strong>Human Authorization Mandate: </strong>
                          AI clusters candidates by semantic distance but will NEVER automatically merge citizen tickets without officer review.
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {liveAnalysis.duplicateCandidates?.map((candidate) => (
                          <div
                            key={candidate.id}
                            style={{
                              padding: '16px',
                              borderRadius: 'var(--radius-md)',
                              background: '#FFFFFF',
                              border: `1px solid ${candidate.matchClassification === 'LIKELY_DUPLICATE' ? '#FECACA' : '#E2E8F0'}`,
                              boxShadow: 'var(--shadow-xs)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong className="font-mono-numbers" style={{ fontSize: '13px' }}>{candidate.id}</strong>
                                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>by {candidate.citizenName}</span>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  background: candidate.matchClassification === 'LIKELY_DUPLICATE' ? '#FEF2F2' : (candidate.matchClassification === 'RELATED_COMPLAINT' ? '#FFFBEB' : '#EFF6FF'),
                                  color: candidate.badgeColor
                                }}>
                                  {candidate.matchBadge}
                                </span>
                              </div>

                              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                                Distance: {candidate.distanceMeters}m away
                              </span>
                            </div>

                            <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                              "{candidate.title}"
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>
                              <strong>Reasoning: </strong>{candidate.reason}
                            </p>

                            {/* Officer Actions on Candidate */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button
                                type="button"
                                onClick={() => handleDuplicateAction(activeItem.id, candidate.id, 'MERGE_AS_DUPLICATE', 'Confirmed identical pipeline fracture')}
                                className="btn-primary btn-sm"
                                style={{ fontSize: '11px', height: '30px' }}
                              >
                                ✓ Confirm Duplicate & Merge Cluster
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateAction(activeItem.id, candidate.id, 'LINK_AS_RELATED', 'Confirmed related downstream effect')}
                                className="btn-secondary btn-sm"
                                style={{ fontSize: '11px', height: '30px' }}
                              >
                                🔗 Link as Related Incident
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDuplicateAction(activeItem.id, candidate.id, 'MARK_INDEPENDENT', 'Confirmed separate issue')}
                                className="btn-secondary btn-sm"
                                style={{ fontSize: '11px', height: '30px', color: 'var(--color-text-muted)' }}
                              >
                                Keep Independent
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 4: SECTION 20 RESOLUTION VERIFICATION */}
                  {detailSubTab === 'verification' && (
                    <div>
                      <ResolutionVerificationCard
                        grievanceId={activeItem.id}
                        title={activeItem.title}
                        isResolved={activeItem.status === 'RESOLVED'}
                        remediationNotes={resolutionNotes}
                        verifiedBy={currentOfficer.name}
                        onVerifyYes={() => {
                          setDispatchStatus('CITIZEN_CONFIRMED_FIXED');
                          try { confetti({ particleCount: 60, spread: 60 }); } catch(e) {}
                        }}
                        onVerifyNo={() => {
                          setDispatchStatus('CITIZEN_REOPENED_CASE');
                        }}
                      />
                    </div>
                  )}

                  {/* SUB-TAB 5: HISTORICAL PRECEDENTS */}
                  {detailSubTab === 'history' && (
                    <div>
                      <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Previously Resolved Cases in this Infrastructure Sector</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                        JanSahayak vector matching retrieved these past municipal work orders for reference.
                      </p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {liveAnalysis.historicalCases?.map((hist) => (
                          <div key={hist.caseId} style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                              <strong>{hist.title} ({hist.caseId})</strong>
                              <span style={{ color: 'var(--color-text-muted)' }}>Resolved on {hist.dateResolved}</span>
                            </div>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                              <strong>SOP Used: </strong>{hist.sopUsed}
                            </p>
                            <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                              <strong>Action Taken: </strong>{hist.resolutionSummary}
                            </p>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              <span>Fix Duration: <strong>{hist.fixDurationHours}</strong></span>
                              <span>Quality Verification: <strong>{hist.chlorineResidualTest}</strong></span>
                              <span>Signoff Officer: <strong>{hist.officer}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* SUB-TAB 6: INTERNAL PERSONNEL NOTES */}
                  {detailSubTab === 'notes' && (
                    <div>
                      <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Personnel-Only Internal Case Log</h4>
                      
                      {/* Notes Feed */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                        {(!activeItem.internalNotes || activeItem.internalNotes.length === 0) ? (
                          <div style={{ padding: '16px', background: '#F8F9FA', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                            No internal notes recorded yet. Add an update below for the field crew.
                          </div>
                        ) : (
                          activeItem.internalNotes.map((note) => (
                            <div key={note.id} style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px', color: '#92400E' }}>
                                <strong>{note.author} ({note.designation})</strong>
                                <span>{note.timestamp}</span>
                              </div>
                              <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>{note.note}</p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Add Note Form */}
                      <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={internalNoteInput}
                          onChange={(e) => setInternalNoteInput(e.target.value)}
                          placeholder="Add confidential officer note (e.g. Traffic police clearance obtained)..."
                          style={{
                            flex: 1,
                            height: '38px',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--color-border-medium)',
                            padding: '0 10px',
                            fontSize: '12px',
                            background: '#FFFFFF'
                          }}
                        />
                        <button type="submit" className="btn-primary btn-sm">
                          Save Note
                        </button>
                      </form>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        )}

        {/* 6. CIVIC MAP TAB: SECTION 17 & 21 CIVIC INTELLIGENCE MAP */}
        {activeAuthorityTab === 'map' && (
          <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="category-pill" style={{ marginBottom: '6px' }}>
                  CIVIC INTELLIGENCE MAP
                </span>
                <h3 style={{ fontSize: '20px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Active Ward Boundaries & Emerging Hotspots
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Where are problems happening? Real-time spatial clustering with automated anomaly flags.
                </p>
              </div>

              <Link to="/admin" className="btn-primary btn-sm">
                Launch Full Municipal GIS Console →
              </Link>
            </div>

            {/* Map Canvas */}
            <div style={{
              height: '400px',
              borderRadius: 'var(--radius-md)',
              background: '#0B1914',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(16, 185, 129, 0.25) 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }} />

              {/* Simulated Hotspots */}
              {[
                { ward: 'Ward 14 (Rohini)', top: '28%', left: '32%', cases: 18, critical: true, cat: 'Water Supply' },
                { ward: 'Ward 18 (Shalimar Bagh)', top: '38%', left: '42%', cases: 12, critical: false, cat: 'Road Damage' },
                { ward: 'Ward 8 (Lajpat Nagar)', top: '65%', left: '60%', cases: 22, critical: false, cat: 'Electricity' },
                { ward: 'Ward 19 (Karol Bagh)', top: '48%', left: '48%', cases: 14, critical: false, cat: 'Sanitation' },
                { ward: 'Ward 5 (Kalkaji)', top: '78%', left: '45%', cases: 9, critical: true, cat: 'Water Supply' }
              ].map((spot, i) => (
                <div
                  key={i}
                  onClick={() => openInspectionForCase(activeItem?.id || 'GRV-2025-001')}
                  style={{
                    position: 'absolute',
                    top: spot.top,
                    left: spot.left,
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    zIndex: 10
                  }}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: spot.critical ? '#EF4444' : '#10B981',
                    border: '3px solid #FFFFFF',
                    boxShadow: spot.critical ? '0 0 20px rgba(239, 68, 68, 0.7)' : '0 0 16px rgba(16, 185, 129, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '11px'
                  }}>
                    {spot.cases}
                  </div>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    background: 'rgba(11, 25, 20, 0.9)',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.15)'
                  }}>
                    {spot.ward} • {spot.cat}
                  </span>
                </div>
              ))}

              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(11, 25, 20, 0.9)',
                padding: '8px 14px',
                borderRadius: '6px',
                border: '1px solid rgba(255,255,255,0.1)',
                fontSize: '11px',
                color: '#F8FAFC',
                display: 'flex',
                gap: '14px'
              }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  Emerging Cluster
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} />
                  Stabilized Ward
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: WORKFLOW STATUS TRANSITION */}
        {showTransitionModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleTransitionSubmit} className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Record Workflow Status Transition</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Every transition is logged with your username, role, and ISO timestamp.
              </p>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Target Status:
                </label>
                <select
                  value={targetNextStatus}
                  onChange={(e) => setTargetNextStatus(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                >
                  <option value="UNDER_REVIEW">UNDER REVIEW (Inspection Scheduled)</option>
                  <option value="INFORMATION_REQUIRED">INFORMATION REQUIRED (Awaiting Citizen)</option>
                  <option value="IN_PROGRESS">IN PROGRESS (Field Crew Active)</option>
                  <option value="ESCALATED">ESCALATED (Transferred to Superintending Engineer)</option>
                  <option value="RESOLVED">RESOLVED (Physical Remediation Complete)</option>
                  <option value="CLOSED">CLOSED (Signed Off)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Transition Reason / Work Log:
                </label>
                <textarea
                  rows={3}
                  value={transitionReason}
                  onChange={(e) => setTransitionReason(e.target.value)}
                  placeholder="e.g. Field crew dispatched with clamp replacement parts..."
                  style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '8px', fontSize: '12px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowTransitionModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Commit Status Change</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: CLARIFICATION REQUEST */}
        {showClarificationModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleClarificationSubmit} className="card" style={{ maxWidth: '500px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', color: '#92400E', marginBottom: '8px' }}>
                Request Additional Information from Citizen
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                This inquiry will be sent directly via SMS and WhatsApp to <strong>{activeItem.citizenName}</strong> ({activeItem.citizenPhone}).
              </p>
              <textarea
                rows={3}
                value={clarificationQuestion}
                onChange={(e) => setClarificationQuestion(e.target.value)}
                placeholder="e.g. Please clarify if the water contamination is only in the morning supply or continuous throughout the day..."
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #FCD34D',
                  padding: '10px',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowClarificationModal(false)} className="btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: '#D97706' }}>
                  Transmit Query to Citizen
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: RESOLUTION EVIDENCE & SIGNOFF */}
        {showResolutionModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleResolveSubmit} className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px' }}>
              <div className="category-pill" style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0', marginBottom: '8px' }}>
                OFFICIAL WORK ORDER CLOSURE
              </div>
              <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>
                Attach Resolution Evidence & Sign Off
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Certify that the defect has been remediated according to municipal quality standards.
              </p>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Field Engineer Resolution Summary:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  style={{
                    width: '100%',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-medium)',
                    padding: '10px',
                    fontSize: '13px'
                  }}
                  required
                />
              </div>

              {/* Photo Evidence Verification */}
              <div style={{
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                background: '#F0FDF4',
                border: '1px solid #BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: '#15803D',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                  <span>Completion Photo Attached: <strong>clamp_repair_verified.jpg</strong></span>
                </div>
                <span style={{ fontSize: '11px', fontWeight: 700 }}>2.1 MB</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowResolutionModal(false)} className="btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: '#059669' }}>
                  Confirm Verified Resolution
                </button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: REASSIGN */}
        {showReassignModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleReassignSubmit} className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Reassign Grievance Jurisdiction</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Transfer ownership to another field officer or municipal department.
              </p>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Target Field Officer:
                </label>
                <select
                  value={reassignOfficer}
                  onChange={(e) => setReassignOfficer(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                >
                  <option value="Er. Vivek Nambiar (AEE Civil Lines)">Er. Vivek Nambiar (AEE Civil Lines)</option>
                  <option value="Er. Meenakshi Roy (AEE South Zone)">Er. Meenakshi Roy (AEE South Zone)</option>
                  <option value="Er. Tariq Ahmad (AEE East Zone)">Er. Tariq Ahmad (AEE East Zone)</option>
                  <option value="Er. Rajesh K. Meena (PWD Executive)">Er. Rajesh K. Meena (PWD Executive)</option>
                </select>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Reassignment Justification:
                </label>
                <input
                  type="text"
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowReassignModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Confirm Reassignment</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: ESCALATE */}
        {showEscalateModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleEscalateSubmit} className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
              <div className="category-pill" style={{ background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA', marginBottom: '8px' }}>
                CRITICAL SUPERVISORY ESCALATION
              </div>
              <h3 style={{ fontSize: '18px', color: '#991B1B', marginBottom: '8px' }}>
                Escalate to Superintending Engineer
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Escalates priority to Tier-1 Emergency. Immediate SMS broadcast dispatched to department chief.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Escalation Reason / Risk Assessment:
                </label>
                <textarea
                  rows={3}
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  style={{ width: '100%', borderRadius: '4px', border: '1px solid #FCA5A5', padding: '10px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowEscalateModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: '#DC2626' }}>Confirm Emergency Escalation</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: MODIFY RECOMMENDATION */}
        {showModifyModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleModifyRecommendationSubmit} className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Modify Standard AI Work Order</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                Adjust the primary work order or equipment based on field survey conditions.
              </p>
              <textarea
                rows={4}
                value={modifiedSopText}
                onChange={(e) => setModifiedSopText(e.target.value)}
                style={{ width: '100%', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '10px', fontSize: '13px', marginBottom: '16px' }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowModifyModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Apply Customized SOP</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL: REJECT RECOMMENDATION */}
        {showRejectModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11, 25, 20, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <form onSubmit={handleRejectRecommendationSubmit} className="card" style={{ maxWidth: '480px', width: '100%', padding: '28px' }}>
              <h3 style={{ fontSize: '18px', color: '#B91C1C', marginBottom: '8px' }}>Reject AI Resolution Recommendation</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                State why the suggested standard operating procedure does not apply to this case.
              </p>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Existing pipeline is 300mm ductile iron, not 100mm cast iron..."
                style={{ width: '100%', borderRadius: '4px', border: '1px solid #FECACA', padding: '10px', fontSize: '13px', marginBottom: '16px' }}
                required
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowRejectModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: '#DC2626' }}>Confirm Rejection</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
