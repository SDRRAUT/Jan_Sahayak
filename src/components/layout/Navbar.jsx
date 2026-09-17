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
  MapPin,
  Settings,
  Mail,
  Lock
} from 'lucide-react';
import { useApp, DEMO_CREDENTIALS } from '../../context/AppContext';
import UserProfileModal from '../common/UserProfileModal';

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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState('profile');

  // Login modal: role selection + 3-second auth simulation (matches onboarding Step 4)
  const [loginSelectedRole, setLoginSelectedRole] = useState('citizen');
  const [loginIsVerifying, setLoginIsVerifying] = useState(false);
  const [loginVerifyProgress, setLoginVerifyProgress] = useState(0);
  const [loginVerifyMsg, setLoginVerifyMsg] = useState('');

  const loginRoleOptions = [
    {
      key: 'citizen',
      label: 'Citizen',
      name: 'Aditya Verma',
      badge: 'Ward 14 (Rohini)',
      email: DEMO_CREDENTIALS.citizen.email,
      password: DEMO_CREDENTIALS.citizen.password,
      icon: User,
      color: '#2563EB',
      bg: '#EFF6FF',
      activeBorder: '#2563EB'
    },
    {
      key: 'civic_officer',
      label: 'Govt Officer',
      name: 'Er. Sanjay Sharma',
      badge: 'Field Engineer (DJB)',
      email: DEMO_CREDENTIALS.civic_officer.email,
      password: DEMO_CREDENTIALS.civic_officer.password,
      icon: Briefcase,
      color: '#059669',
      bg: '#ECFDF5',
      activeBorder: '#059669'
    },
    {
      key: 'super_admin',
      label: 'Administrator',
      name: 'Dr. Meenakshi, IAS',
      badge: 'Municipal Head',
      email: DEMO_CREDENTIALS.super_admin.email,
      password: DEMO_CREDENTIALS.super_admin.password,
      icon: ShieldCheck,
      color: '#4338CA',
      bg: '#EEF2FF',
      activeBorder: '#4338CA'
    }
  ];
  const currentLoginRole = loginRoleOptions.find(r => r.key === loginSelectedRole) || loginRoleOptions[0];

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
      setLoginIsVerifying(false);
      setLoginVerifyProgress(0);
      const targetRole = logged?.role || roleKey;
      if (targetRole === 'citizen') navigate('/citizen');
      else if (targetRole === 'civic_officer' || targetRole === 'officer' || targetRole === 'dept_admin') navigate('/officer');
      else if (targetRole === 'super_admin') navigate('/admin/super');
      else navigate('/');
    } catch (e) {
      setShowLoginModal(false);
      setShowUserMenu(false);
      setMobileMenuOpen(false);
      setLoginIsVerifying(false);
      setLoginVerifyProgress(0);
      if (roleKey === 'citizen') navigate('/citizen');
      else if (roleKey === 'civic_officer' || roleKey === 'officer' || roleKey === 'dept_admin') navigate('/officer');
      else if (roleKey === 'super_admin') navigate('/admin/super');
      else navigate('/');
    }
  };

  // 3-second verification animation matching onboarding Step 4
  const triggerLoginAuth = (roleKey) => {
    const key = roleKey || loginSelectedRole;
    setLoginIsVerifying(true);
    setLoginVerifyProgress(15);
    setLoginVerifyMsg('Checking credentials in Delhi Municipal Auth Directory...');
    setTimeout(() => {
      setLoginVerifyProgress(55);
      setLoginVerifyMsg('Verifying security clearance & jurisdiction...');
    }, 900);
    setTimeout(() => {
      setLoginVerifyProgress(88);
      setLoginVerifyMsg('Cryptographic token granted. Preparing workspace...');
    }, 2000);
    setTimeout(() => {
      setLoginVerifyProgress(100);
      setLoginVerifyMsg('Access Granted! Redirecting...');
      handleRoleLogin(key);
    }, 3000);
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
      case 'civic_officer':
      case 'officer':
      case 'dept_admin': return 'Government Officer';
      case 'super_admin': return 'Administrator / Admin';
      default: return 'User';
    }
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (role === 'citizen') return '/citizen';
    if (role === 'civic_officer' || role === 'officer' || role === 'dept_admin') return '/officer';
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
          <Link to={getHomeLink()} style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', flexShrink: 0 }}>
            <img 
              src="/logo.png" 
              alt="JanSahayak Logo" 
              style={{
                height: '32px',
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0
              }} 
            />
            <span style={{ fontWeight: 800, fontSize: '16.5px', letterSpacing: '-0.02em', color: '#0F172A' }}>
              JanSahayak
            </span>
            {user && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                background: '#F1F5F9',
                color: '#475569',
                borderRadius: '9999px',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.02em'
              }}>
                <span className="status-dot active" style={{ width: '5px', height: '5px' }} />
                {getRoleDisplayLabel(user.role)}
              </span>
            )}
          </Link>

          {/* Primary Navigation Links (Desktop - Role Isolated) */}
          <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Citizen View (Only when logged in) */}
            {user && role === 'citizen' && (
              <>
                <Link
                  to="/"
                  className={`site-nav-link ${location.pathname === '/' ? 'active' : ''}`}
                >
                  Home
                </Link>
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
              </>
            )}

            {/* Field Officer View */}
            {/* Civic Officer View (Unified Field + Dept Admin) */}
            {user && (role === 'civic_officer' || role === 'officer' || role === 'dept_admin') && (
              <>
                <Link
                  to="/intelligence"
                  className={`site-nav-link ${location.pathname.startsWith('/intelligence') ? 'active' : ''}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: location.pathname.startsWith('/intelligence')
                      ? 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)'
                      : 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                    color: location.pathname.startsWith('/intelligence') ? '#FFFFFF' : '#4338CA',
                    border: '1.5px solid #818CF8',
                    boxShadow: location.pathname.startsWith('/intelligence')
                      ? '0 4px 12px rgba(79, 70, 229, 0.35)'
                      : '0 2px 8px rgba(99, 102, 241, 0.16)',
                    fontWeight: 700,
                    fontSize: '13px',
                    transition: 'all 200ms ease',
                    marginRight: '4px'
                  }}
                >
                  <Sparkles style={{ 
                    width: '14px', 
                    height: '14px', 
                    color: location.pathname.startsWith('/intelligence') ? '#FFFFFF' : '#4F46E5', 
                    flexShrink: 0 
                  }} />
                  <span>Civic Intelligence</span>
                </Link>
                <Link
                  to="/officer"
                  className={`site-nav-link ${location.pathname === '/officer' && !location.search.includes('operations') ? 'active' : ''}`}
                >
                  Workspace
                </Link>
                <Link
                  to="/officer?section=operations"
                  className={`site-nav-link ${location.search.includes('operations') || location.pathname === '/admin/department' ? 'active' : ''}`}
                >
                  Operations & Roster
                </Link>
                <Link
                  to="/admin"
                  className={`site-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  Ward Heatmap
                </Link>
              </>
            )}

            {/* Super Admin View */}
            {user && role === 'super_admin' && (
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
                  Home
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
                  <span>System Tour</span>
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
            {/* Logged-in Citizen Quick Actions */}
            {user && role === 'citizen' && (
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
            )}

            {/* Quick AI Assistant Trigger in Navbar */}
            <button
              type="button"
              onClick={() => {
                const launcher = document.getElementById('jansahayak-ai-launcher');
                if (launcher) launcher.click();
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 13px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              title="Open JanSahayak Gemini AI Assistant"
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#10B981' }} />
              <span style={{ color: '#FFFFFF' }}>AI Sahayak</span>
            </button>

            {/* Notifications Bell */}
            {user && (
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
            )}

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

                      {(role === 'civic_officer' || role === 'officer' || role === 'dept_admin') && (
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
                              <span>Civic Officer Workspace</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                          <Link
                            to="/officer?section=operations"
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
                              <Building2 style={{ width: '14px', height: '14px', color: '#059669' }} />
                              <span>Dept Operations & Roster</span>
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

                    {/* Profile Settings */}
                    <div style={{ height: '1px', background: 'var(--color-divider)', margin: '8px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          setProfileModalTab('profile');
                          setShowProfileModal(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <User style={{ width: '13px', height: '13px' }} />
                        <span>My Profile</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          setProfileModalTab('settings');
                          setShowProfileModal(true);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          width: '100%',
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <Settings style={{ width: '13px', height: '13px' }} />
                        <span>Account Settings</span>
                      </button>
                    </div>

                    <div style={{ paddingTop: '8px', borderTop: '1px solid var(--color-divider)' }}>
                      <button
                        type="button"
                        onClick={() => { logout(); setShowUserMenu(false); navigate('/'); }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          width: '100%',
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          color: '#EF4444',
                          background: 'transparent'
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
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  padding: '7px 22px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: '#2563EB',
                  boxShadow: '0 2px 8px rgba(37, 99, 235, 0.28)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  letterSpacing: '-0.01em'
                }}
              >
                <span>Sign in</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-mobile-toggle"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: mobileMenuOpen ? '#F1F5F9' : '#F8FAFC',
                border: '1px solid rgba(15, 23, 42, 0.10)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer'
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X style={{ width: '18px', height: '18px' }} /> : <Menu style={{ width: '18px', height: '18px' }} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '64px',
              left: '4px',
              right: '4px',
              background: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
              padding: '18px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              zIndex: 999
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {/* Citizen Mobile Links */}
              {user && role === 'citizen' && (
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
                    🏠 Home
                  </Link>
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
                </>
              )}

              {/* Civic Officer Mobile Links */}
              {user && (role === 'civic_officer' || role === 'officer' || role === 'dept_admin') && (
                <>
                  <Link
                    to="/intelligence"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#4338CA',
                      background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
                      border: '1.5px solid #818CF8',
                      boxShadow: '0 2px 8px rgba(99, 102, 241, 0.16)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}
                  >
                    <Sparkles style={{ width: '16px', height: '16px', color: '#4F46E5' }} />
                    <span>Civic Intelligence</span>
                  </Link>
                  <Link
                    to="/officer"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/officer' && !location.search.includes('operations') ? '#059669' : 'var(--color-text-primary)',
                      background: location.pathname === '/officer' && !location.search.includes('operations') ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    🏛️ Civic Workspace
                  </Link>
                  <Link
                    to="/officer?section=operations"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.search.includes('operations') ? '#059669' : 'var(--color-text-primary)',
                      background: location.search.includes('operations') ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    📋 Dept Operations & Roster
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
                    🗺️ Ward Heatmap & GIS
                  </Link>
                </>
              )}

              {/* Super Admin Mobile Links */}
              {user && role === 'super_admin' && (
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
                    Home
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
                    to="/onboarding"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--color-primary)',
                      background: '#F0FDF4',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles style={{ width: '15px', height: '15px' }} />
                    <span>System Tour</span>
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
                </>
              )}
            </div>

            {/* Mobile Actions: Guest vs Logged In */}
            {!user ? (
              <div style={{ marginTop: '8px', paddingTop: '12px', borderTop: '1px solid var(--color-divider)' }}>
                <button
                  type="button"
                  onClick={() => { setShowLoginModal(true); setMobileMenuOpen(false); }}
                  className="btn-primary"
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '14px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span>Login</span>
                </button>
              </div>
            ) : (
              <>
                {role === 'citizen' && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-divider)' }}>
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
                )}

                {/* Mobile Profile & Settings Quick Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-divider)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileModalTab('profile');
                      setShowProfileModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}
                  >
                    <User style={{ width: '13px', height: '13px', color: '#2563EB' }} />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileModalTab('settings');
                      setShowProfileModal(true);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '9px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}
                  >
                    <Settings style={{ width: '13px', height: '13px', color: '#64748B' }} />
                    <span>Settings</span>
                  </button>
                </div>

                <div style={{ marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/'); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '10px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#EF4444',
                      background: '#FEF2F2',
                      border: '1px solid #FEE2E2',
                      cursor: 'pointer'
                    }}
                  >
                    <LogOut style={{ width: '14px', height: '14px' }} />
                    <span>Log Out</span>
                  </button>
                </div>
              </>
            )}
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

      {/* Login Modal — Onboarding Step 4 Style */}
      {showLoginModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) { setShowLoginModal(false); setLoginIsVerifying(false); setLoginVerifyProgress(0); }}}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div style={{
            background: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 24px 60px rgba(15, 23, 42, 0.2)',
            position: 'relative'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img src="/logo.png" alt="JanSahayak" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', lineHeight: 1 }}>Sign In to JanSahayak</h3>
                  <p style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Select your role to enter</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setShowLoginModal(false); setLoginIsVerifying(false); setLoginVerifyProgress(0); }}
                style={{ color: '#94A3B8', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>

            {/* 3-Persona Role Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {loginRoleOptions.map((item) => {
                const Icon = item.icon;
                const isSelected = loginSelectedRole === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => !loginIsVerifying && setLoginSelectedRole(item.key)}
                    style={{
                      padding: '10px 6px',
                      borderRadius: '12px',
                      border: isSelected ? `2px solid ${item.activeBorder}` : '1px solid #E2E8F0',
                      background: isSelected ? item.bg : '#F8FAFC',
                      textAlign: 'center',
                      cursor: loginIsVerifying ? 'not-allowed' : 'pointer',
                      transition: 'all 150ms ease',
                      opacity: loginIsVerifying && !isSelected ? 0.5 : 1
                    }}
                  >
                    <div style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      background: isSelected ? '#FFFFFF' : '#E2E8F0',
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 4px auto'
                    }}>
                      <Icon style={{ width: '15px', height: '15px' }} />
                    </div>
                    <strong style={{ fontSize: '11px', display: 'block', color: '#0F172A', fontWeight: 700 }}>{item.label}</strong>
                    <span style={{ fontSize: '9px', color: '#64748B', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pre-filled Credentials */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '10px 12px',
              marginBottom: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '7px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Mail style={{ width: '13px', height: '13px', color: '#94A3B8', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '9px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Email / Username</span>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentLoginRole.email}
                  </span>
                </div>
                <span style={{ fontSize: '9px', color: '#10B981', fontWeight: 700, background: '#ECFDF5', padding: '2px 6px', borderRadius: '4px', flexShrink: 0 }}>Demo ID</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '6px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Lock style={{ width: '13px', height: '13px', color: '#94A3B8', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Password</span>
                  <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#0F172A', display: 'block', fontFamily: 'monospace', letterSpacing: '2px' }}>••••••••</span>
                </div>
              </div>
            </div>

            {/* Verification Progress Bar */}
            {loginIsVerifying && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden', marginBottom: '6px' }}>
                  <div style={{
                    height: '100%',
                    width: `${loginVerifyProgress}%`,
                    background: `linear-gradient(90deg, ${currentLoginRole.color}, ${currentLoginRole.activeBorder})`,
                    borderRadius: '999px',
                    transition: 'width 600ms ease'
                  }} />
                </div>
                <p style={{ fontSize: '11px', color: '#64748B', textAlign: 'center' }}>{loginVerifyMsg}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="button"
              disabled={loginIsVerifying}
              onClick={() => triggerLoginAuth(loginSelectedRole)}
              style={{
                width: '100%',
                height: '42px',
                borderRadius: '999px',
                background: loginIsVerifying ? '#94A3B8' : '#1E2653',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: loginIsVerifying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loginIsVerifying ? 'none' : '0 4px 14px rgba(30, 38, 83, 0.3)',
                transition: 'all 150ms ease'
              }}
            >
              {loginIsVerifying ? (
                <span>Verifying... ({Math.round(loginVerifyProgress)}%)</span>
              ) : (
                <>
                  <span>⚡ Login as {currentLoginRole.label}</span>
                  <ArrowRight style={{ width: '14px', height: '14px' }} />
                </>
              )}
            </button>

            {/* Tour Link */}
            <div style={{ marginTop: '14px', textAlign: 'center' }}>
              <Link
                to="/onboarding"
                onClick={() => { setShowLoginModal(false); setLoginIsVerifying(false); setLoginVerifyProgress(0); }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}
              >
                <Sparkles style={{ width: '13px', height: '13px' }} />
                <span>New? Take the full interactive system tour →</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Universal User Profile & Account Settings Modal (Works across all roles) */}
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        initialTab={profileModalTab} 
      />
    </>
  );
}
