import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { INITIAL_GRIEVANCES, MOCK_CLUSTERS, SYSTEM_METRICS, INITIAL_NOTIFICATIONS } from '../data/mockGrievances';
import { CIVIC_INCIDENTS, CIVIC_SIGNALS, CIVIC_INTELLIGENCE_METRICS } from '../data/civicIntelligenceData';
import { analyzeGrievanceInput } from '../services/aiEngine';
import { ComplaintDNAService, IncidentClusteringService, ActionSimulationService } from '../services/civicIntelligenceService';
import { ComplaintService } from '../services/ComplaintService';
import { IncidentService } from '../services/IncidentService';
import { NotificationService } from '../services/NotificationService';
import { CANONICAL_STATUSES, normalizeStatus } from '../utils/statuses';
import { CANONICAL_EVENTS } from '../utils/events';
import { hasPermission, getRoleLabel, PERMISSIONS, ROLES } from '../utils/permissions';
import { INITIAL_WORKERS, INITIAL_WORKER_ORDERS, WORKER_CATEGORIES } from '../data/mockWorkers';
import { calculateEstimatedFare } from '../services/fareEstimationService';
import { detectWorkerCategoryFromComplaint, matchWorkersForComplaint } from '../services/workerMatchingService';
import { SURVEILLANCE_HOTSPOTS, INITIAL_SURVEILLANCE_INCIDENTS, SURVEILLANCE_AUTHORITIES, SURVEILLANCE_STATUSES } from '../data/surveillanceData';

const AppContext = createContext();

// Pre-seeded credentials for instant 1-click persona switching (3 Primary Roles)
export const DEMO_CREDENTIALS = {
  citizen: { email: 'santosh@citizen.in', password: 'citizen123', label: 'Citizen (Santosh Gawade)' },
  civic_officer: { email: 'civic.officer@pmc.punecorp.gov.in', password: 'civicofficer123', label: 'Civic Officer (Er. Sanjay Sharma - PMC Water)' },
  super_admin: { email: 'superadmin@pmc.pune.gov.in', password: 'superadmin123', label: 'Super Admin (Dr. Suhas Diwase, IAS)' },
  worker: { email: 'ramesh.plumbing@jansahayak.in', password: 'worker123', label: 'Technician (Ramesh Jadhav - PMC Certified Plumber)' },
  // Backward-compatible aliases for legacy credentials
  officer: { email: 'civic.officer@pmc.punecorp.gov.in', password: 'civicofficer123', label: 'Civic Officer (Field Engineering Lead)' },
  dept_admin: { email: 'civic.officer@pmc.punecorp.gov.in', password: 'civicofficer123', label: 'Civic Officer (Department Operations Lead)' }
};

// Pre-seeded Jan Suchna (जन सूचना) Public Advisories
export const INITIAL_JAN_SUCHNA = [
  {
    id: 'JS-2026-001',
    title: '⚡ 4-Hour Scheduled Electricity Grid Maintenance — Wagholi Sub-Division',
    category: 'Electricity / Power Grid',
    ward: 'Wagholi Sub-Division (Wards 27-31, Pune)',
    affectedAreas: ['Wagholi Sub-Division', 'Ivy Estate', 'Baif Road Market', 'Kesnand Road'],
    startTime: 'Today, 10:00 AM',
    endTime: '02:00 PM',
    duration: '4 Hours',
    status: 'ACTIVE',
    severity: 'HIGH',
    department: 'MSEDCL Wagholi Sub-Division',
    officerName: 'Er. Sanjay Sharma',
    officerDesignation: 'Executive Engineer',
    instructions: 'Sub-station transformer upgrade underway. High-voltage backup systems active for medical centers. Please keep essential devices charged.',
    helpline: '1912 / 1800-233-3435 (MSEDCL 24x7 Helpline)',
    createdAt: new Date().toISOString()
  },
  {
    id: 'JS-2026-002',
    title: '💧 Potable Water Trunkline Electrofusion Coupling & Pressure Testing',
    category: 'Water Supply',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
    affectedAreas: ['Ivy Estate Gate 1 & 2', 'Kesnand Road', 'Lexicon School Lane'],
    startTime: 'Tomorrow, 06:00 AM',
    endTime: '09:00 AM',
    duration: '3 Hours',
    status: 'SCHEDULED',
    severity: 'MEDIUM',
    department: 'PMC Water Supply Department',
    officerName: 'Er. Sanjay Sharma',
    officerDesignation: 'Executive Engineer (Water Works)',
    instructions: 'Water supply will be regulated for 3 hours to perform pressure stabilization. Complimentary PMC water tankers dispatched on standby.',
    helpline: '020-25501000 / 1800-1030-222 (PMC Citizen Care)',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Full profile objects for offline and instant demo switching
export const DEMO_USERS = {
  citizen: {
    id: 'USR-CITIZEN-01',
    name: 'Santosh Gawade',
    email: 'santosh@citizen.in',
    role: 'citizen',
    phone: '+91 98220-44102',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
    pincode: '412207',
    address: 'Ivy Estate, Kesnand Road, Wagholi, Pune',
    verified: true
  },
  civic_officer: {
    id: 'USR-CIVICOFFICER-01',
    name: 'Er. Sanjay Sharma',
    email: 'officer.pmc@pune.gov.in',
    role: 'civic_officer',
    department: 'PMC Water Supply Department',
    designation: 'Executive Engineer (Wagholi Sub-Division)',
    zone: 'Zone East (Wagholi Sub-Division, Pune)',
    phone: '+91 98221-90021'
  },
  officer: {
    id: 'USR-OFFICER-01',
    name: 'Er. Sanjay Sharma',
    email: 'sanjay.sharma@pmc.gov.in',
    role: 'civic_officer',
    department: 'PMC Water Supply Department',
    designation: 'Executive Engineer (Wagholi Sub-Division)',
    zone: 'Zone East (Wagholi Sub-Division, Pune)',
    phone: '+91 98221-90021'
  },
  dept_admin: {
    id: 'USR-DEPTADMIN-01',
    name: 'Er. Sachin Patil',
    email: 'admin.water@pune.gov.in',
    role: 'civic_officer',
    department: 'PMC Water Supply Department',
    designation: 'Superintending Engineer (Water Works)',
    phone: '+91 98220-11223'
  },
  super_admin: {
    id: 'USR-SUPERADMIN-01',
    name: 'Dr. Suhas Diwase, IAS',
    email: 'commissioner@pmc.gov.in',
    role: 'super_admin',
    designation: 'Municipal Commissioner (PMC Pune)',
    phone: '+91 020-2550-1000'
  },
  worker: {
    id: 'WRK-WAG-01',
    name: 'Ramesh Jadhav',
    email: 'ramesh.plumbing@jansahayak.in',
    role: 'worker',
    phone: '+91 98221-55410',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
    pincode: '412207',
    category: 'plumbing',
    categoryLabel: 'Plumbing & Water Supply',
    workerProfile: INITIAL_WORKERS[0],
    verified: true
  }
};

export function AppProvider({ children }) {
  // Session & User State (Clean start for first-time visitors)
  const [token, setToken] = useState(() => localStorage.getItem('jansahayk_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      localStorage.removeItem('jansahayk_user');
      return null;
    }
  });

  const [grievances, setGrievances] = useState(() => {
    try {
      localStorage.removeItem('jansahayk_grievances_v6');
      localStorage.removeItem('jansahayk_grievances_v5');
      localStorage.removeItem('jansahayk_grievances_v4');
      localStorage.removeItem('jansahayk_grievances');
    } catch (e) {}
    const saved = localStorage.getItem('jansahayk_grievances_v7');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasJunk = Array.isArray(parsed) && parsed.some(g => !g.id || g.id.startsWith('TEST-') || g.title === 'adsdasdda' || g.title === 'हेलो' || g.id.includes('DL-2026'));
        if (Array.isArray(parsed) && !hasJunk && parsed.length >= INITIAL_GRIEVANCES.length) {
          return parsed;
        }
      } catch (e) {}
    }
    localStorage.setItem('jansahayk_grievances_v7', JSON.stringify(INITIAL_GRIEVANCES));
    return INITIAL_GRIEVANCES;
  });

  const [clusters, setClusters] = useState(() => {
    try {
      localStorage.removeItem('jansahayk_clusters_v6');
      localStorage.removeItem('jansahayk_clusters_v5');
      localStorage.removeItem('jansahayk_clusters_v4');
      localStorage.removeItem('jansahayk_clusters');
    } catch (e) {}
    const saved = localStorage.getItem('jansahayk_clusters_v7');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacy = Array.isArray(parsed) && parsed.some(c => c.id && c.id.includes('DEL'));
        if (Array.isArray(parsed) && !hasLegacy && parsed.length >= MOCK_CLUSTERS.length) return parsed;
      } catch (e) {}
    }
    localStorage.setItem('jansahayk_clusters_v7', JSON.stringify(MOCK_CLUSTERS));
    return MOCK_CLUSTERS;
  });

  const [civicIncidents, setCivicIncidents] = useState(() => {
    try {
      localStorage.removeItem('jansahayk_incidents');
      localStorage.removeItem('jansahayk_incidents_v7');
    } catch (e) {}
    const saved = localStorage.getItem('jansahayk_incidents_v8');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacy = Array.isArray(parsed) && parsed.some(inc => (inc.id && inc.id.includes('DEL')) || (inc.spreadGeo && inc.spreadGeo.some(p => p.lat > 20)));
        if (Array.isArray(parsed) && !hasLegacy) return parsed;
      } catch (e) {}
    }
    localStorage.setItem('jansahayk_incidents_v8', JSON.stringify(CIVIC_INCIDENTS));
    return CIVIC_INCIDENTS;
  });

  const [civicSignals, setCivicSignals] = useState(() => {
    try {
      localStorage.removeItem('jansahayk_signals');
      localStorage.removeItem('jansahayk_signals_v7');
    } catch (e) {}
    const saved = localStorage.getItem('jansahayk_signals_v8');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hasLegacy = Array.isArray(parsed) && parsed.some(sig => (sig.id && sig.id.includes('2026-00')) || sig.lat > 20);
        if (Array.isArray(parsed) && !hasLegacy) return parsed;
      } catch (e) {}
    }
    localStorage.setItem('jansahayk_signals_v8', JSON.stringify(CIVIC_SIGNALS));
    return CIVIC_SIGNALS;
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_notifications_v7');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some(n => n.grievanceId && n.grievanceId.includes('DL-'))) {
          return parsed;
        }
      }
    } catch (e) {}
    localStorage.setItem('jansahayk_notifications_v7', JSON.stringify(INITIAL_NOTIFICATIONS));
    return INITIAL_NOTIFICATIONS;
  });

  const [janSuchnaList, setJanSuchnaList] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_jan_suchna_v7');
      return saved ? JSON.parse(saved) : INITIAL_JAN_SUCHNA;
    } catch (e) {
      return INITIAL_JAN_SUCHNA;
    }
  });

  useEffect(() => {
    localStorage.setItem('jansahayk_jan_suchna_v7', JSON.stringify(janSuchnaList));
  }, [janSuchnaList]);

  // Worker Marketplace State (Persisted locally)
  const [workers, setWorkers] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_workers_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem('jansahayk_workers_v1', JSON.stringify(INITIAL_WORKERS));
    return INITIAL_WORKERS;
  });

  const [workerOrders, setWorkerOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_worker_orders_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem('jansahayk_worker_orders_v1', JSON.stringify(INITIAL_WORKER_ORDERS));
    return INITIAL_WORKER_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('jansahayk_workers_v1', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('jansahayk_worker_orders_v1', JSON.stringify(workerOrders));
  }, [workerOrders]);

  // Autonomous Two-Agent Surveillance & Evidence Pipeline State
  const [surveillanceHotspots, setSurveillanceHotspots] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_surveillance_hotspots_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem('jansahayk_surveillance_hotspots_v1', JSON.stringify(SURVEILLANCE_HOTSPOTS));
    return SURVEILLANCE_HOTSPOTS;
  });

  const [surveillanceIncidents, setSurveillanceIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_surveillance_incidents_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    localStorage.setItem('jansahayk_surveillance_incidents_v1', JSON.stringify(INITIAL_SURVEILLANCE_INCIDENTS));
    return INITIAL_SURVEILLANCE_INCIDENTS;
  });

  const [activeSurveillanceHotspot, setActiveSurveillanceHotspot] = useState('HOTSPOT-WAG-01');

  useEffect(() => {
    try {
      localStorage.setItem('jansahayk_surveillance_hotspots_v1', JSON.stringify(surveillanceHotspots));
    } catch (e) {}
  }, [surveillanceHotspots]);

  useEffect(() => {
    try {
      localStorage.setItem('jansahayk_surveillance_incidents_v1', JSON.stringify(surveillanceIncidents));
    } catch (e) {}
  }, [surveillanceIncidents]);

  const [auditLogs, setAuditLogs] = useState([]);
  const [slaRules, setSlaRules] = useState([]);
  const [authError, setAuthError] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Onboarding & App Entry State (controls full-screen onboarding before entering app)
  const [hasEnteredApp, setHasEnteredApp] = useState(() => {
    return Boolean(
      localStorage.getItem('jansahayk_entered_app') === 'true' ||
      localStorage.getItem('jansahayk_token')
    );
  });

  const enterApp = () => {
    localStorage.setItem('jansahayk_entered_app', 'true');
    setHasEnteredApp(true);
  };

  const exitToOnboarding = () => {
    localStorage.removeItem('jansahayk_entered_app');
    setHasEnteredApp(false);
  };

  // Sync state to local storage
  useEffect(() => {
    if (token) {
      localStorage.setItem('jansahayk_token', token);
      localStorage.setItem('jansahayk_entered_app', 'true');
      setHasEnteredApp(true);
    } else {
      localStorage.removeItem('jansahayk_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('jansahayk_user', JSON.stringify(user));
    else localStorage.removeItem('jansahayk_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jansahayk_grievances_v7', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('jansahayk_clusters_v7', JSON.stringify(clusters));
  }, [clusters]);

  useEffect(() => {
    localStorage.setItem('jansahayk_incidents_v8', JSON.stringify(civicIncidents));
  }, [civicIncidents]);

  useEffect(() => {
    localStorage.setItem('jansahayk_signals_v8', JSON.stringify(civicSignals));
  }, [civicSignals]);

  useEffect(() => {
    localStorage.setItem('jansahayk_notifications_v7', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('jansahayk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth state listener: Keep Supabase Auth session synchronized
  useEffect(() => {
    let authSub = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.access_token) {
          setToken(session.access_token);
          localStorage.setItem('jansahayk_token', session.access_token);
          try {
            const meRes = await fetch('/api/auth/me', {
              headers: { Authorization: `Bearer ${session.access_token}` }
            });
            if (meRes.ok) {
              const meData = await meRes.json();
              if (meData?.user) {
                setUser(meData.user);
                localStorage.setItem('jansahayk_user', JSON.stringify(meData.user));
              }
            }
          } catch (e) {}
        } else if (event === 'SIGNED_OUT') {
          setToken(null);
          setUser(null);
          localStorage.removeItem('jansahayk_token');
          localStorage.removeItem('jansahayk_user');
        }
      });
      authSub = data?.subscription;
    } catch (e) {
      console.warn('onAuthStateChange listener note:', e.message);
    }

    return () => {
      if (authSub) authSub.unsubscribe();
    };
  }, []);

  // Real backend synchronization and real-time Supabase Realtime / SSE stream
  useEffect(() => {
    fetchGrievances();
    fetchNotifications();
    fetchCivicIntelligence();
    if (token) {
      fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) setUser(data.user);
        })
        .catch(() => {});
    }

    // 1. Subscribe to Supabase Realtime postgres_changes
    let realtimeChannel = null;
    try {
      realtimeChannel = supabase
        .channel('public:jan_sahayak_realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'grievances' }, (payload) => {
          console.log('[Supabase Realtime] Grievance event:', payload.eventType);
          fetchGrievances();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'civic_incidents' }, (payload) => {
          console.log('[Supabase Realtime] Incident event:', payload.eventType);
          fetchCivicIntelligence();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'notifications' }, (payload) => {
          console.log('[Supabase Realtime] Notification event:', payload.eventType);
          fetchNotifications();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'field_actions' }, () => {
          fetchGrievances();
          fetchCivicIntelligence();
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'verification_records' }, () => {
          fetchGrievances();
          fetchCivicIntelligence();
        })
        .subscribe();
    } catch (e) {
      console.warn('Supabase Realtime channel init failed:', e.message);
    }

    return () => {
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
    };
  }, []);


  const fetchCivicIntelligence = async () => {
    try {
      const incidents = await IncidentService.getIncidents(token);
      if (Array.isArray(incidents)) {
        setCivicIncidents(incidents);
      }
    } catch (e) {}
  };

  const fetchGrievances = async () => {
    try {
      const complaints = await ComplaintService.getComplaints(token);
      if (Array.isArray(complaints) && complaints.length > 0) {
        setGrievances(prev => {
          const map = new Map();
          // Remote authoritative complaints
          complaints.forEach(c => { if (c && c.id) map.set(c.id, c); });
          // Preserve any local un-synced / just-created complaints
          prev.forEach(p => {
            if (p && p.id && !map.has(p.id)) {
              map.set(p.id, p);
            }
          });
          const merged = Array.from(map.values()).sort((a, b) => {
            const timeA = new Date(a.timestamp || 0).getTime();
            const timeB = new Date(b.timestamp || 0).getTime();
            return timeB - timeA;
          });
          localStorage.setItem('jansahayk_grievances_v7', JSON.stringify(merged));
          return merged;
        });
      }
    } catch (e) {
      // Network failure
    }
  };

  const fetchNotifications = async () => {
    try {
      const notifs = await NotificationService.getNotifications(token);
      if (Array.isArray(notifs)) {
        setNotifications(notifs);
      }
    } catch (e) {
      // Network failure
    }
  };

  const markNotificationAsRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    try {
      if (token) {
        await fetch(`/api/notifications/${id}/read`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications(prev => prev.map(n => {
      const isRelevant = user?.role === 'super_admin' || 
                         (n.userId && n.userId === user?.id) || 
                         (n.userRole && n.userRole === user?.role) || 
                         (user?.role === 'dept_admin' && n.userRole === 'officer');
      return isRelevant ? { ...n, read: true } : n;
    }));
    try {
      if (token) {
        await fetch('/api/notifications/mark-all-read', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
  };

  const addLocalNotification = (notif) => {
    const newN = {
      id: `NOTIF-${Date.now()}`,
      createdAt: 'Just now',
      read: false,
      timestamp: new Date().toISOString(),
      ...notif
    };
    setNotifications(prev => [newN, ...prev]);
  };

  // Single Authoritative Real-Time EventSource connection to backend SSE
  useEffect(() => {
    let es = null;
    try {
      const sseUrl = token ? `/api/events?token=${encodeURIComponent(token)}` : '/api/events';
      es = new EventSource(sseUrl);

      const handleRefresh = () => {
        fetchCivicIntelligence();
        fetchGrievances();
        fetchNotifications();
      };

      const canonicalEvents = [
        'complaint_created',
        'complaint_updated',
        'complaint_analyzed',
        'dna_generated',
        'cluster_updated',
        'incident_created',
        'incident_updated',
        'investigation_started',
        'field_action_started',
        'field_action_completed',
        'verification_requested',
        'verification_submitted',
        'incident_resolved',
        'incident_reopened',
        'notification_created'
      ];

      canonicalEvents.forEach(evtName => {
        es.addEventListener(evtName, handleRefresh);
      });

      es.addEventListener('status_changed', (evt) => {
        try {
          const parsed = JSON.parse(evt.data);
          const payload = parsed.payload || parsed;
          if (payload?.grievanceId) {
            setGrievances(prev => prev.map(g => g.id === payload.grievanceId ? { ...g, status: payload.newStatus } : g));
          }
        } catch (err) {}
        handleRefresh();
      });

      es.onerror = () => {
        if (es && es.readyState === EventSource.CONNECTING) {
          // Automatic browser reconnection in progress
        }
      };
    } catch (e) {
      console.warn('[SSE] EventSource init note:', e.message);
    }

    return () => {
      if (es) {
        es.close();
      }
    };
  }, [token]);

  // Real Supabase Auth Login
  const login = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    try {
      // 1. Direct Supabase Auth
      try {
        const { data: supaData, error: supaErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (!supaErr && supaData?.session) {
          const accessToken = supaData.session.access_token;
          setToken(accessToken);
          localStorage.setItem('jansahayk_token', accessToken);

          // Get profile from backend
          const meRes = await fetch('/api/auth/me', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            setUser(meData.user);
            localStorage.setItem('jansahayk_user', JSON.stringify(meData.user));
            setIsLoadingAuth(false);
            return meData.user;
          }
        }
      } catch (e) {
        console.warn('Direct Supabase sign-in fallback to API:', e.message);
      }

      // 2. Fallback via backend Express API endpoint
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('jansahayk_token', data.token);
      localStorage.setItem('jansahayk_user', JSON.stringify(data.user));
      setIsLoadingAuth(false);
      return data.user;
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
      setIsLoadingAuth(false);
      throw err;
    }
  };

  // Real Registration
  const register = async (userData) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('jansahayk_token', data.token);
      localStorage.setItem('jansahayk_user', JSON.stringify(data.user));
      setIsLoadingAuth(false);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      setIsLoadingAuth(false);
      throw err;
    }
  };

  // Logout — clears Supabase session + custom token
  const logout = async () => {
    try {
      // Sign out from Supabase Auth (invalidates the session server-side)
      await supabase.auth.signOut();
    } catch (e) {}
    try {
      if (token) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          signal: controller.signal
        });
        clearTimeout(timeoutId);
      }
    } catch (e) {}
    setToken(null);
    setUser(null);
    localStorage.removeItem('jansahayk_token');
    localStorage.removeItem('jansahayk_user');
    // Ensure hasEnteredApp remains true so logging out goes directly to Home, NOT onboarding
    localStorage.setItem('jansahayk_entered_app', 'true');
    setHasEnteredApp(true);
  };

  // 1-Click Quick Demo Switcher (Instant & Offline Resilient)
  const switchDemoRole = async (roleKey) => {
    const targetUser = DEMO_USERS[roleKey] || DEMO_USERS.citizen;
    const demoToken = `demo_token_${roleKey}`;

    // 1. Immediately apply client state so clicking works without any delay or failure
    setToken(demoToken);
    setUser(targetUser);
    localStorage.setItem('jansahayk_token', demoToken);
    localStorage.setItem('jansahayk_user', JSON.stringify(targetUser));

    // 2. Asynchronously notify backend session if API server is running
    const cred = DEMO_CREDENTIALS[roleKey];
    if (cred) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: cred.email, password: cred.password }),
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data && data.token && data.user) {
            setToken(data.token);
            setUser(data.user);
            localStorage.setItem('jansahayk_token', data.token);
            localStorage.setItem('jansahayk_user', JSON.stringify(data.user));
            return data.user;
          }
        }
      } catch (err) {
        // Backend offline or timeout: local state is already applied
      }
    }

    return targetUser;
  };

  // Submit Grievance
  const submitGrievance = async (formData) => {
    // If user is not yet logged in as citizen, establish citizen session so tracking and state persist seamlessly
    let activeUser = user;
    let activeToken = token;
    if (!activeUser || !activeToken) {
      activeUser = DEMO_USERS.citizen;
      activeToken = 'demo_token_citizen';
      setUser(activeUser);
      setToken(activeToken);
      localStorage.setItem('jansahayk_token', activeToken);
      localStorage.setItem('jansahayk_user', JSON.stringify(activeUser));
      localStorage.setItem('jansahayk_entered_app', 'true');
      setHasEnteredApp(true);
      // Fire background sync login if backend available
      switchDemoRole('citizen').catch(() => {});
    }

    const analysis = analyzeGrievanceInput(formData.description, { ward: formData.ward || activeUser?.ward });
    
    // Assign appropriate municipal field officer based on department
    const assignedOfficer = analysis.department.includes('Water') || analysis.department.includes('PMC Water')
      ? 'Er. Sanjay Sharma (EE PMC Water Works)'
      : analysis.department.includes('Solid Waste') || analysis.department.includes('Sanitation')
      ? 'Er. Ramesh Shinde (PMC Sanitation Inspector)'
      : analysis.department.includes('PWD') || analysis.department.includes('Road')
      ? 'Er. Sachin Patil (PWD Pune)'
      : analysis.department.includes('Electricity') || analysis.department.includes('Power') || analysis.department.includes('MSEDCL')
      ? 'Er. Neha Singh (MSEDCL Wagholi)'
      : 'Er. Ramesh Shinde (PMC Wagholi)';

    const newGrievance = {
      title: formData.title || `${analysis.category} Issue in ${formData.ward || activeUser?.ward}`,
      description: formData.description,
      category: analysis.category,
      department: analysis.department,
      officerName: assignedOfficer,
      officerDesignation: 'Executive Engineer (Wagholi Sub-Division)',
      location: {
        ward: formData.ward || activeUser?.ward || 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
        area: formData.area || 'Ivy Estate / Kesnand Road',
        city: 'Pune',
        pincode: formData.pincode || activeUser?.pincode || '412207'
      },
      urgency: analysis.urgency,
      urgencyScore: analysis.urgencyScore,
      citizenId: activeUser?.id || 'USR-CITIZEN-01',
      citizenName: formData.citizenName || activeUser?.name || 'Aditya Verma',
      citizenPhone: formData.citizenPhone || activeUser?.phone || '+91 98712-88210',
      evidence: formData.evidence || {
        hasPhoto: !!formData.photoTag,
        photoTag: formData.photoTag || null,
        hasAudio: !!formData.audioRecorded,
        audioTranscript: formData.audioTranscript || null,
        hasDocument: !!formData.documentName,
        documentName: formData.documentName || null
      }
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify(newGrievance),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        const created = data.grievance;
        // Augment with rich DNA for UI display
        created.timestamp = created.timestamp || new Date().toISOString();
        created.createdAt = created.createdAt || 'Just now';
        created.grievanceDna = analysis;
        created.aiOfficerBrief = analysis.aiBrief || analysis.structuredSummary?.headline || analysis.coreIssue;
        created.officerName = created.officerName || assignedOfficer;
        created.recommendedResolution = {
          primaryAction: analysis.aiRecommendation?.recommendedAction || analysis.recommendedAction || 'Emergency repair unit dispatched',
          standardOperatingProcedure: analysis.sops?.[0] || analysis.aiRecommendation?.standardOperatingProcedure || 'STANDARD-MUNICIPAL-SOP',
          estimatedFixTime: `${(analysis.slaTargetHours || analysis.targetSlaHours || 24) / 2} Hours`,
          equipmentRequired: analysis.aiRecommendation?.equipmentRequired || ['Standard Maintenance Kit', 'Inspection Sensor'],
          citizenDraftHindi: analysis.aiRecommendation?.citizenDraftHindi || analysis.draftResponseHindi || 'आपकी शिकायत दर्ज कर ली गई है।',
          citizenDraftEnglish: analysis.aiRecommendation?.citizenDraftEnglish || analysis.draftResponseEnglish || 'Your grievance has been registered.'
        };

        const officerNotif = {
          id: `NOTIF-OFFICER-${Date.now()}`,
          userId: 'USR-OFFICER-01',
          userRole: 'officer',
          title: `New Case Assigned: ${(formData.title || analysis.category).slice(0, 35)}...`,
          message: `Ticket #${created.id} routed with ${analysis.urgency} priority to ${assignedOfficer}.`,
          grievanceId: created.id,
          link: `/officer?caseId=${created.id}`,
          type: 'ASSIGNMENT',
          read: false,
          createdAt: 'Just now',
          timestamp: new Date().toISOString()
        };
        const adminNotif = {
          id: `NOTIF-ADMIN-${Date.now()}`,
          userId: 'USR-SUPERADMIN-01',
          userRole: 'super_admin',
          title: `New Inbound Incident: ${created.id}`,
          message: `Case ${created.id} logged in ${created.location?.ward || 'Ward 14'} under ${created.department}.`,
          grievanceId: created.id,
          link: `/admin?caseId=${created.id}`,
          type: 'INCIDENT_ALERT',
          read: false,
          createdAt: 'Just now',
          timestamp: new Date().toISOString()
        };
        setNotifications(prev => [officerNotif, adminNotif, ...prev]);

        setGrievances(prev => {
          const updated = [created, ...prev.filter(g => g.id !== created.id)];
          localStorage.setItem('jansahayk_grievances_v7', JSON.stringify(updated));
          return updated;
        });
        return created;
      }
    } catch (e) {}

    // Fallback in-memory with JS- prefix
    const wardNum = (formData.ward || activeUser?.ward || 'Ward 14').match(/\d+/)?.[0] || '14';
    const fallbackId = `JS-2026-W${wardNum}-${String(Date.now()).slice(-4)}`;
    const fallbackItem = {
      ...newGrievance,
      id: fallbackId,
      status: 'TRIAGED',
      officerName: assignedOfficer,
      officerDesignation: 'Assistant Executive Engineer',
      createdAt: 'Just now',
      timestamp: new Date().toISOString(),
      slaDeadline: '24 Hours from now',
      slaHoursLeft: analysis.slaTargetHours || analysis.targetSlaHours || 24,
      upvotes: 1,
      citizenId: activeUser?.id || 'USR-CITIZEN-01',
      citizenName: formData.citizenName || activeUser?.name || 'Aditya Verma',
      citizenPhone: formData.citizenPhone || activeUser?.phone || '+91 98712-88210',
      grievanceDna: analysis,
      aiOfficerBrief: analysis.aiBrief || analysis.structuredSummary?.headline || analysis.coreIssue,
      recommendedResolution: {
        primaryAction: analysis.aiRecommendation?.recommendedAction || analysis.recommendedAction || 'Emergency repair unit dispatched',
        standardOperatingProcedure: analysis.sops?.[0] || analysis.aiRecommendation?.standardOperatingProcedure || 'STANDARD-MUNICIPAL-SOP',
        estimatedFixTime: `${(analysis.slaTargetHours || analysis.targetSlaHours || 24) / 2} Hours`,
        equipmentRequired: analysis.aiRecommendation?.equipmentRequired || ['Standard Maintenance Kit', 'Inspection Sensor'],
        citizenDraftHindi: analysis.aiRecommendation?.citizenDraftHindi || analysis.draftResponseHindi || 'आपकी शिकायत दर्ज कर ली गई है।',
        citizenDraftEnglish: analysis.aiRecommendation?.citizenDraftEnglish || analysis.draftResponseEnglish || 'Your grievance has been registered.'
      },
      timeline: [
        { stage: 'Submitted', time: 'Just now', detail: 'Submitted via JanSahayak Municipal Gateway', status: 'completed' },
        { stage: 'AI Triage & DNA Generated', time: 'Just now', detail: `Grievance DNA formed; routed to ${analysis.department}`, status: 'completed' },
        { stage: 'Assigned to Govt Officer', time: 'Just now', detail: `Case dispatched to ${assignedOfficer} for on-ground inspection & work order`, status: 'completed' }
      ],
      informationRequests: [],
      reopenedDispute: null
    };

    // Create notifications for both citizen tracking, government officer desk, and central administration
    const officerNotif = {
      id: `NOTIF-OFFICER-${Date.now()}`,
      userId: 'USR-OFFICER-01',
      userRole: 'officer',
      title: `New Case Assigned: ${(formData.title || analysis.category).slice(0, 35)}...`,
      message: `Ticket #${fallbackId} routed with ${analysis.urgency} priority to ${assignedOfficer}.`,
      grievanceId: fallbackId,
      link: `/officer?caseId=${fallbackId}`,
      type: 'ASSIGNMENT',
      read: false,
      createdAt: 'Just now',
      timestamp: new Date().toISOString()
    };
    const adminNotif = {
      id: `NOTIF-ADMIN-${Date.now()}`,
      userId: 'USR-SUPERADMIN-01',
      userRole: 'super_admin',
      title: `New Inbound Incident: ${fallbackId}`,
      message: `Case ${fallbackId} logged in ${fallbackItem.location?.ward || 'Ward 14'} under ${fallbackItem.department}.`,
      grievanceId: fallbackId,
      link: `/admin?caseId=${fallbackId}`,
      type: 'INCIDENT_ALERT',
      read: false,
      createdAt: 'Just now',
      timestamp: new Date().toISOString()
    };
    setNotifications(prev => [officerNotif, adminNotif, ...prev]);

    setGrievances(prev => {
      const updated = [fallbackItem, ...prev.filter(g => g.id !== fallbackId)];
      localStorage.setItem('jansahayk_grievances_v7', JSON.stringify(updated));
      return updated;
    });
    return fallbackItem;
  };

  // Officer requests information
  const requestInfo = async (grievanceId, question) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/request-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    // Fallback
    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        const infoReq = {
          id: `REQ-${Date.now()}`,
          askedBy: user?.name || 'Officer On-Duty',
          officerDesignation: user?.designation || 'AEE',
          question,
          timestamp: 'Just now',
          status: 'AWAITING_CITIZEN_REPLY',
          response: null
        };
        const updated = {
          ...g,
          status: 'INFO_REQUESTED',
          informationRequests: [infoReq, ...(g.informationRequests || [])],
          timeline: [...g.timeline, {
            stage: 'Information Requested',
            time: 'Just now',
            detail: `Officer ${user?.name} asked: "${question}"`,
            status: 'in_progress'
          }]
        };
        return updated;
      }
      return g;
    }));
  };

  // Citizen responds to information request
  const respondInfo = async (grievanceId, requestId, answer) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/respond-info`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, answer })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        const updatedRequests = (g.informationRequests || []).map(r => {
          if (r.id === requestId) {
            return { ...r, status: 'ANSWERED', response: answer, answeredAt: 'Just now' };
          }
          return r;
        });
        return {
          ...g,
          status: 'IN_PROGRESS',
          informationRequests: updatedRequests,
          timeline: [...g.timeline, {
            stage: 'Citizen Clarification Provided',
            time: 'Just now',
            detail: `Citizen answered: "${answer}"`,
            status: 'completed'
          }]
        };
      }
      return g;
    }));
  };

  // Officer resolves grievance
  const resolveGrievance = async (grievanceId, resolutionNotes, resolutionPhotoUrl = null) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolutionNotes, resolutionPhotoUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        fetchNotifications();
        fetchCivicIntelligence();
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          status: 'RESOLVED',
          resolutionNotes,
          resolutionPhotoUrl,
          timeline: [...g.timeline, {
            stage: 'Resolved & Verified',
            time: 'Just now',
            detail: resolutionNotes,
            status: 'completed'
          }]
        };
      }
      return g;
    }));
  };

  // Citizen reopens dispute
  const reopenDispute = async (grievanceId, disputeReason) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/reopen`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ disputeReason })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          status: 'DISPUTE_REOPENED',
          reopenedDispute: {
            reopenedAt: 'Just now',
            citizenReason: disputeReason,
            status: 'UNDER_SUPERVISORY_REVIEW'
          },
          timeline: [...g.timeline, {
            stage: 'Case Disputed & Reopened',
            time: 'Just now',
            detail: `Citizen disputed closure: "${disputeReason}". Escalated to Superintending Engineer.`,
            status: 'in_progress'
          }]
        };
      }
      return g;
    }));
  };

  // Citizen feedback
  const submitFeedback = async (grievanceId, rating, comment) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          citizenFeedback: {
            rating: Number(rating) || 5,
            comment: comment || 'Resolution satisfactory.',
            submittedAt: 'Just now'
          },
          timeline: [...g.timeline, {
            stage: 'Citizen Feedback Received',
            time: 'Just now',
            detail: `Citizen rated ${rating}/5 stars: "${comment}"`,
            status: 'completed'
          }]
        };
      }
      return g;
    }));
  };

  // Real Citizen Resolution Verification
  const verifyResolution = async (grievanceId, satisfaction, feedbackText, evidencePhotos = []) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ satisfaction, feedbackText, evidencePhotos })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        fetchNotifications();
        fetchCivicIntelligence();
        return data.grievance;
      }
    } catch (e) {}

    // Fallback in-memory
    const isSatisfied = satisfaction === 'SATISFIED' || satisfaction === 'YES';
    const newStatus = isSatisfied ? 'RESOLVED_CONFIRMED' : 'DISPUTE_REOPENED';
    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          status: newStatus,
          citizenVerification: {
            verifiedAt: new Date().toISOString(),
            satisfaction: isSatisfied ? 'SATISFIED' : 'DISPUTED',
            feedbackText: feedbackText || (isSatisfied ? 'Resolution confirmed by citizen' : 'Citizen reported issue persists on ground')
          },
          timeline: [...(g.timeline || []), {
            stage: isSatisfied ? 'Citizen Verified & Closed' : 'Dispute Reopened by Citizen',
            time: 'Just now',
            detail: feedbackText || (isSatisfied ? 'Problem confirmed resolved by citizen' : 'Citizen reported issue persists on ground'),
            status: isSatisfied ? 'completed' : 'in_progress'
          }]
        };
      }
      return g;
    }));
  };

  // Officer internal notes
  const addInternalNote = async (grievanceId, note) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/internal-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ note })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        const newNote = {
          id: `NOTE-${Date.now()}`,
          author: user?.name || 'Officer',
          role: user?.role || 'officer',
          designation: user?.designation || 'Field Official',
          note,
          timestamp: 'Just now'
        };
        return {
          ...g,
          internalNotes: [...(g.internalNotes || []), newNote]
        };
      }
      return g;
    }));
  };

  // Officer reassign
  const reassignGrievance = async (grievanceId, newOfficer, newDepartment, reason) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/reassign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newOfficer, newDepartment, reason })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          officerName: newOfficer || g.officerName,
          department: newDepartment || g.department,
          timeline: [...g.timeline, {
            stage: 'Case Reassigned',
            time: 'Just now',
            detail: `Reassigned to ${newOfficer || g.officerName} (${newDepartment || g.department}). Reason: ${reason || 'Jurisdiction alignment'}`,
            status: 'in_progress'
          }]
        };
      }
      return g;
    }));
  };

  // Officer escalate
  const escalateGrievance = async (grievanceId, reason, escalationTarget) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/escalate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason, escalationTarget })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        return {
          ...g,
          urgency: 'CRITICAL',
          urgencyScore: 99,
          escalatedTo: escalationTarget || 'Superintending Engineer',
          timeline: [...g.timeline, {
            stage: 'Supervisory Escalation',
            time: 'Just now',
            detail: `Escalated to ${escalationTarget || 'Superintending Engineer'}: "${reason}"`,
            status: 'in_progress'
          }]
        };
      }
      return g;
    }));
  };

  // Officer action on recommendation: ACCEPT, MODIFY, REJECT
  const actionRecommendation = async (grievanceId, action, modifiedAction = null, rejectionReason = null) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/recommendation-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action, modifiedAction, rejectionReason })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        let stageDetail = `Officer ${action.toLowerCase()}ed AI recommendation.`;
        if (action === 'ACCEPT') stageDetail = `Officer approved standard SOP: ${g.recommendedResolution?.primaryAction || 'Field repair'}`;
        if (action === 'MODIFY') stageDetail = `Officer customized work order: "${modifiedAction}"`;
        if (action === 'REJECT') stageDetail = `Officer rejected AI SOP: "${rejectionReason}"`;

        return {
          ...g,
          status: 'IN_PROGRESS',
          recommendedResolution: action === 'MODIFY' && g.recommendedResolution ? {
            ...g.recommendedResolution,
            primaryAction: modifiedAction
          } : g.recommendedResolution,
          timeline: [...g.timeline, {
            stage: `AI Recommendation ${action}`,
            time: 'Just now',
            detail: stageDetail,
            status: 'in_progress'
          }]
        };
      }
      return g;
    }));
  };

  // Formal Workflow Status Transition (Submitted -> AI Analysed -> Assigned -> Under Review -> Information Required -> In Progress -> Escalated -> Resolved -> Closed)
  const transitionStatus = async (grievanceId, newStatus, reason, actionType, notes, evidenceUrl) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/transition-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newStatus, reason, actionType, notes, evidenceUrl })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        fetchNotifications();
        fetchCivicIntelligence();
        return data.grievance;
      }
    } catch (e) {}

    // Fallback
    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        const prevStatus = g.status;
        const historyEntry = {
          transitionId: `TR-${Date.now()}`,
          previousStatus: prevStatus,
          newStatus,
          actor: user?.name || 'Officer',
          role: user?.role || 'officer',
          timestamp: 'Just now',
          date: '2026-09-16',
          reason: reason || `Status moved to ${newStatus}`
        };
        return {
          ...g,
          status: newStatus,
          statusHistory: [...(g.statusHistory || []), historyEntry],
          timeline: [...g.timeline, {
            stage: newStatus.replace('_', ' '),
            time: 'Just now',
            detail: reason || `Progressed from ${prevStatus} to ${newStatus}`,
            status: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? 'completed' : 'in_progress'
          }]
        };
      }
      return g;
    }));
  };

  // Human Authorized Duplicate Action
  const handleDuplicateAction = async (grievanceId, candidateId, action, justification) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/duplicate-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ candidateId, action, justification })
      });
      if (res.ok) {
        const data = await res.json();
        setGrievances(prev => prev.map(g => g.id === grievanceId ? { ...g, ...data.grievance } : g));
        return data.grievance;
      }
    } catch (e) {}

    setGrievances(prev => prev.map(g => {
      if (g.id === grievanceId) {
        const decision = {
          candidateId,
          action,
          officer: user?.name || 'Officer',
          justification: justification || 'Human verification confirmed.',
          timestamp: 'Just now'
        };
        return {
          ...g,
          duplicateDecisions: [...(g.duplicateDecisions || []), decision],
          timeline: [...g.timeline, {
            stage: 'Duplicate Decision (Authorized)',
            time: 'Just now',
            detail: `Officer categorized ticket ${candidateId} as ${action}`,
            status: 'in_progress'
          }]
        };
      }
      return g;
    }));
  };

  // User profile & settings update
  const updateUserSettings = async (settings) => {
    try {
      const res = await fetch('/api/auth/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          localStorage.setItem('jansahayk_user', JSON.stringify(data.user));
          setUser(data.user);
          return data.user;
        }
      }
    } catch (e) {}

    const updatedUser = { ...user, ...settings };
    try {
      localStorage.setItem('jansahayk_user', JSON.stringify(updatedUser));
    } catch (err) {}
    setUser(updatedUser);
    return updatedUser;
  };

  // Upvote
  const upvoteGrievance = (id) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, upvotes: (g.upvotes || 0) + 1 } : g));
  };

  // ============================================================================
  // Civic Intelligence Operations (Feature #1 to #12)
  // ============================================================================

  const submitCivicSignal = async (signalData) => {
    const rawInput = signalData.rawInput || signalData.text || '';
    const dna = ComplaintDNAService.generateDNA(rawInput, { ward: signalData.ward });
    const match = IncidentClusteringService.findMatchingIncident(
      { rawText: rawInput, location: { ward: signalData.ward }, complaintDna: dna },
      civicIncidents
    );

    const targetIncidentId = match?.matched ? match.incidentId : (civicIncidents[0]?.id || 'INC-2026-PUNE-WAG-01');

    const newSignal = {
      id: `SIG-${Date.now().toString().slice(-6)}`,
      incidentId: targetIncidentId,
      citizenName: signalData.citizenName || user?.name || 'Santosh Gawade',
      ward: signalData.ward || user?.ward || 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
      channel: signalData.channel || 'QUICK_TEXT',
      rawInput,
      translatedText: rawInput,
      category: dna.issueType,
      inferredAsset: dna.asset,
      hasPhoto: !!signalData.photoUrl,
      photoUrl: signalData.photoUrl || null,
      lat: signalData.lat || 18.5760,
      lng: signalData.lng || 73.9810,
      timestamp: new Date().toLocaleString(),
      status: 'CLUSTERED',
      confidence: 'High (94%)',
      complaintDna: dna
    };

    setCivicSignals(prev => [newSignal, ...prev]);

    // Update incident signal count & append to timeline
    setCivicIncidents(prev => prev.map(inc => {
      if (inc.id === targetIncidentId) {
        return {
          ...inc,
          signalCount: inc.signalCount + 1,
          citizenObservationsCount: (inc.citizenObservationsCount || 0) + 1,
          lastUpdatedAt: 'Just now',
          timeline: [
            {
              date: 'Today',
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              stage: 'New Citizen Signal Received',
              desc: `Citizen observation logged via ${signalData.channel || 'Mobile Portal'}: "${rawInput.slice(0, 70)}..."`,
              count: inc.signalCount + 1,
              source: 'Citizen Signal'
            },
            ...(inc.timeline || [])
          ]
        };
      }
      return inc;
    }));

    addLocalNotification({
      userRole: 'officer',
      title: `Weak Signal Clustered to ${targetIncidentId}`,
      message: `New citizen observation associated with "${dna.subIssue}" in ${newSignal.ward}.`,
      grievanceId: targetIncidentId,
      link: `/intelligence/incidents/${targetIncidentId}`,
      type: 'SIGNAL_CLUSTERED'
    });

    try {
      if (token) {
        await fetch('/api/intelligence/signals', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(newSignal)
        });
      }
    } catch (e) {}

    return newSignal;
  };

  const recordIncidentDecision = async (incidentId, decisionData) => {
    const { decision, actionSelected, notes } = decisionData;
    const record = {
      id: `DEC-${Date.now()}`,
      decision,
      actionSelected: actionSelected || 'Field Inspection & Verification',
      officer: user?.name || 'Er. Sanjay Sharma (AEE)',
      timestamp: new Date().toLocaleString(),
      notes: notes || 'Verified against on-ground signals.'
    };

    setCivicIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const decisions = inc.humanDecisions ? [record, ...inc.humanDecisions] : [record];
        let newStatus = inc.status;
        if (decision === 'ACCEPT_RECOMMENDATION') newStatus = 'Action Planned';
        else if (decision === 'REQUEST_VERIFICATION') newStatus = 'Investigating';

        return {
          ...inc,
          status: newStatus,
          humanDecisions: decisions
        };
      }
      return inc;
    }));

    addLocalNotification({
      userRole: 'dept_admin',
      title: `Human Decision Recorded on ${incidentId}`,
      message: `${user?.name || 'Officer'} recorded: ${decision} (${record.actionSelected})`,
      grievanceId: incidentId,
      link: `/intelligence/incidents/${incidentId}`,
      type: 'INCIDENT_DECISION'
    });

    try {
      if (token) {
        await fetch(`/api/intelligence/incidents/${incidentId}/decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(record)
        });
      }
    } catch (e) {}

    return record;
  };

  const verifyIncidentResolution = async (incidentId, isConfirmed, notes = '') => {
    try {
      const res = await fetch(`/api/intelligence/incidents/${incidentId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isConfirmed,
          citizenName: user?.name || 'Verified Citizen',
          citizenId: user?.id || 'USR-CITIZEN-01',
          notes
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.incident) {
          setCivicIncidents(prev => prev.map(i => i.id === incidentId ? data.incident : i));
        }
        fetchCivicIntelligence();
        return data.incident;
      }
    } catch (e) {
      console.error('Error verifying incident:', e);
    }
  };

  const runActionSimulation = (incidentId, actionKey) => {
    const incident = civicIncidents.find(i => i.id === incidentId);
    if (!incident) return null;
    return ActionSimulationService.simulate(actionKey, incident);
  };

  const updateIncidentStage = (incidentId, newStage) => {
    setCivicIncidents(prev => prev.map(inc => inc.id === incidentId ? { ...inc, stage: newStage, lastUpdatedAt: 'Just now' } : inc));
  };

  const unreadNotificationCount = notifications.filter(n => {
    if (user?.role === 'super_admin') return !n.read;
    if (n.userId && n.userId === user?.id) return !n.read;
    if (n.userRole && n.userRole === user?.role) return !n.read;
    if (user?.role === 'dept_admin' && n.userRole === 'officer') return !n.read;
    return false;
  }).length;

  // Jan Suchna (जन सूचना) Public Civic Advisory Broadcasts
  const broadcastJanSuchna = (suchnaData) => {
    const newSuchna = {
      id: `JS-2026-${String(Date.now()).slice(-4)}`,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      ...suchnaData
    };

    setJanSuchnaList(prev => [newSuchna, ...prev]);

    // Push high-priority public advisory notification
    const notif = {
      id: `NOTIF-JS-${Date.now()}`,
      type: 'JAN_SUCHNA',
      priority: suchnaData.severity === 'HIGH' ? 'URGENT' : 'NORMAL',
      title: `📢 जन सूचना: ${suchnaData.title}`,
      message: `${suchnaData.instructions || suchnaData.description || 'Public maintenance underway.'} (Duration: ${suchnaData.duration || 'Scheduled'})`,
      ward: suchnaData.ward,
      timestamp: 'Just now',
      read: false,
      userRole: 'citizen'
    };

    setNotifications(prev => [notif, ...prev]);
    return newSuchna;
  };

  const deleteJanSuchna = (id) => {
    setJanSuchnaList(prev => prev.filter(s => s.id !== id));
  };

  // Civic Intelligence Officer Multi-Aspect Performance Evaluation Grade & Reward
  const calculateOfficerGrade = (officer = user) => {
    const defaultOfficer = {
      name: officer?.name || 'Er. Sanjay Sharma',
      department: officer?.department || 'PMC Water Supply Department',
      zone: officer?.zone || 'Zone East (Wagholi Sub-Division, Pune)'
    };

    const slaScore = 96; // 96% resolved before target SLA
    const citizenSatisfactionScore = 95; // 4.9/5 star citizen rating
    const recurrencePreventionScore = 92; // 92% zero recurrence rate
    const crossDeptTeamworkScore = 95; // Joint PWD + PMC Water + PMC SWM coordination
    const janSuchnaProactivenessScore = (janSuchnaList && janSuchnaList.length > 0) ? 98 : 92; // Proactive notices

    const compositeScore = Math.round(
      (slaScore * 0.25) +
      (citizenSatisfactionScore * 0.25) +
      (recurrencePreventionScore * 0.20) +
      (crossDeptTeamworkScore * 0.15) +
      (janSuchnaProactivenessScore * 0.15)
    );

    return {
      officer: defaultOfficer,
      score: (compositeScore + 0.8).toFixed(1), // e.g. 94.8 / 100
      letterGrade: 'A+',
      honorTitle: 'Executive Civic Champion',
      shieldTier: 'Platinum Civic Champion Shield',
      shieldColor: '#4F46E5',
      awardedBy: 'Chief Municipal Commissioner & Urban Governance Council (Pune)',
      aspects: [
        { key: 'sla', label: '⏱️ SLA Fix Velocity', score: slaScore, detail: '96% on-time resolution turnaround' },
        { key: 'trust', label: '👥 Citizen Trust & Feedback', score: citizenSatisfactionScore, detail: '4.9 ★ verified satisfaction score' },
        { key: 'prevention', label: '🧬 Root-Cause Prevention', score: recurrencePreventionScore, detail: '92% zero-repeat infrastructure fix' },
        { key: 'coordination', label: '🤝 Cross-Dept Teamwork', score: crossDeptTeamworkScore, detail: 'PMC Water + PWD Pune + PMC SWM joint operations' },
        { key: 'advisory', label: '📢 Jan Suchna Proactiveness', score: janSuchnaProactivenessScore, detail: `${janSuchnaList.length} proactive public advisories issued` }
      ]
    };
  };

  // Territory Problem Explorer Aggregator (Today's, Pending, Solved, Mapped vs Unique)
  const getTerritoryProblemBreakdown = (targetWard = 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)') => {
    const territoryComplaints = grievances.filter(g => {
      const gWard = (g.location?.ward || '').toLowerCase();
      const target = (targetWard || '').toLowerCase().split('(')[0].trim();
      return !target || gWard.includes(target) || gWard.includes('wagholi');
    });

    const today = territoryComplaints.filter(g => {
      return g.status === 'INGESTED' || g.status === 'ANALYZED' || g.urgency === 'CRITICAL' || (g.createdAt && g.createdAt.includes('2026'));
    });

    const pending = territoryComplaints.filter(g => {
      return g.status === 'IN_PROGRESS' || g.status === 'ACTION_DISPATCHED' || g.status === 'INVESTIGATION' || g.status === 'VERIFICATION_PENDING';
    });

    const solved = territoryComplaints.filter(g => {
      return g.status === 'RESOLVED' || g.status === 'ACTION_COMPLETED';
    });

    const mapped = territoryComplaints.filter(g => {
      return Boolean(g.clusterId || g.incidentId);
    });

    const unique = territoryComplaints.filter(g => {
      return !g.clusterId && !g.incidentId;
    });

    const priorityZones = [
      {
        id: 'PZ-01',
        pocket: 'Ivy Estate & Kesnand Road Water Trunkline (Wagholi)',
        severity: 'CRITICAL',
        issue: 'Underground pipeline joint leakage near school',
        complaintCount: 14,
        leadDept: 'PMC Water Supply Department',
        status: 'EMERGENCY_REPAIR',
        urgency: 'Immediate Action Needed'
      },
      {
        id: 'PZ-02',
        pocket: 'Baif Road Vegetable Market Yard',
        severity: 'HIGH',
        issue: 'Stormwater drain siltation causing backflow during peak hours',
        complaintCount: 5,
        leadDept: 'PMC Solid Waste Management',
        status: 'DESILTING_SQUAD_DEPLOYED',
        urgency: 'High Priority'
      }
    ];

    return {
      territoryName: targetWard,
      total: territoryComplaints.length,
      today,
      pending,
      solved,
      mapped,
      unique,
      priorityZones
    };
  };

  // ══════════════════════════════════════════════════════════════════════
  // WORKER & SERVICE MARKETPLACE DISPATCH METHODS
  // ══════════════════════════════════════════════════════════════════════

  const currentWorkerProfile = user?.workerProfile || workers.find(w => (user?.phone && w.phone === user?.phone) || (user?.email && w.email === user?.email)) || (user?.role === 'worker' ? workers[0] : null);

  const registerAsWorker = (formData) => {
    const categoryInfo = WORKER_CATEGORIES.find(c => c.id === formData.category) || WORKER_CATEGORIES[0];
    const newWorkerId = `WRK-WAG-${Date.now().toString().slice(-4)}`;
    const newWorker = {
      id: newWorkerId,
      name: formData.name || user?.name || 'Citizen Worker',
      avatar: formData.avatar || user?.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      category: formData.category || 'plumbing',
      categoryLabel: categoryInfo.name,
      skills: formData.skills && formData.skills.length > 0 ? formData.skills : ['General Maintenance', 'Inspection'],
      experienceYears: Number(formData.experienceYears) || 3,
      rating: 5.0,
      reviewCount: 1,
      ward: formData.ward || user?.ward || 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
      area: formData.area || user?.address || 'Wagholi, Pune',
      distanceKm: 0.5,
      baseFare: Number(formData.baseFare) || categoryInfo.baseRate,
      hourlyRate: Number(formData.hourlyRate) || categoryInfo.hourlyRate,
      availability: 'AVAILABLE',
      verificationStatus: formData.verificationDoc ? 'VERIFIED_GOV_SKILL' : 'POLICE_VERIFIED',
      verificationBadge: formData.verificationDoc ? 'PMKVY Certified Specialist' : 'Verified Local Technician',
      badgeText: 'New Verified Partner',
      phone: formData.phone || user?.phone || '+91 98220-44102',
      email: formData.email || user?.email || 'worker@jansahayak.in',
      bio: formData.bio || `Certified civic technician providing reliable ${categoryInfo.name} services across Wagholi wards.`,
      jobsCompleted: 0,
      completionRate: 100,
      preferredWorkingHours: formData.workingHours || '08:00 AM - 08:00 PM',
      aadhaarVerified: Boolean(formData.aadhaarNumber),
      createdAt: new Date().toISOString()
    };

    setWorkers(prev => [newWorker, ...prev.filter(w => w.id !== newWorkerId)]);
    
    // Attach worker profile to active user session
    const updatedUser = {
      ...(user || {}),
      workerProfile: newWorker,
      isRegisteredWorker: true
    };
    setUser(updatedUser);
    localStorage.setItem('jansahayk_user', JSON.stringify(updatedUser));

    addLocalNotification({
      type: 'WORKER_REGISTERED',
      title: '🎉 Worker Profile Verified & Activated!',
      message: `Congratulations ${newWorker.name}! Your ${newWorker.categoryLabel} profile is active in the JanSahayak Wagholi network. You can now receive citizen and municipal orders.`
    });

    return newWorker;
  };

  const updateWorkerAvailability = (workerId, newAvailability) => {
    setWorkers(prev => prev.map(w => w.id === workerId ? { ...w, availability: newAvailability } : w));
    if (user?.workerProfile?.id === workerId) {
      const updatedUser = {
        ...user,
        workerProfile: { ...user.workerProfile, availability: newAvailability }
      };
      setUser(updatedUser);
      localStorage.setItem('jansahayk_user', JSON.stringify(updatedUser));
    }
  };

  const createWorkerOrder = (orderData) => {
    const orderId = orderData.id || `WO-2026-${Date.now().toString().slice(-4)}`;
    const matchedWorker = workers.find(w => w.id === orderData.workerId) || {};
    const newOrder = {
      id: orderId,
      workerId: orderData.workerId,
      workerName: orderData.workerName || matchedWorker.name || 'Assigned Technician',
      workerCategory: orderData.workerCategory || matchedWorker.category || 'plumbing',
      workerPhone: orderData.workerPhone || matchedWorker.phone || '+91 98221-55410',
      workerAvatar: orderData.workerAvatar || matchedWorker.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      
      // Normalized requester & customer fields for reliable cross-role sync
      source: orderData.source || (orderData.requestedBy === 'GOVERNMENT_OFFICER' ? 'GOVERNMENT' : 'CITIZEN'),
      requestedBy: orderData.requestedBy || (orderData.source === 'GOVERNMENT' ? 'GOVERNMENT_OFFICER' : 'CITIZEN'),
      customerName: orderData.customerName || orderData.requesterName || user?.name || 'Citizen User',
      requesterName: orderData.requesterName || orderData.customerName || user?.name || 'Citizen User',
      customerPhone: orderData.customerPhone || orderData.requesterPhone || user?.phone || '+91 98220-44102',
      requesterPhone: orderData.requesterPhone || orderData.customerPhone || user?.phone || '+91 98220-44102',
      requesterRole: orderData.requesterRole || user?.role || 'citizen',
      
      complaintId: orderData.complaintId || null,
      complaintTitle: orderData.complaintTitle || null,
      serviceTitle: orderData.serviceTitle || 'Civic Field Maintenance',
      location: orderData.location || {
        ward: orderData.ward || 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
        area: orderData.address || orderData.area || 'Kesnand Road, Wagholi',
        city: 'Pune'
      },
      ward: orderData.ward || orderData.location?.ward || 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
      address: orderData.address || orderData.location?.area || 'Kesnand Road, Wagholi',
      urgency: orderData.urgency || 'MEDIUM',
      scheduledTime: orderData.scheduledTime || 'Today, ASAP',
      estimatedDuration: orderData.estimatedDuration || `${orderData.durationHours || 2} Hours`,
      estimatedFare: Number(orderData.estimatedFare || orderData.fareBreakdown?.totalEstimatedFare) || 500,
      finalFare: Number(orderData.finalFare || orderData.estimatedFare || orderData.fareBreakdown?.totalEstimatedFare) || 500,
      fareBreakdown: orderData.fareBreakdown || null,
      status: 'REQUESTED',
      statusHistory: [
        { 
          step: 'REQUESTED', 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          note: `${orderData.source === 'GOVERNMENT' || orderData.requestedBy === 'GOVERNMENT_OFFICER' ? 'Municipal Officer Er. Sanjay Sharma' : 'Citizen ' + (orderData.customerName || orderData.requesterName || 'User')} placed request` 
        }
      ],
      notes: orderData.notes || '',
      createdAt: new Date().toISOString()
    };

    setWorkerOrders(prev => [newOrder, ...prev]);

    // Send instant notification
    addLocalNotification({
      type: 'WORKER_ORDER_NEW',
      title: '🚨 New Work Order Dispatched!',
      message: `${newOrder.requesterName} placed order #${orderId} (${newOrder.serviceTitle}) in ${newOrder.location.ward}. Payout: ₹${newOrder.estimatedFare}.`,
      orderId: orderId,
      workerId: newOrder.workerId
    });

    // If attached to a grievance, append to grievance internalNotes and update status
    if (orderData.complaintId) {
      setGrievances(prev => prev.map(g => {
        if (g.id === orderData.complaintId) {
          const notes = g.internalNotes || [];
          return {
            ...g,
            status: 'ACTION_IN_PROGRESS',
            assignedWorker: {
              workerId: newOrder.workerId,
              name: newOrder.workerName,
              category: newOrder.workerCategory,
              orderId: orderId,
              fare: newOrder.estimatedFare
            },
            internalNotes: [
              {
                id: `NOTE-${Date.now()}`,
                author: 'System (Smart Action Dispatch)',
                text: `Work order #${orderId} assigned to technician ${newOrder.workerName} (${newOrder.serviceTitle}). Estimated contract fare: ₹${newOrder.estimatedFare}.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              },
              ...notes
            ]
          };
        }
        return g;
      }));
    }

    return newOrder;
  };

  const batchStartIncidentResolution = ({
    incidentId,
    workerId,
    workerName,
    workerCategory,
    estimatedFare,
    serviceTitle,
    location,
    selectedComplaintIds = [],
    actionSelected,
    officerNotes
  }) => {
    // 1. Create a worker order with source: 'GOVERNMENT'
    const newOrder = createWorkerOrder({
      workerId,
      workerName,
      workerCategory,
      source: 'GOVERNMENT',
      requesterName: user?.name || 'Er. Sanjay Sharma',
      requesterPhone: user?.phone || '+91 98111-90021',
      requesterRole: 'officer',
      complaintId: selectedComplaintIds[0] || null,
      serviceTitle: serviceTitle || 'Municipal Rapid Infrastructure Repair',
      location: location || {
        ward: 'Target Incident Corridor',
        area: 'Municipal Work Site',
        city: 'Pune/Delhi'
      },
      urgency: 'HIGH',
      estimatedFare: Number(estimatedFare) || 500,
      notes: officerNotes || `Dispatched to resolve incident ${incidentId} and ${selectedComplaintIds.length} bundled complaints.`
    });

    const orderId = newOrder?.id || `WO-2026-${Date.now().toString().slice(-4)}`;

    // 2. Batch update all selected complaints to ACTION_IN_PROGRESS
    if (selectedComplaintIds.length > 0) {
      setGrievances(prev => prev.map(g => {
        if (selectedComplaintIds.includes(g.id)) {
          const notes = g.internalNotes || [];
          return {
            ...g,
            status: 'ACTION_IN_PROGRESS',
            assignedWorker: {
              workerId,
              name: workerName,
              category: workerCategory,
              orderId,
              fare: Number(estimatedFare) || 500
            },
            internalNotes: [
              {
                id: `NOTE-${Date.now()}-${Math.random()}`,
                author: `${user?.name || 'Municipal Officer'} (Cluster Resolution)`,
                text: `Work order #${orderId} assigned to technician ${workerName}. Ground resolution initiated for incident cluster.`,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              },
              ...notes
            ]
          };
        }
        return g;
      }));

      // Send status change notifications for each affected citizen
      selectedComplaintIds.forEach(cId => {
        addLocalNotification({
          type: 'STATUS_CHANGE',
          title: '🛠️ Resolution In Progress!',
          message: `Municipal officer initiated resolution for your grievance ${cId}. Assigned technician: ${workerName}.`,
          grievanceId: cId
        });
      });
    }

    // 3. Update the incident status in civicIncidents
    setCivicIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'Action In Progress',
          actionChoice: actionSelected || inc.actionChoice,
          assignedWorker: {
            workerId,
            name: workerName,
            category: workerCategory,
            orderId,
            fare: Number(estimatedFare) || 500,
            dispatchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          },
          lastUpdatedAt: 'Just now'
        };
      }
      return inc;
    }));

    return newOrder;
  };

  const acceptWorkerOrder = (orderId) => {
    setWorkerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'ACCEPTED',
          statusHistory: [
            ...o.statusHistory,
            { step: 'ACCEPTED', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Worker confirmed order and is preparing tools' }
          ]
        };
      }
      return o;
    }));

    addLocalNotification({
      type: 'WORKER_ORDER_ACCEPTED',
      title: '✅ Technician Accepted Order!',
      message: `Order #${orderId} has been confirmed. Technician will reach site shortly.`,
      orderId
    });
  };

  const startWorkerOrder = (orderId) => {
    setWorkerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'IN_PROGRESS',
          statusHistory: [
            ...o.statusHistory,
            { step: 'IN_PROGRESS', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Technician reached site and started physical remediation' }
          ]
        };
      }
      return o;
    }));

    addLocalNotification({
      type: 'WORKER_ORDER_STARTED',
      title: '🔧 Work In Progress On Site',
      message: `Work has commenced for Order #${orderId}.`,
      orderId
    });
  };

  const completeWorkerOrder = (orderId, completionData = {}) => {
    setWorkerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const completed = {
          ...o,
          status: 'PAYMENT_PENDING',
          evidencePhoto: completionData.photo || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80',
          completionSummary: completionData.summary || 'Physical repair work completed successfully on site.',
          statusHistory: [
            ...o.statusHistory,
            { step: 'COMPLETED', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Technician reported job completion with field evidence' },
            { step: 'PAYMENT_PENDING', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: 'Invoice generated. Pending payment settlement.' }
          ]
        };

        // If linked to grievance, update grievance status toward completion
        if (o.complaintId) {
          setGrievances(prevG => prevG.map(g => {
            if (g.id === o.complaintId) {
              return {
                ...g,
                status: 'ACTION_COMPLETED',
                internalNotes: [
                  {
                    id: `NOTE-${Date.now()}`,
                    author: `${o.workerName} (Technician)`,
                    text: `Field repairs completed for Work Order #${orderId}. Municipal verification pending.`,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  },
                  ...(g.internalNotes || [])
                ]
              };
            }
            return g;
          }));
        }

        return completed;
      }
      return o;
    }));

    addLocalNotification({
      type: 'WORKER_ORDER_COMPLETED',
      title: '📸 Job Completed — Verification Ready',
      message: `Work Order #${orderId} marked completed. Please verify work and approve payment release.`,
      orderId
    });
  };

  const settleWorkerPayment = (orderId, paymentMethod = 'UPI / NetBanking') => {
    setWorkerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'PAID',
          paymentMethod,
          paidAt: new Date().toISOString(),
          statusHistory: [
            ...o.statusHistory,
            { step: 'PAID', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: `Payment of ₹${o.finalFare || o.estimatedFare} settled via ${paymentMethod}` }
          ]
        };
      }
      return o;
    }));

    addLocalNotification({
      type: 'WORKER_PAYMENT_SETTLED',
      title: '💰 Payment Settled!',
      message: `Payment for Order #${orderId} was processed successfully. Funds credited to technician ledger.`,
      orderId
    });
  };

  const rejectWorkerOrder = (orderId, reason = 'Unavailable at requested time') => {
    setWorkerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'REJECTED',
          rejectionReason: reason,
          statusHistory: [
            ...o.statusHistory,
            { step: 'REJECTED', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: `Declined: ${reason}` }
          ]
        };
      }
      return o;
    }));

    addLocalNotification({
      type: 'WORKER_ORDER_DECLINED',
      title: 'Order Declined by Worker',
      message: `Order #${orderId} was declined (${reason}). Re-routing to another nearby technician.`,
      orderId
    });
  };

  const cancelWorkerOrder = (orderId, reason = 'Cancelled by user') => {
    setWorkerOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'CANCELLED',
          cancellationReason: reason,
          statusHistory: [
            ...o.statusHistory,
            { step: 'CANCELLED', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), note: `Order cancelled: ${reason}` }
          ]
        };
      }
      return o;
    }));
  };

  // Autonomous Two-Agent Surveillance Pipeline Actions
  const activateHotspotSurveillance = (hotspotId) => {
    setSurveillanceHotspots(prev => prev.map(h => {
      if (h.id === hotspotId) {
        return { ...h, monitoringStatus: 'ACTIVE' };
      }
      return h;
    }));
    setActiveSurveillanceHotspot(hotspotId);
  };

  const addSurveillanceIncident = (newIncident) => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const formattedIncident = {
      id: newIncident.id || `INC-2026-PUNE-${Math.floor(1000 + Math.random() * 9000)}`,
      hotspotId: newIncident.hotspotId || activeSurveillanceHotspot || 'HOTSPOT-WAG-01',
      violation: newIncident.violation || 'Restricted Area Entry Violation',
      location: newIncident.location || 'Wagholi Restricted Zone (CAM-WAG-04)',
      timestamp: newIncident.timestamp || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      camera: newIncident.camera || 'CAM-WAG-04',
      vehicleDetails: newIncident.vehicleDetails || 'Unknown Vehicle',
      aiConfidence: newIncident.aiConfidence || 92,
      status: newIncident.status || 'Detected',
      evidenceFiles: newIncident.evidenceFiles || [],
      auditLog: newIncident.auditLog || [
        { time: timeNow, message: 'Vehicle entered restricted geofence polygon' },
        { time: timeNow, message: 'Surveillance Agent identified rule violation match' },
        { time: timeNow, message: 'Evidence Agent captured dual-frame snapshot package' }
      ],
      authorityRecipient: newIncident.authorityRecipient || null,
      officialReference: newIncident.officialReference || null,
      humanVerificationNotes: newIncident.humanVerificationNotes || '',
      ...newIncident
    };

    setSurveillanceIncidents(prev => [formattedIncident, ...prev]);

    addLocalNotification({
      type: 'SURVEILLANCE_BREACH',
      title: '⚠️ Geofence Breach Detected',
      message: `${formattedIncident.violation} on ${formattedIncident.camera} (${formattedIncident.vehicleDetails}). Evidence agent captured frames.`,
      incidentId: formattedIncident.id
    });

    return formattedIncident;
  };

  const escalateSurveillanceIncident = (incidentId, authorityTarget, notes = '') => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const officialRef = `REF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    setSurveillanceIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const auditEntry = {
          time: timeNow,
          message: `Forwarded to ${authorityTarget || 'Enforcement Authority'} (Ref: ${officialRef})${notes ? ` - Notes: ${notes}` : ''}`
        };
        return {
          ...inc,
          status: 'Forwarded',
          authorityRecipient: authorityTarget || 'Police Station (Wagholi Traffic & Law Enforcement)',
          officialReference: officialRef,
          humanVerificationNotes: notes ? (inc.humanVerificationNotes ? `${inc.humanVerificationNotes} | ${notes}` : notes) : inc.humanVerificationNotes,
          auditLog: [...(inc.auditLog || []), auditEntry]
        };
      }
      return inc;
    }));

    addLocalNotification({
      type: 'SURVEILLANCE_ESCALATED',
      title: '🚨 Surveillance Incident Escalated',
      message: `Incident #${incidentId} forwarded to ${authorityTarget || 'Enforcement Authority'} (Official Ref: ${officialRef}).`,
      incidentId
    });

    return officialRef;
  };

  const updateSurveillanceIncidentStatus = (incidentId, newStatus, additionalNote = '') => {
    const timeNow = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setSurveillanceIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        const auditEntry = {
          time: timeNow,
          message: additionalNote 
            ? `Status updated to '${newStatus}': ${additionalNote}` 
            : `Status transitioned to '${newStatus}'`
        };
        return {
          ...inc,
          status: newStatus,
          auditLog: [...(inc.auditLog || []), auditEntry],
          humanVerificationNotes: additionalNote ? (inc.humanVerificationNotes ? `${inc.humanVerificationNotes} | ${additionalNote}` : additionalNote) : inc.humanVerificationNotes
        };
      }
      return inc;
    }));
  };

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        currentCitizen: (user && user.role === 'citizen') ? user : {
          id: 'USR-CITIZEN-01',
          name: 'Santosh Gawade',
          email: 'santosh@citizen.in',
          role: 'citizen',
          phone: '+91 98220-44102',
          ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
          pincode: '412207'
        },
        role: user?.role || null,
        login,
        register,
        logout,
        switchDemoRole,
        authError,
        isLoadingAuth,
        grievances,
        clusters,
        civicIncidents,
        civicSignals,
        intelligenceMetrics: CIVIC_INTELLIGENCE_METRICS,
        janSuchnaList,
        broadcastJanSuchna,
        deleteJanSuchna,
        calculateOfficerGrade,
        getTerritoryProblemBreakdown,
        submitCivicSignal,
        recordIncidentDecision,
        verifyIncidentResolution,
        runActionSimulation,
        updateIncidentStage,
        notifications,
        unreadNotificationCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addLocalNotification,
        fetchNotifications,
        submitGrievance,
        requestInfo,
        respondInfo,
        resolveGrievance,
        verifyResolution,
        reopenDispute,
        submitFeedback,
        addInternalNote,
        reassignGrievance,
        escalateGrievance,
        actionRecommendation,
        transitionStatus,
        handleDuplicateAction,
        updateUserSettings,
        hasEnteredApp,
        enterApp,
        exitToOnboarding,
        metrics: SYSTEM_METRICS,
        can: (perm) => hasPermission(user, perm),
        hasPermission: (perm) => hasPermission(user, perm),
        getRoleLabel: () => getRoleLabel(user?.role),
        PERMISSIONS,
        // Worker Marketplace Exports
        workers,
        workerOrders,
        currentWorkerProfile,
        WORKER_CATEGORIES,
        registerAsWorker,
        updateWorkerAvailability,
        createWorkerOrder,
        acceptWorkerOrder,
        startWorkerOrder,
        completeWorkerOrder,
        settleWorkerPayment,
        rejectWorkerOrder,
        cancelWorkerOrder,
        calculateEstimatedFare,
        detectWorkerCategoryFromComplaint,
        matchWorkersForComplaint,
        batchStartIncidentResolution,
        // Autonomous Surveillance & Evidence Pipeline Exports
        surveillanceHotspots,
        setSurveillanceHotspots,
        surveillanceIncidents,
        setSurveillanceIncidents,
        activeSurveillanceHotspot,
        setActiveSurveillanceHotspot,
        activateHotspotSurveillance,
        addSurveillanceIncident,
        escalateSurveillanceIncident,
        updateSurveillanceIncidentStatus,
        SURVEILLANCE_AUTHORITIES,
        SURVEILLANCE_STATUSES
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
