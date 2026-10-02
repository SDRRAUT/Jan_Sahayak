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
  Workflow,
  LayoutGrid,
  List,
  Wrench,
  ChevronDown,
  ArrowUpRight,
  Smartphone,
  Phone,
  UserCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { PERMISSIONS } from '../utils/permissions';
import { analyzeGrievanceInput } from '../services/aiEngine';
import GrievanceDnaCard from '../components/common/GrievanceDnaCard';
import WhyExplainer from '../components/common/WhyExplainer';
import VisualJourneyTimeline from '../components/common/VisualJourneyTimeline';
import ProblemSpreadMap from '../components/intelligence/ProblemSpreadMap';
import CivicMemoryCard from '../components/intelligence/CivicMemoryCard';
import CrossDepartmentMatrix from '../components/intelligence/CrossDepartmentMatrix';
import ActionSimulationCard from '../components/intelligence/ActionSimulationCard';
import LiveComplaintLinkageSection from '../components/intelligence/LiveComplaintLinkageSection';
import EditorialComplaintCard, { ComplaintDetailModal } from '../components/common/EditorialComplaintCard';
import JanSuchnaModal from '../components/officer/JanSuchnaModal';
import TerritoryProblemModal from '../components/officer/TerritoryProblemModal';
import ComplaintStatusStoryModal from '../components/officer/ComplaintStatusStoryModal';
import SuggestedWorkersCard from '../components/officer/SuggestedWorkersCard';
import { maskCitizenName, maskCitizenPhone } from '../utils/privacy';

export default function OfficerWorkspace({ defaultSection = 'inbox' }) {
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
    janSuchnaList = [],
    user,
    workers = [],
    workerOrders = []
  } = useApp();

  // Modals state
  const [showTerritoryModal, setShowTerritoryModal] = useState(false);
  const [showJanSuchnaModal, setShowJanSuchnaModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [selectedModalGrievance, setSelectedModalGrievance] = useState(null);

  // Officer Profile
  const rawOfficer = (user && user.role !== 'citizen') ? user : {
    name: 'Er. Sanjay Sharma',
    designation: 'Executive Engineer & Department Administrator',
    department: 'PMC Water Supply Department',
    zone: 'Zone East (Wagholi Sub-Division, Pune)',
    role: 'civic_officer'
  };
  const currentOfficer = {
    ...rawOfficer,
    department: (rawOfficer.department && !rawOfficer.department.includes('Delhi') && !rawOfficer.department.includes('DJB'))
      ? rawOfficer.department
      : 'PMC Water Supply Department'
  };

  // 3 Streamlined Primary Views:
  // 1. 'inbox' (Triage & Queue) | 2. 'investigation' (Case Studio) | 3. 'operations' (Roster, Radar, Broadcasts & Reports)
  const queryCaseId = searchParams.get('caseId') || id;
  const querySection = searchParams.get('section');
  const querySubtab = searchParams.get('subtab');

  // Normalize legacy section names to the new 3-view architecture
  const normalizeSection = (sec) => {
    if (!sec) return 'inbox';
    if (sec === 'inbox' || sec === 'investigation' || sec === 'operations') return sec;
    if (sec === 'dashboard' || sec === 'my_work') return 'inbox';
    if (sec === 'intelligence' || sec === 'coordination' || sec === 'reports') return 'operations';
    return 'inbox';
  };

  const initialSection = queryCaseId || querySubtab 
    ? 'investigation' 
    : normalizeSection(querySection || defaultSection);

  const [activeView, setActiveView] = useState(initialSection);

  // Sync state with URL params
  useEffect(() => {
    if (queryCaseId) {
      setSelectedId(queryCaseId);
      if (!querySection) {
        setActiveView('investigation');
      }
    } else if (querySection) {
      setActiveView(normalizeSection(querySection));
    }
    if (querySubtab) {
      setDetailSubTab(querySubtab);
      setActiveView('investigation');
    }
  }, [querySection, queryCaseId, querySubtab]);

  const switchView = (viewKey) => {
    setActiveView(viewKey);
    setSearchParams({ section: viewKey });
  };

  // Selected case state
  const [selectedId, setSelectedId] = useState(queryCaseId || grievances[0]?.id || 'PN-2026-WAG-0102');

  useEffect(() => {
    if (queryCaseId && queryCaseId !== selectedId) {
      setSelectedId(queryCaseId);
    }
  }, [queryCaseId, selectedId]);

  // Filters & View Toggles for Inbox
  const [searchQuery, setSearchQuery] = useState('');
  const [inboxFilter, setInboxFilter] = useState('ALL'); // 'ALL' | 'CRITICAL' | 'SLA_RISK' | 'MY_WORK' | 'IN_PROGRESS' | 'RESOLVED'
  const [inboxViewMode, setInboxViewMode] = useState('table'); // 'table' | 'cards'

  // Subtabs for Case Studio (investigation)
  // 'action_plan' | 'workers' | 'resolve' | 'collaborate' | 'intelligence'
  const [detailSubTab, setDetailSubTab] = useState(querySubtab || 'action_plan');
  const [showJourneyTimeline, setShowJourneyTimeline] = useState(false);

  // Operations Sub-views:
  // 'roster' | 'radar' | 'broadcasts' | 'reports'
  const [opsSubView, setOpsSubView] = useState('roster');

  // Case Action Modals
  const [showClarificationModal, setShowClarificationModal] = useState(false);
  const [clarificationQuestion, setClarificationQuestion] = useState('');
  
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('Replacement clamp installed, line pressure normalized to 3.2 bar, and water quality chlorine test verified.');
  const [resolutionPhotoAttached, setResolutionPhotoAttached] = useState(false);

  const [showReassignModal, setShowReassignModal] = useState(false);
  const [reassignOfficer, setReassignOfficer] = useState('Er. Sachin Patil (EE PWD Pune)');
  const [reassignDepartment, setReassignDepartment] = useState(currentOfficer.department || 'PMC Water Supply Department');
  const [reassignReason, setReassignReason] = useState('Jurisdiction realignment for faster field arrival.');

  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [escalateReason, setEscalateReason] = useState('High-risk water contamination affecting school proximity.');

  const [showModifyModal, setShowModifyModal] = useState(false);
  const [modifiedSopText, setModifiedSopText] = useState('');

  const [showTransitionModal, setShowTransitionModal] = useState(false);
  const [targetNextStatus, setTargetNextStatus] = useState('IN_PROGRESS');
  const [transitionReason, setTransitionReason] = useState('');

  const [internalNoteInput, setInternalNoteInput] = useState('');
  const [dispatchStatus, setDispatchStatus] = useState(null);
  const [reportExported, setReportExported] = useState(false);

  // Field Team Roster State
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerZone, setNewOfficerZone] = useState('');
  const [officerRoster, setOfficerRoster] = useState([
    { name: 'Er. Sanjay Sharma', designation: 'Executive Engineer (Wagholi Water)', activeCases: 4, resolvedThisMonth: 38, avgResolutionHours: '14.2h', rating: 4.8, status: 'ON_DUTY' },
    { name: 'Er. Ramesh Shinde', designation: 'Sanitation Inspector (Baif Road)', activeCases: 6, resolvedThisMonth: 44, avgResolutionHours: '18.1h', rating: 4.6, status: 'ON_DUTY' },
    { name: 'Er. Sachin Patil', designation: 'Assistant Engineer (PWD Pune)', activeCases: 3, resolvedThisMonth: 52, avgResolutionHours: '12.4h', rating: 4.9, status: 'ON_DUTY' },
    { name: 'Er. Neha Singh', designation: 'Sub-Div Engineer (MSEDCL Wagholi)', activeCases: 5, resolvedThisMonth: 31, avgResolutionHours: '19.5h', rating: 4.4, status: 'FIELD_INSPECTION' }
  ]);

  // Live DB stats fallback
  const [liveStats, setLiveStats] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('jansahayk_token');
    if (!token) return;
    fetch('/api/stats/officer', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.stats) setLiveStats(data.stats);
      })
      .catch(() => {});
  }, []);

  const stats = {
    total: liveStats?.total ?? grievances.length,
    active: liveStats?.active ?? grievances.filter(g => g.status !== 'RESOLVED' && g.status !== 'CLOSED').length,
    resolved: liveStats?.resolved ?? grievances.filter(g => g.status === 'RESOLVED' || g.status === 'CLOSED').length,
    critical: liveStats?.critical ?? grievances.filter(g => g.urgency === 'CRITICAL' && g.status !== 'RESOLVED').length,
    slaAtRisk: liveStats?.slaAtRisk ?? grievances.filter(g => (g.slaHoursLeft !== undefined && g.slaHoursLeft <= 6) && g.status !== 'RESOLVED').length,
  };

  // Emerging Problems Radar Data
  const emergingIssues = [
    {
      id: 'ISSUE-01',
      title: 'Main Potable Water Pipe Burst & Pressure Collapse',
      category: 'Water Supply',
      image: '/civic-problems/water_pipe_leak.jpg',
      status: 'EMERGING',
      statusLabel: '🔴 Urgent Leak',
      badgeColor: '#DC2626',
      badgeBg: '#FEF2F2',
      badgeBorder: '#FECACA',
      wardsCount: 2,
      wards: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
      grievancesCount: 24,
      trend: '+68% in 48h',
      hypothesis: 'Water main joint burst under street surface near Ivy Estate Entrance.',
      recommendedAction: 'Isolate Wagholi ESR gate valve and install 200mm electrofusion sleeve clamp.',
      targetGrievanceId: 'PN-2026-WAG-0102'
    },
    {
      id: 'ISSUE-02',
      title: 'Deep Road Crater & Broken Drain Grate',
      category: 'Roads & Infrastructure',
      image: '/civic-problems/pothole_broken_drain_grate.jpg',
      status: 'GROWING',
      statusLabel: '🟠 Safety Hazard',
      badgeColor: '#D97706',
      badgeBg: '#FFFBEB',
      badgeBorder: '#FDE68A',
      wardsCount: 2,
      wards: 'Wagholi Ward 27 (Nagar Road Highway)',
      grievancesCount: 15,
      trend: '+34% this week',
      hypothesis: 'Heavy traffic runoff washed subsoil; storm drain grate collapsed under axle weight.',
      recommendedAction: 'Dispatch PWD rapid patching truck with cast iron grate and cold asphalt.',
      targetGrievanceId: 'PN-2026-WAG-0105'
    },
    {
      id: 'ISSUE-03',
      title: 'Massive Roadside Garbage Dump & Market Trash',
      category: 'Sanitation',
      image: '/civic-problems/roadside_garbage_heap.jpg',
      status: 'IMPROVING',
      statusLabel: '🔵 Under Clearance',
      badgeColor: '#2563EB',
      badgeBg: '#EFF6FF',
      badgeBorder: '#BFDBFE',
      wardsCount: 1,
      wards: 'Wagholi Ward 28 (Baif Road Market Yard)',
      grievancesCount: 18,
      trend: 'Down 40% after extra compactor',
      hypothesis: 'Baif Road vegetable market waste backlog; compactor clearing volume.',
      recommendedAction: 'Deploy 12MT compactor truck and apply disinfectant lime wash along market street.',
      targetGrievanceId: 'PN-2026-WAG-0101'
    },
    {
      id: 'ISSUE-04',
      title: 'Severe Stormwater Drain Clogging & Road Flooding',
      category: 'Drainage & Waterlogging',
      image: '/civic-problems/monsoon_waterlogging_flood.jpg',
      status: 'RESOLVED',
      statusLabel: '🟢 Active Mitigation',
      badgeColor: '#059669',
      badgeBg: '#ECFDF5',
      badgeBorder: '#A7F3D0',
      wardsCount: 1,
      wards: 'Wagholi Ward 30 (Domkhel Road)',
      grievancesCount: 19,
      trend: 'PMC super-sucker unit deployed',
      hypothesis: 'Blocked underground culvert combined with open storm drain causing knee-deep flooding.',
      recommendedAction: 'Operate dewatering pump and install high-visibility warning barricades.',
      targetGrievanceId: 'PN-2026-WAG-0103'
    }
  ];

  // Reports data
  const categoryBreakdown = [
    { category: 'Drinking Water Contamination', count: 48, percentage: 42, slaTrend: '+4.2% faster' },
    { category: 'Main Pipeline Fracture / Burst', count: 32, percentage: 28, slaTrend: '+8.1% faster' },
    { category: 'Low Pressure in Supply Lines', count: 21, percentage: 18, slaTrend: 'On target' },
    { category: 'Billing / Meter Malfunction', count: 14, percentage: 12, slaTrend: '-2.1% delay' }
  ];

  const recurringHotspots = [
    { ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)', issues: 24, primaryCause: 'High-pressure surge along Kesnand feeder main; electrofusion realignment recommended', riskLevel: 'HIGH' },
    { ward: 'Wagholi Ward 28 (Baif Road Market Yard)', issues: 18, primaryCause: 'Market waste dumping into storm culvert; closed hook-loader bin needed', riskLevel: 'HIGH' },
    { ward: 'Wagholi Ward 27 (Nagar Road Highway)', issues: 12, primaryCause: 'Heavy commercial vehicle axle load degrading asphalt sub-base', riskLevel: 'MEDIUM' }
  ];

  const feedbackRecords = [
    { citizen: 'Santosh Gawade', ward: 'Wagholi Ward 29', rating: 5, comment: 'Quick emergency clamp response within 4 hours. Water chlorine test verified before restoring flow.', date: 'Today' },
    { citizen: 'Priyanka Jadhav', ward: 'Wagholi Ward 28', rating: 5, comment: 'Officer Sanjay Sharma called personally with progress photos. Very transparent.', date: 'Yesterday' },
    { citizen: 'Anand Rathi', ward: 'Wagholi Ward 29', rating: 4, comment: 'Repaired the leak fast, but trench filling on the road took an extra day.', date: '2 days ago' }
  ];

  // Filtering Queues
  const filteredGrievances = useMemo(() => {
    return grievances.filter(g => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !searchQuery || 
        g.id?.toLowerCase().includes(q) || 
        g.title?.toLowerCase().includes(q) || 
        g.location?.ward?.toLowerCase().includes(q) ||
        g.citizenName?.toLowerCase().includes(q);

      let matchesFilter = true;
      if (inboxFilter === 'CRITICAL') matchesFilter = g.urgency === 'CRITICAL' && g.status !== 'RESOLVED';
      else if (inboxFilter === 'SLA_RISK') matchesFilter = (g.slaHoursLeft !== undefined && g.slaHoursLeft <= 6) && g.status !== 'RESOLVED';
      else if (inboxFilter === 'MY_WORK') matchesFilter = !g.officerName || g.officerName.includes('Sanjay') || g.status === 'IN_PROGRESS' || g.urgency === 'CRITICAL' || g.createdAt === 'Just now';
      else if (inboxFilter === 'IN_PROGRESS') matchesFilter = g.status === 'IN_PROGRESS';
      else if (inboxFilter === 'RESOLVED') matchesFilter = g.status === 'RESOLVED' || g.status === 'CLOSED';

      return matchesSearch && matchesFilter;
    }).sort((a, b) => {
      if (queryCaseId && a.id === queryCaseId) return -1;
      if (queryCaseId && b.id === queryCaseId) return 1;

      // Prioritize brand new submissions (created "Just now" or in the past 2 hours) so they immediately catch officer attention
      const isNewA = a.createdAt === 'Just now' || (Date.now() - new Date(a.timestamp || 0).getTime() < 2 * 3600 * 1000);
      const isNewB = b.createdAt === 'Just now' || (Date.now() - new Date(b.timestamp || 0).getTime() < 2 * 3600 * 1000);
      if (isNewA && !isNewB) return -1;
      if (!isNewA && isNewB) return 1;

      if (a.urgency === 'CRITICAL' && b.urgency !== 'CRITICAL') return -1;
      if (b.urgency === 'CRITICAL' && a.urgency !== 'CRITICAL') return 1;
      const timeA = new Date(a.timestamp || 0).getTime();
      const timeB = new Date(b.timestamp || 0).getTime();
      return timeB - timeA;
    });
  }, [grievances, searchQuery, inboxFilter, queryCaseId]);

  // Active case for investigation
  const activeItem = grievances.find(g => g.id === selectedId) || filteredGrievances[0] || grievances[0] || {
    id: 'PN-2026-WAG-0102',
    title: 'Major Water Pipe Leakage & Pressure Collapse on Kesnand Road',
    category: 'Water Supply & Contamination',
    urgency: 'CRITICAL',
    urgencyScore: 94,
    status: 'IN_PROGRESS',
    department: 'PMC Water Supply Department',
    location: { ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Rd)', city: 'Pune' },
    citizenName: 'Santosh Gawade',
    citizenPhone: '+91 98220-XXXXX',
    descriptionRaw: 'High-pressure water gushing from street valve joint near Ivy Estate entrance. Potable supply line severed.'
  };

  // AI analysis of active case
  const liveAnalysis = analyzeGrievanceInput(activeItem?.descriptionRaw || activeItem?.title || '', { ward: activeItem?.location?.ward });

  // 9-Stage Formal Workflow
  const workflowStages = [
    { key: 'SUBMITTED', label: 'Submitted' },
    { key: 'AI_ANALYSED', label: 'AI Analysed' },
    { key: 'ASSIGNED', label: 'Assigned' },
    { key: 'UNDER_REVIEW', label: 'Under Review' },
    { key: 'INFORMATION_REQUIRED', label: 'Info Needed' },
    { key: 'IN_PROGRESS', label: 'In Progress' },
    { key: 'ESCALATED', label: 'Escalated' },
    { key: 'RESOLVED', label: 'Resolved' },
    { key: 'CLOSED', label: 'Closed' }
  ];
  const currentStatusIndex = Math.max(0, workflowStages.findIndex(s => s.key === (activeItem?.status || 'IN_PROGRESS')));

  // SLA calculation
  const targetSlaHours = activeItem?.slaHoursLeft !== undefined ? activeItem.slaHoursLeft + 4 : (liveAnalysis.slaTargetHours || 12);
  const remainingHours = activeItem?.slaHoursLeft !== undefined ? activeItem.slaHoursLeft : liveAnalysis.slaRemainingHours;
  const slaStatus = remainingHours <= 0 ? 'OVERDUE' : (remainingHours <= 6 ? 'AT_RISK' : 'ON_TRACK');

  // Handlers
  const openCaseStudio = (caseId, targetSubTab = 'action_plan') => {
    setSelectedId(caseId);
    setDetailSubTab(targetSubTab);
    setActiveView('investigation');
    setSearchParams({ section: 'investigation', caseId });
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const handleResolveSubmit = async (e) => {
    if (e) e.preventDefault();
    await resolveGrievance(activeItem.id, resolutionNotes);
    setDispatchStatus('RESOLVED');
    setShowResolutionModal(false);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } catch(err) {}
  };

  const handleClarificationSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!clarificationQuestion.trim()) return;
    await requestInfo(activeItem.id, clarificationQuestion);
    setClarificationQuestion('');
    setShowClarificationModal(false);
    setDispatchStatus('CLARIFICATION_SENT');
  };

  const handleReassignSubmit = async (e) => {
    if (e) e.preventDefault();
    await reassignGrievance(activeItem.id, reassignOfficer, reassignDepartment, reassignReason);
    setShowReassignModal(false);
    setDispatchStatus('REASSIGNED');
  };

  const handleEscalateSubmit = async (e) => {
    if (e) e.preventDefault();
    await escalateGrievance(activeItem.id, escalateReason, 'Superintending Engineer');
    setShowEscalateModal(false);
    setDispatchStatus('ESCALATED');
  };

  const handleTransitionSubmit = async (e) => {
    if (e) e.preventDefault();
    await transitionStatus(activeItem.id, targetNextStatus, transitionReason || `Moved to ${targetNextStatus} by engineer`);
    setShowTransitionModal(false);
    setTransitionReason('');
    setDispatchStatus(`STATUS_${targetNextStatus}`);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!internalNoteInput.trim()) return;
    addInternalNote(activeItem.id, internalNoteInput.trim());
    setInternalNoteInput('');
  };

  const handleExportReport = () => {
    setReportExported(true);
    setTimeout(() => setReportExported(false), 3000);
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

  return (
    <div style={{ minHeight: 'calc(100vh - 70px)', background: '#F8FAFC', padding: '20px 0 90px 0' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>

        {/* ══════════════════════════════════════════════════════════════════════
            1. MINIMAL OFFICER COMMAND HEADER & STATUS STRIP
           ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
          padding: '16px 20px',
          marginBottom: '16px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            {/* Left: Officer Bio */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                flexShrink: 0
              }}>
                🛠️
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.2 }}>
                    {currentOfficer.name}
                  </h1>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    background: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    {currentOfficer.department}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <MapPin style={{ width: '12px', height: '12px', color: '#059669', flexShrink: 0 }} />
                  <span>Wagholi Sub-Division (Wards 27–31, Pune)</span>
                  <span style={{ opacity: 0.4 }}>•</span>
                  <span>Executive Engineer</span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* WhatsApp Status Style Rapid Review */}
              <button
                type="button"
                onClick={() => setShowStoryModal(true)}
                style={{
                  height: '36px',
                  padding: '0 14px',
                  borderRadius: '9px',
                  background: '#059669',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 1px 3px rgba(5, 150, 105, 0.3)',
                  transition: 'background 120ms ease'
                }}
                title="Review incoming complaints sequentially by priority"
              >
                <span>📱</span>
                <span>Rapid Story Review</span>
                <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.25)', padding: '1px 6px', borderRadius: '999px', fontWeight: 800 }}>
                  {grievances.length}
                </span>
              </button>

              {/* Jan Suchna Broadcast Alert */}
              <button
                type="button"
                onClick={() => setShowJanSuchnaModal(true)}
                style={{
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '9px',
                  background: '#FFFFFF',
                  color: '#2563EB',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #BFDBFE',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'background 120ms ease'
                }}
              >
                <Radio style={{ width: '13px', height: '13px', color: '#2563EB' }} />
                <span>Broadcast Alert</span>
              </button>

              {/* Territory Explorer */}
              <button
                type="button"
                onClick={() => setShowTerritoryModal(true)}
                style={{
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '9px',
                  background: '#FFFFFF',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #CBD5E1',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Compass style={{ width: '13px', height: '13px', color: '#0284C7' }} />
                <span>Territory Explorer</span>
              </button>

              {/* Ward Heatmap */}
              <Link
                to="/admin"
                style={{
                  height: '36px',
                  padding: '0 12px',
                  borderRadius: '9px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  color: '#334155',
                  fontSize: '12px',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <MapPin style={{ width: '13px', height: '13px', color: '#059669' }} />
                <span>Ward Heatmap</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            2. PERSISTENT 3-WORKFLOW NAVIGATION TAB STRIP
           ══════════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          borderRadius: '12px',
          padding: '6px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          overflowX: 'auto',
          scrollbarWidth: 'none'
        }}>
          <button
            type="button"
            onClick={() => switchView('inbox')}
            style={{
              flex: 1,
              minWidth: '160px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeView === 'inbox' ? '#065F46' : 'transparent',
              color: activeView === 'inbox' ? '#FFFFFF' : '#475569',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 120ms ease'
            }}
          >
            <ClipboardList style={{ width: '15px', height: '15px' }} />
            <span>1. Inbox & Triage</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '999px',
              background: activeView === 'inbox' ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
              color: activeView === 'inbox' ? '#FFFFFF' : '#64748B'
            }}>
              {stats.active}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchView('investigation')}
            style={{
              flex: 1,
              minWidth: '180px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeView === 'investigation' ? '#065F46' : 'transparent',
              color: activeView === 'investigation' ? '#FFFFFF' : '#475569',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 120ms ease'
            }}
          >
            <Eye style={{ width: '15px', height: '15px' }} />
            <span>2. Case Resolution Studio</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '999px',
              background: activeView === 'investigation' ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
              color: activeView === 'investigation' ? '#FFFFFF' : '#64748B',
              fontFamily: 'monospace'
            }}>
              #{activeItem.id.slice(-4)}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchView('operations')}
            style={{
              flex: 1,
              minWidth: '170px',
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeView === 'operations' ? '#065F46' : 'transparent',
              color: activeView === 'operations' ? '#FFFFFF' : '#475569',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 120ms ease'
            }}
          >
            <Activity style={{ width: '15px', height: '15px' }} />
            <span>3. Operations & Oversight</span>
            <span style={{
              fontSize: '11px',
              padding: '1px 6px',
              borderRadius: '999px',
              background: activeView === 'operations' ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
              color: activeView === 'operations' ? '#FFFFFF' : '#64748B'
            }}>
              {officerRoster.length} Crew
            </span>
          </button>
        </div>

        {/* Global Toast Banner */}
        {dispatchStatus && (
          <div style={{
            padding: '10px 16px',
            borderRadius: '10px',
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 style={{ width: '16px', height: '16px', color: '#059669' }} />
              <span>Action processed successfully: <strong>{dispatchStatus}</strong></span>
            </div>
            <button
              type="button"
              onClick={() => setDispatchStatus(null)}
              style={{ background: 'none', border: 'none', color: '#065F46', cursor: 'pointer', fontSize: '16px' }}
            >
              ×
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 1: INBOX & TRIAGE (The Daily Operational Command Center)
           ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'inbox' && (
          <div>
            {/* 4 Minimal Metric Tiles */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid #E2E8F0',
                borderLeft: '4px solid #2563EB'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>Waiting To Fix</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, marginTop: '4px' }}>
                  {stats.active}
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>Total active queue</span>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid #FECACA',
                borderLeft: '4px solid #DC2626'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>Urgent Problems</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#DC2626', lineHeight: 1.1, marginTop: '4px' }}>
                  {stats.critical}
                </div>
                <span style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: 600 }}>Needs immediate action</span>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid #FDE68A',
                borderLeft: '4px solid #D97706'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', textTransform: 'uppercase' }}>SLA At Risk</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#D97706', lineHeight: 1.1, marginTop: '4px' }}>
                  {stats.slaAtRisk || 1}
                </div>
                <span style={{ fontSize: '11.5px', color: '#92400E' }}>Near deadline threshold</span>
              </div>

              <div style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                padding: '14px 16px',
                border: '1px solid #A7F3D0',
                borderLeft: '4px solid #059669'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase' }}>Resolved & Verified</span>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#059669', lineHeight: 1.1, marginTop: '4px' }}>
                  {stats.resolved}
                </div>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: 600 }}>94.8% on-time speed</span>
              </div>
            </div>

            {/* Filter Bar & View Toggles */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '16px 18px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                marginBottom: '14px'
              }}>
                {/* Search Input */}
                <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '11px', width: '15px', height: '15px', color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Ticket ID, citizen name, keyword, or ward..."
                    style={{
                      width: '100%',
                      height: '38px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      padding: '0 12px 0 36px',
                      fontSize: '13px'
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ position: 'absolute', right: '10px', top: '9px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '14px' }}
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* View Mode Toggle: Table vs Cards */}
                <div style={{ display: 'flex', background: '#F1F5F9', padding: '3px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <button
                    type="button"
                    onClick={() => setInboxViewMode('table')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: inboxViewMode === 'table' ? '#FFFFFF' : 'transparent',
                      color: inboxViewMode === 'table' ? '#0F172A' : '#64748B',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: inboxViewMode === 'table' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <List style={{ width: '13px', height: '13px' }} />
                    <span>Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInboxViewMode('cards')}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: inboxViewMode === 'cards' ? '#FFFFFF' : 'transparent',
                      color: inboxViewMode === 'cards' ? '#0F172A' : '#64748B',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: inboxViewMode === 'cards' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                    }}
                  >
                    <LayoutGrid style={{ width: '13px', height: '13px' }} />
                    <span>Cards</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Complaints Queue Display */}
            {inboxViewMode === 'table' ? (
              /* High-Density Clean Table View */
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
              }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, width: '140px' }}>TICKET ID</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>PROBLEM SUMMARY</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, width: '180px' }}>WARD / LOCATION</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, width: '130px' }}>SLA COUNTDOWN</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, width: '120px' }}>STATUS</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, width: '140px', textAlign: 'right' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredGrievances.length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
                            No complaints found matching this filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredGrievances.map((g) => {
                          const isCritical = g.urgency === 'CRITICAL';
                          const isResolved = g.status === 'RESOLVED' || g.status === 'CLOSED';
                          const timeLeft = g.slaHoursLeft !== undefined ? g.slaHoursLeft : 6;
                          const isSlaBreached = timeLeft <= 0;
                          return (
                            <tr
                              key={g.id}
                              onClick={() => openCaseStudio(g.id)}
                              style={{
                                borderBottom: '1px solid #F1F5F9',
                                cursor: 'pointer',
                                background: g.id === selectedId ? '#F0FDF4' : 'transparent',
                                transition: 'background 120ms ease'
                              }}
                            >
                              <td style={{ padding: '12px 16px' }}>
                                <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', color: '#0F172A', display: 'block' }}>
                                  {g.id}
                                </span>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  padding: '1px 6px',
                                  borderRadius: '999px',
                                  background: isCritical ? '#FEF2F2' : '#FFFBEB',
                                  color: isCritical ? '#DC2626' : '#D97706',
                                  display: 'inline-block',
                                  marginTop: '2px'
                                }}>
                                  ● {g.urgency || 'MEDIUM'}
                                </span>
                              </td>

                              <td style={{ padding: '12px 16px' }}>
                                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', lineHeight: 1.3 }}>
                                  {g.title}
                                </strong>
                                <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                                  {g.category} • Citizen: {maskCitizenName(g.citizenName || 'Verified Citizen')}
                                </span>
                              </td>

                              <td style={{ padding: '12px 16px', color: '#475569', fontSize: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <MapPin style={{ width: '12px', height: '12px', color: '#059669', flexShrink: 0 }} />
                                  <span>{g.location?.ward || 'Wagholi Ward 29'}</span>
                                </div>
                              </td>

                              <td style={{ padding: '12px 16px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: isResolved ? '#059669' : (isSlaBreached ? '#DC2626' : (timeLeft <= 4 ? '#D97706' : '#047857')),
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}>
                                  <Clock style={{ width: '12px', height: '12px' }} />
                                  <span>{isResolved ? 'Met Target ✓' : (isSlaBreached ? 'Breached' : `${timeLeft}h Left`)}</span>
                                </span>
                              </td>

                              <td style={{ padding: '12px 16px' }}>
                                <span style={{
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: isResolved ? '#ECFDF5' : (g.status === 'IN_PROGRESS' ? '#EFF6FF' : '#F1F5F9'),
                                  color: isResolved ? '#065F46' : (g.status === 'IN_PROGRESS' ? '#1D4ED8' : '#475569')
                                }}>
                                  {g.status?.replace('_', ' ') || 'SUBMITTED'}
                                </span>
                              </td>

                              <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openCaseStudio(g.id);
                                  }}
                                  style={{
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    background: '#065F46',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    fontSize: '11.5px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <span>Inspect & Solve</span>
                                  <ArrowRight style={{ width: '12px', height: '12px' }} />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Visual Cards Grid View */
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {filteredGrievances.map((g) => (
                  <EditorialComplaintCard
                    key={g.id}
                    item={g}
                    role={currentOfficer?.role || 'officer'}
                    currentUser={currentOfficer}
                    onOpen={(item) => setSelectedModalGrievance(item)}
                    onInspect={(caseId, subTab) => openCaseStudio(caseId, subTab)}
                    onResolve={(caseId) => {
                      setSelectedId(caseId);
                      setShowResolutionModal(true);
                    }}
                    onReassign={(caseId) => {
                      setSelectedId(caseId);
                      setShowReassignModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 2: ACTIVE INVESTIGATION & CASE RESOLUTION STUDIO
           ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'investigation' && (
          <div>
            {/* Top Sub-Bar: Case Switcher Dropdown & Jump to Next */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '10px 16px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>
                  Select Case to Inspect:
                </span>
                <select
                  value={activeItem.id}
                  onChange={(e) => openCaseStudio(e.target.value)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0F172A',
                    background: '#F8FAFC',
                    cursor: 'pointer'
                  }}
                >
                  {grievances.map(g => (
                    <option key={g.id} value={g.id}>
                      [{g.urgency}] {g.id} - {g.title.slice(0, 45)}...
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => switchView('inbox')}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  ← Back to Inbox
                </button>
                <button
                  type="button"
                  onClick={() => setShowStoryModal(true)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#ECFDF5',
                    color: '#065F46',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Rapid Mode</span>
                  <ArrowRight style={{ width: '12px', height: '12px' }} />
                </button>
              </div>
            </div>

            {/* 2-Column Case Resolution Studio */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(12, 1fr)',
              gap: '18px',
              alignItems: 'start'
            }}>
              {/* Left Column (5 Cols): Case Overview, Citizen Details & Photo Evidence */}
              <div style={{ gridColumn: 'span 5' }} className="hero-left-col">
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
                }}>
                  {/* Badges */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: activeItem.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                      color: activeItem.urgency === 'CRITICAL' ? '#DC2626' : '#D97706',
                      border: `1px solid ${activeItem.urgency === 'CRITICAL' ? '#FECACA' : '#FDE68A'}`
                    }}>
                      ● {activeItem.urgency || 'MEDIUM'} PRIORITY
                    </span>

                    <span style={{ fontFamily: 'monospace', fontSize: '11.5px', fontWeight: 700, color: '#64748B' }}>
                      {activeItem.id}
                    </span>
                  </div>

                  {/* Title & Category */}
                  <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', lineHeight: 1.35, margin: '0 0 6px 0' }}>
                    {activeItem.title}
                  </h2>
                  <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#059669', display: 'block', marginBottom: '12px' }}>
                    {activeItem.category}
                  </span>

                  {/* Citizen Info & Ward */}
                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: '10px',
                    padding: '12px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                    color: '#475569',
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span>👤 Citizen: <strong>{maskCitizenName(activeItem.citizenName || 'Santosh G.')}</strong></span>
                      <span style={{ color: '#0284C7' }}>{maskCitizenPhone(activeItem.citizenPhone || '+91 98220-XXXXX')}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin style={{ width: '12px', height: '12px', color: '#059669', flexShrink: 0 }} />
                      <span>{activeItem.location?.ward || 'Wagholi Ward 29 (Kesnand Road)'}</span>
                    </div>
                  </div>

                  {/* Citizen Description Statement */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                      Citizen Grievance Statement:
                    </span>
                    <p style={{
                      fontSize: '12.5px',
                      color: '#334155',
                      lineHeight: 1.5,
                      margin: 0,
                      background: '#FFFFFF',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0'
                    }}>
                      "{activeItem.descriptionRaw || activeItem.title}"
                    </p>
                  </div>

                  {/* Evidence Photo Preview */}
                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                      Field Photographic Evidence:
                    </span>
                    <div style={{
                      position: 'relative',
                      height: '160px',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: '#F1F5F9',
                      border: '1px solid #E2E8F0'
                    }}>
                      <img
                        src={activeItem.imageUrl || '/civic-problems/water_pipe_leak.jpg'}
                        alt={activeItem.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        bottom: '8px',
                        left: '8px',
                        background: 'rgba(0,0,0,0.65)',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backdropFilter: 'blur(4px)'
                      }}>
                        GPS Verified Geo-Tag
                      </span>
                    </div>
                  </div>

                  {/* SLA Countdown Card */}
                  <div style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    background: slaStatus === 'AT_RISK' ? '#FFFBEB' : (slaStatus === 'OVERDUE' ? '#FEF2F2' : '#ECFDF5'),
                    border: `1px solid ${slaStatus === 'AT_RISK' ? '#FDE68A' : (slaStatus === 'OVERDUE' ? '#FECACA' : '#A7F3D0')}`,
                    marginBottom: '14px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: slaStatus === 'AT_RISK' ? '#B45309' : (slaStatus === 'OVERDUE' ? '#DC2626' : '#065F46')
                      }}>
                        ⏱️ Target SLA Fix Time:
                      </span>
                      <strong style={{
                        fontSize: '13px',
                        color: slaStatus === 'AT_RISK' ? '#B45309' : (slaStatus === 'OVERDUE' ? '#DC2626' : '#065F46')
                      }}>
                        {slaStatus === 'OVERDUE' ? 'BREACHED' : `${remainingHours}h Left (${targetSlaHours}h Target)`}
                      </strong>
                    </div>
                    <div style={{ height: '5px', borderRadius: '4px', background: 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, Math.max(15, (remainingHours / targetSlaHours) * 100))}%`,
                        background: slaStatus === 'AT_RISK' ? '#D97706' : (slaStatus === 'OVERDUE' ? '#DC2626' : '#059669')
                      }} />
                    </div>
                  </div>

                  {/* Collapsible Journey Stepper */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowJourneyTimeline(!showJourneyTimeline)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        background: '#F8FAFC',
                        color: '#475569',
                        fontSize: '11.5px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>Stage {currentStatusIndex + 1}/{workflowStages.length}: {workflowStages[currentStatusIndex]?.label || activeItem.status}</span>
                      <ChevronDown style={{ width: '13px', height: '13px', transform: showJourneyTimeline ? 'rotate(180deg)' : 'none', transition: 'transform 120ms ease' }} />
                    </button>

                    {showJourneyTimeline && (
                      <div style={{ marginTop: '10px', padding: '10px 0' }}>
                        <VisualJourneyTimeline currentStep={activeItem.status === 'RESOLVED' ? 6 : 4} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column (7 Cols): The Action & Resolution Studio */}
              <div style={{ gridColumn: 'span 7' }} className="hero-right-col">
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid #E2E8F0',
                  padding: '22px',
                  boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
                }}>
                  {/* Sub-Tab Navigation Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    borderBottom: '1px solid #E2E8F0',
                    paddingBottom: '12px',
                    marginBottom: '18px',
                    overflowX: 'auto',
                    scrollbarWidth: 'none'
                  }}>
                    {[
                      { id: 'action_plan', label: '💡 Smart SOP Plan' },
                      { id: 'workers', label: `👷 Field Technicians (${workers.length})` },
                      { id: 'resolve', label: '📸 Evidence & Resolve' },
                      { id: 'collaborate', label: '🤝 Reassign & Escalate' },
                      { id: 'intelligence', label: '🧬 Deep DNA' }
                    ].map(t => {
                      const isActive = detailSubTab === t.id;
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setDetailSubTab(t.id)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: isActive ? 700 : 600,
                            border: isActive ? '1px solid #065F46' : '1px solid transparent',
                            background: isActive ? '#065F46' : '#F1F5F9',
                            color: isActive ? '#FFFFFF' : '#475569',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 120ms ease'
                          }}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* TAB 1: SMART SOP ACTION PLAN */}
                  {detailSubTab === 'action_plan' && (
                    <div>
                      {/* AI Diagnosis Banner */}
                      <div style={{
                        background: '#F0FDF4',
                        borderRadius: '12px',
                        border: '1px solid #BBF7D0',
                        padding: '16px',
                        marginBottom: '18px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <Sparkles style={{ width: '15px', height: '15px', color: '#059669' }} />
                          <strong style={{ fontSize: '13px', color: '#065F46' }}>AI Root Cause Hypothesis:</strong>
                        </div>
                        <p style={{ fontSize: '13px', color: '#166534', margin: 0, lineHeight: 1.5 }}>
                          {liveAnalysis.rootCauseHypothesis || '200mm HDPE joint rupture under Kesnand feeder main resulting in acute pressure collapse across 2 adjacent wards.'}
                        </p>
                      </div>

                      {/* Recommended Steps */}
                      <div style={{ marginBottom: '20px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                          Standard Operating Procedure (SOP) Actions:
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(liveAnalysis.recommendedSopSteps || [
                            '1. Isolate Wagholi ESR gate valve #4 to depressurize affected branch line.',
                            '2. Excavate 1.2m trench at Kesnand road crossing using backhoe.',
                            '3. Install 200mm electrofusion sleeve clamp over pipe rupture.',
                            '4. Flush pipeline, test residual chlorine (>0.2 ppm), and normalize distribution.'
                          ]).map((step, idx) => (
                            <div
                              key={idx}
                              style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '10px',
                                background: '#F8FAFC',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #E2E8F0',
                                fontSize: '12.5px',
                                color: '#334155'
                              }}
                            >
                              <CheckCircle2 style={{ width: '15px', height: '15px', color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Primary Execution Bar */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px',
                        paddingTop: '16px',
                        borderTop: '1px solid #E2E8F0'
                      }}>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setDispatchStatus('SOP_ACCEPTED_CREW_DISPATCHED');
                              try { confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } }); } catch(e){}
                            }}
                            style={{
                              padding: '10px 18px',
                              borderRadius: '8px',
                              background: '#065F46',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 6px rgba(6,95,70,0.25)'
                            }}
                          >
                            <Check style={{ width: '14px', height: '14px' }} />
                            <span>Accept SOP & Dispatch Crew</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDetailSubTab('workers')}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '8px',
                              background: '#ECFDF5',
                              color: '#065F46',
                              border: '1px solid #A7F3D0',
                              fontSize: '12.5px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Wrench style={{ width: '14px', height: '14px' }} />
                            <span>Assign Local Technician</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowTransitionModal(true)}
                          style={{
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            background: '#FFFFFF',
                            color: '#475569',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          Advance Status →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: FIELD WORKERS & DISPATCH */}
                  {detailSubTab === 'workers' && (
                    <div>
                      <SuggestedWorkersCard grievance={activeItem} />
                    </div>
                  )}

                  {/* TAB 3: EVIDENCE & MARK RESOLVED */}
                  {detailSubTab === 'resolve' && (
                    <div>
                      <div style={{ marginBottom: '16px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                          1. Attach Work Completion Evidence Photo:
                        </span>
                        <div
                          onClick={() => setResolutionPhotoAttached(!resolutionPhotoAttached)}
                          style={{
                            border: `2px dashed ${resolutionPhotoAttached ? '#059669' : '#CBD5E1'}`,
                            borderRadius: '10px',
                            padding: '24px',
                            textAlign: 'center',
                            background: resolutionPhotoAttached ? '#ECFDF5' : '#F8FAFC',
                            cursor: 'pointer',
                            transition: 'all 120ms ease'
                          }}
                        >
                          <Camera style={{ width: '28px', height: '28px', color: resolutionPhotoAttached ? '#059669' : '#64748B', margin: '0 auto 8px auto' }} />
                          <strong style={{ fontSize: '13px', color: resolutionPhotoAttached ? '#065F46' : '#334155', display: 'block' }}>
                            {resolutionPhotoAttached ? '✓ Repair Photo Attached (2.4 MB geo-tagged)' : 'Tap to Upload Field Completion Photo'}
                          </strong>
                          <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                            Simulates mobile camera upload with GPS validation
                          </span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                          2. Technical Resolution Notes (Sent to Citizen):
                        </span>
                        <textarea
                          rows={4}
                          value={resolutionNotes}
                          onChange={(e) => setResolutionNotes(e.target.value)}
                          placeholder="Describe the physical repair, materials used, and pressure/chlorine test verification..."
                          style={{
                            width: '100%',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            padding: '10px',
                            fontSize: '13px',
                            color: '#0F172A',
                            lineHeight: 1.4
                          }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleResolveSubmit}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '8px',
                          background: '#059669',
                          color: '#FFFFFF',
                          border: 'none',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 2px 8px rgba(5,150,105,0.3)'
                        }}
                      >
                        <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                        <span>Verify Fix & Mark Case Resolved</span>
                      </button>
                    </div>
                  )}

                  {/* TAB 4: COLLABORATE & ESCALATE */}
                  {detailSubTab === 'collaborate' && (
                    <div>
                      {/* Inter-Agency Actions Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px', border: '1px solid #E2E8F0' }}>
                          <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                            Reassign Department
                          </strong>
                          <p style={{ fontSize: '11.5px', color: '#64748B', margin: '0 0 10px 0' }}>
                            Transfer case to PWD, Sanitation, or another zone engineer.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowReassignModal(true)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              border: '1px solid #CBD5E1',
                              color: '#334155',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Transfer Ownership
                          </button>
                        </div>

                        <div style={{ background: '#FEF2F2', borderRadius: '10px', padding: '14px', border: '1px solid #FECACA' }}>
                          <strong style={{ fontSize: '13px', color: '#DC2626', display: 'block', marginBottom: '4px' }}>
                            Supervisory Escalation
                          </strong>
                          <p style={{ fontSize: '11.5px', color: '#991B1B', margin: '0 0 10px 0' }}>
                            Escalate chronic issue to Superintending Engineer.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowEscalateModal(true)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              background: '#DC2626',
                              border: 'none',
                              color: '#FFFFFF',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Escalate Case
                          </button>
                        </div>

                        <div style={{ background: '#FFFBEB', borderRadius: '10px', padding: '14px', border: '1px solid #FDE68A' }}>
                          <strong style={{ fontSize: '13px', color: '#B45309', display: 'block', marginBottom: '4px' }}>
                            Request Citizen Clarification
                          </strong>
                          <p style={{ fontSize: '11.5px', color: '#92400E', margin: '0 0 10px 0' }}>
                            Ask citizen for house number, landmark, or photo.
                          </p>
                          <button
                            type="button"
                            onClick={() => setShowClarificationModal(true)}
                            style={{
                              width: '100%',
                              padding: '7px 10px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              border: '1px solid #FDE68A',
                              color: '#B45309',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Ask Question
                          </button>
                        </div>
                      </div>

                      {/* Internal Notes Thread */}
                      <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'block', marginBottom: '8px' }}>
                          Internal Field Notes (Civic Staff Only):
                        </span>
                        
                        <div style={{
                          background: '#F8FAFC',
                          borderRadius: '10px',
                          border: '1px solid #E2E8F0',
                          padding: '12px',
                          marginBottom: '10px',
                          maxHeight: '160px',
                          overflowY: 'auto'
                        }}>
                          {(activeItem.internalNotes || [
                            { text: 'Site inspection done at 10:30 AM by JE Sachin. Excavator scheduled for 2 PM.', author: 'Er. Sanjay Sharma', timestamp: 'Today, 11:15 AM' }
                          ]).map((n, idx) => (
                            <div key={idx} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid #E2E8F0', fontSize: '12px' }}>
                              <strong style={{ color: '#0F172A' }}>{n.author || 'Staff'}</strong>
                              <span style={{ color: '#94A3B8', fontSize: '10.5px', marginLeft: '6px' }}>{n.timestamp || 'Recent'}</span>
                              <p style={{ margin: '3px 0 0 0', color: '#334155' }}>{n.text}</p>
                            </div>
                          ))}
                        </div>

                        <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
                          <input
                            type="text"
                            value={internalNoteInput}
                            onChange={(e) => setInternalNoteInput(e.target.value)}
                            placeholder="Add internal note..."
                            style={{
                              flex: 1,
                              height: '36px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              padding: '0 10px',
                              fontSize: '12.5px'
                            }}
                          />
                          <button
                            type="submit"
                            style={{
                              padding: '0 14px',
                              borderRadius: '6px',
                              background: '#0F172A',
                              color: '#FFFFFF',
                              border: 'none',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Save Note
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* TAB 5: DEEP INTELLIGENCE & PRECEDENTS */}
                  {detailSubTab === 'intelligence' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <GrievanceDnaCard dna={activeItem.grievanceDna} compact={true} />
                      <LiveComplaintLinkageSection />
                      <CivicMemoryCard />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════════
            VIEW 3: OPERATIONS & WARD OVERSIGHT
           ══════════════════════════════════════════════════════════════════════ */}
        {activeView === 'operations' && (
          <div>
            {/* Sub-view Navigation Pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '6px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              overflowX: 'auto',
              scrollbarWidth: 'none'
            }}>
              {[
                { id: 'roster', label: `👷 Field Team Roster (${officerRoster.length})` },
                { id: 'radar', label: `🚨 Emerging Problems Radar (${emergingIssues.length})` },
                { id: 'broadcasts', label: '📢 Public Broadcasts (Jan Suchna)' },
                { id: 'reports', label: '📈 Municipal SLA Reports' }
              ].map(sub => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setOpsSubView(sub.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: opsSubView === sub.id ? '#065F46' : 'transparent',
                    color: opsSubView === sub.id ? '#FFFFFF' : '#475569',
                    fontSize: '12.5px',
                    fontWeight: opsSubView === sub.id ? 700 : 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 120ms ease'
                  }}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* SUB-VIEW 1: FIELD TEAM ROSTER */}
            {opsSubView === 'roster' && (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Field Engineering Crew & Shift Status
                    </h2>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                      On-duty engineers and inspectors managing Wagholi Sub-Division Wards 27–31.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddOfficerModal(true)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: '#065F46',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Plus style={{ width: '13px', height: '13px' }} />
                    <span>Add Crew Member</span>
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                        <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>OFFICER / ENGINEER</th>
                        <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>JURISDICTION</th>
                        <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>ACTIVE CASES</th>
                        <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>RESOLVED (MTD)</th>
                        <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>AVG SPEED</th>
                        <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700 }}>RATING</th>
                        <th style={{ padding: '10px 14px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>SHIFT STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {officerRoster.map((off, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#0F172A' }}>
                            {off.name}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px' }}>
                            {off.designation}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: off.activeCases > 5 ? '#DC2626' : '#0F172A' }}>
                            {off.activeCases}
                          </td>
                          <td style={{ padding: '12px 14px', color: '#059669', fontWeight: 700 }}>
                            {off.resolvedThisMonth}
                          </td>
                          <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#059669', fontWeight: 600 }}>
                            {off.avgResolutionHours}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: 700, color: '#D97706' }}>
                            ★ {off.rating}
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                            <button
                              type="button"
                              onClick={() => toggleOfficerStatus(i)}
                              style={{
                                fontSize: '11px',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                background: off.status === 'ON_DUTY' ? '#ECFDF5' : '#FFFBEB',
                                color: off.status === 'ON_DUTY' ? '#065F46' : '#92400E',
                                border: `1px solid ${off.status === 'ON_DUTY' ? '#A7F3D0' : '#FDE68A'}`,
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
            )}

            {/* SUB-VIEW 2: EMERGING PROBLEMS RADAR */}
            {opsSubView === 'radar' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {emergingIssues.map(issue => (
                    <div
                      key={issue.id}
                      style={{
                        background: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E2E8F0',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ position: 'relative', height: '140px', background: '#F1F5F9' }}>
                        <img src={issue.image} alt={issue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <span style={{
                          position: 'absolute',
                          top: '10px',
                          left: '10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '999px',
                          background: 'rgba(255,255,255,0.95)',
                          color: issue.badgeColor
                        }}>
                          {issue.statusLabel}
                        </span>
                        <span style={{
                          position: 'absolute',
                          bottom: '8px',
                          left: '10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                        }}>
                          {issue.category}
                        </span>
                      </div>

                      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                          {issue.title}
                        </strong>
                        <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4, margin: '0 0 10px 0' }}>
                          {issue.hypothesis}
                        </p>
                        <div style={{ fontSize: '11px', color: '#475569', background: '#F8FAFC', padding: '8px', borderRadius: '6px', marginBottom: '12px', marginTop: 'auto' }}>
                          <div>📍 {issue.wards}</div>
                          <div>📈 {issue.grievancesCount} reports ({issue.trend})</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => openCaseStudio(issue.targetGrievanceId)}
                          style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '6px',
                            background: '#0F172A',
                            color: '#FFFFFF',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Inspect & Fix →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: PUBLIC BROADCASTS (JAN SUCHNA) */}
            {opsSubView === 'broadcasts' && (
              <div style={{
                background: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      Jan Suchna Public Alert Broadcasts
                    </h2>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Official municipal notifications sent directly to citizens in Wagholi Sub-Division.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowJanSuchnaModal(true)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      background: '#2563EB',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Plus style={{ width: '13px', height: '13px' }} />
                    <span>Create New Broadcast</span>
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      id: 'JS-01',
                      title: 'Scheduled Water Supply Maintenance on Kesnand Road',
                      ward: 'Ward 29 (Ivy Estate & Kesnand Rd)',
                      time: 'Active Today · 2:00 PM – 6:00 PM',
                      reach: '1,420 Citizens Notified via SMS & App',
                      status: 'BROADCASTING'
                    },
                    {
                      id: 'JS-02',
                      title: 'Heavy Inflow Caution along Domkhel Storm Culvert',
                      ward: 'Ward 30 (Domkhel Road)',
                      time: 'Sent Yesterday · 4:30 PM',
                      reach: '980 Citizens Notified',
                      status: 'COMPLETED'
                    }
                  ].map(b => (
                    <div
                      key={b.id}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '10px'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block' }}>{b.title}</strong>
                        <span style={{ fontSize: '11.5px', color: '#64748B' }}>📍 {b.ward} • ⏱️ {b.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{b.reach}</span>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: b.status === 'BROADCASTING' ? '#ECFDF5' : '#F1F5F9',
                          color: b.status === 'BROADCASTING' ? '#065F46' : '#64748B'
                        }}>
                          ● {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: PERFORMANCE & SLA REPORTS */}
            {opsSubView === 'reports' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid #E2E8F0',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(15,23,42,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        Department Volume Breakdown & SLA Performance
                      </h2>
                      <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                        Quarterly audit for {currentOfficer.department}.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleExportReport}
                      style={{
                        padding: '7px 14px',
                        borderRadius: '8px',
                        background: '#065F46',
                        color: '#FFFFFF',
                        border: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Download style={{ width: '13px', height: '13px' }} />
                      <span>{reportExported ? 'Audit Report Downloaded ✓' : 'Export Full Audit Report (PDF/CSV)'}</span>
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                    {categoryBreakdown.map((cat, i) => (
                      <div key={i} style={{ padding: '12px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <strong style={{ color: '#0F172A' }}>{cat.category}</strong>
                          <span style={{ color: '#64748B' }}>{cat.count} cases</span>
                        </div>
                        <div style={{ height: '6px', borderRadius: '4px', background: '#E2E8F0', overflow: 'hidden', marginBottom: '4px' }}>
                          <div style={{ height: '100%', width: `${cat.percentage}%`, background: '#059669' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                          SLA Performance: {cat.slaTrend}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hotspots & Citizen Feedback */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '16px'
                }}>
                  {/* Hotspots */}
                  <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
                      📍 Recurring Geographic Hotspots
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {recurringHotspots.map((hot, idx) => (
                        <div key={idx} style={{ padding: '10px', borderRadius: '8px', background: '#FFFDF5', border: '1px solid #FDE68A', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <strong style={{ color: '#92400E' }}>{hot.ward}</strong>
                            <span style={{ fontWeight: 700, color: '#B45309' }}>{hot.issues} cases</span>
                          </div>
                          <span style={{ color: '#78350F', fontSize: '11px' }}>{hot.primaryCause}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback */}
                  <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px' }}>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' }}>
                      ⭐ Verified Citizen Feedback
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {feedbackRecords.map((fb, idx) => (
                        <div key={idx} style={{ padding: '10px', borderRadius: '8px', background: '#F8FAFC', border: '1px solid #E2E8F0', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <strong style={{ color: '#0F172A' }}>{fb.citizen} ({fb.ward})</strong>
                            <span style={{ color: '#D97706', fontWeight: 700 }}>★ {fb.rating}.0</span>
                          </div>
                          <p style={{ margin: '2px 0 0 0', color: '#475569', fontSize: '11.5px', fontStyle: 'italic' }}>
                            "{fb.comment}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          EXISTING MODALS PRESERVED WITH ZERO FEATURE LOSS
         ══════════════════════════════════════════════════════════════════════ */}
      
      {/* 1. WhatsApp Status Style Priority Complaint Review Modal */}
      {showStoryModal && (
        <ComplaintStatusStoryModal
          isOpen={showStoryModal}
          onClose={() => setShowStoryModal(false)}
          complaints={grievances}
          onInspectCase={(caseId) => {
            setShowStoryModal(false);
            openCaseStudio(caseId);
          }}
          onResolveCase={(caseId) => {
            setSelectedId(caseId);
            setShowStoryModal(false);
            setShowResolutionModal(true);
          }}
        />
      )}

      {/* 2. Territory Problem Explorer Modal */}
      {showTerritoryModal && (
        <TerritoryProblemModal
          isOpen={showTerritoryModal}
          onClose={() => setShowTerritoryModal(false)}
          onSelectComplaint={(complaint) => {
            setShowTerritoryModal(false);
            openCaseStudio(complaint.id);
          }}
        />
      )}

      {/* 3. Jan Suchna Broadcast Alert Modal */}
      {showJanSuchnaModal && (
        <JanSuchnaModal
          isOpen={showJanSuchnaModal}
          onClose={() => setShowJanSuchnaModal(false)}
        />
      )}

      {/* 4. Single Complaint Modal Trigger */}
      {selectedModalGrievance && (
        <ComplaintDetailModal
          item={selectedModalGrievance}
          currentUser={currentOfficer}
          onClose={() => setSelectedModalGrievance(null)}
          onInspect={(caseId) => {
            setSelectedModalGrievance(null);
            openCaseStudio(caseId);
          }}
        />
      )}

      {/* 5. Reassign Department Modal */}
      {showReassignModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '440px', width: '100%', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>Transfer Case Jurisdiction</h3>
            <form onSubmit={handleReassignSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Target Department</label>
                <select
                  value={reassignDepartment}
                  onChange={(e) => setReassignDepartment(e.target.value)}
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '13px' }}
                >
                  <option value="PMC Water Supply Department">PMC Water Supply Department</option>
                  <option value="PMC Road Maintenance & PWD">PMC Road Maintenance & PWD</option>
                  <option value="PMC Solid Waste Management">PMC Solid Waste Management</option>
                  <option value="PMC Drainage & Stormwater">PMC Drainage & Stormwater</option>
                  <option value="MSEDCL Electricity Board">MSEDCL Electricity Board</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Transfer Rationale</label>
                <textarea
                  rows={3}
                  value={reassignReason}
                  onChange={(e) => setReassignReason(e.target.value)}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '8px', fontSize: '12.5px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowReassignModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', background: '#065F46', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Confirm Transfer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Supervisory Escalation Modal */}
      {showEscalateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '440px', width: '100%', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#DC2626', margin: '0 0 12px 0' }}>Escalate to Superintending Engineer</h3>
            <form onSubmit={handleEscalateSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Escalation Justification</label>
                <textarea
                  rows={3}
                  value={escalateReason}
                  onChange={(e) => setEscalateReason(e.target.value)}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '8px', fontSize: '12.5px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowEscalateModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', background: '#DC2626', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Confirm Escalation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Citizen Clarification Modal */}
      {showClarificationModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '440px', width: '100%', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>Ask Citizen Clarification</h3>
            <form onSubmit={handleClarificationSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Message to Citizen</label>
                <textarea
                  rows={3}
                  value={clarificationQuestion}
                  onChange={(e) => setClarificationQuestion(e.target.value)}
                  placeholder="e.g. Please provide your lane number or nearest shop landmark..."
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '8px', fontSize: '12.5px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowClarificationModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', background: '#065F46', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Send to Citizen</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. Advance Status Modal */}
      {showTransitionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '440px', width: '100%', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>Advance Workflow Status</h3>
            <form onSubmit={handleTransitionSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Target Status</label>
                <select
                  value={targetNextStatus}
                  onChange={(e) => setTargetNextStatus(e.target.value)}
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '13px' }}
                >
                  <option value="UNDER_REVIEW">UNDER REVIEW</option>
                  <option value="IN_PROGRESS">IN PROGRESS</option>
                  <option value="INFORMATION_REQUIRED">INFORMATION REQUIRED</option>
                  <option value="RESOLVED">RESOLVED</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Transition Note</label>
                <input
                  type="text"
                  value={transitionReason}
                  onChange={(e) => setTransitionReason(e.target.value)}
                  placeholder="e.g. Field inspection completed, work crew assigned"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '12.5px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowTransitionModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', background: '#065F46', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Update Status</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 9. Add Crew Member Modal */}
      {showAddOfficerModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '440px', width: '100%', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>Add Field Crew Member</h3>
            <form onSubmit={handleAddOfficerSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Engineer / Inspector Name</label>
                <input
                  type="text"
                  value={newOfficerName}
                  onChange={(e) => setNewOfficerName(e.target.value)}
                  placeholder="e.g. Er. Nilesh Kulkarni"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '12.5px' }}
                  required
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Assigned Zone / Ward</label>
                <input
                  type="text"
                  value={newOfficerZone}
                  onChange={(e) => setNewOfficerZone(e.target.value)}
                  placeholder="e.g. Ward 29 (Kesnand Road)"
                  style={{ width: '100%', height: '36px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '12.5px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowAddOfficerModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', background: '#065F46', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Save to Roster</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 10. Direct Resolution Modal Trigger from List */}
      {showResolutionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '14px', maxWidth: '480px', width: '100%', padding: '22px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px 0' }}>Mark Case Resolved (#{activeItem.id})</h3>
            <form onSubmit={handleResolveSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>Technical Resolution Notes</label>
                <textarea
                  rows={4}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  style={{ width: '100%', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '8px', fontSize: '12.5px' }}
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setShowResolutionModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', background: '#F1F5F9', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 16px', borderRadius: '6px', background: '#059669', color: '#FFFFFF', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Confirm & Resolve</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
