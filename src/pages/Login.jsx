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
  ShieldCheck 
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

  const redirectPath = new URLSearchParams(location.search).get('redirect') || null;

  const handleRoleRedirect = (role) => {
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    if (role === 'citizen') navigate('/citizen');
    else if (role === 'officer') navigate('/officer');
    else if (role === 'dept_admin') navigate('/admin/department');
    else if (role === 'super_admin') navigate('/admin/super');
    else navigate('/');
  };

  const handleQuickDemoLogin = async (roleKey) => {
    try {
      const loggedUser = await switchDemoRole(roleKey);
      handleRoleRedirect(loggedUser.role);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      const loggedUser = await login(email, password);
      handleRoleRedirect(loggedUser.role);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="section-spacing" style={{ paddingTop: '32px' }}>
      <div className="container" style={{ maxWidth: '980px' }}>
        {/* Header */}
        <div className="section-header center" style={{ marginBottom: '36px' }}>
          <div className="category-pill">OFFICIAL CIVIC AUTHENTICATION</div>
          <h2>JanSahayk Citizen & Authority Gateway</h2>
          <p>
            Secure, role-based access verified by Delhi Municipal Administration & National Informatics Standards.
          </p>
        </div>

        {/* 1-Click Role Switcher Demo Cards (Mandatory for rapid hackathon testing) */}
        <div style={{ marginBottom: '36px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '12px', textAlign: 'center' }}>
            ⚡ 1-Click Persona Authentication (Instant Role Access):
          </span>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '14px'
          }}>
            {/* Role 1: Citizen */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('citizen')}
              className="card card-interactive"
              style={{
                padding: '16px',
                textAlign: 'left',
                border: '1px solid rgba(14, 94, 58, 0.2)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div className="icon-squircle" style={{ width: '28px', height: '28px' }}>
                  <User style={{ width: '14px', height: '14px' }} />
                </div>
                <strong style={{ fontSize: '13px', color: 'var(--color-primary)' }}>Citizen Role</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Aditya Verma (Ward 14)
              </p>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                File, track, & reopen complaints
              </span>
            </button>

            {/* Role 2: Officer */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('officer')}
              className="card card-interactive"
              style={{
                padding: '16px',
                textAlign: 'left',
                border: '1px solid rgba(14, 94, 58, 0.2)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div className="icon-squircle" style={{ width: '28px', height: '28px' }}>
                  <Briefcase style={{ width: '14px', height: '14px' }} />
                </div>
                <strong style={{ fontSize: '13px', color: 'var(--color-primary)' }}>Govt Officer</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Er. Sanjay Sharma (AEE - DJB)
              </p>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                AI brief, RAG SOPs, & dispatch
              </span>
            </button>

            {/* Role 3: Dept Admin */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('dept_admin')}
              className="card card-interactive"
              style={{
                padding: '16px',
                textAlign: 'left',
                border: '1px solid rgba(14, 94, 58, 0.2)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div className="icon-squircle" style={{ width: '28px', height: '28px' }}>
                  <Building2 style={{ width: '14px', height: '14px' }} />
                </div>
                <strong style={{ fontSize: '13px', color: 'var(--color-primary)' }}>Dept Admin</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Chief Engineer (DJB Dept)
              </p>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                SLA health, workload, & recurring
              </span>
            </button>

            {/* Role 4: Super Admin */}
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('super_admin')}
              className="card card-interactive"
              style={{
                padding: '16px',
                textAlign: 'left',
                border: '1px solid rgba(14, 94, 58, 0.2)',
                background: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <div className="icon-squircle" style={{ width: '28px', height: '28px' }}>
                  <ShieldCheck style={{ width: '14px', height: '14px' }} />
                </div>
                <strong style={{ fontSize: '13px', color: 'var(--color-primary)' }}>Super Admin</strong>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                Principal Secretary (IAS)
              </p>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Audit logs, SLA rules, & depts
              </span>
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
