import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Plus, 
  User, 
  Briefcase, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  BarChart3, 
  LogIn 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import FileGrievanceModal from '../common/FileGrievanceModal';
import UserProfileModal from '../common/UserProfileModal';

export default function MobileBottomNav() {
  const location = useLocation();
  const { user, role } = useApp();
  const activeRole = role || user?.role;

  const [showFileGrievanceModal, setShowFileGrievanceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Determine persona-specific configuration
  let navItems = [];
  let accentColor = '#0E5E3A';
  let pillBg = 'rgba(14, 94, 58, 0.12)';

  if (!user) {
    // ─── Guest / Unauthenticated ──────────────────────────────────────────
    accentColor = '#0E5E3A';
    pillBg = 'rgba(14, 94, 58, 0.12)';
    navItems = [
      {
        id: 'home',
        label: 'Home',
        to: '/',
        icon: Home,
        isActive: location.pathname === '/'
      },
      {
        id: 'tour',
        label: 'Tour',
        to: '/onboarding',
        icon: Sparkles,
        isActive: location.pathname === '/onboarding'
      },
      {
        id: 'impact',
        label: 'Impact',
        to: '/impact',
        icon: BarChart3,
        isActive: location.pathname === '/impact'
      },
      {
        id: 'login',
        label: 'Login',
        to: '/login',
        icon: LogIn,
        isActive: location.pathname === '/login'
      }
    ];
  } else if (activeRole === 'citizen') {
    // ─── Citizen ──────────────────────────────────────────────────────────
    accentColor = '#0E5E3A';
    pillBg = 'rgba(14, 94, 58, 0.12)';
    navItems = [
      {
        id: 'home',
        label: 'Home',
        to: '/',
        icon: Home,
        isActive: location.pathname === '/'
      },
      {
        id: 'grievances',
        label: 'Grievances',
        to: '/citizen',
        icon: FileText,
        isActive: location.pathname.startsWith('/citizen') && location.pathname !== '/citizen/submit'
      },
      {
        id: 'report',
        label: '+ Report',
        isAction: true,
        onClick: () => setShowFileGrievanceModal(true),
        icon: Plus,
        isProminent: true,
        isActive: showFileGrievanceModal || location.pathname === '/citizen/submit'
      },
      {
        id: 'profile',
        label: 'Profile',
        isAction: true,
        onClick: () => setShowProfileModal(true),
        icon: User,
        isActive: showProfileModal
      }
    ];
  } else if (activeRole === 'civic_officer' || activeRole === 'officer' || activeRole === 'dept_admin') {
    // ─── Civic Officer / Dept Admin ───────────────────────────────────────
    accentColor = '#059669';
    pillBg = 'rgba(5, 150, 105, 0.14)';
    navItems = [
      {
        id: 'workspace',
        label: 'Workspace',
        to: '/officer',
        icon: Briefcase,
        isActive: location.pathname === '/officer' && !location.search.includes('operations')
      },
      {
        id: 'operations',
        label: 'Operations',
        to: '/officer?section=operations',
        icon: Layers,
        isActive: location.pathname === '/admin/department' || (location.pathname === '/officer' && location.search.includes('operations'))
      },
      {
        id: 'heatmap',
        label: 'Heatmap',
        to: '/admin',
        icon: MapPin,
        isActive: location.pathname === '/admin'
      },
      {
        id: 'profile',
        label: 'Profile',
        isAction: true,
        onClick: () => setShowProfileModal(true),
        icon: User,
        isActive: showProfileModal
      }
    ];
  } else if (activeRole === 'super_admin') {
    // ─── Super Admin ──────────────────────────────────────────────────────
    accentColor = '#4338CA';
    pillBg = 'rgba(67, 56, 202, 0.14)';
    navItems = [
      {
        id: 'console',
        label: 'Console',
        to: '/admin/super',
        icon: ShieldCheck,
        isActive: location.pathname === '/admin/super'
      },
      {
        id: 'workspace',
        label: 'Workspace',
        to: '/officer',
        icon: Briefcase,
        isActive: location.pathname.startsWith('/officer')
      },
      {
        id: 'heatmap',
        label: 'Heatmap',
        to: '/admin',
        icon: MapPin,
        isActive: location.pathname === '/admin'
      },
      {
        id: 'profile',
        label: 'Profile',
        isAction: true,
        onClick: () => setShowProfileModal(true),
        icon: User,
        isActive: showProfileModal
      }
    ];
  }

  const commonItemStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '2px 0',
    minHeight: '48px',
    minWidth: 0,
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    transition: 'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)'
  };

  return (
    <>
      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile navigation"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid #E2E8F0',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
          paddingTop: '6px',
          paddingBottom: 'env(safe-area-inset-bottom, 8px)',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
        {navItems.map((item) => {
          if (item.isProminent) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`mobile-nav-btn mobile-nav-btn-prominent ${item.isActive ? 'active' : ''}`}
                style={commonItemStyle}
                aria-label="File a Grievance"
              >
                <div
                  style={{
                    width: '46px',
                    height: '28px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0E5E3A 0%, #10B981 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 10px rgba(14, 94, 58, 0.32)',
                    marginBottom: '2px',
                    transform: item.isActive ? 'scale(1.06) translateY(-2px)' : 'translateY(-1px)',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <Plus style={{ width: '18px', height: '18px', color: '#FFFFFF', strokeWidth: 2.6 }} />
                </div>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    color: '#0E5E3A',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.2
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          const itemContent = (
            <>
              <div
                className="mobile-nav-pill"
                style={{
                  width: '48px',
                  height: '28px',
                  borderRadius: '14px',
                  background: item.isActive ? pillBg : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2px',
                  transform: item.isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <item.icon
                  style={{
                    width: '20px',
                    height: '20px',
                    color: item.isActive ? accentColor : '#64748B',
                    transition: 'color 0.2s ease',
                    strokeWidth: item.isActive ? 2.2 : 1.8
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '10.5px',
                  fontWeight: item.isActive ? 700 : 500,
                  color: item.isActive ? accentColor : '#64748B',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease'
                }}
              >
                {item.label}
              </span>
            </>
          );

          if (item.isAction) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className={`mobile-nav-btn ${item.isActive ? 'active' : ''}`}
                style={commonItemStyle}
                aria-label={item.label}
              >
                {itemContent}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.to}
              className={`mobile-nav-btn ${item.isActive ? 'active' : ''}`}
              style={commonItemStyle}
              aria-label={item.label}
            >
              {itemContent}
            </Link>
          );
        })}
      </nav>

      {/* File Grievance Modal Triggered via Citizen Mobile Bottom Nav */}
      <FileGrievanceModal
        isOpen={showFileGrievanceModal}
        onClose={() => setShowFileGrievanceModal(false)}
      />

      {/* Universal User Profile & Account Settings Modal Triggered via Mobile Bottom Nav */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
