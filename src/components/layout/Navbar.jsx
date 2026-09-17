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
      <header
        style={{
          maxWidth: '1200px',
          height: isScrolled ? '54px' : '62px',
          margin: isScrolled ? '8px auto' : '16px auto',
          padding: '0 20px',
          borderRadius: '9999px',
          background: 'rgba(255, 255, 255, 0.94)',
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
        {/* Brand Logo: JanSahayak */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: 'var(--color-text-primary)' }}>
              JanSahayak
            </span>
          </div>
        </Link>

        {/* Clean Primary Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="hidden-mobile">
          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--color-text-secondary)',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'transparent',
              transition: 'all 150ms ease'
            }}
          >
            How it Works
          </button>

          <Link
            to="/citizen"
            style={{
              fontSize: '13px',
              fontWeight: location.pathname.startsWith('/citizen') ? 700 : 500,
              color: location.pathname.startsWith('/citizen') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: location.pathname.startsWith('/citizen') ? '#F1F5F9' : 'transparent',
              transition: 'all 150ms ease'
            }}
          >
            For Citizens
          </Link>

          <Link
            to="/officer"
            style={{
              fontSize: '13px',
              fontWeight: location.pathname.startsWith('/officer') ? 700 : 500,
              color: location.pathname.startsWith('/officer') ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: location.pathname.startsWith('/officer') ? '#F1F5F9' : 'transparent',
              transition: 'all 150ms ease'
            }}
          >
            For Authorities
          </Link>

          <Link
            to="/impact"
            style={{
              fontSize: '13px',
              fontWeight: location.pathname === '/impact' ? 700 : 500,
              color: location.pathname === '/impact' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: location.pathname === '/impact' ? '#F1F5F9' : 'transparent',
              transition: 'all 150ms ease'
            }}
          >
            Impact
          </Link>
        </nav>

        {/* Right Action Cluster */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Action 1: Track Grievance */}
          <button
            type="button"
            onClick={() => setShowTrackModal(true)}
            style={{
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--color-text-secondary)',
              padding: '6px 12px',
              borderRadius: '9999px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent'
            }}
            className="hidden-mobile"
          >
            <Search style={{ width: '14px', height: '14px' }} />
            <span>Track Grievance</span>
          </button>

          {/* Action 2: Report a Problem (Primary CTA) */}
          <Link
            to="/citizen/submit"
            className="btn-primary btn-sm"
            style={{
              height: '36px',
              fontSize: '13px',
              padding: '0 16px',
              borderRadius: '9999px'
            }}
          >
            <span>Report a Problem</span>
            <ArrowRight style={{ width: '13px', height: '13px' }} />
          </Link>

          {/* Notifications Bell (if user is active) */}
          <div ref={notificationRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: showNotifications ? '#F1F5F9' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text-secondary)',
                position: 'relative'
              }}
              title="Notifications"
            >
              <Bell style={{ width: '17px', height: '17px' }} />
              {unreadNotificationCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#EF4444'
                }} />
              )}
            </button>

            {/* Notification Popover */}
            {showNotifications && (
              <div
                style={{
                  position: 'absolute',
                  top: '44px',
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

          {/* Action 3: User Account or Login Modal Button */}
          {user ? (
            <div ref={userMenuRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 8px 4px 4px',
                  borderRadius: '9999px',
                  background: '#F1F5F9',
                  border: '1px solid rgba(15,23,42,0.06)'
                }}
              >
                <div style={{
                  width: '28px',
                  height: '28px',
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
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-primary)' }} className="hidden-mobile">
                  {user.name ? user.name.split(' ')[0] : 'Account'}
                </span>
                <ChevronDown style={{ width: '12px', height: '12px', color: 'var(--color-text-muted)' }} />
              </button>

              {showUserMenu && (
                <div
                  style={{
                    position: 'absolute',
                    top: '42px',
                    right: 0,
                    width: '240px',
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
                    Switch Persona:
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleRoleLogin('citizen')}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        textAlign: 'left',
                        background: role === 'citizen' ? '#F0FDF4' : 'transparent',
                        color: role === 'citizen' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        fontWeight: role === 'citizen' ? 600 : 400
                      }}
                    >
                      👤 Citizen (Aditya Verma)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleLogin('officer')}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        textAlign: 'left',
                        background: role === 'officer' ? '#F0FDF4' : 'transparent',
                        color: role === 'officer' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        fontWeight: role === 'officer' ? 600 : 400
                      }}
                    >
                      🛠 Government Officer (Er. Sanjay Sharma)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRoleLogin('dept_admin')}
                      style={{
                        padding: '6px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '12px',
                        textAlign: 'left',
                        background: role === 'dept_admin' ? '#F0FDF4' : 'transparent',
                        color: role === 'dept_admin' ? 'var(--color-primary)' : 'var(--color-text-primary)',
                        fontWeight: role === 'dept_admin' ? 600 : 400
                      }}
                    >
                      🏛 Dept Administrator (Er. Rajiv Malhotra)
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
                padding: '6px 14px',
                borderRadius: '9999px',
                border: '1px solid var(--color-border-medium)',
                background: '#FFFFFF'
              }}
            >
              Login
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              padding: '6px',
              display: 'none',
              color: 'var(--color-text-primary)'
            }}
            className="mobile-hamburger"
          >
            {mobileMenuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
          </button>
        </div>
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
