import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles, Heart, Globe, ArrowUpRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Footer() {
  const { user, role } = useApp();
  return (
    <footer
      style={{
        background: 'var(--color-surface-inset-dark)',
        padding: '80px 0 36px 0',
        color: 'var(--color-text-inverse)',
        position: 'relative',
        overflow: 'hidden',
        marginTop: '96px',
        borderTop: '1px solid var(--color-border-dark)'
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Top brand & columns grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '40px',
            marginBottom: '64px'
          }}
        >
          {/* Brand Col */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img 
                src="/logo.png" 
                alt="JanSahayak Official Logo" 
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 2px 10px rgba(0, 0, 0, 0.4))'
                }} 
              />
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF' }}>JanSahayak</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-accent)' }}>Aapki Awaaz, Ab Samjhi Jayegi</p>
              </div>
            </div>
            <p
              style={{
                fontSize: '14px',
                color: 'var(--color-text-inverse-muted)',
                lineHeight: 1.6,
                maxWidth: '380px',
                marginBottom: '20px'
              }}
            >
              India’s public grievance intelligence platform. Translating unstructured citizen voice and text into structured insights, connected evidence, and actionable resolution recommendations.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <span className="status-dot active"></span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#10B981' }}>Multilingual Citizen Access (22 Languages)</span>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '16px' }}>
              Platform
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--color-text-inverse-muted)' }}>
              <Link to="/platform" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                Grievance DNA™
              </Link>
              <Link to="/platform" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                Multilingual Voice Engine
              </Link>
              <Link to="/platform" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                RAG Resolution Precedents
              </Link>
              <Link to="/impact" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                Public Impact
              </Link>
            </div>
          </div>

          {/* Col 2: Role Portals */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '16px' }}>
              {role ? `${role.replace('_', ' ').toUpperCase()} PORTAL` : 'PORTALS'}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--color-text-inverse-muted)' }}>
              {role === 'citizen' && (
                <>
                  <Link to="/citizen" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    My Grievances
                  </Link>
                  <Link to="/citizen/submit" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    File New Complaint
                  </Link>
                </>
              )}

              {role === 'officer' && (
                <>
                  <Link to="/officer" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Officer Triage Workspace
                  </Link>
                  <Link to="/admin" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Ward Heatmap
                  </Link>
                  <Link to="/intelligence" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Civic Intelligence
                  </Link>
                </>
              )}

              {role === 'dept_admin' && (
                <>
                  <Link to="/admin/department" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Department Health & SLA
                  </Link>
                  <Link to="/officer" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Officer Rosters
                  </Link>
                  <Link to="/admin" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Geospatial Heatmap
                  </Link>
                </>
              )}

              {role === 'super_admin' && (
                <>
                  <Link to="/admin/super" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Super Admin Console
                  </Link>
                  <Link to="/admin/department" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Departments Directory
                  </Link>
                  <Link to="/officer" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Officer Workspace
                  </Link>
                </>
              )}

              {!user && (
                <>
                  <Link to="/citizen/submit" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Citizen Grievance Portal
                  </Link>
                  <Link to="/login" style={{ transition: 'color 150ms ease' }} onMouseEnter={e => e.target.style.color='#fff'} onMouseLeave={e => e.target.style.color='var(--color-text-inverse-muted)'}>
                    Official Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Col 3: Governance & Compliance */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#FFFFFF', marginBottom: '16px' }}>
              Governance
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', color: 'var(--color-text-inverse-muted)' }}>
              <span style={{ color: 'var(--color-text-inverse-muted)' }}>DPDP Act 2023 Compliant</span>
              <span style={{ color: 'var(--color-text-inverse-muted)' }}>CPGRAMS Interoperability</span>
              <span style={{ color: 'var(--color-text-inverse-muted)' }}>Open Government Data API</span>
              <span style={{ color: 'var(--color-text-inverse-muted)' }}>Zero Citizen Dead-End Guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            paddingTop: '28px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            fontSize: '13px',
            color: 'var(--color-text-inverse-muted)'
          }}
        >
          <div>
            © 2026 JanSahayak. Public Grievance Intelligence Platform.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#10B981', fontWeight: 600 }}>Closed-Loop Civic Governance</span>
          </div>
        </div>
      </div>

      {/* Subtle Brand Watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: '-15px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '110px',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          color: '#FFFFFF',
          opacity: 0.03,
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          zIndex: 1
        }}
      >
        JANSAHAYK AI-04
      </div>
    </footer>
  );
}
