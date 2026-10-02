import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  Network, 
  MapPin, 
  ArrowRight, 
  AlertTriangle, 
  ShieldAlert, 
  Clock, 
  Search, 
  Filter, 
  Radio, 
  Users, 
  Layers, 
  CheckCircle2,
  Activity,
  Zap,
  Building2,
  Flame,
  FileCheck,
  Compass,
  LayoutList,
  LayoutGrid,
  Table2,
  AlignJustify,
  Rows3,
  ChevronDown,
  ChevronUp,
  GitFork,
  Check,
  CornerDownRight,
  Boxes
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ProblemSpreadMap from '../components/intelligence/ProblemSpreadMap';
import CivicSignalModal from '../components/intelligence/CivicSignalModal';
import TerritoryProblemModal from '../components/officer/TerritoryProblemModal';
import JanSuchnaModal from '../components/officer/JanSuchnaModal';

// Clean, realistic live data for Smart Department Routing
const ROUTED_COMPLAINTS_DATA = [
  {
    id: 'GRV-2026-8912',
    timestamp: '4 mins ago',
    citizenInput: 'Kesnand Road chowk pe underground main pipeline phat gayi hai, bohot tez paani road pe beh raha hai aur traffic ruk gaya hai.',
    channel: '🎙 Voice (Hindi/Marathi)',
    category: 'Water Supply & Sewerage',
    categoryKey: 'WATER',
    department: 'PMC Water Supply Department',
    deptIcon: '💧',
    deptColor: '#0284C7',
    deptBg: '#F0F9FF',
    deptBorder: '#BAE6FD',
    ward: 'Ward 29 (Kesnand Corridor)',
    officer: 'Er. Sanjay Sharma (EE Water)',
    confidence: '98.8%',
    routingRule: 'Pipeline Burst Keyword + Ward 29 Geo-Fence',
    priority: 'CRITICAL',
    sla: '4 Hours',
    status: 'Auto-Dispatched'
  },
  {
    id: 'GRV-2026-8909',
    timestamp: '11 mins ago',
    citizenInput: 'Ivy Estate gate no 2 ke paas dumper 3 din se nahi aaya. Kachre ka bada dher lag gaya hai aur badboo fail rahi hai.',
    channel: '📷 Photo + Text',
    category: 'Solid Waste Management',
    categoryKey: 'WASTE',
    department: 'PMC Solid Waste Management',
    deptIcon: '🗑️',
    deptColor: '#059669',
    deptBg: '#ECFDF5',
    deptBorder: '#A7F3D0',
    ward: 'Ward 29 (Ivy Estate)',
    officer: 'V. K. Shinde (Sanitary Inspector)',
    confidence: '97.4%',
    routingRule: 'Garbage Dump Detection + SWM Roster Match',
    priority: 'HIGH',
    sla: '8 Hours',
    status: 'Auto-Dispatched'
  },
  {
    id: 'GRV-2026-8904',
    timestamp: '28 mins ago',
    citizenInput: 'Pune-Nagar Highway left lane bridge approach pe 2 deep potholes ban gaye hain. Bike girte girte bachi.',
    channel: '✍ Portal Web',
    category: 'Roads & Infrastructure',
    categoryKey: 'ROADS',
    department: 'Public Works Department (PWD)',
    deptIcon: '🛣️',
    deptColor: '#D97706',
    deptBg: '#FFFBEB',
    deptBorder: '#FDE68A',
    ward: 'Ward 28 (Highway Corridor)',
    officer: 'A. P. Deshmukh (PWD Asst. Engineer)',
    confidence: '96.2%',
    routingRule: 'State Highway Corridor GPS + Asphalt Pothole Tag',
    priority: 'CRITICAL',
    sla: '12 Hours',
    status: 'Dispatched to PWD'
  },
  {
    id: 'GRV-2026-8898',
    timestamp: '42 mins ago',
    citizenInput: 'Wagholi vegetable market transformer pole se sparks nikal rahe hain aur live cable neeche latak rahi hai.',
    channel: '🎙 Voice Note',
    category: 'Electrical & Power Grid',
    categoryKey: 'POWER',
    department: 'MSEDCL Wagholi Sub-Division',
    deptIcon: '⚡',
    deptColor: '#7C3AED',
    deptBg: '#F5F3FF',
    deptBorder: '#DDD6FE',
    ward: 'Ward 27 (Central Market)',
    officer: 'R. B. Patil (MSEDCL Feeder Officer)',
    confidence: '99.2%',
    routingRule: 'High-Voltage Spark Hazard + Emergency Intercept',
    priority: 'EMERGENCY',
    sla: '2 Hours',
    status: 'Dispatched (Priority 1)'
  },
  {
    id: 'GRV-2026-8885',
    timestamp: '1 hour ago',
    citizenInput: 'Ubale Nagar underpass culvert completely choked with silt, mild rainfall me bhi 1.5 feet paani bhar gaya.',
    channel: '📷 Photo Evidence',
    category: 'Drainage & Stormwater',
    categoryKey: 'DRAINAGE',
    department: 'PMC Drainage Department',
    deptIcon: '🌊',
    deptColor: '#2563EB',
    deptBg: '#EFF6FF',
    deptBorder: '#BFDBFE',
    ward: 'Ward 30 (Ubale Nagar)',
    officer: 'M. S. Kulkarni (Drainage Inspector)',
    confidence: '95.6%',
    routingRule: 'Culvert Choke Vision Model + Monsoon Hotspot',
    priority: 'HIGH',
    sla: '6 Hours',
    status: 'Auto-Dispatched'
  },
  {
    id: 'GRV-2026-8879',
    timestamp: '1.5 hours ago',
    citizenInput: 'Primary health center lane me stagnant dirty water pool ban gaya hai, dengue mosquito breeding ho rahi hai.',
    channel: '✍ Citizen App',
    category: 'Public Health & Sanitation',
    categoryKey: 'HEALTH',
    department: 'PMC Health Department',
    deptIcon: '🏥',
    deptColor: '#E11D48',
    deptBg: '#FFF1F2',
    deptBorder: '#FECDD3',
    ward: 'Ward 27 (Health Clinic Lane)',
    officer: 'Dr. Neha Joshi (Ward Medical Officer)',
    confidence: '94.8%',
    routingRule: 'Vector Control Keywords + Ward Clinic Geo-Tag',
    priority: 'MEDIUM',
    sla: '24 Hours',
    status: 'Auto-Dispatched'
  }
];

// Clean, realistic live data for Duplicate & Similar Complaint Clusters
const DUPLICATE_CLUSTERS_DATA = [
  {
    id: 'CLUSTER-WAG-WATER-01',
    masterTicket: 'INC-CORE-1 / GRV-2026-001',
    title: 'Wagholi Baif Road & Kesnand Feeder Main Rupture',
    leadDept: 'PMC Water Supply Department',
    deptIcon: '💧',
    severity: 'CRITICAL',
    similarityScore: '96% Semantic & Geospatial Match',
    geoRadius: '65m Radius (Ward 29 & 27)',
    totalReportsMerged: 18,
    dispatchesSaved: '17 Redundant Dispatches Eliminated',
    impactSummary: '450 Households across Baif Road & Kesnand Corridor',
    actionSummary: '1 Combined Excavator & Valve Repair Crew dispatched. All 18 citizens linked to unified SMS timeline.',
    groupedSignals: [
      { id: 'SIG-001', time: '08:15', citizen: 'Sunita Mehra (Ivy Estate)', input: 'Water pressure very low, yellow tint in tap water.', type: '🎙 Voice', score: 98 },
      { id: 'SIG-002', time: '11:30', citizen: 'Rajesh Gupta (Raisoni Chowk)', input: 'Water trickling continuously from under road asphalt.', type: '📷 Photo', score: 95 },
      { id: 'SIG-003', time: '12:10', citizen: 'Kavita Roy (Kesnand Road)', input: 'Zero water pressure on 1st floor, pump drawing air.', type: '✍ Text', score: 92 },
      { id: 'SIG-004', time: '14:45', citizen: 'Mohd. Tariq (Main Arterial)', input: 'Road depression forming, asphalt wet and spongy.', type: '📷 Photo', score: 96 }
    ]
  },
  {
    id: 'CLUSTER-WAG-GARBAGE-02',
    masterTicket: 'INC-CORE-3 / GRV-2026-014',
    title: 'Ivy Estate Commercial Market Garbage Overflow Backlog',
    leadDept: 'PMC Solid Waste Management',
    deptIcon: '🗑️',
    severity: 'HIGH',
    similarityScore: '93% Visual Embedding Match',
    geoRadius: '30m Radius (Market Chowk)',
    totalReportsMerged: 16,
    dispatchesSaved: '15 Redundant Dispatches Eliminated',
    impactSummary: '80 Retail Shops & 1,500 daily market shoppers',
    actionSummary: 'Heavy hydraulic compactor truck scheduled for emergency clearance; commercial waste notice issued.',
    groupedSignals: [
      { id: 'SIG-008', time: '09:00', citizen: 'Anil K. (Shopkeeper #12)', input: 'Large plastic trash pile blocking customer parking.', type: '📷 Photo', score: 97 },
      { id: 'SIG-009', time: '10:15', citizen: 'Pooja Patil (Resident)', input: 'Bins overflowing, cows scattering waste on carriageway.', type: '✍ Text', score: 94 },
      { id: 'SIG-010', time: '11:50', citizen: 'Vikram Joshi (Ivy Gate 2)', input: 'Severe stench reaching 2nd floor balconies.', type: '🎙 Voice', score: 91 }
    ]
  },
  {
    id: 'CLUSTER-WAG-DRAIN-03',
    masterTicket: 'INC-CORE-5 / GRV-2026-022',
    title: 'Ubale Nagar Monsoon Stormwater Culvert Choke',
    leadDept: 'PMC Drainage Department',
    deptIcon: '🌊',
    severity: 'CRITICAL',
    similarityScore: '94% Spatial & Audio Proximity Match',
    geoRadius: '45m Radius (Ubale Nagar Junction)',
    totalReportsMerged: 19,
    dispatchesSaved: '18 Redundant Dispatches Eliminated',
    impactSummary: 'Arterial road underpass connecting Nagar Road to Ubale Nagar',
    actionSummary: 'High-capacity suction jetting machine mobilized; de-silting crew clearing subterranean manhole.',
    groupedSignals: [
      { id: 'SIG-014', time: '07:30', citizen: 'Suresh More', input: 'Underpass flooded with black drainage water.', type: '📷 Photo', score: 96 },
      { id: 'SIG-015', time: '08:40', citizen: 'Deepak Sawant', input: 'Manhole chamber cover dislodged under water.', type: '🎙 Voice', score: 93 },
      { id: 'SIG-016', time: '10:05', citizen: 'Prakash Shinde', input: 'Two wheeler slipped in open storm drain.', type: '✍ Text', score: 95 }
    ]
  },
  {
    id: 'CLUSTER-WAG-POWER-04',
    masterTicket: 'INC-CORE-7 / GRV-2026-031',
    title: 'Wagholi Chowk Loose Overhead High-Tension Cables',
    leadDept: 'MSEDCL Wagholi Sub-Division',
    deptIcon: '⚡',
    severity: 'CRITICAL',
    similarityScore: '98% Geo-Coordinate & Hazard Tag Match',
    geoRadius: '50m Corridor (Main Vegetable Market)',
    totalReportsMerged: 16,
    dispatchesSaved: '15 Redundant Dispatches Eliminated',
    impactSummary: '1,200 pedestrians and 45 roadside vendors under live line',
    actionSummary: 'Emergency line isolator opened; MSEDCL ground tower squad replacing worn tension clamp.',
    groupedSignals: [
      { id: 'SIG-020', time: '13:10', citizen: 'Ramesh K. (Vendor)', input: 'Cables hanging 6 feet from ground, sparking in wind.', type: '🎙 Voice', score: 99 },
      { id: 'SIG-021', time: '13:25', citizen: 'Dr. Nitin Rao', input: 'Hazardous sparking wire near clinic entrance.', type: '✍ Text', score: 98 }
    ]
  },
  {
    id: 'CLUSTER-WAG-ROADS-05',
    masterTicket: 'INC-CORE-8 / GRV-2026-039',
    title: 'Pune-Nagar Highway Pothole Cluster & Broken Grating',
    leadDept: 'Public Works Department (PWD Pune)',
    deptIcon: '🛣️',
    severity: 'HIGH',
    similarityScore: '95% GPS Corridor Match',
    geoRadius: '120m Highway Corridor',
    totalReportsMerged: 15,
    dispatchesSaved: '14 Redundant Dispatches Eliminated',
    impactSummary: 'Arterial Highway Junction & Lexicon International School Entrance',
    actionSummary: 'Cold-mix asphalt patch truck and iron grating fabrication unit scheduled for night shift.',
    groupedSignals: [
      { id: 'SIG-025', time: '09:20', citizen: 'Sanjay Thorat', input: 'Three severe rim-bending potholes right after toll bridge.', type: '📷 Photo', score: 96 },
      { id: 'SIG-026', time: '11:00', citizen: 'Amitabh Sen', input: 'Broken storm grate creating puncture hazard for buses.', type: '✍ Text', score: 94 }
    ]
  }
];

export default function CivicIntelligenceDashboard() {
  const { civicIncidents = [], civicSignals = [], intelligenceMetrics = {} } = useApp();
  const [activeTab, setActiveTab] = useState('incidents'); // 'incidents' | 'map' | 'routing' | 'deduplication'
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [showTerritoryModal, setShowTerritoryModal] = useState(false);
  const [showJanSuchnaModal, setShowJanSuchnaModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (default) | 'detail' | 'compact' | 'table' | 'minimal'
  const [routingFilter, setRoutingFilter] = useState('ALL');
  const [expandedClusterId, setExpandedClusterId] = useState('CLUSTER-WAG-WATER-01');

  const filteredIncidents = civicIncidents.filter(inc => {
    const matchesStage = selectedStage === 'ALL' || inc.stage === selectedStage;
    const matchesSearch = (inc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inc.summary || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inc.id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (inc.affectedArea || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className="section-spacing" style={{ paddingTop: '24px', minHeight: '85vh', background: '#F8FAFC' }}>
      <div className="container" style={{ maxWidth: '1280px' }}>
        
        {/* ── Top Header Banner (Center Aligned & Refined Muted Styling) ── */}
        <div style={{
          background: 'linear-gradient(135deg, #F0FDF4 0%, #F8FAFC 50%, #EFF6FF 100%)',
          borderRadius: '24px',
          padding: '28px 32px',
          border: '1.5px solid #E2E8F0',
          boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
          marginBottom: '24px',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Overline Badges */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '11px',
              fontWeight: 700,
              padding: '3px 11px',
              borderRadius: '999px',
              background: '#FFFFFF',
              color: '#475569',
              border: '1px solid #CBD5E1',
              letterSpacing: '0.02em',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}>
              <Sparkles style={{ width: '12px', height: '12px', color: '#6366F1' }} />
              CIVIC INTELLIGENCE HUB
            </span>
            <span style={{
              fontSize: '11px',
              fontWeight: 700,
              color: '#065F46',
              background: '#FFFFFF',
              padding: '3px 10px',
              borderRadius: '999px',
              border: '1px solid #A7F3D0',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
            }}>
              ● 100 Complaints → 1 Actionable Plan
            </span>
          </div>

          {/* Title */}
          <h1 style={{
            fontSize: 'clamp(22px, 3vw, 28px)',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.025em',
            margin: '0 0 6px 0',
            lineHeight: 1.25
          }}>
            Civic Intelligence & Emerging Problem Discovery
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: '13.5px',
            color: '#64748B',
            margin: '0 auto',
            maxWidth: '740px',
            lineHeight: 1.5,
            fontWeight: 500
          }}>
            Detects early community warning signals, clusters duplicate complaints into unified incidents, and coordinates joint municipal repair teams.
          </p>

          {/* Center-Aligned Action Buttons with Calmer, Refined Colors */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            flexWrap: 'wrap',
            marginTop: '20px'
          }}>
            {/* Button 1: Territory Problem Explorer (Light Styled) */}
            <button
              type="button"
              onClick={() => setShowTerritoryModal(true)}
              style={{
                height: '40px',
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '0 18px',
                borderRadius: '999px',
                background: '#FFFFFF',
                color: '#0369A1',
                border: '1.5px solid #BAE6FD',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                boxShadow: '0 2px 6px rgba(2, 132, 199, 0.08)',
                transition: 'all 150ms ease'
              }}
            >
              <Compass style={{ width: '15px', height: '15px', color: '#0284C7' }} />
              <span>🗺️ Territory Problem Explorer</span>
            </button>

            {/* Button 2: Jan Suchna Broadcast (Light Styled) */}
            <button
              type="button"
              onClick={() => setShowJanSuchnaModal(true)}
              style={{
                height: '40px',
                fontSize: '12.5px',
                fontWeight: 700,
                padding: '0 18px',
                borderRadius: '999px',
                background: '#FFFFFF',
                color: '#334155',
                border: '1.5px solid #CBD5E1',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
                transition: 'all 150ms ease'
              }}
            >
              <Radio style={{ width: '15px', height: '15px', color: '#D97706' }} />
              <span>📢 Create Jan Suchna Broadcast</span>
            </button>
          </div>
        </div>

        {/* ── 4 Executive Metric Tiles (Minimalist & Easy to Read) ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {/* KPI 1 - Light Red/Rose */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFF5F5 0%, #FEF2F2 100%)',
            border: '1px solid #FECACA',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#991B1B' }}>
                Active Incidents
              </span>
              <AlertTriangle style={{ width: '15px', height: '15px', color: '#DC2626' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#7F1D1D' }}>
                {civicIncidents.length}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#DC2626', background: '#FFFFFF', border: '1px solid #FCA5A5', padding: '2px 8px', borderRadius: '6px' }}>
                2 Multi-Ward
              </span>
            </div>
          </div>

          {/* KPI 2 - Light Indigo/Purple */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
            border: '1px solid #C7D2FE',
            boxShadow: '0 2px 6px rgba(79, 70, 229, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#3730A3' }}>
                Signals Detected
              </span>
              <Radio style={{ width: '15px', height: '15px', color: '#4F46E5' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#312E81' }}>
                {civicSignals.length + 42}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#FFFFFF', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '6px' }}>
                +34% Early
              </span>
            </div>
          </div>

          {/* KPI 3 - Light Amber/Orange */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            border: '1px solid #FDE68A',
            boxShadow: '0 2px 6px rgba(217, 119, 6, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#92400E' }}>
                Joint Operations
              </span>
              <Building2 style={{ width: '15px', height: '15px', color: '#D97706' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#78350F' }}>
                2
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309', background: '#FFFFFF', border: '1px solid #FCD34D', padding: '2px 8px', borderRadius: '6px' }}>
                Multi-Agency
              </span>
            </div>
          </div>

          {/* KPI 4 - Light Emerald/Green */}
          <div style={{
            padding: '14px 16px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            border: '1px solid #A7F3D0',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#065F46' }}>
                Avg Discovery Speed
              </span>
              <Clock style={{ width: '15px', height: '15px', color: '#059669' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#064E3B' }}>
                6.2h
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#FFFFFF', border: '1px solid #6EE7B7', padding: '2px 8px', borderRadius: '6px' }}>
                93% Faster
              </span>
            </div>
          </div>
        </div>

        {/* ── 4 Streamlined Navigation Tabs ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#FFFFFF',
          padding: '6px',
          borderRadius: '16px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
          marginBottom: '20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {[
            { id: 'incidents', label: '🚨 Active Incidents & Radar', badge: filteredIncidents.length },
            { id: 'map', label: '🗺️ Problem Spread Map', badge: 'Live GIS' },
            { id: 'routing', label: '🎯 Smart Department Routing', badge: 'Auto-Dispatch' },
            { id: 'deduplication', label: '🔍 Duplicate & Similar Detection', badge: '68% Merged' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: isActive ? 800 : 600,
                  background: isActive ? '#090D16' : 'transparent',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: isActive ? '1px solid #000000' : 'none',
                  boxShadow: isActive ? '0 3px 10px rgba(0, 0, 0, 0.25)' : 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'all 150ms ease'
                }}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: '999px',
                    background: isActive ? '#1E293B' : '#F1F5F9',
                    color: isActive ? '#38BDF8' : '#475569',
                    border: isActive ? '1px solid #334155' : 'none'
                  }}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dark prominent divider line under navigation */}
        <div style={{ height: '2px', background: '#334155', borderRadius: '999px', marginBottom: '24px', opacity: 0.85 }} />

        {/* ══════════════════════════════════════════════════════════
            TAB 1: ACTIVE INCIDENTS & RADAR
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'incidents' && (
          <div>
            {/* Filter Bar & Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '19px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Active Civic Incidents ({filteredIncidents.length})
                </h2>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px', margin: 0 }}>
                  Grouped problem clusters currently under active multi-department remediation
                </p>
              </div>

              {/* Stage Filter Buttons & Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', background: '#FFFFFF', padding: '3px', borderRadius: '999px', border: '1.5px solid #A7F3D0', boxShadow: '0 1px 3px rgba(16, 185, 129, 0.08)' }}>
                  {['ALL', 'CRITICAL', 'GROWING', 'EMERGING'].map((stg) => (
                    <button
                      key={stg}
                      type="button"
                      onClick={() => setSelectedStage(stg)}
                      style={{
                        fontSize: '11.5px',
                        fontWeight: selectedStage === stg ? 700 : 500,
                        padding: '4px 12px',
                        borderRadius: '999px',
                        border: 'none',
                        background: selectedStage === stg ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'transparent',
                        color: selectedStage === stg ? '#FFFFFF' : '#065F46',
                        cursor: 'pointer',
                        transition: 'all 150ms ease',
                        boxShadow: selectedStage === stg ? '0 2px 6px rgba(16, 185, 129, 0.3)' : 'none'
                      }}
                    >
                      {stg}
                    </button>
                  ))}
                </div>

                {/* Light styled search box */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ward, keyword..."
                    style={{
                      height: '36px',
                      borderRadius: '999px',
                      border: '1.5px solid #BAE6FD',
                      padding: '0 14px 0 32px',
                      fontSize: '12.5px',
                      background: '#F0F9FF',
                      color: '#0369A1',
                      fontWeight: 500,
                      width: '210px',
                      boxShadow: '0 1px 3px rgba(2, 132, 199, 0.08)'
                    }}
                  />
                  <Search style={{ position: 'absolute', left: '11px', top: '11px', width: '14px', height: '14px', color: '#0284C7' }} />
                </div>

                {/* Light styled View Mode Toggles */}
                <div style={{
                  display: 'flex',
                  background: '#F8FAFC',
                  padding: '3px',
                  borderRadius: '10px',
                  border: '1.5px solid #E2E8F0',
                  gap: '3px',
                  boxShadow: '0 1px 3px rgba(15, 23, 42, 0.04)'
                }}>
                  {[
                    { id: 'detail',  Icon: AlignJustify, title: 'Detail View' },
                    { id: 'compact', Icon: LayoutList,   title: 'Compact View' },
                    { id: 'grid',    Icon: LayoutGrid,   title: 'Grid View' },
                    { id: 'table',   Icon: Table2,       title: 'Table View' },
                    { id: 'minimal', Icon: Rows3,        title: 'Minimal View' },
                  ].map(({ id, Icon, title }) => (
                    <button
                      key={id}
                      type="button"
                      title={title}
                      onClick={() => setViewMode(id)}
                      style={{
                        width: '30px', height: '30px',
                        borderRadius: '7px',
                        border: 'none',
                        background: viewMode === id ? '#FFFFFF' : 'transparent',
                        color: viewMode === id ? '#0284C7' : '#64748B',
                        boxShadow: viewMode === id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 120ms ease'
                      }}
                    >
                      <Icon style={{ width: '14px', height: '14px' }} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══ MULTI-VIEW INCIDENT RENDERER ═══ */}

            {/* VIEW 1 — DETAIL (default): Full expanded cards */}
            {viewMode === 'detail' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
                {filteredIncidents.map((incident) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <div key={incident.id} style={{ background: '#FFFFFF', borderRadius: '20px', border: isCritical ? '1.5px solid #FECACA' : isGrowing ? '1.5px solid #FED7AA' : '1px solid #E2E8F0', padding: '24px', boxShadow: '0 4px 18px rgba(15,23,42,0.05)' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '14px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: isCritical ? '#FEF2F2' : isGrowing ? '#FFF7ED' : '#F0FDF4', color: isCritical ? '#DC2626' : isGrowing ? '#EA580C' : '#16A34A', border: isCritical ? '1px solid #FCA5A5' : isGrowing ? '1px solid #FDBA74' : '1px solid #86EFAC' }}>● {incident.stage || 'ACTIVE'}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', fontFamily: 'monospace', background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>{incident.id}</span>
                            <span style={{ fontSize: '11px', color: '#0369A1', fontWeight: 600, background: '#F0F9FF', padding: '3px 8px', borderRadius: '6px', border: '1px solid #BAE6FD' }}>📍 {incident.affectedArea || 'Ward 29'}</span>
                          </div>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>{incident.title}</h3>
                        </div>
                        {/* Green Investigate Action Plan Button */}
                        <Link to={`/intelligence/incidents/${incident.id}`} style={{
                          height: '42px',
                          padding: '0 20px',
                          borderRadius: '999px',
                          background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                          transition: 'all 150ms ease'
                        }}>
                          <span>Investigate Action Plan</span><ArrowRight style={{ width: '15px', height: '15px' }} />
                        </Link>
                      </div>
                      <p style={{ fontSize: '13.5px', color: '#334155', lineHeight: 1.5, marginBottom: '16px', background: '#F8FAFC', padding: '12px 16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}><strong>Problem Summary: </strong>{incident.summary}</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#EFF6FF', border: '1px solid #BFDBFE' }}><span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', display: 'block' }}>👥 Impacted Residents</span><strong style={{ fontSize: '14px', color: '#1E3A8A' }}>{incident.affectedPopulation || '~120 Citizens'} ({incident.signalCount || incident.complaintCount || 1} Reports)</strong></div>
                        <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#ECFDF5', border: '1px solid #A7F3D0' }}><span style={{ fontSize: '10.5px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', display: 'block' }}>🏛️ Lead Municipal Agency</span><strong style={{ fontSize: '14px', color: '#064E3B' }}>{incident.leadDepartment || 'PMC Water Supply Department'}</strong></div>
                        <div style={{ padding: '10px 14px', borderRadius: '12px', background: '#FEF3C7', border: '1px solid #FDE68A' }}><span style={{ fontSize: '10.5px', fontWeight: 700, color: '#92400E', textTransform: 'uppercase', display: 'block' }}>⏱️ Fix SLA Target</span><strong style={{ fontSize: '14px', color: '#78350F' }}>{incident.slaHoursLeft ? `${incident.slaHoursLeft}h Remaining` : 'Within 24 Hours'}</strong></div>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#475569', padding: '8px 12px', borderRadius: '8px', background: '#FFFFFF', border: '1px dashed #CBD5E1', marginBottom: '14px' }}><span style={{ fontWeight: 700, color: '#0F172A' }}>💡 Root Cause: </span>{incident.rootCause?.probable_root_cause || incident.rootCauseHypotheses?.[0]?.title || 'Infrastructure capacity constraint.'}</div>
                      <div style={{ paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '12px' }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}><span style={{ color: '#64748B', fontWeight: 700 }}>Coordinating Agencies:</span><span style={{ padding: '2px 8px', borderRadius: '999px', background: '#ECFDF5', color: '#065F46', fontWeight: 700, fontSize: '11px', border: '1px solid #A7F3D0' }}>{(incident.leadDepartment || 'PMC').split('(')[0].trim()} ★ Lead</span></div>
                        <span style={{ color: '#64748B', fontSize: '11.5px' }}>First Detected: <strong>{incident.firstDetectedAt && !incident.firstDetectedAt.includes('Invalid') ? incident.firstDetectedAt : 'Recently'}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 2 — COMPACT: Slim rows */}
            {viewMode === 'compact' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '32px' }}>
                {filteredIncidents.map((incident) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <div key={incident.id} style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#FFFFFF', borderRadius: '12px', border: isCritical ? '1px solid #FECACA' : isGrowing ? '1px solid #FED7AA' : '1px solid #E2E8F0', padding: '12px 16px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: isCritical ? '#EF4444' : isGrowing ? '#F97316' : '#22C55E', flexShrink: 0 }} />
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', fontFamily: 'monospace', flexShrink: 0 }}>{incident.id}</span>
                      <span style={{ flex: 1, fontSize: '13px', fontWeight: 700, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{incident.title}</span>
                      <span style={{ fontSize: '11px', color: '#64748B', flexShrink: 0 }}>{incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#475569', flexShrink: 0 }}>{incident.leadDepartment?.split('(')[0]?.trim() || 'PMC'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: incident.slaHoursLeft < 6 ? '#EF4444' : '#059669', background: incident.slaHoursLeft < 6 ? '#FEF2F2' : '#ECFDF5', padding: '2px 8px', borderRadius: '6px', flexShrink: 0 }}>{incident.slaHoursLeft ? `${incident.slaHoursLeft}h` : '24h'} SLA</span>
                      <Link to={`/intelligence/incidents/${incident.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '8px', background: '#059669', color: '#FFFFFF', textDecoration: 'none', flexShrink: 0, boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)' }}><ArrowRight style={{ width: '14px', height: '14px' }} /></Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 3 — GRID: 2-column cards */}
            {viewMode === 'grid' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {filteredIncidents.map((incident) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <div key={incident.id} style={{ background: '#FFFFFF', borderRadius: '16px', border: isCritical ? '1.5px solid #FECACA' : isGrowing ? '1.5px solid #FED7AA' : '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', background: isCritical ? '#FEF2F2' : isGrowing ? '#FFF7ED' : '#F0FDF4', color: isCritical ? '#DC2626' : isGrowing ? '#EA580C' : '#16A34A' }}>● {incident.stage || 'ACTIVE'}</span>
                        <span style={{ fontSize: '10px', color: '#94A3B8', fontFamily: 'monospace' }}>{incident.id}</span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0F172A', lineHeight: 1.35 }}>{incident.title}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748B', lineHeight: 1.4, flex: 1 }}>{(incident.summary || '').slice(0, 100)}{incident.summary?.length > 100 ? '…' : ''}</p>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: '#0369A1', background: '#F0F9FF', padding: '2px 8px', borderRadius: '6px', border: '1px solid #BAE6FD' }}>📍 {incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</span>
                        <span style={{ fontSize: '11px', color: '#92400E', background: '#FEF3C7', padding: '2px 8px', borderRadius: '6px', border: '1px solid #FDE68A' }}>⏱️ {incident.slaHoursLeft ? `${incident.slaHoursLeft}h` : '24h'}</span>
                      </div>
                      <Link to={`/intelligence/incidents/${incident.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)' }}>Investigate <ArrowRight style={{ width: '13px', height: '13px' }} /></Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW 4 — TABLE: Spreadsheet-style */}
            {viewMode === 'table' && (
              <div style={{ marginBottom: '32px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      {['Stage', 'ID', 'Title', 'Area', 'Lead Dept', 'Reports', 'SLA', ''].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 700, color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIncidents.map((incident, idx) => {
                      const isCritical = incident.stage === 'CRITICAL';
                      const isGrowing  = incident.stage === 'GROWING';
                      return (
                        <tr key={incident.id} style={{ borderBottom: '1px solid #F1F5F9', background: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                          <td style={{ padding: '10px 14px' }}><span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '999px', background: isCritical ? '#FEF2F2' : isGrowing ? '#FFF7ED' : '#F0FDF4', color: isCritical ? '#DC2626' : isGrowing ? '#EA580C' : '#16A34A' }}>● {incident.stage || 'ACTIVE'}</span></td>
                          <td style={{ padding: '10px 14px', fontFamily: 'monospace', color: '#64748B', fontSize: '11px' }}>{incident.id}</td>
                          <td style={{ padding: '10px 14px', fontWeight: 700, color: '#0F172A', maxWidth: '260px' }}>{incident.title}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</td>
                          <td style={{ padding: '10px 14px', color: '#475569' }}>{incident.leadDepartment?.split('(')[0]?.trim() || 'PMC'}</td>
                          <td style={{ padding: '10px 14px', color: '#0F172A', fontWeight: 700, textAlign: 'center' }}>{incident.signalCount || incident.complaintCount || 1}</td>
                          <td style={{ padding: '10px 14px' }}><span style={{ fontWeight: 700, color: incident.slaHoursLeft < 6 ? '#EF4444' : '#059669' }}>{incident.slaHoursLeft ? `${incident.slaHoursLeft}h` : '24h'}</span></td>
                          <td style={{ padding: '10px 14px' }}><Link to={`/intelligence/incidents/${incident.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', height: '28px', padding: '0 10px', borderRadius: '6px', background: '#059669', color: '#FFFFFF', fontSize: '11px', fontWeight: 700, textDecoration: 'none', boxShadow: '0 1px 4px rgba(5, 150, 105, 0.25)' }}>View <ArrowRight style={{ width: '11px', height: '11px' }} /></Link></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* VIEW 5 — MINIMAL: Ultra-clean text list */}
            {viewMode === 'minimal' && (
              <div style={{ marginBottom: '32px', display: 'flex', flexDirection: 'column' }}>
                {filteredIncidents.map((incident, idx) => {
                  const isCritical = incident.stage === 'CRITICAL';
                  const isGrowing  = incident.stage === 'GROWING';
                  return (
                    <Link key={incident.id} to={`/intelligence/incidents/${incident.id}`} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 4px', borderBottom: '1px solid #F1F5F9', textDecoration: 'none', transition: 'background 120ms ease' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isCritical ? '#EF4444' : isGrowing ? '#F97316' : '#22C55E', flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>{incident.title}</span>
                      <span style={{ fontSize: '11.5px', color: '#94A3B8', flexShrink: 0 }}>{incident.affectedArea?.split('(')[0]?.trim() || 'Ward 29'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: isCritical ? '#EF4444' : isGrowing ? '#F97316' : '#22C55E', flexShrink: 0 }}>{incident.stage}</span>
                      <ArrowRight style={{ width: '14px', height: '14px', color: '#CBD5E1', flexShrink: 0 }} />
                    </Link>
                  );
                })}
              </div>
            )}

            </div>
          )}

        {/* ══════════════════════════════════════════════════════════
            TAB 2: GEOSPATIAL PROBLEM SPREAD MAP
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'map' && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  🗺️ Geospatial Problem Spread Map
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                  Visualize how unaddressed pipeline or drainage issues spread across neighborhood wards over time.
                </p>
              </div>
            </div>

            <ProblemSpreadMap incident={civicIncidents[0]} spreadGeo={civicIncidents[0]?.spreadGeo} />
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 3: SMART DEPARTMENT ROUTING & AUTO-DISPATCH
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'routing' && (
          <div style={{ marginBottom: '32px' }}>
            {/* Header Description */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 22px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🎯 Smart Department Routing & Auto-Dispatch</span>
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
                  AI-powered domain classification, ward geo-fencing, and nodal officer dispatch in under 2 seconds.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                  ● Dispatch Engine Live
                </span>
              </div>
            </div>

            {/* 4 Minimalist Performance Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>First-Time Routing Accuracy</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>96.4%</strong>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Zero misdirection</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Avg AI Dispatch Latency</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>1.2s</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Indic NLP triage</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Auto-Routed Today</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#0284C7' }}>142</strong>
                  <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600 }}>Zero manual backlog</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Misdirection Rate</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>0.3%</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Down from 28% legacy</span>
                </div>
              </div>
            </div>

            {/* Department Filter Pills */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
              overflowX: 'auto',
              WebkitOverflowScrolling: 'touch',
              paddingBottom: '4px'
            }}>
              {[
                { id: 'ALL', label: 'All Departments', count: 6 },
                { id: 'WATER', label: '💧 Water Supply (PMC)', count: 1 },
                { id: 'WASTE', label: '🗑️ Solid Waste (PMC)', count: 1 },
                { id: 'ROADS', label: '🛣️ Roads & Infrastructure (PWD)', count: 1 },
                { id: 'POWER', label: '⚡ Power Grid (MSEDCL)', count: 1 },
                { id: 'DRAINAGE', label: '🌊 Drainage (PMC)', count: 1 },
                { id: 'HEALTH', label: '🏥 Public Health (PMC)', count: 1 }
              ].map((filterItem) => {
                const isSelected = routingFilter === filterItem.id;
                return (
                  <button
                    key={filterItem.id}
                    type="button"
                    onClick={() => setRoutingFilter(filterItem.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '999px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? '#0F172A' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#475569',
                      border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      transition: 'all 120ms ease'
                    }}
                  >
                    <span>{filterItem.label}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: isSelected ? '#334155' : '#F1F5F9',
                      color: isSelected ? '#38BDF8' : '#64748B'
                    }}>
                      {filterItem.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Live Auto-Routed Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {ROUTED_COMPLAINTS_DATA
                .filter(item => routingFilter === 'ALL' || item.categoryKey === routingFilter)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      padding: '18px 20px',
                      boxShadow: '0 2px 6px rgba(15, 23, 42, 0.02)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Top Row: IDs, Badges & Priority */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', color: '#0F172A', fontFamily: 'monospace' }}>
                          {item.id}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748B' }}>
                          • {item.timestamp}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0' }}>
                          {item.channel}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          background: item.priority === 'CRITICAL' || item.priority === 'EMERGENCY' ? '#FEF2F2' : '#FFFBEB',
                          color: item.priority === 'CRITICAL' || item.priority === 'EMERGENCY' ? '#DC2626' : '#D97706',
                          border: item.priority === 'CRITICAL' || item.priority === 'EMERGENCY' ? '1px solid #FECACA' : '1px solid #FDE68A'
                        }}>
                          ● {item.priority}
                        </span>

                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '3px 9px',
                          borderRadius: '999px',
                          background: '#ECFDF5',
                          color: '#059669',
                          border: '1px solid #A7F3D0',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Check style={{ width: '12px', height: '12px' }} /> {item.status}
                        </span>
                      </div>
                    </div>

                    {/* Citizen Input Box */}
                    <div style={{
                      background: '#F8FAFC',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      borderLeft: `4px solid ${item.deptColor}`,
                      borderTop: '1px solid #F1F5F9',
                      borderRight: '1px solid #F1F5F9',
                      borderBottom: '1px solid #F1F5F9'
                    }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                        CITIZEN INTAKE TRANSCRIPT:
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#1E293B', lineHeight: 1.5, fontWeight: 500 }}>
                        "{item.citizenInput}"
                      </p>
                    </div>

                    {/* Auto-Routing Intelligence Triad */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '10px',
                      paddingTop: '6px'
                    }}>
                      {/* Destination Dept */}
                      <div style={{ padding: '10px 12px', borderRadius: '10px', background: item.deptBg, border: `1px solid ${item.deptBorder}` }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: item.deptColor, textTransform: 'uppercase', display: 'block' }}>
                          🏛️ Routed Municipal Agency
                        </span>
                        <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                          {item.department}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#475569' }}>
                          📍 {item.ward}
                        </span>
                      </div>

                      {/* Assigned Officer */}
                      <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block' }}>
                          👤 Assigned Nodal Officer
                        </span>
                        <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', marginTop: '2px' }}>
                          {item.officer}
                        </strong>
                        <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
                          ⏱️ Resolution SLA: {item.sla}
                        </span>
                      </div>

                      {/* Confidence & Rule */}
                      <div style={{ padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block' }}>
                          ⚡ AI Match Score & Rule
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <strong style={{ fontSize: '13px', color: '#059669' }}>{item.confidence} Match</strong>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748B', display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {item.routingRule}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Smart Coordination Callout */}
            <div style={{
              background: '#F0FDF4',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '12.5px',
              color: '#166534'
            }}>
              <Sparkles style={{ width: '18px', height: '18px', color: '#16A34A', flexShrink: 0 }} />
              <div>
                <strong>Cross-Department Coordination Rule Active: </strong>
                <span>If a water pipeline excavation requires asphalt road cutting, an automated secondary notification is simultaneously dispatched to PWD Roads within 2 hours to avoid unpaved road craters.</span>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            TAB 4: DUPLICATE & SIMILAR COMPLAINT DETECTION
           ══════════════════════════════════════════════════════════ */}
        {activeTab === 'deduplication' && (
          <div style={{ marginBottom: '32px' }}>
            {/* Header Description */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 22px',
              border: '1px solid #E2E8F0',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔍 Duplicate & Similar Complaint Detection</span>
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Spatial and semantic clustering groups redundant citizen complaints into unified municipal work orders.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE' }}>
                  ● Deduplication Engine Active
                </span>
              </div>
            </div>

            {/* 4 Minimalist Deduplication Impact Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '12px',
              marginBottom: '20px'
            }}>
              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Duplicate Work Reduction</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#059669' }}>68.5%</strong>
                  <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>Merged into single jobs</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Redundant Visits Saved</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#0F172A' }}>79 Visits</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Zero duplicate fuel waste</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Field Hours Saved</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#0284C7' }}>37.5 hrs</strong>
                  <span style={{ fontSize: '11px', color: '#0284C7', fontWeight: 600 }}>This week</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '14px 18px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>Active Problem Clusters</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
                  <strong style={{ fontSize: '24px', fontWeight: 800, color: '#7C3AED' }}>5 Clusters</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>84 reports ➔ 5 tasks</span>
                </div>
              </div>
            </div>

            {/* 3-Step Deduplication Process Pill Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>1</span>
                <div>
                  <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block' }}>Indic NLP & Vision Match</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Semantic text & photo embedding</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>2</span>
                <div>
                  <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block' }}>Spatio-Temporal Radius</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Groups tickets within 150m & 72 hrs</span>
                </div>
              </div>

              <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FAF5FF', color: '#9333EA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '12px' }}>3</span>
                <div>
                  <strong style={{ fontSize: '12.5px', color: '#0F172A', display: 'block' }}>Unified Action & SMS Sync</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>1 field order + auto-sync to citizens</span>
                </div>
              </div>
            </div>

            {/* Active Problem Clusters List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {DUPLICATE_CLUSTERS_DATA.map((cluster) => {
                const isExpanded = expandedClusterId === cluster.id;
                return (
                  <div
                    key={cluster.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Cluster Summary Header */}
                    <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '6px', background: '#F1F5F9', color: '#334155', fontFamily: 'monospace' }}>
                            {cluster.masterTicket}
                          </span>
                          <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #DBEAFE' }}>
                            {cluster.deptIcon} {cluster.leadDept}
                          </span>
                        </div>

                        <span style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: '3px 10px',
                          borderRadius: '999px',
                          background: cluster.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                          color: cluster.severity === 'CRITICAL' ? '#DC2626' : '#D97706',
                          border: cluster.severity === 'CRITICAL' ? '1px solid #FECACA' : '1px solid #FDE68A'
                        }}>
                          ● {cluster.severity}
                        </span>
                      </div>

                      <div>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#0F172A' }}>
                          {cluster.title}
                        </h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                          <strong>Impact: </strong>{cluster.impactSummary}
                        </p>
                      </div>

                      {/* Cluster Indicators Strip */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                        gap: '8px',
                        background: '#F8FAFC',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: '1px solid #E2E8F0'
                      }}>
                        <div>
                          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Semantic Match</span>
                          <strong style={{ fontSize: '13px', color: '#059669' }}>{cluster.similarityScore}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Spatial Radius</span>
                          <strong style={{ fontSize: '13px', color: '#0284C7' }}>{cluster.geoRadius}</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Merged Reports</span>
                          <strong style={{ fontSize: '13px', color: '#7C3AED' }}>{cluster.totalReportsMerged} Complaints</strong>
                        </div>
                        <div>
                          <span style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Field Savings</span>
                          <strong style={{ fontSize: '13px', color: '#D97706' }}>{cluster.dispatchesSaved}</strong>
                        </div>
                      </div>

                      {/* Unified Action Bar */}
                      <div style={{
                        fontSize: '12.5px',
                        color: '#065F46',
                        background: '#ECFDF5',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid #A7F3D0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <CheckCircle2 style={{ width: '15px', height: '15px', color: '#059669', flexShrink: 0 }} />
                          <span><strong>Unified Action: </strong>{cluster.actionSummary}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => setExpandedClusterId(isExpanded ? null : cluster.id)}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid #A7F3D0',
                            borderRadius: '6px',
                            padding: '4px 10px',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: '#065F46',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>{isExpanded ? 'Hide Grouped Reports' : `Inspect Grouped Signals (${cluster.groupedSignals.length})`}</span>
                          {isExpanded ? <ChevronUp style={{ width: '13px', height: '13px' }} /> : <ChevronDown style={{ width: '13px', height: '13px' }} />}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Grouped Citizen Signals */}
                    {isExpanded && (
                      <div style={{
                        borderTop: '1px solid #E2E8F0',
                        background: '#FAFAFA',
                        padding: '16px 20px'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            Individual Citizen Signals Grouped Under Master Case:
                          </span>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                            All citizens auto-synced with single ticket updates
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {cluster.groupedSignals.map((sig) => (
                            <div
                              key={sig.id}
                              style={{
                                background: '#FFFFFF',
                                borderRadius: '10px',
                                border: '1px solid #E2E8F0',
                                padding: '10px 14px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '10px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', fontFamily: 'monospace' }}>
                                  {sig.id}
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', background: '#F1F5F9', color: '#475569' }}>
                                  {sig.type}
                                </span>
                                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                                  {sig.citizen}
                                </span>
                                <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                                  • {sig.time}
                                </span>
                              </div>

                              <div style={{ flex: 2, minWidth: '260px', fontSize: '12px', color: '#334155' }}>
                                "{sig.input}"
                              </div>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '2px 8px', borderRadius: '999px', border: '1px solid #A7F3D0' }}>
                                  {sig.score}% Match
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Territory Problem Explorer Modal (Today, Pending, Solved + Wagholi Pockets) */}
      <TerritoryProblemModal
        isOpen={showTerritoryModal}
        onClose={() => setShowTerritoryModal(false)}
        selectedWard="Wagholi Municipal Ward 27-31"
      />

      {/* Jan Suchna (जन सूचना) Broadcast Modal */}
      <JanSuchnaModal
        isOpen={showJanSuchnaModal}
        onClose={() => setShowJanSuchnaModal(false)}
      />

      {/* Citizen Signal Submission Modal */}
      <CivicSignalModal
        isOpen={showSignalModal}
        onClose={() => setShowSignalModal(false)}
      />
    </div>
  );
}
