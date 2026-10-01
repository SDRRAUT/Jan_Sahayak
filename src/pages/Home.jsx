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
  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [mapCategory, setMapCategory] = useState('ALL');
  const [activeWardIndex, setActiveWardIndex] = useState(0);
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);
  const [systemicScenarioIndex, setSystemicScenarioIndex] = useState(0);
  const [systemicViewMode, setSystemicViewMode] = useState('compare'); // 'compare' (default) | 'steps'
  const [activeStoryStep, setActiveStoryStep] = useState(1);
  const [mapBasemap, setMapBasemap] = useState('dark'); // 'dark' | 'satellite'
  const [mapZoom, setMapZoom] = useState(1);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [simulatedSignals, setSimulatedSignals] = useState({});
  const [recentSignalFlash, setRecentSignalFlash] = useState(null);

  // Civic Examples Data (Section 15)
  const civicExamples = [
    {
      domain: 'Water Supply',
      icon: '💧',
      dept: 'Delhi Jal Board (DJB)',
      citizenQuote: 'Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain please jaldi theek karwao near Mother Dairy.',
      dialect: 'Hinglish (Colloquial)',
      understands: {
        category: 'Water Contamination Hazard',
        location: 'Rohini Sector 14, Pocket 2',
        duration: '3 Days Unresolved',
        severity: 'CRITICAL (Biohazard Risk)',
        households: '~450 Families'
      },
      pattern: '17 related reports within 400m radius in 72 hours',
      action: 'Mobilize DJB Quick-Response Squad #4 with 100mm valve repair clamp & chlorine test'
    },
    {
      domain: 'Roads & Cavities',
      icon: '🛣️',
      dept: 'Public Works Department (PWD)',
      citizenQuote: 'School ke paas Lajpat Nagar wali road pe bohot bada gaddha ho gaya hai barish ke baad. 2 scooter gir chuke hain aaj subah, accident ho rahe hain bar bar!',
      dialect: 'Hinglish / Hindi',
      understands: {
        category: 'Arterial Road Cavity',
        location: 'Ring Road, Moolchand Underpass Entry',
        duration: '12 Hours (Rapid Decay)',
        severity: 'HIGH (Traffic Safety Hazard)',
        households: 'School Transit Zone'
      },
      pattern: '4 incident reports within 200m; 2 minor collisions reported',
      action: 'Immediate PWD emergency barricading + cold-mix asphalt dispatch before evening rush'
    },
    {
      domain: 'Street Lighting',
      icon: '💡',
      dept: 'BSES Rajdhani Power',
      citizenQuote: 'Do hafte se poori main market gali ki streetlights band padi hain. Raat ko bohot darkness rehti hai, ladies aur elderly ke liye safe nahi hai.',
      dialect: 'Hindi / English',
      understands: {
        category: 'Feeder Pillar Blackout',
        location: 'Kalkaji Market Block B',
        duration: '14 Days Unresolved',
        severity: 'MEDIUM (Night Pedestrian Safety)',
        households: '120 Retail Shops'
      },
      pattern: '8 complaints on the same secondary distribution circuit',
      action: 'BSES lineman dispatch to replace burnt MCB switchboard at Feeder Pillar #7'
    },
    {
      domain: 'Sanitation',
      icon: '🗑️',
      dept: 'Municipal Corporation (MCD)',
      citizenQuote: 'Sector 6 DDA Market ke saamne open kude ka dher hai, 5 din se MCD dumper nahi aaya. Kal raat kisi ne aag laga di jisse bohot toxic smoke fail raha hai.',
      dialect: 'Hinglish',
      understands: {
        category: 'Solid Waste Combustion',
        location: 'Mayur Vihar Phase 1, Sector 6',
        duration: '5 Days (Uncollected)',
        severity: 'HIGH (Air Pollution Violation)',
        households: '300 Resident Flats'
      },
      pattern: 'Cluster of 11 complaints across 3 adjacent societies',
      action: 'Deploy two 12MT MCD hydraulic dumpers + lime-wash sanitation treatment'
    }
  ];

  // Interactive Systemic Problem Scenarios (Section 06 - One Complaint vs Big Picture)
  const systemicScenarios = [
    {
      id: 'water',
      title: 'Dirty Tap Water',
      icon: '🚰',
      dept: 'Delhi Jal Board (DJB)',
      location: 'Rohini Sector 14, Pocket 2',
      steps: [
        {
          stepNumber: 1,
          badge: 'First Citizen Report',
          badgeColor: '#10B981',
          title: '1 Home Reports Bad Water',
          icon: '🏠',
          simpleText: 'A resident turns on the kitchen tap and finds brown, bad-smelling water. They submit a quick 15-second voice note on JanSahayak.',
          detailStat: '1 House Affected',
          detailNote: 'Reported at 07:30 AM',
          whatOldWayDid: 'Old portals treat this as an isolated tap issue and send 1 plumber.'
        },
        {
          stepNumber: 2,
          badge: 'AI Connects The Dots',
          badgeColor: '#F59E0B',
          title: 'JanSahayak Spots 12 Nearby Reports',
          icon: '🏘️',
          simpleText: 'Within 4 hours, 12 neighboring homes report the exact same dirty water along 3 streets. JanSahayak links them together immediately.',
          detailStat: '12 Connected Homes',
          detailNote: 'Across a 350m street radius',
          whatOldWayDid: 'Old portals would book 12 separate appointments across 2 weeks.'
        },
        {
          stepNumber: 3,
          badge: 'Root Cause Solved Forever',
          badgeColor: '#6366F1',
          title: 'Fix The Cracked Main Street Pipe',
          icon: '🛠️',
          simpleText: 'Instead of visiting 12 individual home taps, the city dispatches 1 repair truck with valve clamps directly to the cracked underground pipe.',
          detailStat: '450 Families Protected',
          detailNote: 'Clean water restored in 4 hours',
          whatOldWayDid: 'Permanent fix executed with zero repeat complaints.'
        }
      ],
      oldWay: {
        title: 'Old Government Way',
        icon: '❌',
        subtitle: 'Treating individual taps, ignoring the broken pipe',
        bulletPoints: [
          '12 separate complaints filed over several days',
          '12 different plumbers sent to check individual household taps',
          'Underground broken main pipe is completely missed',
          'Dirty water returns every single morning'
        ],
        consequence: 'Weeks wasted, city tax money burnt, and children get sick.'
      },
      newWay: {
        title: 'The JanSahayak Way',
        icon: '✅',
        subtitle: 'Fixing the underground pipe break once for everyone',
        bulletPoints: [
          'AI groups 12 complaints automatically in under 4 hours',
          'Identifies the underground main pipeline as the single source',
          '1 repair team sent with proper heavy pipe clamps',
          'Water safety tested and verified for the whole neighborhood'
        ],
        consequence: 'Fixed in 1 trip for all 450 families. 70% cheaper and permanent.'
      },
      metrics: [
        { label: 'Time to Fix', old: '14 Days', smart: '4 Hours', highlight: '95% Faster' },
        { label: 'Plumber Trips', old: '12 Visits', smart: '1 Targeted Fix', highlight: 'Saves Fuel & Manpower' },
        { label: 'Families Helped', old: '1 Tap at a time', smart: '450 Households', highlight: 'Whole Ward Safe' }
      ]
    },
    {
      id: 'roads',
      title: 'Road Potholes',
      icon: '🛣️',
      dept: 'Public Works Department (PWD)',
      location: 'Lajpat Nagar Ring Road',
      steps: [
        {
          stepNumber: 1,
          badge: 'First Citizen Report',
          badgeColor: '#10B981',
          title: '1 Scooter Slips on a Pothole',
          icon: '🛵',
          simpleText: 'A commuter almost crashes on a deep road hole near the school bus stop and uploads a quick photo.',
          detailStat: '1 Deep Crater',
          detailNote: 'Reported after heavy rain',
          whatOldWayDid: 'Road workers throw a bucket of loose stones in the hole.'
        },
        {
          stepNumber: 2,
          badge: 'AI Connects The Dots',
          badgeColor: '#F59E0B',
          title: '8 Potholes Form on Same 400m Road',
          icon: '⚠️',
          simpleText: 'JanSahayak detects that 8 different potholes appeared along the exact same stretch. The underlying cause: a blocked underground drain is leaking water into the road base.',
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
          simpleText: 'PWD cleans out the underground stormwater drain first so water stops weakening the asphalt, then lays down smooth, solid asphalt.',
          detailStat: '500m Road Section',
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
        subtitle: 'Fixing the underground water leak first',
        bulletPoints: [
          'JanSahayak detects underground drainage overflow causing asphalt collapse',
          'Drainage clearance crew cleans blocked storm channel',
          'Heavy roller machine levels and seals 500m of road base',
          'Road stays solid throughout the entire rainy season'
        ],
        consequence: 'Completely stops repetitive pothole formation and keeps traffic safe.'
      },
      metrics: [
        { label: 'Repair Longevity', old: '5 Days', smart: '3+ Years', highlight: 'Stays Smooth' },
        { label: 'Accident Risk', old: 'High (Recurring)', smart: 'Zero (Eliminated)', highlight: 'Safe Commutes' },
        { label: 'Public Budget', old: 'Continuous Waste', smart: '65% Cost Savings', highlight: 'Saves Tax Money' }
      ]
    },
    {
      id: 'lights',
      title: 'Dark Streetlights',
      icon: '💡',
      dept: 'BSES Power Utility',
      location: 'Kalkaji Main Market',
      steps: [
        {
          stepNumber: 1,
          badge: 'First Citizen Report',
          badgeColor: '#10B981',
          title: '1 Dark Lamp Post Outside a Shop',
          icon: '🔦',
          simpleText: 'A woman leaving her shop notices the street pole outside is dark and files a report so customers feel safe.',
          detailStat: '1 Dark Pole',
          detailNote: 'Reported at 08:15 PM',
          whatOldWayDid: 'Electrician scheduled to check bulb #1 on Monday.'
        },
        {
          stepNumber: 2,
          badge: 'AI Connects The Dots',
          badgeColor: '#F59E0B',
          title: '14 Streetlights Out on Same Block',
          icon: '🔌',
          simpleText: 'JanSahayak spots 14 reports in 90 minutes. It maps the power line and finds all 14 dark poles are linked to the same feeder pillar.',
          detailStat: '14 Dark Poles',
          detailNote: 'Shared electrical distribution circuit',
          whatOldWayDid: 'Old portals send a technician to inspect 14 poles one by one over 3 nights.'
        },
        {
          stepNumber: 3,
          badge: 'Root Cause Solved Forever',
          badgeColor: '#6366F1',
          title: 'Replace Master Switch in Feeder Box #7',
          icon: '⚡',
          simpleText: 'The lineman skips testing 14 individual bulbs and goes straight to Feeder Box #7 to replace the tripped master switch.',
          detailStat: 'Full Street Lit',
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
          'High fear of theft and safety hazards for women',
          'Root cause (tripped circuit box) remains undiscovered'
        ],
        consequence: 'Days of scary dark streets while checking bulbs that aren’t even broken.'
      },
      newWay: {
        title: 'The JanSahayak Way',
        icon: '✅',
        subtitle: 'Replacing the central master fuse in 35 minutes',
        bulletPoints: [
          'AI correlates 14 reports to Feeder Box #7 instantly',
          'Lineman dispatched with right heavy-duty breaker switch',
          'Master switch swapped in 35 minutes',
          'Entire shopping alley lights up simultaneously'
        ],
        consequence: 'Safe, well-lit streets restored on the same evening in under 1 hour.'
      },
      metrics: [
        { label: 'Outage Time', old: '3 Nights Dark', smart: '35 Minutes', highlight: 'Fast Restoration' },
        { label: 'Poles Checked', old: '14 Individual Poles', smart: '1 Central Feeder Box', highlight: 'Direct Diagnosis' },
        { label: 'Safety Impact', old: 'Unsafe Walkways', smart: '100% Bright & Safe', highlight: 'Protected Market' }
      ]
    }
  ];

  // Map Wards Data (Section 07 - Geospatial Intelligence)
  const mapWards = [
    {
      id: 'ward14',
      ward: 'Ward 14 (Rohini Sector 14)',
      shortName: 'Rohini Sector 14',
      zone: 'North-West Delhi',
      category: 'Water Supply',
      icon: '💧',
      dept: 'Delhi Jal Board (DJB)',
      severity: 'CRITICAL',
      color: '#EF4444',
      reports: 18 + (simulatedSignals['ward14'] || 0),
      hotspotName: 'Main Pipeline Fracture Cluster',
      actionRequired: 'Replace 100mm cast-iron valve clamp & chlorine test',
      trend: '+4 reports today',
      status: 'EMERGING_HOTSPOT',
      posX: 29, // % from left
      posY: 24, // % from top
      dispatchedUnit: 'DJB Quick-Response Squad #4',
      eta: '24 Mins',
      peopleImpacted: '~450 Families',
      radiusMeters: '400m Radius'
    },
    {
      id: 'ward8',
      ward: 'Ward 8 (Lajpat Nagar / Moolchand)',
      shortName: 'Lajpat Nagar Ring Road',
      zone: 'South-Central Delhi',
      category: 'Roads',
      icon: '🛣️',
      dept: 'Public Works Department (PWD)',
      severity: 'HIGH',
      color: '#F59E0B',
      reports: 7 + (simulatedSignals['ward8'] || 0),
      hotspotName: 'Underpass Cavity & Drainage Backup',
      actionRequired: 'Asphalt resurfacing & storm drain clearance',
      trend: 'Steady (Rainfall)',
      status: 'UNDER_INSPECTION',
      posX: 61,
      posY: 63,
      dispatchedUnit: 'PWD Road Repair Squad #2',
      eta: '18 Mins',
      peopleImpacted: '~2,500 Commuters',
      radiusMeters: '300m Radius'
    },
    {
      id: 'ward22',
      ward: 'Ward 22 (Mayur Vihar Ph-1)',
      shortName: 'Mayur Vihar Pocket 1',
      zone: 'East Delhi',
      category: 'Sanitation',
      icon: '🗑️',
      dept: 'Municipal Corporation (MCD)',
      severity: 'HIGH',
      color: '#10B981',
      reports: 11 + (simulatedSignals['ward22'] || 0),
      hotspotName: 'Market Dumper Overflow',
      actionRequired: 'Deploy dual 12MT hydraulic dumpers + lime-wash',
      trend: '-6 reports (Improving)',
      status: 'RESOLVING',
      posX: 76,
      posY: 47,
      dispatchedUnit: 'MCD Heavy Fleet #12',
      eta: 'En Route',
      peopleImpacted: '~800 Residents',
      radiusMeters: '500m Radius'
    },
    {
      id: 'ward5',
      ward: 'Ward 5 (Kalkaji / Nehru Place)',
      shortName: 'Kalkaji Market',
      zone: 'South-East Delhi',
      category: 'Electricity',
      icon: '⚡',
      dept: 'BSES Power Utility',
      severity: 'MEDIUM',
      color: '#3B82F6',
      reports: 9 + (simulatedSignals['ward5'] || 0),
      hotspotName: 'Feeder Pillar 7 Tripping',
      actionRequired: 'Replace burnt MCB fuse at feeder station',
      trend: '+2 reports today',
      status: 'EMERGING_HOTSPOT',
      posX: 66,
      posY: 75,
      dispatchedUnit: 'BSES Lineman Patrol #7',
      eta: '35 Mins',
      peopleImpacted: '~120 Retail Shops',
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
            maxWidth: '840px',
            margin: '0 auto',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            {/* Hero Narrative */}
            <div className="hero-left-col" style={{ width: '100%' }}>
              {/* Category Overline: Professional Public Civic Intelligence */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                <span className="pilot-tag">
                  Interactive Pilot Demonstration
                </span>
              </div>

              {/* Core Hero Headline */}
              <h1 className="hero-headline" style={{ marginBottom: '20px', fontSize: '38px', lineHeight: 1.2 }}>
                Aapki Awaaz, Ab <span className="headline-accent">Samjhi</span> Jayegi.
              </h1>

              {/* Supporting Copy */}
              <p style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                maxWidth: '640px',
                margin: '0 auto 32px auto'
              }}>
                A public grievance intelligence platform that turns everyday citizen voices into structured insights, connected evidence, and actionable resolution recommendations.
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
                  <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)', display: 'block' }}>22 Languages</strong>
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
              Four clear steps that eliminate bureaucratic dead-ends and empower both residents and public authorities.
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
                    {/* Header: Large Stylized Number + Aesthetic Pill Badge */}
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
                      marginBottom: '10px', 
                      color: '#0F172A',
                      letterSpacing: '-0.01em'
                    }}>
                      {s.title}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#475569', 
                      lineHeight: 1.65,
                      margin: 0
                    }}>
                      {s.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==========================================================================
          05. REAL CIVIC EXAMPLES (Everyday problems. Smarter understanding.)
          ========================================================================== */}
      <section className="section-spacing">
        <div className="container">
          <div className="section-header center">
            <span className="category-pill" style={{ marginBottom: '12px' }}>
              REAL-WORLD UTILITY
            </span>
            <h2>Everyday Problems. Smarter Understanding.</h2>
            <p>
              How JanSahayak translates everyday colloquial complaints across 4 major municipal domains.
            </p>
          </div>

          {/* Domain Selector Tabs */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            {civicExamples.map((ex, idx) => (
              <button
                key={ex.domain}
                type="button"
                onClick={() => setActiveExampleIndex(idx)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: activeExampleIndex === idx ? 700 : 500,
                  background: activeExampleIndex === idx ? 'var(--color-primary)' : '#FFFFFF',
                  color: activeExampleIndex === idx ? '#FFFFFF' : 'var(--color-text-secondary)',
                  border: '1px solid var(--color-border-subtle)',
                  boxShadow: activeExampleIndex === idx ? 'var(--shadow-sm)' : 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 150ms ease'
                }}
              >
                <span>{ex.icon}</span>
                <span>{ex.domain}</span>
              </button>
            ))}
          </div>

          {/* Active Civic Example Showcase — Visual Integration Network Flow matching Reference */}
          {(() => {
            const currentEx = civicExamples[activeExampleIndex];
            return (
              <div
                style={{
                  position: 'relative',
                  padding: '40px 24px',
                  background: '#FFFFFF',
                  borderRadius: '28px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.06)',
                  maxWidth: '1080px',
                  margin: '0 auto',
                  overflow: 'hidden'
                }}
              >
                {/* Soft ambient atmospheric glow orbs */}
                <div 
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(167, 243, 208, 0.25) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                  }}
                />
                <div 
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(199, 210, 254, 0.25) 0%, rgba(255,255,255,0) 70%)',
                    filter: 'blur(40px)',
                    pointerEvents: 'none'
                  }}
                />

                {/* 3-Column Interactive Flow Layout */}
                <div className="civic-flow-grid">
                  {/* Left Column: Unstructured Citizen Intake */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#64748B'
                    }}>
                      <span>INPUT</span>
                      <span>•</span>
                      <span>Raw Citizen Voice</span>
                    </div>

                    {/* Speech / Text Intake Card */}
                    <div style={{
                      padding: '16px 18px',
                      borderRadius: '16px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(15, 23, 42, 0.03)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>🎙️</span>
                          <span>Audio Intake</span>
                        </span>
                        <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#EFF6FF', color: '#2563EB' }}>
                          {currentEx.dialect}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', fontStyle: 'italic', lineHeight: 1.5, color: '#334155', margin: 0 }}>
                        "{currentEx.citizenQuote}"
                      </p>
                    </div>

                    {/* Detected Location & Population Nodes */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        fontSize: '11px'
                      }}>
                        <span style={{ color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Detected Ward</span>
                        <strong style={{ color: '#0F172A', fontSize: '12px', display: 'block' }}>{currentEx.understands.location.split(',')[0]}</strong>
                      </div>
                      <div style={{
                        padding: '10px 12px',
                        borderRadius: '12px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        fontSize: '11px'
                      }}>
                        <span style={{ color: '#94A3B8', display: 'block', marginBottom: '2px' }}>Impact Radius</span>
                        <strong style={{ color: '#0F172A', fontSize: '12px', display: 'block' }}>{currentEx.understands.households}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Center Column: JanSahayak AI Triage Core with Circuit Traces */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    textAlign: 'center',
                    padding: '20px 0'
                  }}>
                    {/* SVG Connector Lines bridging Left to Center and Center to Right */}
                    <svg 
                      className="civic-flow-svg"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        zIndex: 0
                      }}
                      viewBox="0 0 300 200"
                      fill="none"
                    >
                      {/* Inbound Lines from Left */}
                      <path d="M 0 60 L 60 60 L 90 90 L 110 90" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      <path d="M 0 100 L 110 100" stroke="#10B981" strokeWidth="1.8" />
                      <path d="M 0 140 L 60 140 L 90 110 L 110 110" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Outbound Lines to Right */}
                      <path d="M 190 90 L 210 90 L 240 60 L 300 60" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />
                      <path d="M 190 100 L 300 100" stroke="#3B82F6" strokeWidth="1.8" />
                      <path d="M 190 110 L 210 110 L 240 140 L 300 140" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="3 3" />

                      {/* Connection Dots */}
                      <circle cx="110" cy="90" r="3" fill="#10B981" />
                      <circle cx="110" cy="100" r="3" fill="#10B981" />
                      <circle cx="110" cy="110" r="3" fill="#10B981" />

                      <circle cx="190" cy="90" r="3" fill="#3B82F6" />
                      <circle cx="190" cy="100" r="3" fill="#3B82F6" />
                      <circle cx="190" cy="110" r="3" fill="#3B82F6" />
                    </svg>

                    {/* Micro-Tag above Engine */}
                    <div style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#7C3AED',
                      marginBottom: '10px',
                      position: 'relative',
                      zIndex: 1
                    }}>
                      {'{ ai civic translation }'}
                    </div>

                    {/* Central AI Engine Pill Box */}
                    <div style={{
                      position: 'relative',
                      zIndex: 1,
                      padding: '14px 22px',
                      background: '#FFFFFF',
                      border: '1.5px solid #10B981',
                      borderRadius: '999px',
                      boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15), 0 0 0 4px rgba(16, 185, 129, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px'
                    }}>
                      <img 
                        src="/logo.png" 
                        alt="JanSahayak" 
                        style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
                      />
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                          JanSahayak AI
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#059669' }}>
                          Triage & Dispatch Core
                        </div>
                      </div>
                    </div>

                    <div style={{
                      marginTop: '12px',
                      fontSize: '11px',
                      color: '#64748B',
                      fontWeight: 500,
                      position: 'relative',
                      zIndex: 1
                    }}>
                      Instant Triage & Multi-Ward Cluster
                    </div>
                  </div>

                  {/* Right Column: Structured Municipal Work Orders */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: '#64748B'
                    }}>
                      <span>OUTPUT</span>
                      <span>•</span>
                      <span>Municipal Action Brief</span>
                    </div>

                    {/* Department Routing & Urgency Pill */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
                        <Building2 style={{ width: '14px', height: '14px', color: '#059669' }} />
                        <span>{currentEx.dept.split('(')[0]}</span>
                      </div>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        background: currentEx.understands.severity.includes('CRITICAL') ? '#FEF2F2' : '#FFFBEB',
                        color: currentEx.understands.severity.includes('CRITICAL') ? '#991B1B' : '#92400E'
                      }}>
                        {currentEx.understands.severity.split(' ')[0]}
                      </span>
                    </div>

                    {/* Pattern Correlation Node */}
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: '#FFFBEB',
                      border: '1px solid #FDE68A',
                      fontSize: '11.5px',
                      color: '#92400E'
                    }}>
                      <strong>Systemic Warning: </strong>
                      <span>{currentEx.pattern}</span>
                    </div>

                    {/* Recommended Action Box */}
                    <div style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0'
                    }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#065F46', display: 'block', marginBottom: '2px' }}>
                        Dispatched Action:
                      </span>
                      <p style={{ fontSize: '12px', color: '#065F46', fontWeight: 600, margin: 0, lineHeight: 1.4 }}>
                        {currentEx.action}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
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
            <p style={{ color: 'var(--color-text-inverse-muted)', fontSize: '16px', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
              Old government portals treat every complaint like an isolated accident. JanSahayak connects reports from neighbors so authorities fix the actual underground problem once and for all.
            </p>
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
          07. CIVIC INTELLIGENCE MAP PREVIEW (Interactive Delhi GIS Radar)
          ========================================================================== */}
      <section className="section-spacing" style={{ background: '#F8F9FA' }}>
        <div className="container">
          {/* Header - Centered Layout */}
          <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 36px auto' }}>
            <span className="category-pill" style={{ background: '#E8F7F0', color: '#0E5E3A', borderColor: 'rgba(14, 94, 58, 0.2)', marginBottom: '12px', display: 'inline-flex' }}>
              🛰️ GEOSPATIAL CLUSTER RADAR
            </span>
            <h2 style={{ marginTop: '4px', fontSize: '36px', letterSpacing: '-0.02em', color: '#0F172A', marginBottom: '10px', lineHeight: 1.2 }}>
              Where Are Problems Happening Across Delhi?
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
            {/* Left Column: Interactive Delhi GIS Radar Canvas */}
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
              {/* REAL SATELLITE / GIS MAP IMAGE BASEMAP */}
              <div 
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: mapBasemap === 'satellite' 
                    ? 'url("/delhi-gis-map-satellite.jpg")' 
                    : 'url("/delhi-gis-map-dark.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  transform: `scale(${mapZoom})`,
                  transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1), background-image 300ms ease',
                  filter: mapBasemap === 'satellite' ? 'brightness(0.92) contrast(1.08)' : 'brightness(1.05)'
                }} 
              />

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
                  <span>Delhi NCT Municipal Grid • Live GIS Feed</span>
                </div>

                {/* Basemap Switcher & Zoom Tools */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                  to={`/officer/complaints/DL-2026-W14-0892`}
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
