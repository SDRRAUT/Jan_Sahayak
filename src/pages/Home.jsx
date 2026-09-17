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
  Radio
} from 'lucide-react';
import WhyExplainer from '../components/common/WhyExplainer';
import { INITIAL_GRIEVANCES, SYSTEM_METRICS } from '../data/mockGrievances';

export default function Home() {
  // 20-Second End-to-End Civic Intelligence Lifecycle Demo
  const [demoStep, setDemoStep] = useState(0);
  const [demoAutoPlay, setDemoAutoPlay] = useState(true);
  const [demoSeconds, setDemoSeconds] = useState(0);
  const [citizenVerified, setCitizenVerified] = useState(false);

  // 5-Stage Complete Flow from Citizen Voice to Civic Intelligence to Verified Resolution
  const demoPhases = [
    {
      id: 0,
      shortName: '01 REGISTER',
      phase: 'CITIZEN INTAKE',
      title: 'Everyday Citizen Voice / Text',
      pill: 'Voice Note Ingested',
      timeRange: '0s - 4s'
    },
    {
      id: 1,
      shortName: '02 UNDERSTAND',
      phase: 'DNA EXTRACTION',
      title: 'Multimodal AI & Complaint DNA',
      pill: 'DNA-W14-892',
      timeRange: '4s - 8s'
    },
    {
      id: 2,
      shortName: '03 INTELLIGENCE',
      phase: 'CIVIC LINKAGE',
      title: 'Civic Linkage & Clustering',
      pill: '17 Reports → 1 Incident',
      timeRange: '8s - 12s'
    },
    {
      id: 3,
      shortName: '04 DISPATCH',
      phase: 'DECISION & DISPATCH',
      title: 'Action Simulation & SLA',
      pill: 'Field Crew Dispatched',
      timeRange: '12s - 16s'
    },
    {
      id: 4,
      shortName: '05 VERIFY',
      phase: 'CITIZEN VERIFY',
      title: 'Closed-Loop Citizen Sign-Off',
      pill: 'Verified Resolution',
      timeRange: '16s - 20s'
    }
  ];

  // Auto-advance 20-second demo timer (4s per stage = 20s full loop)
  useEffect(() => {
    if (!demoAutoPlay) return;
    const timer = setInterval(() => {
      setDemoSeconds((prev) => {
        const nextSec = (prev + 1) % 20;
        const currentStep = Math.floor(nextSec / 4);
        setDemoStep(currentStep);
        if (currentStep === 4) setCitizenVerified(true);
        if (currentStep === 0) setCitizenVerified(false);
        return nextSec;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [demoAutoPlay]);

  const handleStepJump = (stepId) => {
    setDemoStep(stepId);
    setDemoSeconds(stepId * 4);
    if (stepId === 4) setCitizenVerified(true);
  };

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

  // Map Wards Data (Section 17)
  const mapWards = [
    {
      ward: 'Ward 14 (Rohini Sector 14)',
      category: 'Water Supply',
      severity: 'CRITICAL',
      reports: 18,
      hotspotName: 'Main Pipeline Fracture Cluster',
      actionRequired: 'Replace 100mm cast-iron valve clamp',
      trend: '+4 reports today',
      status: 'EMERGING_HOTSPOT'
    },
    {
      ward: 'Ward 8 (Lajpat Nagar / Moolchand)',
      category: 'Roads',
      severity: 'HIGH',
      reports: 7,
      hotspotName: 'Underpass Cavity & Drainage Backup',
      actionRequired: 'Asphalt resurfacing & drain clearance',
      trend: 'Steady',
      status: 'UNDER_INSPECTION'
    },
    {
      ward: 'Ward 22 (Mayur Vihar Ph-1)',
      category: 'Sanitation',
      severity: 'HIGH',
      reports: 11,
      hotspotName: 'Market Dumper Overflow',
      actionRequired: 'Scheduled daily pickup enforcement',
      trend: '-6 reports (Improving)',
      status: 'RESOLVING'
    },
    {
      ward: 'Ward 5 (Kalkaji)',
      category: 'Electricity',
      severity: 'MEDIUM',
      reports: 9,
      hotspotName: 'Feeder Pillar 7 Tripping',
      actionRequired: 'Substation load balancing',
      trend: '+2 reports today',
      status: 'EMERGING_HOTSPOT'
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

  return (
    <div>
      {/* ==========================================================================
          02. HERO SECTION
          ========================================================================== */}
      <section className="section-spacing" style={{ paddingTop: '40px', paddingBottom: '56px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* Left Narrative (7 Cols) */}
            <div style={{ gridColumn: 'span 7' }} className="hero-left-col">
              {/* Category Overline: Professional Public Civic Intelligence */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <span className="category-pill" style={{ background: '#E8F7F0', color: '#0E5E3A', borderColor: 'rgba(14, 94, 58, 0.2)' }}>
                  <ShieldCheck style={{ width: '13px', height: '13px' }} />
                  <span>PUBLIC GRIEVANCE INTELLIGENCE</span>
                </span>
                <span className="pilot-tag">
                  Interactive Pilot Demonstration
                </span>
              </div>

              {/* Core Hero Headline */}
              <h1 className="hero-headline" style={{ marginBottom: '20px' }}>
                Aapki Awaaz, Ab <span className="headline-accent">Samjhi</span> Jayegi.
              </h1>

              {/* Supporting Copy */}
              <p style={{
                fontSize: '17px',
                lineHeight: 1.6,
                color: 'var(--color-text-secondary)',
                maxWidth: '560px',
                marginBottom: '32px'
              }}>
                A public grievance intelligence platform that turns everyday citizen voices into structured insights, connected evidence, and actionable resolution recommendations.
              </p>

              {/* Primary Call-to-Actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '36px' }}>
                <Link to="/citizen/submit" className="btn-primary" style={{ padding: '0 28px' }}>
                  <span>Report a Problem</span>
                  <ArrowRight className="btn-arrow" style={{ width: '16px', height: '16px' }} />
                </Link>

                <Link to="/citizen" className="btn-secondary">
                  <Search style={{ width: '15px', height: '15px', color: 'var(--color-text-muted)' }} />
                  <span>Track My Grievance</span>
                </Link>
              </div>

              {/* Subtle Trust Indicators */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', paddingTop: '16px', borderTop: '1px solid var(--color-divider)' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: 'var(--color-text-primary)', display: 'block' }}>3.2 Days</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Avg. Resolution SLA</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--color-divider)' }} />
                <div>
                  <strong style={{ fontSize: '15px', color: 'var(--color-text-primary)', display: 'block' }}>94.8%</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>First-Time Routing Accuracy</span>
                </div>
                <div style={{ width: '1px', height: '24px', background: 'var(--color-divider)' }} />
                <div>
                  <strong style={{ fontSize: '15px', color: 'var(--color-text-primary)', display: 'block' }}>22 Languages</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Multilingual Voice Intake</span>
                </div>
              </div>
            </div>

            {/* ==========================================================================
                03. 20-SECOND PRODUCT DEMONSTRATION (Hero Right Visual)
                ========================================================================== */}
            <div style={{ gridColumn: 'span 5' }} className="hero-right-col">
              <div
                className="card"
                style={{
                  padding: '22px',
                  background: '#FFFFFF',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-card-hover)',
                  border: '1px solid rgba(15, 23, 42, 0.1)',
                  position: 'relative'
                }}
              >
                {/* Visual Flow Header & 20s Timer Controls */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="status-dot active" style={{ width: '6px', height: '6px' }} />
                      <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)' }}>
                        20-Second Live Demonstration
                      </span>
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)', marginTop: '2px' }}>
                      Citizen-to-Resolution Lifecycle
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: 'var(--color-text-primary)',
                      background: '#F1F5F9',
                      padding: '3px 7px',
                      borderRadius: '4px'
                    }}>
                      00:{String(demoSeconds).padStart(2, '0')} / 00:20s
                    </span>

                    <button
                      type="button"
                      onClick={() => setDemoAutoPlay(!demoAutoPlay)}
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '4px 9px',
                        borderRadius: 'var(--radius-full)',
                        background: demoAutoPlay ? '#ECFDF5' : '#F1F5F9',
                        color: demoAutoPlay ? '#065F46' : 'var(--color-text-secondary)',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                      title={demoAutoPlay ? 'Pause 20s autoplay' : 'Play 20s autoplay'}
                    >
                      {demoAutoPlay ? '⏸ Pause' : '▶ Play 20s'}
                    </button>
                  </div>
                </div>

                {/* 20-Second Animated Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '4px',
                  background: '#E2E8F0',
                  borderRadius: '9999px',
                  marginBottom: '14px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    height: '100%',
                    width: `${(demoSeconds / 20) * 100}%`,
                    background: 'linear-gradient(90deg, #10B981 0%, #4F46E5 100%)',
                    borderRadius: '9999px',
                    transition: 'width 980ms linear'
                  }} />
                </div>

                {/* 5-Stage Stepper Navigation Buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '3px',
                  marginBottom: '14px',
                  background: '#F1F5F9',
                  padding: '3px',
                  borderRadius: 'var(--radius-md)'
                }}>
                  {demoPhases.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleStepJump(p.id)}
                      style={{
                        padding: '6px 2px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '9.5px',
                        fontWeight: demoStep === p.id ? 700 : 500,
                        background: demoStep === p.id ? '#FFFFFF' : 'transparent',
                        color: demoStep === p.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                        boxShadow: demoStep === p.id ? '0 1px 2px rgba(15,23,42,0.06)' : 'none',
                        textAlign: 'center',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 120ms ease',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                      title={p.title}
                    >
                      {p.shortName}
                    </button>
                  ))}
                </div>

                {/* ================================================================
                    STAGE 0: Citizen Voice & Complaint Registration (0s - 4s)
                    ================================================================ */}
                {demoStep === 0 && (
                  <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                    <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Radio style={{ width: '12px', height: '12px', color: '#10B981' }} />
                          Citizen Voice Intake
                        </span>
                        <span style={{ fontSize: '10px', color: '#065F46', background: '#ECFDF5', padding: '1.5px 6px', borderRadius: '9999px', fontWeight: 700 }}>
                          Ward 14 Resident
                        </span>
                      </div>

                      {/* Animated Audio Waveform */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '22px', marginBottom: '8px', padding: '0 8px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <span style={{ fontSize: '9.5px', color: 'var(--color-text-muted)', fontWeight: 600, marginRight: '6px' }}>0:14s</span>
                        {[10, 16, 20, 12, 18, 22, 14, 20, 16, 8, 14, 20, 18, 12, 18, 14, 10, 16, 20, 14].map((h, i) => (
                          <span key={i} style={{ width: '2.5px', height: `${h}px`, background: '#10B981', borderRadius: '2px' }} />
                        ))}
                      </div>

                      <p style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--color-text-primary)', lineHeight: 1.45, margin: 0, background: '#FFFFFF', padding: '9px 11px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        "Hamare Sector 14, Pocket 2 mein 3 din se naali ka ganda badbudaar paani drinking supply mein mix hoke aa raha hai near Mother Dairy booth... Bacche bimaar pad rahe hain please jaldi theek karwao!"
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Ingested & geo-tagged in 1.2s • No technical forms
                      </span>
                      <button type="button" onClick={() => handleStepJump(1)} className="btn-primary btn-sm">
                        <span>See DNA Extraction →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================
                    STAGE 1: AI Understanding & Complaint DNA (4s - 8s)
                    ================================================================ */}
                {demoStep === 1 && (
                  <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                    <div style={{ padding: '13px', borderRadius: 'var(--radius-md)', background: '#EEF2FF', border: '1px solid rgba(79, 70, 229, 0.2)', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Sparkles style={{ width: '13px', height: '13px', color: '#4F46E5' }} />
                          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#4338CA', textTransform: 'uppercase' }}>
                            Complaint DNA Fingerprint
                          </span>
                          <span style={{ fontSize: '9.5px', fontFamily: 'var(--font-mono)', background: '#FFFFFF', padding: '1px 5px', borderRadius: '4px', color: '#4F46E5', fontWeight: 600 }}>
                            DNA-W14-892
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#991B1B', background: '#FEF2F2', padding: '2px 6px', borderRadius: '9999px' }}>
                            High Priority
                          </span>
                          <WhyExplainer
                            label="Why?"
                            title="Why High Priority?"
                            reasons={[
                              'Sewage cross-contamination (biological hazard)',
                              '3 consecutive days of active exposure',
                              'Primary school & Mother Dairy booth within 150m'
                            ]}
                            align="right"
                          />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                        <div style={{ background: '#FFFFFF', padding: '7px 9px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                          <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', display: 'block' }}>Category</span>
                          <strong style={{ fontSize: '11.5px', color: 'var(--color-text-primary)' }}>💧 Water Contamination</strong>
                        </div>
                        <div style={{ background: '#FFFFFF', padding: '7px 9px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                          <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', display: 'block' }}>Location</span>
                          <strong style={{ fontSize: '11.5px', color: 'var(--color-text-primary)' }}>📍 Rohini Sector 14</strong>
                        </div>
                        <div style={{ background: '#FFFFFF', padding: '7px 9px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                          <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', display: 'block' }}>Duration</span>
                          <strong style={{ fontSize: '11.5px', color: 'var(--color-text-primary)' }}>⏱ 3 Days Ongoing</strong>
                        </div>
                        <div style={{ background: '#FFFFFF', padding: '7px 9px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(79, 70, 229, 0.1)' }}>
                          <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', display: 'block' }}>Estimated Impact</span>
                          <strong style={{ fontSize: '11.5px', color: 'var(--color-text-primary)' }}>👥 ~450 Families</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Extracted with 98.4% multi-modal confidence
                      </span>
                      <button type="button" onClick={() => handleStepJump(2)} className="btn-primary btn-sm">
                        <span>Check Intelligence →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================
                    STAGE 2: In-Between Civic Intelligence & Linkage (8s - 12s)
                    ================================================================ */}
                {demoStep === 2 && (
                  <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                    <div style={{ padding: '13px', borderRadius: 'var(--radius-md)', background: '#FFFBEB', border: '1px solid #FCD34D', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Activity style={{ width: '13px', height: '13px', color: '#D97706' }} />
                          <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
                            Civic Intelligence Linkage
                          </span>
                        </div>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#B45309', background: '#FEF3C7', padding: '1.5px 6px', borderRadius: '4px' }}>
                          INC-2026-DEL-01
                        </span>
                      </div>

                      <div style={{ background: '#FFFFFF', padding: '9px 11px', borderRadius: '6px', border: '1px solid #FDE68A', marginBottom: '8px' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#92400E', marginBottom: '3px' }}>
                          17 Complaints Linked Across 400m Corridor
                        </div>
                        <p style={{ fontSize: '11px', color: '#78350F', lineHeight: 1.4, margin: 0 }}>
                          AI clusters 17 isolated reports: Subsurface joint leak in 1988 cast-iron line is softening road subgrade.
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: '#92400E' }}>
                        <span style={{ fontWeight: 700, color: '#0284C7', background: '#E0F2FE', padding: '1.5px 5px', borderRadius: '4px' }}>DJB Pipe Leak</span>
                        <span>+</span>
                        <span style={{ fontWeight: 700, color: '#0E5E3A', background: '#E8F7F0', padding: '1.5px 5px', borderRadius: '4px' }}>PWD Road Sinking</span>
                        <span>=</span>
                        <span style={{ fontWeight: 700, color: '#991B1B' }}>Cross-Dept Alert</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        100 complaints reduced to 1 systemic problem
                      </span>
                      <button type="button" onClick={() => handleStepJump(3)} className="btn-primary btn-sm">
                        <span>See Field Dispatch →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================
                    STAGE 3: Action Simulation & Department Dispatch (12s - 16s)
                    ================================================================ */}
                {demoStep === 3 && (
                  <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                    <div style={{ padding: '13px', borderRadius: 'var(--radius-md)', background: '#F0FDF4', border: '1px solid #BBF7D0', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#065F46', textTransform: 'uppercase' }}>
                          Decision Sandbox & Dispatch
                        </span>
                        <span style={{ fontSize: '10px', color: '#047857', background: '#DCFCE7', padding: '1.5px 6px', borderRadius: '9999px', fontWeight: 700 }}>
                          12h Target SLA
                        </span>
                      </div>

                      <div style={{ background: '#FFFFFF', padding: '9px 11px', borderRadius: '6px', border: '1px solid #A7F3D0', marginBottom: '8px' }}>
                        <span style={{ fontSize: '9.5px', color: 'var(--color-text-muted)', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>
                          Simulated Engineering Remedy:
                        </span>
                        <strong style={{ fontSize: '12px', color: '#065F46', display: 'block', margin: '2px 0 3px 0' }}>
                          Ultrasonic Feeder Sleeve & Valve Seal (SOP #14)
                        </strong>
                        <span style={{ fontSize: '10.5px', color: '#047857' }}>
                          Historical Precedent Match: <strong>96% Success</strong> • Prevents road collapse
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#064E3B' }}>
                        <CheckCircle2 style={{ width: '13px', height: '13px', color: '#10B981', flexShrink: 0 }} />
                        <span>Dispatched to <strong>Er. Sanjay Sharma (AEE DJB)</strong> & PWD Safety Crew</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Human officer verifies and commits work order
                      </span>
                      <button type="button" onClick={() => handleStepJump(4)} className="btn-primary btn-sm">
                        <span>See Citizen Verify →</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ================================================================
                    STAGE 4: Closed-Loop Citizen Verification (16s - 20s)
                    ================================================================ */}
                {demoStep === 4 && (
                  <div style={{ animation: 'fadeIn 200ms ease-out' }}>
                    <div style={{ padding: '13px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid #CBD5E1', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '10.5px', fontWeight: 800, color: 'var(--color-text-primary)', textTransform: 'uppercase' }}>
                          Closed-Loop Citizen Verification
                        </span>
                        <span style={{ fontSize: '10px', color: '#15803D', background: '#DCFCE7', padding: '1.5px 6px', borderRadius: '9999px', fontWeight: 700 }}>
                          Resolved in 11h 24m
                        </span>
                      </div>

                      <div style={{ background: '#FFFFFF', padding: '10px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', marginBottom: '8px' }}>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-primary)', fontWeight: 600, margin: '0 0 8px 0', lineHeight: 1.3 }}>
                          "Municipal crew reports valve repair complete. Has clean, odorless drinking water resumed?"
                        </p>

                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setCitizenVerified(true)}
                            style={{
                              flex: 1,
                              padding: '7px 10px',
                              borderRadius: '6px',
                              background: citizenVerified ? '#10B981' : '#0E5E3A',
                              color: '#FFFFFF',
                              fontSize: '11.5px',
                              fontWeight: 700,
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                              boxShadow: '0 2px 6px rgba(14, 94, 58, 0.2)'
                            }}
                          >
                            <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                            <span>{citizenVerified ? '✓ Verified by Aditya (Ward 14)' : 'Yes, Supply is Clean!'}</span>
                          </button>

                          <button
                            type="button"
                            style={{
                              padding: '7px 10px',
                              borderRadius: '6px',
                              background: '#FFFFFF',
                              color: '#64748B',
                              fontSize: '11.5px',
                              fontWeight: 600,
                              border: '1px solid #CBD5E1',
                              cursor: 'pointer'
                            }}
                          >
                            Still Dirty
                          </button>
                        </div>
                      </div>

                      {citizenVerified && (
                        <div style={{ fontSize: '10.5px', color: '#15803D', background: '#F0FDF4', padding: '5px 8px', borderRadius: '4px', border: '1px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Sparkles style={{ width: '12px', height: '12px', color: '#10B981', flexShrink: 0 }} />
                          <span>Ticket permanently closed on citizen sign-off. Precedent logged to Civic Memory.</span>
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <button
                        type="button"
                        onClick={() => handleStepJump(0)}
                        style={{ fontSize: '11.5px', color: 'var(--color-primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        ↺ Replay 20s Flow
                      </button>
                      <Link to="/intelligence" className="btn-primary btn-sm">
                        <span>Open Civic Intelligence Suite →</span>
                      </Link>
                    </div>
                  </div>
                )}
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
            {/* Step 01 */}
            <div className="card card-interactive" style={{ padding: '28px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', display: 'block', marginBottom: '12px' }}>
                01
              </span>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Tell Us
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Describe your problem in your own words. Speak via audio, type in mixed Hindi/English, attach photos, or drop a pin.
              </p>
            </div>

            {/* Step 02 */}
            <div className="card card-interactive" style={{ padding: '28px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', display: 'block', marginBottom: '12px' }}>
                02
              </span>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                We Understand
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                The platform infers category, ward location, duration, and severity without forcing you to understand complex government departments.
              </p>
            </div>

            {/* Step 03 */}
            <div className="card card-interactive" style={{ padding: '28px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', display: 'block', marginBottom: '12px' }}>
                03
              </span>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                We Find Connections
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Correlates individual reports with nearby complaints, spatial clusters, and municipal historical cases to spot systemic breakdowns.
              </p>
            </div>

            {/* Step 04 */}
            <div className="card card-interactive" style={{ padding: '28px' }}>
              <span style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', display: 'block', marginBottom: '12px' }}>
                04
              </span>
              <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Action Becomes Clearer
              </h3>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                Field officers receive structured case briefs with SOP checklists. Upon completion, citizens verify whether the problem is actually solved.
              </p>
            </div>
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

          {/* Active Civic Example Showcase */}
          {(() => {
            const currentEx = civicExamples[activeExampleIndex];
            return (
              <div
                className="card"
                style={{
                  padding: '36px',
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
                  borderRadius: 'var(--radius-xl)',
                  maxWidth: '1000px',
                  margin: '0 auto'
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '32px', alignItems: 'center' }}>
                  {/* Left Column: Citizen Voice */}
                  <div style={{ gridColumn: 'span 5' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                      Citizen Speech / Text ({currentEx.dialect})
                    </span>
                    <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)', marginBottom: '14px' }}>
                      <p style={{ fontSize: '14px', fontStyle: 'italic', lineHeight: 1.6, color: 'var(--color-text-primary)' }}>
                        "{currentEx.citizenQuote}"
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}>
                      <Building2 style={{ width: '14px', height: '14px' }} />
                      <span>Assigned Department: {currentEx.dept}</span>
                    </div>
                  </div>

                  {/* Arrow Divider */}
                  <div style={{ gridColumn: 'span 1', textAlign: 'center' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ArrowRight style={{ width: '16px', height: '16px' }} />
                    </div>
                  </div>

                  {/* Right Column: AI Understanding & Action */}
                  <div style={{ gridColumn: 'span 6' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-primary)', display: 'block', marginBottom: '8px' }}>
                      JanSahayak Understanding & Recommended Action
                    </span>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
                      <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Category</span>
                        <strong style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{currentEx.understands.category}</strong>
                      </div>
                      <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Location</span>
                        <strong style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{currentEx.understands.location}</strong>
                      </div>
                      <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Severity</span>
                        <strong style={{ fontSize: '12px', color: '#991B1B' }}>{currentEx.understands.severity}</strong>
                      </div>
                      <div style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: '#FFFFFF', border: '1px solid var(--color-border-subtle)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Pattern Alert</span>
                        <strong style={{ fontSize: '12px', color: '#B45309' }}>{currentEx.pattern}</strong>
                      </div>
                    </div>

                    <div style={{ padding: '12px 14px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: '#065F46', display: 'block', marginBottom: '2px' }}>
                        Action for Public Officials
                      </span>
                      <p style={{ fontSize: '12px', color: '#065F46', fontWeight: 600, margin: 0 }}>
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
          06. ONE COMPLAINT → BIGGER PROBLEM (Storytelling Section)
          ========================================================================== */}
      <section className="section-spacing" style={{ background: 'var(--color-surface-inset-dark)', color: 'var(--color-text-inverse)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
            <span className="category-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', borderColor: 'rgba(16, 185, 129, 0.3)', marginBottom: '12px' }}>
              SYSTEMIC CIVIC INTELLIGENCE
            </span>
            <h2 style={{ fontSize: '38px', color: '#FFFFFF', marginBottom: '14px', letterSpacing: '-0.02em' }}>
              One Complaint is a Case.<br />A Pattern is a Warning.
            </h2>
            <p style={{ color: 'var(--color-text-inverse-muted)', fontSize: '16px', lineHeight: 1.6 }}>
              Legacy portals close repeated complaints as isolated tickets. JanSahayak correlates micro-reports into macro infrastructure diagnoses.
            </p>
          </div>

          {/* Transformation Visual Diagram */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '14px',
            alignItems: 'center',
            marginBottom: '40px'
          }}>
            {/* Box 1 */}
            <div style={{ background: 'var(--color-surface-inset-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-dark)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 700 }}>Trigger</span>
              <strong style={{ fontSize: '18px', display: 'block', color: '#FFFFFF', marginTop: '6px' }}>1 Complaint</strong>
              <p style={{ fontSize: '11px', color: 'var(--color-text-inverse-muted)', marginTop: '4px' }}>Resident notes foul water</p>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--color-accent)' }}>→</div>

            {/* Box 2 */}
            <div style={{ background: 'var(--color-surface-inset-card)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-dark)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-accent)', textTransform: 'uppercase', fontWeight: 700 }}>Correlation</span>
              <strong style={{ fontSize: '18px', display: 'block', color: '#FFFFFF', marginTop: '6px' }}>12 Similar Cases</strong>
              <p style={{ fontSize: '11px', color: 'var(--color-text-inverse-muted)', marginTop: '4px' }}>Across 3 adjacent lanes</p>
            </div>

            <div style={{ textAlign: 'center', color: 'var(--color-accent)' }}>→</div>

            {/* Box 3 */}
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(239, 68, 68, 0.3)', textAlign: 'center' }}>
              <span style={{ fontSize: '11px', color: '#F87171', textTransform: 'uppercase', fontWeight: 700 }}>Root Diagnosis</span>
              <strong style={{ fontSize: '18px', display: 'block', color: '#FFFFFF', marginTop: '6px' }}>Systemic Valve Fracture</strong>
              <p style={{ fontSize: '11px', color: '#FECACA', marginTop: '4px' }}>Preventative pipe replacement</p>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '14px', color: 'var(--color-text-inverse-muted)', maxWidth: '640px', margin: '0 auto' }}>
              Instead of sending 12 separate technicians to unclog individual taps, authorities execute <strong>1 targeted root repair</strong> that permanently solves the issue for all 450 households.
            </p>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          07. CIVIC INTELLIGENCE MAP PREVIEW (Where are problems happening?)
          ========================================================================== */}
      <section className="section-spacing">
        <div className="container">
          <div className="section-header">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="category-pill">GEOSPATIAL WARD INTELLIGENCE</span>
                <h2 style={{ marginTop: '6px' }}>Where Are Problems Happening?</h2>
                <p>Real-time cluster density and emerging municipal hotspots across pilot wards.</p>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {['ALL', 'WATER', 'ROADS', 'SANITATION', 'ELECTRICITY'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setMapCategory(cat)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '11px',
                      fontWeight: mapCategory === cat ? 700 : 500,
                      background: mapCategory === cat ? 'var(--color-primary)' : '#F1F5F9',
                      color: mapCategory === cat ? '#FFFFFF' : 'var(--color-text-secondary)',
                      transition: 'all 150ms ease'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Map Visual Container */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '24px',
            alignItems: 'start'
          }}>
            {/* Left Column (8 Cols): Simulated Ward Hotspot Canvas */}
            <div
              className="card"
              style={{
                gridColumn: 'span 8',
                padding: '28px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-xl)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
                  <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                    Delhi NCT Ward Cluster Matrix
                  </strong>
                </div>
                <span className="category-pill" style={{ background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA' }}>
                  Emerging This Week
                </span>
              </div>

              {/* Interactive Ward Grid Pins */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '12px',
                marginBottom: '20px'
              }}>
                {filteredMapWards.map((w, idx) => (
                  <div
                    key={w.ward}
                    onClick={() => setActiveWardIndex(idx)}
                    style={{
                      padding: '16px',
                      borderRadius: 'var(--radius-md)',
                      background: activeWardIndex === idx ? '#F0FDF4' : '#F8F9FA',
                      border: activeWardIndex === idx ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                        {w.category}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: 'var(--radius-full)',
                        background: w.severity === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB',
                        color: w.severity === 'CRITICAL' ? '#991B1B' : '#92400E'
                      }}>
                        {w.severity}
                      </span>
                    </div>

                    <strong style={{ fontSize: '13px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                      {w.ward}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)', display: 'block' }}>
                      {w.hotspotName}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid rgba(15,23,42,0.06)' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)' }}>
                        {w.reports} Active Reports
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {w.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid var(--color-divider)' }}>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Click any ward to inspect live root-cause diagnosis.
                </span>
                <Link to="/admin" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Open Full Municipal GIS Explorer</span>
                  <ArrowRight style={{ width: '13px', height: '13px' }} />
                </Link>
              </div>
            </div>

            {/* Right Column (4 Cols): Selected Ward Detail Panel */}
            <div
              className="card"
              style={{
                gridColumn: 'span 4',
                padding: '24px',
                background: '#FFFFFF',
                borderRadius: 'var(--radius-xl)'
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Ward Action Intelligence
              </span>
              <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                {activeWard.ward}
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '16px' }}>
                {activeWard.hotspotName}
              </p>

              <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>
                  Required Municipal Intervention:
                </span>
                <strong style={{ fontSize: '13px', color: 'var(--color-primary)' }}>
                  {activeWard.actionRequired}
                </strong>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Total Reports Linked:</span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{activeWard.reports}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Jurisdiction Status:</span>
                  <strong style={{ color: '#D97706' }}>{activeWard.status}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Target Resolution:</span>
                  <strong style={{ color: 'var(--color-primary)' }}>Within 12 Hours</strong>
                </div>
              </div>

              <Link to={`/officer/complaints/DL-2026-W14-0892`} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                <span>Inspect Work Order</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          08 & 09. EVIDENCE-BACKED RECOMMENDATION (With Signature "Why?" Pattern)
          ========================================================================== */}
      <section className="section-spacing" style={{ background: '#FFFFFF', borderTop: '1px solid var(--color-divider)', borderBottom: '1px solid var(--color-divider)' }}>
        <div className="container">
          <div style={{ maxWidth: '940px', margin: '0 auto' }}>
            <div className="section-header center">
              <span className="category-pill" style={{ marginBottom: '12px' }}>
                EXPLAINABLE DECISION SUPPORT
              </span>
              <h2>Evidence-Backed Recommendation</h2>
              <p>
                JanSahayak never operates as an opaque black box. Every recommendation is anchored in historical evidence and requires human officer authorization.
              </p>
            </div>

            {/* Signature Resolution Intelligence Card */}
            <div
              className="card"
              style={{
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid rgba(14, 94, 58, 0.25)',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F9FDFB 100%)',
                boxShadow: 'var(--shadow-card-hover)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#E8F7F0', color: '#0E5E3A', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Wrench style={{ width: '16px', height: '16px' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-primary)' }}>
                      Resolution Intelligence
                    </span>
                    <h3 style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                      Ticket #DL-2026-W14-0892 (Contaminated Drinking Water)
                    </h3>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: 'var(--radius-full)', background: '#FEF2F2', color: '#991B1B' }}>
                    Critical Priority
                  </span>
                  <WhyExplainer
                    label="Why This Action?"
                    title="Why Inspect Local Supply Clamp?"
                    reasons={[
                      '17 related complaints logged within 400m in 72 hours',
                      '3 previous valve failures documented in 1988 pipeline segment',
                      'Contamination lab test verified biological sewage infiltration',
                      'Standard Operating Procedure DJB-SOP-14 specifies clamp replacement'
                    ]}
                    align="right"
                  />
                </div>
              </div>

              {/* Recommendation Statement */}
              <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F0FDF4', border: '1px solid #BBF7D0', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#166534', display: 'block', marginBottom: '4px' }}>
                  Recommended Next Action:
                </span>
                <strong style={{ fontSize: '15px', color: '#14532D', lineHeight: 1.5, display: 'block' }}>
                  "Inspect and excavate the 100mm main valve clamp at Mother Dairy junction prior to localized street repaving."
                </strong>
              </div>

              {/* Supporting Evidence Pills */}
              <div style={{ marginBottom: '24px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                  Supporting Evidence:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span className="evidence-pill">
                    <FileText style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                    <span>17 Similar Cases Linked</span>
                  </span>
                  <span className="evidence-pill">
                    <ShieldCheck style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                    <span>DJB Emergency SOP #14</span>
                  </span>
                  <span className="evidence-pill">
                    <History style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                    <span>Oct 2025 Precedent Resolved in 14h</span>
                  </span>
                  <span className="evidence-pill">
                    <MapPin style={{ width: '13px', height: '13px', color: 'var(--color-primary)' }} />
                    <span>Spatial Cluster #CL-W14-WATER</span>
                  </span>
                </div>
              </div>

              {/* Officer Decision Buttons (Human-in-the-Loop) */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '18px', borderTop: '1px solid var(--color-divider)', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Link to="/officer" className="btn-primary btn-sm" style={{ background: 'var(--color-primary)' }}>
                    <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                    <span>Approve Recommendation</span>
                  </Link>

                  <Link to="/officer" className="btn-secondary btn-sm">
                    <Sliders style={{ width: '14px', height: '14px' }} />
                    <span>Modify SOP</span>
                  </Link>

                  <Link to="/officer" className="btn-secondary btn-sm">
                    <span>Request More Evidence</span>
                  </Link>
                </div>

                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                  AI suggests. Authorized human officers decide.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================================================
          10. RESOLUTION VERIFICATION (Is Your Problem Actually Solved?)
          ========================================================================== */}
      <section className="section-spacing">
        <div className="container">
          <div style={{ maxWidth: '860px', margin: '0 auto' }}>
            <div className="section-header center">
              <span className="category-pill" style={{ marginBottom: '12px' }}>
                CLOSED-LOOP ACCOUNTABILITY
              </span>
              <h2>Resolution Verification</h2>
              <p>
                Government action is only half the journey. JanSahayak puts the final closure power into the hands of the citizen who reported the problem.
              </p>
            </div>

            {/* Visual Verification Showcase */}
            <div
              className="card"
              style={{
                padding: '32px',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid #10B981',
                background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FDF9 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <strong style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  Ticket #DL-2026-W14-0892: Repair Completed
                </strong>
                <span className="category-pill" style={{ background: '#ECFDF5', color: '#065F46' }}>
                  Awaiting Citizen Confirmation
                </span>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
                marginBottom: '20px'
              }}>
                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', border: '1px solid var(--color-border-subtle)' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    1. Original Citizen Problem
                  </span>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-primary)', fontStyle: 'italic', margin: 0 }}>
                    "Bhai pichle 3 din se ganda badbudaar paani supply mein mix hoke aa raha hai near Mother Dairy..."
                  </p>
                </div>

                <div style={{ padding: '14px', borderRadius: 'var(--radius-md)', background: '#ECFDF5', border: '1px solid #A7F3D0' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#065F46', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                    2. Field Crew Resolution Evidence
                  </span>
                  <p style={{ fontSize: '13px', color: '#065F46', fontWeight: 500, margin: 0 }}>
                    "Repair team excavated junction, replaced fractured 100mm cast-iron valve clamp, flushed line and chlorine levels tested normal."
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px', borderTop: '1px solid rgba(15,23,42,0.06)', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Link to="/citizen/complaints/DL-2026-W14-0892" className="btn-primary btn-sm" style={{ background: '#10B981', color: '#FFFFFF' }}>
                    <CheckCircle2 style={{ width: '14px', height: '14px' }} />
                    <span>Yes, It's Fixed</span>
                  </Link>

                  <Link to="/citizen/complaints/DL-2026-W14-0892" className="btn-secondary btn-sm" style={{ color: '#991B1B', borderColor: '#FCA5A5' }}>
                    <span>No, The Problem Remains</span>
                  </Link>
                </div>

                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  If disputed, the ticket automatically escalates to the Superintending Engineer.
                </span>
              </div>
            </div>
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
              <Link to="/citizen/submit" className="btn-primary" style={{ background: 'var(--color-accent)', color: '#0B1914', fontWeight: 700 }}>
                <span>Report a Problem Now</span>
                <ArrowRight className="btn-arrow" style={{ width: '16px', height: '16px' }} />
              </Link>

              <Link to="/officer" className="btn-secondary" style={{ background: 'rgba(255,255,255,0.08)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.18)' }}>
                <span>Explore Officer Workspace</span>
                <ArrowUpRight style={{ width: '16px', height: '16px' }} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
