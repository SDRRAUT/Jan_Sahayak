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
  Video,
  Layers,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  History,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { analyzeGrievanceInput } from '../services/aiEngine';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('brief'); // 'brief' | 'resolution' | 'duplicates' | 'history' | 'workflow' | 'notes'
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
    setDispatchStatus('DISPATCHED');
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

  return (
    <div className="section-spacing" style={{ paddingTop: '28px' }}>
      <div className="container">
        {/* Officer Context Bar */}
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
              OFFICER CASE WORKSPACE & SLA INTELLIGENCE
            </div>
            <h1 style={{ fontSize: '30px', color: 'var(--color-text-primary)' }}>
              {currentOfficer.name} ({currentOfficer.designation})
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
              {currentOfficer.department} • Assigned Jurisdiction: <strong>{currentOfficer.zone}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              background: slaStatus === 'AT_RISK' ? '#FFFBEB' : (slaStatus === 'OVERDUE' ? '#FEF2F2' : '#ECFDF5'),
              border: `1px solid ${slaStatus === 'AT_RISK' ? '#FDE68A' : (slaStatus === 'OVERDUE' ? '#FECACA' : '#A7F3D0')}`,
              color: slaStatus === 'AT_RISK' ? '#B45309' : (slaStatus === 'OVERDUE' ? '#991B1B' : '#065F46'),
              fontSize: '12px',
              fontWeight: 700
            }}>
              ● Case SLA: {remainingHours}h Left ({slaStatus.replace('_', ' ')})
            </div>
            <Link to="/admin" className="btn-secondary btn-sm">
              Open Ward Heatmap
            </Link>
          </div>
        </div>

        {/* Master-Detail Split Workspace Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* Left Column (4 Cols): Priority Triage Queue & Search Filter */}
          <div style={{ gridColumn: 'span 4' }} className="hero-left-col">
            <div className="card" style={{ padding: '20px' }}>
              
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-muted)' }}>
                  Grievance Inbox ({filteredGrievances.length})
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '720px', overflowY: 'auto' }}>
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
                        </div>

                        <h4 style={{ fontSize: '13px', lineHeight: 1.4, marginBottom: '6px', color: 'var(--color-text-primary)' }}>
                          {g.title}
                        </h4>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px' }}>
                          <span style={{ color: 'var(--color-text-muted)' }}>{g.department ? g.department.split('(')[0] : 'DJB'}</span>
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

          {/* Right Column (8 Cols): Deep Inspection Case Workspace */}
          <div style={{ gridColumn: 'span 8' }} className="hero-right-col">
            <div className="card" style={{ padding: '28px', marginBottom: '20px' }}>
              
              {/* Header Bar of Selected Case */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className="font-mono-numbers" style={{ fontSize: '13px', fontWeight: 700, background: '#F1F5F9', padding: '4px 10px', borderRadius: '4px' }}>
                    {activeItem.id}
                  </span>
                  <span className="category-pill">{activeItem.category}</span>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    background: activeItem.status === 'RESOLVED' ? '#ECFDF5' : (activeItem.status === 'ESCALATED' ? '#FEF2F2' : '#FFFBEB'),
                    color: activeItem.status === 'RESOLVED' ? '#065F46' : (activeItem.status === 'ESCALATED' ? '#991B1B' : '#92400E')
                  }}>
                    ● {activeItem.status.replace('_', ' ')}
                  </span>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Citizen: <strong>{activeItem.citizenName || 'Aditya Verma'}</strong> ({activeItem.citizenPhone || '+91 98712-88210'})
                </div>
              </div>

              <h2 style={{ fontSize: '24px', lineHeight: 1.3, marginBottom: '14px' }}>
                {activeItem.title}
              </h2>

              {/* 14. SLA INTELLIGENCE METER */}
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
                  {liveAnalysis.autoEscalationTriggered && (
                    <span style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700 }}>
                      [Auto-Escalated to Chief Engineer]
                    </span>
                  )}
                </div>
              </div>

              {/* 13. RESOLUTION WORKFLOW PROGRESSION STEPPER */}
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
                      Formal Resolution Workflow (Discovery Protocol)
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

                {/* Stepper Dots */}
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

              {/* Deep Inspection Tabs */}
              <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                {[
                  { id: 'brief', label: 'AI Case Brief & Original Complaint' },
                  { id: 'resolution', label: 'AI Recommendation (RAG SOP)' },
                  { id: 'duplicates', label: `Duplicate Candidates (${liveAnalysis.duplicateCandidates?.length || 0})` },
                  { id: 'history', label: `Historical Precedents (${liveAnalysis.historicalCases?.length || 0})` },
                  { id: 'workflow', label: `Workflow History (${activeItem.statusHistory?.length || 1})` },
                  { id: 'notes', label: `Internal Notes (${activeItem.internalNotes?.length || 0})` }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: 600,
                      border: 'none',
                      background: activeTab === t.id ? 'var(--color-primary)' : '#F1F5F9',
                      color: activeTab === t.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                      cursor: 'pointer'
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* TAB 1: AI Case Brief & Original Complaint */}
              {activeTab === 'brief' && (
                <div>
                  {/* Original Complaint Verbatim */}
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
                    gridTemplateColumns: 'repeat(4, 1fr)',
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

                  {/* AI 3-Bullet Brief */}
                  <div style={{
                    padding: '18px 20px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'linear-gradient(135deg, #F8F9FA 0%, #FFFFFF 100%)',
                    border: '1px solid rgba(14, 94, 58, 0.2)',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                      <Sparkles style={{ width: '15px', height: '15px', color: 'var(--color-primary)' }} />
                      <strong style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-primary)' }}>
                        AI Officer Executive Brief (Saved ~10 Min Reading Raw Report):
                      </strong>
                    </div>
                    <ul style={{ paddingLeft: '18px', fontSize: '13px', lineHeight: 1.7, color: 'var(--color-text-primary)', margin: 0 }}>
                      {activeItem.aiOfficerBrief ? (
                        activeItem.aiOfficerBrief.map((bullet, i) => (
                          <li key={i} style={{ marginBottom: '4px' }}>{bullet}</li>
                        ))
                      ) : (
                        <>
                          <li>Biological contamination hazard reported; drinking water mixed with sewage line runoff.</li>
                          <li>Joint crack at 100mm underground junction 40m south of Mother Dairy.</li>
                          <li>Cluster of 18 corroborating citizen complaints detected in 300m radius.</li>
                        </>
                      )}
                    </ul>
                  </div>

                  {/* Grievance DNA Component */}
                  <GrievanceDnaCard dna={activeItem.grievanceDna} compact={false} />
                </div>
              )}

              {/* TAB 2: AI Recommendation (RAG SOP) */}
              {activeTab === 'resolution' && (
                <div>
                  <div style={{
                    padding: '20px',
                    borderRadius: 'var(--radius-lg)',
                    background: '#F0FDF4',
                    border: '1px solid #BBF7D0',
                    marginBottom: '20px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="icon-squircle" style={{ width: '32px', height: '32px', background: '#DCFCE7' }}>
                          <FileCheck style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} />
                        </div>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#14532D' }}>
                            AI Recommended Action (RAG Retrieval)
                          </strong>
                          <span style={{ fontSize: '11px', color: '#166534', display: 'block' }}>
                            Derived from: {liveAnalysis.aiRecommendation?.standardOperatingProcedure}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, background: '#DCFCE7', color: '#15803D', padding: '4px 8px', borderRadius: '4px' }}>
                        Est. Fix: 6 Hours
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: '#166534', marginBottom: '12px', lineHeight: 1.5 }}>
                      <strong>Recommended Action: </strong>
                      {liveAnalysis.aiRecommendation?.recommendedAction}
                    </p>

                    <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#FFFFFF', border: '1px solid #86EFAC', fontSize: '12px', color: '#14532D', marginBottom: '14px' }}>
                      <strong>Engineering Reasoning: </strong>
                      {liveAnalysis.aiRecommendation?.reasoning}
                    </div>

                    {/* Supporting Evidence */}
                    <div style={{ marginBottom: '14px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Supporting Evidence & Telemetry:
                      </span>
                      <ul style={{ paddingLeft: '18px', fontSize: '12px', color: '#166534', margin: 0 }}>
                        {liveAnalysis.aiRecommendation?.supportingEvidence?.map((ev, i) => (
                          <li key={i}>{ev}</li>
                        ))}
                      </ul>
                    </div>

                    {/* SLA Implications */}
                    <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#FFFBEB', border: '1px solid #FDE68A', fontSize: '12px', color: '#92400E', marginBottom: '16px' }}>
                      <strong>Potential SLA Implications: </strong>
                      {liveAnalysis.aiRecommendation?.potentialSlaImplications}
                    </div>

                    {/* Decision Buttons (Accept, Modify, Reject) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px solid #DCFCE7' }}>
                      <button
                        type="button"
                        onClick={handleAcceptRecommendation}
                        className="btn-primary btn-sm"
                        style={{ background: '#15803D' }}
                      >
                        <Check style={{ width: '13px', height: '13px' }} />
                        <span>Accept Recommendation</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setModifiedSopText(liveAnalysis.aiRecommendation?.recommendedAction || '');
                          setShowModifyModal(true);
                        }}
                        className="btn-secondary btn-sm"
                        style={{ background: '#FFFFFF', borderColor: '#86EFAC', color: '#166534' }}
                      >
                        <Edit3 style={{ width: '13px', height: '13px' }} />
                        <span>Modify SOP / Work Order</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowRejectModal(true)}
                        className="btn-secondary btn-sm"
                        style={{ background: '#FFFFFF', borderColor: '#FECACA', color: '#B91C1C' }}
                      >
                        <X style={{ width: '13px', height: '13px' }} />
                        <span>Reject Recommendation</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Duplicate Candidates & Similar Complaints */}
              {activeTab === 'duplicates' && (
                <div>
                  {/* Human-in-the-loop guarantee banner */}
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
                      JanSahayk AI categorizes candidates by semantic distance but will NEVER automatically delete or merge citizen tickets without officer signoff.
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

              {/* TAB 4: Historical Precedents (RAG) */}
              {activeTab === 'history' && (
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Previously Resolved Cases in this Infrastructure Sector</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
                    JanSahayk vector matching retrieved these past municipal work orders for reference.
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
                          <span>Water Quality Verification: <strong>{hist.chlorineResidualTest}</strong></span>
                          <span>Signoff Officer: <strong>{hist.officer}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: Resolution Workflow History */}
              {activeTab === 'workflow' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <h4 style={{ fontSize: '14px' }}>Recorded Workflow State Transitions</h4>
                    <button
                      type="button"
                      onClick={() => setShowTransitionModal(true)}
                      className="btn-primary btn-sm"
                      style={{ fontSize: '11px' }}
                    >
                      + Record New Transition
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(!activeItem.statusHistory || activeItem.statusHistory.length === 0) ? (
                      <div style={{ padding: '14px', background: '#F8F9FA', borderRadius: 'var(--radius-md)', fontSize: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                          <strong>Initial Intake (SUBMITTED → AI_ANALYSED)</strong>
                          <span className="font-mono-numbers" style={{ color: 'var(--color-text-muted)' }}>Sep 16, 09:30 AM</span>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0 }}>
                          Actor: JanSahayk AI Autonomous Engine • Reason: Ingestion and Grievance DNA™ generated
                        </p>
                      </div>
                    ) : (
                      activeItem.statusHistory.map((hist) => (
                        <div key={hist.transitionId} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                            <strong style={{ color: 'var(--color-primary)' }}>
                              {hist.previousStatus} → {hist.newStatus}
                            </strong>
                            <span className="font-mono-numbers" style={{ color: 'var(--color-text-muted)' }}>{hist.timestamp}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', margin: '0 0 4px 0' }}>
                            "{hist.reason}"
                          </p>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                            Authorized by: <strong>{hist.actor}</strong> ({hist.role})
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: Internal Personnel Notes */}
              {activeTab === 'notes' && (
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
        </div>

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
                Every transition is cryptographically logged with your username and timestamp.
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
