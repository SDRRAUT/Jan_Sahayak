import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, token } = useApp();
  const location = useLocation();

  // 1. Unauthenticated -> Redirect to Login
  if (!token || !user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // 2. Unauthorized Role -> Render Official 403 Forbidden Screen
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
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

            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              Your current account (<strong>{user.name}</strong>, Role: <code style={{ background: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{user.role}</code>) does not possess the requisite security clearance to access this module.
              <br />
              Required Role: <strong>{allowedRoles.join(' or ')}</strong>.
            </p>

            <div style={{ padding: '12px', borderRadius: 'var(--radius-md)', background: '#F8F9FA', fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
              Audit logged: Attempted access to <code>{location.pathname}</code> from IP ::1 at {new Date().toLocaleTimeString()}.
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn-primary btn-sm">
                Switch to an Authorized Role
              </Link>
              <Link to="/" className="btn-secondary btn-sm">
                <ArrowLeft style={{ width: '14px', height: '14px' }} />
                <span>Return to Public Site</span>
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
