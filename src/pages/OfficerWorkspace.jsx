import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
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
  Compass,
  Download,
  Star,
  Plus,
  Network,
  BarChart3,
  CheckSquare,
  ClipboardList,
  Flame,
  Radio,
  Workflow
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PERMISSIONS } from '../utils/permissions';
import { analyzeGrievanceInput } from '../services/aiEngine';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import WhyExplainer from '../components/common/WhyExplainer';
import VisualJourneyTimeline from '../components/common/VisualJourneyTimeline';
import ResolutionVerificationCard from '../components/common/ResolutionVerificationCard';
import ResolutionIntelligenceCard from '../components/common/ResolutionIntelligenceCard';
import ProblemSpreadMap from '../components/intelligence/ProblemSpreadMap';
import CivicMemoryCard from '../components/intelligence/CivicMemoryCard';
import CrossDepartmentMatrix from '../components/intelligence/CrossDepartmentMatrix';
import ActionSimulationCard from '../components/intelligence/ActionSimulationCard';
import LiveComplaintLinkageSection from '../components/intelligence/LiveComplaintLinkageSection';

export default function OfficerWorkspace({ defaultSection = 'dashboard' }) {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { 
    grievances = [], 
    requestInfo, 
    resolveGrievance, 
    addInternalNote, 
    reassignGrievance, 
    escalateGrievance, 
    actionRecommendation, 
    transitionStatus,
    handleDuplicateAction,
    user,
    can 
  } = useApp();
  
  // Unified Civic Officer Profile (combines field engineer + department admin credentials)
  const currentOfficer = (user && user.role !== 'citizen') ? user : {
    name: 'Er. Sanjay Sharma',
    designation: 'Executive Engineer & Department Administrator',
    department: 'Delhi Jal Board (DJB)',
    zone: 'Zone North-West (Rohini)',
    role: 'civic_officer'
  };

  // 7 Logical Workspace Sections per Architecture Mandate:
  // 1. dashboard | 2. my_work | 3. operations | 4. intelligence | 5. investigation | 6. coordination | 7. reports
  const querySection = searchParams.get('section');
  const initialSection = id ? 'investigation' : (querySection || defaultSection || 'dashboard');
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    if (querySection && querySection !== activeSection) {
      setActiveSection(querySection);
    }
  }, [querySection]);

  const switchSection = (sectionKey) => {
    setActiveSection(sectionKey);
    setSearchParams({ section: sectionKey });
  };

  // Selected grievance for deep workspace inspection
  const [selectedId, setSelectedId] = useState(id || grievances[0]?.id || 'DL-2026-W14-0892');
  const [searchQuery, setSearchQuery] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [detailSubTab, setDetailSubTab] = useState('recommendation'); // 'recommendation' | 'brief' | 'duplicates' | 'verification' | 'history' | 'notes' | 'evidence'
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [reportExported, setReportExported] = useState(false);

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

  // Department Admin Roster State (Preserved & Integrated from DeptAdmin)
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerZone, setNewOfficerZone] = useState('');
  const [officerRoster, setOfficerRoster] = useState([
    { name: 'Er. Sanjay Sharma', designation: 'Executive Engineer (Rohini)', activeCases: 4, resolvedThisMonth: 38, avgResolutionHours: '14.2h', rating: 4.8, status: 'ON_DUTY' },
    { name: 'Er. Vivek Nambiar', designation: 'AEE (Civil Lines)', activeCases: 6, resolvedThisMonth: 44, avgResolutionHours: '18.1h', rating: 4.6, status: 'ON_DUTY' },
    { name: 'Er. Meenakshi Roy', designation: 'AEE (South Zone)', activeCases: 3, resolvedThisMonth: 52, avgResolutionHours: '12.4h', rating: 4.9, status: 'ON_DUTY' },
    { name: 'Er. Tariq Ahmad', designation: 'AEE (East Zone)', activeCases: 5, resolvedThisMonth: 31, avgResolutionHours: '19.5h', rating: 4.4, status: 'FIELD_INSPECTION' }
  ]);

  // Emerging Issues Radar Data (Section 1: Dashboard)
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
      targetGrievanceId: 'DL-2026-W14-0892'
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
      targetGrievanceId: 'DL-2026-W08-0419'
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
      targetGrievanceId: 'DL-2026-W19-0312'
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
      targetGrievanceId: 'DL-2026-W14-0892'
    }
  ];

  // Reports data (from DeptAdmin)
  const categoryBreakdown = [
    { category: 'Drinking Water Contamination', count: 48, percentage: 42, slaTrend: '+4.2% faster' },
    { category: 'Main Pipeline Fracture / Burst', count: 32, percentage: 28, slaTrend: '+8.1% faster' },
    { category: 'Low Pressure in Supply Lines', count: 21, percentage: 18, slaTrend: 'On target' },
    { category: 'Billing / Meter Malfunction', count: 14, percentage: 12, slaTrend: '-2.1% delay' }
  ];

  const recurringHotspots = [
    { ward: 'Ward 14 (Rohini Sector 14)', issues: 18, primaryCause: '1988 Cast-Iron Supply Main degraded; capex replacement recommended', riskLevel: 'HIGH' },
    { ward: 'Ward 8 (Lajpat Nagar Ring Road)', issues: 9, primaryCause: 'Monsoon drainage backflow into secondary feeder', riskLevel: 'MEDIUM' },
    { ward: 'Ward 22 (Mayur Vihar Ph-1)', issues: 7, primaryCause: 'Commercial unauthorized suction pumps creating negative pressure', riskLevel: 'MEDIUM' }
  ];

  const feedbackRecords = [
    { citizen: 'Aditya Verma', ward: 'Ward 14', rating: 5, comment: 'Quick emergency clamp response within 4 hours. Water chlorine test verified before restoring flow.', date: 'Today' },
    { citizen: 'Pooja Malhotra', ward: 'Ward 8', rating: 5, comment: 'Officer Sanjay Sharma called personally on WhatsApp with progress photos. Very transparent.', date: 'Yesterday' },
    { citizen: 'Harish Bansal', ward: 'Ward 14', rating: 4, comment: 'Repaired the leak fast, but trench filling on the road took an extra day.', date: '2 days ago' }
  ];

  // Filtering Queues
  const filteredGrievances = useMemo(() => {
    return grievances.filter(g => {
      const matchesSearch = !searchQuery || 
        g.id?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        g.location?.ward?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesUrgency = urgencyFilter === 'ALL' || g.urgency === urgencyFilter;
      const matchesStatus = statusFilter === 'ALL' || g.status === statusFilter;
      return matchesSearch && matchesUrgency && matchesStatus;
    });
  }, [grievances, searchQuery, urgencyFilter, statusFilter]);

  // "My Work" Filter (Cases assigned directly to current officer or marked priority for their field team)
  const myWorkGrievances = useMemo(() => {
    return grievances.filter(g => {
      if (!g.officerName) return true;
      return g.officerName.includes('Sanjay') || g.officerName.includes('AEE') || g.status === 'IN_PROGRESS' || g.urgency === 'CRITICAL';
    });
  }, [grievances]);

  const activeItem = grievances.find(g => g.id === selectedId) || filteredGrievances[0] || grievances[0] || {
    id: 'DL-2026-W14-0892',
    title: 'Contaminated Drinking Water & Main Supply Pipe Leakage',
    category: 'Water Supply & Contamination',
    urgency: 'CRITICAL',
    urgencyScore: 94,
    status: 'IN_PROGRESS',
    department: 'Delhi Jal Board (DJB)',
    location: { ward: 'Ward 14 (Rohini Sector 14)' },
    citizenName: 'Aditya Verma',
    citizenPhone: '+91 98712-XXXXX'
  };

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

  // Disputes & Feedback
  const disputes = grievances.filter(g => g.status === 'DISPUTE_REOPENED');
  const criticalCases = grievances.filter(g => g.urgency === 'CRITICAL' && g.status !== 'RESOLVED');

  // Handlers
  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    await resolveGrievance(activeItem.id, resolutionNotes);
    setDispatchStatus('RESOLVED');
    setShowResolutionModal(false);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch(err) {}
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
    } catch(err) {}
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
    switchSection('investigation');
    setDispatchStatus(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
  };

  const handleAddOfficerSubmit = (e) => {
    e.preventDefault();
    if (!newOfficerName.trim()) return;
    setOfficerRoster(prev => [
      ...prev,
      {
        name: newOfficerName,
        designation: `AEE (${newOfficerZone || 'Central Zone'})`,
        activeCases: 0,
        resolvedThisMonth: 0,
        avgResolutionHours: '16.0h',
        rating: 5.0,
        status: 'ON_DUTY'
      }
    ]);
    setNewOfficerName('');
    setNewOfficerZone('');
    setShowAddOfficerModal(false);
  };

  const toggleOfficerStatus = (idx) => {
    setOfficerRoster(prev => prev.map((off, i) => {
      if (i === idx) {
        return {
          ...off,
          status: off.status === 'ON_DUTY' ? 'FIELD_INSPECTION' : 'ON_DUTY'
        };
      }
      return off;
    }));
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '28px' }}>
      <div className="container">

        {/* 1. CIVIC OFFICER CONSOLE HEADER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--color-divider)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="category-pill" style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0' }}>
                🏛️ CIVIC OFFICER CONSOLE • UNIFIED RESOLUTION & DEPT OPERATIONS
              </span>
              <span style={{ fontSize: '11px', background: '#F1F5F9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                Field + Dept Admin Merged
              </span>
            </div>
            <h1 style={{ fontSize: '28px', color: 'var(--color-text-primary)', margin: 0 }}>
              {currentOfficer.name}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginTop: '4px', margin: 0 }}>
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

            <button
              type="button"
              onClick={handleExportReport}
              className="btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Download style={{ width: '13px', height: '13px' }} />
              <span>{reportExported ? 'Report Downloaded ✓' : 'Export Municipal PDF/CSV'}</span>
            </button>

            <Link to="/admin" className="btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <MapPin style={{ width: '13px', height: '13px' }} />
              <span>Full Ward GIS</span>
            </Link>
          </div>
        </div>

        {/* 2. THE 7 MANDATED INFORMATION ARCHITECTURE TABS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '24px',
          background: '#F1F5F9',
          padding: '6px',
          borderRadius: 'var(--radius-lg)',
          overflowX: 'auto',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)'
        }}>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Activity, badge: null },
            { id: 'my_work', label: 'My Work', icon: CheckSquare, badge: myWorkGrievances.length },
            { id: 'operations', label: 'Department Operations', icon: SlidersHorizontal, badge: filteredGrievances.length },
            { id: 'intelligence', label: 'AI Intelligence', icon: Sparkles, badge: 'RAG' },
            { id: 'investigation', label: `Field Investigation`, icon: Eye, badge: `#${activeItem?.id?.slice(-4) || 'CASE'}` },
            { id: 'coordination', label: 'Coordination', icon: Network, badge: null },
            { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, badge: null }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => switchSection(tab.id)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? '#FFFFFF' : 'transparent',
                  color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                <Icon style={{ width: '15px', height: '15px', color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                <span>{tab.label}</span>
                {tab.badge !== null && (
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '1px 6px',
                    borderRadius: '9999px',
                    background: isActive ? 'var(--color-primary)' : '#E2E8F0',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-muted)'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* SECTION 1: DASHBOARD (Overview, Active/Critical Incidents, Emerging Radar) */}
        {/* ========================================================================= */}
        {activeSection === 'dashboard' && (
          <div>
            {/* 4 Summary Stat Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Department Active Queue
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', marginTop: '4px' }}>
                  {grievances.length}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Across Rohini & adjacent zones</span>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Critical Incidents
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#EF4444', marginTop: '4px' }}>
                  {criticalCases.length}
                </div>
                <span style={{ fontSize: '11px', color: '#EF4444' }}>Biological / Contamination priority</span>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Citizen Satisfaction Score
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#F59E0B', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  4.8 <Star style={{ width: '22px', height: '22px', fill: '#F59E0B', color: '#F59E0B' }} />
                </div>
                <span style={{ fontSize: '11px', color: '#059669' }}>Based on 145 verified citizen ratings</span>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  SLA Compliance (MTD)
                </span>
                <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', marginTop: '4px' }}>
                  94.8%
                </div>
                <span style={{ fontSize: '11px', color: '#059669' }}>Average turnaround: 14.2 hours</span>
              </div>
            </div>

            {/* Emerging Problems: Civic Pattern Radar */}
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

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#FEF2F2', color: '#DC2626', fontWeight: 700 }}>● Emerging (1)</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#FFFBEB', color: '#D97706', fontWeight: 700 }}>● Growing (1)</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#EFF6FF', color: '#2563EB', fontWeight: 700 }}>● Improving (1)</span>
                  <span style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '4px', background: '#ECFDF5', color: '#059669', fontWeight: 700 }}>● Resolved (1)</span>
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
                      position: 'relative'
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

            {/* Core Operational Inquiries Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '32px'
            }}>
              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  1. What Needs Attention?
                </span>
                <strong style={{ fontSize: '18px', color: '#DC2626', display: 'block', marginBottom: '4px' }}>
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
                <strong style={{ fontSize: '18px', color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>
                  Wards 12, 14 & 18
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Clustered in 400m radius around Mother Dairy & Outer Ring Road feeder line.
                </p>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  3. Emerging Pattern
                </span>
                <strong style={{ fontSize: '18px', color: '#D97706', display: 'block', marginBottom: '4px' }}>
                  Sub-surface Drainage Leak
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Road complaints in Ward 18 correlate directly with uninspected drainage backpressure.
                </p>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  4. Pending AI Approvals
                </span>
                <strong style={{ fontSize: '18px', color: '#059669', display: 'block', marginBottom: '4px' }}>
                  3 RAG Work Orders
                </strong>
                <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Awaiting engineer sign-off to authorize work orders without unnecessary duplicate dispatches.
                </p>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => switchSection('my_work')}
                className="btn-primary"
              >
                <CheckSquare style={{ width: '16px', height: '16px' }} />
                <span>Go to My Work ({myWorkGrievances.length} Assigned)</span>
              </button>

              <button
                type="button"
                onClick={() => switchSection('operations')}
                className="btn-secondary"
              >
                <SlidersHorizontal style={{ width: '16px', height: '16px' }} />
                <span>Department Operations Queue ({filteredGrievances.length})</span>
              </button>

              <button
                type="button"
                onClick={() => switchSection('intelligence')}
                className="btn-secondary"
                style={{ color: '#4338CA', borderColor: '#C7D2FE', background: '#EEF2FF' }}
              >
                <Sparkles style={{ width: '16px', height: '16px' }} />
                <span>Civic Intelligence Radar</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 2: MY WORK (Assigned Incidents, Investigations, Field Tasks)       */}
        {/* ========================================================================= */}
        {activeSection === 'my_work' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>My Active Work & Assigned Incidents</h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Cases specifically assigned to <strong>{currentOfficer.name}</strong> for field execution and verification.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => openInspectionForCase(myWorkGrievances[0]?.id || 'DL-2026-W14-0892')}
                  className="btn-primary btn-sm"
                >
                  <Eye style={{ width: '14px', height: '14px' }} />
                  <span>Inspect Top Priority Case</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {myWorkGrievances.map((g) => {
                const itemHours = g.slaHoursLeft || 12;
                const itemStatus = itemHours <= 0 ? 'OVERDUE' : (itemHours <= 6 ? 'AT_RISK' : 'ON_TRACK');

                return (
                  <div
                    key={g.id}
                    className="card"
                    style={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderLeft: g.urgency === 'CRITICAL' ? '4px solid #EF4444' : '4px solid var(--color-primary)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span className="font-mono-numbers" style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>
                          {g.id}
                        </span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: g.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                          color: g.urgency === 'CRITICAL' ? '#991B1B' : '#92400E'
                        }}>
                          ● {g.urgency}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '15px', lineHeight: 1.4, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                        {g.title}
                      </h3>

                      <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                        {g.descriptionRaw?.slice(0, 110) || g.title}...
                      </p>

                      <div style={{
                        padding: '10px',
                        background: '#F8FAFC',
                        borderRadius: '6px',
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        marginBottom: '14px'
                      }}>
                        <div>📍 <strong>Location: </strong>{g.location?.ward || 'Ward 14'}</div>
                        <div>👤 <strong>Citizen: </strong>{g.citizenName || 'Aditya Verma'} ({g.citizenPhone || '+91 98712'})</div>
                        <div style={{ color: itemStatus === 'OVERDUE' ? '#DC2626' : (itemStatus === 'AT_RISK' ? '#D97706' : '#059669'), fontWeight: 700 }}>
                          ⏱️ <strong>SLA: </strong>{itemHours}h Remaining ({itemStatus.replace('_', ' ')})
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => openInspectionForCase(g.id)}
                        className="btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        <Eye style={{ width: '13px', height: '13px' }} />
                        <span>Inspect Case</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedId(g.id);
                          setShowResolutionModal(true);
                        }}
                        className="btn-secondary btn-sm"
                        style={{ borderColor: '#86EFAC', color: '#15803D' }}
                        title="Quick complete & verify"
                      >
                        <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                        <span>Resolve</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 3: DEPARTMENT OPERATIONS (Full Queue, Assignment, Roster, SLA)    */}
        {/* ========================================================================= */}
        {activeSection === 'operations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Department Operations & Staff Workload</h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Manage cross-ward assignments, monitor field engineer shift status, and triage incoming grievances.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddOfficerModal(true)}
                className="btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>Add Officer to Roster</span>
              </button>
            </div>

            {/* Officer Workload & Roster Table (from DeptAdmin) */}
            <div className="card" style={{ padding: '24px', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '14px', color: 'var(--color-text-primary)' }}>
                Field Engineering Roster & Shift Status
              </h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                      <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>OFFICER</th>
                      <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>JURISDICTION</th>
                      <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>ACTIVE CASES</th>
                      <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>RESOLVED (MTD)</th>
                      <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>AVG SPEED</th>
                      <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>SATISFACTION</th>
                      <th style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>SHIFT STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {officerRoster.map((off, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '14px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                          {off.name}
                        </td>
                        <td style={{ padding: '14px', color: 'var(--color-text-secondary)' }}>
                          {off.designation}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 700, color: off.activeCases > 5 ? '#EF4444' : 'var(--color-text-primary)' }}>
                          {off.activeCases} Cases
                        </td>
                        <td style={{ padding: '14px', color: 'var(--color-text-primary)' }}>
                          {off.resolvedThisMonth}
                        </td>
                        <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', color: '#059669', fontWeight: 600 }}>
                          {off.avgResolutionHours}
                        </td>
                        <td style={{ padding: '14px', fontWeight: 600, color: '#D97706' }}>
                          ★ {off.rating}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <button
                            type="button"
                            onClick={() => toggleOfficerStatus(i)}
                            style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              background: off.status === 'ON_DUTY' ? '#ECFDF5' : '#FFFBEB',
                              color: off.status === 'ON_DUTY' ? '#065F46' : '#92400E',
                              border: '1px solid rgba(15,23,42,0.08)',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            ● {off.status} (Toggle)
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Department-Wide Grievance Queue & Assignment */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ fontSize: '16px', margin: 0 }}>
                  Department Incident Queue ({filteredGrievances.length} Active)
                </h3>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by ticket ID, citizen name, keyword, or ward..."
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--color-border-medium)',
                    padding: '0 12px 0 38px',
                    fontSize: '13px'
                  }}
                />
              </div>

              {/* Table of Department Incidents */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border-medium)' }}>
                      <th style={{ padding: '10px', color: 'var(--color-text-muted)' }}>CASE ID</th>
                      <th style={{ padding: '10px', color: 'var(--color-text-muted)' }}>TITLE & SUMMARY</th>
                      <th style={{ padding: '10px', color: 'var(--color-text-muted)' }}>WARD</th>
                      <th style={{ padding: '10px', color: 'var(--color-text-muted)' }}>URGENCY</th>
                      <th style={{ padding: '10px', color: 'var(--color-text-muted)' }}>STATUS</th>
                      <th style={{ padding: '10px', color: 'var(--color-text-muted)' }}>ASSIGNED TO</th>
                      <th style={{ padding: '10px', color: 'var(--color-text-muted)' }}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredGrievances.map((g) => (
                      <tr key={g.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '12px 10px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--color-primary)' }}>
                          {g.id}
                        </td>
                        <td style={{ padding: '12px 10px', maxWidth: '320px' }}>
                          <strong style={{ display: 'block', color: 'var(--color-text-primary)', marginBottom: '2px' }}>{g.title}</strong>
                          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>by {g.citizenName || 'Citizen'}</span>
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--color-text-secondary)' }}>
                          {g.location?.ward || 'Ward 14'}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            background: g.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                            color: g.urgency === 'CRITICAL' ? '#991B1B' : '#92400E'
                          }}>
                            {g.urgency}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 600, color: g.status === 'RESOLVED' ? '#059669' : '#D97706' }}>
                            {g.status}
                          </span>
                        </td>
                        <td style={{ padding: '12px 10px', color: 'var(--color-text-secondary)', fontSize: '12px' }}>
                          {g.officerName || 'Er. Sanjay Sharma'}
                        </td>
                        <td style={{ padding: '12px 10px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => openInspectionForCase(g.id)}
                              className="btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                              Inspect
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedId(g.id);
                                setShowReassignModal(true);
                              }}
                              className="btn-secondary btn-sm"
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                            >
                              Reassign
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 4: AI INTELLIGENCE (DNA, Linkage, Spread Map, Memory, Sim)        */}
        {/* ========================================================================= */}
        {activeSection === 'intelligence' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="category-pill" style={{ background: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE', marginBottom: '4px' }}>
                  PREDICTIVE CIVIC INTELLIGENCE ENGINE
                </span>
                <h2 style={{ fontSize: '22px', color: 'var(--color-text-primary)', margin: 0 }}>
                  Macro Civic Insights & Root Cause Correlation
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  Synthesizing active case <strong>#{activeItem.id}</strong> with ward sensor telemetry and historical work orders.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openInspectionForCase(activeItem.id)}
                className="btn-primary btn-sm"
              >
                <span>Inspect Active Case #{activeItem.id}</span>
              </button>
            </div>

            {/* 1. Problem Spread & Corridor Progression Map */}
            <ProblemSpreadMap incident={activeItem} />

            {/* 2. Cross-Department Matrix & Dependencies */}
            <CrossDepartmentMatrix incidentTitle={activeItem.title} />

            {/* 3. Action Simulation & Trade-Off Engine */}
            <ActionSimulationCard incidentId={activeItem.id} onSelectAction={(sim) => {
              setModifiedSopText(sim.description);
              setShowModifyModal(true);
            }} />

            {/* 4. Civic Memory & Historical Precedents */}
            <CivicMemoryCard />

            {/* 5. Active Case Grievance DNA */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '16px', margin: 0 }}>Grievance DNA & Semantic Feature Vector</h3>
                <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>Embeddings Model: All-MiniLM-L6-v2</span>
              </div>
              <GrievanceDnaCard dna={activeItem.grievanceDna} compact={false} />
            </div>

            {/* 6. Live Complaint Linkage & Duplicate Detection */}
            <LiveComplaintLinkageSection />
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 5: FIELD INVESTIGATION (Deep Inspection, Evidence, Notes, SOP)    */}
        {/* ========================================================================= */}
        {activeSection === 'investigation' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Left Column (4 Cols): Queue Selector */}
            <div style={{ gridColumn: 'span 4' }} className="hero-left-col">
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                    Active Cases ({filteredGrievances.length})
                  </span>
                  <span className="category-pill" style={{ height: '20px', fontSize: '10px' }}>
                    Select Case
                  </span>
                </div>

                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '15px', height: '15px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search case..."
                    style={{
                      width: '100%',
                      height: '36px',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 10px 0 32px',
                      fontSize: '12px'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '680px', overflowY: 'auto' }}>
                  {filteredGrievances.map((g) => {
                    const isSelected = g.id === activeItem.id;
                    return (
                      <div
                        key={g.id}
                        onClick={() => setSelectedId(g.id)}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-md)',
                          background: isSelected ? 'var(--color-accent-tint)' : '#FFFFFF',
                          border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span className="font-mono-numbers" style={{ fontSize: '11px', fontWeight: 700, color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                            {g.id}
                          </span>
                          <span style={{
                            fontSize: '9.5px',
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: '9999px',
                            background: g.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                            color: g.urgency === 'CRITICAL' ? '#991B1B' : '#92400E'
                          }}>
                            {g.urgency}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '12.5px', lineHeight: 1.3, marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                          {g.title}
                        </h4>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {g.location?.ward || 'Ward 14'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column (8 Cols): Deep Investigation Workspace */}
            <div style={{ gridColumn: 'span 8' }} className="hero-right-col">
              <div className="card" style={{ padding: '28px' }}>
                {/* Case Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="font-mono-numbers" style={{ fontSize: '13px', fontWeight: 800, background: '#F1F5F9', padding: '4px 10px', borderRadius: '4px' }}>
                      CASE #{activeItem.id}
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
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Citizen: <strong>{activeItem.citizenName || 'Aditya Verma'}</strong> ({activeItem.citizenPhone || '+91 98712-XXXXX'})
                  </div>
                </div>

                <h2 style={{ fontSize: '22px', lineHeight: 1.3, marginBottom: '14px' }}>
                  {activeItem.title}
                </h2>

                {/* Visual Journey Timeline */}
                <div style={{ marginBottom: '18px' }}>
                  <VisualJourneyTimeline currentStep={activeItem.status === 'RESOLVED' ? 6 : 4} />
                </div>

                {/* SLA Intelligence Bar */}
                <div style={{
                  padding: '12px 16px',
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
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>Target SLA</span>
                      <strong className="font-mono-numbers" style={{ fontSize: '13px' }}>{targetSlaHours} Hours</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>Elapsed</span>
                      <strong className="font-mono-numbers" style={{ fontSize: '13px' }}>{elapsedHours} Hours</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block' }}>Remaining</span>
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
                  padding: '14px',
                  borderRadius: 'var(--radius-md)',
                  background: '#F8F9FA',
                  border: '1px solid var(--color-border-subtle)',
                  marginBottom: '18px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <GitBranch style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-primary)' }}>
                        Formal Workflow Progression
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

                  <div style={{ display: 'flex', alignItems: 'center', overflowX: 'auto', gap: '4px', paddingBottom: '4px' }}>
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

                {/* Action Toolbar */}
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

                {/* Status Toast Message */}
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
                    <span>Action processed: {dispatchStatus}</span>
                  </div>
                )}

                {/* Deep Sub-Tabs */}
                <div style={{ display: 'flex', gap: '6px', borderBottom: '1px solid var(--color-divider)', paddingBottom: '8px', marginBottom: '18px', flexWrap: 'wrap' }}>
                  {[
                    { id: 'recommendation', label: 'Resolution Intelligence' },
                    { id: 'brief', label: 'Citizen Report & DNA' },
                    { id: 'evidence', label: 'Field Evidence & Photos' },
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
                        padding: '6px 12px',
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

                {/* SUB-TAB 1: RESOLUTION INTELLIGENCE */}
                {detailSubTab === 'recommendation' && (
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
                )}

                {/* SUB-TAB 2: CITIZEN REPORT & DNA */}
                {detailSubTab === 'brief' && (
                  <div>
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

                    <GrievanceDnaCard dna={activeItem.grievanceDna} compact={false} />
                  </div>
                )}

                {/* SUB-TAB 3: EVIDENCE GALLERY & PHOTOS */}
                {detailSubTab === 'evidence' && (
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Field Evidence & Geotagged Inspections</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                      <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ height: '140px', background: '#0B1914', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6EE7B7' }}>
                          <Camera style={{ width: '32px', height: '32px' }} />
                        </div>
                        <div style={{ padding: '10px', fontSize: '11px' }}>
                          <strong>Intake Photo: Leaking Main Pipe</strong>
                          <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>Uploaded by citizen • Lat: 28.7189, Lng: 77.1265</div>
                        </div>
                      </div>

                      <div style={{ border: '1px solid var(--color-border-subtle)', borderRadius: '8px', overflow: 'hidden' }}>
                        <div style={{ height: '140px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                          <FileCheck style={{ width: '32px', height: '32px' }} />
                        </div>
                        <div style={{ padding: '10px', fontSize: '11px' }}>
                          <strong>Field Repair Signoff: clamp_repair_verified.jpg</strong>
                          <div style={{ color: 'var(--color-text-muted)', marginTop: '2px' }}>Attached by AEE Sharma • 2.1 MB</div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowResolutionModal(true)}
                      className="btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Camera style={{ width: '13px', height: '13px' }} />
                      <span>Upload Field Photo / Inspection Document</span>
                    </button>
                  </div>
                )}

                {/* SUB-TAB 4: DUPLICATES */}
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

                {/* SUB-TAB 5: VERIFICATION */}
                {detailSubTab === 'verification' && (
                  <ResolutionVerificationCard
                    grievanceId={activeItem.id}
                    title={activeItem.title}
                    isResolved={activeItem.status === 'RESOLVED'}
                    remediationNotes={resolutionNotes}
                    verifiedBy={currentOfficer.name}
                    onVerifyYes={() => {
                      setDispatchStatus('CITIZEN_CONFIRMED_FIXED');
                      try { confetti({ particleCount: 60, spread: 60 }); } catch(err) {}
                    }}
                    onVerifyNo={() => {
                      setDispatchStatus('CITIZEN_REOPENED_CASE');
                    }}
                  />
                )}

                {/* SUB-TAB 6: HISTORY */}
                {detailSubTab === 'history' && (
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Previously Resolved Cases in this Sector</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {liveAnalysis.historicalCases?.map((hist) => (
                        <div key={hist.caseId} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                            <strong>{hist.title} ({hist.caseId})</strong>
                            <span style={{ color: 'var(--color-text-muted)' }}>Resolved on {hist.dateResolved}</span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                            <strong>SOP Used: </strong>{hist.sopUsed}
                          </p>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>
                            <strong>Action: </strong>{hist.resolutionSummary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SUB-TAB 7: INTERNAL NOTES */}
                {detailSubTab === 'notes' && (
                  <div>
                    <h4 style={{ fontSize: '14px', marginBottom: '12px' }}>Personnel-Only Confidential Notes Log</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                      {(!activeItem.internalNotes || activeItem.internalNotes.length === 0) ? (
                        <div style={{ padding: '16px', background: '#F8F9FA', borderRadius: 'var(--radius-md)', fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center' }}>
                          No internal notes recorded yet. Add an update below for the crew.
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
                          fontSize: '12px'
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
        )}

        {/* ========================================================================= */}
        {/* SECTION 6: COORDINATION (Cross-Department Matrix, Reassign, Escalation)   */}
        {/* ========================================================================= */}
        {activeSection === 'coordination' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h2 style={{ fontSize: '20px', margin: 0 }}>Inter-Agency & Cross-Department Coordination</h2>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                Manage interdependencies between Delhi Jal Board (DJB), Public Works (PWD), MCD, and Traffic Police.
              </p>
            </div>

            <CrossDepartmentMatrix incidentTitle={activeItem.title} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Direct Jurisdictional Reassignment</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Transfer primary ownership of a complaint to another sub-divisional officer or external department.
                </p>
                <button
                  type="button"
                  onClick={() => setShowReassignModal(true)}
                  className="btn-primary btn-sm"
                >
                  <Users style={{ width: '14px', height: '14px' }} />
                  <span>Reassign Active Case (#{activeItem.id})</span>
                </button>
              </div>

              <div className="card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '10px', color: '#991B1B' }}>Tier-1 Supervisory Escalation</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                  Escalate chronic delays or acute contamination emergencies directly to the Superintending Engineer.
                </p>
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(true)}
                  className="btn-secondary btn-sm"
                  style={{ borderColor: '#FECACA', color: '#DC2626' }}
                >
                  <AlertOctagon style={{ width: '14px', height: '14px' }} />
                  <span>Escalate Case (#{activeItem.id})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SECTION 7: REPORTS & ANALYTICS (Performance, SLA, Recurrence, Export)     */}
        {/* ========================================================================= */}
        {activeSection === 'reports' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', margin: 0 }}>Department Performance & Analytical Reporting</h2>
                <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', margin: '4px 0 0 0' }}>
                  SLA trends, recurring geographic hotspots, and citizen satisfaction audits for {currentOfficer.department}.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportReport}
                className="btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Download style={{ width: '14px', height: '14px' }} />
                <span>{reportExported ? 'Municipal Report Downloaded ✓' : 'Export Full Audit Report (PDF/CSV)'}</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Category Breakdown */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <TrendingUp style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
                  <h3 style={{ fontSize: '16px', margin: 0 }}>Category Volume & SLA Trend</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {categoryBreakdown.map((cat, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <strong>{cat.category}</strong>
                        <span style={{ color: 'var(--color-text-muted)' }}>{cat.count} cases ({cat.percentage}%)</span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '4px', background: '#F1F5F9', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${cat.percentage}%`, background: 'var(--color-primary)', borderRadius: '4px' }} />
                      </div>
                      <span style={{ fontSize: '11px', color: '#059669', display: 'block', marginTop: '2px' }}>
                        SLA Performance: {cat.slaTrend}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recurring Geographic Hotspots */}
              <div className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <MapPin style={{ width: '18px', height: '18px', color: '#EF4444' }} />
                  <h3 style={{ fontSize: '16px', margin: 0 }}>Recurring Geographic Hotspots (DBSCAN)</h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {recurringHotspots.map((hot, i) => (
                    <div key={i} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#FFFDF5', border: '1px solid #FDE68A' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '13px', color: '#92400E' }}>{hot.ward}</strong>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>{hot.issues} Corroborating Cases</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>
                        <strong>Root Cause: </strong>{hot.primaryCause}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Citizen Feedback & Disputes */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', margin: 0 }}>Verified Citizen Satisfaction & Quality Stream</h3>
                <span style={{ fontSize: '12px', color: '#059669', fontWeight: 700 }}>96.2% Favorable Feedback</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {feedbackRecords.map((f, i) => (
                  <div key={i} style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong>{f.citizen}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>({f.ward})</span>
                        <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 700 }}>
                          {'★'.repeat(f.rating)} ({f.rating}/5)
                        </span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{f.date}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', margin: 0, fontStyle: 'italic' }}>
                      "{f.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ALL PRESERVED MODALS & ACTION DIALOGS                                     */}
        {/* ========================================================================= */}

        {/* MODAL 1: WORKFLOW STATUS ADVANCEMENT */}
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
                Logged with officer credentials and ISO timestamp.
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
                  <option value="ESCALATED">ESCALATED (Superintending Engineer)</option>
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

        {/* MODAL 2: CLARIFICATION REQUEST */}
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
                Inquiry dispatched via SMS and WhatsApp to <strong>{activeItem.citizenName}</strong> ({activeItem.citizenPhone}).
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
                <button type="button" onClick={() => setShowClarificationModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: '#D97706' }}>Transmit Query to Citizen</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 3: RESOLUTION & COMPLETION PROOF */}
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
                  style={{ width: '100%', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border-medium)', padding: '10px', fontSize: '13px' }}
                  required
                />
              </div>

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
                <button type="button" onClick={() => setShowResolutionModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm" style={{ background: '#059669' }}>Confirm Verified Resolution</button>
              </div>
            </form>
          </div>
        )}

        {/* MODAL 4: REASSIGN */}
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

        {/* MODAL 5: ESCALATE */}
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

        {/* MODAL 6: MODIFY SOP */}
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

        {/* MODAL 7: REJECT SOP */}
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

        {/* MODAL 8: ADD OFFICER TO ROSTER (From DeptAdmin) */}
        {showAddOfficerModal && (
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
            <form onSubmit={handleAddOfficerSubmit} className="card" style={{ maxWidth: '440px', width: '100%', padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px', margin: 0 }}>Add Field Officer to Department Roster</h3>
                <button type="button" onClick={() => setShowAddOfficerModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Officer Full Name:
                </label>
                <input
                  type="text"
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  placeholder="e.g. Er. Aarti Sharma"
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  Zone / Jurisdiction:
                </label>
                <input
                  type="text"
                  value={newOfficerZone}
                  onChange={(e) => setNewOfficerZone(e.target.value)}
                  placeholder="e.g. West Delhi Sub-Division 4"
                  style={{ width: '100%', height: '38px', borderRadius: '4px', border: '1px solid var(--color-border-medium)', padding: '0 8px', fontSize: '13px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddOfficerModal(false)} className="btn-secondary btn-sm">Cancel</button>
                <button type="submit" className="btn-primary btn-sm">Add Officer to Roster</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
