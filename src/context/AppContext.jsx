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

const AppContext = createContext();

// Pre-seeded credentials for instant 1-click persona switching (3 Primary Roles)
export const DEMO_CREDENTIALS = {
  citizen: { email: 'aditya@citizen.in', password: 'citizen123', label: 'Citizen (Aditya Verma)' },
  civic_officer: { email: 'civic.officer@djb.gov.in', password: 'civicofficer123', label: 'Civic Officer (Er. Sanjay Sharma - DJB)' },
  super_admin: { email: 'superadmin@delhi.gov.in', password: 'superadmin123', label: 'Super Admin (Dr. Meenakshi Sundaram, IAS)' },
  // Backward-compatible aliases for legacy credentials
  officer: { email: 'civic.officer@djb.gov.in', password: 'civicofficer123', label: 'Civic Officer (Field Engineering Lead)' },
  dept_admin: { email: 'civic.officer@djb.gov.in', password: 'civicofficer123', label: 'Civic Officer (Department Operations Lead)' }
};

// Full profile objects for offline and instant demo switching
export const DEMO_USERS = {
  citizen: {
    id: 'USR-CITIZEN-01',
    name: 'Aditya Verma',
    email: 'aditya@citizen.in',
    role: 'citizen',
    phone: '+91 98712-88210',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085',
    verified: true
  },
  civic_officer: {
    id: 'USR-CIVICOFFICER-01',
    name: 'Er. Sanjay Sharma',
    email: 'officer.djb@delhi.gov.in',
    role: 'civic_officer',
    department: 'Delhi Jal Board (DJB)',
    designation: 'Government Officer & Assistant Executive Engineer',
    zone: 'Zone North-West (Rohini)',
    phone: '+91 98111-90021'
  },
  officer: {
    id: 'USR-OFFICER-01',
    name: 'Er. Sanjay Sharma',
    email: 'sanjay.sharma@djb.gov.in',
    role: 'civic_officer',
    department: 'Delhi Jal Board (DJB)',
    designation: 'Civic Officer & Assistant Executive Engineer',
    zone: 'Zone North-West (Rohini)',
    phone: '+91 98111-90021'
  },
  dept_admin: {
    id: 'USR-DEPTADMIN-01',
    name: 'Er. Rajiv Malhotra',
    email: 'admin.djb@delhi.gov.in',
    role: 'civic_officer',
    department: 'Delhi Jal Board (DJB)',
    designation: 'Civic Officer & Chief Engineer',
    phone: '+91 99100-11223'
  },
  super_admin: {
    id: 'USR-SUPERADMIN-01',
    name: 'Dr. Meenakshi Sundaram, IAS',
    email: 'superadmin@delhi.gov.in',
    role: 'super_admin',
    designation: 'Principal Secretary (IT & Public Grievance)',
    phone: '+91 11-2339-2000'
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
    const saved = localStorage.getItem('jansahayk_grievances_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_GRIEVANCES.length) {
          return parsed;
        }
      } catch (e) {}
    }
    localStorage.setItem('jansahayk_grievances_v4', JSON.stringify(INITIAL_GRIEVANCES));
    return INITIAL_GRIEVANCES;
  });

  const [clusters, setClusters] = useState(() => {
    const saved = localStorage.getItem('jansahayk_clusters_v4');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= MOCK_CLUSTERS.length) return parsed;
      } catch (e) {}
    }
    localStorage.setItem('jansahayk_clusters_v4', JSON.stringify(MOCK_CLUSTERS));
    return MOCK_CLUSTERS;
  });

  const [civicIncidents, setCivicIncidents] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_incidents');
      return saved ? JSON.parse(saved) : CIVIC_INCIDENTS;
    } catch (e) {
      return CIVIC_INCIDENTS;
    }
  });

  const [civicSignals, setCivicSignals] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_signals');
      return saved ? JSON.parse(saved) : CIVIC_SIGNALS;
    } catch (e) {
      return CIVIC_SIGNALS;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('jansahayk_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

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
    localStorage.setItem('jansahayk_grievances_v4', JSON.stringify(grievances));
    localStorage.setItem('jansahayk_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('jansahayk_clusters_v4', JSON.stringify(clusters));
    localStorage.setItem('jansahayk_clusters', JSON.stringify(clusters));
  }, [clusters]);

  useEffect(() => {
    localStorage.setItem('jansahayk_incidents', JSON.stringify(civicIncidents));
  }, [civicIncidents]);

  useEffect(() => {
    localStorage.setItem('jansahayk_signals', JSON.stringify(civicSignals));
  }, [civicSignals]);

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

    // 2. Fallback / supplementary SSE listener for all canonical events
    let eventSource = null;
    try {
      eventSource = new EventSource('/api/events');
      const handleServerEvent = () => {
        fetchCivicIntelligence();
        fetchGrievances();
        fetchNotifications();
      };

      const eventsToListen = [
        'complaint_created',
        'complaint_updated',
        'complaint_analyzed',
        'dna_generated',
        'cluster_updated',
        'incident_created',
        'incident_updated',
        'status_changed',
        'investigation_started',
        'field_action_started',
        'field_action_completed',
        'verification_requested',
        'verification_submitted',
        'incident_resolved',
        'incident_reopened',
        'notification_created'
      ];

      eventsToListen.forEach(evt => {
        eventSource.addEventListener(evt, handleServerEvent);
      });

      eventSource.onerror = () => {
        if (eventSource && eventSource.readyState === EventSource.CONNECTING) {
          eventSource.close();
        }
      };
    } catch (err) {
      console.warn('SSE connection unavailable, using standard sync:', err);
    }

    return () => {
      if (realtimeChannel) supabase.removeChannel(realtimeChannel);
      if (eventSource) eventSource.close();
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
        setGrievances(complaints);
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

  // Real-Time EventSource connection to backend SSE
  useEffect(() => {
    let es = null;
    try {
      es = new EventSource('/api/events');
      
      es.addEventListener('complaint_created', () => {
        fetchGrievances();
        fetchNotifications();
        fetchCivicIntelligence();
      });

      es.addEventListener('status_changed', (evt) => {
        try {
          const parsed = JSON.parse(evt.data);
          const payload = parsed.payload || parsed;
          if (payload?.grievanceId) {
            setGrievances(prev => prev.map(g => g.id === payload.grievanceId ? { ...g, status: payload.newStatus } : g));
          }
        } catch (err) {}
        fetchGrievances();
        fetchNotifications();
      });

      es.addEventListener('incident_created', () => {
        fetchCivicIntelligence();
      });

      es.addEventListener('complaint_analyzed', () => {
        fetchGrievances();
      });

      es.onerror = () => {
        // Browser automatically retries SSE connection
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
        const timeoutId = setTimeout(() => controller.abort(), 1500);
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
    const analysis = analyzeGrievanceInput(formData.description, { ward: formData.ward || user?.ward });
    const newGrievance = {
      title: formData.title || `${analysis.category} Issue in ${formData.ward || user?.ward}`,
      description: formData.description,
      category: analysis.category,
      department: analysis.department,
      location: {
        ward: formData.ward || user?.ward || 'Ward 14 (Rohini Sector 14)',
        area: formData.area || 'Pocket 2, Near Market',
        city: 'New Delhi',
        pincode: formData.pincode || user?.pincode || '110085'
      },
      urgency: analysis.urgency,
      urgencyScore: analysis.urgencyScore,
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
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newGrievance)
      });
      if (res.ok) {
        const data = await res.json();
        const created = data.grievance;
        // Augment with rich DNA for UI display
        created.grievanceDna = analysis;
        created.aiOfficerBrief = analysis.aiBrief;
        created.recommendedResolution = {
          primaryAction: analysis.recommendedAction,
          standardOperatingProcedure: analysis.sops[0] || 'STANDARD-MUNICIPAL-SOP',
          estimatedFixTime: `${analysis.targetSlaHours / 2} Hours`,
          equipmentRequired: ['Standard Maintenance Kit', 'Inspection Sensor'],
          citizenDraftHindi: analysis.draftResponseHindi,
          citizenDraftEnglish: analysis.draftResponseEnglish
        };
        setGrievances(prev => [created, ...prev]);
        return created;
      }
    } catch (e) {}

    // Fallback in-memory with JS- prefix
    const wardNum = (formData.ward || user?.ward || 'Ward 14').match(/\d+/)?.[0] || '14';
    const fallbackId = `JS-2026-W${wardNum}-${String(Date.now()).slice(-4)}`;
    const fallbackItem = {
      ...newGrievance,
      id: fallbackId,
      status: 'TRIAGED',
      createdAt: 'Just now',
      slaDeadline: '24 Hours from now',
      slaHoursLeft: analysis.targetSlaHours,
      upvotes: 1,
      citizenId: user?.id || 'USR-CITIZEN-01',
      citizenName: user?.name || 'Aditya Verma',
      citizenPhone: user?.phone || '+91 98712-88210',
      grievanceDna: analysis,
      aiOfficerBrief: analysis.aiBrief,
      recommendedResolution: {
        primaryAction: analysis.recommendedAction,
        standardOperatingProcedure: analysis.sops[0] || 'STANDARD-MUNICIPAL-SOP',
        estimatedFixTime: `${analysis.targetSlaHours / 2} Hours`,
        equipmentRequired: ['Standard Maintenance Kit', 'Inspection Sensor'],
        citizenDraftHindi: analysis.draftResponseHindi,
        citizenDraftEnglish: analysis.draftResponseEnglish
      },
      timeline: [
        { stage: 'Submitted', time: 'Just now', detail: 'Submitted via JanSahayk Web Portal', status: 'completed' },
        { stage: 'AI Triage & DNA Generated', time: 'Just now', detail: `Grievance DNA formed; routed to ${analysis.department}`, status: 'completed' }
      ],
      informationRequests: [],
      reopenedDispute: null
    };
    setGrievances(prev => [fallbackItem, ...prev]);
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

    const targetIncidentId = match?.matched ? match.incidentId : (civicIncidents[0]?.id || 'INC-2026-DEL-01');

    const newSignal = {
      id: `SIG-${Date.now().toString().slice(-6)}`,
      incidentId: targetIncidentId,
      citizenName: signalData.citizenName || user?.name || 'Anonymous Resident',
      ward: signalData.ward || user?.ward || 'Ward 14 (Rohini Sector 14)',
      channel: signalData.channel || 'QUICK_TEXT',
      rawInput,
      translatedText: rawInput,
      category: dna.issueType,
      inferredAsset: dna.asset,
      hasPhoto: !!signalData.photoUrl,
      photoUrl: signalData.photoUrl || null,
      lat: signalData.lat || 28.7180,
      lng: signalData.lng || 77.1260,
      timestamp: new Date().toLocaleString(),
      status: 'CLUSTERED',
      confidence: 'High (92%)',
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

  return (
    <AppContext.Provider
      value={{
        token,
        user,
        currentCitizen: (user && user.role === 'citizen') ? user : {
          id: 'USR-CITIZEN-01',
          name: 'Aditya Verma',
          email: 'aditya@citizen.in',
          role: 'citizen',
          phone: '+91 98712-88210',
          ward: 'Ward 14 (Rohini Sector 14)',
          pincode: '110085'
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
        PERMISSIONS
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
