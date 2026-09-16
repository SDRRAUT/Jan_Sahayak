import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Menu, 
  X, 
  User, 
  Briefcase, 
  Building2, 
  ShieldCheck, 
  LogOut, 
  LogIn,
  Bell,
  Check,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, switchDemoRole, notifications = [], unreadNotificationCount = 0, markNotificationAsRead, markAllNotificationsAsRead } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  // Close notifications on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleSwitch = async (roleKey) => {
    try {
      const logged = await switchDemoRole(roleKey);
      if (logged.role === 'citizen') navigate('/citizen');
      else if (logged.role === 'officer') navigate('/officer');
      else if (logged.role === 'dept_admin') navigate('/admin/department');
      else if (logged.role === 'super_admin') navigate('/admin/super');
    } catch (e) {}
  };

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Platform & AI', path: '/platform' },
    { label: 'Impact & Proof', path: '/impact' }
  ];

  // Add role-specific navigation links
  if (role === 'citizen') {
    navLinks.push({ label: 'Citizen Portal', path: '/citizen' });
  } else if (role === 'officer') {
    navLinks.push({ label: 'Officer Triage', path: '/officer' });
    navLinks.push({ label: 'Ward Heatmap', path: '/admin' });
  } else if (role === 'dept_admin') {
    navLinks.push({ label: 'Dept Console', path: '/admin/department' });
    navLinks.push({ label: 'Ward Heatmap', path: '/admin' });
  } else if (role === 'super_admin') {
    navLinks.push({ label: 'Super Admin', path: '/admin/super' });
    navLinks.push({ label: 'Dept Console', path: '/admin/department' });
    navLinks.push({ label: 'Ward Heatmap', path: '/admin' });
  }

  return (
    <>
      <header
        style={{
          maxWidth: '1180px',
          height: isScrolled ? '54px' : '62px',
          margin: isScrolled ? '8px auto' : '16px auto',
          padding: '0 20px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.90)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
          position: 'sticky',
          top: isScrolled ? '8px' : '16px',
          zIndex: 1000,
          transition: 'all 250ms cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Identity */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '9999px',
            background: 'var(--color-primary)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(14, 94, 58, 0.25)'
          }}>
            <Shield style={{ width: '18px', height: '18px' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: '16px', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
                JanSahayk
              </span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)' }}>
                जनसहायक
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="hidden-mobile">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  background: isActive ? '#F1F5F9' : 'transparent',
                  transition: 'all 150ms ease'
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Quick Role Switcher Cluster & Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 1-Click Role Switcher Pill Group */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#F1F5F9',
            padding: '3px',
            borderRadius: '9999px',
            gap: '2px'
          }} className="hidden-mobile">
            <button
              onClick={() => handleRoleSwitch('citizen')}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '9999px',
                background: role === 'citizen' ? '#FFFFFF' : 'transparent',
                color: role === 'citizen' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: role === 'citizen' ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                transition: 'all 150ms ease'
              }}
              title="Aditya Verma (Citizen)"
            >
              Citizen
            </button>
            <button
              onClick={() => handleRoleSwitch('officer')}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '9999px',
                background: role === 'officer' ? '#FFFFFF' : 'transparent',
                color: role === 'officer' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: role === 'officer' ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                transition: 'all 150ms ease'
              }}
              title="Er. Sanjay Sharma (Officer - DJB)"
            >
              Officer
            </button>
            <button
              onClick={() => handleRoleSwitch('dept_admin')}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '9999px',
                background: role === 'dept_admin' ? '#FFFFFF' : 'transparent',
                color: role === 'dept_admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: role === 'dept_admin' ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                transition: 'all 150ms ease'
              }}
              title="Chief Engineer (Dept Admin - DJB)"
            >
              Dept Admin
            </button>
            <button
              onClick={() => handleRoleSwitch('super_admin')}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: '9999px',
                background: role === 'super_admin' ? '#FFFFFF' : 'transparent',
                color: role === 'super_admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                boxShadow: role === 'super_admin' ? '0 1px 2px rgba(15,23,42,0.08)' : 'none',
                transition: 'all 150ms ease'
              }}
              title="Principal Secretary (Super Admin)"
            >
              Super Admin
            </button>
          </div>

          {/* Notification Bell with Badge & Popover */}
          <div style={{ position: 'relative' }} ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: showNotifications ? '#E2E8F0' : '#F1F5F9',
                border: '1px solid var(--color-border-subtle)',
                color: showNotifications ? 'var(--color-primary)' : '#475569',
                position: 'relative',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              title="Notifications & Alerts"
            >
              <Bell style={{ width: '15px', height: '15px' }} />
              {unreadNotificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '9px',
                  fontWeight: 800,
                  height: '16px',
                  minWidth: '16px',
                  padding: '0 4px',
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #FFFFFF',
                  boxShadow: '0 2px 4px rgba(220, 38, 38, 0.4)'
                }}>
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '42px',
                  right: 0,
                  width: '350px',
                  maxWidth: '90vw',
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1px solid var(--color-border-subtle)',
                  boxShadow: '0 20px 35px -5px rgba(15, 23, 42, 0.15), 0 10px 15px -5px rgba(15, 23, 42, 0.08)',
                  zIndex: 1200,
                  overflow: 'hidden'
                }}
              >
                {/* Popover Header */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      Notifications
                    </span>
                    {unreadNotificationCount > 0 && (
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '9999px',
                        background: '#FEE2E2',
                        color: '#DC2626',
                        fontWeight: 700
                      }}>
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      onClick={() => markAllNotificationsAsRead()}
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-primary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Check style={{ width: '12px', height: '12px' }} />
                      Mark all read
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                  {notifications.filter(n => {
                    if (role === 'super_admin') return true;
                    if (n.userId && n.userId === user?.id) return true;
                    if (n.userRole && n.userRole === role) return true;
                    if (role === 'dept_admin' && n.userRole === 'officer') return true;
                    return false;
                  }).length === 0 ? (
                    <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                      <Bell style={{ width: '28px', height: '28px', margin: '0 auto 8px', opacity: 0.3 }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>All caught up!</p>
                      <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#94A3B8' }}>No notifications at this time.</p>
                    </div>
                  ) : (
                    notifications.filter(n => {
                      if (role === 'super_admin') return true;
                      if (n.userId && n.userId === user?.id) return true;
                      if (n.userRole && n.userRole === role) return true;
                      if (role === 'dept_admin' && n.userRole === 'officer') return true;
                      return false;
                    }).map((n) => {
                      const getIcon = () => {
                        if (n.type === 'RESOLVED') return <CheckCircle2 style={{ width: '14px', height: '14px', color: '#10B981' }} />;
                        if (n.type === 'ESCALATION' || n.type === 'SLA_ALERT' || n.type === 'DISPUTE_REOPENED') return <AlertTriangle style={{ width: '14px', height: '14px', color: '#F59E0B' }} />;
                        if (n.type === 'INFO_REQUEST' || n.type === 'INFO_RESPONSE') return <MessageSquare style={{ width: '14px', height: '14px', color: '#3B82F6' }} />;
                        if (n.type === 'AI_ANALYSIS') return <Sparkles style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />;
                        return <FileText style={{ width: '14px', height: '14px', color: '#64748B' }} />;
                      };

                      return (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setShowNotifications(false);
                          }}
                          style={{
                            padding: '10px 14px',
                            borderBottom: '1px solid #F1F5F9',
                            background: n.read ? '#FFFFFF' : '#F0FDF4',
                            cursor: 'pointer',
                            transition: 'background 120ms ease',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'flex-start'
                          }}
                        >
                          <div style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: '#F1F5F9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px'
                          }}>
                            {getIcon()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
                              <span style={{
                                fontSize: '12px',
                                fontWeight: n.read ? 600 : 700,
                                color: 'var(--color-text-primary)',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {n.title}
                              </span>
                              <span style={{ fontSize: '10px', color: '#94A3B8', flexShrink: 0 }}>
                                {n.createdAt}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '11px',
                              color: '#475569',
                              margin: '2px 0 4px',
                              lineHeight: 1.35,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>
                              {n.message}
                            </p>
                            {n.grievanceId && (
                              <span style={{
                                fontSize: '9px',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                padding: '1px 5px',
                                borderRadius: '4px',
                                background: '#E2E8F0',
                                color: '#334155'
                              }}>
                                {n.grievanceId}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Popover Footer */}
                <div style={{
                  padding: '8px 14px',
                  background: '#F8FAFC',
                  borderTop: '1px solid var(--color-border-subtle)',
                  textAlign: 'center',
                  fontSize: '10px',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck style={{ width: '12px', height: '12px', color: 'var(--color-primary)' }} />
                  <span>JanSahayk Intelligent Civic Notification Hub</span>
                </div>
              </div>
            )}
          </div>

          {/* User Profile / Logout or Sign In */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '9999px',
                background: '#FFFFFF',
                border: '1px solid var(--color-border-subtle)',
                fontSize: '12px'
              }}>
                <span className="status-dot active"></span>
                <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }} className="hidden-mobile">
                  {user.name.split(' ')[0]}
                </span>
                <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', background: 'var(--color-accent-tint)', color: 'var(--color-primary)', fontWeight: 700 }}>
                  {user.role}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign out"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#F1F5F9',
                  color: '#64748B'
                }}
              >
                <LogOut style={{ width: '14px', height: '14px' }} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary btn-sm"
              style={{ height: '36px', padding: '0 14px', fontSize: '13px' }}
            >
              <LogIn style={{ width: '14px', height: '14px' }} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F1F5F9'
            }}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            background: 'rgba(248, 249, 250, 0.98)',
            backdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '96px 24px 32px'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  padding: '8px 0',
                  borderBottom: '1px solid rgba(15,23,42,0.06)'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
            <button onClick={() => { handleRoleSwitch('citizen'); setMobileMenuOpen(false); }} className="btn-secondary btn-sm">Citizen View</button>
            <button onClick={() => { handleRoleSwitch('officer'); setMobileMenuOpen(false); }} className="btn-secondary btn-sm">Officer View</button>
            <button onClick={() => { handleRoleSwitch('dept_admin'); setMobileMenuOpen(false); }} className="btn-secondary btn-sm">Dept Admin</button>
            <button onClick={() => { handleRoleSwitch('super_admin'); setMobileMenuOpen(false); }} className="btn-secondary btn-sm">Super Admin</button>
          </div>

          <Link
            to="/citizen/submit"
            onClick={() => setMobileMenuOpen(false)}
            className="btn-primary"
            style={{ width: '100%', height: '48px' }}
          >
            <span>File New Grievance</span>
            <ArrowRight className="btn-arrow" style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      )}
    </>
  );
}
