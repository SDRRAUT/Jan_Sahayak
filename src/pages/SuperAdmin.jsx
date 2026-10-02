import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  ShieldCheck, 
  Activity, 
  TrendingUp, 
  BarChart3, 
  MapPin, 
  Plus, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Cpu, 
  Phone, 
  Mail, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Filter, 
  Layers, 
  ExternalLink, 
  ShieldAlert,
  Send,
  X,
  Droplets,
  Zap,
  Trash2,
  TreePine,
  Briefcase
} from 'lucide-react';
import { useApp } from '../context/AppContext';

// ============================================================================
// PUNE DISTRICT & PMC MUNICIPAL SEED DATA
// ============================================================================

const PUNE_ZONES_AND_WARDS = [
  {
    zone: 'Zone 1 (East Pune)',
    wards: [
      { code: 'W-29', name: 'Wagholi & Kesnand Road', officer: 'Er. Sandeep Patil', officerRole: 'Executive Ward Officer', population: '1,85,000', readiness: '92%', staffOnDuty: 142, activeWorks: 6, sla: '94.2%', status: 'OPTIMAL' },
      { code: 'W-28', name: 'Nagar Road - Vadgaon Sheri', officer: 'Smt. Anjali Deshmukh', officerRole: 'Zonal Assistant Commissioner', population: '2,40,000', readiness: '95%', staffOnDuty: 168, activeWorks: 4, sla: '96.1%', status: 'OPTIMAL' },
      { code: 'W-27', name: 'Hadapsar - Mundhwa', officer: 'Er. Pravin Shinde', officerRole: 'Executive Ward Officer', population: '2,90,000', readiness: '89%', staffOnDuty: 185, activeWorks: 7, sla: '91.8%', status: 'ATTENTION' }
    ]
  },
  {
    zone: 'Zone 2 (West Pune)',
    wards: [
      { code: 'W-24', name: 'Aundh - Baner - Balewadi', officer: 'Dr. Nitin Kulkarni', officerRole: 'Zonal Assistant Commissioner', population: '2,65,000', readiness: '97%', staffOnDuty: 174, activeWorks: 3, sla: '98.0%', status: 'OPTIMAL' },
      { code: 'W-25', name: 'Kothrud - Bavdhan', officer: 'Er. Megha Joshi', officerRole: 'Executive Ward Officer', population: '2,80,000', readiness: '96%', staffOnDuty: 180, activeWorks: 5, sla: '97.4%', status: 'OPTIMAL' },
      { code: 'W-26', name: 'Warje - Karvenagar', officer: 'Shri Ganesh More', officerRole: 'Executive Ward Officer', population: '2,15,000', readiness: '93%', staffOnDuty: 130, activeWorks: 4, sla: '93.5%', status: 'OPTIMAL' }
    ]
  },
  {
    zone: 'Zone 3 (North & Old City)',
    wards: [
      { code: 'W-14', name: 'Shivajinagar - Ghole Road', officer: 'Er. Sunil Jadhav', officerRole: 'Executive Ward Officer', population: '2,10,000', readiness: '98%', staffOnDuty: 190, activeWorks: 3, sla: '97.8%', status: 'OPTIMAL' },
      { code: 'W-15', name: 'Kasba Peth - Vishrambaug Wada', officer: 'Smt. Rekha Sawant', officerRole: 'Senior Ward Officer', population: '1,95,000', readiness: '91%', staffOnDuty: 145, activeWorks: 5, sla: '92.4%', status: 'ATTENTION' },
      { code: 'W-16', name: 'Bhavani Peth & Timber Market', officer: 'Er. Vikas Dhumal', officerRole: 'Executive Ward Officer', population: '1,75,000', readiness: '88%', staffOnDuty: 125, activeWorks: 6, sla: '89.6%', status: 'ATTENTION' }
    ]
  },
  {
    zone: 'Zone 4 (South Pune)',
    wards: [
      { code: 'W-18', name: 'Bibwewadi - Salisbury Park', officer: 'Shri Mahesh Ghadge', officerRole: 'Executive Ward Officer', population: '2,30,000', readiness: '94%', staffOnDuty: 135, activeWorks: 3, sla: '95.1%', status: 'OPTIMAL' },
      { code: 'W-19', name: 'Dhankawadi - Sahakarnagar', officer: 'Er. Pooja Gaikwad', officerRole: 'Executive Ward Officer', population: '2,50,000', readiness: '95%', staffOnDuty: 140, activeWorks: 4, sla: '96.0%', status: 'OPTIMAL' },
      { code: 'W-20', name: 'Kondhwa - Yewalewadi', officer: 'Shri Asif Sheikh', officerRole: 'Zonal Assistant Commissioner', population: '3,10,000', readiness: '87%', staffOnDuty: 195, activeWorks: 8, sla: '88.5%', status: 'SCRUTINY' }
    ]
  },
  {
    zone: 'Zone 5 (Central & Cantonment)',
    wards: [
      { code: 'W-11', name: 'Pune Cantonment & Camp', officer: 'Er. Rajesh Nair', officerRole: 'Executive Officer', population: '1,60,000', readiness: '96%', staffOnDuty: 110, activeWorks: 2, sla: '97.2%', status: 'OPTIMAL' },
      { code: 'W-12', name: 'Pune Station - Sangamwadi', officer: 'Smt. Pallavi Shinde', officerRole: 'Senior Ward Officer', population: '1,80,000', readiness: '93%', staffOnDuty: 120, activeWorks: 4, sla: '94.0%', status: 'OPTIMAL' },
      { code: 'W-13', name: 'Yerawada - Kalas - Dhanori', officer: 'Er. Tanaji Mane', officerRole: 'Executive Ward Officer', population: '2,70,000', readiness: '90%', staffOnDuty: 160, activeWorks: 6, sla: '91.2%', status: 'ATTENTION' }
    ]
  }
];

const INITIAL_DEPARTMENTS = [
  {
    id: 'DEPT-WATER',
    code: 'PMC Water',
    name: 'Water Supply & Sewerage Drainage Department',
    head: 'Er. Sachin Patil',
    designation: 'Chief Engineer (Water Works)',
    email: 'sachin.patil@pmc.water.gov.in',
    phone: '+91 20 2550 1201',
    officersCount: 280,
    fieldSquads: 42,
    budgetAllocated: '₹380 Cr',
    budgetUtilized: '₹296 Cr (78%)',
    slaCompliance: '94.8%',
    avgTurnaround: '14.2 Hours',
    status: 'OPTIMAL',
    activeProjects: 9,
    keyFocus: 'Bhama Askhed Pipeline & 24x7 Equi-distribution Scheme'
  },
  {
    id: 'DEPT-PWD',
    code: 'PWD Pune',
    name: 'Public Works & Roads Infrastructure Department',
    head: 'Er. Rajesh K. Meena',
    designation: 'Superintending Engineer (Roads)',
    email: 'rajesh.meena@punepwd.gov.in',
    phone: '+91 20 2612 3400',
    officersCount: 340,
    fieldSquads: 54,
    budgetAllocated: '₹450 Cr',
    budgetUtilized: '₹368 Cr (82%)',
    slaCompliance: '88.2%',
    avgTurnaround: '18.5 Hours',
    status: 'ATTENTION',
    activeProjects: 14,
    keyFocus: 'Arterial Corridor Asphalt Resurfacing & Flyover Transitions'
  },
  {
    id: 'DEPT-SWM',
    code: 'PMC SWM',
    name: 'Solid Waste Management & Sanitation Department',
    head: 'Dr. K. S. Tyagi',
    designation: 'Chief Sanitary Inspector & Director SWM',
    email: 'ks.tyagi@pmc.swm.gov.in',
    phone: '+91 20 2550 1340',
    officersCount: 520,
    fieldSquads: 88,
    budgetAllocated: '₹210 Cr',
    budgetUtilized: '₹165 Cr (79%)',
    slaCompliance: '91.4%',
    avgTurnaround: '8.4 Hours',
    status: 'OPTIMAL',
    activeProjects: 6,
    keyFocus: '100% Ward Door-to-Door Segregation & Biogas Plants'
  },
  {
    id: 'DEPT-ELEC',
    code: 'MSEDCL & Light',
    name: 'Electrical Infrastructure & Streetlighting Department',
    head: 'Er. Neha Singh',
    designation: 'Executive Engineer (Grid Infrastructure)',
    email: 'neha.singh@msedcl.pune.in',
    phone: '+91 20 2565 8900',
    officersCount: 190,
    fieldSquads: 28,
    budgetAllocated: '₹120 Cr',
    budgetUtilized: '₹91 Cr (76%)',
    slaCompliance: '99.1%',
    avgTurnaround: '4.8 Hours',
    status: 'OPTIMAL',
    activeProjects: 4,
    keyFocus: 'Underground HT/LT Ducting & Smart LED Central Monitoring'
  },
  {
    id: 'DEPT-HEALTH',
    code: 'PMC Health',
    name: 'Public Health, Hospitals & Vector Control Department',
    head: 'Dr. Nina Borade',
    designation: 'Chief Medical Officer of Health',
    email: 'cmo.health@pmc.gov.in',
    phone: '+91 20 2550 1420',
    officersCount: 410,
    fieldSquads: 60,
    budgetAllocated: '₹180 Cr',
    budgetUtilized: '₹144 Cr (80%)',
    slaCompliance: '96.5%',
    avgTurnaround: '11.0 Hours',
    status: 'OPTIMAL',
    activeProjects: 5,
    keyFocus: 'Dengue & Waterborne Pathogen Testing, Mobile Health Dispensaries'
  },
  {
    id: 'DEPT-STORM',
    code: 'Storm & Flood',
    name: 'Stormwater Drainage & Disaster Preparedness Department',
    head: 'Er. Vijay Kulkarni',
    designation: 'Chief Disaster Management Officer',
    email: 'vijay.kulkarni@pmc.gov.in',
    phone: '+91 20 2550 1510',
    officersCount: 150,
    fieldSquads: 24,
    budgetAllocated: '₹95 Cr',
    budgetUtilized: '₹72 Cr (76%)',
    slaCompliance: '92.0%',
    avgTurnaround: '12.0 Hours',
    status: 'OPTIMAL',
    activeProjects: 3,
    keyFocus: 'Mula-Mutha River Nullah De-silting & Flood Retaining Walls'
  },
  {
    id: 'DEPT-GARDENS',
    code: 'Gardens & Tree',
    name: 'Gardens, Tree Authority & Urban Forestry Department',
    head: 'Shri Ashok Ghorpade',
    designation: 'Superintendent of Gardens',
    email: 'ashok.ghorpade@pmc.gov.in',
    phone: '+91 20 2550 1600',
    officersCount: 120,
    fieldSquads: 18,
    budgetAllocated: '₹45 Cr',
    budgetUtilized: '₹35 Cr (78%)',
    slaCompliance: '95.2%',
    avgTurnaround: '16.0 Hours',
    status: 'OPTIMAL',
    activeProjects: 2,
    keyFocus: 'Urban Tree Canopy Geo-tagging & Miyawaki Urban Forests'
  },
  {
    id: 'DEPT-TOWN',
    code: 'Town Planning',
    name: 'Town Planning, Building Permissions & Heritage Conservation',
    head: 'Shri Prashant Waghmare',
    designation: 'City Engineer & Chief Town Planner',
    email: 'prashant.waghmare@pmc.gov.in',
    phone: '+91 20 2550 1100',
    officersCount: 85,
    fieldSquads: 12,
    budgetAllocated: '₹60 Cr',
    budgetUtilized: '₹42 Cr (70%)',
    slaCompliance: '90.1%',
    avgTurnaround: '28.0 Hours',
    status: 'OPTIMAL',
    activeProjects: 4,
    keyFocus: 'GIS Base-map Verification & Transit Oriented Development Along Metro'
  }
];

const INITIAL_OFFICERS = [
  { id: 'OFF-001', name: 'Er. Sanjay Sharma', badge: 'MAH-PMC-ENG-0841', designation: 'Executive Engineer', department: 'PMC Water', ward: 'Wagholi & Kesnand Road (Ward 29)', email: 'sanjay.sharma@pmc.water.gov.in', phone: '+91 98221 44019', status: 'ON_DUTY', rating: 4.9, casesResolved: 412, slaRate: '97.4%' },
  { id: 'OFF-002', name: 'Er. Sachin Patil', badge: 'MAH-PMC-ENG-0012', designation: 'Chief Engineer', department: 'PMC Water', ward: 'Headquarters & East Zone', email: 'sachin.patil@pmc.water.gov.in', phone: '+91 98220 11002', status: 'ON_DUTY', rating: 4.8, casesResolved: 1280, slaRate: '96.8%' },
  { id: 'OFF-003', name: 'Er. Rajesh K. Meena', badge: 'MAH-PWD-SE-0304', designation: 'Superintending Engineer', department: 'PWD Pune', ward: 'Citywide Arterial Corridors', email: 'rajesh.meena@punepwd.gov.in', phone: '+91 98230 77812', status: 'ON_DUTY', rating: 4.7, casesResolved: 890, slaRate: '88.2%' },
  { id: 'OFF-004', name: 'Er. Neha Singh', badge: 'MAH-MSE-EE-1902', designation: 'Executive Engineer (Sub-Div)', department: 'MSEDCL & Light', ward: 'Wagholi, Nagar Road & Kharadi', email: 'neha.singh@msedcl.pune.in', phone: '+91 98225 66701', status: 'FIELD_INSPECTION', rating: 4.9, casesResolved: 560, slaRate: '99.1%' },
  { id: 'OFF-005', name: 'Dr. K. S. Tyagi', badge: 'MAH-PMC-SWM-0055', designation: 'Chief Sanitary Inspector', department: 'PMC SWM', ward: 'Central SWM Operations', email: 'ks.tyagi@pmc.swm.gov.in', phone: '+91 98222 33499', status: 'ON_DUTY', rating: 4.8, casesResolved: 1420, slaRate: '91.4%' },
  { id: 'OFF-006', name: 'Er. Sandeep Patil', badge: 'MAH-PMC-WARD-0291', designation: 'Executive Ward Officer', department: 'PMC Water', ward: 'Wagholi & Kesnand Road (Ward 29)', email: 'sandeep.patil@pmc.gov.in', phone: '+91 98224 88120', status: 'ON_DUTY', rating: 4.7, casesResolved: 340, slaRate: '94.2%' },
  { id: 'OFF-007', name: 'Dr. Nina Borade', badge: 'MAH-PMC-MED-0001', designation: 'Chief Medical Officer', department: 'PMC Health', ward: 'Citywide Health & Hospitals', email: 'cmo.health@pmc.gov.in', phone: '+91 98220 99441', status: 'ON_DUTY', rating: 4.9, casesResolved: 720, slaRate: '96.5%' },
  { id: 'OFF-008', name: 'Er. Vijay Kulkarni', badge: 'MAH-PMC-ENG-0511', designation: 'Chief Disaster Officer', department: 'Storm & Flood', ward: 'Mula-Mutha River Basins', email: 'vijay.kulkarni@pmc.gov.in', phone: '+91 98231 22904', status: 'ON_DUTY', rating: 4.8, casesResolved: 290, slaRate: '92.0%' },
  { id: 'OFF-009', name: 'Smt. Anjali Deshmukh', badge: 'MAH-PMC-WARD-0280', designation: 'Zonal Assistant Commissioner', department: 'PWD Pune', ward: 'Nagar Road - Vadgaon Sheri (Ward 28)', email: 'anjali.deshmukh@pmc.gov.in', phone: '+91 98229 55670', status: 'ON_DUTY', rating: 4.8, casesResolved: 480, slaRate: '96.1%' },
  { id: 'OFF-010', name: 'Er. Ramesh Shinde', badge: 'MAH-PMC-ENG-1104', designation: 'Junior Engineer (Field Works)', department: 'PWD Pune', ward: 'Hadapsar - Mundhwa (Ward 27)', email: 'ramesh.shinde@pmc.gov.in', phone: '+91 98226 77119', status: 'FIELD_INSPECTION', rating: 4.6, casesResolved: 310, slaRate: '91.8%' },
  { id: 'OFF-011', name: 'Dr. Nitin Kulkarni', badge: 'MAH-PMC-WARD-0240', designation: 'Zonal Assistant Commissioner', department: 'PMC Health', ward: 'Aundh - Baner - Balewadi (Ward 24)', email: 'nitin.kulkarni@pmc.gov.in', phone: '+91 98228 11993', status: 'ON_DUTY', rating: 4.9, casesResolved: 620, slaRate: '98.0%' },
  { id: 'OFF-012', name: 'Shri Asif Sheikh', badge: 'MAH-PMC-WARD-0200', designation: 'Executive Ward Officer', department: 'PMC SWM', ward: 'Kondhwa - Yewalewadi (Ward 20)', email: 'asif.sheikh@pmc.gov.in', phone: '+91 98223 44882', status: 'ON_DUTY', rating: 4.5, casesResolved: 295, slaRate: '88.5%' }
];

const INITIAL_DIRECTIVES = [
  {
    id: 'DIR-2026-081',
    date: '2026-10-02',
    issuer: 'Dr. Meenakshi Sundaram, IAS',
    title: 'Mandatory Joint Trenching & Asphalt Restoration Protocol',
    targetDepts: ['PMC Water', 'PWD Pune', 'MSEDCL & Light'],
    priority: 'CRITICAL',
    status: 'ACTIVE_ENFORCEMENT',
    summary: 'Any pipeline repair excavation on arterial Pune-Nagar Road and Solapur Highway must have asphalt backfilled and compacted within 24 hours under joint PWD engineer sign-off.'
  },
  {
    id: 'DIR-2026-080',
    date: '2026-09-28',
    issuer: 'Dr. Meenakshi Sundaram, IAS',
    title: 'Pre-Monsoon Stormwater Drainage Culvert Desilting Sweep',
    targetDepts: ['Storm & Flood', 'PMC SWM'],
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    summary: '100% de-silting of major nullahs across 15 wards prior to seasonal rainfall, with drone telemetry verified weekly.'
  },
  {
    id: 'DIR-2026-079',
    date: '2026-09-20',
    issuer: 'Dr. Meenakshi Sundaram, IAS',
    title: 'Real-Time Feeder SCADA Integration for Pumping Reservoirs',
    targetDepts: ['PMC Water', 'MSEDCL & Light'],
    priority: 'HIGH',
    status: 'COMPLETED',
    summary: 'Khadakwasla and Bhama Askhed raw water pumping stations granted dedicated priority grid feeder lines to eliminate supply disruptions.'
  }
];

export default function SuperAdmin() {
  const { user } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'city_dashboard';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams(tabId === 'city_dashboard' ? {} : { tab: tabId });
  };

  // Data States
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [officers, setOfficers] = useState(INITIAL_OFFICERS);
  const [directives, setDirectives] = useState(INITIAL_DIRECTIVES);

  // Filters for Officers
  const [officerDeptFilter, setOfficerDeptFilter] = useState('ALL');
  const [officerStatusFilter, setOfficerStatusFilter] = useState('ALL');
  const [officerSearch, setOfficerSearch] = useState('');

  // Modals State
  const [showAddOfficerModal, setShowAddOfficerModal] = useState(false);
  const [showAddDirectiveModal, setShowAddDirectiveModal] = useState(false);
  const [showAddDeptModal, setShowAddDeptModal] = useState(false);

  // New Officer Form State
  const [newOfficerName, setNewOfficerName] = useState('');
  const [newOfficerDept, setNewOfficerDept] = useState('PMC Water');
  const [newOfficerDesignation, setNewOfficerDesignation] = useState('Executive Engineer');
  const [newOfficerWard, setNewOfficerWard] = useState('Wagholi & Kesnand Road (Ward 29)');
  const [newOfficerEmail, setNewOfficerEmail] = useState('');
  const [newOfficerPhone, setNewOfficerPhone] = useState('');

  // New Directive Form State
  const [newDirectiveTitle, setNewDirectiveTitle] = useState('');
  const [newDirectiveTarget, setNewDirectiveTarget] = useState('ALL_DEPTS');
  const [newDirectivePriority, setNewDirectivePriority] = useState('HIGH');
  const [newDirectiveSummary, setNewDirectiveSummary] = useState('');

  // New Dept Form State
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptHead, setNewDeptHead] = useState('');
  const [newDeptBudget, setNewDeptBudget] = useState('₹100 Cr');

  // Audit Logs State
  const [auditLogs] = useState([
    { id: 'AUDIT-8841', timestamp: '2026-10-02 09:30 AM', actor: 'Dr. Meenakshi Sundaram, IAS', action: 'DIRECTIVE_ISSUED', details: 'Published Joint Trenching & Asphalt Restoration Protocol across Pune-Nagar Road corridor' },
    { id: 'AUDIT-8842', timestamp: '2026-10-02 08:45 AM', actor: 'PMC Water Headquarters', action: 'CAPACITY_REBALANCE', details: 'Mobilized 6 standby electrofusion welding teams from Baner depot to Wagholi Ward 29' },
    { id: 'AUDIT-8843', timestamp: '2026-10-02 07:15 AM', actor: 'Pune Municipal SCADA Hub', action: 'TELEMETRY_SYNC', details: 'All 15 ward ESR/GSR reservoirs telemetry synchronized; average city grid pressure 94.2%' },
    { id: 'AUDIT-8844', timestamp: '2026-10-01 18:20 PM', actor: 'PWD Central Command', action: 'BUDGET_DISBURSED', details: '₹14.5 Cr tranche allocated for Nagar Road arterial resurfacing contract (Tender PWD-2026-88)' },
    { id: 'AUDIT-8845', timestamp: '2026-10-01 14:10 PM', actor: 'System Governance Guard', action: 'DPDP_CRYPT_VERIFIED', details: 'Zero privacy breaches; citizen identity cryptographic hash certified under DPDP Act 2023' }
  ]);

  // Handlers
  const handleAddOfficer = (e) => {
    e.preventDefault();
    if (!newOfficerName.trim()) return;
    const newEntry = {
      id: `OFF-0${officers.length + 1}`,
      name: newOfficerName,
      badge: `MAH-PMC-ENG-${Math.floor(1000 + Math.random() * 9000)}`,
      designation: newOfficerDesignation,
      department: newOfficerDept,
      ward: newOfficerWard,
      email: newOfficerEmail || `${newOfficerName.toLowerCase().replace(/[^a-z]/g, '')}@pmc.gov.in`,
      phone: newOfficerPhone || '+91 98220 00000',
      status: 'ON_DUTY',
      rating: 5.0,
      casesResolved: 0,
      slaRate: '100%'
    };
    setOfficers(prev => [newEntry, ...prev]);
    setNewOfficerName('');
    setNewOfficerEmail('');
    setNewOfficerPhone('');
    setShowAddOfficerModal(false);
  };

  const handleAddDirective = (e) => {
    e.preventDefault();
    if (!newDirectiveTitle.trim()) return;
    const newDir = {
      id: `DIR-2026-0${directives.length + 82}`,
      date: new Date().toISOString().split('T')[0],
      issuer: user?.name || 'Dr. Meenakshi Sundaram, IAS',
      title: newDirectiveTitle,
      targetDepts: newDirectiveTarget === 'ALL_DEPTS' ? ['All Pune Municipal Departments'] : [newDirectiveTarget],
      priority: newDirectivePriority,
      status: 'ACTIVE_ENFORCEMENT',
      summary: newDirectiveSummary || 'Executive administrative mandate issued to field engineers and ward officers.'
    };
    setDirectives(prev => [newDir, ...prev]);
    setNewDirectiveTitle('');
    setNewDirectiveSummary('');
    setShowAddDirectiveModal(false);
  };

  const handleAddDept = (e) => {
    e.preventDefault();
    if (!newDeptName.trim() || !newDeptCode.trim()) return;
    const newDept = {
      id: `DEPT-${Date.now()}`,
      code: newDeptCode.toUpperCase(),
      name: newDeptName,
      head: newDeptHead || 'Officer In-Charge',
      designation: 'Department Director',
      email: `admin.${newDeptCode.toLowerCase()}@pmc.gov.in`,
      phone: '+91 20 2550 0000',
      officersCount: 45,
      fieldSquads: 8,
      budgetAllocated: newDeptBudget,
      budgetUtilized: '₹0 Cr (0%)',
      slaCompliance: '100%',
      avgTurnaround: '12.0 Hours',
      status: 'OPTIMAL',
      activeProjects: 1,
      keyFocus: 'Initial department operationalization'
    };
    setDepartments(prev => [...prev, newDept]);
    setNewDeptCode('');
    setNewDeptName('');
    setNewDeptHead('');
    setShowAddDeptModal(false);
  };

  // Filtered Officers List
  const filteredOfficers = officers.filter(o => {
    const matchesDept = officerDeptFilter === 'ALL' || o.department === officerDeptFilter;
    const matchesStatus = officerStatusFilter === 'ALL' || o.status === officerStatusFilter;
    const matchesSearch = !officerSearch || 
      o.name.toLowerCase().includes(officerSearch.toLowerCase()) ||
      o.badge.toLowerCase().includes(officerSearch.toLowerCase()) ||
      o.ward.toLowerCase().includes(officerSearch.toLowerCase()) ||
      o.designation.toLowerCase().includes(officerSearch.toLowerCase());
    return matchesDept && matchesStatus && matchesSearch;
  });

  return (
    <div className="section-spacing" style={{ paddingTop: '24px' }}>
      <div className="container">

        {/* ===================================================================
            EXECUTIVE HEADER (PMC PUNE DISTRICT GOVERNANCE COMMAND)
            =================================================================== */}
        <div style={{
          background: 'linear-gradient(135deg, #064E3B 0%, #065F46 100%)',
          borderRadius: 'var(--radius-xl)',
          padding: '28px 32px',
          color: '#FFFFFF',
          marginBottom: '26px',
          boxShadow: '0 10px 30px rgba(6, 78, 59, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle civic watermark icon */}
          <Building2 style={{
            position: 'absolute',
            right: '-20px',
            bottom: '-25px',
            width: '200px',
            height: '200px',
            color: 'rgba(255, 255, 255, 0.05)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(4px)', fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '10px' }}>
                <ShieldCheck style={{ width: '13px', height: '13px', color: '#86EFAC' }} />
                <span>PUNE DISTRICT & PMC MUNICIPAL GOVERNANCE COMMAND</span>
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.02em' }}>
                Pune Municipal Corporation (PMC) — Citywide Administration
              </h1>
              <p style={{ fontSize: '13.5px', color: '#D1FAE5', margin: 0, maxWidth: '680px', lineHeight: 1.5 }}>
                Executive Secretariat: <strong>{user?.name || 'Dr. Meenakshi Sundaram, IAS'}</strong> • Municipal Commissioner & District Magistrate, Pune.
                Direct oversight over all 15 administrative wards, 8 municipal departments, citywide infrastructure grids, and officer deployment rosters.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: '#FFFFFF', color: '#065F46', fontSize: '12px', fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                <span>15 Wards Connected • All Grids Active</span>
              </div>
              <span style={{ fontSize: '11px', color: '#A7F3D0' }}>
                PMC Central Command • Shivajinagar, Pune 411005
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            EXECUTIVE TAB NAVIGATION (No Complaints Tab!)
            =================================================================== */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px',
          borderBottom: '2px solid #E2E8F0',
          paddingBottom: '12px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch'
        }}>
          {[
            { id: 'city_dashboard', label: 'Whole City Dashboard', icon: BarChart3, count: '15 Wards' },
            { id: 'departments', label: 'Departments & Officers', icon: Building2, count: `${departments.length} Depts` },
            { id: 'wards', label: '15 Administrative Wards', icon: MapPin, count: '5 Zones' },
            { id: 'directives', label: 'Executive Directives', icon: FileText, count: directives.length },
            { id: 'audit', label: 'Cryptographic Audit Trail', icon: ShieldCheck, count: 'SHA-256' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  background: isActive ? '#065F46' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#475569',
                  border: isActive ? 'none' : '1px solid #CBD5E1',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 4px 12px rgba(6, 95, 70, 0.25)' : 'none',
                  transition: 'all 150ms ease'
                }}
              >
                <Icon style={{ width: '15px', height: '15px' }} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '1px 6px',
                  borderRadius: '999px',
                  background: isActive ? 'rgba(255, 255, 255, 0.25)' : '#F1F5F9',
                  color: isActive ? '#FFFFFF' : '#64748B',
                  fontWeight: 800
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ===================================================================
            TAB 1: WHOLE CITY DASHBOARD (MACRO CITYWIDE GOVERNANCE)
            =================================================================== */}
        {activeTab === 'city_dashboard' && (
          <div>
            {/* Macro KPI Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
              gap: '14px',
              marginBottom: '24px'
            }}>
              <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #059669' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                  City Operational Health
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', marginTop: '4px' }}>
                  94.2%
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11.5px', color: '#059669', marginTop: '2px', fontWeight: 600 }}>
                  <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                  <span>Grade A+ City Governance</span>
                </div>
              </div>

              <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #0284C7' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                  Municipal Budget Disbursed
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#0284C7', marginTop: '4px' }}>
                  ₹1,420 Cr
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                  78.4% Utilized (₹308 Cr Reserve)
                </span>
              </div>

              <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #7C3AED' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                  Municipal Workforce On Duty
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#7C3AED', marginTop: '4px' }}>
                  1,945
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                  Officers & Engineers across 15 wards
                </span>
              </div>

              <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #EA580C' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                  Citywide SLA On-Time Rate
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#EA580C', marginTop: '4px' }}>
                  94.8%
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                  Average Resolution: 12.8 hrs
                </span>
              </div>

              <div className="card" style={{ padding: '18px 20px', borderLeft: '4px solid #10B981' }}>
                <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', display: 'block' }}>
                  Citizen Satisfaction Score
                </span>
                <div style={{ fontSize: '28px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10B981', marginTop: '4px' }}>
                  4.7 <span style={{ fontSize: '16px', color: '#64748B' }}>/ 5.0</span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                  Based on 34,200 verified Pune ratings
                </span>
              </div>
            </div>

            {/* City Utilities Telemetry Bar */}
            <div className="card" style={{ padding: '20px 24px', marginBottom: '24px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity style={{ width: '18px', height: '18px', color: '#059669' }} />
                  <strong style={{ fontSize: '14px', color: '#0F172A' }}>Live Municipal Utility Telemetry (Pune City SCADA)</strong>
                </div>
                <span style={{ fontSize: '11px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>
                  Auto-refreshes every 30s • Telemetry Feed OK
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px'
              }}>
                <div style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Droplets style={{ width: '15px', height: '15px', color: '#0284C7' }} />
                    <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Water Distribution Feeder</strong>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#0284C7' }}>1,450 MLD</div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Khadakwasla & Bhama Askhed (94% Normal Pressure)</span>
                </div>

                <div style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Building2 style={{ width: '15px', height: '15px', color: '#EA580C' }} />
                    <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>PWD Road Work Fleets</strong>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#EA580C' }}>24 Squads Active</div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Jet-patcher & asphalt teams on arterial roads</span>
                </div>

                <div style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Trash2 style={{ width: '15px', height: '15px', color: '#059669' }} />
                    <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Solid Waste Processing</strong>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#059669' }}>2,150 MT / Day</div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>100% bio-methanation & processing plants running</span>
                </div>

                <div style={{ padding: '12px 14px', background: '#FFFFFF', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <Zap style={{ width: '15px', height: '15px', color: '#7C3AED' }} />
                    <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>Smart Streetlights</strong>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#7C3AED' }}>99.1% Uptime</div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>48,200 automated LED luminaires online</span>
                </div>
              </div>
            </div>

            {/* Pune 5 Zones & 15 Wards Performance Grid */}
            <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', color: '#0F172A', margin: '0 0 4px 0' }}>
                    Pune 5 Administrative Zones & 15 Wards Performance
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                    Zonal readiness indices, field officer commands, and municipal infrastructure status across Pune district.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', fontSize: '11.5px', color: '#64748B' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', background: '#ECFDF5', color: '#065F46', fontWeight: 700 }}>● OPTIMAL (90%+)</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '4px', background: '#FEF3C7', color: '#92400E', fontWeight: 700 }}>● ATTENTION (&lt;90%)</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {PUNE_ZONES_AND_WARDS.map((zoneObj, idx) => (
                  <div key={idx} style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px 18px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <strong style={{ fontSize: '13.5px', color: '#0F172A' }}>{zoneObj.zone}</strong>
                      <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>{zoneObj.wards.length} Wards Active</span>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '12px'
                    }}>
                      {zoneObj.wards.map((ward) => (
                        <div
                          key={ward.code}
                          style={{
                            background: '#FFFFFF',
                            borderRadius: '10px',
                            padding: '14px',
                            border: `1px solid ${ward.status === 'OPTIMAL' ? '#A7F3D0' : '#FDE68A'}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div>
                              <span style={{ fontSize: '10.5px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: '#F1F5F9', color: '#475569', fontFamily: 'var(--font-mono)' }}>
                                {ward.code}
                              </span>
                              <strong style={{ fontSize: '13px', display: 'block', color: '#0F172A', marginTop: '4px' }}>
                                {ward.name}
                              </strong>
                            </div>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '999px',
                              background: ward.status === 'OPTIMAL' ? '#ECFDF5' : '#FEF3C7',
                              color: ward.status === 'OPTIMAL' ? '#065F46' : '#92400E'
                            }}>
                              {ward.readiness} Readiness
                            </span>
                          </div>

                          <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px', lineHeight: 1.4 }}>
                            <div>Officer In-Charge: <strong style={{ color: '#0F172A' }}>{ward.officer}</strong></div>
                            <div style={{ fontSize: '10.5px' }}>{ward.officerRole}</div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '8px', fontSize: '11px', color: '#64748B' }}>
                            <span>Population: <strong>{ward.population}</strong></span>
                            <span>Staff on Duty: <strong>{ward.staffOnDuty}</strong></span>
                            <span style={{ color: '#059669', fontWeight: 700 }}>SLA: {ward.sla}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inter-Department Coordination Highlights */}
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <Layers style={{ width: '18px', height: '18px', color: '#059669' }} />
                <h3 style={{ fontSize: '16px', color: '#0F172A', margin: 0 }}>
                  Active Inter-Departmental Joint Operations
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '14px' }}>
                <div style={{ padding: '14px 16px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#DBEAFE', color: '#1E40AF' }}>
                      JOINT TASKFORCE #1
                    </span>
                    <strong style={{ fontSize: '13px', color: '#0F172A' }}>Wagholi Nagar Road Arterial Corridor</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    Coordinated 200mm water main replacement with immediate PWD cold-mix asphalt overlay. 14 teams mobilized.
                  </p>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Departments: <strong>PMC Water + PWD Pune</strong> • Lead: Er. Sanjay Sharma
                  </div>
                </div>

                <div style={{ padding: '14px 16px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#DCFCE7', color: '#166534' }}>
                      JOINT TASKFORCE #2
                    </span>
                    <strong style={{ fontSize: '13px', color: '#0F172A' }}>Monsoon Flood Mitigation Sweep</strong>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 8px 0', lineHeight: 1.4 }}>
                    Heavy culvert de-silting along Mula-Mutha riverbanks and Wagholi nullahs with dedicated hook loaders.
                  </p>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Departments: <strong>Storm & Flood + PMC SWM</strong> • Lead: Er. Vijay Kulkarni
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 2: DEPARTMENTS & OFFICERS CONSOLE (MERGED)
            =================================================================== */}
        {activeTab === 'departments' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0F172A', margin: '0 0 4px 0' }}>
                  Municipal Departments & Officer Workforce Console
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  Strategic oversight of all 8 PMC departments, budget utilizations, SLAs, and active officer deployment rosters.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(true)}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#065F46',
                    color: '#FFFFFF',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 700,
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <Plus style={{ width: '15px', height: '15px' }} />
                  <span>Register Department</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(true)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#FFFFFF',
                    color: '#065F46',
                    border: '1px solid #065F46',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Users style={{ width: '15px', height: '15px' }} />
                  <span>Deploy Officer</span>
                </button>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '18px'
            }}>
              {departments.map((dept) => (
                <div
                  key={dept.id || dept.code}
                  className="card"
                  style={{
                    padding: '20px 22px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#F1F5F9', color: '#334155', fontFamily: 'var(--font-mono)' }}>
                          {dept.code}
                        </span>
                        <h3 style={{ fontSize: '15px', color: '#0F172A', margin: '6px 0 2px 0', lineHeight: 1.3 }}>
                          {dept.name}
                        </h3>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        background: dept.status === 'OPTIMAL' ? '#ECFDF5' : '#FEF3C7',
                        color: dept.status === 'OPTIMAL' ? '#065F46' : '#92400E'
                      }}>
                        {dept.status || 'ACTIVE'}
                      </span>
                    </div>

                    <div style={{ padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', marginBottom: '14px', fontSize: '12px' }}>
                      <div style={{ color: '#64748B' }}>Department Head:</div>
                      <strong style={{ color: '#0F172A', fontSize: '13px' }}>{dept.head}</strong>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>{dept.designation}</div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '11px', color: '#0284C7' }}>
                        <span>✉ {dept.email}</span>
                        <span>☎ {dept.phone}</span>
                      </div>
                    </div>

                    {/* Department KPIs Grid */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '10px',
                      marginBottom: '14px',
                      fontSize: '12px'
                    }}>
                      <div style={{ padding: '8px 10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                        <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>OFFICERS ON ROSTER</span>
                        <strong style={{ fontSize: '15px', color: '#0F172A' }}>{dept.officersCount || dept.officers}</strong>
                        <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>({dept.fieldSquads || 12} Field Squads)</span>
                      </div>

                      <div style={{ padding: '8px 10px', background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                        <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>SLA COMPLIANCE</span>
                        <strong style={{ fontSize: '15px', color: '#059669' }}>{dept.slaCompliance || dept.sla}</strong>
                        <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block' }}>Avg TAT: {dept.avgTurnaround || '14h'}</span>
                      </div>
                    </div>

                    {/* Budget progress bar */}
                    <div style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                        <span style={{ color: '#64748B' }}>Budget Allocation: <strong>{dept.budgetAllocated}</strong></span>
                        <span style={{ color: '#065F46', fontWeight: 700 }}>Utilized: {dept.budgetUtilized}</span>
                      </div>
                      <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: '78%', background: '#065F46', borderRadius: '999px' }} />
                      </div>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#475569', lineHeight: 1.4, marginBottom: '12px' }}>
                      Focus: <em>{dept.keyFocus || 'Continuous municipal infrastructure maintenance & public service.'}</em>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #F1F5F9', paddingTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setNewDirectiveTarget(dept.code);
                        setShowAddDirectiveModal(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#0F172A',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Issue Directive
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setOfficerDeptFilter(dept.code);
                        const rosterElem = document.getElementById('departments-officer-roster');
                        if (rosterElem) rosterElem.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{
                        flex: 1,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: '#065F46',
                        color: '#FFFFFF',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      View Officers ({dept.officersCount || dept.officers})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Integrated Department Officers & Workforce Roster */}
            <div id="departments-officer-roster" style={{ marginTop: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Users style={{ width: '22px', height: '22px', color: '#065F46' }} />
                  <div>
                    <h3 style={{ fontSize: '18px', color: '#0F172A', margin: 0 }}>
                      {officerDeptFilter === 'ALL' ? 'All Municipal Officers & Field Workforce Roster' : `${officerDeptFilter} — Deployed Officer Roster`}
                    </h3>
                    <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Filter officers by department vertical, active duty status, and ward jurisdictions.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {officerDeptFilter !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => setOfficerDeptFilter('ALL')}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '999px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        border: '1px solid #CBD5E1',
                        background: '#F1F5F9',
                        color: '#334155',
                        cursor: 'pointer'
                      }}
                    >
                      ✕ Show All Depts
                    </button>
                  )}
                  <span style={{ fontSize: '12px', color: '#065F46', fontWeight: 700, background: '#ECFDF5', padding: '4px 12px', borderRadius: '999px', border: '1px solid #A7F3D0' }}>
                    {filteredOfficers.length} Officers Showing
                  </span>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B', marginRight: '4px' }}>Department:</span>
                    {['ALL', 'PMC Water', 'PWD Pune', 'PMC SWM', 'MSEDCL & Light', 'PMC Health'].map((dep) => (
                      <button
                        key={dep}
                        type="button"
                        onClick={() => setOfficerDeptFilter(dep)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '999px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          border: officerDeptFilter === dep ? 'none' : '1px solid #CBD5E1',
                          background: officerDeptFilter === dep ? '#065F46' : '#FFFFFF',
                          color: officerDeptFilter === dep ? '#FFFFFF' : '#475569',
                          cursor: 'pointer'
                        }}
                      >
                        {dep}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748B' }}>Status:</span>
                    {['ALL', 'ON_DUTY', 'FIELD_INSPECTION'].map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setOfficerStatusFilter(st)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '999px',
                          fontSize: '11px',
                          fontWeight: 700,
                          border: officerStatusFilter === st ? 'none' : '1px solid #CBD5E1',
                          background: officerStatusFilter === st ? '#1E293B' : '#FFFFFF',
                          color: officerStatusFilter === st ? '#FFFFFF' : '#64748B',
                          cursor: 'pointer'
                        }}
                      >
                        {st === 'ALL' ? 'ALL STATUS' : st.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search input */}
                <div style={{ position: 'relative', marginTop: '12px' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: '#94A3B8' }} />
                  <input
                    type="text"
                    value={officerSearch}
                    onChange={(e) => setOfficerSearch(e.target.value)}
                    placeholder="Search officers by name, badge ID, ward jurisdiction, or designation..."
                    style={{
                      width: '100%',
                      height: '40px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      padding: '0 12px 0 38px',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </div>

              {/* Officers Table */}
              <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>OFFICER / BADGE</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>DESIGNATION</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>DEPARTMENT</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>ASSIGNED WARD</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>CONTACT</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700 }}>STATUS</th>
                        <th style={{ padding: '12px 16px', color: '#64748B', fontWeight: 700, textAlign: 'right' }}>RATING & SLA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOfficers.map((off) => (
                        <tr key={off.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '14px 16px' }}>
                            <strong style={{ fontSize: '13.5px', color: '#0F172A', display: 'block' }}>{off.name}</strong>
                            <span style={{ fontSize: '10.5px', color: '#64748B', fontFamily: 'var(--font-mono)' }}>{off.badge}</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#334155', fontWeight: 600 }}>
                            {off.designation}
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px', background: '#F1F5F9', color: '#065F46' }}>
                              {off.department}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#475569', fontSize: '12.5px' }}>
                            {off.ward}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '11.5px', color: '#64748B' }}>
                            <div>{off.phone}</div>
                            <div style={{ color: '#0284C7' }}>{off.email}</div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              borderRadius: '999px',
                              background: off.status === 'ON_DUTY' ? '#ECFDF5' : '#FEF3C7',
                              color: off.status === 'ON_DUTY' ? '#065F46' : '#92400E'
                            }}>
                              ● {off.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, color: '#0F172A' }}>★ {off.rating}</div>
                            <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>{off.slaRate} SLA</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 4: 15 ADMINISTRATIVE WARDS DIRECTORY
            =================================================================== */}
        {activeTab === 'wards' && (
          <div>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', color: '#0F172A', margin: '0 0 4px 0' }}>
                Pune District 15 Municipal Administrative Wards Directory
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                Zonal administrative offices, ward executive contacts, and municipal asset breakdown.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {PUNE_ZONES_AND_WARDS.map((zoneObj, zIndex) => (
                <div key={zIndex} className="card" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin style={{ width: '18px', height: '18px', color: '#065F46' }} />
                      <h3 style={{ fontSize: '16px', color: '#0F172A', margin: 0 }}>{zoneObj.zone}</h3>
                    </div>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>Zonal HQ Office Connected</span>
                  </div>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '14px'
                  }}>
                    {zoneObj.wards.map((ward) => (
                      <div
                        key={ward.code}
                        style={{
                          background: '#F8FAFC',
                          borderRadius: '10px',
                          padding: '16px',
                          border: '1px solid #E2E8F0'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#065F46', color: '#FFFFFF', fontFamily: 'var(--font-mono)' }}>
                            {ward.code}
                          </span>
                          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 700 }}>
                            {ward.readiness} Readiness
                          </span>
                        </div>

                        <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                          {ward.name}
                        </strong>

                        <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px', lineHeight: 1.5 }}>
                          <div>Ward Officer: <strong style={{ color: '#0F172A' }}>{ward.officer}</strong></div>
                          <div>Designation: {ward.officerRole}</div>
                        </div>

                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '6px',
                          borderTop: '1px solid #E2E8F0',
                          paddingTop: '10px',
                          fontSize: '11px',
                          textAlign: 'center'
                        }}>
                          <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <span style={{ color: '#64748B', display: 'block' }}>Population</span>
                            <strong style={{ color: '#0F172A' }}>{ward.population}</strong>
                          </div>
                          <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <span style={{ color: '#64748B', display: 'block' }}>Staff On Duty</span>
                            <strong style={{ color: '#0F172A' }}>{ward.staffOnDuty}</strong>
                          </div>
                          <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                            <span style={{ color: '#64748B', display: 'block' }}>Active Works</span>
                            <strong style={{ color: '#059669' }}>{ward.activeWorks}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 5: EXECUTIVE DIRECTIVES & CIRCULARS
            =================================================================== */}
        {activeTab === 'directives' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: '#0F172A', margin: '0 0 4px 0' }}>
                  Executive Directives & Policy Mandates
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
                  High-level municipal decrees issued by the Municipal Commissioner to department heads.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddDirectiveModal(true)}
                className="btn-primary"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: '#065F46',
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ width: '15px', height: '15px' }} />
                <span>Issue Executive Directive</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {directives.map((dir) => (
                <div
                  key={dir.id}
                  className="card"
                  style={{
                    padding: '20px 24px',
                    borderLeft: `5px solid ${dir.priority === 'CRITICAL' ? '#DC2626' : '#059669'}`
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', background: '#F1F5F9', color: '#334155', fontFamily: 'var(--font-mono)' }}>
                          {dir.id}
                        </span>
                        <span style={{ fontSize: '11.5px', color: '#64748B' }}>Issued: {dir.date}</span>
                        <span style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: dir.priority === 'CRITICAL' ? '#FEE2E2' : '#E0E7FF',
                          color: dir.priority === 'CRITICAL' ? '#991B1B' : '#3730A3'
                        }}>
                          {dir.priority} PRIORITY
                        </span>
                      </div>
                      <h3 style={{ fontSize: '16px', color: '#0F172A', margin: '8px 0 4px 0' }}>
                        {dir.title}
                      </h3>
                    </div>

                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 10px',
                      borderRadius: '999px',
                      background: '#ECFDF5',
                      color: '#065F46'
                    }}>
                      ● {dir.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    {dir.summary}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F5F9', paddingTop: '10px', fontSize: '12px', color: '#64748B' }}>
                    <span>Target Departments: <strong>{dir.targetDepts.join(', ')}</strong></span>
                    <span>Signatory: <strong>{dir.issuer}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            TAB 6: CRYPTOGRAPHIC AUDIT TRAIL
            =================================================================== */}
        {activeTab === 'audit' && (
          <div className="card" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#0F172A', margin: '0 0 4px 0' }}>
                  Pune Municipal Tamper-Proof Audit Trail
                </h3>
                <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                  Cryptographically verified SHA-256 ledger under Digital Personal Data Protection (DPDP) Act 2023.
                </p>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#059669', background: '#ECFDF5', padding: '4px 10px', borderRadius: '999px' }}>
                ✓ Hash Chain Intact (0 Tampering Detected)
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', border: '1px solid #CBD5E1', fontFamily: 'var(--font-mono)' }}>
                      {log.id}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '13px', color: '#0F172A' }}>{log.action}</strong>
                        <span style={{ fontSize: '11.5px', color: '#065F46', fontWeight: 600 }}>By {log.actor}</span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#475569', margin: '2px 0 0 0' }}>
                        {log.details}
                      </p>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'var(--font-mono)' }}>
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAL: DEPLOY NEW OFFICER
            =================================================================== */}
        {showAddOfficerModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', color: '#0F172A', margin: 0 }}>Deploy Municipal Officer</h3>
                <button
                  type="button"
                  onClick={() => setShowAddOfficerModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              <form onSubmit={handleAddOfficer} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Officer Full Name (with Title)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Er. Mahesh Kulkarni"
                    value={newOfficerName}
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Department
                    </label>
                    <select
                      value={newOfficerDept}
                      onChange={(e) => setNewOfficerDept(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '13px' }}
                    >
                      {departments.map(d => <option key={d.code} value={d.code}>{d.code}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Designation
                    </label>
                    <select
                      value={newOfficerDesignation}
                      onChange={(e) => setNewOfficerDesignation(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '13px' }}
                    >
                      <option value="Executive Engineer">Executive Engineer</option>
                      <option value="Junior Engineer">Junior Engineer</option>
                      <option value="Executive Ward Officer">Executive Ward Officer</option>
                      <option value="Chief Sanitary Inspector">Chief Sanitary Inspector</option>
                      <option value="Field Squad Lead">Field Squad Lead</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Assigned Ward Jurisdiction
                  </label>
                  <input
                    type="text"
                    value={newOfficerWard}
                    onChange={(e) => setNewOfficerWard(e.target.value)}
                    placeholder="e.g. Aundh - Baner (Ward 24)"
                    style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Official Email
                    </label>
                    <input
                      type="email"
                      placeholder="officer@pmc.gov.in"
                      value={newOfficerEmail}
                      onChange={(e) => setNewOfficerEmail(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Official Phone
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98220 00000"
                      value={newOfficerPhone}
                      onChange={(e) => setNewOfficerPhone(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddOfficerModal(false)}
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', background: '#065F46', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Confirm Deployment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAL: ISSUE DIRECTIVE
            =================================================================== */}
        {showAddDirectiveModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', color: '#0F172A', margin: 0 }}>Issue Executive Directive</h3>
                <button
                  type="button"
                  onClick={() => setShowAddDirectiveModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              <form onSubmit={handleAddDirective} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Directive Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Strict 24hr Pothole Hotmix Resolution Order"
                    value={newDirectiveTitle}
                    onChange={(e) => setNewDirectiveTitle(e.target.value)}
                    style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Target Vertical
                    </label>
                    <select
                      value={newDirectiveTarget}
                      onChange={(e) => setNewDirectiveTarget(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '13px' }}
                    >
                      <option value="ALL_DEPTS">All Pune Departments</option>
                      {departments.map(d => <option key={d.code} value={d.code}>{d.code}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Priority Level
                    </label>
                    <select
                      value={newDirectivePriority}
                      onChange={(e) => setNewDirectivePriority(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 8px', fontSize: '13px' }}
                    >
                      <option value="CRITICAL">CRITICAL (Immediate Mandate)</option>
                      <option value="HIGH">HIGH (Within 48h)</option>
                      <option value="STANDARD">STANDARD (Policy Circular)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Mandate Details & Enforcement Guidelines
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Specific instructions to Executive Engineers, penalty for non-compliance, and inspection frequency..."
                    value={newDirectiveSummary}
                    onChange={(e) => setNewDirectiveSummary(e.target.value)}
                    style={{ width: '100%', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '8px 10px', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddDirectiveModal(false)}
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', background: '#065F46', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Broadcast Directive
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ===================================================================
            MODAL: REGISTER DEPARTMENT
            =================================================================== */}
        {showAddDeptModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              padding: '24px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', color: '#0F172A', margin: 0 }}>Register Municipal Department</h3>
                <button
                  type="button"
                  onClick={() => setShowAddDeptModal(false)}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748B' }}
                >
                  <X style={{ width: '18px', height: '18px' }} />
                </button>
              </div>

              <form onSubmit={handleAddDept} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Code
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PMC FIRE"
                      value={newDeptCode}
                      onChange={(e) => setNewDeptCode(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Department Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Fire & Emergency Disaster Response"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Head of Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chief Fire Officer Devendra Potphode"
                      value={newDeptHead}
                      onChange={(e) => setNewDeptHead(e.target.value)}
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Budget Allocation
                    </label>
                    <input
                      type="text"
                      value={newDeptBudget}
                      onChange={(e) => setNewDeptBudget(e.target.value)}
                      placeholder="e.g. ₹85 Cr"
                      style={{ width: '100%', height: '38px', borderRadius: '6px', border: '1px solid #CBD5E1', padding: '0 10px', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddDeptModal(false)}
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#475569', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 1, height: '40px', borderRadius: '8px', border: 'none', background: '#065F46', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Register Department
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
