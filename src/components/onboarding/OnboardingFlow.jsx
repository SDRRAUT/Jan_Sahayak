import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  User, 
  ShieldCheck,
  Activity, 
  Zap,
  Lock,
  Mail
} from 'lucide-react';
import { useApp, DEMO_CREDENTIALS, DEMO_USERS } from '../../context/AppContext';
import complaintKeyImg from '../../assets/complaint-key.jpg';
import onboardingBg from '../../assets/onboarding-bg.jpg';

export default function OnboardingFlow({ onComplete }) {
  const navigate = useNavigate();
  const { switchDemoRole, enterApp } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Persona Selection State for Step 4
  const [selectedRole, setSelectedRole] = useState('citizen');
  
  // 3-Second Verification Simulation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStageMessage, setVerifyStageMessage] = useState('');

  // Role definitions for Step 4
  const roleOptions = [
    {
      key: 'citizen',
      label: 'Citizen',
      name: 'Aditya Verma',
      badge: 'Ward 14 (Rohini)',
      email: DEMO_CREDENTIALS.citizen.email,
      password: DEMO_CREDENTIALS.citizen.password,
      icon: User,
      color: '#2563EB',
      bg: '#EFF6FF',
      activeBorder: '#2563EB'
    },
    {
      key: 'civic_officer',
      label: 'Govt Officer',
      name: 'Er. Sanjay Sharma',
      badge: 'Field Engineer (DJB)',
      email: DEMO_CREDENTIALS.civic_officer.email,
      password: DEMO_CREDENTIALS.civic_officer.password,
      icon: Briefcase,
      color: '#059669',
      bg: '#ECFDF5',
      activeBorder: '#059669'
    },
    {
      key: 'super_admin',
      label: 'Administrator / Admin',
      name: 'Dr. Meenakshi, IAS',
      badge: 'Municipal Head / Boss',
      email: DEMO_CREDENTIALS.super_admin.email,
      password: DEMO_CREDENTIALS.super_admin.password,
      icon: ShieldCheck,
      color: '#4338CA',
      bg: '#EEF2FF',
      activeBorder: '#4338CA'
    }
  ];

  const currentRoleData = roleOptions.find(r => r.key === selectedRole) || roleOptions[0];

  // 3-Second Credential Verification Sequence
  const trigger3SecondAuth = (targetRoleKey) => {
    const roleKey = targetRoleKey || selectedRole;
    setIsVerifying(true);
    setVerifyProgress(15);
    setVerifyStageMessage('Checking credentials in Delhi Municipal Auth Directory...');

    // Phase 1: 0.9s
    const t1 = setTimeout(() => {
      setVerifyProgress(55);
      const roleLabel = DEMO_USERS[roleKey]?.designation || roleKey.replace('_', ' ').toUpperCase();
      setVerifyStageMessage(`Verifying security clearance & jurisdiction for ${roleLabel}...`);
    }, 900);

    // Phase 2: 2.0s
    const t2 = setTimeout(() => {
      setVerifyProgress(88);
      setVerifyStageMessage('Cryptographic token granted. Preparing role workspace...');
    }, 2000);

    // Phase 3: 3.0s -> Complete & Navigate
    const t3 = setTimeout(async () => {
      setVerifyProgress(100);
      setVerifyStageMessage('Access Granted! Redirecting...');

      try {
        await switchDemoRole(roleKey);
      } catch (err) {
        console.warn('Auto auth sequence fallback:', err);
      }

      if (enterApp) enterApp();
      if (onComplete) onComplete();

      if (roleKey === 'citizen') {
        navigate('/citizen');
      } else if (roleKey === 'civic_officer' || roleKey === 'officer' || roleKey === 'dept_admin') {
        navigate('/officer');
      } else if (roleKey === 'super_admin') {
        navigate('/admin/super');
      } else {
        navigate('/');
      }
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      trigger3SecondAuth(selectedRole);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleRoleCardClick = (roleKey) => {
    setSelectedRole(roleKey);
  };

  const handleLoginClick = () => {
    trigger3SecondAuth(selectedRole);
  };

  const handleDirectEnter = () => {
    if (enterApp) enterApp();
    if (onComplete) onComplete();
    navigate('/');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      backgroundColor: '#0F172A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Crisp, clear background image with 50% opacity (NO blur) */}
      <div 
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${onboardingBg})`,
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.50,
          zIndex: 1,
          pointerEvents: 'none'
        }} 
      />

      {/* Central Single-Screen Non-Scrollable Card */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 60px -10px rgba(15, 23, 42, 0.45)',
        padding: '18px 24px 16px 24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2,
        overflow: 'hidden',
        boxSizing: 'border-box'
      }}>

        {/* Top Header: Website Logo + Brand + Direct App Entry */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBottom: '10px',
          marginBottom: '10px',
          borderBottom: '1px solid #F1F5F9'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak Logo" 
              style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
            />
            <div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#1E2653', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                JanSahayak
              </div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
                AI Civic Resolution Platform
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDirectEnter}
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '999px',
              padding: '4px 12px',
              fontSize: '11.5px',
              fontWeight: 700,
              color: '#3B52D4',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 150ms ease'
            }}
            title="Enter platform directly as public guest"
          >
            <span>Enter App</span>
            <ArrowRight style={{ width: '12px', height: '12px' }} />
          </button>
        </div>

        {/* 3-Second Security Clearance Simulation Overlay (Step 4) */}
        {isVerifying && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(255, 255, 255, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            zIndex: 50,
            textAlign: 'center'
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: '#EFF6FF',
              color: '#3B52D4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
              boxShadow: '0 0 0 8px rgba(59, 82, 212, 0.12)'
            }}>
              <Activity className="animate-spin" style={{ width: '26px', height: '26px' }} />
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: '#3B52D4',
              background: '#EFF6FF',
              padding: '3px 10px',
              borderRadius: '999px',
              marginBottom: '10px'
            }}>
              SECURITY CLEARANCE CHECK
            </span>

            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
              Authenticating {currentRoleData.label.toUpperCase()}...
            </h3>

            <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '400px', minHeight: '34px', lineHeight: 1.4, marginBottom: '16px' }}>
              {verifyStageMessage}
            </p>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              maxWidth: '300px',
              height: '7px',
              background: '#E2E8F0',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '8px'
            }}>
              <div style={{
                height: '100%',
                width: `${verifyProgress}%`,
                background: 'linear-gradient(90deg, #3B52D4 0%, #10B981 100%)',
                borderRadius: '999px',
                transition: 'width 500ms ease-in-out'
              }} />
            </div>

            <span style={{ fontSize: '11px', color: '#94A3B8', fontFamily: 'monospace' }}>
              Delhi Municipal Directory Auth ({verifyProgress}%)
            </span>
          </div>
        )}

        {/* =====================================================================
            SCREEN 1: GROUND REALITY (Problem + Image)
            ===================================================================== */}
        {currentStep === 1 && (
          <div>
            {/* Top Visual: Framed Civic Collage Image */}
            <div style={{
              width: '100%',
              height: '160px',
              borderRadius: '14px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
              border: '1px solid #E2E8F0',
              marginBottom: '12px'
            }}>
              <img 
                src={complaintKeyImg} 
                alt="Citizen Complaint" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block'
                }} 
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '12px',
                background: 'rgba(15, 23, 42, 0.90)',
                padding: '3px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FFFFFF'
              }}>
                📍 Delhi Municipal Ground Reality
              </div>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '8px 12px',
                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15, 23, 42, 0.85) 100%)',
                color: '#FFFFFF',
                fontSize: '11px',
                display: 'flex',
                gap: '8px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <span>Toote Raste</span> • <span>Ganda Paani</span> • <span>Kooda Dher</span> • <span>Dark Spots</span>
              </div>
            </div>

            {/* Headline & Description */}
            <div style={{ textAlign: 'center', padding: '0 6px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E2653', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                Asli Samasya: Complaints Gayab Kyun Hoti Hain?
              </h2>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 auto', maxWidth: '480px' }}>
                Har din toote raste, gande paani aur koodedaano se hum sab joojhte hain. 
                Lekin 10 alag departments aur duplicate tickets ke dher mein aam naagrik ki awaaz dab jaati hai.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            SCREEN 2: AI CIVIC INTELLIGENCE (How We Address It)
            ===================================================================== */}
        {currentStep === 2 && (
          <div>
            {/* Top Visual: Modern 3-Step AI Pipeline Banner */}
            <div style={{
              width: '100%',
              height: '160px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #F0FDF4 0%, #EFF6FF 100%)',
              border: '1px solid #BFDBFE',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '12px 14px',
              boxSizing: 'border-box',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                {/* Stage 1 */}
                <div style={{ flex: 1, background: '#FFFFFF', padding: '8px 6px', borderRadius: '12px', border: '1px solid #BBF7D0', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '18px', marginBottom: '2px' }}>🎙️</div>
                  <strong style={{ fontSize: '11px', display: 'block', color: '#166534' }}>Voice & Photo</strong>
                  <span style={{ fontSize: '9.5px', color: '#64748B' }}>No complex forms</span>
                </div>
                <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: '13px' }}>➔</div>

                {/* Stage 2 */}
                <div style={{ flex: 1.1, background: '#FFFFFF', padding: '8px 6px', borderRadius: '12px', border: '1px solid #BFDBFE', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '18px', marginBottom: '2px' }}>🧬</div>
                  <strong style={{ fontSize: '11px', display: 'block', color: '#1D4ED8' }}>Complaint DNA</strong>
                  <span style={{ fontSize: '9.5px', color: '#64748B' }}>Ward + Biohazard</span>
                </div>
                <div style={{ color: '#94A3B8', fontWeight: 700, fontSize: '13px' }}>➔</div>

                {/* Stage 3 */}
                <div style={{ flex: 1.1, background: '#FFFFFF', padding: '8px 6px', borderRadius: '12px', border: '1px solid #E9D5FF', textAlign: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
                  <div style={{ fontSize: '18px', marginBottom: '2px' }}>🔗</div>
                  <strong style={{ fontSize: '11px', display: 'block', color: '#7E22CE' }}>Smart Clustering</strong>
                  <span style={{ fontSize: '9.5px', color: '#64748B' }}>15 calls = 1 incident</span>
                </div>
              </div>

              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#2563EB', background: '#DBEAFE', padding: '2px 8px', borderRadius: '999px' }}>
                  ⚡ Zero Duplicate Backlog • Instant Ground Mapping
                </span>
              </div>
            </div>

            {/* Headline & Description */}
            <div style={{ textAlign: 'center', padding: '0 6px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E2653', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                Hum AI Se Ise Kaise Solve Karte Hain?
              </h2>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 auto', maxWidth: '480px' }}>
                Citizen bas Hindi/Hinglish mein bol kar ya photo bhej kar shikayat karta hai. 
                AI turant Complaint DNA banata hai aur mohalle ke duplicate tickets ko 1 unified incident mein link kar deta hai.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            SCREEN 3: AUTHORITY HANDOVER (Actionable Resolution)
            ===================================================================== */}
        {currentStep === 3 && (
          <div>
            {/* Top Visual: Authority Work Order Card */}
            <div style={{
              width: '100%',
              height: '160px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #F8FAFC 0%, #ECFDF5 100%)',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: '12px 14px',
              boxSizing: 'border-box',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                <div style={{ background: '#FFFFFF', padding: '8px 6px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                    <Building2 style={{ width: '15px', height: '15px' }} />
                  </div>
                  <strong style={{ fontSize: '11px', display: 'block', color: '#0F172A' }}>Auto-Routing</strong>
                  <span style={{ fontSize: '9.5px', color: '#64748B' }}>Direct to DJB/PWD</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '8px 6px', borderRadius: '12px', border: '1px solid #BBF7D0', textAlign: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                    <Zap style={{ width: '15px', height: '15px' }} />
                  </div>
                  <strong style={{ fontSize: '11px', display: 'block', color: '#047857' }}>1-Click SOP</strong>
                  <span style={{ fontSize: '9.5px', color: '#64748B' }}>Pre-computed fix</span>
                </div>

                <div style={{ background: '#FFFFFF', padding: '8px 6px', borderRadius: '12px', border: '1px solid #FED7AA', textAlign: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#FFF7ED', color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                    <CheckCircle2 style={{ width: '15px', height: '15px' }} />
                  </div>
                  <strong style={{ fontSize: '11px', display: 'block', color: '#9A3412' }}>Citizen Verify</strong>
                  <span style={{ fontSize: '9.5px', color: '#64748B' }}>Closed-loop closure</span>
                </div>
              </div>

              <div style={{ marginTop: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 700, color: '#047857', background: '#DCFCE7', padding: '2px 8px', borderRadius: '999px' }}>
                  ⏱️ 12-Hour SLA Timer • On-Ground Photo Verification Mandatory
                </span>
              </div>
            </div>

            {/* Headline & Description */}
            <div style={{ textAlign: 'center', padding: '0 6px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1E2653', marginBottom: '6px', letterSpacing: '-0.02em' }}>
                Solution Ke Saath Authorities Ko Handover
              </h2>
              <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, margin: '0 auto', maxWidth: '480px' }}>
                Right department ke field officer ko ready-to-execute work order milta hai jo wo 1-click mein approve karta hai. 
                Kaam ke baad photo aati hai aur citizen verification ke baad hi ticket close hota hai.
              </p>
            </div>
          </div>
        )}

        {/* =====================================================================
            SCREEN 4: ROLE SELECTION & 3-SECOND DEMO AUTHENTICATION
            ===================================================================== */}
        {currentStep === 4 && (
          <div>
            {/* Top Area: Compact 3-Persona Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '8px',
              marginBottom: '10px'
            }}>
              {roleOptions.map((item) => {
                const Icon = item.icon;
                const isSelected = selectedRole === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => setSelectedRole(item.key)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${item.activeBorder}` : '1px solid #E2E8F0',
                      background: isSelected ? item.bg : '#F8FAFC',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 150ms ease'
                    }}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: isSelected ? '#FFFFFF' : '#E2E8F0',
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 4px auto'
                    }}>
                      <Icon style={{ width: '16px', height: '16px' }} />
                    </div>
                    <strong style={{ fontSize: '12px', display: 'block', color: '#0F172A' }}>{item.label}</strong>
                    <span style={{ fontSize: '9.5px', color: '#64748B', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Username & Password Form Fields (Pre-filled for seamless 1-click test) */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '10px 14px',
              marginBottom: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Mail style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9.5px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Username / Email</span>
                  <input 
                    type="text" 
                    readOnly 
                    value={currentRoleData.email} 
                    style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', padding: 0 }}
                  />
                </div>
                <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700, background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px' }}>Demo ID</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Lock style={{ width: '14px', height: '14px', color: '#94A3B8' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9.5px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Password</span>
                  <input 
                    type="password" 
                    readOnly 
                    value={currentRoleData.password} 
                    style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '12px', fontWeight: 600, color: '#0F172A', outline: 'none', padding: 0 }}
                  />
                </div>
                <span style={{ fontSize: '10px', color: '#64748B', fontFamily: 'monospace' }}>••••••••</span>
              </div>
            </div>

            {/* Selected Persona Action Box */}
            <div style={{ textAlign: 'center', padding: '0 6px' }}>
              <button
                type="button"
                onClick={() => trigger3SecondAuth(selectedRole)}
                style={{
                  height: '42px',
                  padding: '0 24px',
                  borderRadius: '999px',
                  background: '#1E2653',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(30, 38, 83, 0.35)',
                  transition: 'transform 150ms ease'
                }}
              >
                <span>⚡ 1-Click Demo Login as {currentRoleData.label} (3s Check)</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>
            </div>
          </div>
        )}

        {/* =====================================================================
            BOTTOM NAVIGATION BAR (Matching the Reference Image exactly)
            ===================================================================== */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '14px',
          paddingTop: '12px',
          borderTop: '1px solid #F1F5F9'
        }}>
          {/* Bottom Left: Circular Back Button (visible from Step 2) */}
          <div style={{ width: '44px', height: '44px' }}>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                aria-label="Previous slide"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#F1F5F9',
                  border: 'none',
                  color: '#1E2653',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                <ArrowLeft style={{ width: '18px', height: '18px' }} />
              </button>
            )}
          </div>

          {/* Center: Pagination Dots + Skip link */}
          <div style={{ textAlign: 'center' }}>
            {/* Dots Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '3px' }}>
              {[1, 2, 3, 4].map((step) => (
                <button
                  key={step}
                  type="button"
                  onClick={() => setCurrentStep(step)}
                  aria-label={`Jump to step ${step}`}
                  style={{
                    width: currentStep === step ? '18px' : '7px',
                    height: '7px',
                    borderRadius: '999px',
                    background: currentStep === step ? '#1E2653' : '#CBD5E1',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    transition: 'all 200ms ease'
                  }}
                />
              ))}
            </div>

            {/* Skip Link */}
            <button
              type="button"
              onClick={handleSkip}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '12.5px',
                fontWeight: 600,
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '2px 8px'
              }}
            >
              {currentStep < 4 ? 'Skip' : 'Enter Public View'}
            </button>
          </div>

          {/* Bottom Right: Circular Next Button */}
          <div style={{ width: '44px', height: '44px' }}>
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => Math.min(4, prev + 1))}
                aria-label="Next slide"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#1E2653',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(30, 38, 83, 0.35)',
                  transition: 'transform 150ms ease'
                }}
              >
                <ArrowRight style={{ width: '18px', height: '18px' }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => trigger3SecondAuth(selectedRole)}
                aria-label="Enter portal"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#10B981',
                  border: 'none',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
                  transition: 'transform 150ms ease'
                }}
                title="1-Click Login"
              >
                <CheckCircle2 style={{ width: '20px', height: '20px' }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
