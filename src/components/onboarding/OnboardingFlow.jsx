import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  Briefcase, 
  User, 
  Lock, 
  Mail, 
  Clock, 
  ShieldCheck,
  Activity, 
  Zap
} from 'lucide-react';
import { useApp, DEMO_CREDENTIALS, DEMO_USERS } from '../../context/AppContext';
import citizenBg from '../../assets/citizen-bg.jpg';

export default function OnboardingFlow({ onComplete }) {
  const navigate = useNavigate();
  const { switchDemoRole } = useApp();

  const [currentStep, setCurrentStep] = useState(1);

  // Authentication & Demo Simulation States
  const [selectedRole, setSelectedRole] = useState('citizen');
  const [email, setEmail] = useState(DEMO_CREDENTIALS.citizen.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.citizen.password);
  
  // 3-Second Verification Simulation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyStageMessage, setVerifyStageMessage] = useState('');
  const [authError, setAuthError] = useState('');

  // Update credentials when role card changes
  const handleSelectRole = (roleKey) => {
    setSelectedRole(roleKey);
    const cred = DEMO_CREDENTIALS[roleKey];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
    }
  };

  // 3-Second Realistic Credential Verification Sequence
  const trigger3SecondAuth = (targetRoleKey) => {
    const roleKey = targetRoleKey || selectedRole;
    setIsVerifying(true);
    setVerifyProgress(10);
    setVerifyStageMessage('Contacting Delhi Municipal Auth Directory...');
    setAuthError('');

    // Phase 1: 0.8s
    const t1 = setTimeout(() => {
      setVerifyProgress(45);
      const roleLabel = DEMO_USERS[roleKey]?.designation || roleKey.replace('_', ' ').toUpperCase();
      setVerifyStageMessage(`Verifying security credentials & jurisdiction for ${roleLabel}...`);
    }, 900);

    // Phase 2: 2.0s
    const t2 = setTimeout(() => {
      setVerifyProgress(85);
      setVerifyStageMessage('Cryptographic clearance authorized. Generating session token...');
    }, 2000);

    // Phase 3: 3.0s -> Complete & Navigate
    const t3 = setTimeout(async () => {
      setVerifyProgress(100);
      setVerifyStageMessage('Login Successful! Entering dedicated workspace...');

      try {
        const logged = await switchDemoRole(roleKey);
        const target = logged?.role || roleKey;
        
        setTimeout(() => {
          if (onComplete) onComplete();
          if (target === 'citizen') navigate('/citizen');
          else if (target === 'officer') navigate('/officer');
          else if (target === 'dept_admin') navigate('/admin/department');
          else if (target === 'super_admin') navigate('/admin/super');
          else navigate('/');
        }, 400);
      } catch (err) {
        setIsVerifying(false);
        setAuthError('Authentication failed. Please try again.');
      }
    }, 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    trigger3SecondAuth(selectedRole);
  };

  return (
    <div style={{
      maxWidth: '1040px',
      margin: '0 auto',
      padding: '24px 16px',
      fontFamily: 'var(--font-sans)'
    }}>
      {/* Stepper Progress Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '28px',
        padding: '16px 20px',
        background: '#FFFFFF',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border-subtle)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-primary)' }}>
            GUIDED SYSTEM TOUR & DEMO
          </span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>• Step {currentStep} of 4</span>
        </div>

        {/* Dots / Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { step: 1, label: '01 The Problem' },
            { step: 2, label: '02 AI Intelligence' },
            { step: 3, label: '03 Authority Handover' },
            { step: 4, label: '04 Role Access' }
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => !isVerifying && setCurrentStep(item.step)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: currentStep === item.step ? 'var(--color-primary)' : currentStep > item.step ? '#E8F7F0' : '#F1F5F9',
                color: currentStep === item.step ? '#FFFFFF' : currentStep > item.step ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontSize: '11.5px',
                fontWeight: currentStep === item.step ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              <span>{item.step}</span>
              <span className="hide-on-mobile">{item.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          SCREEN 1: THE REAL PROBLEM (Asli Ground Reality)
          ========================================================================= */}
      {currentStep === 1 && (
        <div className="card" style={{ padding: '36px', background: '#FFFFFF', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px auto' }}>
            <div className="category-pill" style={{ background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA', marginBottom: '12px' }}>
              STEP 1: GROUND REALITY
            </div>
            <h2 style={{ fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
              Asli Samasya Kya Hai? (What's Broken on Ground)
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Har din hum sabhi toote raste, gande paani ki supply, kooda aur andheri galiyon se joojhte hain. 
              Lekin complaint darj karne ke baad <strong>shikayat gayab ho jaati hai</strong> aur koi zimmedari nahi leta.
            </p>
          </div>

          {/* User's Uploaded Civic Collage Image Display */}
          <div style={{
            position: 'relative',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            border: '1px solid var(--color-border-medium)',
            marginBottom: '32px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <img 
              src={citizenBg} 
              alt="Real Civic Problems Across Delhi" 
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '380px',
                objectFit: 'cover',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px 20px',
              background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(15, 23, 42, 0.88) 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>
                📍 Real Everyday Problems: Damaged Roads • Water Contamination • Stray Garbage • Blackouts
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '4px' }}>
                Ground Truth Capture
              </span>
            </div>
          </div>

          {/* 4 Core Pain Points in Plain Simple Language */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🕳️</div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Sadak Ke Khatarnaak Gaddhe
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Baarish ke baad road dhans jaati hai, do-pahia gaadiyan girti hain aur roz accident ka khatra bana rehta hai.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚰</div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Ganda & Badbudaar Paani
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Pipe leakage ki wajah se naali ka ganda paani drinking line mein milta hai, jisse poori colony mein bimari failti hai.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>🗑️</div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Open Dhalav & Kooda
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Market ke samne kooda kai dino tak nahi uthta, badboo failti hai aur aam logo ka nikalna mushkil ho jaata hai.
              </p>
            </div>

            <div style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>💡</div>
              <strong style={{ fontSize: '14px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Dark Spots & Streetlights
              </strong>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.5 }}>
                Mahilaon aur buzurgon ke liye raat mein sadak par chalna unsafe hota hai kyunki feeder lines hafton band rehti hain.
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-primary"
              style={{ height: '48px', padding: '0 28px', fontSize: '14px' }}
            >
              <span>See How We Address It (AI Intelligence)</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: HOW WE ADDRESS IT USING AI INTELLIGENCE
          ========================================================================= */}
      {currentStep === 2 && (
        <div className="card" style={{ padding: '36px', background: '#FFFFFF', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px auto' }}>
            <div className="category-pill" style={{ background: '#EEF2FF', color: '#4338CA', borderColor: '#C7D2FE', marginBottom: '12px' }}>
              STEP 2: CIVIC INTELLIGENCE ENGINE
            </div>
            <h2 style={{ fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
              Hum Ise AI Se Kaise Solve Karte Hain?
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Aam citizen ko mushkil official form bharne ki zaroorat nahi hai. Hum <strong>Voice, Hindi/Hinglish, aur Photos</strong> ko AI intelligence mein convert karte hain.
            </p>
          </div>

          {/* Interactive 3-Stage Pipeline Diagram */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            {/* Box 1 */}
            <div style={{
              padding: '22px',
              borderRadius: 'var(--radius-lg)',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#166534', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  1
                </div>
                <strong style={{ fontSize: '15px', color: '#166534' }}>Natural Voice / Multimodal Input</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: '#14532D', lineHeight: 1.5, marginBottom: '14px' }}>
                Citizen bas apni zubaan mein WhatsApp ya mic se bolta hai: <em>"Mother Dairy ke samne pipe toot gaya hai, ganda paani aa raha hai."</em>
              </p>
              <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #BBF7D0', fontSize: '11.5px', color: '#047857' }}>
                🎙️ Audio + Photo + Pincode Auto-Tagged
              </div>
            </div>

            {/* Box 2 */}
            <div style={{
              padding: '22px',
              borderRadius: 'var(--radius-lg)',
              background: '#EFF6FF',
              border: '1px solid #BFDBFE',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#1D4ED8', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  2
                </div>
                <strong style={{ fontSize: '15px', color: '#1D4ED8' }}>Complaint DNA Extraction</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: '#1E3A8A', lineHeight: 1.5, marginBottom: '14px' }}>
                Hamara AI bina human delay ke issue ka DNA bana leta hai: Issue type (Biohazard), Ward (Ward 14), Urgency score (94/100).
              </p>
              <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #BFDBFE', fontSize: '11.5px', color: '#1D4ED8' }}>
                🧬 DNA: Water Contamination • Severity Critical
              </div>
            </div>

            {/* Box 3 */}
            <div style={{
              padding: '22px',
              borderRadius: 'var(--radius-lg)',
              background: '#FAF5FF',
              border: '1px solid #E9D5FF',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#7E22CE', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                  3
                </div>
                <strong style={{ fontSize: '15px', color: '#7E22CE' }}>Spatial Incident Clustering</strong>
              </div>
              <p style={{ fontSize: '12.5px', color: '#581C87', lineHeight: 1.5, marginBottom: '14px' }}>
                Agar ek hi galli se 15 alag log shikayat karein, toh 15 duplicate file nahi banti. AI unhe <strong>1 Single High-Priority Incident</strong> mein jodh deta hai.
              </p>
              <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid #E9D5FF', fontSize: '11.5px', color: '#7E22CE' }}>
                🔗 15 Signals Linked ➔ Zero Duplicate Backlog
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="btn-secondary"
              style={{ height: '48px', padding: '0 24px', fontSize: '14px' }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              <span>Previous Step</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="btn-primary"
              style={{ height: '48px', padding: '0 28px', fontSize: '14px' }}
            >
              <span>See Authority Handover & Solutions</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 3: GIVING ROOT PROBLEM TO AUTHORITIES WITH SOLUTION
          ========================================================================= */}
      {currentStep === 3 && (
        <div className="card" style={{ padding: '36px', background: '#FFFFFF', borderRadius: 'var(--radius-xl)' }}>
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px auto' }}>
            <div className="category-pill" style={{ background: '#ECFDF5', color: '#065F46', borderColor: '#A7F3D0', marginBottom: '12px' }}>
              STEP 3: ACTIONABLE AUTHORITY HANDOVER
            </div>
            <h2 style={{ fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
              Solution Ke Saath Authorities Ko Handover
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Authorities ko sirf samasya nahi milti, balki <strong>AI pre-computed solutions aur field squad SOPs</strong> ke sath direct dispatch karta hai.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
            marginBottom: '32px'
          }}>
            <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Building2 style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Exact Department Auto-Routing
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Koi file passing nahi. Water issue direct Delhi Jal Board (DJB) ko, pothole PWD ko, garbage MCD ko, aur streetlights BSES ko auto-route hoti hain.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Zap style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                Pre-Computed SOPs for Field Officers
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Field Engineer ko ready-to-approve SOP milta hai: <em>"Deploy 100mm valve clamp squad #4 with chlorine test kit"</em>. Officer 1-click mein dispatch kar deta hai.
              </p>
            </div>

            <div style={{ padding: '24px', borderRadius: 'var(--radius-lg)', background: '#F8FAFC', border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#FFF7ED', color: '#C2410C', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Clock style={{ width: '20px', height: '20px' }} />
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '8px', color: 'var(--color-text-primary)' }}>
                12-Hour SLA & Citizen Verification
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Automatic timer chalta hai. Resolution ke baad actual on-site photo aati hai aur jab tak citizen verify nahi karta, case close nahi hota.
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="btn-secondary"
              style={{ height: '48px', padding: '0 24px', fontSize: '14px' }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
              <span>Back to AI Engine</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="btn-primary"
              style={{ height: '48px', padding: '0 28px', fontSize: '14px' }}
            >
              <span>Choose Role & Try 3s Demo Login</span>
              <ArrowRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 4: ROLE SELECTION & 3-SECOND CREDENTIAL AUTHENTICATION
          ========================================================================= */}
      {currentStep === 4 && (
        <div className="card" style={{ padding: '36px', background: '#FFFFFF', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
          
          {/* 3-Second Verification Animated Modal Overlay */}
          {isVerifying && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              zIndex: 50,
              textAlign: 'center'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#E8F7F0',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '20px',
                boxShadow: '0 0 0 8px rgba(14, 94, 58, 0.1)'
              }}>
                <Activity className="animate-spin" style={{ width: '32px', height: '32px' }} />
              </div>

              <div className="category-pill" style={{ marginBottom: '12px' }}>
                SECURITY CLEARANCE VERIFICATION
              </div>

              <h3 style={{ fontSize: '22px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
                Checking Credentials for {selectedRole.replace('_', ' ').toUpperCase()}...
              </h3>

              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', maxWidth: '460px', marginBottom: '24px', minHeight: '40px' }}>
                {verifyStageMessage}
              </p>

              {/* Animated Progress Bar */}
              <div style={{
                width: '100%',
                maxWidth: '380px',
                height: '8px',
                background: '#E2E8F0',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '12px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${verifyProgress}%`,
                  background: 'linear-gradient(90deg, #0E5E3A 0%, #10B981 100%)',
                  borderRadius: '999px',
                  transition: 'width 600ms ease-in-out'
                }} />
              </div>

              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                Simulating Delhi Gov Active Directory Verification ({verifyProgress}%)
              </span>
            </div>
          )}

          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 28px auto' }}>
            <div className="category-pill" style={{ background: '#E8F7F0', color: '#0E5E3A', borderColor: 'rgba(14, 94, 58, 0.2)', marginBottom: '12px' }}>
              STEP 4: ROLE CLEARANCE & ACCESS
            </div>
            <h2 style={{ fontSize: '28px', color: 'var(--color-text-primary)', marginBottom: '12px' }}>
              Select Role & Experience 3-Second Auth
            </h2>
            <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
              Select any role below. You can either enter credentials or click <strong>1-Click Demo Login</strong> to witness the 3-second credential verification simulation.
            </p>
          </div>

          {/* Role Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px',
            marginBottom: '28px'
          }}>
            {/* Role 1: Citizen */}
            <div
              onClick={() => handleSelectRole('citizen')}
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-lg)',
                border: selectedRole === 'citizen' ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)',
                background: selectedRole === 'citizen' ? '#F0FDF4' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: selectedRole === 'citizen' ? '0 4px 12px rgba(14, 94, 58, 0.12)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#E8F7F0', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User style={{ width: '18px', height: '18px' }} />
                </div>
                {selectedRole === 'citizen' && (
                  <span style={{ fontSize: '10.5px', background: 'var(--color-primary)', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    SELECTED
                  </span>
                )}
              </div>
              <strong style={{ fontSize: '14.5px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Citizen
              </strong>
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Aditya Verma (Ward 14)
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSelectRole('citizen'); trigger3SecondAuth('citizen'); }}
                className="btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '11px', marginTop: '6px' }}
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>

            {/* Role 2: Government Officer */}
            <div
              onClick={() => handleSelectRole('officer')}
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-lg)',
                border: selectedRole === 'officer' ? '2px solid #059669' : '1px solid var(--color-border-subtle)',
                background: selectedRole === 'officer' ? '#ECFDF5' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: selectedRole === 'officer' ? '0 4px 12px rgba(5, 150, 105, 0.12)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#DCFCE7', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase style={{ width: '18px', height: '18px' }} />
                </div>
                {selectedRole === 'officer' && (
                  <span style={{ fontSize: '10.5px', background: '#059669', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    SELECTED
                  </span>
                )}
              </div>
              <strong style={{ fontSize: '14.5px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Government Officer
              </strong>
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Er. Sanjay Sharma (AEE DJB)
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSelectRole('officer'); trigger3SecondAuth('officer'); }}
                className="btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '11px', marginTop: '6px' }}
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>

            {/* Role 3: Dept Admin */}
            <div
              onClick={() => handleSelectRole('dept_admin')}
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-lg)',
                border: selectedRole === 'dept_admin' ? '2px solid #0284C7' : '1px solid var(--color-border-subtle)',
                background: selectedRole === 'dept_admin' ? '#F0F9FF' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: selectedRole === 'dept_admin' ? '0 4px 12px rgba(2, 132, 199, 0.12)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 style={{ width: '18px', height: '18px' }} />
                </div>
                {selectedRole === 'dept_admin' && (
                  <span style={{ fontSize: '10.5px', background: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    SELECTED
                  </span>
                )}
              </div>
              <strong style={{ fontSize: '14.5px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Department Admin
              </strong>
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Er. Rajiv Malhotra (Chief Eng.)
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSelectRole('dept_admin'); trigger3SecondAuth('dept_admin'); }}
                className="btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '11px', marginTop: '6px' }}
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>

            {/* Role 4: Super Admin */}
            <div
              onClick={() => handleSelectRole('super_admin')}
              style={{
                padding: '18px',
                borderRadius: 'var(--radius-lg)',
                border: selectedRole === 'super_admin' ? '2px solid #4338CA' : '1px solid var(--color-border-subtle)',
                background: selectedRole === 'super_admin' ? '#EEF2FF' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                boxShadow: selectedRole === 'super_admin' ? '0 4px 12px rgba(67, 56, 202, 0.12)' : 'none'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: '#E0E7FF', color: '#4338CA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck style={{ width: '18px', height: '18px' }} />
                </div>
                {selectedRole === 'super_admin' && (
                  <span style={{ fontSize: '10.5px', background: '#4338CA', color: '#FFFFFF', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                    SELECTED
                  </span>
                )}
              </div>
              <strong style={{ fontSize: '14.5px', display: 'block', color: 'var(--color-text-primary)', marginBottom: '4px' }}>
                Super Admin
              </strong>
              <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Principal Secretary (IAS)
              </span>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleSelectRole('super_admin'); trigger3SecondAuth('super_admin'); }}
                className="btn-secondary btn-sm"
                style={{ width: '100%', fontSize: '11px', marginTop: '6px' }}
              >
                ⚡ 1-Click Demo Login
              </button>
            </div>
          </div>

          {/* Explicit Credentials Form Box */}
          <div style={{
            maxWidth: '480px',
            margin: '0 auto',
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border-subtle)',
            background: '#F8FAFC'
          }}>
            <form onSubmit={handleManualSubmit}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  Selected Account Credentials:
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>
                  Pre-filled for {selectedRole.replace('_', ' ')}
                </span>
              </div>

              {authError && (
                <div style={{ padding: '8px 12px', borderRadius: 'var(--radius-sm)', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '12px', marginBottom: '12px' }}>
                  {authError}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Official Email / Username
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ position: 'absolute', left: '12px', top: '13px', width: '15px', height: '15px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      fontSize: '13px',
                      background: '#FFFFFF'
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                  Secure Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '12px', top: '13px', width: '15px', height: '15px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)',
                      paddingLeft: '36px',
                      paddingRight: '12px',
                      fontSize: '13px',
                      background: '#FFFFFF'
                    }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="btn-primary"
                style={{ width: '100%', height: '46px', fontSize: '14px' }}
              >
                <span>Sign In with 3-Second Credential Check</span>
                <ArrowRight style={{ width: '16px', height: '16px' }} />
              </button>
            </form>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '24px' }}>
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="btn-secondary"
              style={{ height: '44px', padding: '0 20px', fontSize: '13px' }}
            >
              <ArrowLeft style={{ width: '15px', height: '15px' }} />
              <span>Back to Authority Solutions</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
