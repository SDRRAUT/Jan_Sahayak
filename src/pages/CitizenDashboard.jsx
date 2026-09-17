import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  ThumbsUp, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Filter,
  User,
  Shield,
  Radio,
  Sparkles,
  Bell,
  FileText,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import WhyExplainer from '../components/common/WhyExplainer';
import CivicSignalModal from '../components/intelligence/CivicSignalModal';
import FileGrievanceModal from '../components/common/FileGrievanceModal';
import citizenBg from '../assets/citizen-bg.jpg';

export default function CitizenDashboard() {
  const { 
    grievances = [], 
    upvoteGrievance, 
    user, 
    token, 
    currentCitizen: contextCitizen, 
    civicIncidents = [],
    notifications: contextNotifs = [],
    markNotificationAsRead
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'my' | 'verification' | 'active' | 'resolved' | 'notifications'
  const [searchQuery, setSearchQuery] = useState('');
  const [showSignalModal, setShowSignalModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const citizen = user || contextCitizen || {
    id: 'USR-CITIZEN-01',
    name: 'Aditya Verma',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085',
    phone: '+91 98712-88210'
  };

  // Real backend query for Citizen Dashboard
  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        setIsLoading(true);
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
        const res = await fetch('/api/citizen/dashboard', { headers });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.success) {
            setDashboardData(data);
          }
        }
      } catch (err) {
        console.warn('Could not fetch /api/citizen/dashboard, using synchronized context:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchDashboard();
    return () => { isMounted = false; };
  }, [token, grievances.length]);

  // Real reports belonging to this citizen
  const myReports = dashboardData?.myReports || grievances.filter(g => 
    g.citizenId === citizen.id || 
    (g.citizenName && citizen.name && g.citizenName.toLowerCase() === citizen.name.toLowerCase())
  );

  // Reports needing citizen's verification
  const pendingVerificationReports = myReports.filter(g => g.status === 'RESOLVED');

  // Real notifications
  const citizenNotifications = dashboardData?.notifications || contextNotifs.filter(n => 
    n.userRole === 'citizen' || n.userId === citizen.id
  );

  // Dynamic active incident in ward
  const activeWardIncident = (dashboardData?.wardIncidents && dashboardData.wardIncidents.length > 0)
    ? dashboardData.wardIncidents[0]
    : civicIncidents.find(inc => 
        inc.location?.ward === citizen.ward || 
        (inc.affectedWards && inc.affectedWards.some(w => citizen.ward && citizen.ward.includes(w)))
      ) || civicIncidents[0];

  // Dynamic time-of-day greeting
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';

  // Filtered grievances list
  const filteredGrievances = (grievances || []).filter(g => {
    const title = g?.title || '';
    const desc = g?.descriptionRaw || '';
    const id = g?.id || '';
    const dept = g?.department || '';
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          dept.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'my') {
      return g.citizenId === citizen.id || (g.citizenName && citizen.name && g.citizenName.toLowerCase() === citizen.name.toLowerCase());
    }
    if (activeTab === 'verification') {
      return g.status === 'RESOLVED' && (g.citizenId === citizen.id || (g.citizenName && citizen.name && g.citizenName.toLowerCase() === citizen.name.toLowerCase()));
    }
    if (activeTab === 'active') {
      return g?.status !== 'RESOLVED' && g?.status !== 'RESOLVED_CONFIRMED';
    }
    if (activeTab === 'resolved') {
      return g?.status === 'RESOLVED' || g?.status === 'RESOLVED_CONFIRMED';
    }
    return true;
  });

  return (
    <div style={{ position: 'relative', minHeight: 'calc(100vh - 72px)', background: 'var(--color-bg-base)', paddingBottom: '60px' }}>
      {/* Background civic problems montage with low opacity */}
      <div 
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${citizenBg})`,
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          opacity: 0.14,
          pointerEvents: 'none',
          zIndex: 0,
          filter: 'contrast(105%) saturate(110%)'
        }}
      />
      {/* Soft gradient wash ensuring high legibility for cards and text */}
      <div 
        aria-hidden="true"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(248, 250, 252, 0.45) 0%, rgba(241, 245, 249, 0.65) 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      <div className="section-spacing" style={{ paddingTop: '32px', position: 'relative', zIndex: 1 }}>
        <div className="container">
          {/* Profile and Action Top Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px',
            paddingBottom: '20px',
            borderBottom: '1px solid var(--color-divider)'
          }}>
            <div>
              <div className="category-pill" style={{ marginBottom: '8px' }}>
                CITIZEN ACCESS PORTAL
              </div>
              <h1 style={{ fontSize: '32px', color: 'var(--color-text-primary)' }}>
                {greeting}, {citizen.name?.split(' ')[0] || 'Citizen'} 👋
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <MapPin style={{ width: '14px', height: '14px', color: 'var(--color-primary)' }} />
                Registered in: <strong>{citizen.ward || 'Ward 14'}</strong> • PIN: {citizen.pincode || '110085'}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => setShowFileModal(true)} className="btn-primary" style={{ height: '42px', fontSize: '13px' }}>
                <Plus style={{ width: '16px', height: '16px' }} />
                <span>File Grievance</span>
              </button>
            </div>
          </div>

          {/* Pending Verification Notice Banner (If citizen has reports needing review) */}
          {pendingVerificationReports.length > 0 && (
            <div style={{
              padding: '16px 20px',
              borderRadius: 'var(--radius-lg)',
              background: '#FFFBEB',
              border: '1px solid #FCD34D',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF3C7', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield style={{ width: '20px', height: '20px' }} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#92400E', display: 'block' }}>
                    Action Required: {pendingVerificationReports.length} {pendingVerificationReports.length === 1 ? 'Report Marked Resolved' : 'Reports Marked Resolved'}
                  </strong>
                  <span style={{ fontSize: '12.5px', color: '#78350F' }}>
                    Field crew reported work complete. Please verify ground reality to close the municipal accountability loop.
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('verification')}
                className="btn-primary btn-sm"
                style={{ background: '#D97706', borderColor: '#B45309' }}
              >
                Review Resolution Now
              </button>
            </div>
          )}

          {/* Real Neighborhood Coordinated Investigation Alert Banner */}
          {activeWardIncident && (
            <div style={{
              padding: '14px 18px',
              borderRadius: 'var(--radius-lg)',
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles style={{ width: '18px', height: '18px', color: 'var(--color-primary)', flexShrink: 0 }} />
                <div>
                  <strong style={{ fontSize: '13.5px', color: '#065F46', display: 'block' }}>
                    Neighborhood Intelligence Notice: Active Coordinated Investigation
                  </strong>
                  <span style={{ fontSize: '12px', color: '#047857' }}>
                    {activeWardIncident.title} • {activeWardIncident.signalCount || activeWardIncident.relatedGrievanceIds?.length || 1} complaints correlated in your ward. Authorities mobilized.
                  </span>
                </div>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                background: '#DCFCE7',
                color: '#166534',
                fontSize: '11.5px',
                fontWeight: 700
              }}>
                <CheckCircle2 style={{ width: '13px', height: '13px' }} />
                <span>Unified Response Active</span>
              </div>
            </div>
          )}

          {/* Quick Metric Tiles (Calculated from real database records) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '32px'
          }}>
            <div 
              className="card card-interactive" 
              onClick={() => setActiveTab('my')}
              style={{ padding: '20px', cursor: 'pointer', border: activeTab === 'my' ? '2px solid var(--color-primary)' : '1px solid var(--color-border-subtle)' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                My Reports
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--color-primary)', marginTop: '6px' }}>
                {myReports.length}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--color-primary)' }}>Your Submissions</span>
            </div>

            <div 
              className="card card-interactive" 
              onClick={() => setActiveTab('verification')}
              style={{ padding: '20px', cursor: 'pointer', border: activeTab === 'verification' ? '2px solid #F59E0B' : '1px solid var(--color-border-subtle)' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Needs My Verification
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#D97706', marginTop: '6px' }}>
                {pendingVerificationReports.length}
              </div>
              <span style={{ fontSize: '11px', color: '#D97706' }}>Citizen Loop Closure</span>
            </div>

            <div 
              className="card card-interactive" 
              onClick={() => setActiveTab('active')}
              style={{ padding: '20px', cursor: 'pointer', border: activeTab === 'active' ? '2px solid #3B82F6' : '1px solid var(--color-border-subtle)' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                In Progress
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#2563EB', marginTop: '6px' }}>
                {grievances.filter(g => g.status !== 'RESOLVED' && g.status !== 'RESOLVED_CONFIRMED').length}
              </div>
              <span style={{ fontSize: '11px', color: '#2563EB' }}>Active Field Repair</span>
            </div>

            <div 
              className="card card-interactive" 
              onClick={() => setActiveTab('resolved')}
              style={{ padding: '20px', cursor: 'pointer', border: activeTab === 'resolved' ? '2px solid #10B981' : '1px solid var(--color-border-subtle)' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Resolved Cases
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#059669', marginTop: '6px' }}>
                {grievances.filter(g => g.status === 'RESOLVED' || g.status === 'RESOLVED_CONFIRMED').length}
              </div>
              <span style={{ fontSize: '11px', color: '#059669' }}>Ground Verified</span>
            </div>

            <div 
              className="card card-interactive" 
              onClick={() => setActiveTab('notifications')}
              style={{ padding: '20px', cursor: 'pointer', border: activeTab === 'notifications' ? '2px solid #8B5CF6' : '1px solid var(--color-border-subtle)' }}
            >
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                System Events
              </span>
              <div style={{ fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#7C3AED', marginTop: '6px' }}>
                {citizenNotifications.length}
              </div>
              <span style={{ fontSize: '11px', color: '#7C3AED' }}>Live Notifications</span>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '24px'
          }}>
            {/* Tab buttons */}
            <div style={{
              display: 'flex',
              background: '#F1F5F9',
              padding: '4px',
              borderRadius: '9999px',
              gap: '4px',
              flexWrap: 'wrap'
            }}>
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: activeTab === 'all' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'all' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'all' ? 'var(--shadow-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                All Ward Reports ({grievances.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('my')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: activeTab === 'my' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'my' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'my' ? 'var(--shadow-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                My Reports ({myReports.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('verification')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: activeTab === 'verification' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'verification' ? '#D97706' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'verification' ? 'var(--shadow-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Needs Verification ({pendingVerificationReports.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('active')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: activeTab === 'active' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'active' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'active' ? 'var(--shadow-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                In Progress
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('resolved')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: activeTab === 'resolved' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'resolved' ? '#059669' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'resolved' ? 'var(--shadow-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Resolved
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notifications')}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  background: activeTab === 'notifications' ? '#FFFFFF' : 'transparent',
                  color: activeTab === 'notifications' ? '#7C3AED' : 'var(--color-text-secondary)',
                  boxShadow: activeTab === 'notifications' ? 'var(--shadow-xs)' : 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Bell style={{ width: '13px', height: '13px' }} />
                <span>Events ({citizenNotifications.length})</span>
              </button>
            </div>

            {/* Search input */}
            {activeTab !== 'notifications' && (
              <div style={{ position: 'relative', width: '280px' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search complaints, ID, department..."
                  style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '9999px',
                    border: '1px solid var(--color-border-medium)',
                    paddingLeft: '36px',
                    paddingRight: '16px',
                    fontSize: '13px',
                    background: '#FFFFFF'
                  }}
                />
              </div>
            )}
          </div>

          {/* Tab Content: Notifications Panel */}
          {activeTab === 'notifications' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}>
                  Real-time Municipal Notifications & Timeline Events
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  Total: {citizenNotifications.length}
                </span>
              </div>

              {citizenNotifications.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                  <Bell style={{ width: '32px', height: '32px', color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>No system notifications for your account yet.</p>
                </div>
              ) : (
                citizenNotifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className="card"
                    style={{
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '16px',
                      borderLeft: notif.type === 'STATUS_UPDATE' ? '4px solid #10B981' : (notif.type === 'DISPUTE' ? '4px solid #EF4444' : '4px solid var(--color-primary)')
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>{notif.title}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>• {notif.createdAt || 'Just now'}</span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.4 }}>
                        {notif.message}
                      </p>
                    </div>
                    {notif.grievanceId && (
                      <Link 
                        to={`/citizen/complaints/${notif.grievanceId}`}
                        className="btn-secondary btn-sm"
                        style={{ flexShrink: 0 }}
                      >
                        View Ticket
                      </Link>
                    )}
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Grievances List */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredGrievances.length === 0 ? (
                <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
                  <FileText style={{ width: '36px', height: '36px', color: 'var(--color-text-muted)', margin: '0 auto 12px' }} />
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '15px' }}>No reports match the selected filter.</p>
                  {activeTab === 'my' && (
                    <button onClick={() => setShowFileModal(true)} className="btn-primary" style={{ marginTop: '16px', display: 'inline-flex' }}>
                      <Plus style={{ width: '16px', height: '16px' }} />
                      <span>Submit Your First Report</span>
                    </button>
                  )}
                </div>
              ) : (
                filteredGrievances.map((item) => (
                  <div
                    key={item.id}
                    className="card card-interactive"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '20px'
                    }}
                  >
                    {/* Info block */}
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                        <span className="font-mono-numbers" style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
                          {item.id}
                        </span>
                        <span className="category-pill" style={{ height: '22px', fontSize: '10px' }}>
                          {item.department || 'Civic Services'}
                        </span>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' ? '#ECFDF5' : (item.urgency === 'CRITICAL' ? '#FEF2F2' : '#FFFBEB'),
                          color: item.status === 'RESOLVED' || item.status === 'RESOLVED_CONFIRMED' ? '#065F46' : (item.urgency === 'CRITICAL' ? '#991B1B' : '#92400E')
                        }}>
                          ● {(item.status || 'IN_PROGRESS').replace('_', ' ')}
                        </span>
                        <WhyExplainer
                          label="Why?"
                          title="Why this Priority?"
                          reasons={[
                            'Severity classified from citizen report',
                            `Ward: ${item.location?.ward || 'Ward Area'}`,
                            'Municipal SLA monitoring active'
                          ]}
                          align="left"
                        />
                        {item.clusterCount > 1 && (
                          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-primary)', background: 'var(--color-accent-tint)', padding: '2px 8px', borderRadius: '9999px' }}>
                            Cluster: {item.clusterCount} linked reports
                          </span>
                        )}
                        {(item.citizenId === citizen.id || (item.citizenName && citizen.name && item.citizenName.toLowerCase() === citizen.name.toLowerCase())) && (
                          <span style={{ fontSize: '10.5px', fontWeight: 700, color: '#1E40AF', background: '#DBEAFE', padding: '2px 8px', borderRadius: '9999px' }}>
                            👤 Filed By You
                          </span>
                        )}
                      </div>

                      <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>
                        <Link to={`/citizen/complaints/${item.id}`} style={{ color: 'inherit' }}>
                          {item.title}
                        </Link>
                      </h3>

                      <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5, marginBottom: '10px', maxWidth: '680px' }}>
                        "{(item.descriptionRaw || item.title || '').substring(0, 140)}..."
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin style={{ width: '13px', height: '13px' }} />
                          {item.location?.area || 'Ward Area'}, {item.location?.ward || ''}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock style={{ width: '13px', height: '13px' }} />
                          SLA: {item.slaDeadline || '24h'}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button
                        onClick={() => upvoteGrievance(item.id)}
                        className="btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        title="Endorse this issue in your ward"
                      >
                        <ThumbsUp style={{ width: '14px', height: '14px' }} />
                        <span>Upvote ({item.upvotes || 1})</span>
                      </button>

                      <Link
                        to={`/citizen/complaints/${item.id}`}
                        className="btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span>{item.status === 'RESOLVED' ? 'Verify Fix' : 'Track Status'}</span>
                        <ArrowRight className="btn-arrow" style={{ width: '14px', height: '14px' }} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Civic Signal Modal for quick signals */}
      {showSignalModal && (
        <CivicSignalModal 
          isOpen={showSignalModal}
          onClose={() => setShowSignalModal(false)}
        />
      )}

      {/* 4-Step File Grievance Popup Modal */}
      <FileGrievanceModal
        isOpen={showFileModal}
        onClose={() => setShowFileModal(false)}
      />
    </div>
  );
}
