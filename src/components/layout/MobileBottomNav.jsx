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
  LogIn,
  Wrench,
  Building2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import FileGrievanceModal from '../common/FileGrievanceModal';
import UserProfileModal from '../common/UserProfileModal';

/**
 * MobileBottomNav
 * 
 * Recreates the premium, minimalist mobile navigation bar inspired by the reference design:
 * - Crisp white elevated surface with soft rounded top corners (28px)
 * - Symmetrical 5-destination layout: [Tab 1] [Tab 2] ( + Elevated FAB ) [Tab 4] [Tab 5]
 * - Prominent circular Floating Action Button (FAB) in the center with a vibrant brand gradient,
 *   crisp white ring bezel, luminous drop shadow, and smooth spring press animation
 * - Micro-typography and balanced icon/label hierarchy
 * - Integrated iOS-style Home Indicator pill at the bottom
 * - Full safe-area inset awareness (env(safe-area-inset-bottom))
 * - Role-tailored destinations for Citizen, Officer, Super Admin, and Guest
 */
export default function MobileBottomNav() {
  const location = useLocation();
  const { user, role } = useApp();
  const activeRole = role || user?.role;

  const [showFileGrievanceModal, setShowFileGrievanceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Brand color theming based on active persona
  let accentColor = '#0E5E3A'; // Signature Civic Emerald
  let fabGradient = 'linear-gradient(135deg, #10B981 0%, #0E5E3A 100%)';
  let fabShadow = '0 8px 24px rgba(14, 94, 58, 0.38)';
  let activePillBg = 'rgba(14, 94, 58, 0.08)';

  if (activeRole === 'civic_officer' || activeRole === 'officer' || activeRole === 'dept_admin') {
    accentColor = '#059669';
    fabGradient = 'linear-gradient(135deg, #34D399 0%, #059669 100%)';
    fabShadow = '0 8px 24px rgba(5, 150, 105, 0.38)';
    activePillBg = 'rgba(5, 150, 105, 0.09)';
  } else if (activeRole === 'super_admin') {
    accentColor = '#4338CA';
    fabGradient = 'linear-gradient(135deg, #6366F1 0%, #4338CA 100%)';
    fabShadow = '0 8px 24px rgba(67, 56, 202, 0.38)';
    activePillBg = 'rgba(67, 56, 202, 0.09)';
  }

  // 5-destination navigation items per persona (Left 2, Center FAB, Right 2)
  let leftItems = [];
  let centerFab = null;
  let rightItems = [];

  if (!user) {
    // ─── Guest / Unauthenticated ──────────────────────────────────────────
    leftItems = [
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
      }
    ];

    centerFab = {
      id: 'report',
      label: 'Report',
      onClick: () => setShowFileGrievanceModal(true),
      icon: Plus,
      ariaLabel: 'File Grievance'
    };

    rightItems = [
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
    leftItems = [
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
      }
    ];

    centerFab = {
      id: 'report',
      label: 'Report',
      onClick: () => setShowFileGrievanceModal(true),
      icon: Plus,
      ariaLabel: 'File a New Grievance'
    };

    rightItems = [
      {
        id: 'workers',
        label: 'Workers',
        to: '/citizen/find-worker',
        icon: Wrench,
        isActive: location.pathname === '/citizen/find-worker' || location.pathname === '/worker'
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
    leftItems = [
      {
        id: 'intelligence',
        label: 'Intelligence',
        to: '/intelligence',
        icon: Sparkles,
        isActive: location.pathname.startsWith('/intelligence')
      },
      {
        id: 'workspace',
        label: 'Workspace',
        to: '/officer',
        icon: Briefcase,
        isActive: location.pathname === '/officer' && !location.search.includes('operations')
      }
    ];

    centerFab = {
      id: 'report',
      label: 'New Action',
      onClick: () => setShowFileGrievanceModal(true),
      icon: Plus,
      ariaLabel: 'New Civic Incident Report'
    };

    rightItems = [
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
    leftItems = [
      {
        id: 'console',
        label: 'Command',
        to: '/admin/super',
        icon: ShieldCheck,
        isActive: location.pathname === '/admin/super' && (!location.search || !location.search.includes('tab=departments'))
      },
      {
        id: 'departments',
        label: 'Depts & Staff',
        to: '/admin/super?tab=departments',
        icon: Building2,
        isActive: location.pathname === '/admin/super' && location.search.includes('tab=departments')
      }
    ];

    centerFab = {
      id: 'report',
      label: 'Alert',
      onClick: () => setShowFileGrievanceModal(true),
      icon: Plus,
      ariaLabel: 'Broadcast Civic Action'
    };

    rightItems = [
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

  // Render a standard destination item (Left or Right)
  const renderItem = (item) => {
    const itemContent = (
      <div 
        className="mobile-nav-item-inner"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 6px',
          position: 'relative',
          transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Soft rounded active pill / halo backdrop inspired by reference design */}
        <div
          className="mobile-nav-icon-container"
          style={{
            width: '42px',
            height: '28px',
            borderRadius: '14px',
            background: item.isActive ? activePillBg : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '3px',
            transform: item.isActive ? 'scale(1.04)' : 'scale(1)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <item.icon
            style={{
              width: '21px',
              height: '21px',
              color: item.isActive ? accentColor : '#94A3B8',
              strokeWidth: item.isActive ? 2.4 : 1.8,
              transition: 'color 0.2s ease, stroke-width 0.2s ease'
            }}
          />
        </div>

        {/* Micro-label with refined typography */}
        <span
          className="mobile-nav-label"
          style={{
            fontSize: '11px',
            fontWeight: item.isActive ? 600 : 500,
            color: item.isActive ? accentColor : '#64748B',
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            whiteSpace: 'nowrap',
            transition: 'color 0.2s ease'
          }}
        >
          {item.label}
        </span>
      </div>
    );

    const buttonStyle = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px 0',
      minHeight: '48px',
      textDecoration: 'none',
      WebkitTapHighlightColor: 'transparent'
    };

    if (item.isAction) {
      return (
        <button
          key={item.id}
          type="button"
          onClick={item.onClick}
          className={`mobile-nav-tab-btn ${item.isActive ? 'active' : ''}`}
          style={buttonStyle}
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
        className={`mobile-nav-tab-btn ${item.isActive ? 'active' : ''}`}
        style={buttonStyle}
        aria-label={item.label}
      >
        {itemContent}
      </Link>
    );
  };

  return (
    <>
      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile navigation bar"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          borderTop: '1px solid rgba(226, 232, 240, 0.85)',
          boxShadow: '0 -8px 30px rgba(15, 23, 42, 0.08), 0 -1px 3px rgba(15, 23, 42, 0.03)',
          paddingTop: '6px',
          paddingBottom: 'max(env(safe-area-inset-bottom, 8px), 8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box'
        }}
      >
        {/* Main Tab Bar Row with Center Elevated FAB */}
        <div
          className="mobile-nav-bar-row"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: '6px',
            paddingRight: '6px',
            boxSizing: 'border-box'
          }}
        >
          {/* Left 2 Destinations */}
          <div style={{ display: 'flex', flex: 2, alignItems: 'center', justifyContent: 'space-around' }}>
            {leftItems.map(renderItem)}
          </div>

          {/* Center Elevated Floating Action Button (FAB) */}
          {centerFab && (
            <div
              className="mobile-nav-center-slot"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                flex: 1,
                minWidth: '56px'
              }}
            >
              <button
                type="button"
                onClick={centerFab.onClick}
                className="mobile-nav-center-fab"
                aria-label={centerFab.ariaLabel || centerFab.label}
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: fabGradient,
                  border: '3.5px solid #FFFFFF',
                  boxShadow: `${fabShadow}, 0 0 0 1px rgba(226, 232, 240, 0.4)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transform: 'translateY(-16px)',
                  transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s ease',
                  WebkitTapHighlightColor: 'transparent',
                  padding: 0
                }}
              >
                <centerFab.icon
                  style={{
                    width: '24px',
                    height: '24px',
                    color: '#FFFFFF',
                    strokeWidth: 2.6
                  }}
                />
              </button>
            </div>
          )}

          {/* Right 2 Destinations */}
          <div style={{ display: 'flex', flex: 2, alignItems: 'center', justifyContent: 'space-around' }}>
            {rightItems.map(renderItem)}
          </div>
        </div>

        {/* Integrated iOS-Style Home Indicator Bar (as in reference design) */}
        <div
          className="mobile-home-indicator"
          aria-hidden="true"
          style={{
            width: '134px',
            height: '4.5px',
            borderRadius: '100px',
            backgroundColor: '#CBD5E1',
            marginTop: '4px',
            marginBottom: '2px',
            opacity: 0.85
          }}
        />
      </nav>

      {/* File Grievance Modal Triggered via Center Floating Action Button */}
      <FileGrievanceModal
        isOpen={showFileGrievanceModal}
        onClose={() => setShowFileGrievanceModal(false)}
      />

      {/* Universal User Profile & Account Settings Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
}
