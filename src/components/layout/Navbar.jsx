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
  Sparkles,
  Plus,
  MapPin
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
      setMobileMenuOpen(false);
      const targetRole = logged?.role || roleKey;
      if (targetRole === 'citizen') navigate('/citizen');
      else if (targetRole === 'officer') navigate('/officer');
      else if (targetRole === 'dept_admin') navigate('/admin/department');
      else if (targetRole === 'super_admin') navigate('/admin/super');
      else navigate('/');
    } catch (e) {
      setShowLoginModal(false);
      setShowUserMenu(false);
      setMobileMenuOpen(false);
      if (roleKey === 'citizen') navigate('/citizen');
      else if (roleKey === 'officer') navigate('/officer');
      else if (roleKey === 'dept_admin') navigate('/admin/department');
      else if (roleKey === 'super_admin') navigate('/admin/super');
      else navigate('/');
    }
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

  // Clean name formatting so "Er. Sanjay Sharma" displays as "Er. Sanjay" instead of just "Er."
  const getCleanDisplayName = (u) => {
    if (!u || !u.name) return 'Account';
    const name = u.name.trim();
    if (name.startsWith('Er. ')) {
      const rest = name.replace(/^Er\.\s+/, '');
      return `Er. ${rest.split(' ')[0]}`;
    }
    if (name.startsWith('Dr. ')) {
      const rest = name.replace(/^Dr\.\s+/, '');
      return `Dr. ${rest.split(' ')[0]}`;
    }
    return name.split(' ')[0];
  };

  const getUserInitials = (u) => {
    if (!u || !u.name) return 'U';
    const clean = u.name.replace(/^(Er\.|Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').trim();
    const parts = clean.split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  const getRoleDisplayLabel = (r) => {
    switch (r) {
      case 'citizen': return 'Citizen';
      case 'officer': return 'Field Officer';
      case 'dept_admin': return 'Dept Admin';
      case 'super_admin': return 'Super Admin';
      default: return 'User';
    }
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (role === 'citizen') return '/citizen';
    if (role === 'officer') return '/officer';
    if (role === 'dept_admin') return '/admin/department';
    if (role === 'super_admin') return '/admin/super';
    return '/';
  };

  // Filter notifications strictly relevant to active role/user
  const relevantNotifications = notifications.filter(n => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (n.userId && n.userId === user.id) return true;
    if (n.userRole && n.userRole === user.role) return true;
    if (user.role === 'dept_admin' && n.userRole === 'officer') return true;
    return false;
  });
  const relevantUnreadCount = relevantNotifications.filter(n => !n.read).length;

  return (
    <>
      {/* Full-width docked Civic Header */}
      <header className={`site-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="site-header-inner">
          {/* Brand Logo: JanSahayak */}
          <Link to={getHomeLink()} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak Logo" 
              style={{
                height: '44px',
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 8px rgba(14, 94, 58, 0.2))',
                flexShrink: 0
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.03em', color: 'var(--color-text-primary)' }}>
                  JanSahayak
                </span>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '1.5px 7px',
                  background: '#ECFDF5',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#065F46',
                  borderRadius: '9999px',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  letterSpacing: '0.04em'
                }}>
                  <span className="status-dot active" style={{ width: '5px', height: '5px' }} />
                  {role ? role.toUpperCase().replace('_', ' ') : 'CIVIC'}
                </span>
              </div>
              <span style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-primary)' }}>
                Civic Redressal Platform
              </span>
            </div>
          </Link>

          {/* Primary Navigation Links (Desktop - Role Isolated) */}
          <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Citizen View */}
            {role === 'citizen' && (
              <>
                <Link
                  to="/citizen"
                  className={`site-nav-link ${location.pathname === '/citizen' ? 'active' : ''}`}
                >
                  My Grievances
                </Link>
                <Link
                  to="/citizen/submit"
                  className={`site-nav-link ${location.pathname === '/citizen/submit' ? 'active' : ''}`}
                >
                  File Grievance
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="site-nav-link nav-link-secondary"
                >
                  How it Works
                </button>
              </>
            )}

            {/* Field Officer View */}
            {role === 'officer' && (
              <>
                <Link
                  to="/officer"
                  className={`site-nav-link ${location.pathname.startsWith('/officer') ? 'active' : ''}`}
                >
                  Triage Workspace
                </Link>
                <Link
                  to="/admin"
                  className={`site-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  Ward Heatmap
                </Link>
                <Link
                  to="/intelligence"
                  className={`site-nav-link ${location.pathname.startsWith('/intelligence') ? 'active' : ''}`}
                  style={{
                    position: 'relative',
                    color: location.pathname.startsWith('/intelligence') ? '#4338CA' : undefined,
                    background: location.pathname.startsWith('/intelligence') ? '#EEF2FF' : undefined,
                    fontWeight: location.pathname.startsWith('/intelligence') ? 700 : 500
                  }}
                >
                  <Sparkles style={{ width: '13px', height: '13px', color: '#4F46E5', flexShrink: 0 }} />
                  <span>Civic Intelligence</span>
                </Link>
              </>
            )}

            {/* Dept Admin View */}
            {role === 'dept_admin' && (
              <>
                <Link
                  to="/admin/department"
                  className={`site-nav-link ${location.pathname === '/admin/department' ? 'active' : ''}`}
                >
                  Department Console
                </Link>
                <Link
                  to="/officer"
                  className={`site-nav-link ${location.pathname.startsWith('/officer') ? 'active' : ''}`}
                >
                  Officer Queue
                </Link>
                <Link
                  to="/admin"
                  className={`site-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  Geospatial Heatmap
                </Link>
                <Link
                  to="/intelligence"
                  className={`site-nav-link ${location.pathname.startsWith('/intelligence') ? 'active' : ''}`}
                  style={{
                    color: location.pathname.startsWith('/intelligence') ? '#4338CA' : undefined,
                    background: location.pathname.startsWith('/intelligence') ? '#EEF2FF' : undefined,
                    fontWeight: location.pathname.startsWith('/intelligence') ? 700 : 500
                  }}
                >
                  <Sparkles style={{ width: '13px', height: '13px', color: '#4F46E5', flexShrink: 0 }} />
                  <span>Civic Hotspots</span>
                </Link>
              </>
            )}

            {/* Super Admin View */}
            {role === 'super_admin' && (
              <>
                <Link
                  to="/admin/super"
                  className={`site-nav-link ${location.pathname === '/admin/super' ? 'active' : ''}`}
                >
                  Super Admin Console
                </Link>
                <Link
                  to="/admin/department"
                  className={`site-nav-link ${location.pathname === '/admin/department' ? 'active' : ''}`}
                >
                  Departments
                </Link>
                <Link
                  to="/officer"
                  className={`site-nav-link ${location.pathname.startsWith('/officer') ? 'active' : ''}`}
                >
                  Officers
                </Link>
                <Link
                  to="/admin"
                  className={`site-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  Heatmap
                </Link>
                <Link
                  to="/intelligence"
                  className={`site-nav-link ${location.pathname.startsWith('/intelligence') ? 'active' : ''}`}
                >
                  Intelligence
                </Link>
              </>
            )}

            {/* Guest View */}
            {!user && (
              <>
                <Link
                  to="/"
                  className={`site-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Overview
                </Link>
                <button
                  type="button"
                  onClick={() => scrollToSection('how-it-works')}
                  className="site-nav-link nav-link-secondary"
                >
                  How it Works
                </button>
                <Link
                  to="/onboarding"
                  className={`site-nav-link ${location.pathname === '/onboarding' ? 'active' : ''}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  <Sparkles style={{ width: '13px', height: '13px' }} />
                  <span>3-Step Tour</span>
                </Link>
                <Link
                  to="/impact"
                  className={`site-nav-link nav-link-secondary ${location.pathname === '/impact' ? 'active' : ''}`}
                >
                  Impact
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Cluster */}
          <div className="header-right-cluster">
            {/* Action 1: Track Grievance Button */}
            <button
              type="button"
              onClick={() => setShowTrackModal(true)}
              className="header-track-btn hidden-mobile"
              style={{
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--color-text-secondary)',
                padding: '7px 13px',
                borderRadius: 'var(--radius-full)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F8FAFC',
                border: '1px solid rgba(15, 23, 42, 0.10)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 150ms ease'
              }}
              title="Track ticket status"
            >
              <Search style={{ width: '13px', height: '13px', color: 'var(--color-text-muted)' }} />
              <span>Track Ticket</span>
            </button>

            {/* Action 2: Role-Segregated Primary CTA */}
            {(!user || role === 'citizen') && (
              <Link
                to="/citizen/submit"
                className="header-report-btn"
                style={{
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '0 16px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #0E5E3A 0%, #0A472C 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(14, 94, 58, 0.28)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                <span>File Grievance</span>
              </Link>
            )}

            {role === 'officer' && (
              <Link
                to="/officer"
                className="header-report-btn"
                style={{
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '0 16px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(5, 150, 105, 0.28)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                <Briefcase style={{ width: '14px', height: '14px' }} />
                <span>Triage Queue</span>
              </Link>
            )}

            {role === 'dept_admin' && (
              <Link
                to="/admin/department"
                className="header-report-btn"
                style={{
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '0 16px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.28)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                <Building2 style={{ width: '14px', height: '14px' }} />
                <span>Dept Console</span>
              </Link>
            )}

            {role === 'super_admin' && (
              <Link
                to="/admin/super"
                className="header-report-btn"
                style={{
                  height: '38px',
                  fontSize: '13px',
                  fontWeight: 600,
                  padding: '0 16px',
                  borderRadius: 'var(--radius-full)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 2px 8px rgba(67, 56, 202, 0.28)',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 150ms ease'
                }}
              >
                <ShieldCheck style={{ width: '14px', height: '14px' }} />
                <span>Admin Console</span>
              </Link>
            )}

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
                  border: showNotifications ? '1px solid rgba(15, 23, 42, 0.16)' : '1px solid rgba(15, 23, 42, 0.10)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: showNotifications ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 150ms ease'
                }}
                title="Notifications"
              >
                <Bell style={{ width: '16px', height: '16px' }} />
                {relevantUnreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
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
                    {relevantUnreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead()}
                        style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  {relevantNotifications.length === 0 ? (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                      No notifications yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {relevantNotifications.slice(0, 6).map((n) => (
                        <div
                          key={n.id}
                          style={{
                            padding: '10px 12px',
                            borderRadius: 'var(--radius-md)',
                            background: n.read ? '#FFFFFF' : '#F0FDF4',
                            border: `1px solid ${n.read ? 'var(--color-border-subtle)' : '#BBF7D0'}`,
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                          onClick={() => {
                            markNotificationAsRead(n.id);
                            if (n.link) navigate(n.link);
                          }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
                            {n.title}
                          </div>
                          <div style={{ color: 'var(--color-text-secondary)', fontSize: '11.5px', lineHeight: 1.4 }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                            {n.timestamp || 'Just now'}
                          </div>
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
                  className="header-user-btn"
                  style={{
                    background: showUserMenu ? '#F1F5F9' : '#F8FAFC',
                    border: showUserMenu ? '1px solid #CBD5E1' : '1px solid rgba(15, 23, 42, 0.12)',
                    boxShadow: showUserMenu ? '0 0 0 2px rgba(14, 94, 58, 0.12)' : 'none'
                  }}
                  title="Switch Persona / Account"
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: role === 'super_admin' ? 'linear-gradient(135deg, #4338CA 0%, #312E81 100%)' :
                                role === 'dept_admin' ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' :
                                role === 'officer' ? 'linear-gradient(135deg, #059669 0%, #047857 100%)' :
                                'linear-gradient(135deg, #0E5E3A 0%, #083D25 100%)',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: 800,
                    letterSpacing: '0.03em',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.12)',
                    flexShrink: 0
                  }}>
                    {getUserInitials(user)}
                  </div>
                  <div className="header-user-text">
                    <span className="header-user-name">
                      {getCleanDisplayName(user)}
                    </span>
                    <span className="header-user-role">
                      {getRoleDisplayLabel(role)}
                    </span>
                  </div>
                  <ChevronDown style={{ width: '13px', height: '13px', color: 'var(--color-text-muted)', marginLeft: '1px', flexShrink: 0 }} />
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

                    {/* Active Role Workspace */}
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
                      Current Workspace:
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                      {role === 'citizen' && (
                        <>
                          <Link
                            to="/citizen"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: 'var(--color-primary)',
                              background: '#F0FDF4',
                              border: '1px solid rgba(16, 185, 129, 0.2)',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <User style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                              <span>My Grievance Portal</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                          <Link
                            to="/citizen/submit"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: 'var(--color-text-primary)',
                              background: '#F8FAFC',
                              border: '1px solid rgba(15, 23, 42, 0.06)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Plus style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                              <span>File New Grievance</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>+</span>
                          </Link>
                        </>
                      )}

                      {role === 'officer' && (
                        <>
                          <Link
                            to="/officer"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: '#047857',
                              background: '#ECFDF5',
                              border: '1px solid rgba(5, 150, 105, 0.2)',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Briefcase style={{ width: '14px', height: '14px', color: '#059669' }} />
                              <span>Officer Triage Workspace</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                          <Link
                            to="/admin"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: 'var(--color-text-primary)',
                              background: '#F8FAFC',
                              border: '1px solid rgba(15, 23, 42, 0.06)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <MapPin style={{ width: '14px', height: '14px', color: '#059669' }} />
                              <span>Ward Heatmap</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                        </>
                      )}

                      {role === 'dept_admin' && (
                        <>
                          <Link
                            to="/admin/department"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: '#0369A1',
                              background: '#F0F9FF',
                              border: '1px solid rgba(2, 132, 199, 0.2)',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Building2 style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                              <span>Department Console</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                          <Link
                            to="/officer"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: 'var(--color-text-primary)',
                              background: '#F8FAFC',
                              border: '1px solid rgba(15, 23, 42, 0.06)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Briefcase style={{ width: '14px', height: '14px', color: '#0284C7' }} />
                              <span>Officer Queue</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                        </>
                      )}

                      {role === 'super_admin' && (
                        <>
                          <Link
                            to="/admin/super"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: '#4338CA',
                              background: '#EEF2FF',
                              border: '1px solid rgba(67, 56, 202, 0.2)',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <ShieldCheck style={{ width: '14px', height: '14px', color: '#4338CA' }} />
                              <span>Super Admin Console</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                          <Link
                            to="/admin/department"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: 'var(--color-text-primary)',
                              background: '#F8FAFC',
                              border: '1px solid rgba(15, 23, 42, 0.06)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Building2 style={{ width: '14px', height: '14px', color: '#4338CA' }} />
                              <span>Department Directory</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                        </>
                      )}
                    </div>

                    <div style={{ height: '1px', background: 'var(--color-divider)', margin: '8px 0' }} />

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
              {/* Citizen Mobile Links */}
              {role === 'citizen' && (
                <>
                  <Link
                    to="/citizen"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/citizen' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      background: location.pathname === '/citizen' ? '#F0FDF4' : '#F8FAFC'
                    }}
                  >
                    📋 My Grievances
                  </Link>
                  <Link
                    to="/citizen/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/citizen/submit' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      background: location.pathname === '/citizen/submit' ? '#F0FDF4' : '#F8FAFC'
                    }}
                  >
                    ✍️ File Grievance
                  </Link>
                  <button
                    type="button"
                    onClick={() => { scrollToSection('how-it-works'); setMobileMenuOpen(false); }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      background: 'transparent',
                      textAlign: 'left'
                    }}
                  >
                    How it Works
                  </button>
                </>
              )}

              {/* Officer Mobile Links */}
              {role === 'officer' && (
                <>
                  <Link
                    to="/officer"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname.startsWith('/officer') ? '#059669' : 'var(--color-text-primary)',
                      background: location.pathname.startsWith('/officer') ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    📥 Triage Workspace
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin' ? '#059669' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin' ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    🗺️ Ward Heatmap
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
                      gap: '8px'
                    }}
                  >
                    <Sparkles style={{ width: '16px', height: '16px', color: '#4F46E5' }} />
                    <span>Civic Intelligence</span>
                  </Link>
                </>
              )}

              {/* Dept Admin Mobile Links */}
              {role === 'dept_admin' && (
                <>
                  <Link
                    to="/admin/department"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin/department' ? '#0284C7' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin/department' ? '#F0F9FF' : '#F8FAFC'
                    }}
                  >
                    🏢 Department Console
                  </Link>
                  <Link
                    to="/officer"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname.startsWith('/officer') ? '#0284C7' : 'var(--color-text-primary)',
                      background: location.pathname.startsWith('/officer') ? '#F0F9FF' : '#F8FAFC'
                    }}
                  >
                    👥 Officer Workload
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin' ? '#0284C7' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin' ? '#F0F9FF' : '#F8FAFC'
                    }}
                  >
                    🗺️ Geospatial Heatmap
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
                      gap: '8px'
                    }}
                  >
                    <Sparkles style={{ width: '16px', height: '16px', color: '#4F46E5' }} />
                    <span>Civic Hotspots</span>
                  </Link>
                </>
              )}

              {/* Super Admin Mobile Links */}
              {role === 'super_admin' && (
                <>
                  <Link
                    to="/admin/super"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin/super' ? '#4338CA' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin/super' ? '#EEF2FF' : '#F8FAFC'
                    }}
                  >
                    🛡️ Super Admin Console
                  </Link>
                  <Link
                    to="/admin/department"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin/department' ? '#4338CA' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin/department' ? '#EEF2FF' : '#F8FAFC'
                    }}
                  >
                    🏢 Departments
                  </Link>
                  <Link
                    to="/officer"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname.startsWith('/officer') ? '#4338CA' : 'var(--color-text-primary)',
                      background: location.pathname.startsWith('/officer') ? '#EEF2FF' : '#F8FAFC'
                    }}
                  >
                    👥 Officer Workspaces
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin' ? '#4338CA' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin' ? '#EEF2FF' : '#F8FAFC'
                    }}
                  >
                    🗺️ Heatmap
                  </Link>
                </>
              )}

              {/* Guest Mobile Links */}
              {!user && (
                <>
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
                  <button
                    type="button"
                    onClick={() => { scrollToSection('how-it-works'); setMobileMenuOpen(false); }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: 'var(--color-text-secondary)',
                      background: 'transparent',
                      textAlign: 'left'
                    }}
                  >
                    How it Works
                  </button>
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
                </>
              )}
            </div>

            {/* Mobile Persona Switcher */}
            <div style={{ marginTop: '8px', paddingTop: '10px', borderTop: '1px solid var(--color-divider)' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
                Switch Persona (1-Click):
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => handleRoleLogin('citizen')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: role === 'citizen' ? '#F0FDF4' : '#F8FAFC',
                    color: role === 'citizen' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                    border: `1px solid ${role === 'citizen' ? 'rgba(16, 185, 129, 0.3)' : 'var(--color-border-subtle)'}`,
                    fontWeight: role === 'citizen' ? 700 : 500
                  }}
                >
                  👤 Citizen
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleLogin('officer')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: role === 'officer' ? '#ECFDF5' : '#F8FAFC',
                    color: role === 'officer' ? '#059669' : 'var(--color-text-primary)',
                    border: `1px solid ${role === 'officer' ? 'rgba(5, 150, 105, 0.3)' : 'var(--color-border-subtle)'}`,
                    fontWeight: role === 'officer' ? 700 : 500
                  }}
                >
                  🛠 Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleLogin('dept_admin')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: role === 'dept_admin' ? '#F0F9FF' : '#F8FAFC',
                    color: role === 'dept_admin' ? '#0284C7' : 'var(--color-text-primary)',
                    border: `1px solid ${role === 'dept_admin' ? 'rgba(2, 132, 199, 0.3)' : 'var(--color-border-subtle)'}`,
                    fontWeight: role === 'dept_admin' ? 700 : 500
                  }}
                >
                  🏛 Dept Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleLogin('super_admin')}
                  style={{
                    padding: '8px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '12px',
                    textAlign: 'left',
                    background: role === 'super_admin' ? '#EEF2FF' : '#F8FAFC',
                    color: role === 'super_admin' ? '#4338CA' : 'var(--color-text-primary)',
                    border: `1px solid ${role === 'super_admin' ? 'rgba(67, 56, 202, 0.3)' : 'var(--color-border-subtle)'}`,
                    fontWeight: role === 'super_admin' ? 700 : 500
                  }}
                >
                  🛡 Super Admin
                </button>
              </div>
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" alt="JanSahayak" style={{ height: '34px', width: 'auto', objectFit: 'contain' }} />
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

            {/* Guided Product Tour Link */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--color-divider)', textAlign: 'center' }}>
              <Link
                to="/onboarding"
                onClick={() => setShowLoginModal(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--color-primary)',
                  textDecoration: 'none'
                }}
              >
                <Sparkles style={{ width: '14px', height: '14px' }} />
                <span>Take the 3-Step Interactive Tour & Demo →</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
