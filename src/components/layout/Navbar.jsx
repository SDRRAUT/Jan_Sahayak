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
  Megaphone,
  Plus,
  MapPin,
  Settings,
  Mail,
  Lock,
  Volume2,
  VolumeX,
  Radio,
  Wrench,
  Video
} from 'lucide-react';
import { useApp, DEMO_CREDENTIALS } from '../../context/AppContext';
import FileGrievanceModal from '../common/FileGrievanceModal';
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
    grievances = [],
    janSuchnaList = []
  } = useApp();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isJanSuchnaSpeaking, setIsJanSuchnaSpeaking] = useState(false);
  const [dismissedJanSuchnaIds, setDismissedJanSuchnaIds] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showFileGrievanceModal, setShowFileGrievanceModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState('profile');
  const [trackTicketId, setTrackTicketId] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Login modal: role selection + 3-second auth simulation (matches onboarding Step 4)
  const [loginSelectedRole, setLoginSelectedRole] = useState('citizen');
  const [loginIsVerifying, setLoginIsVerifying] = useState(false);
  const [loginVerifyProgress, setLoginVerifyProgress] = useState(0);
  const [loginVerifyMsg, setLoginVerifyMsg] = useState('');

  const loginRoleOptions = [
    {
      key: 'citizen',
      label: 'Citizen',
      name: 'Rahul Raut',
      badge: 'Ward 29 (Ivy Estate)',
      email: DEMO_CREDENTIALS.citizen.email,
      password: DEMO_CREDENTIALS.citizen.password,
      icon: User,
      color: '#059669',
      bg: '#ECFDF5',
      activeBorder: '#059669'
    },
    {
      key: 'civic_officer',
      label: 'Govt Officer',
      name: 'Er. Sanjay Sharma',
      badge: 'Field Engineer (PMC)',
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
      color: '#059669',
      bg: '#ECFDF5',
      activeBorder: '#059669'
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
      if (targetRole === 'citizen') navigate('/');
      else if (targetRole === 'civic_officer' || targetRole === 'officer' || targetRole === 'dept_admin') navigate('/officer');
      else if (targetRole === 'super_admin') navigate('/admin/super');
      else if (targetRole === 'worker') navigate('/worker');
      else navigate('/');
    } catch (e) {
      setShowLoginModal(false);
      setShowUserMenu(false);
      setMobileMenuOpen(false);
      setLoginIsVerifying(false);
      setLoginVerifyProgress(0);
      if (roleKey === 'citizen') navigate('/');
      else if (roleKey === 'civic_officer' || roleKey === 'officer' || roleKey === 'dept_admin') navigate('/officer');
      else if (roleKey === 'super_admin') navigate('/admin/super');
      else if (roleKey === 'worker') navigate('/worker');
      else navigate('/');
    }
  };

  // 3-second verification animation matching onboarding Step 4
  const triggerLoginAuth = (roleKey) => {
    const key = roleKey || loginSelectedRole;
    setLoginIsVerifying(true);
    setLoginVerifyProgress(15);
    setLoginVerifyMsg('Checking credentials in Pune Municipal Auth Directory...');
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
      case 'super_admin': return 'Administrator';
      case 'worker': return 'Technician / Worker';
      default: return 'User';
    }
  };

  const getHomeLink = () => {
    if (!user) return '/';
    if (role === 'citizen') return '/';
    if (role === 'civic_officer' || role === 'officer' || role === 'dept_admin') return '/officer';
    if (role === 'super_admin') return '/admin/super';
    if (role === 'worker') return '/worker';
    return '/';
  };

  // Filter notifications strictly relevant to active role/user
  const relevantNotifications = notifications.filter(n => {
    if (!user) return n.userRole === 'citizen' || !n.userRole;
    if (user.role === 'super_admin') return true;
    if (n.userId && n.userId === user.id) return true;
    if (n.userRole && n.userRole === user.role) return true;
    if (user.role === 'dept_admin' && n.userRole === 'officer') return true;
    return false;
  });
  const relevantUnreadCount = user ? relevantNotifications.filter(n => !n.read).length : 0;

  // Active Jan Suchna Public Advisory matching current user / citywide
  const activeJanSuchna = janSuchnaList.find(s => {
    if (dismissedJanSuchnaIds.includes(s.id)) return false;
    if (s.status !== 'ACTIVE') return false;
    return true;
  });

  const totalUnreadAlerts = relevantUnreadCount + (activeJanSuchna ? 1 : 0);

  const handleJanSuchnaSpeech = (suchna) => {
    if ('speechSynthesis' in window) {
      if (isJanSuchnaSpeaking) {
        window.speechSynthesis.cancel();
        setIsJanSuchnaSpeaking(false);
      } else {
        const text = `जन सूचना अलर्ट. ${suchna.title}. अवधि: ${suchna.duration}. कृपया ध्यान दें: ${suchna.instructions}. हेल्पलाइन: ${suchna.helpline}`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'hi-IN';
        utterance.onend = () => setIsJanSuchnaSpeaking(false);
        utterance.onerror = () => setIsJanSuchnaSpeaking(false);
        setIsJanSuchnaSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

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
                height: '30px',
                width: 'auto',
                objectFit: 'contain',
                flexShrink: 0
              }} 
            />
            <span style={{ fontWeight: 800, fontSize: '16.5px', letterSpacing: '-0.02em', color: '#0F172A', whiteSpace: 'nowrap' }}>
              JanSahayak
            </span>
            {user && (
              <span className="hidden-mobile" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '2px 8px',
                background: 'rgba(255, 255, 255, 0.85)',
                color: '#0369A1',
                border: '1px solid rgba(186, 230, 253, 0.90)',
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
                  to="/citizen/find-worker"
                  className={`site-nav-link ${location.pathname === '/citizen/find-worker' ? 'active' : ''}`}
                >
                  Find Worker
                </Link>
                <button
                  type="button"
                  onClick={() => setShowFileGrievanceModal(true)}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 4px 18px rgba(37,99,235,0.45)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(37,99,235,0.30)'; }}
                  style={{
                    background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '6px 16px',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: '13px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 10px rgba(37,99,235,0.30)',
                    transition: 'all 0.18s ease',
                    letterSpacing: '0.01em'
                  }}
                >
                  <Plus style={{ width: '13px', height: '13px' }} />
                  <span>File Grievance</span>
                </button>
              </>
            )}

            {/* Field Officer View */}
            {/* Civic Officer View (Unified Field + Dept Admin) */}
            {user && (role === 'civic_officer' || role === 'officer' || role === 'dept_admin') && (
              <>
                <Link
                  to="/officer"
                  className={`site-nav-link ${(location.pathname === '/officer' || (location.pathname.startsWith('/officer') && !location.pathname.startsWith('/officer/surveillance'))) ? 'active' : ''}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '999px',
                    background: (location.pathname === '/officer' || (location.pathname.startsWith('/officer') && !location.pathname.startsWith('/officer/surveillance')))
                      ? '#065F46'
                      : '#ECFDF5',
                    color: (location.pathname === '/officer' || (location.pathname.startsWith('/officer') && !location.pathname.startsWith('/officer/surveillance'))) ? '#FFFFFF' : '#065F46',
                    border: '1px solid #A7F3D0',
                    fontWeight: 700,
                    fontSize: '13px',
                    boxShadow: (location.pathname === '/officer' || (location.pathname.startsWith('/officer') && !location.pathname.startsWith('/officer/surveillance')))
                      ? '0 2px 8px rgba(6, 95, 70, 0.25)'
                      : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  <Briefcase style={{ width: '14px', height: '14px', flexShrink: 0 }} />
                  <span>Officer Workspace</span>
                </Link>
                <Link
                  to="/officer/surveillance"
                  className={`site-nav-link ${location.pathname.startsWith('/officer/surveillance') ? 'active' : ''}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Video style={{ width: '14px', height: '14px', color: '#059669' }} />
                  <span>Surveillance AI</span>
                  <span style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: '#10B981',
                    boxShadow: '0 0 6px #10B981'
                  }} />
                </Link>
                <Link
                  to="/intelligence"
                  className={`site-nav-link ${location.pathname.startsWith('/intelligence') ? 'active' : ''}`}
                >
                  <span>Civic Intelligence</span>
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
                  className={`site-nav-link ${location.pathname === '/admin/super' && (!location.search || !location.search.includes('tab=departments')) ? 'active' : ''}`}
                >
                  PMC City Command
                </Link>
                <Link
                  to="/admin/super?tab=departments"
                  className={`site-nav-link ${location.pathname === '/admin/super' && location.search.includes('tab=departments') ? 'active' : ''}`}
                >
                  Departments & Officers
                </Link>
                <Link
                  to="/admin"
                  className={`site-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
                >
                  Ward Heatmap
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

            {/* Notifications Bell */}
            <div ref={notificationRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`notification-bell-btn ${totalUnreadAlerts > 0 ? 'notification-bell-ringing' : ''}`}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: showNotifications ? '#F1F5F9' : (totalUnreadAlerts > 0 ? '#FEF2F2' : '#F8FAFC'),
                  border: showNotifications ? '1.5px solid #CBD5E1' : (totalUnreadAlerts > 0 ? '1.5px solid #FCA5A5' : '1px solid rgba(15, 23, 42, 0.10)'),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: totalUnreadAlerts > 0 ? '#DC2626' : (showNotifications ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'),
                  position: 'relative',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 150ms ease'
                }}
                title={totalUnreadAlerts > 0 ? `${totalUnreadAlerts} Notifications & Jan Suchna Public Advisories` : 'Notifications'}
                aria-label="Notifications"
              >
                <Bell style={{ width: '17px', height: '17px' }} />
                {totalUnreadAlerts > 0 && (
                  <span
                    className="notification-blink-dot"
                    style={{
                      position: 'absolute',
                      top: '2px',
                      right: '2px',
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: '#EF4444',
                      border: '2px solid #FFFFFF'
                    }}
                  />
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  className="notification-popover"
                  style={{
                    position: 'absolute',
                    top: '46px',
                    right: 0,
                    width: '420px',
                    maxWidth: 'calc(100vw - 24px)',
                    maxHeight: '480px',
                    overflowY: 'auto',
                    background: '#FFFFFF',
                    borderRadius: '18px',
                    border: '1.5px solid #CBD5E1',
                    boxShadow: '0 16px 40px rgba(15, 23, 42, 0.20)',
                    padding: '16px',
                    zIndex: 1100
                  }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Bell style={{ width: '15px', height: '15px', color: '#0F172A' }} />
                      <span style={{ fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#0F172A' }}>
                        Civic Notifications & Alerts
                      </span>
                    </div>
                    {relevantUnreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead()}
                        style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* 📢 ACTIVE JAN SUCHNA PUBLIC ADVISORY CARD INSIDE NOTIFICATION POPOVER */}
                  {activeJanSuchna && (
                    <div style={{
                      marginBottom: '14px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4338CA 100%)',
                      color: '#FFFFFF',
                      padding: '14px 16px',
                      boxShadow: '0 6px 18px rgba(49, 46, 129, 0.25)',
                      border: '1.5px solid #818CF8',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      {/* Top Badges & Audio / Dismiss Buttons */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '10.5px',
                            fontWeight: 800,
                            background: '#F59E0B',
                            color: '#78350F',
                            padding: '2px 8px',
                            borderRadius: '999px',
                            letterSpacing: '0.02em'
                          }}>
                            <Radio style={{ width: '11px', height: '11px' }} />
                            📢 जन सूचना (JAN SUCHNA)
                          </span>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            background: 'rgba(255, 255, 255, 0.15)',
                            color: '#FDE68A',
                            padding: '2px 8px',
                            borderRadius: '999px'
                          }}>
                            📍 {activeJanSuchna.ward}
                          </span>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 700,
                            background: 'rgba(239, 68, 68, 0.3)',
                            color: '#FCA5A5',
                            border: '1px solid rgba(239, 68, 68, 0.4)',
                            padding: '2px 7px',
                            borderRadius: '999px'
                          }}>
                            ⏱️ {activeJanSuchna.duration} Outage
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleJanSuchnaSpeech(activeJanSuchna)}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '999px',
                              background: isJanSuchnaSpeaking ? '#10B981' : 'rgba(255, 255, 255, 0.18)',
                              color: '#FFFFFF',
                              fontSize: '10.5px',
                              fontWeight: 700,
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isJanSuchnaSpeaking ? <VolumeX style={{ width: '12px', height: '12px' }} /> : <Volume2 style={{ width: '12px', height: '12px' }} />}
                            <span>{isJanSuchnaSpeaking ? 'Stop Audio' : 'Audio Guide (हिंदी)'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setDismissedJanSuchnaIds(prev => [...prev, activeJanSuchna.id])}
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.15)',
                              border: 'none',
                              color: '#FFFFFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            title="Dismiss Advisory"
                          >
                            <X style={{ width: '13px', height: '13px' }} />
                          </button>
                        </div>
                      </div>

                      {/* Title */}
                      <h4 style={{ fontSize: '13.5px', fontWeight: 800, margin: '0 0 6px 0', color: '#FFFFFF', lineHeight: 1.35 }}>
                        {activeJanSuchna.title}
                      </h4>

                      {/* Instructions */}
                      <p style={{ fontSize: '11.5px', color: '#E0E7FF', margin: '0 0 8px 0', lineHeight: 1.45 }}>
                        {activeJanSuchna.instructions}
                      </p>

                      {/* Metadata Chips */}
                      <div style={{ fontSize: '10.5px', color: '#C7D2FE', lineHeight: 1.4, borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '6px' }}>
                        <span>Timing: <strong style={{ color: '#FFFFFF' }}>{activeJanSuchna.startTime} ({activeJanSuchna.duration})</strong></span>
                        <span style={{ margin: '0 4px' }}>•</span>
                        <span>Dept: <strong style={{ color: '#FFFFFF' }}>{activeJanSuchna.department}</strong></span>
                        <span style={{ margin: '0 4px' }}>•</span>
                        <span>Helpline: <strong style={{ color: '#FDE68A' }}>{activeJanSuchna.helpline}</strong></span>
                      </div>
                    </div>
                  )}

                  {/* RECENT NOTIFICATIONS LIST */}
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.04em' }}>
                    Recent Updates & Tickets
                  </div>

                  {relevantNotifications.length === 0 && !activeJanSuchna ? (
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '20px 0' }}>
                      No notifications yet.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {relevantNotifications.slice(0, 8).map((n) => {
                        const isJanSuchna = n.type === 'JAN_SUCHNA' || n.title?.includes('जन सूचना');

                        return (
                          <div
                            key={n.id}
                            style={{
                              padding: '10px 12px',
                              borderRadius: '12px',
                              background: isJanSuchna ? '#FEF3C7' : (n.read ? '#FFFFFF' : '#F0FDF4'),
                              border: isJanSuchna ? '1.5px solid #FCD34D' : `1px solid ${n.read ? '#E2E8F0' : '#BBF7D0'}`,
                              fontSize: '12px',
                              cursor: 'pointer',
                              transition: 'all 150ms ease'
                            }}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.link) navigate(n.link);
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                              <div style={{ fontWeight: 700, color: isJanSuchna ? '#92400E' : '#0F172A', fontSize: '12.5px' }}>
                                {n.title}
                              </div>
                              {isJanSuchna && (
                                <span style={{
                                  fontSize: '9.5px',
                                  fontWeight: 800,
                                  background: '#D97706',
                                  color: '#FFFFFF',
                                  padding: '1px 6px',
                                  borderRadius: '999px'
                                }}>
                                  ADVISORY
                                </span>
                              )}
                            </div>
                            <div style={{ color: isJanSuchna ? '#78350F' : '#475569', fontSize: '11.5px', lineHeight: 1.4 }}>
                              {n.message}
                            </div>
                            <div style={{ fontSize: '10px', color: isJanSuchna ? '#B45309' : '#94A3B8', marginTop: '4px' }}>
                              {n.timestamp || 'Just now'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick AI Assistant Trigger in Navbar */}
            <button
              type="button"
              onClick={() => {
                const launcher = document.getElementById('jansahayak-ai-launcher');
                if (launcher) launcher.click();
              }}
              className="header-ai-pill"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '999px',
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title="Open JanSahayak Gemini AI Assistant"
              aria-label="Open JanSahayak Gemini AI Assistant"
            >
              <Sparkles style={{ width: '13px', height: '13px', color: '#10B981', flexShrink: 0 }} />
              <span className="header-ai-pill-label" style={{ color: '#FFFFFF', whiteSpace: 'nowrap' }}>AI Sahayak</span>
            </button>

            {/* Action 3: User Account / Persona Switcher (Desktop Only) */}
            {user ? (
              <div ref={userMenuRef} className="hidden-mobile" style={{ position: 'relative' }}>
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
                        {role?.replace('_', ' ')} • {user.ward || user.department || 'Wagholi, Pune'}
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
                            to="/worker"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: '#065F46',
                              background: '#ECFDF5',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Wrench style={{ width: '14px', height: '14px', color: '#065F46' }} />
                              <span>Wagholi Worker Portal</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: '#065F46' }}>→</span>
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setShowUserMenu(false);
                              setShowFileGrievanceModal(true);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              color: 'var(--color-text-primary)',
                              background: '#F8FAFC',
                              border: '1px solid rgba(15, 23, 42, 0.06)',
                              cursor: 'pointer',
                              width: '100%',
                              textAlign: 'left'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Plus style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                              <span>File New Grievance (Popup)</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>+</span>
                          </button>
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
                            to="/officer/surveillance"
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
                              <Video style={{ width: '14px', height: '14px', color: '#059669' }} />
                              <span>Surveillance AI (CCTV)</span>
                            </div>
                            <span style={{
                              display: 'inline-block',
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: '#10B981',
                              boxShadow: '0 0 6px #10B981'
                            }} />
                          </Link>
                          <Link
                            to="/officer?section=investigation&subtab=workers"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: '#065F46',
                              background: '#ECFDF5',
                              border: '1px solid rgba(16, 185, 129, 0.25)',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Wrench style={{ width: '14px', height: '14px', color: '#065F46' }} />
                              <span>Field Worker Dispatch Hub</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: '#065F46' }}>→</span>
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
                              <span>City Administrator Console</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                          <Link
                            to="/admin/super?tab=departments"
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
                              <Building2 style={{ width: '14px', height: '14px', color: '#065F46' }} />
                              <span>Departments & Officers</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                        </>
                      )}

                      {role === 'worker' && (
                        <>
                          <Link
                            to="/worker"
                            onClick={() => setShowUserMenu(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '7px 10px',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '12px',
                              textDecoration: 'none',
                              color: '#B45309',
                              background: '#FFFBEB',
                              border: '1px solid rgba(217, 119, 6, 0.25)',
                              fontWeight: 600
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Wrench style={{ width: '14px', height: '14px', color: '#D97706' }} />
                              <span>Technician Job Console</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: '#D97706' }}>→</span>
                          </Link>
                          <Link
                            to="/citizen/find-worker"
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
                              <User style={{ width: '14px', height: '14px', color: '#065F46' }} />
                              <span>Browse Worker Directory</span>
                            </div>
                            <span style={{ fontSize: '10.5px', color: 'var(--color-text-muted)' }}>→</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Announcements & Profile Settings */}
                    <div style={{ height: '1px', background: 'var(--color-divider)', margin: '8px 0' }} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowUserMenu(false);
                          window.dispatchEvent(new CustomEvent('open-jansahayak-announcement', { detail: { manual: true } }));
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          padding: '7px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '12px',
                          color: '#0284C7',
                          background: '#F0F9FF',
                          border: '1px solid #BAE6FD',
                          textAlign: 'left',
                          cursor: 'pointer',
                          fontWeight: 600,
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Megaphone style={{ width: '13px', height: '13px', color: '#0284C7' }} />
                          <span>What's New & Updates</span>
                        </div>
                        <span style={{
                          fontSize: '9.5px',
                          fontWeight: 700,
                          background: '#0284C7',
                          color: '#FFFFFF',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          letterSpacing: '0.02em'
                        }}>
                          NEW
                        </span>
                      </button>

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
                          setProfileModalTab('worker');
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
                          color: '#065F46',
                          background: 'transparent',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        <Wrench style={{ width: '13px', height: '13px', color: '#065F46' }} />
                        <span>Worker Profile & Portal</span>
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
                        onClick={() => { logout(); setShowUserMenu(false); navigate('/login'); }}
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
                className="hidden-mobile"
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
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                background: mobileMenuOpen ? '#F1F5F9' : '#F8FAFC',
                border: '1px solid rgba(15, 23, 42, 0.10)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                flexShrink: 0
              }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X style={{ width: '17px', height: '17px' }} /> : <Menu style={{ width: '17px', height: '17px' }} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <>
            <div
              className="mobile-drawer-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className="mobile-drawer-container"
              style={{
                position: 'absolute',
                top: '58px',
                left: '4px',
                right: '4px',
                background: '#FFFFFF',
                borderRadius: '20px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 16px 40px rgba(15, 23, 42, 0.12)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                zIndex: 999,
                maxHeight: 'calc(100vh - 130px)',
                overflowY: 'auto'
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
                    to="/citizen/find-worker"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/citizen/find-worker' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      background: location.pathname === '/citizen/find-worker' ? '#F0FDF4' : '#F8FAFC'
                    }}
                  >
                    🔍 Find Worker
                  </Link>
                  <Link
                    to="/worker"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/worker' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                      background: location.pathname === '/worker' ? '#F0FDF4' : '#F8FAFC'
                    }}
                  >
                    🛠️ Worker Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => { setShowFileGrievanceModal(true); setMobileMenuOpen(false); }}
                    style={{
                      padding: '13px 16px',
                      borderRadius: '12px',
                      fontSize: '15px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                      boxShadow: '0 2px 12px rgba(37,99,235,0.30)',
                      letterSpacing: '0.01em'
                    }}
                  >
                    <Plus style={{ width: '17px', height: '17px' }} />
                    <span>File Grievance</span>
                  </button>
                </>
              )}

              {/* Civic Officer Mobile Links */}
              {user && (role === 'civic_officer' || role === 'officer' || role === 'dept_admin') && (
                <>
                  <Link
                    to="/officer"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#065F46',
                      background: '#ECFDF5',
                      border: '1px solid #A7F3D0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}
                  >
                    <Briefcase style={{ width: '16px', height: '16px', color: '#059669' }} />
                    <span>🏛️ Officer Workspace</span>
                  </Link>
                  <Link
                    to="/officer/surveillance"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname.startsWith('/officer/surveillance') ? '#059669' : 'var(--color-text-primary)',
                      background: location.pathname.startsWith('/officer/surveillance') ? '#ECFDF5' : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Video style={{ width: '16px', height: '16px', color: '#059669' }} />
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span>Surveillance AI</span>
                      <span style={{
                        display: 'inline-block',
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        background: '#10B981',
                        boxShadow: '0 0 6px #10B981'
                      }} />
                    </span>
                  </Link>
                  <Link
                    to="/intelligence"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname.startsWith('/intelligence') ? '#4338CA' : 'var(--color-text-primary)',
                      background: location.pathname.startsWith('/intelligence') ? '#EEF2FF' : '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Sparkles style={{ width: '16px', height: '16px', color: '#6366F1' }} />
                    <span>Civic Intelligence</span>
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
                      color: location.pathname === '/admin/super' && (!location.search || !location.search.includes('tab=departments')) ? '#065F46' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin/super' && (!location.search || !location.search.includes('tab=departments')) ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    🏛️ PMC City Command
                  </Link>
                  <Link
                    to="/admin/super?tab=departments"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin/super' && location.search.includes('tab=departments') ? '#065F46' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin/super' && location.search.includes('tab=departments') ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    🏢 Departments & Officers
                  </Link>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: location.pathname === '/admin' ? '#065F46' : 'var(--color-text-primary)',
                      background: location.pathname === '/admin' ? '#ECFDF5' : '#F8FAFC'
                    }}
                  >
                    🗺️ Ward Heatmap
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

                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setShowFileGrievanceModal(true);
                      }}
                      className="btn-primary"
                      style={{
                        flex: 1,
                        height: '42px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <span>Report Issue</span>
                      <ArrowRight style={{ width: '14px', height: '14px' }} />
                    </button>
                  </div>
                )}

                {/* Mobile Announcements & What's New */}
                <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-divider)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.dispatchEvent(new CustomEvent('open-jansahayak-announcement', { detail: { manual: true } }));
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0284C7',
                      background: '#F0F9FF',
                      border: '1.5px solid #BAE6FD',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Megaphone style={{ width: '15px', height: '15px', color: '#0284C7' }} />
                      <span>What's New & Announcements</span>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      background: '#0284C7',
                      color: '#FFFFFF',
                      padding: '2px 7px',
                      borderRadius: '999px'
                    }}>
                      NEW
                    </span>
                  </button>
                </div>

                {/* Mobile Profile & Settings Quick Buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: role === 'citizen' ? 'repeat(3, 1fr)' : '1fr 1fr', gap: '6px', marginTop: '8px' }}>
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
                      gap: '5px',
                      padding: '9px 6px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: 'var(--color-text-primary)',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      cursor: 'pointer'
                    }}
                  >
                    <User style={{ width: '13px', height: '13px', color: '#2563EB' }} />
                    <span>Profile</span>
                  </button>

                  {role === 'citizen' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setProfileModalTab('worker');
                        setShowProfileModal(true);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                        padding: '9px 6px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#065F46',
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        cursor: 'pointer'
                      }}
                    >
                      <Wrench style={{ width: '13px', height: '13px', color: '#065F46' }} />
                      <span>Worker</span>
                    </button>
                  )}

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
                      gap: '5px',
                      padding: '9px 6px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '12px',
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
                    onClick={() => { logout(); setMobileMenuOpen(false); navigate('/login'); }}
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
        </>
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
                  placeholder="e.g. PN-2026-WAG-0102"
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '7px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Mail style={{ width: '14px', height: '14px', color: '#059669', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '9px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Email / Username</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {currentLoginRole.email}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FFFFFF', padding: '7px 10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <Lock style={{ width: '14px', height: '14px', color: '#059669', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '9px', color: '#64748B', display: 'block', textTransform: 'uppercase', fontWeight: 700 }}>Password</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#0F172A', display: 'block', fontFamily: 'monospace' }}>
                    {currentLoginRole.password}
                  </span>
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
                    background: 'linear-gradient(90deg, #059669, #10B981)',
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
                background: loginIsVerifying ? '#94A3B8' : '#059669',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13.5px',
                fontWeight: 700,
                cursor: loginIsVerifying ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loginIsVerifying ? 'none' : '0 4px 14px rgba(5, 150, 105, 0.35)',
                transition: 'all 150ms ease'
              }}
            >
              {loginIsVerifying ? (
                <span>Verifying... ({Math.round(loginVerifyProgress)}%)</span>
              ) : (
                <>
                  <span>Login as {currentLoginRole.label}</span>
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

      {/* Quick Interactive File Grievance Modal */}
      <FileGrievanceModal
        isOpen={showFileGrievanceModal}
        onClose={() => setShowFileGrievanceModal(false)}
      />

      {/* Universal User Profile & Account Settings Modal (Works across all roles) */}
      <UserProfileModal 
        isOpen={showProfileModal} 
        onClose={() => setShowProfileModal(false)} 
        initialTab={profileModalTab} 
      />
    </>
  );
}
