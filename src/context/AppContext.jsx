import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_GRIEVANCES, MOCK_CLUSTERS, SYSTEM_METRICS, INITIAL_NOTIFICATIONS } from '../data/mockGrievances';
import { analyzeGrievanceInput } from '../services/aiEngine';

const AppContext = createContext();

// Pre-seeded demo credentials for instant 1-click persona switching
export const DEMO_CREDENTIALS = {
  citizen: { email: 'aditya@citizen.in', password: 'citizen123', label: 'Citizen (Aditya Verma)' },
  officer: { email: 'sanjay.sharma@djb.gov.in', password: 'officer123', label: 'Govt Officer (Er. Sanjay Sharma - DJB)' },
  dept_admin: { email: 'admin.djb@delhi.gov.in', password: 'deptadmin123', label: 'Dept Admin (Er. Rajiv Malhotra - DJB)' },
  super_admin: { email: 'superadmin@delhi.gov.in', password: 'superadmin123', label: 'Super Admin (Dr. Meenakshi Sundaram, IAS)' }
};

export function AppProvider({ children }) {
  // Session & User State
  const [token, setToken] = useState(() => localStorage.getItem('jansahayk_token') || 'demo_token_citizen');
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('jansahayk_user');
    return saved ? JSON.parse(saved) : {
      id: 'USR-CITIZEN-01',
      name: 'Aditya Verma',
      email: 'aditya@citizen.in',
      role: 'citizen',
      phone: '+91 98712-88210',
      ward: 'Ward 14 (Rohini Sector 14)',
      pincode: '110085'
    };
  });

  const [grievances, setGrievances] = useState(() => {
    const saved = localStorage.getItem('jansahayk_grievances');
    return saved ? JSON.parse(saved) : INITIAL_GRIEVANCES;
  });

  const [clusters, setClusters] = useState(() => {
    const saved = localStorage.getItem('jansahayk_clusters');
    return saved ? JSON.parse(saved) : MOCK_CLUSTERS;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('jansahayk_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState([]);
  const [slaRules, setSlaRules] = useState([]);
  const [authError, setAuthError] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    if (token) localStorage.setItem('jansahayk_token', token);
    else localStorage.removeItem('jansahayk_token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('jansahayk_user', JSON.stringify(user));
    else localStorage.removeItem('jansahayk_user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jansahayk_grievances', JSON.stringify(grievances));
  }, [grievances]);

  useEffect(() => {
    localStorage.setItem('jansahayk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Real backend synchronization on mount
  useEffect(() => {
    fetchGrievances();
    fetchNotifications();
    if (token) {
      fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          if (data && data.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, []);

  const fetchGrievances = async () => {
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/grievances', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.grievances && data.grievances.length > 0) {
          setGrievances(data.grievances);
        }
      }
    } catch (e) {
      // Fallback gracefully
    }
  };

  const fetchNotifications = async () => {
    try {
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      const res = await fetch('/api/notifications', { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.notifications && data.notifications.length > 0) {
          setNotifications(data.notifications);
        }
      }
    } catch (e) {
      // Fallback gracefully
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

  // Real Login
  const login = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);
    try {
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
      setIsLoadingAuth(false);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
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
      setIsLoadingAuth(false);
      return data.user;
    } catch (err) {
      setAuthError(err.message);
      setIsLoadingAuth(false);
      throw err;
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
    } catch (e) {}
    setToken(null);
    setUser(null);
  };

  // 1-Click Quick Demo Switcher
  const switchDemoRole = async (roleKey) => {
    const cred = DEMO_CREDENTIALS[roleKey];
    if (cred) {
      return await login(cred.email, cred.password);
    }
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

    // Fallback in-memory
    const fallbackId = `DL-2026-W${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}`;
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
  const transitionStatus = async (grievanceId, newStatus, reason) => {
    try {
      const res = await fetch(`/api/grievances/${grievanceId}/transition-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newStatus, reason })
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
        setUser(data.user);
        return data.user;
      }
    } catch (e) {}

    const updatedUser = { ...user, ...settings };
    setUser(updatedUser);
    return updatedUser;
  };

  // Upvote
  const upvoteGrievance = (id) => {
    setGrievances(prev => prev.map(g => g.id === id ? { ...g, upvotes: (g.upvotes || 0) + 1 } : g));
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
        role: user?.role || 'citizen',
        login,
        register,
        logout,
        switchDemoRole,
        authError,
        isLoadingAuth,
        grievances,
        clusters,
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
        reopenDispute,
        submitFeedback,
        addInternalNote,
        reassignGrievance,
        escalateGrievance,
        actionRecommendation,
        transitionStatus,
        handleDuplicateAction,
        updateUserSettings,
        upvoteGrievance,
        metrics: SYSTEM_METRICS
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
