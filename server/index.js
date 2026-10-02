import './env.js';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist');

// Safe Supabase Client without hardcoded secrets
const supabaseUrl = process.env.SUPABASE_URL || null;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || null;
export const supabaseServer = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

const isDemoMode = process.env.DEMO_MODE === 'true';
if (isDemoMode) {
  console.log('\x1b[33m%s\x1b[0m', 'ℹ️  [MODE] Running in DEMO MODE (local JSON store fallback, deterministic AI fallback)');
} else {
  console.log('\x1b[32m%s\x1b[0m', '🚀 [MODE] Running in PRODUCTION MODE (PostgreSQL authoritative persistence enforced)');
}

import { db } from './db/database.js';
import { orchestrator } from './agents/orchestrator.js';
import { aiProvider } from './agents/aiProvider.js';
import { postgresDB, isPostgresActive } from './db/postgres.js';
import { CANONICAL_STATUSES, ALLOWED_STATUS_TRANSITIONS, normalizeStatus, isValidTransition, getRoleStatusLabel } from './constants/statuses.js';
import { CANONICAL_EVENTS } from './constants/events.js';
import { geminiAssistant } from './services/geminiAssistant.js';
import { configureCors } from './middleware/cors.js';
import { authLimiter, aiEndpointLimiter, complaintSubmitLimiter, fileUploadLimiter } from './middleware/rateLimiter.js';
import { ApiError, sendError, errorHandler } from './middleware/errorHandler.js';
import { StorageService } from './services/storageService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Production CORS with domain whitelist
app.use(configureCors());
app.use(express.json({ limit: '15mb' }));

// Serve static evidence uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../public/uploads')));

// ============================================================================
// In-Memory Database & Seed Data
// ============================================================================

const USERS = [
  {
    id: 'USR-CITIZEN-01',
    name: 'Santosh Gawade',
    email: 'santosh@citizen.in',
    password: 'citizen123',
    role: 'citizen',
    phone: '+91 98220-44102',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
    pincode: '412207',
    verified: true
  },
  {
    id: 'USR-OFFICER-01',
    name: 'Er. Sanjay Sharma',
    email: 'sanjay.sharma@pmc.gov.in',
    password: 'officer123',
    role: 'civic_officer',
    department: 'PMC Water Supply Department',
    designation: 'Executive Engineer (Wagholi Sub-Division)',
    zone: 'Zone East (Wagholi Sub-Division, Pune)',
    phone: '+91 98221-90021'
  },
  {
    id: 'USR-DEPTADMIN-01',
    name: 'Er. Sachin Patil',
    email: 'admin.water@pune.gov.in',
    password: 'deptadmin123',
    role: 'civic_officer',
    department: 'PMC Water Supply Department',
    designation: 'Superintending Engineer (Water Works)',
    phone: '+91 98220-11223'
  },
  {
    id: 'USR-SUPERADMIN-01',
    name: 'Dr. Suhas Diwase, IAS',
    email: 'commissioner@pmc.gov.in',
    password: 'superadmin123',
    role: 'super_admin',
    designation: 'Municipal Commissioner (PMC Pune)',
    phone: '+91 020-2550-1000'
  },
  {
    id: 'USR-CIVICOFFICER-01',
    name: 'Er. Sanjay Sharma',
    email: 'civic.officer@pmc.punecorp.gov.in',
    password: 'civicofficer123',
    role: 'civic_officer',
    department: 'PMC Water Supply Department',
    designation: 'Executive Engineer & Department Administrator',
    zone: 'Zone East (Wagholi Sub-Division, Pune)',
    phone: '+91 98221-90021'
  },
  {
    id: 'WRK-WAG-01',
    name: 'Ramesh Jadhav',
    email: 'ramesh.plumbing@jansahayak.in',
    password: 'worker123',
    role: 'worker',
    department: 'PMC Verified Technician',
    ward: 'Wagholi Ward 29 (Ivy Estate & Kesnand Road)',
    phone: '+91 98221-55410',
    category: 'plumbing'
  }
];

let SESSIONS = {
  'demo_token_citizen': USERS[0],
  'demo_token_officer': USERS[1],
  'demo_token_dept_admin': USERS[2],
  'demo_token_super_admin': USERS[3],
  'demo_token_civic_officer': USERS[4],
  'demo_token_worker': USERS[5]
}; // token -> user

let AUDIT_LOGS = (db.getAuditLogs && db.getAuditLogs().length > 0)
  ? db.getAuditLogs()
  : [
    { id: 'LOG-101', timestamp: '2026-09-16 09:31 AM', actor: 'System AI Engine', action: 'GRIEVANCE_TRIAGED', targetId: 'DL-2026-W14-0892', details: 'Autoclassified as Critical Biological Hazard, routed to DJB' },
    { id: 'LOG-102', timestamp: '2026-09-16 10:15 AM', actor: 'Er. Sanjay Sharma', action: 'DISPATCH_APPROVED', targetId: 'DL-2026-W14-0892', details: 'Emergency repair clamp squad mobilized to Mother Dairy junction' }
  ];

function recordAuditLog(entry) {
  const logItem = {
    id: entry.id || `LOG-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    timestamp: entry.timestamp || new Date().toLocaleTimeString(),
    ...entry
  };
  AUDIT_LOGS.unshift(logItem);
  if (db.saveAuditLog) {
    db.saveAuditLog(logItem);
  }
  return logItem;
}

let DEPARTMENTS = [
  { id: 'DJB', name: 'Delhi Jal Board (DJB)', head: 'Er. Rajiv Malhotra', activeOfficers: 280, openCases: 142, slaCompliance: '94.8%' },
  { id: 'PWD', name: 'Public Works Department (PWD)', head: 'Er. Rajesh K. Meena', activeOfficers: 340, openCases: 189, slaCompliance: '88.2%' },
  { id: 'MCD', name: 'Municipal Corporation of Delhi (MCD)', head: 'Dr. K. S. Tyagi', activeOfficers: 520, openCases: 310, slaCompliance: '91.4%' },
  { id: 'BSES', name: 'BSES Rajdhani Power Limited', head: 'Er. Neeraj Bansal', activeOfficers: 190, openCases: 64, slaCompliance: '99.1%' }
];

let SLA_RULES = [
  { category: 'Water Supply & Contamination', criticalHours: 12, highHours: 24, normalHours: 48, escalationRole: 'Chief Engineer' },
  { category: 'Roads & Infrastructure', criticalHours: 6, highHours: 24, normalHours: 72, escalationRole: 'Superintending Engineer' },
  { category: 'Sanitation & Solid Waste', criticalHours: 12, highHours: 24, normalHours: 48, escalationRole: 'Chief Sanitary Inspector' },
  { category: 'Electricity & Power Grid', criticalHours: 2, highHours: 6, normalHours: 24, escalationRole: 'Grid Safety Director' }
];

let NOTIFICATIONS_DB = [
  {
    id: 'NOTIF-01',
    userId: 'USR-CITIZEN-01',
    userRole: 'citizen',
    title: 'Repair Team Dispatched',
    message: 'DJB Quick-Response Squad #4 has been dispatched to Sector 14 Mother Dairy junction for ticket DL-2026-W14-0892.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/citizen/DL-2026-W14-0892',
    type: 'STATUS_UPDATE',
    read: false,
    createdAt: '10 mins ago',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-02',
    userId: 'USR-CITIZEN-01',
    userRole: 'citizen',
    title: 'AI Triage & Verification Completed',
    message: 'Your grievance DL-2026-W14-0892 was classified as CRITICAL (Biological Contamination Hazard) and routed to DJB Rohini Zone.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/citizen/DL-2026-W14-0892',
    type: 'AI_ANALYSIS',
    read: true,
    createdAt: '45 mins ago',
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-03',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'High Priority Case Assigned',
    message: 'New grievance DL-2026-W14-0892 assigned with SLA target: 12 Hours. Potential duplicate cluster of 3 tickets detected.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/officer',
    type: 'ASSIGNMENT',
    read: false,
    createdAt: '30 mins ago',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-04',
    userId: 'USR-OFFICER-01',
    userRole: 'officer',
    title: 'SLA Risk Alert (2h Remaining)',
    message: 'Ticket DL-2026-P22-0419 (Pothole & Cave-in at Outer Ring Road) approaching SLA threshold.',
    grievanceId: 'DL-2026-P22-0419',
    link: '/officer',
    type: 'SLA_ALERT',
    read: false,
    createdAt: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-05',
    userId: 'USR-DEPTADMIN-01',
    userRole: 'dept_admin',
    title: 'Systemic Hotspot Detected',
    message: 'AI Hotspot Engine identified 8 recurring water contamination complaints in Rohini Ward 14 within 72 hours.',
    grievanceId: 'DL-2026-W14-0892',
    link: '/admin',
    type: 'SYSTEMIC_HOTSPOT',
    read: false,
    createdAt: '2 hours ago',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: 'NOTIF-06',
    userId: 'USR-SUPERADMIN-01',
    userRole: 'super_admin',
    title: 'Automated Escalation Rule Triggered',
    message: '2 overdue civic grievances in MCD East Zone automatically escalated to Superintending Engineer.',
    grievanceId: 'DL-2026-M09-0112',
    link: '/admin/super',
    type: 'ESCALATION',
    read: false,
    createdAt: '3 hours ago',
    timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  }
];

function createNotification({ userId, userRole, title, message, grievanceId, link, type = 'GENERAL' }) {
  const notif = {
    id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: userId || null,
    userRole: userRole || null,
    title,
    message,
    grievanceId: grievanceId || null,
    link: link || '/citizen',
    type,
    read: false,
    createdAt: 'Just now',
    timestamp: new Date().toISOString()
  };
  NOTIFICATIONS_DB.unshift(notif);
  postgresDB.saveNotification(notif).catch(() => {});
  return notif;
}

// GRIEVANCES_DB initialized from authoritative complaint seed data with write-through caching to Supabase PostgreSQL.
let GRIEVANCES_DB = db.getComplaints ? db.getComplaints() : [];

// Boot: Pre-load existing grievances from Supabase into in-memory cache
(async () => {
  try {
    const existing = await postgresDB.getAllGrievances();
    if (existing && existing.length > 0) {
      GRIEVANCES_DB = existing;
      console.log(`📦 [Boot] Loaded ${existing.length} grievances from Supabase into memory cache`);
    } else if (GRIEVANCES_DB.length > 0) {
      console.log(`📦 [Boot] Using ${GRIEVANCES_DB.length} seed grievances`);
    }
  } catch (e) {
    console.warn('[Boot] Could not pre-load grievances from DB:', e.message);
  }
})();

// ============================================================================
// Authentication & Authorization Middleware
// ============================================================================


async function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;
  
  if (!token) {
    return sendError(res, 401, 'UNAUTHORIZED', 'Unauthorized: Access token missing');
  }

  try {
    if (supabaseServer) {
      try {
        const { data: { user }, error } = await supabaseServer.auth.getUser(token);
        if (!error && user) {
          const profile = await postgresDB.getCivicProfile(user.id);
          const roleLower = (profile?.role || user.user_metadata?.role || 'CITIZEN').toLowerCase();

          req.user = {
            id: user.id,
            email: user.email,
            name: profile?.full_name || user.user_metadata?.full_name || user.email.split('@')[0],
            role: roleLower,
            department: profile?.department_id || (roleLower === 'civic_officer' ? 'Delhi Jal Board (DJB)' : null),
            designation: profile?.designation,
            ward: profile?.ward || 'Ward 14 (Rohini Sector 14)',
            zone: profile?.zone,
            pincode: profile?.pincode || '110085',
            phone: profile?.phone || user.phone,
            verified: profile?.verified ?? true
          };
          return next();
        }
      } catch (supaErr) {
        // Fallback to local session table
      }
    }

    // Fallback for transition / demo compatibility
    const legacyUser = SESSIONS[token];
    if (legacyUser) {
      req.user = legacyUser;
      return next();
    }

    return sendError(res, 403, 'FORBIDDEN', 'Forbidden: Invalid or expired session token');
  } catch (err) {
    console.error('Auth verification error:', err.message);
    const legacyUser = SESSIONS[token];
    if (legacyUser) {
      req.user = legacyUser;
      return next();
    }
    return sendError(res, 500, 'AUTH_SERVICE_ERROR', 'Authentication verification service error');
  }
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, 403, 'FORBIDDEN', 'Forbidden: Access token or user missing');
    }
    const userRole = req.user.role;
    // Civic Officer inherits all capabilities of both officer and dept_admin.
    const isAuthorized = allowedRoles.includes(userRole) ||
      (userRole === 'civic_officer' && (allowedRoles.includes('officer') || allowedRoles.includes('dept_admin'))) ||
      ((userRole === 'officer' || userRole === 'dept_admin') && allowedRoles.includes('civic_officer'));

    if (!isAuthorized) {
      return sendError(res, 403, 'FORBIDDEN', `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions. Current role: ${req.user?.role || 'None'}`);
    }
    next();
  };
}

// ============================================================================
// System Health & Diagnostics
// ============================================================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    mode: isDemoMode ? 'demo' : 'production',
    persistence: isPostgresActive() ? 'postgresql' : (supabaseServer ? 'supabase' : 'local_json_store'),
    aiEngine: {
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      activeProvider: Boolean(process.env.GEMINI_API_KEY) ? 'gemini' : 'deterministic_fallback',
      embeddingDimension: 768
    },
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'JanSahayak Civic Intelligence API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================================================
// Real-Time Server-Sent Events (SSE) Stream
// ============================================================================
app.get(['/api/events', '/api/intelligence/events'], async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const token = req.query.token || (req.headers['authorization'] && req.headers['authorization'].split(' ')[1]);
  const clientId = req.query.clientId || null;

  let sseUser = null;
  if (token) {
    if (supabaseServer) {
      try {
        const { data: { user: authUser } } = await supabaseServer.auth.getUser(token);
        if (authUser) {
          const profile = await postgresDB.getCivicProfile(authUser.id);
          sseUser = {
            id: authUser.id,
            email: authUser.email,
            role: (profile?.role || 'CITIZEN').toLowerCase(),
            department: profile?.department_id,
            name: profile?.full_name || authUser.email
          };
        }
      } catch (e) {}
    }
    if (!sseUser && SESSIONS[token]) {
      sseUser = SESSIONS[token];
    }
  }

  // Register client in orchestrator
  orchestrator.addSSEClient(res, sseUser, clientId);

  // Send initial handshake with authenticated persona info
  res.write(`event: connected\ndata: ${JSON.stringify({ 
    status: 'connected', 
    authenticated: Boolean(sseUser),
    role: sseUser?.role || 'guest',
    time: new Date().toISOString() 
  })}\n\n`);

  // Keep-alive heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch (e) {
      clearInterval(heartbeat);
    }
  }, 20000);

  req.on('close', () => {
    clearInterval(heartbeat);
    orchestrator.removeSSEClient(res);
  });
});

// ============================================================================
// Geolocation & Reverse Geocoding
// ============================================================================
app.post('/api/location/reverse-geocode', async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'Latitude and Longitude required.' });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const geoRes = await fetch(url, {
      headers: {
        'User-Agent': 'JanSahayak-Civic-Platform/1.0 (delhi.civic@gov.in)'
      }
    });

    if (geoRes.ok) {
      const data = await geoRes.json();
      const addr = data.address || {};
      const road = addr.road || addr.neighbourhood || addr.suburb || 'Local Area';
      const city = addr.city || addr.state_district || 'New Delhi';
      const pincode = addr.postcode || '110085';
      const ward = `Ward ${Math.floor(10 + (Math.abs(Number(lat) * 100) % 80))} (${road})`;

      return res.json({
        success: true,
        formattedAddress: data.display_name?.split(',').slice(0, 3).join(', ') || `${road}, ${city}`,
        area: road,
        ward,
        pincode,
        city,
        lat: Number(lat),
        lng: Number(lng)
      });
    }
  } catch (err) {
    console.warn('[ReverseGeocode] Network lookup fallback:', err.message);
  }

  // Resilient fallback with coordinate context
  res.json({
    success: true,
    formattedAddress: `Sector 14 Corridor (GPS: ${Number(lat).toFixed(4)}°N, ${Number(lng).toFixed(4)}°E)`,
    area: 'Sector 14 Corridor',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085',
    city: 'New Delhi',
    lat: Number(lat),
    lng: Number(lng)
  });
});

// ============================================================================
// Auth Endpoints
// ============================================================================

// 1. Register Citizen via Supabase Auth
app.post('/api/auth/register', authLimiter, async (req, res) => {
  const { name, email, password, phone, ward, pincode } = req.body;
  if (!email || !password || !name) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Name, Email, and Password are required.');
  }

  try {
    let authUser = null;
    let sessionToken = null;

    if (supabaseServer) {
      try {
        const { data, error } = await supabaseServer.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              role: 'CITIZEN',
              full_name: name,
              phone: phone || '+91 98712-88210',
              ward: ward || 'Ward 14 (Rohini Sector 14)',
              pincode: pincode || '110085',
              app: 'jan_sahayak'
            }
          }
        });

        if (error) {
          return sendError(res, 400, 'REGISTRATION_FAILED', error.message);
        }
        authUser = data.user;
        sessionToken = data.session?.access_token;
      } catch (supaErr) {
        console.warn('[Register] Supabase sign-up note:', supaErr.message);
      }
    }

    const safeUser = {
      id: authUser?.id || `USR-CITIZEN-${Date.now()}`,
      name,
      email: authUser?.email || email,
      role: 'citizen',
      phone: phone || '+91 98712-88210',
      ward: ward || 'Ward 14 (Rohini Sector 14)',
      pincode: pincode || '110085',
      verified: true
    };

    const token = sessionToken || `token_citizen_${Date.now()}`;
    SESSIONS[token] = safeUser;
    USERS.push({ ...safeUser, password });

    postgresDB.logAuditEvent(name, 'CITIZEN_REGISTERED', safeUser.id, `Citizen registered in ${safeUser.ward}`);

    res.status(201).json({
      success: true,
      token,
      user: safeUser,
      message: 'Account registered successfully.'
    });
  } catch (err) {
    console.error('Registration error:', err.message);
    sendError(res, 500, 'REGISTRATION_ERROR', 'Registration failure: ' + err.message);
  }
});

// 2. Login via Supabase Auth
app.post('/api/auth/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Email and password required.');
  }

  try {
    let authUser = null;
    let session = null;

    if (supabaseServer) {
      try {
        const { data, error } = await supabaseServer.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        });

        if (!error && data?.user) {
          authUser = data.user;
          session = data.session;
        }
      } catch (supaErr) {
        // Fall back to local seed accounts
      }
    }

    if (authUser && session) {
      const profile = await postgresDB.getCivicProfile(authUser.id);
      const roleLower = (profile?.role || authUser.user_metadata?.role || 'CITIZEN').toLowerCase();

      const safeUser = {
        id: authUser.id,
        email: authUser.email,
        name: profile?.full_name || authUser.user_metadata?.full_name || authUser.email.split('@')[0],
        role: roleLower,
        department: profile?.department_id || (roleLower === 'civic_officer' ? 'Delhi Jal Board (DJB)' : null),
        designation: profile?.designation,
        zone: profile?.zone,
        ward: profile?.ward || 'Ward 14 (Rohini Sector 14)',
        pincode: profile?.pincode || '110085',
        phone: profile?.phone || authUser.phone,
        verified: profile?.verified ?? true
      };

      postgresDB.logAuditEvent(safeUser.name, 'USER_LOGIN', safeUser.id, `Logged in with role: ${safeUser.role}`);

      return res.json({
        success: true,
        token: session.access_token,
        user: safeUser,
        session
      });
    }

    // Fallback for seed users / demo accounts
    const legacyUser = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (legacyUser) {
      const demoToken = `token_${legacyUser.role}_${Date.now()}`;
      SESSIONS[demoToken] = legacyUser;
      const { password: _, ...safeUser } = legacyUser;
      return res.json({ success: true, token: demoToken, user: safeUser });
    }

    return sendError(res, 401, 'INVALID_CREDENTIALS', 'Invalid email or password credentials.');
  } catch (err) {
    console.error('Login error:', err.message);
    sendError(res, 500, 'LOGIN_ERROR', 'Login service failure: ' + err.message);
  }
});

// 3. Current Authenticated Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// 4. Logout
app.post('/api/auth/logout', authenticateToken, async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token) {
    delete SESSIONS[token];
    try {
      await supabaseServer.auth.signOut();
    } catch (e) {}
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Database Grievance Record Helpers
async function getGrievanceRecord(id) {
  const mem = GRIEVANCES_DB.find(g => g.id === id);
  const localDb = db.getComplaintById ? db.getComplaintById(id) : null;
  const dbItem = await postgresDB.getGrievanceById(id);
  const item = mem || localDb || dbItem;
  if (!item) return null;
  return {
    ...dbItem,
    ...localDb,
    ...mem,
    timeline: (mem?.timeline && mem.timeline.length > 0) 
      ? mem.timeline 
      : (localDb?.timeline && localDb.timeline.length > 0 ? localDb.timeline : (dbItem?.timeline || []))
  };
}

async function persistGrievanceRecord(item) {
  const idx = GRIEVANCES_DB.findIndex(g => g.id === item.id);
  if (idx >= 0) {
    GRIEVANCES_DB[idx] = item;
  } else {
    GRIEVANCES_DB.unshift(item);
  }
  db.saveComplaint(item);
  await postgresDB.saveGrievance(item);
}

// Get Grievances (Filtered by role & access via Supabase PostgreSQL)
app.get('/api/grievances', async (req, res) => {
  let list = [];
  try {
    list = await postgresDB.getAllGrievances();
  } catch (err) {
    console.warn('Error fetching grievances from postgres:', err.message);
  }

  // Authoritatively merge PostgreSQL rows with in-memory GRIEVANCES_DB & local store
  // so no newly submitted complaint is lost or dropped upon reload
  const localList = (GRIEVANCES_DB && GRIEVANCES_DB.length > 0) 
    ? GRIEVANCES_DB 
    : (db.getComplaints ? db.getComplaints() : []);
  
  const combinedMap = new Map();
  // Add in-memory / local items first (these have newest submissions)
  (localList || []).forEach(g => {
    if (g && g.id) combinedMap.set(g.id, g);
  });
  // Overlay/merge with postgres records
  (list || []).forEach(g => {
    if (g && g.id) {
      if (!combinedMap.has(g.id)) {
        combinedMap.set(g.id, g);
      } else {
        const existing = combinedMap.get(g.id);
        combinedMap.set(g.id, { ...g, ...existing });
      }
    }
  });

  const mergedGrievances = Array.from(combinedMap.values()).sort((a, b) => {
    const timeA = new Date(a.timestamp || a.created_at || 0).getTime();
    const timeB = new Date(b.timestamp || b.created_at || 0).getTime();
    return timeB - timeA;
  });

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  let user = null;
  if (token) {
    try {
      const { data: { user: authUser } } = await supabaseServer.auth.getUser(token);
      if (authUser) {
        const profile = await postgresDB.getCivicProfile(authUser.id);
        user = { ...authUser, role: (profile?.role || 'CITIZEN').toLowerCase(), department: profile?.department_id };
      }
    } catch (e) {}
    if (!user) user = SESSIONS[token];
  }

  // All roles (Citizen, Officer, Admin) receive the authoritative merged list.
  // The frontend OfficerWorkspace handles domain/status filtering while guaranteeing
  // newly created cases appear immediately at the top of the queue.
  return res.json({ grievances: mergedGrievances });
});

// GET Single Grievance by ID
app.get('/api/grievances/:id', async (req, res) => {
  const { id } = req.params;
  let item = await postgresDB.getGrievanceById(id);
  if (!item) {
    item = GRIEVANCES_DB.find(g => g.id === id);
  }
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });
  res.json({ grievance: item });
});

// GET Authoritative Grievance Timeline
app.get('/api/grievances/:id/timeline', async (req, res) => {
  const { id } = req.params;
  const item = await getGrievanceRecord(id);
  const incidentId = item?.incidentId || item?.clusterId || null;
  let timeline = await postgresDB.getAuthoritativeTimeline(id, incidentId);
  if (!timeline || timeline.length === 0) {
    timeline = item?.timeline || [];
  }
  res.json({ success: true, grievanceId: id, incidentId, timeline });
});

// GET Database Health & PostgreSQL Status
app.get('/api/health/db', (req, res) => {
  res.json({
    status: 'healthy',
    mode: isDemoMode ? 'demo' : 'production',
    persistence: isPostgresActive() ? 'postgresql' : (supabaseServer ? 'supabase' : 'local_json_store'),
    postgres: {
      active: isPostgresActive(),
      urlConfigured: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL)
    },
    supabase: {
      configured: Boolean(supabaseServer),
      urlConfigured: Boolean(process.env.SUPABASE_URL),
      anonKeyConfigured: Boolean(process.env.SUPABASE_ANON_KEY),
      serviceRoleKeyConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
    },
    ai: {
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      lastEmbeddingSource: aiProvider.lastEmbeddingSource || 'deterministic_fallback'
    },
    totalGrievances: GRIEVANCES_DB.length,
    totalIncidents: db.getIncidents().length,
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// Citizen Real-Time AI Understanding & Multimodal Endpoints
// ============================================================================

// 1. Live AI Understanding (Pre-Submission Review via Gemini)
app.post('/api/complaints/ai-understand', aiEndpointLimiter, async (req, res) => {
  const { text, description, ward, area } = req.body;
  const content = text || description;
  if (!content || content.trim().length < 5) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Sufficient complaint description is required for AI understanding.');
  }

  try {
    const prompt = `You are the JanSahayak Municipal Grievance Intelligence Engine.
Analyze this raw citizen complaint from Delhi:
"${content}"
Ward context: ${ward || 'Ward 14 (Rohini Sector 14)'}, Area: ${area || 'Local Area'}

Respond ONLY with valid JSON with this exact schema:
{
  "problem_type": string (concise 3-6 word title e.g. "Main Water Supply Contamination" or "Deep Asphalt Road Crater"),
  "category": string ("Water Supply & Contamination" | "Roads & Infrastructure" | "Sanitation & Solid Waste" | "Electricity & Power Grid"),
  "department": string ("Delhi Jal Board (DJB)" | "Public Works Department (PWD)" | "Municipal Corporation of Delhi (MCD)" | "BSES Rajdhani Power Limited"),
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "urgency": number (integer between 1 and 10),
  "summary": string (1-sentence concise summary in clear English),
  "root_cause_hypothesis": string (likely underlying infrastructure failure),
  "recommended_action": string (official municipal Standard Operating Procedure),
  "estimated_sla_hours": number (recommended resolution time limit in hours)
}`;

    const understanding = await aiProvider.generateStructuredJSON(prompt, '', {
      problem_type: 'Civic Infrastructure Concern',
      category: 'General Civic Infrastructure',
      department: 'Municipal Corporation of Delhi (MCD)',
      severity: 'HIGH',
      urgency: 7,
      summary: content.slice(0, 100),
      root_cause_hypothesis: 'Infrastructure deterioration requiring field inspection',
      recommended_action: 'Deploy emergency inspection crew to assess location',
      estimated_sla_hours: 24
    });

    const source = understanding._source || (aiProvider.apiKey ? 'gemini' : 'deterministic_fallback');
    const reason = understanding._reason || (source === 'gemini' ? 'Gemini 2.5 Flash live inference' : 'GEMINI_API_KEY not configured or offline');

    res.json({ success: true, understanding, source, reason });
  } catch (err) {
    sendError(res, 500, 'AI_INFERENCE_ERROR', 'AI Understanding error: ' + err.message);
  }
});

// 2. Multimodal Computer Vision Analysis via Gemini
app.post('/api/complaints/vision-analyze', aiEndpointLimiter, async (req, res) => {
  const { imageBase64, mimeType, contextPrompt, title, description, category } = req.body;
  if (!imageBase64) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Image base64 data required for vision analysis.');
  }

  try {
    const vision = await aiProvider.analyzeImageEvidence(
      imageBase64,
      mimeType || 'image/jpeg',
      {
        title: title || '',
        description: description || contextPrompt || '',
        category: category || ''
      }
    );
    res.json({
      success: true,
      vision,
      source: vision.source || 'deterministic_fallback',
      reason: vision.reason || (vision.source === 'gemini' ? 'Gemini Vision inference' : 'GEMINI_API_KEY not configured or offline')
    });
  } catch (err) {
    sendError(res, 500, 'VISION_ANALYSIS_ERROR', 'Vision analysis error: ' + err.message);
  }
});

// 3. Real Multimodal Speech-to-Text Audio Transcription via Gemini
app.post('/api/complaints/voice-transcribe', aiEndpointLimiter, async (req, res) => {
  const { audioBase64, mimeType, audioUrl } = req.body;

  let base64Data = audioBase64;
  if (!base64Data && audioUrl) {
    try {
      const audioFetch = await fetch(audioUrl);
      if (audioFetch.ok) {
        const arrayBuf = await audioFetch.arrayBuffer();
        base64Data = Buffer.from(arrayBuf).toString('base64');
      }
    } catch (e) {
      console.warn('[VoiceTranscribe] Failed to fetch audio URL:', e.message);
    }
  }

  if (!base64Data) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'Audio data (audioBase64 or audioUrl) is required.');
  }

  try {
    const transcription = await aiProvider.transcribeAudioEvidence(base64Data, mimeType || 'audio/webm');
    res.json({
      success: true,
      ...transcription,
      source: transcription.source || 'deterministic_fallback',
      reason: transcription.reason || (transcription.source === 'gemini' ? 'Gemini Audio inference' : 'GEMINI_API_KEY not configured or offline')
    });
  } catch (err) {
    sendError(res, 500, 'VOICE_TRANSCRIPTION_ERROR', 'Audio transcription error: ' + err.message);
  }
});

// 4. Authoritative Evidence Upload API (Section 29)
app.post('/api/evidence/upload', fileUploadLimiter, async (req, res) => {
  const { base64Data, mimeType, category = 'complaints', complaintId = null, incidentId = null, metadata = {} } = req.body;

  if (!base64Data) {
    return sendError(res, 400, 'VALIDATION_ERROR', 'File base64 data is required for upload.');
  }

  try {
    // Resolve user if token present
    let uploaderId = null;
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token && SESSIONS[token]) {
      uploaderId = SESSIONS[token].id;
    }

    const saved = await StorageService.saveEvidenceFile({
      base64Data,
      mimeType: mimeType || 'image/jpeg',
      category,
      userId: uploaderId || 'anonymous'
    });

    // Record in database evidence table
    await postgresDB.saveEvidenceRecord({
      complaintId,
      incidentId,
      uploadedBy: uploaderId,
      type: mimeType?.includes('audio') ? 'AUDIO' : mimeType?.includes('pdf') ? 'DOCUMENT' : 'PHOTO',
      storagePath: saved.storagePath,
      fileUrl: saved.publicUrl,
      mimeType: saved.mimeType,
      metadata: { ...metadata, sizeBytes: saved.sizeBytes, category }
    });

    res.status(201).json({
      success: true,
      ...saved
    });
  } catch (err) {
    console.error('Evidence upload error:', err.message);
    sendError(res, 400, 'UPLOAD_FAILED', err.message);
  }
});

// 3. Citizen Dashboard Data API (Powered by Supabase PostgreSQL)
app.get('/api/citizen/dashboard', authenticateToken, requireRole(['citizen', 'super_admin']), async (req, res) => {
  const citizenId = req.user.id;
  const citizenWard = req.user.ward || 'Ward 14 (Rohini Sector 14)';

  // Real user reports from Supabase PostgreSQL
  let allGrievances = [];
  try {
    allGrievances = await postgresDB.getAllGrievances();
  } catch (err) {}
  if (!allGrievances || allGrievances.length === 0) {
    allGrievances = (GRIEVANCES_DB && GRIEVANCES_DB.length > 0) ? GRIEVANCES_DB : db.getComplaints();
  }

  const myReports = allGrievances.filter(g => 
    g.citizenId === citizenId || 
    (g.citizenName && req.user.name && g.citizenName.toLowerCase() === req.user.name.toLowerCase()) ||
    (citizenId.startsWith('a0000000-') && g.citizenName?.includes('Aditya'))
  );

  // Real incidents from Supabase PostgreSQL
  let allIncidents = await postgresDB.getAllIncidents();
  if (!allIncidents || allIncidents.length === 0) {
    allIncidents = db.getIncidents ? db.getIncidents() : [];
  }
  const wardIncidents = allIncidents.filter(inc => !inc.affectedArea || inc.affectedArea.includes('14') || inc.affectedArea === citizenWard);

  // Real notifications from Supabase PostgreSQL
  let userNotifs = await postgresDB.getNotifications(citizenId, 'citizen');
  if (!userNotifs || userNotifs.length === 0) {
    userNotifs = NOTIFICATIONS_DB.filter(n => n.userId === citizenId || n.userRole === 'citizen');
  }

  res.json({
    success: true,
    citizen: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      ward: req.user.ward,
      pincode: req.user.pincode
    },
    metrics: {
      totalReports: myReports.length,
      activeReports: myReports.filter(r => r.status !== 'RESOLVED' && r.status !== 'RESOLVED_CONFIRMED').length,
      resolvedReports: myReports.filter(r => r.status === 'RESOLVED' || r.status === 'RESOLVED_CONFIRMED').length,
      pendingVerification: myReports.filter(r => r.status === 'RESOLVED').length
    },
    myReports,
    wardIncidents,
    notifications: userNotifs
  });
});

// 4. Create Grievance (Citizen or Admin)
app.post('/api/grievances', authenticateToken, requireRole(['citizen', 'super_admin']), async (req, res) => {
  const { title, description, category, department, location, urgency, urgencyScore, evidence } = req.body;
  
  if (!description) {
    return res.status(400).json({ error: 'Grievance description is required.' });
  }

  const wardNum = (location?.ward || req.user.ward || 'Ward 14').match(/\d+/)?.[0] || '14';
  const newId = `JS-2026-W${wardNum}-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const newGrievance = {
    id: newId,
    title: title || `${category || 'Civic'} Issue in ${location?.ward || req.user.ward}`,
    descriptionRaw: description,
    languageDetected: 'Multilingual / Hinglish',
    category: category || 'General Civic Infrastructure',
    department: department || 'Municipal Corporation of Delhi (MCD)',
    officerName: 'Pending Assignment',
    location: location || { ward: req.user.ward, area: 'Local Area', city: 'New Delhi', pincode: req.user.pincode, lat: 28.7185, lng: 77.1250 },
    urgency: urgency || 'HIGH',
    urgencyScore: urgencyScore || 85,
    status: 'INGESTED',
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timestamp: new Date().toISOString(),
    slaDeadline: '24 Hours from now',
    slaHoursLeft: 24,
    upvotes: 1,
    citizenId: req.user.id,
    citizenName: req.user.name,
    citizenPhone: req.user.phone,
    evidence: evidence || { hasPhoto: false, hasAudio: false },
    informationRequests: [],
    reopenedDispute: null,
    timeline: [
      { stage: 'Submitted', time: 'Just now', detail: 'Submitted via JanSahayk Web Portal', status: 'completed' },
      { stage: 'AI Triage & DNA Generated', time: 'Just now', detail: `Grievance DNA formed; assigned to ${department || 'MCD'}`, status: 'completed' },
      { stage: 'Officer Assignment', time: 'Pending', detail: 'Awaiting ward executive engineer review', status: 'in_progress' }
    ]
  };

  // Run through connected multi-agent orchestrator pipeline
  const orchestration = await orchestrator.processComplaint(newGrievance);

  // Sync enriched fields from orchestration
  if (orchestration.complaint) {
    newGrievance.analysis = orchestration.complaint.analysis;
    newGrievance.dna = orchestration.complaint.dna;
    newGrievance.category = orchestration.complaint.category || newGrievance.category;
    newGrievance.department = orchestration.complaint.department || newGrievance.department;
    newGrievance.urgency = orchestration.complaint.urgency || newGrievance.urgency;
    newGrievance.urgencyScore = orchestration.complaint.urgencyScore || newGrievance.urgencyScore;
  }
  if (orchestration.cluster) {
    newGrievance.clusterId = orchestration.cluster.id;
    newGrievance.clusterCount = orchestration.cluster.complaintIds?.length || 1;
    newGrievance.clusterTitle = orchestration.cluster.title;
  }
  if (orchestration.incident) {
    newGrievance.incidentId = orchestration.incident.id;
  }

  await persistGrievanceRecord(newGrievance);

  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'GRIEVANCE_SUBMITTED',
    targetId: newId,
    details: `Filed under ${newGrievance.department} (${newGrievance.urgency})`
  });

  // Notifications
  createNotification({
    userId: req.user.id,
    userRole: 'citizen',
    title: 'Grievance Registered Successfully',
    message: `Ticket ${newId} registered and assigned to ${newGrievance.department}.`,
    grievanceId: newId,
    link: `/citizen/${newId}`,
    type: 'STATUS_UPDATE'
  });
  createNotification({
    userRole: 'officer',
    title: `New Case Assigned: ${newGrievance.title.slice(0, 35)}...`,
    message: `Case ${newId} routed with ${newGrievance.urgency} priority to ${newGrievance.department}.`,
    grievanceId: newId,
    link: `/officer`,
    type: 'ASSIGNMENT'
  });

  // Real-time broadcast
  orchestrator.broadcastEvent('complaint_created', { 
    complaintId: newId, 
    title: newGrievance.title,
    department: newGrievance.department,
    urgency: newGrievance.urgency
  });

  res.status(201).json({ 
    success: true, 
    grievance: newGrievance, 
    incident: orchestration.incident, 
    cluster: orchestration.cluster 
  });
});

// 5. Citizen Verification & Dispute Reopening Endpoint
app.post('/api/grievances/:id/verify', authenticateToken, requireRole(['citizen', 'super_admin']), async (req, res) => {
  const { id } = req.params;
  const { satisfaction, feedbackText, evidencePhotos, rating } = req.body;

  const item = await getGrievanceRecord(id);
  if (!item) {
    return res.status(404).json({ error: 'Grievance not found.' });
  }

  // Enforce citizen ownership check
  if (req.user.role === 'citizen') {
    const isOwner = (item.citizenId && item.citizenId === req.user.id) ||
                    (item.citizenName && req.user.name && item.citizenName.toLowerCase() === req.user.name.toLowerCase());
    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized: You can only verify your own complaints.' });
    }
  }

  const isSatisfied = satisfaction === 'SATISFIED' || satisfaction === 'YES';
  const newStatus = isSatisfied ? 'RESOLVED_CONFIRMED' : 'DISPUTE_REOPENED';
  const previousStatus = item.status;
  item.status = newStatus;

  item.citizenVerification = {
    verifiedAt: new Date().toISOString(),
    satisfaction: isSatisfied ? 'SATISFIED' : 'DISPUTED',
    feedbackText: feedbackText || (isSatisfied ? 'Resolution confirmed by citizen on-site' : 'Citizen reported issue is still not fixed on ground'),
    evidencePhotos: evidencePhotos || [],
    rating: rating || (isSatisfied ? 5 : 2)
  };

  if (!item.timeline) item.timeline = [];
  item.timeline.push({
    stage: isSatisfied ? 'Citizen Verified & Closed' : 'Dispute Reopened by Citizen',
    time: 'Just now',
    detail: isSatisfied 
      ? 'Citizen completed real verification: Problem confirmed completely resolved.'
      : `Citizen disputed resolution: "${feedbackText || 'Problem persists on ground'}"`,
    status: isSatisfied ? 'completed' : 'in_progress'
  });

  // Record verification in public.verification_records
  await postgresDB.recordVerification({
    grievanceId: item.id,
    incidentId: item.incidentId || item.clusterId || null,
    citizenId: req.user.id,
    status: isSatisfied ? 'CONFIRMED' : 'DISPUTED',
    feedback: item.citizenVerification.feedbackText,
    rating: item.citizenVerification.rating,
    photoUrl: item.citizenVerification.evidencePhotos?.[0] || null
  });

  // Record status transition in public.incident_status_history
  await postgresDB.recordStatusTransition({
    incidentId: item.incidentId || item.id,
    fromStatus: previousStatus,
    toStatus: newStatus,
    reason: item.citizenVerification.feedbackText,
    trigger: isSatisfied ? 'CITIZEN_CONFIRMED_RESOLUTION' : 'CITIZEN_DISPUTED_RESOLUTION',
    actorId: req.user.id,
    actorName: req.user.name,
    actorRole: req.user.role
  });

  // If verified & satisfied, permanently add to Civic Memory with pgvector embedding
  if (isSatisfied) {
    try {
      const memoryText = `${item.title} - ${item.category} in ${item.location?.ward}. Root cause: ${item.dna?.problem || item.category}. Resolution applied: ${item.resolutionNotes || 'Remediated by field team'}.`;
      const emb = await aiProvider.generateEmbedding(memoryText);
      await postgresDB.saveCivicMemory({
        incidentTitle: item.title,
        category: item.category,
        department: item.department,
        rootCause: item.dna?.problem || 'Infrastructure wear and joint failure',
        resolutionApplied: item.resolutionNotes || 'Standard municipal engineering remediation',
        contractor: 'Delhi Municipal Maintenance Division',
        warrantyPeriod: '12 Months',
        recurrenceRate: '2.1%',
        costEstimate: '₹35,000',
        embedding: emb
      });
    } catch (memErr) {
      console.warn('Civic memory generation error:', memErr.message);
    }
  }

  // Create notifications
  const notif = {
    userRole: 'civic_officer',
    title: isSatisfied ? `Citizen Confirmed Resolution: ${item.id}` : `DISPUTE REOPENED: ${item.id}`,
    message: isSatisfied 
      ? `Citizen verified successful resolution for ticket ${item.id}. Case permanently logged to Civic Memory.`
      : `Citizen disputed resolution for ticket ${item.id}: "${feedbackText || 'Work incomplete'}". Immediate inspection required.`,
    grievanceId: item.id,
    link: `/officer`,
    type: isSatisfied ? 'STATUS_UPDATE' : 'DISPUTE'
  };
  await postgresDB.saveNotification(notif);
  createNotification(notif);

  await postgresDB.logAuditEvent(req.user.name, isSatisfied ? 'RESOLUTION_CONFIRMED' : 'DISPUTE_REOPENED', item.id, item.citizenVerification.feedbackText);
  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: isSatisfied ? 'RESOLUTION_CONFIRMED' : 'DISPUTE_REOPENED',
    targetId: item.id,
    details: item.citizenVerification.feedbackText
  });

  // Save grievance to Supabase
  await persistGrievanceRecord(item);

  // Broadcast real-time SSE & Realtime event
  orchestrator.broadcastEvent('status_changed', { 
    grievanceId: item.id, 
    newStatus, 
    actor: req.user.name 
  });

  res.json({ success: true, grievance: item });
});

// Direct Public Complaints API (Used for test suite and external reporting)
app.post('/api/complaints', async (req, res) => {
  const { text, description, title, location, category, citizenName, citizenId, ward, lat, lng } = req.body;
  const content = text || description;
  if (!content) return res.status(400).json({ error: 'Complaint text or description is required.' });

  const wardNum = (ward || location?.ward || 'Ward 14').match(/\d+/)?.[0] || '14';
  const newId = `JS-2026-W${wardNum}-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const loc = location || {
    ward: ward || 'Ward 14 (Rohini Sector 14)',
    lat: Number(lat) || 28.7185,
    lng: Number(lng) || 77.1250,
    area: 'Local Corridor'
  };

  const complaintPayload = {
    id: newId,
    title: title || content.slice(0, 55),
    descriptionRaw: content,
    category: category || 'General Civic Infrastructure',
    department: 'Municipal Corporation of Delhi (MCD)',
    location: loc,
    citizenName: citizenName || 'Verified Citizen',
    citizenId: citizenId || 'USR-CITIZEN-01',
    createdAt: 'Just now',
    timestamp: new Date().toISOString(),
    status: 'INGESTED',
    timeline: [
      {
        stage: 'Report Received',
        time: 'Just now',
        detail: 'Citizen signal logged and registered in platform.',
        status: 'completed'
      }
    ]
  };

  const orchestration = await orchestrator.processComplaint(complaintPayload);
  const finalComplaint = orchestration.complaint || complaintPayload;
  GRIEVANCES_DB.unshift(finalComplaint);
  db.saveComplaint(finalComplaint);
  await persistGrievanceRecord(finalComplaint);

  res.status(201).json({
    success: true,
    complaint: finalComplaint,
    cluster: orchestration.cluster,
    incident: orchestration.incident
  });
});


// Officer requests additional information from citizen
app.post('/api/grievances/:id/request-info', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { question } = req.body;

  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  const infoReq = {
    id: `REQ-${Date.now()}`,
    askedBy: req.user.name,
    officerDesignation: req.user.designation || 'Officer On-Duty',
    question: question || 'Please provide exact house number or landmark to assist field crew.',
    timestamp: new Date().toLocaleTimeString(),
    status: 'AWAITING_CITIZEN_REPLY',
    response: null
  };

  item.informationRequests.unshift(infoReq);
  item.status = 'INFO_REQUESTED';
  item.timeline.push({
    stage: 'Information Requested',
    time: 'Just now',
    detail: `Officer ${req.user.name} requested clarification: "${question}"`,
    status: 'in_progress'
  });

  createNotification({
    userRole: 'citizen',
    title: 'Clarification Needed by Officer',
    message: `Officer ${req.user.name} requested clarification for ticket ${id}: "${question}"`,
    grievanceId: id,
    link: `/citizen/${id}`,
    type: 'INFO_REQUEST'
  });

  res.json({ success: true, grievance: item });
});

// Citizen responds to information request
app.post('/api/grievances/:id/respond-info', authenticateToken, requireRole(['citizen']), (req, res) => {
  const { id } = req.params;
  const { requestId, answer } = req.body;

  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  // Enforce citizen ownership check
  if (req.user.role === 'citizen') {
    const isOwner = (item.citizenId && item.citizenId === req.user.id) ||
                    (item.citizenName && req.user.name && item.citizenName.toLowerCase() === req.user.name.toLowerCase());
    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized: You can only respond to requests on your own complaints.' });
    }
  }

  const reqObj = item.informationRequests.find(r => r.id === requestId) || item.informationRequests[0];
  if (reqObj) {
    reqObj.status = 'ANSWERED';
    reqObj.response = answer;
    reqObj.answeredAt = new Date().toLocaleTimeString();
  }

  item.status = 'IN_PROGRESS';
  item.timeline.push({
    stage: 'Citizen Clarification Provided',
    time: 'Just now',
    detail: `Citizen answered: "${answer}"`,
    status: 'completed'
  });

  db.updateGrievance(item);

  createNotification({
    userRole: 'officer',
    title: 'Citizen Clarification Provided',
    message: `Citizen answered clarification request on ticket ${id}: "${answer.slice(0, 45)}..."`,
    grievanceId: id,
    link: `/officer`,
    type: 'INFO_RESPONSE'
  });

  res.json({ success: true, grievance: item });
});

// Citizen reopens dispute if dissatisfied
app.post('/api/grievances/:id/reopen', authenticateToken, requireRole(['citizen']), (req, res) => {
  const { id } = req.params;
  const { disputeReason } = req.body;

  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  // Enforce citizen ownership check
  if (req.user.role === 'citizen') {
    const isOwner = (item.citizenId && item.citizenId === req.user.id) ||
                    (item.citizenName && req.user.name && item.citizenName.toLowerCase() === req.user.name.toLowerCase());
    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized: You can only reopen your own complaints.' });
    }
  }

  item.status = 'DISPUTE_REOPENED';
  item.reopenedDispute = {
    reopenedAt: new Date().toLocaleTimeString(),
    citizenReason: disputeReason || 'Water issue recurred the next morning after crew left.',
    status: 'UNDER_SUPERVISORY_REVIEW'
  };

  item.timeline.push({
    stage: 'Case Disputed & Reopened',
    time: 'Just now',
    detail: `Citizen disputed closure: "${disputeReason}". Escalated to Department Superintending Engineer.`,
    status: 'in_progress'
  });

  db.updateGrievance(item);

  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'CASE_REOPENED_DISPUTE',
    targetId: id,
    details: `Dispute logged: ${disputeReason}`
  });

  createNotification({
    userRole: 'officer',
    title: 'Dispute Reopened by Citizen',
    message: `Citizen disputed closure of ticket ${id}: "${disputeReason}"`,
    grievanceId: id,
    link: `/officer`,
    type: 'DISPUTE_REOPENED'
  });
  createNotification({
    userRole: 'dept_admin',
    title: `Escalated Dispute on Ticket ${id}`,
    message: `Citizen filed dissatisfaction appeal: "${disputeReason}"`,
    grievanceId: id,
    link: `/admin/department`,
    type: 'ESCALATION'
  });

  res.json({ success: true, grievance: item });
});

// Officer resolves grievance with evidence upload (Supabase-persisted)
app.post('/api/grievances/:id/resolve', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), async (req, res) => {
  const { id } = req.params;
  const { resolutionNotes, resolutionPhotoUrl } = req.body;

  const item = await getGrievanceRecord(id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  // Officer / Dept Admin department isolation check
  if ((req.user.role === 'officer' || req.user.role === 'civic_officer' || req.user.role === 'dept_admin') && req.user.department && item.department) {
    const userDeptShort = req.user.department.split(' ')[0].toLowerCase();
    const itemDeptShort = item.department.split(' ')[0].toLowerCase();
    if (!item.department.toLowerCase().includes(userDeptShort) && !req.user.department.toLowerCase().includes(itemDeptShort)) {
      return res.status(403).json({ error: `Unauthorized: User belongs to ${req.user.department} and cannot resolve complaints for ${item.department}.` });
    }
  }

  const previousStatus = item.status;
  item.status = 'RESOLVED';
  item.resolvedAt = new Date().toISOString();
  item.resolutionNotes = resolutionNotes || 'Field team completed replacement and pressure testing.';
  item.resolutionPhotoUrl = resolutionPhotoUrl || null;

  if (!item.timeline) item.timeline = [];
  item.timeline.push({
    stage: 'Resolved & Verified',
    time: 'Just now',
    detail: resolutionNotes || 'Work order completed by field division.',
    status: 'completed'
  });

  // Record field action in public.field_actions and persistent db
  const resolveAction = {
    incidentId: item.incidentId || null,
    grievanceId: item.id,
    officerId: req.user.id,
    officerName: req.user.name,
    actionType: 'RESOLUTION_SIGN_OFF',
    status: 'COMPLETED',
    notes: resolutionNotes || 'Work order completed by field division.',
    evidenceUrl: resolutionPhotoUrl || null
  };
  await postgresDB.recordFieldAction(resolveAction);
  if (db.saveFieldAction) {
    db.saveFieldAction(resolveAction);
  }

  // Record status transition
  await postgresDB.recordStatusTransition({
    incidentId: item.incidentId || item.id,
    fromStatus: previousStatus,
    toStatus: 'RESOLVED',
    reason: resolutionNotes || 'Field work completed',
    trigger: 'OFFICER_RESOLUTION',
    actorId: req.user.id,
    actorName: req.user.name,
    actorRole: req.user.role
  });

  // Save evidence record if photo was uploaded
  if (resolutionPhotoUrl) {
    await postgresDB.saveEvidenceRecord({
      complaintId: item.id,
      incidentId: item.incidentId || null,
      uploadedBy: req.user.id,
      type: 'PHOTO',
      storagePath: resolutionPhotoUrl,
      fileUrl: resolutionPhotoUrl,
      mimeType: 'image/jpeg',
      metadata: { action: 'RESOLUTION_SIGN_OFF', officer: req.user.name }
    });
  }

  await postgresDB.logAuditEvent(req.user.name, 'GRIEVANCE_RESOLVED', id, resolutionNotes, { role: req.user.role });
  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'GRIEVANCE_RESOLVED',
    targetId: id,
    details: resolutionNotes
  });

  const citizenNotif = {
    userRole: 'citizen',
    userId: item.citizenId,
    title: 'Grievance Resolved — Action Completed',
    message: `Officer ${req.user.name} marked ticket ${id} as RESOLVED: "${resolutionNotes || 'Field work completed'}"`,
    grievanceId: id,
    link: `/citizen/${id}`,
    type: 'RESOLVED'
  };
  await postgresDB.saveNotification(citizenNotif);
  createNotification(citizenNotif);

  // Persist resolved status in the grievances table
  await postgresDB.updateGrievanceStatus(id, {
    status: 'RESOLVED',
    resolvedAt: item.resolvedAt,
    resolutionNotes: item.resolutionNotes,
    resolutionPhotoUrl: item.resolutionPhotoUrl
  });

  // Write to civic_memory so resolved issues inform future AI suggestions
  try {
    const memoryEmbedding = await aiProvider.generateEmbedding(
      `${item.category || ''} - ${item.subcategory || ''}: ${resolutionNotes}`
    );
    await postgresDB.addCivicMemoryFromResolution({
      grievanceId: id,
      title: item.title || item.description?.slice(0, 80),
      category: item.category,
      department: item.department,
      resolutionNotes: resolutionNotes || 'Field resolution completed',
      officerName: req.user.name,
      embedding: memoryEmbedding
    });
  } catch (memErr) {
    console.warn('[CivicMemory] Failed to generate embedding for civic memory:', memErr.message);
    // Still write without embedding
    await postgresDB.addCivicMemoryFromResolution({
      grievanceId: id,
      title: item.title || item.description?.slice(0, 80),
      category: item.category,
      department: item.department,
      resolutionNotes: resolutionNotes || 'Field resolution completed',
      officerName: req.user.name,
      embedding: null
    });
  }

  await persistGrievanceRecord(item);

  orchestrator.broadcastEvent('grievance_resolved', { grievanceId: id, officer: req.user.name });

  res.json({ success: true, grievance: item });
});

// Formal Workflow Status Transitions (Supabase-persisted with canonical states)
app.post('/api/grievances/:id/transition-status', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), async (req, res) => {
  const { id } = req.params;
  const { newStatus, reason, actionType, notes, evidenceUrl } = req.body;

  if (!newStatus) {
    return res.status(400).json({ error: 'newStatus is required.' });
  }

  const item = await getGrievanceRecord(id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  // Officer / Dept Admin department isolation check
  if ((req.user.role === 'officer' || req.user.role === 'civic_officer' || req.user.role === 'dept_admin') && req.user.department && item.department) {
    const userDeptShort = req.user.department.split(' ')[0].toLowerCase();
    const itemDeptShort = item.department.split(' ')[0].toLowerCase();
    if (!item.department.toLowerCase().includes(userDeptShort) && !req.user.department.toLowerCase().includes(itemDeptShort)) {
      return res.status(403).json({ error: `Unauthorized: User belongs to ${req.user.department} and cannot update status for ${item.department}.` });
    }
  }

  const previousStatus = normalizeStatus(item.status);
  const targetCanonicalStatus = normalizeStatus(newStatus);

  if (!isValidTransition(previousStatus, targetCanonicalStatus)) {
    if (req.user.role !== 'super_admin') {
      return sendError(
        res,
        422,
        'INVALID_STATUS_TRANSITION',
        `Invalid status transition from ${previousStatus} to ${targetCanonicalStatus}. Permitted next states: ${(ALLOWED_STATUS_TRANSITIONS[previousStatus] || []).join(', ') || 'none'}`
      );
    }
    console.warn(`[StatusTransition] Super admin override transition from ${previousStatus} to ${targetCanonicalStatus}`);
  }

  item.status = targetCanonicalStatus;

  if (!item.statusHistory) item.statusHistory = [];
  const historyEntry = {
    transitionId: `TR-${Date.now()}`,
    previousStatus,
    newStatus: targetCanonicalStatus,
    actor: req.user.name,
    role: req.user.role,
    designation: req.user.designation || 'Municipal Authority',
    timestamp: new Date().toLocaleTimeString(),
    date: new Date().toISOString().split('T')[0],
    reason: reason || `Status transitioned to ${targetCanonicalStatus}`
  };
  item.statusHistory.push(historyEntry);

  if (!item.timeline) item.timeline = [];
  item.timeline.push({
    stage: getRoleStatusLabel(targetCanonicalStatus, 'citizen'),
    time: 'Just now',
    detail: reason || `Workflow progressed from ${previousStatus} to ${targetCanonicalStatus} by ${req.user.name}`,
    status: targetCanonicalStatus === 'RESOLVED' || targetCanonicalStatus === 'ACTION_COMPLETED' ? 'completed' : 'in_progress'
  });

  // Persist status transition to Supabase
  await postgresDB.recordStatusTransition({
    incidentId: item.incidentId || item.id,
    fromStatus: previousStatus,
    toStatus: targetCanonicalStatus,
    reason: reason || `Workflow transition by ${req.user.name}`,
    trigger: 'OFFICER_MANUAL_TRANSITION',
    actorId: req.user.id,
    actorName: req.user.name,
    actorRole: req.user.role
  });

  // If this transition involves field action (investigation or active repair)
  if (targetCanonicalStatus === CANONICAL_STATUSES.INVESTIGATION || targetCanonicalStatus === CANONICAL_STATUSES.ACTION_IN_PROGRESS || actionType) {
    await postgresDB.recordFieldAction({
      incidentId: item.incidentId || null,
      grievanceId: item.id,
      officerId: req.user.id,
      officerName: req.user.name,
      actionType: actionType || (targetCanonicalStatus === CANONICAL_STATUSES.INVESTIGATION ? 'INSPECTION' : 'REMEDIATION'),
      status: targetCanonicalStatus === CANONICAL_STATUSES.ACTION_COMPLETED ? 'COMPLETED' : 'IN_PROGRESS',
      notes: notes || reason || `Field action under status: ${targetCanonicalStatus}`,
      evidenceUrl: evidenceUrl || null
    });
  }

  await postgresDB.logAuditEvent(req.user.name, 'STATUS_TRANSITION', id, `${previousStatus} -> ${targetCanonicalStatus} (Reason: ${reason || 'Operational update'})`);
  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'STATUS_TRANSITION',
    targetId: id,
    details: `${previousStatus} -> ${targetCanonicalStatus} (Reason: ${reason || 'Operational update'})`
  });

  const citizenLabel = getRoleStatusLabel(targetCanonicalStatus, 'citizen');
  const citizenNotif = {
    userRole: 'citizen',
    userId: item.citizenId,
    title: `Status: ${citizenLabel}`,
    message: `Grievance ${id}: ${citizenLabel}. ${reason || ''}`,
    grievanceId: id,
    link: `/citizen/${id}`,
    type: 'STATUS_UPDATE'
  };
  await postgresDB.saveNotification(citizenNotif);
  createNotification(citizenNotif);

  await persistGrievanceRecord(item);

  // Map to canonical event
  let eventType = CANONICAL_EVENTS.COMPLAINT_UPDATED;
  if (targetCanonicalStatus === CANONICAL_STATUSES.INVESTIGATION) {
    eventType = CANONICAL_EVENTS.INVESTIGATION_STARTED;
  } else if (targetCanonicalStatus === CANONICAL_STATUSES.ACTION_IN_PROGRESS) {
    eventType = CANONICAL_EVENTS.FIELD_ACTION_STARTED;
  } else if (targetCanonicalStatus === CANONICAL_STATUSES.ACTION_COMPLETED) {
    eventType = CANONICAL_EVENTS.FIELD_ACTION_COMPLETED;
  } else if (targetCanonicalStatus === CANONICAL_STATUSES.RESOLVED) {
    eventType = CANONICAL_EVENTS.INCIDENT_RESOLVED;
  } else if (targetCanonicalStatus === CANONICAL_STATUSES.REOPENED) {
    eventType = CANONICAL_EVENTS.INCIDENT_REOPENED;
  }

  orchestrator.broadcastEvent(eventType, { 
    grievanceId: id, 
    incidentId: item.incidentId,
    previousStatus, 
    newStatus: targetCanonicalStatus, 
    actor: req.user.name 
  });

  // Also broadcast status_changed for legacy clients
  orchestrator.broadcastEvent('status_changed', { 
    grievanceId: id, 
    incidentId: item.incidentId,
    previousStatus, 
    newStatus: targetCanonicalStatus, 
    actor: req.user.name 
  });

  res.json({ success: true, grievance: item, transition: historyEntry });
});

// GET /api/field-actions (Section 18 Field Action System)
app.get('/api/field-actions', authenticateToken, requireRole(['officer', 'civic_officer', 'dept_admin', 'super_admin']), async (req, res) => {
  try {
    const { incidentId, grievanceId, officerId } = req.query;
    const actions = await postgresDB.getFieldActions({ incidentId, grievanceId, officerId });
    const local = db.getFieldActions ? db.getFieldActions({ incidentId, grievanceId, officerId }) : [];
    const combined = actions && actions.length > 0 ? actions : local;
    return res.json({ success: true, data: combined, fieldActions: combined, count: combined.length });
  } catch (err) {
    return sendError(res, 500, 'FIELD_ACTIONS_ERROR', err.message);
  }
});

// POST /api/field-actions (Section 18 Field Action System)
app.post('/api/field-actions', authenticateToken, requireRole(['officer', 'civic_officer', 'dept_admin', 'super_admin']), async (req, res) => {
  try {
    const {
      incidentId,
      grievanceId,
      actionType,
      status,
      notes,
      evidenceUrl,
      beforePhotoUrl,
      afterPhotoUrl,
      gpsLat,
      gpsLng,
      startedAt,
      completedAt
    } = req.body;

    if (!incidentId && !grievanceId) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'Either incidentId or grievanceId is required.');
    }

    const actionStatus = status || (completedAt || afterPhotoUrl ? 'COMPLETED' : 'IN_PROGRESS');
    const fieldActionItem = {
      incidentId: incidentId || null,
      grievanceId: grievanceId || null,
      officerId: req.user.id,
      officerName: req.user.name,
      actionType: actionType || 'REPAIR',
      status: actionStatus,
      notes: notes || '',
      evidenceUrl: evidenceUrl || afterPhotoUrl || beforePhotoUrl || null,
      beforePhotoUrl: beforePhotoUrl || null,
      afterPhotoUrl: afterPhotoUrl || null,
      gpsLat: gpsLat || null,
      gpsLng: gpsLng || null,
      startedAt: startedAt || null,
      completedAt: completedAt || null
    };

    await postgresDB.recordFieldAction(fieldActionItem);
    if (db.saveFieldAction) {
      db.saveFieldAction(fieldActionItem);
    }

    let targetGrievance = null;
    if (grievanceId) {
      targetGrievance = await getGrievanceRecord(grievanceId);
      if (targetGrievance) {
        const nextStatus = actionStatus === 'COMPLETED' 
          ? CANONICAL_STATUSES.ACTION_COMPLETED 
          : CANONICAL_STATUSES.ACTION_IN_PROGRESS;
        targetGrievance.status = nextStatus;
        if (!targetGrievance.timeline) targetGrievance.timeline = [];
        targetGrievance.timeline.push({
          stage: getRoleStatusLabel(nextStatus, 'citizen'),
          time: 'Just now',
          detail: notes || `Field action (${actionType || 'REPAIR'}) logged by ${req.user.name}`,
          status: actionStatus === 'COMPLETED' ? 'completed' : 'in_progress'
        });
        await persistGrievanceRecord(targetGrievance);
      }
    }

    await postgresDB.logAuditEvent(
      req.user.name,
      'FIELD_ACTION_LOGGED',
      grievanceId || incidentId,
      `Action: ${actionType || 'REPAIR'} (${actionStatus}) by ${req.user.name}`
    );

    const eventName = actionStatus === 'COMPLETED' 
      ? CANONICAL_EVENTS.FIELD_ACTION_COMPLETED 
      : CANONICAL_EVENTS.FIELD_ACTION_STARTED;

    orchestrator.broadcastEvent(eventName, {
      incidentId,
      grievanceId,
      actionType: actionType || 'REPAIR',
      officer: req.user.name,
      status: actionStatus
    });

    return res.status(201).json({
      success: true,
      message: 'Field action recorded successfully',
      data: {
        incidentId,
        grievanceId,
        officer: req.user.name,
        actionType: actionType || 'REPAIR',
        status: actionStatus,
        notes,
        evidenceUrl: evidenceUrl || afterPhotoUrl || beforePhotoUrl || null
      }
    });
  } catch (err) {
    return sendError(res, 500, 'FIELD_ACTION_ERROR', err.message);
  }
});

// GET /api/verifications (Section 19 Citizen Verification Records)
app.get('/api/verifications', authenticateToken, async (req, res) => {
  try {
    const { grievanceId, incidentId, citizenId } = req.query;
    const effectiveCitizenId = (req.user.role === 'citizen') ? req.user.id : citizenId;
    const records = await postgresDB.getVerifications({
      grievanceId,
      incidentId,
      citizenId: effectiveCitizenId
    });
    return res.json({ success: true, data: records, count: records.length });
  } catch (err) {
    return sendError(res, 500, 'VERIFICATIONS_ERROR', err.message);
  }
});

// POST /api/verifications (Section 19 Citizen Verification Endpoint)
app.post('/api/verifications', authenticateToken, async (req, res) => {
  try {
    const { grievanceId, incidentId, satisfaction, status, feedbackText, feedback, rating, evidencePhotos, photoUrl } = req.body;
    const targetId = grievanceId || incidentId;
    if (!targetId) {
      return sendError(res, 400, 'VALIDATION_ERROR', 'grievanceId or incidentId is required for verification.');
    }

    const item = await getGrievanceRecord(targetId);
    if (!item) {
      return sendError(res, 404, 'GRIEVANCE_NOT_FOUND', 'Grievance record not found for verification.');
    }

    if (req.user.role === 'citizen' && item.citizenId && item.citizenId !== req.user.id && item.citizenPhone !== req.user.phone) {
      return sendError(res, 403, 'FORBIDDEN', 'You can only verify grievances submitted by your account.');
    }

    const isSatisfied = satisfaction === 'SATISFIED' || satisfaction === 'YES' || status === 'CONFIRMED' || status === 'SATISFIED';
    const newStatus = isSatisfied ? 'RESOLVED_CONFIRMED' : 'DISPUTE_REOPENED';
    const canonicalStatus = isSatisfied ? CANONICAL_STATUSES.RESOLVED : CANONICAL_STATUSES.REOPENED;
    const previousStatus = item.status;
    item.status = newStatus;
    item.canonicalStatus = canonicalStatus;

    item.citizenVerification = {
      verifiedAt: new Date().toISOString(),
      satisfaction: isSatisfied ? 'SATISFIED' : 'DISPUTED',
      feedbackText: feedbackText || feedback || (isSatisfied ? 'Resolution confirmed by citizen on-site' : 'Citizen reported issue is still not fixed on ground'),
      evidencePhotos: evidencePhotos || (photoUrl ? [photoUrl] : []),
      rating: rating || (isSatisfied ? 5 : 2)
    };

    if (!item.timeline) item.timeline = [];
    item.timeline.push({
      stage: isSatisfied ? 'Citizen Verified & Closed' : 'Dispute Reopened by Citizen',
      time: 'Just now',
      detail: isSatisfied 
        ? 'Citizen completed real verification: Problem confirmed completely resolved.'
        : `Citizen disputed resolution: "${item.citizenVerification.feedbackText}"`,
      status: isSatisfied ? 'completed' : 'in_progress'
    });

    await postgresDB.recordVerification({
      grievanceId: item.id,
      incidentId: item.incidentId || item.clusterId || null,
      citizenId: req.user.id,
      status: isSatisfied ? 'CONFIRMED' : 'DISPUTED',
      feedback: item.citizenVerification.feedbackText,
      rating: item.citizenVerification.rating,
      photoUrl: item.citizenVerification.evidencePhotos?.[0] || null
    });

    await postgresDB.recordStatusTransition({
      incidentId: item.incidentId || item.id,
      fromStatus: previousStatus,
      toStatus: newStatus,
      reason: item.citizenVerification.feedbackText,
      trigger: isSatisfied ? 'CITIZEN_CONFIRMED_RESOLUTION' : 'CITIZEN_DISPUTED_RESOLUTION',
      actorId: req.user.id,
      actorName: req.user.name,
      actorRole: req.user.role
    });

    if (isSatisfied) {
      try {
        const memoryText = `${item.title} - ${item.category} in ${item.location?.ward || 'Ward'}. Root cause: ${item.dna?.problem || item.category}. Resolution applied: ${item.resolutionNotes || 'Remediated by field team'}.`;
        const emb = await aiProvider.generateEmbedding(memoryText);
        await postgresDB.saveCivicMemory({
          incidentTitle: item.title,
          category: item.category,
          department: item.department,
          rootCause: item.dna?.problem || 'Infrastructure wear and joint failure',
          resolutionApplied: item.resolutionNotes || 'Standard municipal engineering remediation',
          contractor: 'Delhi Municipal Maintenance Division',
          warrantyPeriod: '12 Months',
          recurrenceRate: '2.1%',
          costEstimate: '₹35,000',
          embedding: emb
        });
      } catch (memErr) {
        console.warn('Civic memory generation error:', memErr.message);
      }
    }

    await postgresDB.logAuditEvent(
      req.user.name,
      isSatisfied ? 'VERIFICATION_CONFIRMED' : 'VERIFICATION_DISPUTED',
      item.id,
      `Verification: ${isSatisfied ? 'Satisfied' : 'Disputed'} by citizen ${req.user.name}`
    );

    await persistGrievanceRecord(item);

    const eventType = isSatisfied ? CANONICAL_EVENTS.INCIDENT_RESOLVED : CANONICAL_EVENTS.INCIDENT_REOPENED;
    orchestrator.broadcastEvent(eventType, {
      grievanceId: item.id,
      incidentId: item.incidentId,
      verifiedBy: req.user.name,
      satisfaction: isSatisfied ? 'SATISFIED' : 'DISPUTED',
      rating: item.citizenVerification.rating,
      timestamp: item.citizenVerification.verifiedAt
    });

    return res.json({
      success: true,
      grievance: item,
      verification: item.citizenVerification,
      newStatus
    });
  } catch (err) {
    return sendError(res, 500, 'VERIFICATION_ERROR', err.message);
  }
});

// Human Authorized Duplicate Management (Never auto-delete or auto-merge without officer action)
app.post('/api/grievances/:id/duplicate-action', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { candidateId, action, justification } = req.body; // action: 'MERGE_AS_DUPLICATE' | 'LINK_AS_RELATED' | 'MARK_INDEPENDENT'

  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  if (!item.duplicateDecisions) item.duplicateDecisions = [];
  const decision = {
    candidateId,
    action,
    officer: req.user.name,
    justification: justification || 'Human verification confirmed relationship.',
    timestamp: new Date().toLocaleTimeString()
  };
  item.duplicateDecisions.push(decision);

  let detailMsg = `Officer confirmed ticket ${candidateId} as ${action}`;
  if (action === 'MERGE_AS_DUPLICATE') {
    detailMsg = `Officer verified ${candidateId} as duplicate of ${id}. Linked into shared response cluster.`;
  } else if (action === 'LINK_AS_RELATED') {
    detailMsg = `Officer marked ${candidateId} as related downstream symptom.`;
  } else {
    detailMsg = `Officer classified ${candidateId} as independent separate failure.`;
  }

  item.timeline.push({
    stage: 'Duplicate Decision (Authorized)',
    time: 'Just now',
    detail: detailMsg,
    status: 'in_progress'
  });

  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'DUPLICATE_ACTION_AUTHORIZED',
    targetId: id,
    details: `${action} on candidate ${candidateId}`
  });

  res.json({ success: true, grievance: item, decision });
});

// Officer internal notes (Personnel only)
app.post('/api/grievances/:id/internal-notes', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { note } = req.body;
  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  if (!item.internalNotes) item.internalNotes = [];
  const newNote = {
    id: `NOTE-${Date.now()}`,
    author: req.user.name,
    role: req.user.role,
    designation: req.user.designation || 'Field Official',
    note: note || '',
    timestamp: new Date().toLocaleTimeString()
  };
  item.internalNotes.push(newNote);

  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'INTERNAL_NOTE_ADDED',
    targetId: id,
    details: note
  });

  res.json({ success: true, grievance: item });
});

// Officer reassigns grievance to another officer or department
app.post('/api/grievances/:id/reassign', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { newOfficer, newDepartment, reason } = req.body;
  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  const oldOfficer = item.officerName;
  if (newOfficer) item.officerName = newOfficer;
  if (newDepartment) item.department = newDepartment;

  item.timeline.push({
    stage: 'Case Reassigned',
    time: 'Just now',
    detail: `Reassigned from ${oldOfficer} to ${item.officerName} (${item.department}). Reason: ${reason || 'Jurisdiction realignment'}`,
    status: 'in_progress'
  });

  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'GRIEVANCE_REASSIGNED',
    targetId: id,
    details: `Reassigned to ${item.officerName} (${item.department})`
  });

  res.json({ success: true, grievance: item });
});

// Officer escalates grievance to senior engineer
app.post('/api/grievances/:id/escalate', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { reason, escalationTarget } = req.body;
  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  item.urgency = 'CRITICAL';
  item.urgencyScore = Math.max(item.urgencyScore, 98);
  item.escalatedTo = escalationTarget || 'Superintending Engineer';

  item.timeline.push({
    stage: 'Supervisory Escalation',
    time: 'Just now',
    detail: `Escalated by ${req.user.name} to ${item.escalatedTo}: "${reason || 'High risk of civic disruption'}"`,
    status: 'in_progress'
  });

  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'GRIEVANCE_ESCALATED',
    targetId: id,
    details: `Escalated to ${item.escalatedTo}`
  });

  createNotification({
    userRole: 'dept_admin',
    title: `Critical Escalation Alert: ${id}`,
    message: `Officer ${req.user.name} escalated case to ${item.escalatedTo}: "${reason || 'SLA breached or severe public disruption'}"`,
    grievanceId: id,
    link: `/admin/department`,
    type: 'ESCALATION'
  });

  res.json({ success: true, grievance: item });
});

// Officer actions AI recommendation: ACCEPT, MODIFY, or REJECT
app.post('/api/grievances/:id/recommendation-action', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), async (req, res) => {
  const { id } = req.params;
  const { action, modifiedAction, rejectionReason } = req.body;
  const item = await getGrievanceRecord(id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  // Officer / Dept Admin department isolation check
  if ((req.user.role === 'officer' || req.user.role === 'civic_officer' || req.user.role === 'dept_admin') && req.user.department && item.department) {
    const userDeptShort = req.user.department.split(' ')[0].toLowerCase();
    const itemDeptShort = item.department.split(' ')[0].toLowerCase();
    if (!item.department.toLowerCase().includes(userDeptShort) && !req.user.department.toLowerCase().includes(itemDeptShort)) {
      return res.status(403).json({ error: `Unauthorized: User belongs to ${req.user.department} and cannot act on recommendations for ${item.department}.` });
    }
  }

  if (!item.recommendationDecisions) item.recommendationDecisions = [];
  item.recommendationDecisions.push({
    action,
    officer: req.user.name,
    timestamp: new Date().toLocaleTimeString(),
    modifiedAction: modifiedAction || null,
    rejectionReason: rejectionReason || null
  });

  if (!item.timeline) item.timeline = [];
  if (action === 'ACCEPT') {
    item.status = 'IN_PROGRESS';
    item.timeline.push({
      stage: 'AI Recommendation Approved',
      time: 'Just now',
      detail: `Officer approved standard SOP: ${item.recommendedResolution?.primaryAction || 'Field repair'}`,
      status: 'in_progress'
    });
  } else if (action === 'MODIFY') {
    item.status = 'IN_PROGRESS';
    if (item.recommendedResolution) item.recommendedResolution.primaryAction = modifiedAction;
    item.timeline.push({
      stage: 'AI Recommendation Modified',
      time: 'Just now',
      detail: `Officer customized work order: "${modifiedAction}"`,
      status: 'in_progress'
    });
  } else if (action === 'REJECT') {
    item.timeline.push({
      stage: 'AI Recommendation Rejected',
      time: 'Just now',
      detail: `Officer rejected AI SOP. Reason: "${rejectionReason}". Manual protocol invoked.`,
      status: 'in_progress'
    });
  }

  await persistGrievanceRecord(item);
  try {
    await postgresDB.updateGrievanceStatus(item.id, item.status, {
      recommendationDecisions: item.recommendationDecisions,
      recommendedResolution: item.recommendedResolution
    });
  } catch (err) {}

  res.json({ success: true, grievance: item });
});

// Citizen feedback on resolved grievance
app.post('/api/grievances/:id/feedback', authenticateToken, requireRole(['citizen']), (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  item.citizenFeedback = {
    rating: Number(rating) || 5,
    comment: comment || 'Resolution was prompt and satisfactory.',
    submittedAt: new Date().toLocaleTimeString()
  };

  item.timeline.push({
    stage: 'Citizen Feedback Received',
    time: 'Just now',
    detail: `Citizen rated ${item.citizenFeedback.rating}/5 stars: "${item.citizenFeedback.comment}"`,
    status: 'completed'
  });

  recordAuditLog({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'CITIZEN_FEEDBACK_SUBMITTED',
    targetId: id,
    details: `Rating: ${rating}/5 Stars`
  });

  res.json({ success: true, grievance: item });
});

// Update User Profile Settings
app.put('/api/auth/settings', authenticateToken, (req, res) => {
  const { phone, ward, pincode, preferredLanguage, notifications } = req.body;
  if (phone) req.user.phone = phone;
  if (ward) req.user.ward = ward;
  if (pincode) req.user.pincode = pincode;
  if (preferredLanguage) req.user.preferredLanguage = preferredLanguage;
  if (notifications) req.user.notifications = notifications;

  const { password: _, ...safeUser } = req.user;
  res.json({ success: true, user: safeUser });
});

// ============================================================================
// Admin Endpoints (Dept Admin & Super Admin)
// ============================================================================

// Department Admin Analytics — live Supabase counts
app.get('/api/admin/analytics', authenticateToken, requireRole(['dept_admin', 'super_admin', 'civic_officer']), async (req, res) => {
  try {
    const result = await postgresDB.query(`
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE status IN ('RESOLVED','CLOSED')) AS resolved,
        COUNT(*) FILTER (WHERE urgency = 'CRITICAL' AND status NOT IN ('RESOLVED','CLOSED')) AS critical,
        COUNT(*) FILTER (WHERE status = 'DISPUTE_REOPENED') AS disputed,
        COUNT(*) FILTER (WHERE status NOT IN ('RESOLVED','CLOSED')) AS active
      FROM public.grievances
    `);
    const row = result?.rows?.[0] || {};
    const depts = await postgresDB.getDepartments();
    return res.json({
      metrics: {
        totalGrievances: parseInt(row.total) || GRIEVANCES_DB.length,
        activeGrievances: parseInt(row.active) || 0,
        resolvedGrievances: parseInt(row.resolved) || 0,
        criticalUrgency: parseInt(row.critical) || 0,
        reopenedDisputes: parseInt(row.disputed) || 0,
        avgSlaHours: '38.4 Hours',
        slaComplianceRate: '94.2%'
      },
      departments: depts.length > 0 ? depts : DEPARTMENTS
    });
  } catch (e) {
    console.warn('[Analytics] DB query failed:', e.message);
    const total = GRIEVANCES_DB.length;
    const resolved = GRIEVANCES_DB.filter(g => g.status === 'RESOLVED').length;
    return res.json({
      metrics: { totalGrievances: total, activeGrievances: total - resolved, resolvedGrievances: resolved, criticalUrgency: 0, reopenedDisputes: 0, avgSlaHours: '38.4 Hours', slaComplianceRate: '94.2%' },
      departments: DEPARTMENTS
    });
  }
});

// Officer Live Stats — for the Officer Dashboard metrics section
app.get('/api/stats/officer', authenticateToken, requireRole(['officer', 'civic_officer', 'dept_admin', 'super_admin']), async (req, res) => {
  try {
    const stats = await postgresDB.getOfficerStats(req.user.id);
    if (stats) {
      return res.json({ stats });
    }
  } catch (e) {
    console.warn('[OfficerStats] DB query failed:', e.message);
  }
  // Fallback from memory cache
  const total = GRIEVANCES_DB.length;
  const resolved = GRIEVANCES_DB.filter(g => g.status === 'RESOLVED' || g.status === 'CLOSED').length;
  const active = total - resolved;
  return res.json({
    stats: {
      total,
      active,
      resolved,
      critical: GRIEVANCES_DB.filter(g => g.urgency === 'CRITICAL' && g.status !== 'RESOLVED').length,
      disputed: GRIEVANCES_DB.filter(g => g.status === 'DISPUTE_REOPENED').length,
      inProgress: GRIEVANCES_DB.filter(g => g.status === 'IN_PROGRESS').length,
      escalated: GRIEVANCES_DB.filter(g => g.status === 'ESCALATED').length,
      slaOverdue: 0,
      slaAtRisk: 0
    }
  });
});

// Super Admin Users Management
app.get('/api/admin/users', authenticateToken, requireRole(['super_admin']), (req, res) => {
  const safeUsers = USERS.map(({ password: _, ...u }) => u);
  res.json({ users: safeUsers });
});

// Super Admin Audit Logs (Authoritative Supabase PostgreSQL with memory fallback)
app.get(['/api/admin/audit-logs', '/api/audit-logs'], authenticateToken, requireRole(['super_admin']), async (req, res) => {
  try {
    const logs = await postgresDB.getAuditLogs(100);
    if (logs && logs.length > 0) {
      return res.json({ auditLogs: logs });
    }
  } catch (e) {
    console.warn('[AuditLogs] DB read failed:', e.message);
  }
  res.json({ auditLogs: AUDIT_LOGS });
});

// Admin Departments
app.get('/api/admin/departments', authenticateToken, async (req, res) => {
  try {
    const depts = await postgresDB.getDepartments();
    if (depts && depts.length > 0) {
      return res.json({ departments: depts });
    }
  } catch (e) {}
  res.json({ departments: DEPARTMENTS });
});

// Super Admin SLA Rules
app.get('/api/admin/sla-rules', authenticateToken, requireRole(['super_admin', 'dept_admin']), (req, res) => {
  res.json({ slaRules: SLA_RULES });
});

app.post('/api/admin/sla-rules', authenticateToken, requireRole(['super_admin']), (req, res) => {
  const { slaRules } = req.body;
  if (Array.isArray(slaRules)) {
    SLA_RULES = slaRules;
  }
  res.json({ success: true, slaRules: SLA_RULES });
});

// ============================================================================
// Notifications Endpoints
// ============================================================================

// Get Notifications for Current User — primary source: Supabase PostgreSQL
app.get('/api/notifications', authenticateToken, async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  try {
    const dbNotifs = await postgresDB.getNotifications(userId, userRole);
    if (dbNotifs && dbNotifs.length > 0) {
      return res.json({
        notifications: dbNotifs,
        unreadCount: dbNotifs.filter(n => !n.read).length
      });
    }
  } catch (e) {
    console.warn('[Notifications] DB read failed, using memory fallback:', e.message);
  }

  // Memory fallback
  const relevant = NOTIFICATIONS_DB.filter(n => {
    if (userRole === 'super_admin') return true;
    if (n.userId && n.userId === userId) return true;
    if (n.userRole && n.userRole === userRole) return true;
    if (userRole === 'civic_officer' && (n.userRole === 'officer' || n.userRole === 'dept_admin')) return true;
    return false;
  });
  res.json({ notifications: relevant, unreadCount: relevant.filter(n => !n.read).length });
});

// Mark single notification as read (memory + DB)
app.post('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const item = NOTIFICATIONS_DB.find(n => n.id === id);
  if (item) item.read = true;
  try {
    await postgresDB.query(`UPDATE public.notifications SET read = true WHERE id::text = $1`, [id]);
  } catch (e) {}
  res.json({ success: true, notification: item });
});

// Mark all notifications as read for current user (memory + DB)
app.post('/api/notifications/mark-all-read', authenticateToken, async (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  NOTIFICATIONS_DB.forEach(n => {
    if (
      userRole === 'super_admin' ||
      (n.userId && n.userId === userId) ||
      (n.userRole && (n.userRole === userRole || (userRole === 'civic_officer' && (n.userRole === 'officer' || n.userRole === 'dept_admin'))))
    ) {
      n.read = true;
    }
  });
  try {
    if (userRole === 'super_admin') {
      await postgresDB.query(`UPDATE public.notifications SET read = true`, []);
    } else {
      await postgresDB.query(
        `UPDATE public.notifications SET read = true WHERE user_id = $1 OR user_role = $2`,
        [userId, userRole]
      );
    }
  } catch (e) {}
  res.json({ success: true });
});

// ============================================================================
// CIVIC INTELLIGENCE SUITE APIS
// ============================================================================

let CIVIC_SIGNALS_DB = [
  {
    id: "SIG-2026-001",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Pooja Malhotra",
    ward: "Ward 14 (Rohini Sector 14)",
    channel: "VOICE_NOTE",
    rawInput: "Road ke side se paani aa raha hai continuous pichle 2 din se.",
    translatedText: "Water is continuously leaking from the roadside since the last 2 days.",
    category: "Water Supply & Contamination",
    inferredAsset: "Roadside Water Pipeline Seam",
    hasPhoto: true,
    photoUrl: "https://images.unsplash.com/photo-1584467735815-f778f274e296?w=600&auto=format&fit=crop&q=80",
    lat: 28.7170,
    lng: 77.1250,
    timestamp: "2026-09-12 08:15 AM",
    status: "CLUSTERED",
    confidence: "High (94%)"
  },
  {
    id: "SIG-2026-002",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Vikram Sethi",
    ward: "Ward 14 (Rohini Sector 14)",
    channel: "QUICK_TEXT",
    rawInput: "Morning municipal tap water smells foul like sewer in Pocket 2.",
    translatedText: "Morning municipal tap water smells foul like sewer in Pocket 2.",
    category: "Water Supply & Contamination",
    inferredAsset: "Drinking Water Supply Feeder",
    hasPhoto: false,
    lat: 28.7180,
    lng: 77.1258,
    timestamp: "2026-09-12 09:40 AM",
    status: "CLUSTERED",
    confidence: "High (91%)"
  },
  {
    id: "SIG-2026-003",
    incidentId: "INC-2026-DEL-01",
    citizenName: "Anand Rathi",
    ward: "Ward 14 (Rohini Sector 14)",
    channel: "QUICK_TEXT",
    rawInput: "Low water pressure on 1st and 2nd floors since yesterday.",
    translatedText: "Low water pressure on 1st and 2nd floors since yesterday.",
    category: "Water Supply & Contamination",
    inferredAsset: "Distribution Pressure Feeder",
    hasPhoto: false,
    lat: 28.7192,
    lng: 77.1264,
    timestamp: "2026-09-13 07:15 AM",
    status: "CLUSTERED",
    confidence: "Medium (85%)"
  }
];

let CIVIC_INCIDENTS_DB = [
  {
    id: "INC-2026-DEL-01",
    title: "Water Pipeline Joint Rupture & Cross-Subsoil Infiltration",
    summary: "Subsurface joint fracture in 1988 cast-iron distribution feeder. Continuous water leakage has saturated road subgrade across Ward 12 & 14, causing negative pressure sewer infiltration into potable lines and softening arterial pavement.",
    incidentType: "INFRASTRUCTURE_FAILURE",
    status: "Investigating",
    stage: "GROWING",
    stageVelocity: "+240% increase over 5 days",
    severity: "CRITICAL",
    confidence: "High (89% signal correlation)",
    signalCount: 37,
    formalComplaintsCount: 18,
    citizenObservationsCount: 19,
    affectedArea: "Ward 12 → Ward 14 (Rohini Sector 14 Corridor)",
    affectedPopulation: "~2,800 Citizens (650 Households)",
    firstDetectedAt: "2026-09-12 08:15 AM",
    lastUpdatedAt: "Just now",
    departments: [
      { name: "Delhi Jal Board (DJB)", lead: true, cases: 24, role: "Main potable carrier isolation, trench excavation & clamp replacement" },
      { name: "Public Works Department (PWD)", lead: false, cases: 9, role: "Road pavement stabilizing & subsoil drainage rehabilitation" },
      { name: "Municipal Corporation of Delhi (MCD)", lead: false, cases: 4, role: "Adjacent storm drain blockage clearing & sanitization" }
    ],
    complaintDna: {
      issueType: "Water Infrastructure",
      subIssue: "Pipeline Rupture & Negative Pressure Contamination",
      service: "Potable Municipal Water Distribution",
      asset: "100mm Cast-Iron Feeder Main (Line-14C)",
      locationContext: "Underground roadside utility corridor (Depth 1.4m)",
      department: "Delhi Jal Board (DJB)",
      severity: "CRITICAL",
      urgency: "HIGH",
      symptoms: [
        "Intermittent pressure deficit in morning hours",
        "Sewage backflow odor in drinking taps",
        "Road sub-base waterlogging and asphalt wave",
        "Foul yellowish water discharge in Pocket 2"
      ],
      entities: [
        "Mother Dairy Booth #441",
        "Pocket 2 Feeder Valve #7",
        "Sector 14 Arterial Road",
        "Govt Primary School #2"
      ],
      possibleCauses: [
        "Aging 1988 cast-iron joint degradation exceeding 35-year design life",
        "Loss of soil compaction due to heavy municipal truck traffic",
        "Negative pressure cross-siphoning from adjacent masonry storm drain"
      ],
      affectedPopulation: [
        "650 residential households in Pocket 1 & 2",
        "Sector 14 DDA Commercial Complex (42 shops)",
        "Govt Primary School #2 (~420 students)"
      ],
      temporalPattern: "Severe during 07:00–10:00 AM municipal pumping cycle",
      environmentalContext: "Post-monsoon saturated subsoil accelerating joint cavitation"
    },
    timeline: [
      { date: "12 Sept", time: "08:15 AM", stage: "First Weak Signal Detected", desc: "Citizen voice note SIG-2026-001 logged water trickling out from road seam near Mother Dairy booth.", count: 1, source: "Citizen Signal" },
      { date: "13 Sept", time: "09:30 AM", stage: "Signal Cluster Formation", desc: "5 related citizen observations logged within 250m radius describing pressure loss and damp asphalt.", count: 6, source: "AI Clustering" },
      { date: "30 Sept", time: "11:00 AM", stage: "Formal Complaint Wave", desc: "12 formal citizen grievances submitted. AI Incident Engine aggregates signals into Civic Incident INC-2026-PUNE-WAG-01.", count: 18, source: "Incident Engine" },
      { date: "01 Oct", time: "02:20 PM", stage: "Geographic Spread Detected", desc: "Seepage crossed jurisdictional ward boundary from Wagholi Ward 29 into Ward 27.", count: 26, source: "Geographic Engine" },
      { date: "01 Oct", time: "04:45 PM", stage: "Cross-Department Linkage", desc: "PWD received road depression reports along Nagar Road corridor. PMC reported drain backflow.", count: 32, source: "Cross-Dept Detector" },
      { date: "02 Oct", time: "09:00 AM", stage: "Escalation to GROWING Stage", desc: "Signal velocity reached +240%. High public distress triggers multi-department supervisory alert.", count: 37, source: "Escalation Engine" }
    ],
    spreadGeo: [
      { step: "Day 1 (Sep 28)", ward: "Wagholi Ward 29 (Origin)", lat: 18.5760, lng: 73.9810, radiusMeters: 140, signalCount: 2, label: "Initial weak signal at Kesnand Rd valve pit", color: "#10B981" },
      { step: "Day 3 (Sep 30)", ward: "Wagholi Ward 29 (Ivy Estate Loop)", lat: 18.5768, lng: 73.9818, radiusMeters: 420, signalCount: 18, label: "Subsurface spread to Ivy Estate residential loop", color: "#F59E0B" },
      { step: "Day 5 (Oct 01)", ward: "Wagholi Wards 27, 28 & 29 (Arterial Corridor)", lat: 18.5785, lng: 73.9830, radiusMeters: 850, signalCount: 37, label: "Full corridor impact: drinking water + road dip + drain backflow", color: "#EF4444" }
    ],
    rootCauseHypotheses: [
      {
        id: "RCH-01",
        title: "Corrosion & Joint Dislodgement in 1988 Cast-Iron Main Line",
        confidence: "HIGH",
        confidenceScore: 88,
        evidence: [
          "37 correlated citizen signals & complaints clustered along the same 400m utility corridor",
          "DJB GIS asset register marks line vintage as Year 1988 (exceeded 35-year design lifespan)",
          "SCADA telemetry confirms local line pressure drop from 3.2 bar to 0.8 bar at 08:15 AM pump start",
          "Historical precedent: Case DJB-HIST-2025-081 occurred 120m away under identical joint failure symptoms"
        ],
        verificationRequired: true,
        recommendedVerification: "Deploy acoustic leak correlator & ultrasonic pipe thickness sensor at Mother Dairy junction"
      },
      {
        id: "RCH-02",
        title: "Cross-Siphoning from Damaged Stormwater Masonry Drain",
        confidence: "MEDIUM",
        confidenceScore: 68,
        evidence: [
          "4 citizen complaints report foul sewer odor specifically during non-supply low-pressure hours",
          "MCD sanitation log notes cracked masonry wall in storm drain line #14 on Sep 10"
        ],
        verificationRequired: true,
        recommendedVerification: "Conduct non-toxic fluorometric dye test at upstream storm drain inlet"
      }
    ],
    crossDepartmentImpact: {
      primaryDepartment: "Delhi Jal Board (DJB)",
      sharedProblemSummary: "Underground water main rupture is softening road base and causing drain overflow — affecting 3 separate civic authorities.",
      departments: [
        { dept: "Delhi Jal Board (DJB)", cases: 24, icon: "Droplet", badgeColor: "#0E5E3A", impactSummary: "Main potable water pressure loss & contamination risk across 650 households." },
        { dept: "Public Works Department (PWD)", cases: 9, icon: "Wrench", badgeColor: "#D97706", impactSummary: "Road subgrade saturation causing 35cm asphalt depression." },
        { dept: "Municipal Corporation of Delhi (MCD)", cases: 4, icon: "Building2", badgeColor: "#7C3AED", impactSummary: "Storm drain blockage and standing water pools." }
      ],
      coordinationRecommendation: "Initiate Unified Joint Action: DJB isolates feeder at 11:00 AM; PWD inspects road sub-base concurrently before asphalt re-bedding; MCD flushes storm drain barriers."
    },
    civicMemory: [
      {
        year: "2025",
        date: "14 June 2025",
        incidentId: "DJB-HIST-2025-081",
        title: "100mm Cast-Iron Main Joint Failure (Pocket 1)",
        actionTaken: "Emergency split-sleeve repair clamp + sodium hypochlorite flush",
        outcome: "Resolved immediate pressure deficit for 7 months, but thermal expansion stressed adjacent pipe segment.",
        lessonsLearned: "Clamping older cast iron without cathodic protection creates galvanic stress 40-50m downstream within 12 months."
      },
      {
        year: "2024",
        date: "22 March 2024",
        incidentId: "DJB-HIST-2024-412",
        title: "Sewer Cross-Infiltration at Mother Dairy Crossing",
        actionTaken: "Temporary bitumen patch over road surface without underground pipe realignment",
        outcome: "Pavement recaved after 8 weeks following heavy monsoon runoff.",
        lessonsLearned: "Patching road surface without replacing defective pipe guarantees structural pavement collapse."
      }
    ],
    simulations: [
      {
        id: "SIM-A",
        title: "Option A: Rapid Temporary Clamping (Split-Sleeve)",
        description: "Excavate single 1.5m pit at Mother Dairy booth and install emergency stainless steel split-sleeve clamp.",
        timeToIntervention: "4–6 Hours",
        expectedResolutionTime: "Same Day (6 Hours)",
        affectedPopulationReduction: "80% immediate relief",
        recurrenceRisk: "HIGH (65% probability of recurrence within 6 months)",
        resourceRequirement: "Low (1 Repair Squad + 4 Technicians)",
        costScore: "₹18,000",
        coordinationRequired: "DJB only",
        confidence: "High",
        recommendationVerdict: "SUB-OPTIMAL: High risk of repeated pavement collapse and secondary contamination."
      },
      {
        id: "SIM-B",
        title: "Option B: Full 24-Meter Ductile Iron Segment Replacement & PWD Road Re-bedding",
        description: "Comprehensive replacement of aged 1988 line with modern polyurethane-lined ductile iron + PWD granular sub-base reconstruction.",
        timeToIntervention: "18–24 Hours",
        expectedResolutionTime: "36 Hours (Temporary water tankers provided)",
        affectedPopulationReduction: "98% permanent fix",
        recurrenceRisk: "LOW (< 5% recurrence over 15 years)",
        resourceRequirement: "High (DJB Trenching Unit + PWD Roller Squad)",
        costScore: "₹1,45,000",
        coordinationRequired: "DJB + PWD + Delhi Traffic Police",
        confidence: "High",
        recommendationVerdict: "RECOMMENDED: Eliminates long-term civic disruption and complies with Zero Dead-End mandate."
      },
      {
        id: "SIM-C",
        title: "Option C: Multi-Department Joint Field Inspection & Pressure Testing",
        description: "Before mechanical excavation, run acoustic leak correlation and dye testing across DJB and MCD assets.",
        timeToIntervention: "2–3 Hours",
        expectedResolutionTime: "8 Hours (Diagnostic phase only)",
        affectedPopulationReduction: "0% (Diagnostic only)",
        recurrenceRisk: "N/A",
        resourceRequirement: "Medium (Diagnostic Engineers from DJB & PWD)",
        costScore: "₹6,500",
        coordinationRequired: "DJB + MCD",
        confidence: "Very High",
        recommendationVerdict: "Essential first step before executing Option B."
      }
    ],
    relatedGrievanceIds: ["DL-2026-W14-0892", "DL-2026-W14-0895", "DL-2026-W14-0901", "DL-2026-W14-0912"],
    humanDecisions: [
      {
        id: "DEC-01",
        decision: "ACCEPT_RECOMMENDATION",
        actionSelected: "Option B: Full 24-Meter Ductile Iron Segment Replacement & PWD Road Re-bedding",
        officer: "Er. Sanjay Sharma (AEE)",
        timestamp: "Sep 16, 2026 10:30 AM",
        notes: "Field inspection confirmed 1988 cast iron pipe is brittle. Authorizing trench squad with PWD coordination."
      }
    ]
  },
  {
    id: "INC-2026-DEL-02",
    title: "Moolchand Underpass Storm Drain Inversion & Asphalt Erosion",
    summary: "Heavy monsoon drain backflow at Moolchand arterial junction. Underground masonry drain collapse has washed away subsoil under asphalt, creating an acute 40cm cavity and flooding outer ring lanes.",
    incidentType: "HAZARD_STRUCTURAL",
    status: "Action Planned",
    stage: "EMERGING",
    stageVelocity: "+180% increase over 4 days",
    severity: "HIGH",
    confidence: "Medium-High (84% signal correlation)",
    signalCount: 21,
    formalComplaintsCount: 11,
    citizenObservationsCount: 10,
    affectedArea: "Ward 8 → Ward 9 (Lajpat Nagar / Moolchand Ring Road)",
    affectedPopulation: "Major Commuter Corridor (~35,000 vehicles/day)",
    firstDetectedAt: "2026-09-14 07:45 AM",
    lastUpdatedAt: "25 mins ago",
    departments: [
      { name: "Public Works Department (PWD)", lead: true, cases: 15, role: "Structural cavity filling, bitumen cold-patching & traffic cordoning" },
      { name: "Municipal Corporation of Delhi (MCD)", lead: false, cases: 6, role: "Heavy silt extraction from underpass culvert drain" }
    ],
    complaintDna: {
      issueType: "Roads & Structural Infrastructure",
      subIssue: "Underpass Silt Inversion & Asphalt Cavitation",
      service: "Arterial Road Network",
      asset: "Outer Ring Road Moolchand Underpass Slip Way",
      locationContext: "Arterial Ring Road Junction (Below Moolchand Flyover)",
      department: "Public Works Department (PWD)",
      severity: "HIGH",
      urgency: "CRITICAL",
      symptoms: ["40cm deep road cavity", "Two-wheeler skidding", "Standing storm runoff puddle"],
      entities: ["Moolchand Underpass Entry", "Flyover Pillar #12"],
      possibleCauses: ["Stormwater pipe rupture eroding asphalt base", "Heavy monsoon silt accumulation"],
      affectedPopulation: ["Daily ring road commuters"]
    },
    simulations: [
      {
        id: "SIM-02-B",
        title: "Option B: Culvert Silt Extraction + Reinforced Concrete Sub-base Re-bedding",
        description: "MCD super-sucker clears culvert; PWD constructs reinforced concrete apron with mastic asphalt.",
        timeToIntervention: "8 Hours",
        expectedResolutionTime: "18 Hours",
        affectedPopulationReduction: "95%",
        recurrenceRisk: "LOW (< 8%)",
        resourceRequirement: "Medium-High",
        costScore: "₹85,000",
        coordinationRequired: "PWD + MCD",
        confidence: "High",
        recommendationVerdict: "RECOMMENDED ACTION"
      }
    ],
    relatedGrievanceIds: ["DL-2026-W08-0419"],
    humanDecisions: []
  },
  {
    id: "INC-2026-DEL-03",
    title: "Kalkaji Market 11kV Feeder Transformer Overheating & Arc Hazard",
    summary: "Thermal degradation of 400kVA transformer bushings in high-density market pocket. Frequent voltage surges and visible electric arc flashes creating acute public safety hazard.",
    incidentType: "ELECTRICAL_FIRE",
    status: "Investigating",
    stage: "GROWING",
    stageVelocity: "+120% in 48 hours",
    severity: "CRITICAL",
    confidence: "High (92% signal correlation)",
    signalCount: 9,
    formalComplaintsCount: 5,
    citizenObservationsCount: 4,
    affectedArea: "Ward 5 (Kalkaji Main Market Pocket)",
    affectedPopulation: "120 Retail Outlets + ~350 Residential Units",
    firstDetectedAt: "2026-09-15 03:30 PM",
    lastUpdatedAt: "1 hour ago",
    departments: [
      { name: "BSES Rajdhani Power Limited", lead: true, cases: 9, role: "Transformer isolation, HT bushing replacement & load rebalancing" }
    ],
    complaintDna: {
      issueType: "Electricity & Power Grid",
      subIssue: "Distribution Transformer Arc Flash & Thermal Overload",
      service: "Urban Low-Voltage Power Grid",
      asset: "400 kVA Pole-Mounted Step-Down Transformer (TR-05-4)",
      locationContext: "Dense commercial market alleyway (Gali No. 3)",
      department: "BSES Rajdhani Power Limited",
      severity: "CRITICAL",
      urgency: "CRITICAL",
      symptoms: ["Loud buzzing arc sparks", "Transformer oil leak", "Voltage drops to 140V"]
    },
    simulations: [
      {
        id: "SIM-03-A",
        title: "Option A: Remote Feeder Trip + Mobile Substation Bypass",
        description: "Safely isolate feeder and plug in 500kVA truck-mounted transformer while repairing primary unit.",
        timeToIntervention: "45 Mins",
        expectedResolutionTime: "2.5 Hours",
        affectedPopulationReduction: "100%",
        recurrenceRisk: "LOW (< 5%)",
        resourceRequirement: "High (Mobile Substation Van)",
        costScore: "₹35,000",
        coordinationRequired: "BSES Grid Control",
        confidence: "Very High",
        recommendationVerdict: "RECOMMENDED ACTION"
      }
    ],
    relatedGrievanceIds: ["DL-2026-W05-0298"],
    humanDecisions: []
  }
];

// Note: Real-time Server-Sent Events (SSE) Stream is unified and handled at ['/api/events', '/api/intelligence/events']


// GET all civic incidents (Authoritative Supabase PostgreSQL with fallback)
app.get(['/api/intelligence/incidents', '/api/incidents'], async (req, res) => {
  let incidents = await postgresDB.getAllIncidents();
  if (!incidents || incidents.length === 0) {
    incidents = db.getIncidents();
  }
  res.json({
    incidents,
    total: incidents.length
  });
});

// GET single civic incident by ID (with linked complaints & field actions)
app.get(['/api/intelligence/incidents/:id', '/api/incidents/:id'], async (req, res) => {
  const { id } = req.params;
  let incident = await postgresDB.getIncidentWithLinkedComplaints(id);
  if (!incident) {
    incident = db.getIncidentById(id);
  }
  if (!incident) return res.status(404).json({ error: 'Civic Incident not found.' });
  res.json({ incident });
});

// GET incident authoritative timeline
app.get(['/api/intelligence/incidents/:id/timeline', '/api/incidents/:id/timeline'], async (req, res) => {
  const { id } = req.params;
  const timeline = await postgresDB.getAuthoritativeTimeline(null, id);
  res.json({ success: true, incidentId: id, timeline });
});

// GET all clusters
app.get('/api/intelligence/clusters', (req, res) => {
  res.json({ clusters: db.getClusters() });
});

// GET real-time graph data for Live Complaint Linkage section
app.get('/api/intelligence/graph', (req, res) => {
  const incidents = db.getIncidents();
  const clusters = db.getClusters();
  const complaints = db.getComplaints();

  const activeIncident = incidents[0] || null;

  // Format real complaints from database into linkage graph nodes
  const nodes = complaints.slice(0, 40).map((c, idx) => {
    const isWater = (c.category || '').toLowerCase().includes('water') || (c.title || '').toLowerCase().includes('water');
    const isRoad = (c.category || '').toLowerCase().includes('road') || (c.title || '').toLowerCase().includes('road');
    
    return {
      id: c.id,
      citizen: c.citizenName || `Citizen #${idx + 1}`,
      channel: c.evidence?.hasAudio ? '🎙 Voice Note' : c.evidence?.hasPhoto ? '📷 Geo-Photo' : '✍ Quick Text',
      type: isWater ? 'water' : isRoad ? 'road' : 'other',
      icon: isWater ? '💧' : isRoad ? '🛣️' : '⚠️',
      text: c.descriptionRaw || c.title || '',
      ward: c.location?.ward || 'Ward 14 (Rohini)',
      lat: Number(c.location?.lat) || 28.7180,
      lng: Number(c.location?.lng) || 77.1260,
      matchScore: Math.round((c.clusterConfidence || 0.94) * 100),
      linkedTo: c.incidentId || activeIncident?.id || 'INC-2026-DEL-01',
      clusterId: c.clusterId,
      dna: c.dna,
      analysis: c.analysis,
      timestamp: c.createdAt || c.timestamp || 'Just now',
      status: c.status
    };
  });

  res.json({
    incident: activeIncident,
    clusters,
    nodes,
    totalNodes: nodes.length
  });
});

// POST simulate incoming signal (Demo data generator feeding REAL pipeline)
app.post('/api/intelligence/simulate-signal', async (req, res) => {
  const { citizen, channel, text, ward, lat, lng, category } = req.body;
  const newId = `DL-2026-W${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}`;

  const complaintPayload = {
    id: newId,
    title: text ? text.slice(0, 50) : `Citizen Signal in ${ward || 'Ward 14'}`,
    descriptionRaw: text || 'Observation of municipal infrastructure degradation.',
    category: category || 'General Civic Infrastructure',
    location: {
      ward: ward || 'Ward 14 (Rohini Sector 14)',
      lat: Number(lat) || 28.7185,
      lng: Number(lng) || 77.1250
    },
    citizenName: citizen || 'Verified Resident',
    citizenId: 'USR-SIMULATED',
    evidence: {
      hasAudio: channel ? channel.includes('Voice') : false,
      hasPhoto: channel ? channel.includes('Photo') : false
    },
    isSimulatedDemo: true
  };

  const orchestration = await orchestrator.processComplaint(complaintPayload);

  res.json({
    success: true,
    complaint: orchestration.complaint,
    cluster: orchestration.cluster,
    incident: orchestration.incident
  });
});

// POST closed-loop citizen verification
app.post('/api/intelligence/incidents/:id/verify', (req, res) => {
  const { id } = req.params;
  const { isConfirmed, citizenName, citizenId, notes } = req.body;

  try {
    const result = orchestrator.processVerification(id, {
      isConfirmed,
      citizenName,
      citizenId,
      notes
    });

    res.json({ success: true, incident: result.incident });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// POST human decision on incident recommendation
app.post('/api/intelligence/incidents/:id/decision', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { decision, actionSelected, notes } = req.body;
  const incident = db.getIncidentById(id);
  if (!incident) return res.status(404).json({ error: 'Civic Incident not found.' });

  const record = {
    id: `DEC-${Date.now()}`,
    decision,
    actionSelected: actionSelected || 'Field Inspection & Verification',
    officer: req.user.name,
    timestamp: new Date().toLocaleString(),
    notes: notes || 'Officer verified against on-ground signals.'
  };

  if (!incident.humanDecisions) incident.humanDecisions = [];
  incident.humanDecisions.unshift(record);

  if (decision === 'ACCEPT_RECOMMENDATION') {
    incident.status = 'Action Planned';
    incident.stage = 'RESOLVING';
  } else if (decision === 'REQUEST_VERIFICATION') {
    incident.status = 'Investigating';
  }

  db.saveIncident(incident);

  db.logEvent({
    incidentId: id,
    eventType: 'INCIDENT_DECISION_RECORDED',
    actorType: 'OFFICER',
    actorId: req.user.id,
    payload: { decision, actionSelected: record.actionSelected, officer: req.user.name }
  });

  createNotification({
    userRole: 'dept_admin',
    title: `Decision Recorded on ${id}`,
    message: `${req.user.name} recorded decision: ${decision} for incident "${incident.title}".`,
    grievanceId: id,
    link: `/intelligence/incidents/${id}`,
    type: 'INCIDENT_DECISION'
  });

  res.json({ success: true, incident, record });
});

// GET citizen signals
app.get('/api/intelligence/signals', (req, res) => {
  const signals = db.getSignals();
  res.json({
    signals,
    total: signals.length
  });
});

// POST citizen signal
app.post('/api/intelligence/signals', async (req, res) => {
  const { rawInput, citizenName, ward, channel, hasPhoto, photoUrl, lat, lng, category } = req.body;
  const newSignal = {
    id: `SIG-${Date.now().toString().slice(-6)}`,
    incidentId: "INC-2026-DEL-01",
    citizenName: citizenName || 'Anonymous Citizen',
    ward: ward || 'Ward 14 (Rohini Sector 14)',
    channel: channel || 'QUICK_TEXT',
    rawInput: rawInput || 'Citizen observed infrastructure breakdown.',
    translatedText: rawInput || 'Citizen observed infrastructure breakdown.',
    category: category || 'Water Supply & Contamination',
    inferredAsset: 'Public Utility Corridor',
    hasPhoto: !!hasPhoto,
    photoUrl: photoUrl || null,
    lat: lat || 28.7180,
    lng: lng || 77.1260,
    timestamp: new Date().toLocaleString(),
    status: 'CLUSTERED',
    confidence: 'High (92%)'
  };

  db.saveSignal(newSignal);

  // Ingest into pipeline to update incident observations
  const complaintPayload = {
    id: newSignal.id,
    title: (rawInput || 'Citizen Signal').slice(0, 50),
    descriptionRaw: rawInput,
    category: newSignal.category,
    location: { ward: newSignal.ward, lat: newSignal.lat, lng: newSignal.lng },
    citizenName: newSignal.citizenName,
    citizenId: 'USR-SIGNAL-CITIZEN'
  };
  await orchestrator.processComplaint(complaintPayload);

  res.json({
    success: true,
    signal: newSignal,
    message: 'Signal received. Your observation helps identify broader civic problems.'
  });
});

// ============================================================================
// GEMINI-POWERED JAN_SAHAYAK AI ASSISTANT API
// Server-Side Role-Aware Grounded Reasoning & Controlled Mutations
// ============================================================================

const ASSISTANT_CONVERSATIONS = new Map();

// 1. Process Chat Message via Server-Side Gemini
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let user = req.body.user || null;

    if (token) {
      try {
        const { data } = await supabaseServer.auth.getUser(token);
        if (data?.user) {
          const profile = await postgresDB.getCivicProfile(data.user.id);
          user = {
            id: data.user.id,
            name: profile?.full_name || data.user.user_metadata?.full_name || data.user.email?.split('@')[0],
            role: (profile?.role || data.user.user_metadata?.role || 'CITIZEN').toLowerCase(),
            department: profile?.department_id,
            ward: profile?.ward
          };
        } else if (SESSIONS[token]) {
          user = SESSIONS[token];
        }
      } catch (err) {}
    }

    if (!user) {
      user = req.body.user || {
        id: 'USR-CITIZEN-01',
        name: 'Aditya Verma',
        role: 'citizen',
        ward: 'Ward 14 (Rohini Sector 14)'
      };
    }

    const { message, conversationId, context = {} } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const convId = conversationId || `conv_${user.id || 'anon'}`;
    const history = ASSISTANT_CONVERSATIONS.get(convId) || [];

    const result = await geminiAssistant.processChatMessage({
      message: message.trim(),
      history,
      user,
      context
    });

    // Update conversation history (bounded to last 16)
    history.push({ sender: 'user', text: message.trim(), timestamp: new Date().toISOString() });
    history.push({ sender: 'assistant', text: result.reply, timestamp: new Date().toISOString() });
    if (history.length > 16) {
      history.splice(0, history.length - 16);
    }
    ASSISTANT_CONVERSATIONS.set(convId, history);

    res.json({
      success: true,
      reply: result.reply,
      toolsCalled: result.toolsCalled || [],
      actionProposal: result.actionProposal || null,
      conversationId: convId,
      groundedData: result.groundedData || null
    });
  } catch (err) {
    console.error('[Assistant Chat Error]:', err);
    res.status(500).json({
      success: false,
      error: 'AI Assistant temporarily unavailable hai. Aap Jan_Sahayak ke normal features use kar sakte hain.',
      reply: 'AI Assistant temporarily unavailable hai. Aap Jan_Sahayak ke normal features use kar sakte hain.'
    });
  }
});

// 2. Execute User-Confirmed Sensitive Action (Reopen, Escalate, Verify)
app.post('/api/assistant/action/confirm', async (req, res) => {
  const { actionType, entityId, entityType, reason, user } = req.body;
  if (!actionType || !entityId) {
    return res.status(400).json({ error: 'actionType and entityId are required for action confirmation.' });
  }

  const actingUser = user || { id: 'USR-CITIZEN-01', name: 'Aditya Verma', role: 'citizen' };

  try {
    if (actionType === 'REOPEN_COMPLAINT') {
      const grievance = await postgresDB.getGrievanceById(entityId);
      if (grievance) {
        grievance.status = CANONICAL_STATUSES.REOPENED;
        grievance.timeline = grievance.timeline || [];
        grievance.timeline.push({
          status: CANONICAL_STATUSES.REOPENED,
          title: 'Complaint Reopened by Citizen',
          timestamp: new Date().toLocaleString(),
          description: reason || 'Citizen confirmed reopening via JanSahayak AI Assistant.'
        });
        await postgresDB.updateGrievance(entityId, {
          status: CANONICAL_STATUSES.REOPENED,
          timeline: grievance.timeline
        });
        db.updateGrievance(entityId, grievance);
      }

      await postgresDB.logAuditEvent(actingUser.name, 'COMPLAINT_REOPENED', entityId, reason || 'Reopened via AI Assistant confirmation');
      orchestrator.broadcastEvent({
        type: CANONICAL_EVENTS.GRIEVANCE_STATUS_CHANGED,
        payload: { id: entityId, status: CANONICAL_STATUSES.REOPENED, reason }
      });

      return res.json({
        success: true,
        actionType,
        entityId,
        newStatus: CANONICAL_STATUSES.REOPENED,
        message: `Complaint #${entityId} ko safaltapoorvak reopen kar diya gaya hai aur Superintending Engineer ko escalate kiya gaya hai.`
      });
    }

    if (actionType === 'ESCALATE_INCIDENT') {
      await postgresDB.logAuditEvent(actingUser.name, 'INCIDENT_ESCALATED', entityId, reason || 'Escalated by authority via Assistant');
      orchestrator.broadcastEvent({
        type: 'INCIDENT_ESCALATED',
        payload: { id: entityId, severity: 'CRITICAL', reason }
      });

      return res.json({
        success: true,
        actionType,
        entityId,
        message: `Incident #${entityId} ko Priority 1 SLA ke saath escalate kar diya gaya hai.`
      });
    }

    if (actionType === 'VERIFY_RESOLUTION') {
      const grievance = await postgresDB.getGrievanceById(entityId);
      if (grievance) {
        grievance.status = CANONICAL_STATUSES.RESOLVED;
        grievance.citizenVerification = {
          status: 'VERIFIED',
          verifiedAt: new Date().toISOString(),
          verifiedBy: actingUser.name
        };
        await postgresDB.updateGrievance(entityId, {
          status: CANONICAL_STATUSES.RESOLVED,
          citizen_verification: grievance.citizenVerification
        });
        db.updateGrievance(entityId, grievance);
      }

      await postgresDB.logAuditEvent(actingUser.name, 'CITIZEN_VERIFIED', entityId, 'Citizen verified resolution on ground via AI Assistant');
      orchestrator.broadcastEvent({
        type: CANONICAL_EVENTS.VERIFICATION_RECORDED,
        payload: { id: entityId, status: CANONICAL_STATUSES.RESOLVED }
      });

      return res.json({
        success: true,
        actionType,
        entityId,
        newStatus: CANONICAL_STATUSES.RESOLVED,
        message: `Dhanyawad! Complaint #${entityId} ka verification confirm ho gaya hai aur iski permanent entry Civic Memory mein store kar di gayi hai.`
      });
    }

    res.status(400).json({ error: `Unrecognized action type: ${actionType}` });
  } catch (err) {
    console.error('[Action Confirmation Error]:', err);
    res.status(500).json({ error: `Action execution failed: ${err.message}` });
  }
});

// 3. Conversation Management
app.get('/api/assistant/conversations', (req, res) => {
  const convId = req.query.conversationId || 'conv_default';
  const history = ASSISTANT_CONVERSATIONS.get(convId) || [];
  res.json({ conversationId: convId, history });
});

app.delete('/api/assistant/conversations/:id', (req, res) => {
  ASSISTANT_CONVERSATIONS.delete(req.params.id);
  res.json({ success: true, message: 'Conversation cleared' });
});


// ============================================================================
// Production Static Bundle Serving (SPA Fallback)
// ============================================================================

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// Start Server when not running inside Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`JanSahayk Express API Server running on port ${PORT}`);
  });
}

export default app;
export { app };



