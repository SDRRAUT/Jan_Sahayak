import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Camera, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Eye, 
  Send, 
  Filter, 
  RefreshCw, 
  Activity, 
  Layers, 
  Play, 
  Check, 
  Clock, 
  MapPin, 
  ChevronRight, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Radio, 
  SlidersHorizontal,
  Building2,
  Car,
  Table,
  LayoutGrid,
  Search,
  ExternalLink,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  SURVEILLANCE_HOTSPOTS, 
  INITIAL_SURVEILLANCE_INCIDENTS,
  SURVEILLANCE_STATUSES,
  SURVEILLANCE_AUTHORITIES
} from '../data/surveillanceData';
import {
  CctvFeedViewer,
  SurveillanceAgentTelemetry,
  SurveillanceTicketCard,
  EvidencePackageModal,
  AuthorityEscalationModal
} from '../components/surveillance';

export default function CivicSurveillanceHub() {
  const navigate = useNavigate();
  
  const {
    surveillanceHotspots = SURVEILLANCE_HOTSPOTS,
    surveillanceIncidents = INITIAL_SURVEILLANCE_INCIDENTS,
    activeSurveillanceHotspot = 'HOTSPOT-WAG-01',
    activateHotspotSurveillance,
    escalateSurveillanceIncident,
    updateSurveillanceIncidentStatus,
    addSurveillanceIncident
  } = useApp();

  // Active Hotspot
  const currentHotspot = useMemo(() => {
    return surveillanceHotspots.find(h => h.id === activeSurveillanceHotspot) || surveillanceHotspots[0] || {
      id: 'HOTSPOT-WAG-01',
      name: 'Wagholi Main Road Restricted Zone',
      ward: 'Wagholi Ward 29 (Kesnand & Main Road Corridor)',
      category: 'Restricted-area entry / illegal heavy vehicle movement',
      citizenComplaintsCount: 12,
      similarIncidentsCount: 7,
      patternDetected: 'HIGH',
      monitoringStatus: 'ACTIVE',
      activeCamerasCount: 3,
      ruleConfig: {
        ruleId: 'RULE-WAG-RESTRICTED-09',
        description: 'No commercial heavy vehicles (>3.5T) allowed between 08:00 - 20:00 without municipal permit',
        confidenceThreshold: 85
      }
    };
  }, [surveillanceHotspots, activeSurveillanceHotspot]);

  // Surveillance Status toggle
  const [isMonitoringActive, setIsMonitoringActive] = useState(
    currentHotspot?.monitoringStatus === 'ACTIVE'
  );

  // Selected Camera for CCTV feed viewer
  const [selectedCameraId, setSelectedCameraId] = useState('CAM-WAG-04');

  // Filter tabs for Incidents list: 'ALL' | 'PENDING' | 'FORWARDED' | 'RESOLVED'
  const [activeFilterTab, setActiveFilterTab] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'table'

  // Modal states
  const [selectedEvidenceIncident, setSelectedEvidenceIncident] = useState(null);
  const [selectedEscalateIncident, setSelectedEscalateIncident] = useState(null);

  // Quick Action Dialog state for manual inline action
  const [actionDialogState, setActionDialogState] = useState({
    isOpen: false,
    incident: null,
    actionType: '',
    note: ''
  });

  // Hotspot Activation Handler
  const handleToggleMonitoring = () => {
    const nextState = !isMonitoringActive;
    setIsMonitoringActive(nextState);
    if (activateHotspotSurveillance && currentHotspot?.id) {
      activateHotspotSurveillance(currentHotspot.id);
    }
  };

  // Filtered Incidents calculation
  const filteredIncidents = useMemo(() => {
    return surveillanceIncidents.filter(inc => {
      // Search matching
      const matchesSearch = searchQuery === '' || 
        inc.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.violation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.vehicleDetails?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inc.camera?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Tab filtering
      if (activeFilterTab === 'PENDING') {
        return inc.status === 'Detected' || 
               inc.status === 'Evidence Captured' || 
               inc.status === 'Report Generated' || 
               inc.status === 'Under Human Review';
      }
      if (activeFilterTab === 'FORWARDED') {
        return inc.status === 'Forwarded' || inc.status === 'Action Taken';
      }
      if (activeFilterTab === 'RESOLVED') {
        return inc.status === 'Resolved';
      }
      return true; // 'ALL'
    });
  }, [surveillanceIncidents, activeFilterTab, searchQuery]);

  // Tab counts
  const tabCounts = useMemo(() => {
    return {
      all: surveillanceIncidents.length,
      pending: surveillanceIncidents.filter(i => 
        i.status === 'Detected' || 
        i.status === 'Evidence Captured' || 
        i.status === 'Report Generated' || 
        i.status === 'Under Human Review'
      ).length,
      forwarded: surveillanceIncidents.filter(i => 
        i.status === 'Forwarded' || 
        i.status === 'Action Taken'
      ).length,
      resolved: surveillanceIncidents.filter(i => i.status === 'Resolved').length
    };
  }, [surveillanceIncidents]);

  // Handlers for ticket actions
  const handleAcknowledgeIncident = (incident) => {
    if (updateSurveillanceIncidentStatus) {
      updateSurveillanceIncidentStatus(incident.id, 'Under Human Review', 'Duty Officer acknowledged and initiated verification');
    }
  };

  const handleOpenActionDialog = (incident, actionType = 'Action Taken') => {
    setActionDialogState({
      isOpen: true,
      incident,
      actionType,
      note: actionType === 'Resolved' 
        ? 'Challan issued and heavy vehicle escorted out of corridor. Case closed.' 
        : 'Traffic interceptor squad deployed to Kesnand junction for spot fine.'
    });
  };

  const handleConfirmActionDialog = () => {
    if (actionDialogState.incident && updateSurveillanceIncidentStatus) {
      updateSurveillanceIncidentStatus(
        actionDialogState.incident.id, 
        actionDialogState.actionType, 
        actionDialogState.note
      );
    }
    setActionDialogState({ isOpen: false, incident: null, actionType: '', note: '' });
  };

  // Helper for status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Detected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Evidence Captured':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Report Generated':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Forwarded':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Under Human Review':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Action Taken':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Resolved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20 font-sans text-slate-800">
      
      {/* ══════════════════════════════════════════════════════════════════════
          1. TOP NAVIGATION BREADCRUMB & HEADER
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Breadcrumbs & Back */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/officer')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Back to Officer Workspace</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
              <span>/</span>
              <span className="text-slate-500">Wagholi Sub-Division</span>
              <span>/</span>
              <span className="font-semibold text-emerald-700">Surveillance Hub</span>
            </div>
          </div>

          {/* Right: Monitoring Pill & Live Stream Status */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200/80">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span className="font-bold">🔴 Civic Monitoring Zone: ACTIVE</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md">
              <Activity className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span>Dual-Agent Optical Pipe Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* ══════════════════════════════════════════════════════════════════════
            2. PAGE TITLE & HOTSPOT CONTEXT HEADER
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  AI Civic Surveillance & Hotspot Escalation Hub
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Autonomous CCTV monitoring, real-time violation detection, and closed-loop authority escalation for high-density complaint hotspots.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-mono">
              Auto-sync: 3s
            </span>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
              title="Refresh feeds"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            3. HOTSPOT INFORMATION CARD (Wagholi Restricted Zone)
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs relative overflow-hidden">
          {/* Background subtle gradient ribbon */}
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-emerald-50/60 to-transparent pointer-events-none" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                  HOTSPOT #{currentHotspot?.id || 'HOTSPOT-WAG-01'}
                </span>
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {currentHotspot?.ward || 'Wagholi Ward 29 (Kesnand & Main Road Corridor)'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-500" />
                  Pattern: HIGH
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  {currentHotspot?.name || 'Wagholi Main Road Restricted Zone'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Municipal Rule #09: Daytime Heavy Vehicle Ban (08:00 - 20:00). High recurring citizen grievance clustering triggered autonomous surveillance camera binding to automatically capture and dispatch indisputable violation packages.
                </p>
              </div>

              {/* Hotspot Cluster Indicators */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-600 pt-1">
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-900 text-sm">{currentHotspot?.citizenComplaintsCount || 12}</span>
                  <span className="text-slate-500">Citizen Complaints Clustered</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-900 text-sm">{currentHotspot?.similarIncidentsCount || 7}</span>
                  <span className="text-slate-500">Similar Past Incidents</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
                  <span className="font-bold text-slate-900 text-sm">{currentHotspot?.activeCamerasCount || 3}</span>
                  <span className="text-slate-500">Active CCTV Feeds</span>
                </div>
              </div>
            </div>

            {/* Action Button: Activate / Active Status */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleToggleMonitoring}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                  isMonitoringActive 
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {isMonitoringActive ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    <span>🟢 Monitoring Active</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>[Activate AI Surveillance]</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-slate-400 font-mono">
                {isMonitoringActive ? 'Autonomous optical triggers active' : 'Click to bind cameras to rule'}
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            4. TOP METRICS COUNTERS (5 Key Metrics)
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {/* Metric 1 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Hotspots Active
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">1</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Ward 29
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 truncate">
              Wagholi Restricted Corridor
            </span>
          </div>

          {/* Metric 2 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Live Cameras
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">3</span>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                ONLINE
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 truncate">
              WAG-04, 02, 07
            </span>
          </div>

          {/* Metric 3 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              AI Accuracy
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">94%</span>
              <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">
                VERIFIED
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 truncate">
              Dual-Agent Optical Flow
            </span>
          </div>

          {/* Metric 4 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Incidents Logged
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{surveillanceIncidents.length}</span>
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                {tabCounts.pending} Pending
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 truncate">
              Automated geofence tickets
            </span>
          </div>

          {/* Metric 5 */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Resolved Cases
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">{tabCounts.resolved || 1}</span>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                Closed-Loop
              </span>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 truncate">
              Forwarded & Enforced
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════════
            5. TWO-COLUMN / SPLIT LAYOUT
               - Left: CCTV Feed Viewer + Agent Telemetry
               - Right: Surveillance Incidents & Evidence
           ══════════════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN: CCTV FEED VIEWER & TELEMETRY TERMINAL (7 cols)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Component 1: CctvFeedViewer */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                  <h3 className="font-bold text-sm text-slate-900">
                    Live Geofenced Municipal Feeds
                  </h3>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>1080p 30FPS LOW-LATENCY</span>
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <CctvFeedViewer
                  selectedCameraId={selectedCameraId}
                  onCameraChange={(camId) => setSelectedCameraId(camId)}
                  onViolationDetected={(violationData) => {
                    if (addSurveillanceIncident) {
                      addSurveillanceIncident(violationData);
                    }
                  }}
                />
              </div>
            </div>

            {/* Component 2: SurveillanceAgentTelemetry */}
            <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5">
                <SurveillanceAgentTelemetry
                  activeCamera={selectedCameraId}
                  isViolationActive={tabCounts.pending > 0}
                />
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN: INCIDENTS & EVIDENCE QUEUE (5 cols)
             ══════════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Header Strip with Controls */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-emerald-600" />
                    <span>Surveillance Incidents & Evidence</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified violation tickets with tamper-evident digital footage.
                  </p>
                </div>

                {/* View Mode Toggle: Cards / Table */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                      viewMode === 'cards' 
                        ? 'bg-white text-slate-900 shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Card View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md text-xs font-semibold transition-all ${
                      viewMode === 'table' 
                        ? 'bg-white text-slate-900 shadow-2xs' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Audit Table View"
                  >
                    <Table className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none text-xs">
                {[
                  { id: 'ALL', label: 'All', count: tabCounts.all },
                  { id: 'PENDING', label: 'Pending Verification', count: tabCounts.pending },
                  { id: 'FORWARDED', label: 'Forwarded to Authority', count: tabCounts.forwarded },
                  { id: 'RESOLVED', label: 'Resolved', count: tabCounts.resolved }
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFilterTab(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-bold shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer ${
                      activeFilterTab === tab.id
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-slate-100/70 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeFilterTab === tab.id 
                        ? 'bg-emerald-800 text-white' 
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter by vehicle, ticket ID, or camera..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════════════
                INCIDENT LIST CONTAINER (CARDS OR TABLE)
               ════════════════════════════════════════════════════════════════ */}
            {filteredIncidents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-sm">No Incidents Found</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {searchQuery 
                    ? `No violations match "${searchQuery}". Clear query to see all records.` 
                    : `No incidents in "${activeFilterTab}" state for Wagholi Corridor.`}
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-semibold text-emerald-700 hover:underline pt-1"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : viewMode === 'cards' ? (
              /* CARD VIEW */
              <div className="space-y-4">
                {filteredIncidents.map(incident => (
                  <SurveillanceTicketCard
                    key={incident.id}
                    incident={incident}
                    onViewEvidence={() => setSelectedEvidenceIncident(incident)}
                    onForward={() => setSelectedEscalateIncident(incident)}
                    onTakeAction={() => handleOpenActionDialog(incident, 'Action Taken')}
                    onResolve={() => handleOpenActionDialog(incident, 'Resolved')}
                    onStatusChange={(id, newStatus, note) => {
                      if (updateSurveillanceIncidentStatus) {
                        updateSurveillanceIncidentStatus(id, newStatus, note);
                      }
                    }}
                  />
                ))}
              </div>
            ) : (
              /* TABLE VIEW (Section 8 Clean Table Specification) */
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                        <th className="py-3 px-3">Incident</th>
                        <th className="py-3 px-3">Location & Cam</th>
                        <th className="py-3 px-3">Issue</th>
                        <th className="py-3 px-3">Evidence</th>
                        <th className="py-3 px-3">Confidence</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredIncidents.map((inc) => (
                        <tr key={inc.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Incident */}
                          <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {inc.id}
                            <div className="text-[10px] text-slate-400 font-sans font-normal">
                              {inc.timestamp}
                            </div>
                          </td>

                          {/* Location & Cam */}
                          <td className="py-3 px-3 text-slate-700">
                            <span className="font-semibold block truncate max-w-[120px]">
                              {inc.camera}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate max-w-[120px] block">
                              {inc.location}
                            </span>
                          </td>

                          {/* Issue */}
                          <td className="py-3 px-3 text-slate-800">
                            <span className="font-medium text-slate-900 block truncate max-w-[140px]" title={inc.violation}>
                              {inc.violation}
                            </span>
                            <span className="text-[11px] text-slate-500 font-mono block">
                              {inc.vehicleDetails}
                            </span>
                          </td>

                          {/* Evidence */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedEvidenceIncident(inc)}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
                            >
                              <FileText className="w-3 h-3 text-emerald-600" />
                              <span>{inc.evidenceFiles?.length || 2} Frames</span>
                            </button>
                          </td>

                          {/* Confidence */}
                          <td className="py-3 px-3 whitespace-nowrap font-bold text-emerald-700">
                            {inc.aiConfidence}%
                          </td>

                          {/* Status */}
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(inc.status)}`}>
                              {inc.status}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-3 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => setSelectedEvidenceIncident(inc)}
                                className="p-1 rounded hover:bg-slate-100 text-slate-600 transition-colors"
                                title="Inspect Evidence"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedEscalateIncident(inc)}
                                className="p-1 rounded hover:bg-emerald-50 text-emerald-700 transition-colors"
                                title="Escalate to Police/Admin"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenActionDialog(inc, 'Resolved')}
                                className="p-1 rounded hover:bg-blue-50 text-blue-700 transition-colors"
                                title="Mark Resolved"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Quick Municipal Advisory Footnote */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 text-xs text-emerald-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Autonomous Chain of Custody:</span>
                <span className="text-emerald-800 ml-1">
                  Every forward and status update generates an immutable SHA-256 digital stamp for judicial compliance before Pune Traffic Police & PMC.
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          6. MODALS
         ══════════════════════════════════════════════════════════════════════ */}
      
      {/* Evidence Package Modal */}
      {selectedEvidenceIncident && (
        <EvidencePackageModal
          isOpen={!!selectedEvidenceIncident}
          incident={selectedEvidenceIncident}
          onClose={() => setSelectedEvidenceIncident(null)}
          onForward={(inc) => {
            setSelectedEvidenceIncident(null);
            setSelectedEscalateIncident(inc || selectedEvidenceIncident);
          }}
        />
      )}

      {/* Authority Escalation Modal */}
      {selectedEscalateIncident && (
        <AuthorityEscalationModal
          isOpen={!!selectedEscalateIncident}
          incident={selectedEscalateIncident}
          escalateSurveillanceIncident={escalateSurveillanceIncident}
          onClose={() => setSelectedEscalateIncident(null)}
          onSuccess={() => {
            // Context automatically triggers state updates
            setSelectedEscalateIncident(null);
          }}
        />
      )}

      {/* Manual Quick Action Confirmation Dialog */}
      {actionDialogState.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Transition Incident: {actionDialogState.actionType}</span>
              </h3>
              <button
                type="button"
                onClick={() => setActionDialogState({ isOpen: false, incident: null, actionType: '', note: '' })}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="font-mono font-bold text-slate-800">
                  {actionDialogState.incident?.id}
                </div>
                <div className="text-slate-600 mt-0.5">
                  {actionDialogState.incident?.violation}
                </div>
                <div className="text-slate-400 text-[11px] mt-0.5">
                  Vehicle: {actionDialogState.incident?.vehicleDetails}
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Official Verification / Action Note:
                </label>
                <textarea
                  rows={3}
                  value={actionDialogState.note}
                  onChange={(e) => setActionDialogState(prev => ({ ...prev, note: e.target.value }))}
                  className="w-full p-2.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  placeholder="Enter details of action taken on ground..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActionDialogState({ isOpen: false, incident: null, actionType: '', note: '' })}
                className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmActionDialog}
                className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs"
              >
                Confirm {actionDialogState.actionType}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
