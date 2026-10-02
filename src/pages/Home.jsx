import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Users, 
  FileText, 
  Layers, 
  ArrowUpRight,
  HelpCircle,
  AlertTriangle,
  Search,
  Check,
  Wrench,
  Camera,
  Activity,
  ChevronRight,
  Filter,
  Eye,
  Sliders,
  History,
  XCircle,
  Zap,
  Compass,
  Radio,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation
} from 'lucide-react';
import { INITIAL_GRIEVANCES, SYSTEM_METRICS } from '../data/mockGrievances';
import citizenBg from '../assets/citizen-bg.jpg';
import WhyExplainer from '../components/common/WhyExplainer';
import FileGrievanceModal from '../components/common/FileGrievanceModal';
import LeafletSpreadMap from '../components/common/LeafletSpreadMap';
import { useApp } from '../context/AppContext';

const FOUR_STEPS = [
  {
    step: '01',
    title: 'Tell Us',
    desc: 'Describe your problem in your own words. Speak via audio, type in mixed Hindi/English, attach photos, or drop a pin.',
    tag: 'Citizen Voice',
    icon: Radio,
    accentColor: '#EA580C',
    bg: 'linear-gradient(155deg, #FFFFFF 0%, #FFF7ED 100%)',
    border: '1.5px solid #FED7AA',
    tagBg: '#FFEDD5',
    tagColor: '#C2410C',
    shadow: '0 10px 25px -5px rgba(234, 88, 12, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)',
    hoverShadow: '0 18px 35px -5px rgba(234, 88, 12, 0.18)'
  },
  {
    step: '02',
    title: 'We Understand',
    desc: 'The platform infers category, ward location, duration, and severity without forcing you to understand complex government departments.',
    tag: 'AI Understanding',
    icon: Sparkles,
    accentColor: '#2563EB',
    bg: 'linear-gradient(155deg, #FFFFFF 0%, #EFF6FF 100%)',
    border: '1.5px solid #BFDBFE',
    tagBg: '#DBEAFE',
    tagColor: '#1D4ED8',
    shadow: '0 10px 25px -5px rgba(37, 99, 235, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)',
    hoverShadow: '0 18px 35px -5px rgba(37, 99, 235, 0.18)'
  },
  {
    step: '03',
    title: 'We Find Connections',
    desc: 'Correlates individual reports with nearby complaints, spatial clusters, and municipal historical cases to spot systemic breakdowns.',
    tag: 'Pattern Linking',
    icon: Layers,
    accentColor: '#7C3AED',
    bg: 'linear-gradient(155deg, #FFFFFF 0%, #F5F3FF 100%)',
    border: '1.5px solid #DDD6FE',
    tagBg: '#EDE9FE',
    tagColor: '#6D28D9',
    shadow: '0 10px 25px -5px rgba(124, 58, 237, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)',
    hoverShadow: '0 18px 35px -5px rgba(124, 58, 237, 0.18)'
  },
  {
    step: '04',
    title: 'Action Becomes Clearer',
    desc: 'Field officers receive structured case briefs with SOP checklists. Upon completion, citizens verify whether the problem is actually solved.',
    tag: 'Field Action',
    icon: CheckCircle2,
    accentColor: '#059669',
    bg: 'linear-gradient(155deg, #FFFFFF 0%, #ECFDF5 100%)',
    border: '1.5px solid #A7F3D0',
    tagBg: '#D1FAE5',
    tagColor: '#047857',
    shadow: '0 10px 25px -5px rgba(5, 150, 105, 0.08), 0 2px 6px rgba(0, 0, 0, 0.02)',
    hoverShadow: '0 18px 35px -5px rgba(5, 150, 105, 0.18)'
  }
];

export default function Home() {
  const { user } = useApp();
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [mapCategory, setMapCategory] = useState('ALL');
  const [activeWardIndex, setActiveWardIndex] = useState(0);
  const [systemicScenarioIndex, setSystemicScenarioIndex] = useState(0);
  const [systemicViewMode, setSystemicViewMode] = useState('compare'); // 'compare' (default) | 'steps'
  const [activeStoryStep, setActiveStoryStep] = useState(1);
  const [mapBasemap, setMapBasemap] = useState('satellite'); // 'dark' | 'satellite'
  const [mapRegion, setMapRegion] = useState('wagholi');
  const [mapZoom, setMapZoom] = useState(1);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [simulatedSignals, setSimulatedSignals] = useState({});
  const [recentSignalFlash, setRecentSignalFlash] = useState(null);

  // Interactive Systemic Problem Scenarios (Section 06 - One Complaint vs Big Picture)
  const systemicScenarios = [
    {
      id: 'water',
      title: 'Dirty Tap Water',
      icon: '🚰',
      dept: 'PMC Water Supply Department',
      location: 'Ivy Estate / Kesnand Road (Wagholi Ward 29)',
      steps: [
        {
          stepNumber: 1,
          badge: 'First Citizen Report',
          badgeColor: '#10B981',
          title: '1 Home Reports Bad Water',
          icon: '🏠',
          simpleText: 'A resident turns on the kitchen tap and finds low-pressure, foul water. They submit a quick 15-second voice note on JanSahayak.',
          detailStat: '1 House Affected',
          detailNote: 'Reported at 07:30 AM',
          whatOldWayDid: 'Old portals treat this as an isolated tap issue and send 1 plumber.'
        },
        {
          stepNumber: 2,
          badge: 'AI Connects The Dots',
          badgeColor: '#F59E0B',
          title: 'JanSahayak Spots 18 Nearby Reports',
          icon: '🏘️',
          simpleText: 'Within 4 hours, 18 neighboring apartments report the exact same water pressure loss along Kesnand Road. JanSahayak links them together immediately.',
          detailStat: '18 Connected Societies',
          detailNote: 'Across a 400m feeder radius',
          whatOldWayDid: 'Old portals would book 18 separate appointments across 2 weeks.'
        },
        {
          stepNumber: 3,
          badge: 'Root Cause Solved Forever',
          badgeColor: '#6366F1',
          title: 'Fix The Cracked Main HDPE Pipe',
          icon: '🛠️',
          simpleText: 'Instead of visiting 18 individual home taps, PMC dispatches 1 repair truck with electrofusion welding directly to the cracked underground feeder.',
          detailStat: '1,100 Families Protected',
          detailNote: 'Clean water restored in 4 hours',
          whatOldWayDid: 'Permanent fix executed with zero repeat complaints.'
        }
      ],
      oldWay: {
        title: 'Old Government Way',
        icon: '❌',
        subtitle: 'Treating individual taps, ignoring the broken pipe',
        bulletPoints: [
          '18 separate complaints filed over several days',
          'Multiple plumbers sent to check individual household taps',
          'Underground broken main feeder is completely missed',
          'Dirty water returns every single morning'
        ],
        consequence: 'Weeks wasted, city tax money burnt, and citizens rely on private tankers.'
      },
      newWay: {
        title: 'The JanSahayak Way',
        icon: '✅',
        subtitle: 'Fixing the underground pipe break once for everyone',
        bulletPoints: [
          'AI groups 18 complaints automatically in under 4 hours',
          'Identifies the underground 200mm HDPE line as single source',
          '1 repair team sent with electrofusion equipment',
          'Water safety tested and verified for the whole neighborhood'
        ],
        consequence: 'Fixed in 1 trip for all 1,100 families. 70% cheaper and permanent.'
      },
      metrics: [
        { label: 'Time to Fix', old: '14 Days', smart: '4 Hours', highlight: '95% Faster' },
        { label: 'Plumber Trips', old: '18 Visits', smart: '1 Targeted Fix', highlight: 'Saves Fuel & Manpower' },
        { label: 'Families Helped', old: '1 Tap at a time', smart: '1,100 Households', highlight: 'Whole Ward Safe' }
      ]
    },
    {
      id: 'roads',
      title: 'Road Potholes',
      icon: '🛣️',
      dept: 'PWD Pune / PMRDA',
      location: 'Pune-Nagar Highway (Raisoni Chowk)',
      steps: [
        {
          stepNumber: 1,
          badge: 'First Citizen Report',
          badgeColor: '#10B981',
          title: '1 Scooter Slips on a Pothole',
          icon: '🛵',
          simpleText: 'A commuter almost crashes on a deep road crater near Raisoni College and uploads a quick photo.',
          detailStat: '1 Deep Crater',
          detailNote: 'Reported after heavy rain',
          whatOldWayDid: 'Road workers throw a bucket of loose gravel in the hole.'
        },
        {
          stepNumber: 2,
          badge: 'AI Connects The Dots',
          badgeColor: '#F59E0B',
          title: '8 Potholes Form on Same 400m Stretch',
          icon: '⚠️',
          simpleText: 'JanSahayak detects that 8 different potholes appeared along the same highway section. The cause: a blocked roadside storm drain is softening the asphalt subgrade.',
          detailStat: '8 Sinking Spots',
          detailNote: 'Water pooling beneath asphalt',
          whatOldWayDid: 'Old portals patch each hole separately, only for all 8 to reopen next week.'
        },
        {
          stepNumber: 3,
          badge: 'Root Cause Solved Forever',
          badgeColor: '#6366F1',
          title: 'Unblock Drain & Resurface Road Base',
          icon: '🚜',
          simpleText: 'PWD cleans out the storm channel first so water stops weakening the base, then lays down heavy-duty bitumen.',
          detailStat: '500m Highway Section',
          detailNote: 'Smooth for years with zero sinking',
          whatOldWayDid: 'Thousands of daily riders travel safely with zero accidents.'
        }
      ],
      oldWay: {
        title: 'Old Government Way',
        icon: '❌',
        subtitle: 'Endless cycle of temporary gravel patching',
        bulletPoints: [
          'Dump gravel into 1 hole at a time',
          'Next rain washes loose gravel away in 2 days',
          'Potholes reappear deeper and wider',
          'Vehicles keep getting damaged and slipping'
        ],
        consequence: 'Constant road accidents and money wasted on endless gravel refills.'
      },
      newWay: {
        title: 'The JanSahayak Way',
        icon: '✅',
        subtitle: 'Fixing the underlying drainage failure first',
        bulletPoints: [
          'JanSahayak detects underground drainage overflow causing asphalt collapse',
          'Drainage clearance crew cleans blocked storm channel',
          'Heavy roller machine levels and seals 500m of road base',
          'Road stays solid throughout the entire season'
        ],
        consequence: 'Completely stops repetitive pothole formation and keeps highway traffic safe.'
      },
      metrics: [
        { label: 'Repair Longevity', old: '5 Days', smart: '3+ Years', highlight: 'Stays Smooth' },
        { label: 'Accident Risk', old: 'High (Recurring)', smart: 'Zero (Eliminated)', highlight: 'Safe Commutes' },
        { label: 'Public Budget', old: 'Continuous Waste', smart: '65% Cost Savings', highlight: 'Saves Tax Money' }
      ]
    },
    {
      id: 'lights',
      title: 'Dark Streetlights & Grid',
      icon: '💡',
      dept: 'MSEDCL Wagholi Sub-Division',
      location: 'Baif Road Market Yard',
      steps: [
        {
          stepNumber: 1,
          badge: 'First Citizen Report',
          badgeColor: '#10B981',
          title: '1 Dark Lamp Post Outside a Shop',
          icon: '🔦',
          simpleText: 'A shopkeeper notices the pole light is dead and sparking and files a report.',
          detailStat: '1 Dark Pole',
          detailNote: 'Reported at 08:15 PM',
          whatOldWayDid: 'Electrician scheduled to check bulb #1 next week.'
        },
        {
          stepNumber: 2,
          badge: 'AI Connects The Dots',
          badgeColor: '#F59E0B',
          title: '14 Streetlights Out on Same Market Loop',
          icon: '🔌',
          simpleText: 'JanSahayak spots 14 reports in 90 minutes. It maps the power line and finds all 14 dark poles are linked to Transformer TR-WAG-04.',
          detailStat: '14 Dark Poles',
          detailNote: 'Shared electrical distribution transformer',
          whatOldWayDid: 'Old portals send a technician to inspect 14 poles one by one over 3 nights.'
        },
        {
          stepNumber: 3,
          badge: 'Root Cause Solved Forever',
          badgeColor: '#6366F1',
          title: 'Replace Master Switch in Transformer Box #4',
          icon: '⚡',
          simpleText: 'The lineman goes straight to Transformer Box #4 to replace the damaged phase bushing.',
          detailStat: 'Full Market Lit',
          detailNote: 'Restored in 35 minutes',
          whatOldWayDid: 'All 14 lights turn on at once and the market is brightly lit.'
        }
      ],
      oldWay: {
        title: 'Old Government Way',
        icon: '❌',
        subtitle: 'Checking light bulbs one by one with ladders',
        bulletPoints: [
          'Technician climbs pole #1 with ladder to test bulb',
          'Market stays pitch dark for 3 consecutive nights',
          'High fear of theft and safety hazards',
          'Root cause (tripped transformer breaker) remains undiscovered'
        ],
        consequence: 'Days of scary dark streets while checking bulbs that aren’t even broken.'
      },
      newWay: {
        title: 'The JanSahayak Way',
        icon: '✅',
        subtitle: 'Replacing the central master fuse in 35 minutes',
        bulletPoints: [
          'AI correlates 14 reports to Transformer Box #4 instantly',
          'Lineman dispatched with right heavy-duty breaker switch',
          'Master switch swapped in 35 minutes',
          'Entire shopping alley lights up simultaneously'
        ],
        consequence: 'Safe, well-lit streets restored on the same evening in under 1 hour.'
      },
      metrics: [
        { label: 'Outage Time', old: '3 Nights Dark', smart: '35 Minutes', highlight: 'Fast Restoration' },
        { label: 'Poles Checked', old: '14 Individual Poles', smart: '1 Central Transformer Box', highlight: 'Direct Diagnosis' },
        { label: 'Safety Impact', old: 'Unsafe Walkways', smart: '100% Bright & Safe', highlight: 'Protected Market' }
      ]
    }
  ];

  // Map Wards Data (Section 07 - Geospatial Intelligence)
  const mapWards = [
    {
      id: 'ward29',
      ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
      shortName: 'Ivy Estate / Kesnand Rd',
      zone: 'Wagholi Sub-Division, Pune',
      category: 'Water Supply',
      icon: '💧',
      dept: 'PMC Water Supply Department',
      severity: 'CRITICAL',
      color: '#EF4444',
      reports: 24 + (simulatedSignals['ward29'] || 0),
      hotspotName: 'Main Potable Feeder Fracture',
      actionRequired: 'Fit 200mm electrofusion sleeve clamp & pressure test',
      trend: '+6 reports today',
      status: 'EMERGING_HOTSPOT',
      posX: 29, // % from left
      posY: 24, // % from top
      dispatchedUnit: 'PMC Water Emergency Squad #2',
      eta: '20 Mins',
      peopleImpacted: '~1,100 Families',
      radiusMeters: '450m Radius'
    },
    {
      id: 'ward27',
      ward: 'Wagholi Ward 27 (Nagar Road Highway & Raisoni Chowk)',
      shortName: 'Nagar Road / Raisoni Chowk',
      zone: 'Wagholi Sub-Division, Pune',
      category: 'Roads',
      icon: '🛣️',
      dept: 'PWD Pune / PMRDA',
      severity: 'HIGH',
      color: '#F59E0B',
      reports: 15 + (simulatedSignals['ward27'] || 0),
      hotspotName: 'Highway Cavity & Storm Grate Collapse',
      actionRequired: 'Bituminous cold-mix compaction & culvert clearance',
      trend: 'Heavy traffic stress',
      status: 'UNDER_INSPECTION',
      posX: 61,
      posY: 63,
      dispatchedUnit: 'PWD Pune Highway Squad #1',
      eta: '15 Mins',
      peopleImpacted: '~4,500 Commuters',
      radiusMeters: '350m Radius'
    },
    {
      id: 'ward28',
      ward: 'Wagholi Ward 28 (Baif Road Market Yard)',
      shortName: 'Baif Road Market',
      zone: 'Wagholi Sub-Division, Pune',
      category: 'Sanitation',
      icon: '🗑️',
      dept: 'PMC Solid Waste Management',
      severity: 'HIGH',
      color: '#10B981',
      reports: 18 + (simulatedSignals['ward28'] || 0),
      hotspotName: 'Market Waste Overflow & Drain Spill',
      actionRequired: 'Deploy dual 12MT hydraulic dumpers + lime-wash',
      trend: '-4 reports (Improving)',
      status: 'RESOLVING',
      posX: 76,
      posY: 47,
      dispatchedUnit: 'PMC SWM Compactor Fleet #4',
      eta: 'En Route',
      peopleImpacted: '~850 Residents',
      radiusMeters: '500m Radius'
    },
    {
      id: 'ward30',
      ward: 'Wagholi Ward 30 (Domkhel Road & Ubale Nagar)',
      shortName: 'Domkhel Road',
      zone: 'Wagholi Sub-Division, Pune',
      category: 'Electricity',
      icon: '⚡',
      dept: 'MSEDCL Wagholi Sub-Division',
      severity: 'MEDIUM',
      color: '#3B82F6',
      reports: 9 + (simulatedSignals['ward30'] || 0),
      hotspotName: '11kV Feeder Transformer Arcing',
      actionRequired: 'Replace burnt HT bushing at transformer yard',
      trend: '+2 reports today',
      status: 'EMERGING_HOTSPOT',
      posX: 66,
      posY: 75,
      dispatchedUnit: 'MSEDCL Lineman Patrol #2',
      eta: '25 Mins',
      peopleImpacted: '~140 Retail Shops',
      radiusMeters: '250m Radius'
    }
  ];

  const filteredMapWards = mapWards.filter((w) => {
    if (mapCategory === 'ALL') return true;
    if (mapCategory === 'WATER') return w.category === 'Water Supply';
    if (mapCategory === 'ROADS') return w.category === 'Roads';
    if (mapCategory === 'SANITATION') return w.category === 'Sanitation';
    if (mapCategory === 'ELECTRICITY') return w.category === 'Electricity';
    return true;
  });

  const activeWard = mapWards[activeWardIndex] || mapWards[0];

  const handleSimulateSignal = (wardId) => {
    setSimulatedSignals(prev => ({
      ...prev,
      [wardId]: (prev[wardId] || 0) + 1
    }));
    setRecentSignalFlash(wardId);
    setTimeout(() => {
      setRecentSignalFlash(null);
    }, 2800);
  };

  return (
    <div>
      {/* ==========================================================================
          02. HERO SECTION
          ========================================================================== */}
      <section 
        className="section-spacing" 
        style={{ 
          position: 'relative', 
          paddingTop: '40px', 
          paddingBottom: '56px',
          overflow: 'hidden'
        }}
      >
        {/* Low-opacity civic montage backdrop */}
        <div 
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${citizenBg})`,
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            opacity: 0.13,
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'contrast(105%) saturate(108%)'
          }}
        />
        <div 
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, rgba(248, 250, 252, 0.75) 100%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            maxWidth: '960px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Hero Narrative */}
            <div className="hero-left-col" style={{ width: '100%' }}>
              {/* Category Overline: Professional Public Civic Intelligence */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '22px', flexWrap: 'wrap' }}>
                <img 
                  src="/logo.png" 
                  alt="JanSahayak Official Logo" 
                  style={{ 
                    height: '52px', 
                    width: 'auto', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 12px rgba(14, 94, 58, 0.22))' 
                  }} 
                />
                <span className="category-pill" style={{ background: '#E8F7F0', color: '#0E5E3A', borderColor: 'rgba(14, 94, 58, 0.2)' }}>
                  <ShieldCheck style={{ width: '13px', height: '13px' }} />
                  <span>PUBLIC GRIEVANCE INTELLIGENCE</span>
                </span>
              </div>

              {/* Core Hero Headline - Big, Bold, Hinglish Default */}
              <h1 
                className="hero-headline" 
                style={{ 
                  fontSize: 'clamp(46px, 6vw, 76px)', 
                  lineHeight: 1.12,
                  letterSpacing: '-0.03em',
                  maxWidth: '960px',
                  margin: '0 auto 22px auto'
                }}
              >
                Aapki Awaaz, Ab <span className="headline-accent">Samjhi</span> Jayegi.
              </h1>

              {/* Supporting Copy */}
              <p style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                maxWidth: '680px',
                margin: '0 auto 32px auto'
              }}>
                A public grievance intelligence platform that turns everyday citizen voices across multiple languages into structured insights, connected evidence, and actionable resolution recommendations.
              </p>

              {/* Subtle Trust Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '28px', flexWrap: 'wrap', paddingTop: '18px', borderTop: '1px solid var(--color-divider)' }}>
                <div>
                  <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)', display: 'block' }}>3.2 Days</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Avg. Resolution SLA</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--color-divider)' }} />
                <div>
                  <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)', display: 'block' }}>94.8%</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>First-Time Routing Accuracy</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--color-divider)' }} />
                <div>
                  <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)', display: 'block' }}>Multiple Languages</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Multilingual Voice Intake</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          04. HOW JAN_SAHAYAK WORKS (FROM CITIZEN VOICE TO ACTION)
          ========================================================================== */}
      <section id="how-it-works" className="section-spacing" style={{ background: '#FFFFFF', borderTop: '1px solid var(--color-divider)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container">
          <div className="section-header center">
            <span className="category-pill" style={{ marginBottom: '12px' }}>
              THE RESOLUTION PIPELINE
            </span>
            <h2>From Citizen Voice to Action</h2>
            <p>
              Four clear steps that eliminate bureaucratic dead-ends and empower citizens at home.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {FOUR_STEPS.map((s) => {
              const StepIcon = s.icon;
              return (
                <div
                  key={s.step}
                  style={{
                    padding: '28px',
                    borderRadius: '20px',
                    background: s.bg,
                    border: s.border,
                    boxShadow: s.shadow,
                    transition: 'all 240ms cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = s.hoverShadow;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = s.shadow;
                  }}
                >
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '16px'
                    }}>
                      <span style={{
                        fontSize: '34px',
                        fontWeight: 800,
                        fontFamily: 'var(--font-mono)',
                        color: s.accentColor,
                        lineHeight: 1,
                        letterSpacing: '-0.02em'
                      }}>
                        {s.step}
                      </span>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '5px 11px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700,
                        background: s.tagBg,
                        color: s.tagColor,
                        letterSpacing: '0.01em'
                      }}>
                        <StepIcon style={{ width: '12px', height: '12px' }} />
                        <span>{s.tag}</span>
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      margin: 0,
                      color: '#0F172A',
                      letterSpacing: '-0.01em'
                    }}>
                      {s.title}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          07. CIVIC INTELLIGENCE MAP PREVIEW (Interactive Wagholi Pune GIS Radar)
          ========================================================================== */}
      <section className="section-spacing" style={{ background: '#F8F9FA' }}>
        <div className="container">
          {/* Header - Centered Layout */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 36px auto' }}>
            <span className="category-pill" style={{ background: '#E8F7F0', color: '#0E5E3A', borderColor: 'rgba(14, 94, 58, 0.2)', marginBottom: '12px', display: 'inline-flex' }}>
              🛰️ GEOSPATIAL CLUSTER RADAR
            </span>
            <h2 style={{ marginTop: '4px', fontSize: '36px', letterSpacing: '-0.02em', color: '#0F172A', marginBottom: '10px', lineHeight: 1.2 }}>
              Where Are Problems Happening Across Wagholi, Pune?
            </h2>
            <p style={{ color: '#64748B', fontSize: '16px', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto 22px auto' }}>
              Click any hotspot on the live satellite radar to see real-time cluster density, root cause diagnosis, and dispatched municipal response teams.
            </p>

            {/* Category Filter Pills - Centered */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              {[
                { key: 'ALL', label: 'All Hotspots', icon: '📍' },
                { key: 'WATER', label: 'Water Supply', icon: '💧' },
                { key: 'ROADS', label: 'Roads & Works', icon: '🛣️' },
                { key: 'SANITATION', label: 'Sanitation', icon: '🗑️' },
                { key: 'ELECTRICITY', label: 'Power Grid', icon: '⚡' }
              ].map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setMapCategory(cat.key)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: mapCategory === cat.key ? 700 : 500,
                    cursor: 'pointer',
                    border: mapCategory === cat.key ? '1.5px solid #0E5E3A' : '1px solid #E2E8F0',
                    background: mapCategory === cat.key ? '#0E5E3A' : '#FFFFFF',
                    color: mapCategory === cat.key ? '#FFFFFF' : '#475569',
                    boxShadow: mapCategory === cat.key ? '0 3px 10px rgba(14, 94, 58, 0.22)' : '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'all 150ms ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map Visual Container */}
          <div className="map-radar-grid">
            {/* Left Column: Interactive Wagholi Pune GIS Radar Canvas */}
            <div
              style={{
                position: 'relative',
                borderRadius: '24px',
                overflow: 'hidden',
                background: '#0B1520',
                border: '1.5px solid #1E293B',
                boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.15)',
                minHeight: '520px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* REAL INTERACTIVE LEAFLET MAP BASEMAP */}
              <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <LeafletSpreadMap
                  defaultTile={mapBasemap === 'satellite' ? 'satellite' : 'dark'}
                  region={mapRegion}
                  height="100%"
                />
              </div>

              {/* Geographic Mesh & Cybernetic Radar Overlay */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: mapBasemap === 'satellite'
                    ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.1) 0%, rgba(10,25,35,0.7) 100%)'
                    : 'radial-gradient(ellipse at center, rgba(11,21,32,0.15) 0%, rgba(11,21,32,0.65) 100%)',
                  pointerEvents: 'none'
                }} 
              />

              {/* Map Controls Header (Basemap Mode + Zoom Controls) */}
              <div style={{
                position: 'relative',
                zIndex: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: 'linear-gradient(180deg, rgba(11, 21, 32, 0.85) 0%, rgba(11, 21, 32, 0) 100%)'
              }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 12px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#F8FAFC',
                  fontSize: '11.5px',
                  fontWeight: 600
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block', boxShadow: '0 0 8px #10B981' }} />
                  <span>📍 Wagholi, Pune Grid (PMC Wards 27-31) • Live GIS Feed</span>
                </div>

                {/* Region Selector & Basemap Switcher & Zoom Tools */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* Region Switcher */}
                  <div style={{
                    display: 'flex',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    padding: '3px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <button
                      type="button"
                      onClick={() => setMapRegion('wagholi')}
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '4px 10px',
                        borderRadius: '7px',
                        background: '#0284C7',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      🚩 Wagholi, Pune (PMC)
                    </button>
                  </div>

                  <div style={{
                    display: 'flex',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    padding: '3px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <button
                      type="button"
                      onClick={() => setMapBasemap('dark')}
                      style={{
                        fontSize: '11px',
                        fontWeight: mapBasemap === 'dark' ? 700 : 500,
                        padding: '4px 10px',
                        borderRadius: '7px',
                        background: mapBasemap === 'dark' ? '#10B981' : 'transparent',
                        color: mapBasemap === 'dark' ? '#0B1914' : '#CBD5E1',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      🗺️ Dark Radar
                    </button>
                    <button
                      type="button"
                      onClick={() => setMapBasemap('satellite')}
                      style={{
                        fontSize: '11px',
                        fontWeight: mapBasemap === 'satellite' ? 700 : 500,
                        padding: '4px 10px',
                        borderRadius: '7px',
                        background: mapBasemap === 'satellite' ? '#10B981' : 'transparent',
                        color: mapBasemap === 'satellite' ? '#0B1914' : '#CBD5E1',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      🛰️ Satellite
                    </button>
                  </div>

                  {/* Zoom In/Out */}
                  <div style={{
                    display: 'flex',
                    gap: '2px',
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(8px)',
                    padding: '3px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}>
                    <button
                      type="button"
                      title="Zoom In"
                      onClick={() => setMapZoom(prev => Math.min(1.5, prev + 0.15))}
                      style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '4px 7px', cursor: 'pointer', borderRadius: '6px' }}
                    >
                      <ZoomIn style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      type="button"
                      title="Zoom Out"
                      onClick={() => setMapZoom(prev => Math.max(1, prev - 0.15))}
                      style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '4px 7px', cursor: 'pointer', borderRadius: '6px' }}
                    >
                      <ZoomOut style={{ width: '14px', height: '14px' }} />
                    </button>
                    <button
                      type="button"
                      title="Reset View"
                      onClick={() => setMapZoom(1)}
                      style={{ background: 'none', border: 'none', color: '#FFFFFF', padding: '4px 7px', cursor: 'pointer', borderRadius: '6px' }}
                    >
                      <RotateCcw style={{ width: '13px', height: '13px' }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Hotspot Radar Pins Overlay */}
              <div style={{
                position: 'relative',
                flex: 1,
                zIndex: 2,
                transform: `scale(${mapZoom})`,
                transformOrigin: 'center center',
                transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {filteredMapWards.map((w, idx) => {
                  const isSelected = activeWardIndex === idx;
                  const isHovered = hoveredHotspot === w.id;
                  return (
                    <div
                      key={w.id}
                      onClick={() => setActiveWardIndex(idx)}
                      onMouseEnter={() => setHoveredHotspot(w.id)}
                      onMouseLeave={() => setHoveredHotspot(null)}
                      style={{
                        position: 'absolute',
                        left: `${w.posX}%`,
                        top: `${w.posY}%`,
                        transform: 'translate(-50%, -50%)',
                        cursor: 'pointer',
                        zIndex: isSelected ? 10 : 5
                      }}
                    >
                      {/* Concentric Radar Pulsing Beacon Ring */}
                      <div 
                        className="radar-beacon"
                        style={{
                          background: `${w.color}25`,
                          border: `1.5px solid ${w.color}`
                        }}
                      />

                      {/* Hotspot Central Badge */}
                      <div 
                        style={{
                          position: 'relative',
                          zIndex: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          background: isSelected ? w.color : '#0F172A',
                          border: `2px solid ${w.color}`,
                          boxShadow: `0 4px 20px ${w.color}66, 0 0 0 ${isSelected ? '4px' : '2px'} rgba(255, 255, 255, 0.3)`,
                          color: '#FFFFFF',
                          transition: 'all 200ms cubic-bezier(0.16, 1, 0.3, 1)',
                          transform: isSelected || isHovered ? 'scale(1.12)' : 'scale(1)'
                        }}
                      >
                        <span style={{ fontSize: '14px' }}>{w.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: 800 }}>
                          {w.reports}
                        </span>
                      </div>

                      {/* Floating Tooltip on Hover / Selected */}
                      {(isHovered || isSelected) && (
                        <div style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: '50%',
                          transform: 'translateX(-50%) translateY(-10px)',
                          background: 'rgba(15, 23, 42, 0.94)',
                          backdropFilter: 'blur(12px)',
                          border: `1.5px solid ${w.color}`,
                          borderRadius: '12px',
                          padding: '10px 14px',
                          minWidth: '200px',
                          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                          pointerEvents: 'none',
                          zIndex: 20
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: w.color }}>
                              {w.severity}
                            </span>
                            <span style={{ fontSize: '10px', color: '#94A3B8' }}>{w.radiusMeters}</span>
                          </div>
                          <strong style={{ fontSize: '12.5px', color: '#FFFFFF', display: 'block', marginBottom: '2px' }}>
                            {w.shortName}
                          </strong>
                          <span style={{ fontSize: '11px', color: '#CBD5E1', display: 'block' }}>
                            {w.hotspotName}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Interactive Simulation Bar & Live Marquee */}
              <div style={{
                position: 'relative',
                zIndex: 3,
                padding: '14px 20px',
                background: 'linear-gradient(0deg, rgba(11, 21, 32, 0.95) 0%, rgba(11, 21, 32, 0.6) 100%)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                {/* Live Signal Simulation Button */}
                <button
                  type="button"
                  onClick={() => handleSimulateSignal(activeWard.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    background: '#10B981',
                    border: 'none',
                    color: '#0B1914',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Radio style={{ width: '14px', height: '14px' }} />
                  <span>Simulate Inbound Citizen Voice (+1 Report)</span>
                </button>

                {recentSignalFlash && (
                  <div style={{
                    fontSize: '12px',
                    color: '#34D399',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34D399', animation: 'radarPing 1s infinite' }} />
                    <span>Signal Triaged via Gemini Voice in {activeWard.shortName}! (+1 Count Updated)</span>
                  </div>
                )}

                <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                  Click any hotspot to inspect root-cause diagnosis.
                </div>
              </div>
            </div>

            {/* Right Column: Mission Control Ward Action Hub */}
            <div
              style={{
                padding: '28px',
                background: '#FFFFFF',
                borderRadius: '24px',
                border: '1.5px solid #E2E8F0',
                boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                {/* Top Badge & Live Status */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: activeWard.color }} />
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: activeWard.color }}>
                      {activeWard.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '999px',
                    background: activeWard.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                    color: activeWard.severity === 'CRITICAL' ? '#991B1B' : '#92400E'
                  }}>
                    {activeWard.severity}
                  </span>
                </div>

                {/* Ward Title & Sector */}
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                  {activeWard.ward}
                </h3>
                <span style={{ fontSize: '13px', color: '#64748B', display: 'block', marginBottom: '18px' }}>
                  {activeWard.zone} • {activeWard.radiusMeters} Cluster
                </span>

                {/* Root Cause Problem Card */}
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ fontSize: '16px' }}>{activeWard.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#0E5E3A' }}>
                      {activeWard.dept}
                    </span>
                  </div>
                  <strong style={{ fontSize: '14px', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                    {activeWard.hotspotName}
                  </strong>
                  <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                    <span style={{ color: '#0E5E3A', fontWeight: 700 }}>Intervention: </span>
                    <span>{activeWard.actionRequired}</span>
                  </div>
                </div>

                {/* Live Field Squad Dispatch Tracker */}
                <div style={{
                  padding: '16px',
                  borderRadius: '16px',
                  background: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  marginBottom: '20px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#065F46' }}>
                      Field Crew Deployment
                    </span>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#065F46', background: '#D1FAE5', padding: '2px 8px', borderRadius: '999px' }}>
                      ETA: {activeWard.eta}
                    </span>
                  </div>
                  <strong style={{ fontSize: '13px', color: '#065F46', display: 'block', marginBottom: '4px' }}>
                    {activeWard.dispatchedUnit}
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#047857' }}>
                    <span>Impact Protected:</span>
                    <strong>{activeWard.peopleImpacted}</strong>
                  </div>
                </div>

                {/* Live Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '24px' }}>
                  <div style={{ padding: '12px', borderRadius: '12px', background: '#F1F5F9', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginBottom: '2px' }}>Total Reports</span>
                    <strong style={{ fontSize: '18px', color: '#0F172A', fontWeight: 800 }}>{activeWard.reports}</strong>
                  </div>
                  <div style={{ padding: '12px', borderRadius: '12px', background: '#F1F5F9', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                    <span style={{ fontSize: '10.5px', color: '#64748B', display: 'block', marginBottom: '2px' }}>Resolution Target</span>
                    <strong style={{ fontSize: '13px', color: '#0E5E3A', fontWeight: 800, display: 'block', marginTop: '4px' }}>Within 12h</strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  to={`/officer/complaints/PN-2026-WAG-0102`}
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 18px', borderRadius: '12px' }}
                >
                  <span>Inspect Dispatched Work Order</span>
                  <ArrowRight style={{ width: '14px', height: '14px' }} />
                </Link>

                <Link
                  to="/admin"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#0E5E3A',
                    textDecoration: 'none'
                  }}
                >
                  <span>Open Full Municipal GIS Explorer</span>
                  <ArrowUpRight style={{ width: '13px', height: '13px' }} />
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Ward Navigation Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginTop: '20px'
          }}>
            {filteredMapWards.map((w, idx) => {
              const isSelected = activeWardIndex === idx;
              return (
                <div
                  key={w.id}
                  onClick={() => setActiveWardIndex(idx)}
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    background: isSelected ? '#FFFFFF' : '#FFFFFF',
                    border: isSelected ? `2px solid ${w.color}` : '1px solid #E2E8F0',
                    boxShadow: isSelected ? `0 8px 24px ${w.color}22` : '0 2px 6px rgba(15, 23, 42, 0.04)',
                    transition: 'all 150ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{w.icon}</span>
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0F172A', display: 'block' }}>{w.shortName}</strong>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>{w.category} • {w.trend}</span>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '4px 8px',
                    borderRadius: '999px',
                    background: isSelected ? w.color : '#F1F5F9',
                    color: isSelected ? '#FFFFFF' : '#0F172A'
                  }}>
                    {w.reports}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          06. ONE COMPLAINT → BIGGER PROBLEM (Interactive Storytelling Section)
          ========================================================================== */}
      <section style={{ padding: '0 clamp(14px, 2.5vw, 32px)', margin: '16px 0 36px 0' }}>
        <div
          style={{
            background: 'var(--color-surface-inset-dark)',
            color: 'var(--color-text-inverse)',
            borderRadius: '28px',
            border: '1px solid var(--color-border-dark)',
            boxShadow: '0 20px 50px -12px rgba(11, 25, 20, 0.45)',
            overflow: 'hidden'
          }}
          className="section-spacing"
        >
          <div className="container">
          {/* Header in Simple, Plain English */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px auto' }}>
            <span className="category-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: '14px' }}>
              💡 HOW JANSAHAYAK SOLVES REAL PROBLEMS
            </span>
            <h2 style={{ fontSize: '38px', color: '#FFFFFF', marginBottom: '14px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Don't Just Patch Complaints.<br />Fix the Real Root Cause.
            </h2>

          </div>

          {/* Interactive Problem Chooser (Real-Life Scenarios) */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '32px'
          }}>
            {systemicScenarios.map((sc, idx) => {
              const isActive = systemicScenarioIndex === idx;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => {
                    setSystemicScenarioIndex(idx);
                    setActiveStoryStep(1);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: '999px',
                    fontSize: '13px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 200ms ease',
                    border: isActive ? '1.5px solid #10B981' : '1px solid rgba(255, 255, 255, 0.12)',
                    background: isActive ? '#10B981' : 'rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#FFFFFF' : '#E2E8F0',
                    boxShadow: isActive ? '0 4px 18px rgba(16, 185, 129, 0.35)' : 'none'
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{sc.icon}</span>
                  <span>{sc.title}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Toggle: 3-Step Story Flow vs Side-by-Side Comparison */}
          {(() => {
            const currentScenario = systemicScenarios[systemicScenarioIndex];
            return (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '24px',
                  padding: '12px 18px',
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94A3B8' }}>
                    <span style={{ color: '#10B981', fontWeight: 700 }}>Active Case:</span>
                    <strong style={{ color: '#FFFFFF' }}>{currentScenario.title}</strong>
                    <span>•</span>
                    <span>{currentScenario.location}</span>
                    <span>({currentScenario.dept})</span>
                  </div>

                  <div style={{ display: 'flex', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setSystemicViewMode('steps')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: systemicViewMode === 'steps' ? 700 : 500,
                        border: 'none',
                        cursor: 'pointer',
                        background: systemicViewMode === 'steps' ? '#10B981' : 'transparent',
                        color: systemicViewMode === 'steps' ? '#FFFFFF' : '#94A3B8',
                        transition: 'all 150ms ease'
                      }}
                    >
                      📖 3-Step Story
                    </button>
                    <button
                      type="button"
                      onClick={() => setSystemicViewMode('compare')}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: systemicViewMode === 'compare' ? 700 : 500,
                        border: 'none',
                        cursor: 'pointer',
                        background: systemicViewMode === 'compare' ? '#10B981' : 'transparent',
                        color: systemicViewMode === 'compare' ? '#FFFFFF' : '#94A3B8',
                        transition: 'all 150ms ease'
                      }}
                    >
                      ⚡ Old Way vs Smart Way
                    </button>
                  </div>
                </div>

                {/* VIEW 1: 3-STEP INTERACTIVE STORY */}
                {systemicViewMode === 'steps' && (
                  <div>
                    {/* 3 Step Progression Cards */}
                    <div className="systemic-cards-grid" style={{ marginBottom: '24px' }}>
                      {currentScenario.steps.map((step, sIdx) => {
                        const isStepActive = activeStoryStep === sIdx;
                        return (
                          <div
                            key={step.stepNumber}
                            onClick={() => setActiveStoryStep(sIdx)}
                            style={{
                              cursor: 'pointer',
                              padding: '24px 20px',
                              borderRadius: '20px',
                              position: 'relative',
                              transition: 'all 200ms ease',
                              background: isStepActive 
                                ? 'linear-gradient(180deg, #16382D 0%, #0D241C 100%)' 
                                : 'var(--color-surface-inset-card)',
                              border: isStepActive 
                                ? '2px solid #10B981' 
                                : '1px solid var(--color-border-dark)',
                              boxShadow: isStepActive 
                                ? '0 12px 30px rgba(16, 185, 129, 0.2), 0 0 0 1px rgba(16, 185, 129, 0.4)' 
                                : 'none',
                              transform: isStepActive ? 'translateY(-4px)' : 'none'
                            }}
                          >
                            {/* Step Number Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                              <span style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '13px',
                                fontWeight: 800,
                                background: isStepActive ? '#10B981' : 'rgba(255, 255, 255, 0.1)',
                                color: isStepActive ? '#0B1914' : '#FFFFFF'
                              }}>
                                {step.stepNumber}
                              </span>

                              <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                                padding: '3px 10px',
                                borderRadius: '999px',
                                background: isStepActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                                color: isStepActive ? '#34D399' : '#94A3B8'
                              }}>
                                {step.badge}
                              </span>
                            </div>

                            {/* Step Visual & Title */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                              <span style={{ fontSize: '26px' }}>{step.icon}</span>
                              <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: 0 }}>
                                {step.title}
                              </h4>
                            </div>

                            {/* Simple English Explanation */}
                            <p style={{ fontSize: '13px', color: isStepActive ? '#E2E8F0' : '#94A3B8', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                              {step.simpleText}
                            </p>

                            {/* Stat Pill */}
                            <div style={{
                              padding: '8px 12px',
                              borderRadius: '10px',
                              background: isStepActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                              border: isStepActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.05)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              fontSize: '11.5px'
                            }}>
                              <strong style={{ color: isStepActive ? '#34D399' : '#FFFFFF' }}>{step.detailStat}</strong>
                              <span style={{ color: '#94A3B8' }}>{step.detailNote}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Active Step Deep-Dive Box with Comparison Note & Next Step Button */}
                    {(() => {
                      const curStep = currentScenario.steps[activeStoryStep];
                      return (
                        <div style={{
                          padding: '24px',
                          borderRadius: '20px',
                          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(19, 42, 34, 0.9) 100%)',
                          border: '1.5px solid rgba(16, 185, 129, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '20px'
                        }}>
                          <div style={{ flex: '1 1 500px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <span style={{ fontSize: '12px', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                What Happens at Step {curStep.stepNumber}:
                              </span>
                              <span style={{ fontSize: '12px', color: '#94A3B8' }}>•</span>
                              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>{curStep.title}</span>
                            </div>

                            <p style={{ fontSize: '14px', color: '#F1F5F9', lineHeight: 1.6, margin: '0 0 12px 0' }}>
                              {curStep.simpleText}
                            </p>

                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              background: 'rgba(0, 0, 0, 0.3)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              fontSize: '12px',
                              color: '#CBD5E1'
                            }}>
                              <span style={{ color: activeStoryStep === 2 ? '#10B981' : '#F59E0B' }}>
                                {activeStoryStep === 2 ? '🎯 Long-term Outcome:' : '⚠️ Legacy Portal Mistake:'}
                              </span>
                              <span>{curStep.whatOldWayDid}</span>
                            </div>
                          </div>

                          {/* Interactive Step Navigation Controls */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                              type="button"
                              disabled={activeStoryStep === 0}
                              onClick={() => setActiveStoryStep(prev => Math.max(0, prev - 1))}
                              style={{
                                padding: '10px 16px',
                                borderRadius: '12px',
                                fontSize: '12.5px',
                                fontWeight: 600,
                                cursor: activeStoryStep === 0 ? 'not-allowed' : 'pointer',
                                background: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                color: activeStoryStep === 0 ? '#64748B' : '#FFFFFF',
                                transition: 'all 150ms ease'
                              }}
                            >
                              ← Previous
                            </button>

                            <button
                              type="button"
                              onClick={() => setActiveStoryStep(prev => (prev + 1) % 3)}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '10px 20px',
                                borderRadius: '12px',
                                fontSize: '12.5px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: '#10B981',
                                border: 'none',
                                color: '#0B1914',
                                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
                                transition: 'all 150ms ease'
                              }}
                            >
                              <span>{activeStoryStep === 2 ? 'Start Over ↺' : 'Next Step →'}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* VIEW 2: SIDE-BY-SIDE COMPARISON (Old Way ❌ vs JanSahayak Way ✅) */}
                {systemicViewMode === 'compare' && (
                  <div className="systemic-compare-grid" style={{ marginBottom: '24px' }}>
                    {/* Old Government Way */}
                    <div style={{
                      padding: '28px',
                      borderRadius: '22px',
                      background: 'linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, rgba(30, 20, 20, 0.7) 100%)',
                      border: '1.5px solid rgba(239, 68, 68, 0.35)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px' }}>❌</span>
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#FCA5A5', margin: 0 }}>
                            {currentScenario.oldWay.title}
                          </h4>
                          <span style={{ fontSize: '12px', color: '#F87171' }}>
                            {currentScenario.oldWay.subtitle}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentScenario.oldWay.bulletPoints.map((pt, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#E2E8F0' }}>
                            <span style={{ color: '#EF4444', fontWeight: 800, fontSize: '14px', lineHeight: 1.3 }}>✕</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        marginTop: '24px',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'rgba(239, 68, 68, 0.12)',
                        border: '1px solid rgba(239, 68, 68, 0.25)',
                        fontSize: '12.5px',
                        color: '#FECACA'
                      }}>
                        <strong>Final Consequence: </strong>
                        <span>{currentScenario.oldWay.consequence}</span>
                      </div>
                    </div>

                    {/* The JanSahayak Way */}
                    <div style={{
                      padding: '28px',
                      borderRadius: '22px',
                      background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.12) 0%, rgba(13, 36, 28, 0.9) 100%)',
                      border: '1.5px solid #10B981',
                      boxShadow: '0 15px 35px rgba(16, 185, 129, 0.15)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '24px' }}>✅</span>
                        <div>
                          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#34D399', margin: 0 }}>
                            {currentScenario.newWay.title}
                          </h4>
                          <span style={{ fontSize: '12px', color: '#10B981' }}>
                            {currentScenario.newWay.subtitle}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {currentScenario.newWay.bulletPoints.map((pt, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '13.5px', color: '#FFFFFF' }}>
                            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '14px', lineHeight: 1.3 }}>✓</span>
                            <span>{pt}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{
                        marginTop: '24px',
                        padding: '14px',
                        borderRadius: '12px',
                        background: 'rgba(16, 185, 129, 0.18)',
                        border: '1px solid rgba(16, 185, 129, 0.35)',
                        fontSize: '12.5px',
                        color: '#D1FAE5'
                      }}>
                        <strong>Smart Outcome: </strong>
                        <span>{currentScenario.newWay.consequence}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Real-World Impact Scoreboard */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '14px',
                  marginTop: '28px'
                }}>
                  {currentScenario.metrics.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block', marginBottom: '6px' }}>
                        {m.label}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', textDecoration: 'line-through', color: '#94A3B8' }}>{m.old}</span>
                        <span style={{ fontSize: '12px', color: '#10B981' }}>➔</span>
                        <strong style={{ fontSize: '20px', color: '#34D399', fontWeight: 800 }}>{m.smart}</strong>
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#10B981', background: 'rgba(16, 185, 129, 0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                        {m.highlight}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </section>

      {/* ==========================================================================
          11. IMPACT / PROOF (Transparent Benchmark Metrics)
          ========================================================================== */}
      <section className="section-spacing" style={{ background: '#FFFFFF', borderTop: '1px solid var(--color-divider)' }}>
        <div className="container">
          <div className="section-header center">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="category-pill">VALIDATED IMPACT</span>
              <span className="pilot-tag">Pilot Demonstration Dataset</span>
            </div>
            <h2>Measurable Impact on Governance</h2>
            <p>
              Simulated performance benchmarks comparing legacy grievance processes with JanSahayak's closed-loop intelligence.
            </p>
          </div>

          {/* 4 Metric Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '24px',
            marginBottom: '48px'
          }}>
            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Avg. Resolution Window
              </span>
              <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', margin: '6px 0' }}>
                3.2 Days
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Down from <strong>18.4 Days</strong> baseline on legacy citizen portals.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Duplicate Work Reduction
              </span>
              <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-accent)', margin: '6px 0' }}>
                64.2%
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Eliminates repetitive ticket logging for the same municipal breakdown.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Routing Precision
              </span>
              <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', margin: '6px 0' }}>
                94.8%
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Direct departmental assignment without manual desk-to-desk transfers.
              </p>
            </div>

            <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                Citizen Confirmation Rate
              </span>
              <div style={{ fontSize: '42px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', margin: '6px 0' }}>
                91.6%
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Residents verified closure without requiring dispute reopening.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          12. FINAL CONVERSION CTA
          ========================================================================== */}
      <section className="section-spacing" style={{ paddingTop: '20px' }}>
        <div className="container">
          <div
            style={{
              background: 'var(--color-surface-inset-dark)',
              borderRadius: 'var(--radius-2xl)',
              padding: '64px 36px',
              textAlign: 'center',
              color: '#FFFFFF',
              border: '1px solid var(--color-border-dark)'
            }}
          >
            <span className="category-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: '16px' }}>
              PUBLIC SERVICE ACCESS
            </span>
            <h2 style={{ fontSize: '36px', color: '#FFFFFF', marginBottom: '14px' }}>
              Have a Public Grievance to Report?
            </h2>
            <p style={{ color: 'var(--color-text-inverse-muted)', fontSize: '16px', maxWidth: '540px', margin: '0 auto 32px auto', lineHeight: 1.6 }}>
              Speak or write in your local language. JanSahayak will structure it, connect it to ward evidence, and keep you informed until resolution is verified.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={() => setShowGrievanceModal(true)} 
                className="btn-primary" 
                style={{ background: 'var(--color-accent)', color: '#0B1914', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                <span>Report a Problem Now</span>
                <ArrowRight className="btn-arrow" style={{ width: '16px', height: '16px' }} />
              </button>

              <Link to="/officer" className="btn-secondary" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.18)' }}>
                <span>Explore Officer Workspace</span>
                <ArrowUpRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Instant 4-Step Popup Intake Modal */}
      <FileGrievanceModal 
        isOpen={showGrievanceModal} 
        onClose={() => setShowGrievanceModal(false)} 
      />
    </div>
  );
}
