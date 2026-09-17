import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token, switchDemoRole } = useApp();
  const location = useLocation();

  // 1. Unauthenticated -> Redirect to Home (login is via modal on home page)
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // 2. Role Authorization (Civic Officer inherits both officer and dept_admin permissions)
  const userRole = user?.role?.toLowerCase() || '';
  const effectiveRoles = [userRole];
  if (userRole === 'civic_officer') {
    effectiveRoles.push('officer', 'dept_admin');
  } else if (userRole === 'officer' || userRole === 'dept_admin') {
    effectiveRoles.push('civic_officer');
  }

  const isAuthorized = allowedRoles.length === 0 || allowedRoles.some(r => effectiveRoles.includes(r.toLowerCase()));

  if (!isAuthorized) {
    return (
      <div className="section-spacing" style={{ paddingTop: '64px' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div className="card" style={{ padding: '48px 36px', textAlign: 'center', border: '1px solid #FECACA', background: '#FFFDFD' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: '#FEF2F2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <Lock style={{ width: '28px', height: '28px' }} />
            </div>

            <div className="category-pill" style={{ background: '#FEF2F2', color: '#991B1B', borderColor: '#FECACA', marginBottom: '12px' }}>
              403 ACCESS RESTRICTED • CIVIC SECURITY
            </div>

            <h2 style={{ fontSize: '26px', color: '#0F172A', marginBottom: '12px' }}>
              Administrative Clearance Required
            </h2>

            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
              Your current account (<strong>{user.name}</strong>, Role: <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{user.role}</code>) does not possess the requisite security clearance to access this module.
              <br />
              Required Role: <strong>{allowedRoles.join(' or ')}</strong>.
            </p>

            <div style={{ marginBottom: '24px', padding: '16px', background: '#F8FAFC', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-muted)', display: 'block', marginBottom: '10px' }}>
                Switch Persona to Enter:
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => switchDemoRole('citizen')}
                  className="btn-secondary btn-sm"
                  style={{ fontSize: '11.5px' }}
                >
                  👤 Citizen
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoRole('civic_officer')}
                  className="btn-secondary btn-sm"
                  style={{ fontSize: '11.5px' }}
                >
                  🏛️ Civic Officer
                </button>
                <button
                  type="button"
                  onClick={() => switchDemoRole('super_admin')}
                  className="btn-secondary btn-sm"
                  style={{ fontSize: '11.5px' }}
                >
                  🛡️ Super Admin
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn-primary btn-sm">
                Login with Different Account
              </Link>
              <Link to="/" className="btn-secondary btn-sm">
                <ArrowLeft style={{ width: '14px', height: '14px' }} />
                <span>Return to My Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized -> Render children
  return children;
}
