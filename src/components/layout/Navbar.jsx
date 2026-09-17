import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Shield, 
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
  Search,
  CheckCircle2,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    role, 
    logout, 
    switchDemoRole, 
    notifications = [], 
    unreadNotificationCount = 0, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    grievances = []
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [trackTicketId, setTrackTicketId] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Close notifications and user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRoleLogin = async (roleKey) => {
    try {
      const logged = await switchDemoRole(roleKey);
      setShowLoginModal(false);
      setShowUserMenu(false);
      if (logged.role === 'citizen') navigate('/citizen');
      else if (logged.role === 'officer') navigate('/officer');
      else if (logged.role === 'dept_admin') navigate('/admin/department');
      else if (logged.role === 'super_admin') navigate('/admin/super');
    } catch (e) {}
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (!trackTicketId.trim()) return;
    setShowTrackModal(false);
    navigate(`/citizen/complaints/${trackTicketId.trim()}`);
  };

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Full-width docked Civic Header */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container site-header-inner">
          {/* Brand Logo: JanSahayak */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #0E5E3A 0%, #083D25 100%)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 8px rgba(14, 94, 58, 0.28)',
              flexShrink: 0
            }}>
              <ShieldCheck style={{ width: '22px', height: '22px', strokeWidth: 2.2 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.025em', color: 'var(--color-text-primary)' }}>
                  JanSahayak
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '1px 6px',
                  background: '#ECFDF5',
                  color: '#065F46',
                  borderRadius: '9999px',
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}>
                  <span className="status-dot active" style={{ width: '5px', height: '5px' }} />
                  LIVE
                </span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--color-primary)' }}>
                Civic Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Primary Navigation Links (Desktop) */}
          <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Link
              to="/"
              className={`site-nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Overview
            </Link>

            <Link
              to="/intelligence"
              className={`site-nav-link ${location.pathname.startsWith('/intelligence') ? 'active' : ''}`}
              style={{
                position: 'relative',
                color: location.pathname.startsWith('/intelligence') ? 'var(--color-ai-text)' : undefined,
                background: location.pathname.startsWith('/intelligence') ? 'var(--color-ai-tint)' : undefined
              }}
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#4F46E5' }} />
              <span>Civic Intelligence</span>
              <span style={{
                fontSize: '9px',
                padding: '1px 5px',
                borderRadius: '9999px',
                background: '#4F46E5',
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginLeft: '2px'
              }}>
                NEW
              </span>
            </Link>

            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="site-nav-link"
            >
              How it Works
            </button>

            <Link
              to="/citizen"
              className={`site-nav-link ${location.pathname.startsWith('/citizen') && !location.pathname.includes('/submit') ? 'active' : ''}`}
            >
              For Citizens
            </Link>

            <Link
              to="/officer"
              className={`site-nav-link ${location.pathname.startsWith('/officer') ? 'active' : ''}`}
            >
              For Authorities
            </Link>

            <Link
              to="/impact"
              className={`site-nav-link ${location.pathname === '/impact' ? 'active' : ''}`}
            >
              Impact
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Action 1: Track Grievance Button */}
            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                padding: '7px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                transition: 'all 150ms ease'
              }}
              className="hidden-mobile"
              title="Track ticket status"
            >
              <Search style={{ width: '13px', height: '13px', color: 'var(--color-text-muted)' }} />
              <span>Track Ticket</span>
            </button>

            {/* Action 2: Report a Problem (Primary CTA) */}
            <Link
              to="/citizen/submit"
              className="btn-primary"
              style={{
                height: '38px',
                fontSize: '13px',
                padding: '0 16px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>Report Issue</span>
              <ArrowRight style={{ width: '13px', height: '13px' }} />
            </Link>

            {/* Notifications Bell */}
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: showNotifications ? '#F1F5F9' : '#F8FAFC',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-text-secondary)',
                  position: 'relative',
                  transition: 'all 150ms ease'
                }}
                title="Notifications"
              >
                <Bell style={{ width: '16px', height: '16px' }} />
                {unreadNotificationCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#EF4444',
                    boxShadow: '0 0 0 2px #FFFFFF'
                  }} />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '340px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    background: '#FFFFFF',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border-subtle)',
                    boxShadow: 'var(--shadow-floating)',
                    padding: '16px',
                    zIndex: 100
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                      Activity Notifications
                    </span>
                    {unreadNotificationCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead()}
                        style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                      No notifications yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) navigate(n.link);
                            setShowNotifications(false);
                          }}
                          style={{
                            padding: '10px',
                            borderRadius: 'var(--radius-md)',
                            background: n.read ? '#FFFFFF' : '#F0FDF4',
                            border: '1px solid var(--color-border-subtle)',
                            cursor: 'pointer',
                            transition: 'background 150ms ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                            <strong style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>{n.title}</strong>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>{n.createdAt}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', lineHeight: 1.3 }}>
                            {n.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action 3: User Account / Persona Switcher */}
            {user ? (
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '4px 10px 4px 4px',
                    borderRadius: 'var(--radius-full)',
                    background: '#F8FAFC',
                    border: '1px solid var(--color-border-subtle)',
                    transition: 'all 150ms ease'
                  }}
                  title="Switch Persona / Account"
                >
                  <div style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    background: 'var(--color-primary)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 700
                  }}>
                    {user.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
                  </div>
                  <div style={{ textAlign: 'left', lineHeight: 1.1 }} className="hidden-mobile">
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-primary)', display: 'block' }}>
                      {user.name ? user.name.split(' ')[0] : 'Account'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                      {role?.replace('_', ' ')}
                    </span>
                  </div>
                  <ChevronDown style={{ width: '12px', height: '12px', color: 'var(--color-text-muted)' }} />
                </button>

                {showUserMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '46px',
                      right: 0,
                      width: '260px',
                      background: '#FFFFFF',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border-subtle)',
                      boxShadow: 'var(--shadow-floating)',
                      padding: '12px',
                      zIndex: 100
                    }}
                  >
                    <div style={{ paddingBottom: '8px', borderBottom: '1px solid var(--color-divider)', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '13px', display: 'block', color: 'var(--color-text-primary)' }}>{user.name}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'capitalize' }}>
                        {role?.replace('_', ' ')} • {user.ward || user.department || 'Delhi'}
                      </span>
                    </div>

                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                      Switch Demo Persona:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleRoleLogin('citizen')}
                        style={{
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          textAlign: 'left',
                          background: role === 'citizen' ? '#F0FDF4' : 'transparent',
                          color: role === 'citizen' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                          fontWeight: role === 'citizen' ? 700 : 400
                        }}
                      >
                        👤 Citizen (Aditya Verma)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleLogin('officer')}
                        style={{
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          textAlign: 'left',
                          background: role === 'officer' ? '#F0FDF4' : 'transparent',
                          color: role === 'officer' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                          fontWeight: role === 'officer' ? 700 : 400
                        }}
                      >
                        🛠 Govt Officer (Er. Sanjay Sharma)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleLogin('dept_admin')}
                        style={{
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          textAlign: 'left',
                          background: role === 'dept_admin' ? '#F0FDF4' : 'transparent',
                          color: role === 'dept_admin' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                          fontWeight: role === 'dept_admin' ? 700 : 400
                        }}
                      >
                        🏛 Dept Admin (Er. Rajiv Malhotra)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleLogin('super_admin')}
                        style={{
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          textAlign: 'left',
                          background: role === 'super_admin' ? '#F0FDF4' : 'transparent',
                          color: role === 'super_admin' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                          fontWeight: role === 'super_admin' ? 700 : 400
                        }}
                      >
                        🛡 Super Admin (Principal Secretary)
                      </button>
                    </div>

                    <div style={{ paddingTop: '8px', borderTop: '1px solid var(--color-divider)' }}>
                      <button
                        type="button"
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          width: '100%',
                          padding: '6px 8px',
                          fontSize: '12px',
                          color: '#EF4444'
                        }}
                      >
                        <LogOut style={{ width: '13px', height: '13px' }} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border-medium)',
                  background: '#FFFFFF'
                }}
              >
                Login
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-toggle"
              style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-md)',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: mobileMenuOpen ? '#F1F5F9' : '#F8FAFC',
                border: '1px solid var(--color-border-subtle)',
                color: 'var(--color-text-primary)'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '68px',
              left: 0,
              right: 0,
              background: '#FFFFFF',
              borderBottom: '1px solid var(--color-divider)',
              boxShadow: '0 12px 24px rgba(15, 23, 42, 0.08)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 999
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: location.pathname === '/' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  background: location.pathname === '/' ? '#F0FDF4' : '#F8FAFC'
                }}
              >
                Overview
              </Link>

              <Link
                to="/intelligence"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#4338CA',
                  background: '#EEF2FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles style={{ width: '16px', height: '16px', color: '#4F46E5' }} />
                  <span>Civic Intelligence Dashboard</span>
                </div>
                <span style={{ fontSize: '10px', background: '#4F46E5', color: '#FFFFFF', padding: '2px 6px', borderRadius: '9999px' }}>
                  NEW
                </span>
              </Link>

              <Link
                to="/citizen"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: location.pathname.startsWith('/citizen') ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  background: location.pathname.startsWith('/citizen') ? '#F0FDF4' : '#F8FAFC'
                }}
              >
                Citizen Portal
              </Link>

              <Link
                to="/officer"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: location.pathname.startsWith('/officer') ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  background: location.pathname.startsWith('/officer') ? '#F0FDF4' : '#F8FAFC'
                }}
              >
                Officer Console
              </Link>

              <Link
                to="/impact"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: location.pathname === '/impact' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  background: location.pathname === '/impact' ? '#F0FDF4' : '#F8FAFC'
                }}
              >
                Impact
              </Link>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => { setShowTrackModal(true); setMobileMenuOpen(false); }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border-medium)',
                  background: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Search style={{ width: '14px', height: '14px' }} />
                <span>Track Ticket</span>
              </button>

              <Link
                to="/citizen/submit"
                onClick={() => setMobileMenuOpen(false)}
                className="btn-primary"
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <span>Report Issue</span>
                <ArrowRight style={{ width: '14px', height: '14px' }} />
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Track Grievance Quick Modal */}
      {showTrackModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '440px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-modal)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Search style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>Track Your Grievance</h3>
              </div>
              <button type="button" onClick={() => setShowTrackModal(false)} style={{ color: 'var(--color-text-muted)' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
              Enter your ticket reference number to view the live resolution journey and field team status.
            </p>

            <form onSubmit={handleTrackSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="e.g. DL-2026-W14-0892"
                  value={trackTicketId}
                  onChange={(e) => setTrackTicketId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-medium)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-mono)'
                  }}
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                  Or inspect active sample tickets:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {grievances.slice(0, 3).map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setTrackTicketId(g.id)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: '#F1F5F9',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {g.id}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                <span>Track Resolution Status</span>
                <ArrowRight style={{ width: '15px', height: '15px' }} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Login / Persona Selection Modal */}
      {showLoginModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-xl)',
            maxWidth: '460px',
            width: '100%',
            padding: '28px',
            boxShadow: 'var(--shadow-modal)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogIn style={{ width: '18px', height: '18px', color: 'var(--color-primary)' }} />
                <h3 style={{ fontSize: '18px', color: 'var(--color-text-primary)' }}>Sign In to JanSahayak</h3>
              </div>
              <button type="button" onClick={() => setShowLoginModal(false)} style={{ color: 'var(--color-text-muted)' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Choose your role to enter the platform. For rapid demonstration, pre-seeded accounts are enabled.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Persona 1: Citizen */}
              <button
                type="button"
                onClick={() => handleRoleLogin('citizen')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  background: '#FFFFFF',
                  textAlign: 'left',
                  transition: 'all 150ms ease'
                }}
                className="card-interactive"
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)', display: 'block' }}>
                    Citizen Portal
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Aditya Verma • Submit complaints & track live progress
                  </span>
                </div>
              </button>

              {/* Persona 2: Government Officer */}
              <button
                type="button"
                onClick={() => handleRoleLogin('officer')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  background: '#FFFFFF',
                  textAlign: 'left',
                  transition: 'all 150ms ease'
                }}
                className="card-interactive"
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#EFF6FF', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Briefcase style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)', display: 'block' }}>
                    Government Officer
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Er. Sanjay Sharma (AEE) • Case triage, duplicate verification & SOPs
                  </span>
                </div>
              </button>

              {/* Persona 3: Department Admin */}
              <button
                type="button"
                onClick={() => handleRoleLogin('dept_admin')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--color-border-subtle)',
                  background: '#FFFFFF',
                  textAlign: 'left',
                  transition: 'all 150ms ease'
                }}
                className="card-interactive"
              >
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#F5F3FF', color: '#6D28D9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Building2 style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)', display: 'block' }}>
                    Department Administrator
                  </strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    Er. Rajiv Malhotra • Department health, SLA compliance & hotspots
                  </span>
                </div>
              </button>
            </div>

            {/* Subtle Super Admin access */}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                Municipal Principal Secretary
              </span>
              <button
                type="button"
                onClick={() => handleRoleLogin('super_admin')}
                style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)' }}
              >
                Super Admin Access →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
