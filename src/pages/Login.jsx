import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Shield, 
  Lock, 
  Mail, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound, 
  User, 
  Briefcase, 
  Building2, 
  ShieldCheck,
  Sparkles,
  Activity
} from 'lucide-react';
import { useApp, DEMO_CREDENTIALS } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, switchDemoRole, authError, isLoadingAuth } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [localError, setLocalError] = useState('');

  // 3-Second Credential Verification Simulation State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyRole, setVerifyRole] = useState('');
  const [verifyProgress, setVerifyProgress] = useState(0);
  const [verifyMessage, setVerifyMessage] = useState('');

  const redirectPath = new URLSearchParams(location.search).get('redirect') || null;

  const handleRoleRedirect = (role) => {
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    if (role === 'citizen') navigate('/citizen');
    else if (role === 'civic_officer' || role === 'officer' || role === 'dept_admin') navigate('/officer');
    else if (role === 'super_admin') navigate('/admin/super');
    else navigate('/');
  };

  const execute3SecondLogin = (roleKey, customEmail, customPassword) => {
    setIsVerifying(true);
    setVerifyRole(roleKey || 'portal');
    setVerifyProgress(15);
    setVerifyMessage('Checking credentials with Delhi Municipal Directory...');
    setLocalError('');

    const t1 = setTimeout(() => {
      setVerifyProgress(52);
      const label = roleKey ? roleKey.replace('_', ' ').toUpperCase() : 'USER';
      setVerifyMessage(`Validating jurisdictional authorization & security clearance for ${label}...`);
    }, 1000);

    const t2 = setTimeout(() => {
      setVerifyProgress(88);
      setVerifyMessage('Cryptographic token granted. Preparing role workspace...');
    }, 2000);

    const t3 = setTimeout(async () => {
      setVerifyProgress(100);
      setVerifyMessage('Access Granted! Redirecting to dashboard...');
      try {
        let loggedUser;
        if (customEmail && customPassword) {
          loggedUser = await login(customEmail, customPassword);
        } else {
          loggedUser = await switchDemoRole(roleKey);
        }
        setTimeout(() => {
          handleRoleRedirect(loggedUser?.role || roleKey);
        }, 300);
      } catch (err) {
        setIsVerifying(false);
        setLocalError(err.message || 'Authentication error.');
      }
    }, 3000);
  };

  const handleQuickDemoLogin = (roleKey) => {
    const cred = DEMO_CREDENTIALS[roleKey];
    if (cred) {
      setEmail(cred.email);
      setPassword(cred.password);
    }
    execute3SecondLogin(roleKey);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    // Infer role from email or default to citizen
    let inferredRole = 'citizen';
    if (email.includes('djb') || email.includes('officer') || email.includes('civic') || email.includes('admin.djb') || email.includes('dept')) inferredRole = 'civic_officer';
    if (email.includes('superadmin') || email.includes('ias')) inferredRole = 'super_admin';

    execute3SecondLogin(inferredRole, email, password);
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '32px', position: 'relative' }}>
      {/* 3-Second Verification Simulation Modal Overlay */}
      {isVerifying && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '480px',
            width: '100%',
            padding: '36px 28px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-modal)',
            border: '1px solid rgba(14, 94, 58, 0.2)'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: '#E8F7F0',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 0 0 8px rgba(14, 94, 58, 0.08)'
            }}>
              <Activity className="animate-spin" style={{ width: '28px', height: '28px' }} />
            </div>

            <div className="category-pill" style={{ marginBottom: '10px' }}>
              SECURITY CLEARANCE CHECK
            </div>

            <h3 style={{ fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '8px' }}>
              Authenticating {verifyRole.replace('_', ' ').toUpperCase()}...
            </h3>

            <p style={{ fontSize: '13.5px', color: 'var(--color-text-secondary)', marginBottom: '22px', minHeight: '38px', lineHeight: 1.5 }}>
              {verifyMessage}
            </p>

            {/* Progress Bar */}
            <div style={{
              width: '100%',
              height: '8px',
              background: '#E2E8F0',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '10px'
            }}>
              <div style={{
                height: '100%',
                width: `${verifyProgress}%`,
                background: 'linear-gradient(90deg, #0E5E3A 0%, #10B981 100%)',
                borderRadius: '999px',
                transition: 'width 500ms ease-in-out'
              }} />
            </div>

            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
              Simulating Delhi Municipal Directory Authorization ({verifyProgress}%)
            </span>
          </div>
        </div>
      )}

      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Onboarding Tour Banner */}
        <div style={{
          marginBottom: '28px',
          padding: '16px 22px',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(135deg, #0E5E3A 0%, #166534 100%)',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 4px 14px rgba(14, 94, 58, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles style={{ width: '20px', height: '20px', color: '#86EFAC' }} />
            </div>
            <div>
              <strong style={{ fontSize: '14px', display: 'block', letterSpacing: '0.01em' }}>
                New to JanSahayak? Experience the 3-Step Interactive Tour
              </strong>
              <span style={{ fontSize: '12px', color: '#DCFCE7' }}>
                Ground Reality Problems ➔ AI Complaint DNA ➔ Direct Authority Handover & Solutions
              </span>
            </div>
          </div>

          <Link
            to="/onboarding"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              background: '#FFFFFF',
              color: '#0E5E3A',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <span>Start 3-Step Tour</span>
            <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>

        {/* Header */}
        <div className="section-header center" style={{ marginBottom: '36px' }}>
          <img 
            src="/logo.png" 
            alt="JanSahayak Official Logo" 
            style={{ 
              height: '76px', 
              width: 'auto', 
              margin: '0 auto 16px auto', 
              display: 'block',
              filter: 'drop-shadow(0 4px 14px rgba(14, 94, 58, 0.18))' 
            }} 
          />
          <div className="category-pill">OFFICIAL ACCESS</div>
          <h2>JanSahayak Portal Access</h2>
          <p>
            Secure, role-based access for citizens, municipal officers, and department administrators.
          </p>
        </div>

        {/* 1-Click Role Switcher Demo Cards */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '12px', textAlign: 'center' }}>
            Select Persona to Access Portal (Prototype Environment):
          </span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px'
          }}>
            {/* Role 1: Citizen */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('citizen')}
              className="card card-interactive"
              style={{
                padding: '18px',
                textAlign: 'left',
                border: '1px solid rgba(14, 94, 58, 0.2)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="icon-squircle" style={{ width: '32px', height: '32px', background: 'var(--color-accent-tint)' }}>
                  <User style={{ width: '16px', height: '16px', color: 'var(--color-primary)' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--color-primary)', display: 'block' }}>Citizen</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Public Reporting & Tracking</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Aditya Verma (Ward 14) • File, track, upvote & verify grievance resolution.
              </p>
            </button>

            {/* Role 2: Government Officer */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('civic_officer')}
              className="card card-interactive"
              style={{
                padding: '18px',
                textAlign: 'left',
                border: '1px solid rgba(14, 94, 58, 0.2)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="icon-squircle" style={{ width: '32px', height: '32px', background: '#ECFDF5' }}>
                  <Briefcase style={{ width: '16px', height: '16px', color: '#065F46' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#065F46', display: 'block' }}>👷 Government Officer</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Field Work & Issue Solving</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Er. Sanjay Sharma (Field Engineer) • Ground visits, repair works, SOP approvals & resolving complaints.
              </p>
            </button>

            {/* Role 3: Administrator / Admin */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('super_admin')}
              className="card card-interactive"
              style={{
                padding: '18px',
                textAlign: 'left',
                border: '1px solid rgba(67, 56, 202, 0.2)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div className="icon-squircle" style={{ width: '32px', height: '32px', background: '#EEF2FF' }}>
                  <ShieldCheck style={{ width: '16px', height: '16px', color: '#4338CA' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#4338CA', display: 'block' }}>🛡️ Administrator / Admin</strong>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Municipal Boss & Citywide Head</span>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.4 }}>
                Dr. Meenakshi Sundaram, IAS • Department audits, citywide performance monitoring & overall governance.
              </p>
            </button>
          </div>
        </div>

        {/* Credentials Form Box */}
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <form onSubmit={handleSubmit} className="card" style={{ padding: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px' }}>Sign In to Portal</h3>
              <button
                type="button"
                onClick={() => setUseOtp(!useOtp)}
                style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600 }}
              >
                {useOtp ? 'Use Password' : 'Use Mobile OTP'}
              </button>
            </div>

            {(localError || authError) && (
              <div style={{ padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                <AlertCircle style={{ width: '14px', height: '14px' }} />
                <span>{localError || authError}</span>
              </div>
            )}

            {/* Email / Mobile Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                Official Email or Mobile (+91)
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '14px', width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. aditya@citizen.in or sanjay.sharma@djb.gov.in"
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-medium)',
                    paddingLeft: '38px',
                    paddingRight: '12px',
                    fontSize: '13px',
                    background: '#FFFFFF'
                  }}
                  required
                />
              </div>
            </div>

            {/* Password or OTP */}
            {!useOtp ? (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  Secure Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ position: 'absolute', left: '12px', top: '14px', width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    style={{
                      width: '100%',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)',
                      paddingLeft: '38px',
                      paddingRight: '12px',
                      fontSize: '13px',
                      background: '#FFFFFF'
                    }}
                    required
                  />
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
                  6-Digit OTP Verification
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="e.g. 948201"
                    style={{
                      flex: 1,
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--color-border-medium)',
                      padding: '0 12px',
                      fontSize: '14px',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(true);
                      setOtpCode('948201');
                    }}
                    className="btn-secondary btn-sm"
                  >
                    {otpSent ? 'Resend' : 'Send OTP'}
                  </button>
                </div>
                {otpSent && (
                  <span style={{ fontSize: '11px', color: '#059669', marginTop: '4px', display: 'block' }}>
                    ✓ Simulated OTP auto-filled: 948201
                  </span>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoadingAuth}
              className="btn-primary"
              style={{ width: '100%', height: '48px', fontSize: '14px' }}
            >
              {isLoadingAuth ? 'Authenticating...' : 'Sign In with Secure Clearance'}
            </button>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
              New Citizen?{' '}
              <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                Register Free Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
