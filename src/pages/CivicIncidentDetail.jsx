import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Droplet, 
  Droplets,
  Users, 
  Store, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  Wrench, 
  Building2, 
  MapPin, 
  Activity, 
  Truck, 
  Camera, 
  Search, 
  Check, 
  X,
  Layers,
  FileCheck2,
  Info,
  Flame,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CIVIC_INCIDENTS } from '../data/civicIntelligenceData';
import LeafletSpreadMap, { WAGHOLI_SPREAD_POINTS } from '../components/common/LeafletSpreadMap';
import StartSolvingModal from '../components/officer/StartSolvingModal';

/**
 * CATEGORY THEME ENGINE
 * Differentiates complaints dynamically based on type/category.
 * Provides distinct primary colors, tints, borders, gradients, and icons.
 */
export function getIncidentTheme(inc = {}) {
  const text = `${inc.category || ''} ${inc.incidentType || ''} ${inc.complaintDna?.issueType || ''} ${inc.complaintDna?.service || ''} ${inc.title || ''} ${inc.id || ''}`.toLowerCase();

  // Electricity / Power Grid / Streetlights
  if (text.includes('power') || text.includes('electr') || text.includes('transform') || text.includes('voltage') || text.includes('arc') || text.includes('spark') || text.includes('light') || text.includes('msedcl')) {
    return {
      key: 'POWER',
      primary: '#D97706',
      secondary: '#B45309',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      tint: '#FFFBEB',
      border: '#FDE68A',
      shadow: 'rgba(217, 119, 6, 0.25)',
      badge: { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' },
      icon: Zap,
      iconColor: '#D97706',
      label: 'Electricity & Power Grid',
      accentRing: 'rgba(217, 119, 6, 0.15)'
    };
  }

  // Sanitation / Solid Waste / Garbage
  if (text.includes('waste') || text.includes('sanitat') || text.includes('garbage') || text.includes('dump') || text.includes('swm') || text.includes('leachate') || text.includes('trash')) {
    return {
      key: 'SANITATION',
      primary: '#059669',
      secondary: '#047857',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      tint: '#ECFDF5',
      border: '#A7F3D0',
      shadow: 'rgba(5, 150, 105, 0.25)',
      badge: { bg: '#DCFCE7', text: '#15803D', border: '#BBF7D0' },
      icon: Sparkles,
      iconColor: '#059669',
      label: 'Sanitation & Solid Waste',
      accentRing: 'rgba(5, 150, 105, 0.15)'
    };
  }

  // Roads / Infrastructure / Cavity / PWD
  if (text.includes('pothole') || text.includes('asphalt') || text.includes('road') || text.includes('cavity') || text.includes('pavement') || text.includes('pwd') || text.includes('pmrda')) {
    return {
      key: 'ROADS',
      primary: '#EA580C',
      secondary: '#C2410C',
      gradient: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
      tint: '#FFF7ED',
      border: '#FED7AA',
      shadow: 'rgba(234, 88, 12, 0.25)',
      badge: { bg: '#FFEDD5', text: '#9A3412', border: '#FED7AA' },
      icon: Wrench,
      iconColor: '#EA580C',
      label: 'Roads & Public Infrastructure',
      accentRing: 'rgba(234, 88, 12, 0.15)'
    };
  }

  // Drainage & Flooding
  if (text.includes('drain') || text.includes('flood') || text.includes('sewer') || text.includes('culvert') || text.includes('stormwater')) {
    return {
      key: 'DRAINAGE',
      primary: '#4F46E5',
      secondary: '#4338CA',
      gradient: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
      tint: '#EEF2FF',
      border: '#C7D2FE',
      shadow: 'rgba(79, 70, 229, 0.25)',
      badge: { bg: '#E0E7FF', text: '#3730A3', border: '#C7D2FE' },
      icon: Activity,
      iconColor: '#4F46E5',
      label: 'Drainage & Stormwater',
      accentRing: 'rgba(79, 70, 229, 0.15)'
    };
  }

  // Water Infrastructure (Default / Water)
  if (text.includes('water') || text.includes('pipeline') || text.includes('potable') || text.includes('tap') || text.includes('leak') || text.includes('djb') || text.includes('pmc water')) {
    return {
      key: 'WATER',
      primary: '#0284C7',
      secondary: '#0369A1',
      gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
      tint: '#F0F9FF',
      border: '#BAE6FD',
      shadow: 'rgba(2, 132, 199, 0.25)',
      badge: { bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE' },
      icon: Droplets,
      iconColor: '#0284C7',
      label: 'Water Infrastructure & Supply',
      accentRing: 'rgba(2, 132, 199, 0.15)'
    };
  }

  // General Municipal / Civic
  return {
    key: 'CIVIC',
    primary: '#0D9488',
    secondary: '#0F766E',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)',
    tint: '#F0FDFA',
    border: '#99F6E4',
    shadow: 'rgba(13, 148, 136, 0.25)',
    badge: { bg: '#CCFBF1', text: '#115E59', border: '#99F6E4' },
    icon: Building2,
    iconColor: '#0D9488',
    label: 'Municipal Infrastructure',
    accentRing: 'rgba(13, 148, 136, 0.15)'
  };
}

/**
 * DYNAMIC DATA RESOLVER
 * Ensures no hardcoded Wagholi strings leak into Delhi or other complaints.
 */
function resolveIncidentData(rawIncident, requestedId) {
  const inc = rawIncident || {};
  const isDelhi = requestedId?.includes('DEL') || inc.id?.includes('DEL') || inc.affectedArea?.toLowerCase().includes('rohini') || inc.affectedArea?.toLowerCase().includes('delhi');
  const isWagholi = inc.id?.includes('WAG') || inc.affectedArea?.toLowerCase().includes('wagholi');

  // Base IDs and Titles
  const id = requestedId || inc.id || 'INC-2026-DEL-43';
  const title = inc.title || (isDelhi ? 'Rohini Sector 14 Subsurface Water Line Fracture & Cavity Formation' : 'Potable Water Pipeline Joint Rupture & Cross-Subsoil Infiltration');
  const affectedArea = inc.affectedArea || (isDelhi ? 'Ward 14 (Rohini Sector 14 - Pocket 1 & 2 Corridor)' : 'Wagholi Ward 29 → Ward 28 (Ivy Estate Corridor)');
  const affectedPopulation = inc.affectedPopulation || (isDelhi ? '~2,400 Citizens (550 Households)' : '~4,500 Citizens (1,100 Households)');

  // Commercial Impact
  let commercialImpact = inc.commercialImpact;
  if (!commercialImpact) {
    if (inc.complaintDna?.affectedPopulation) {
      const match = inc.complaintDna.affectedPopulation.find(p => /shop|market|commercial/i.test(p));
      if (match) commercialImpact = match;
    }
  }
  if (!commercialImpact) {
    commercialImpact = isDelhi ? '24 Shops (Sector 14 Market)' : (isWagholi ? '48 Shops (Wagholi Market)' : '32 Commercial Shops');
  }

  // School / Institutional Impact
  let schoolImpact = inc.schoolImpact;
  if (!schoolImpact) {
    if (inc.complaintDna?.affectedPopulation) {
      const match = inc.complaintDna.affectedPopulation.find(p => /school|student|college/i.test(p));
      if (match) schoolImpact = match;
    }
  }
  if (!schoolImpact) {
    schoolImpact = isDelhi ? 'DAV Public School (~420 Students)' : (isWagholi ? 'Lexicon Kids School (~350 Students)' : 'Local Primary School (~300 Students)');
  }

  // Symptoms
  let symptoms = inc.complaintDna?.symptoms;
  if (!symptoms || symptoms.length === 0) {
    if (isDelhi) {
      symptoms = [
        'Severe water discoloration (brownish tap discharge)',
        'Foul odor during low-pressure evening hours',
        '35cm structural road depression outside Mother Dairy',
        'Loss of drinking water pressure across Pocket 1 & 2'
      ];
    } else {
      symptoms = [
        'Intermittent pressure deficit during morning pumping hours',
        'Sewage backflow odor in drinking taps',
        'Road sub-base waterlogging and asphalt depression',
        'Foul yellowish water discharge in feeder line'
      ];
    }
  }

  // Landmarks
  let landmarks = inc.complaintDna?.entities;
  if (!landmarks || landmarks.length === 0) {
    if (isDelhi) {
      landmarks = [
        'Mother Dairy Booth #14',
        'Pocket 1 Market Chowk',
        'Sector 14 Arterial Ring Road',
        'DAV Public School Rohini'
      ];
    } else {
      landmarks = [
        'Ivy Estate Main Commercial Gate',
        'Kesnand Road Feeder Valve #4',
        'Wagholi-Kesnand Arterial Road',
        'Lexicon Kids School'
      ];
    }
  }

  // Lead Dept & Asset
  const leadDept = inc.departments?.find(d => d.lead)?.name || inc.leadDepartment || inc.complaintDna?.department || (isDelhi ? 'Delhi Jal Board (DJB)' : 'PMC Water Supply Department');
  const affectedAsset = inc.complaintDna?.asset || inc.inferredAsset || (isDelhi ? '1988 Cast-Iron Feeder Main (Sector 14 Alignment)' : '200mm HDPE Feeder Main (Line-WAG-29)');
  const envContext = inc.complaintDna?.environmentalContext || (isDelhi ? 'Subsoil saturation from pipe breach accelerating pavement cavitation.' : 'Saturated subsoil accelerating joint cavity expansion.');

  // Hypotheses
  let rootCauseHypotheses = inc.rootCauseHypotheses;
  if (!rootCauseHypotheses || rootCauseHypotheses.length === 0) {
    if (inc.rootCause?.probableRootCause) {
      rootCauseHypotheses = [
        {
          id: `RCH-${id.split('-').pop()}-01`,
          title: inc.rootCause.probableRootCause,
          confidence: 'HIGH',
          confidenceScore: Math.round((inc.rootCause.confidence || 0.91) * 100),
          evidence: inc.rootCause.supportingEvidence || inc.evidence || ['Ground telemetry confirms utility alignment stress'],
          recommendedVerification: 'Deploy acoustic leak correlator & ultrasonic pipe sensor'
        },
        {
          id: `RCH-${id.split('-').pop()}-02`,
          title: inc.rootCause.contributingFactors?.[0] || 'Sub-Base Soil Compaction Loss',
          confidence: 'MEDIUM',
          confidenceScore: 74,
          evidence: inc.rootCause.contributingFactors || ['Heavy traffic vibrational shear'],
          recommendedVerification: 'Inspect storm culvert wall using crawler camera'
        }
      ];
    } else if (isDelhi) {
      rootCauseHypotheses = [
        {
          id: 'RCH-DEL-01',
          title: 'Negative-Pressure Siphonage in 1988 Cast-Iron Feeder Line',
          confidence: 'HIGH',
          confidenceScore: 91,
          evidence: [
            '26 correlated citizen signals & complaints clustered along Sector 14 utility alignment',
            'DJB asset register confirms 1988 installation vintage exceeding 30-year design life',
            'Water quality testing showed chlorine residual dropped to 0.02 ppm',
            'Acoustic leak signature confirmed near Mother Dairy valve pit #12'
          ],
          recommendedVerification: 'Deploy acoustic leak correlator & ultrasonic pipe sensor at Sector 14 Gate #2'
        },
        {
          id: 'RCH-DEL-02',
          title: 'Sub-Base Soil Compaction Loss from Storm Drain Backwash',
          confidence: 'MEDIUM',
          confidenceScore: 74,
          evidence: [
            'MCD storm culvert inspection reported cracked masonry and silt backing',
            'Road depression aligns directly with adjacent stormwater culvert line'
          ],
          recommendedVerification: 'Inspect stormwater culvert wall using CCTV crawler camera'
        }
      ];
    } else {
      rootCauseHypotheses = [
        {
          id: 'RCH-WAG-01',
          title: 'Flange Joint Separation in 200mm HDPE Main Feeder Line',
          confidence: 'HIGH',
          confidenceScore: 91,
          evidence: [
            '37 correlated citizen signals & complaints clustered along the same 450m utility corridor',
            'PMC GIS asset register marks line installation vintage under heavy traffic stress',
            'SCADA telemetry confirms local line pressure drop from 3.4 bar to 0.9 bar'
          ],
          recommendedVerification: 'Deploy acoustic leak correlator near Ivy Estate Gate #1'
        },
        {
          id: 'RCH-WAG-02',
          title: 'Cross-Siphoning from Damaged Stormwater Masonry Drain',
          confidence: 'MEDIUM',
          confidenceScore: 72,
          evidence: [
            '5 citizen complaints report foul drainage odor during non-supply low-pressure hours',
            'Inspection note indicates cracked masonry wall in storm drain'
          ],
          recommendedVerification: 'Conduct non-toxic fluorometric dye test'
        }
      ];
    }
  }

  // Cross-Department List
  let departments = inc.departments;
  if (!departments || departments.length === 0) {
    if (inc.crossDepartmentImpact?.departments) {
      departments = inc.crossDepartmentImpact.departments.map(d => ({
        name: d.dept,
        cases: d.cases,
        role: d.impactSummary,
        lead: d.dept.includes('Water') || d.dept.includes('DJB') || d.dept.includes('MSEDCL') || d.dept.includes('SWM')
      }));
    } else if (isDelhi) {
      departments = [
        { name: 'Delhi Jal Board (DJB)', lead: true, cases: 14, role: 'Main potable water carrier isolation & cast-iron replacement' },
        { name: 'Public Works Department (PWD Delhi)', lead: false, cases: 8, role: 'Road pavement stabilizing & 35cm depression re-bedding' },
        { name: 'Municipal Corporation of Delhi (MCD)', lead: false, cases: 4, role: 'Adjacent storm culvert de-silting & sanitization' }
      ];
    } else {
      departments = [
        { name: 'PMC Water Supply Department', lead: true, cases: 24, role: 'Main potable carrier isolation, trench excavation & HDPE pipe coupling' },
        { name: 'PWD Pune / PMRDA', lead: false, cases: 9, role: 'Road pavement stabilizing & subsoil drainage rehabilitation' },
        { name: 'PMC Solid Waste Management', lead: false, cases: 4, role: 'Adjacent storm drain blockage clearing & sanitization' }
      ];
    }
  }

  // Timeline
  let timeline = inc.timeline;
  if (!timeline || timeline.length === 0) {
    if (isDelhi) {
      timeline = [
        { time: '28 Sep, 09:15 AM', label: 'First signal (Mother Dairy)', color: '#2563EB' },
        { time: '29 Sep, 10:30 AM', label: 'Signal cluster (Pocket 1)', color: '#8B5CF6' },
        { time: '30 Sep, 11:45 AM', label: 'Formal complaints wave', color: '#8B5CF6' },
        { time: '01 Oct, 08:15 AM', label: 'Geographic spread (35cm dip)', color: '#F59E0B' },
        { time: '01 Oct, 12:00 PM', label: 'Cross-dept linkage (PWD/MCD)', color: '#F59E0B' },
        { time: '01 Oct, 02:30 PM', label: 'Escalation to GROWING', color: '#EF4444' }
      ];
    } else {
      timeline = [
        { time: '28 Sep, 08:15 AM', label: 'First signal detected', color: '#2563EB' },
        { time: '29 Sep, 09:30 AM', label: 'Signal cluster formation', color: '#8B5CF6' },
        { time: '30 Sep, 11:00 AM', label: 'Formal complaint wave', color: '#8B5CF6' },
        { time: '01 Oct, 08:00 AM', label: 'Geographic spread', color: '#F59E0B' },
        { time: '01 Oct, 11:30 AM', label: 'Cross-dept linkage', color: '#F59E0B' },
        { time: '01 Oct, 02:00 PM', label: 'Escalation to GROWING', color: '#EF4444' }
      ];
    }
  }

  return {
    ...inc,
    id,
    title,
    affectedArea,
    affectedPopulation,
    commercialImpact,
    schoolImpact,
    symptoms,
    landmarks,
    leadDepartment: leadDept,
    affectedAsset,
    environmentalContext: envContext,
    rootCauseHypotheses,
    departments,
    timeline,
    firstDetectedAt: inc.firstDetectedAt || (isDelhi ? '2026-09-28 09:15 AM' : '2026-09-28 08:15 AM'),
    lastUpdatedAt: inc.lastUpdatedAt || '8 mins ago',
    stage: inc.stage || 'GROWING',
    severity: inc.severity || 'CRITICAL',
    stageVelocity: inc.stageVelocity || (isDelhi ? '+18.4 m/hr corridor spread' : '+240% (5 days)'),
    confidence: inc.confidence || 'High (91% correlation)'
  };
}

export default function CivicIncidentDetail() {
  const { id } = useParams();
  const { civicIncidents = [], recordIncidentDecision, user } = useApp();
  
  // Aggregate incidents from AppContext and canonical seed data
  const allIncidents = [...(civicIncidents || []), ...CIVIC_INCIDENTS];
  const matchedIncident = allIncidents.find(inc => inc.id === id || inc.id?.replace(/-/g, '') === id?.replace(/-/g, '')) || civicIncidents[0] || CIVIC_INCIDENTS[0];

  // Resolve dynamic fields and category theme
  const incident = resolveIncidentData(matchedIncident, id);
  const theme = getIncidentTheme(incident);
  const ThemeIcon = theme.icon;

  const isDelhi = incident.id?.includes('DEL') || incident.affectedArea?.toLowerCase().includes('rohini');

  // Map state
  const [selectedSpreadDay, setSelectedSpreadDay] = useState(2); // 0 = Day 1, 1 = Day 3, 2 = Day 5
  const [mapTileMode, setMapTileMode] = useState('street'); // 'street' | 'satellite'

  // Human decision state
  const [selectedDecision, setSelectedDecision] = useState('ACCEPT_RECOMMENDATION');
  const [actionChoice, setActionChoice] = useState(
    incident?.simulations?.[1]?.title || (isDelhi ? 'Option B: 24-Meter Ductile Iron Replacement & PWD Road Re-bedding' : 'Option B: Full 24-Meter Electrofusion HDPE Replacement & PWD Road Re-bedding')
  );
  const [selectedHypothesisId, setSelectedHypothesisId] = useState(null);
  const [officerNote, setOfficerNote] = useState('');
  const [decisionSuccess, setDecisionSuccess] = useState(false);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');
  const [isStartSolvingOpen, setIsStartSolvingOpen] = useState(false);

  if (!incident) {
    return (
      <div className="container section-spacing" style={{ paddingTop: '40px', minHeight: '80vh', textAlign: 'center' }}>
        <h2>Civic Incident Not Found</h2>
        <p style={{ color: '#64748B', marginTop: '8px' }}>The requested incident ID could not be located in the central register.</p>
        <Link to="/intelligence" className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
          Back to Civic Intelligence Dashboard
        </Link>
      </div>
    );
  }

  const handleDecisionSubmit = (e) => {
    e.preventDefault();
    recordIncidentDecision(incident.id, {
      decision: selectedDecision,
      actionSelected: actionChoice,
      notes: officerNote || 'Authorized against ground telemetry and multi-department consensus.'
    });
    setDecisionSuccess(true);
    setTimeout(() => setDecisionSuccess(false), 4500);
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', padding: '24px 16px 60px 16px', color: '#0F172A', fontFamily: 'inherit' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* ── Breadcrumb Navigation ── */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <Link
            to="/intelligence"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#64748B',
              textDecoration: 'none',
              transition: 'color 120ms ease'
            }}
          >
            <ArrowLeft style={{ width: '15px', height: '15px' }} />
            <span>Back to Incidents</span>
          </Link>

          {/* Category Pill Tag */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '999px',
            background: theme.tint,
            border: `1px solid ${theme.border}`,
            color: theme.primary,
            fontSize: '11.5px',
            fontWeight: 700
          }}>
            <ThemeIcon style={{ width: '13px', height: '13px' }} />
            <span>{theme.label}</span>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ROW 1: HERO CARD (Left 8 cols) + 2x2 METRICS MATRIX (Right 4 cols)
           ════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Left: Main Hero Information Card */}
          <div style={{
            gridColumn: 'span 2',
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            borderTop: `4px solid ${theme.primary}`,
            padding: '22px 24px',
            boxShadow: '0 4px 20px -2px rgba(15,23,42,0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            {/* Header row with Icon, ID & Critical Badge */}
            <div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '10px' }}>
                {/* Category Squircle Gradient Badge */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '13px',
                  background: theme.gradient,
                  boxShadow: `0 4px 14px ${theme.shadow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ThemeIcon style={{ width: '25px', height: '25px', color: '#FFFFFF' }} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '11px',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        background: theme.badge.bg,
                        color: theme.badge.text,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${theme.badge.border}`
                      }}>
                        {incident.id}
                      </span>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        background: incident.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                        color: incident.severity === 'CRITICAL' ? '#DC2626' : '#D97706',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: incident.severity === 'CRITICAL' ? '1px solid #FECACA' : '1px solid #FDE68A',
                        letterSpacing: '0.02em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: incident.severity === 'CRITICAL' ? '#DC2626' : '#D97706' }} />
                        {incident.severity || 'CRITICAL'}
                      </span>
                      <span style={{
                        fontSize: '10.5px',
                        fontWeight: 700,
                        background: theme.tint,
                        color: theme.primary,
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: `1px solid ${theme.border}`
                      }}>
                        {theme.key}
                      </span>
                    </div>

                    {/* Government Officer Primary CTA: Start Solving */}
                    <button
                      type="button"
                      onClick={() => setIsStartSolvingOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 14px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        fontWeight: 800,
                        border: 'none',
                        cursor: 'pointer',
                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.28)',
                        transition: 'all 120ms ease'
                      }}
                    >
                      <span>🚀</span>
                      <span>Start Solving Incident</span>
                    </button>
                  </div>

                  <h1 style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#0F172A',
                    lineHeight: 1.3,
                    margin: '0 0 6px 0'
                  }}>
                    {incident.title}
                  </h1>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', color: '#64748B', flexWrap: 'wrap' }}>
                    <MapPin style={{ width: '13px', height: '13px', color: theme.primary }} />
                    <span style={{ fontWeight: 600, color: '#334155' }}>{incident.affectedArea}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Impact Stats Row (3 Distinct Colored Chips) */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '12px',
                paddingTop: '14px',
                marginTop: '14px',
                borderTop: '1px solid #F1F5F9'
              }}>
                {/* Chip 1: Citizens (Blue) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: '#F0F9FF',
                  border: '1px solid #BAE6FD'
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E0F2FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users style={{ width: '16px', height: '16px', color: '#0284C7' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#0369A1', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Population</span>
                    <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.affectedPopulation}</strong>
                  </div>
                </div>

                {/* Chip 2: Commercial (Purple) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: '#FAF5FF',
                  border: '1px solid #E9D5FF'
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store style={{ width: '16px', height: '16px', color: '#9333EA' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#7E22CE', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Commercial</span>
                    <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.commercialImpact}</strong>
                  </div>
                </div>

                {/* Chip 3: School/Institutional (Amber) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: '#FFFBEB',
                  border: '1px solid #FDE68A'
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <GraduationCap style={{ width: '16px', height: '16px', color: '#D97706' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#92400E', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Institutions</span>
                    <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.schoolImpact}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Timestamps */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingTop: '12px', marginTop: '12px', borderTop: '1px solid #F8FAFC', fontSize: '11.5px', color: '#64748B', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar style={{ width: '13px', height: '13px', color: '#94A3B8' }} />
                <span>First Detected: <strong>{incident.firstDetectedAt}</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock style={{ width: '13px', height: '13px', color: '#94A3B8' }} />
                <span>Last Updated: <strong>{incident.lastUpdatedAt}</strong></span>
              </div>
            </div>
          </div>

          {/* Right: 2x2 Metric Cards Grid with Distinct Colors for Each Metric */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {/* Metric 1: Status (Blue/Cyan) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #BAE6FD',
              borderTop: '3px solid #0284C7',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(2,132,199,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Target style={{ width: '18px', height: '18px', color: '#0284C7' }} />
              </div>
              <div>
                <span style={{ fontSize: '10.5px', color: '#0284C7', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Status</span>
                <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>{incident.status || 'Investigating'}</strong>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Action Planned</span>
              </div>
            </div>

            {/* Metric 2: Stage (Amber) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #FDE68A',
              borderTop: '3px solid #D97706',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(217,119,6,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <AlertTriangle style={{ width: '18px', height: '18px', color: '#D97706' }} />
              </div>
              <div>
                <span style={{ fontSize: '10.5px', color: '#D97706', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Stage</span>
                <strong style={{ fontSize: '13.5px', color: '#B45309', display: 'block' }}>{incident.stage || 'Growing'}</strong>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Stage 3 of 4</span>
              </div>
            </div>

            {/* Metric 3: Velocity (Rose/Red) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #FECDD3',
              borderTop: '3px solid #E11D48',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(225,29,72,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#FFF1F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <TrendingUp style={{ width: '18px', height: '18px', color: '#E11D48' }} />
              </div>
              <div>
                <span style={{ fontSize: '10.5px', color: '#E11D48', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Velocity</span>
                <strong style={{ fontSize: '13px', color: '#BE123C', display: 'block' }}>{incident.stageVelocity}</strong>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Corridor spread</span>
              </div>
            </div>

            {/* Metric 4: Confidence (Emerald Green) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid #A7F3D0',
              borderTop: '3px solid #059669',
              padding: '16px',
              boxShadow: '0 2px 8px rgba(5,150,105,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ShieldCheck style={{ width: '18px', height: '18px', color: '#059669' }} />
              </div>
              <div>
                <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700, textTransform: 'uppercase', display: 'block' }}>Confidence</span>
                <strong style={{ fontSize: '13.5px', color: '#047857', display: 'block' }}>{incident.confidence}</strong>
                <span style={{ fontSize: '10.5px', color: '#64748B' }}>Correlation</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Active Ground Workforce Resolution Banner (if solving in progress) ── */}
        {(incident.status === 'Action In Progress' || incident.assignedWorker) && (
          <div style={{
            marginBottom: '16px',
            padding: '16px 20px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDF4 100%)',
            border: '1.5px solid #86EFAC',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: '#10B981',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '22px'
              }}>
                ⚡
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '14.5px', color: '#065F46' }}>
                    Active Municipal Resolution in Progress
                  </strong>
                  <span style={{ fontSize: '10.5px', fontWeight: 800, background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '999px', border: '1px solid #BBF7D0' }}>
                    WORK ORDER DISPATCHED
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#166534', marginTop: '2px' }}>
                  Assigned Field Technician: <strong>{incident.assignedWorker?.name || 'Ramesh Kumar'}</strong> ({incident.assignedWorker?.category || 'Plumbing'} Specialist) • Payout: ₹{incident.assignedWorker?.fare || 450} • Corridor residents alerted in real-time.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsStartSolvingOpen(true)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: '#FFFFFF',
                  border: '1px solid #86EFAC',
                  color: '#166534',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>⚙️</span>
                <span>Update Dispatch / Add Complaints</span>
              </button>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            ROW 2: (QUICK ACTIONS + COMPLAINT DNA) VS PROBLEM LOCATION
           ════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Left Column: Quick Actions + Complaint DNA */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Quick Actions Bar */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              borderTop: `3px solid ${theme.primary}`,
              padding: '16px 20px',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap style={{ width: '16px', height: '16px', color: theme.primary }} />
                  <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Quick Actions</h3>
                </div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>1-Tap Municipal Execution</span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
                gap: '10px'
              }}>
                {/* Action 1: Start Solving (AI Dispatch & Cluster Complaints) */}
                <button
                  type="button"
                  onClick={() => setIsStartSolvingOpen(true)}
                  style={{
                    background: '#F0FDF4',
                    border: '1.5px solid #86EFAC',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 120ms ease',
                    boxShadow: '0 2px 6px rgba(22, 163, 74, 0.08)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles style={{ width: '16px', height: '16px', color: '#16A34A' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>Start Solving (AI Dispatch)</span>
                  </div>
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#16A34A' }} />
                </button>

                {/* Action 2: Mobilize Response Squad */}
                <button
                  type="button"
                  onClick={() => {
                    recordIncidentDecision(incident.id, {
                      decision: 'MOBILIZE_SQUAD',
                      actionSelected: `Immediate Rapid Response Squad Mobilization (${incident.affectedArea.split('(')[0].trim()})`,
                      notes: 'Field crew mobilized via 1-tap quick action.'
                    });
                    setActionSuccessMessage(`⚡ Rapid Response Squad mobilized & dispatched to ${incident.affectedArea.split('(')[0].trim()}!`);
                    setTimeout(() => setActionSuccessMessage(''), 4500);
                  }}
                  style={{
                    background: '#EFF6FF',
                    border: '1.5px solid #93C5FD',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck style={{ width: '16px', height: '16px', color: '#2563EB' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1D4ED8' }}>Mobilize Response Squad</span>
                  </div>
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#2563EB' }} />
                </button>

                {/* Action 3: Request Field Evidence */}
                <button
                  type="button"
                  onClick={() => {
                    recordIncidentDecision(incident.id, {
                      decision: 'REQUEST_VERIFICATION',
                      actionSelected: 'Field Diagnostic & Ground Sensor Reading Verification',
                      notes: 'Acoustic leak telemetry & ground probe requested.'
                    });
                    setActionSuccessMessage('📸 Field evidence & diagnostic telemetry request broadcast!');
                    setTimeout(() => setActionSuccessMessage(''), 4500);
                  }}
                  style={{
                    background: '#FAF5FF',
                    border: '1.5px solid #D8B4FE',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Camera style={{ width: '16px', height: '16px', color: '#9333EA' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#7E22CE' }}>Request Field Evidence</span>
                  </div>
                  <ChevronRight style={{ width: '14px', height: '14px', color: '#9333EA' }} />
                </button>
              </div>

              {actionSuccessMessage && (
                <div style={{
                  marginTop: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  color: '#065F46',
                  fontSize: '12px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                  <span>{actionSuccessMessage}</span>
                </div>
              )}
            </div>

            {/* Complaint DNA Card (Themed with Category Accent) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: `1px solid ${theme.border}`,
              borderTop: `3px solid ${theme.primary}`,
              padding: '20px 24px',
              boxShadow: '0 2px 8px rgba(15,23,42,0.04)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles style={{ width: '16px', height: '16px', color: theme.primary }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Complaint DNA</h3>
                </div>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: theme.tint,
                  color: theme.primary,
                  border: `1px solid ${theme.border}`
                }}>
                  {theme.label}
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                marginBottom: '16px'
              }}>
                {/* DNA Left Column: Key Attributes with Rounded Icons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: theme.tint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ThemeIcon style={{ width: '14px', height: '14px', color: theme.primary }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Issue Type</span>
                      <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.complaintDna?.issueType || theme.label}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#FFFBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Wrench style={{ width: '14px', height: '14px', color: '#D97706' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Sub-Issue</span>
                      <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.complaintDna?.subIssue || 'Sub-surface Asset Fracture'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Activity style={{ width: '14px', height: '14px', color: '#4F46E5' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Service Domain</span>
                      <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.complaintDna?.service || 'Municipal Utility Grid'}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Building2 style={{ width: '14px', height: '14px', color: '#059669' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Lead Department</span>
                      <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.leadDepartment}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <ShieldCheck style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                    </div>
                    <div>
                      <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', fontWeight: 600 }}>Affected Asset</span>
                      <strong style={{ fontSize: '12.5px', color: '#0F172A' }}>{incident.affectedAsset}</strong>
                    </div>
                  </div>
                </div>

                {/* DNA Right Column: Symptoms & Landmarks */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Symptoms Card List */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <AlertTriangle style={{ width: '13px', height: '13px', color: '#DC2626' }} />
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#DC2626', textTransform: 'uppercase' }}>Key Symptoms</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {incident.symptoms.map((symptom, idx) => (
                        <div key={idx} style={{
                          padding: '5px 8px',
                          borderRadius: '6px',
                          background: '#FEF2F2',
                          border: '1px solid #FECACA',
                          fontSize: '11.5px',
                          color: '#7F1D1D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
                          <span>{symptom}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Landmarks Card List */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <MapPin style={{ width: '13px', height: '13px', color: theme.primary }} />
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: theme.secondary, textTransform: 'uppercase' }}>Landmarks & Local Entities</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {incident.landmarks.map((landmark, idx) => (
                        <span key={idx} style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#334155',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <MapPin style={{ width: '10px', height: '10px', color: theme.primary }} />
                          {landmark}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Environmental Context */}
              <div style={{
                background: theme.tint,
                border: `1px solid ${theme.border}`,
                borderRadius: '8px',
                padding: '9px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11.5px',
                color: theme.secondary
              }}>
                <span>🌱</span>
                <span><strong>Environmental Context:</strong> {incident.environmentalContext}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Problem Location Map */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            borderTop: '3px solid #0284C7',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ width: '16px', height: '16px', color: '#0284C7' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Problem Location</h3>
                </div>

                {/* Basemap switcher: Street vs Satellite */}
                <div style={{ display: 'flex', background: '#F1F5F9', padding: '2px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                  <button
                    type="button"
                    onClick={() => setMapTileMode('street')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: mapTileMode === 'street' ? '#FFFFFF' : 'transparent',
                      color: mapTileMode === 'street' ? '#0F172A' : '#64748B',
                      cursor: 'pointer',
                      boxShadow: mapTileMode === 'street' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 120ms ease'
                    }}
                  >
                    Street
                  </button>
                  <button
                    type="button"
                    onClick={() => setMapTileMode('satellite')}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      background: mapTileMode === 'satellite' ? '#FFFFFF' : 'transparent',
                      color: mapTileMode === 'satellite' ? '#0F172A' : '#64748B',
                      cursor: 'pointer',
                      boxShadow: mapTileMode === 'satellite' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                      transition: 'all 120ms ease'
                    }}
                  >
                    Satellite
                  </button>
                </div>
              </div>

              {/* Real Leaflet Map Container */}
              <div style={{
                height: '270px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
                position: 'relative',
                zIndex: 1
              }}>
                <LeafletSpreadMap
                  dataPoints={incident.spreadGeo || WAGHOLI_SPREAD_POINTS}
                  selectedDay={selectedSpreadDay}
                  activeLayer="spread"
                  mapMode={mapTileMode}
                  height="270px"
                />
              </div>
            </div>

            {/* Bottom Legend with Interactive Day Selectors */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              paddingTop: '14px',
              fontSize: '11.5px',
              color: '#475569',
              flexWrap: 'wrap'
            }}>
              <button
                type="button"
                onClick={() => setSelectedSpreadDay(0)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: selectedSpreadDay === 0 ? '1.5px solid #EF4444' : '1px solid #E2E8F0',
                  background: selectedSpreadDay === 0 ? '#FEF2F2' : '#FFFFFF',
                  color: selectedSpreadDay === 0 ? '#991B1B' : '#475569',
                  fontSize: '11px',
                  fontWeight: selectedSpreadDay === 0 ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                <span>Day 1 (110m)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpreadDay(1)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: selectedSpreadDay === 1 ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                  background: selectedSpreadDay === 1 ? '#FFFBEB' : '#FFFFFF',
                  color: selectedSpreadDay === 1 ? '#92400E' : '#475569',
                  fontSize: '11px',
                  fontWeight: selectedSpreadDay === 1 ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }} />
                <span>Day 3 (340m)</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedSpreadDay(2)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: selectedSpreadDay === 2 ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                  background: selectedSpreadDay === 2 ? '#EFF6FF' : '#FFFFFF',
                  color: selectedSpreadDay === 2 ? '#1E40AF' : '#475569',
                  fontSize: '11px',
                  fontWeight: selectedSpreadDay === 2 ? 800 : 600,
                  cursor: 'pointer',
                  transition: 'all 120ms ease'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }} />
                <span>Day 5 (800m)</span>
              </button>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ROW 3: ROOT CAUSE HYPOTHESES
           ════════════════════════════════════════════════════════════════ */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          borderTop: '3px solid #E11D48',
          padding: '20px 24px',
          boxShadow: '0 2px 8px rgba(225,29,72,0.04)',
          marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target style={{ width: '16px', height: '16px', color: '#E11D48' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Root Cause Hypotheses</h3>
            </div>
            <span style={{ fontSize: '11px', color: '#64748B' }}>Evidence-Ranked Reasoning</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {incident.rootCauseHypotheses.map((hyp, index) => {
              const isSelected = selectedHypothesisId === hyp.id;
              const isHigh = hyp.confidenceScore >= 80 || hyp.confidence === 'HIGH';
              return (
                <div 
                  key={hyp.id || index}
                  onClick={() => setSelectedHypothesisId(isSelected ? null : hyp.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    background: isSelected ? (isHigh ? '#FFF1F2' : '#FFFBEB') : '#F8FAFC',
                    border: isSelected ? (isHigh ? '1.5px solid #FDA4AF' : '1.5px solid #FCD34D') : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    transition: 'all 120ms ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Circular Percentage Badge */}
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: isHigh ? '#FFE4E6' : '#FEF3C7',
                      color: isHigh ? '#E11D48' : '#D97706',
                      fontSize: '13px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {hyp.confidenceScore || (isHigh ? 91 : 72)}%
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '10.5px', fontFamily: 'monospace', fontWeight: 700, color: '#64748B' }}>{hyp.id}</span>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          background: isHigh ? '#FEF2F2' : '#FFFBEB',
                          color: isHigh ? '#DC2626' : '#D97706',
                          padding: '1px 6px',
                          borderRadius: '4px'
                        }}>
                          {hyp.confidence || (isHigh ? 'HIGH' : 'MEDIUM')}
                        </span>
                      </div>
                      <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block', lineHeight: 1.3 }}>
                        {hyp.title}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#64748B', display: 'block', marginTop: '2px' }}>
                        {hyp.evidence?.[0] || 'Corridor telemetry and ground signal clustering'}
                      </span>
                    </div>

                    <ChevronRight style={{ width: '16px', height: '16px', color: '#94A3B8', transform: isSelected ? 'rotate(90deg)' : 'none', transition: 'transform 120ms ease' }} />
                  </div>

                  {/* Expandable Evidence Details */}
                  {isSelected && (
                    <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                      <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                        Telemetry Evidence:
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11.5px', color: '#334155', lineHeight: 1.5 }}>
                        {hyp.evidence?.map((ev, evIdx) => (
                          <li key={evIdx}>{ev}</li>
                        ))}
                      </ul>
                      {hyp.recommendedVerification && (
                        <div style={{ marginTop: '8px', fontSize: '11px', color: '#0369A1', background: '#F0F9FF', padding: '6px 8px', borderRadius: '6px' }}>
                          <strong>Field Verification:</strong> {hyp.recommendedVerification}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════
            ROW 4: 3 COLUMNS (CROSS-DEPT IMPACT, TIMELINE, DECISION)
           ════════════════════════════════════════════════════════════════ */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Col 1: Cross-Department Impact */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            borderTop: '3px solid #6366F1',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(99,102,241,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Users style={{ width: '16px', height: '16px', color: '#6366F1' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Cross-Department Impact</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {incident.departments.map((dept, idx) => {
                const colors = [
                  { bg: '#EFF6FF', border: '#BFDBFE', dot: '#2563EB', text: '#1D4ED8' },
                  { bg: '#FFFBEB', border: '#FDE68A', dot: '#D97706', text: '#B45309' },
                  { bg: '#ECFDF5', border: '#A7F3D0', dot: '#059669', text: '#047857' }
                ];
                const c = colors[idx % colors.length];
                return (
                  <div key={idx} style={{ padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.dot }} />
                        <strong style={{ fontSize: '12px', color: '#0F172A' }}>{dept.name} {dept.lead && '(Lead)'}</strong>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: c.text }}>{dept.cases || (idx === 0 ? 14 : 6)} cases</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>{dept.role || 'Infrastructure maintenance & containment'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 2: Timeline */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            borderTop: '3px solid #8B5CF6',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(139,92,246,0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Clock style={{ width: '16px', height: '16px', color: '#8B5CF6' }} />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Timeline</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative' }}>
              {incident.timeline.map((step, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: step.color || (idx === incident.timeline.length - 1 ? '#EF4444' : '#2563EB'), flexShrink: 0 }} />
                    <span style={{ color: '#64748B' }}>{step.time || step.date}</span>
                  </div>
                  <strong style={{ color: (step.label || step.stage)?.includes('GROWING') ? '#DC2626' : '#0F172A', fontSize: '11px' }}>
                    {step.label || step.stage}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          {/* Col 3: Decision & Authorization */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            borderTop: '3px solid #059669',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(5,150,105,0.04)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileCheck2 style={{ width: '16px', height: '16px', color: '#059669' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Decision & Authorization</h3>
              </div>

              {/* Officer Profile snippet */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>
                  ES
                </div>
                <div>
                  <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>{user?.name || 'Er. Sanjay Sharma'}</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Executive Engineer / Sub-Division</span>
                </div>
              </div>

              {/* Authorized Selection Box */}
              <div style={{
                background: '#F0FDF4',
                border: '1.5px solid #86EFAC',
                borderRadius: '10px',
                padding: '12px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <CheckCircle2 style={{ width: '14px', height: '14px', color: '#16A34A' }} />
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>Selected Action</span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', lineHeight: 1.3 }}>
                  {actionChoice}
                </div>
              </div>

              {/* Authorize & Start Solving Button */}
              <button
                type="button"
                onClick={() => setIsStartSolvingOpen(true)}
                style={{
                  width: '100%',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)',
                  transition: 'all 120ms ease',
                  marginBottom: '10px'
                }}
              >
                <span>🚀</span>
                <span>Authorize & Start Solving</span>
              </button>
            </div>

            {/* Sub-note */}
            <div style={{ fontSize: '10.5px', color: '#94A3B8', borderTop: '1px solid #F8FAFC', paddingTop: '8px' }}>
              DEC-{incident.id.split('-').slice(1).join('-')} | Active Municipal Register
            </div>
          </div>
        </div>

        {/* ── Start Solving Guided Modal ── */}
        <StartSolvingModal
          incident={incident}
          theme={theme}
          isOpen={isStartSolvingOpen}
          onClose={() => setIsStartSolvingOpen(false)}
          initialActionChoice={actionChoice}
        />
      </div>
    </div>
  );
}
