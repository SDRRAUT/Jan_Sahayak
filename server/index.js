import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db/database.js';
import { orchestrator } from './agents/orchestrator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ============================================================================
// In-Memory Database & Seed Data
// ============================================================================

const USERS = [
  {
    id: 'USR-CITIZEN-01',
    name: 'Aditya Verma',
    email: 'aditya@citizen.in',
    password: 'citizen123',
    role: 'citizen',
    phone: '+91 98712-88210',
    ward: 'Ward 14 (Rohini Sector 14)',
    pincode: '110085',
    verified: true
  },
  {
    id: 'USR-OFFICER-01',
    name: 'Er. Sanjay Sharma',
    email: 'sanjay.sharma@djb.gov.in',
    password: 'officer123',
    role: 'officer',
    department: 'Delhi Jal Board (DJB)',
    designation: 'Assistant Executive Engineer',
    zone: 'Zone North-West (Rohini)',
    phone: '+91 98111-90021'
  },
  {
    id: 'USR-DEPTADMIN-01',
    name: 'Er. Rajiv Malhotra',
    email: 'admin.djb@delhi.gov.in',
    password: 'deptadmin123',
    role: 'dept_admin',
    department: 'Delhi Jal Board (DJB)',
    designation: 'Chief Engineer & Department Administrator',
    phone: '+91 99100-11223'
  },
  {
    id: 'USR-SUPERADMIN-01',
    name: 'Dr. Meenakshi Sundaram, IAS',
    email: 'superadmin@delhi.gov.in',
    password: 'superadmin123',
    role: 'super_admin',
    designation: 'Principal Secretary (IT & Public Grievance)',
    phone: '+91 11-2339-2000'
  }
];

let SESSIONS = {
  'demo_token_citizen': USERS[0],
  'demo_token_officer': USERS[1],
  'demo_token_dept_admin': USERS[2],
  'demo_token_super_admin': USERS[3],
}; // token -> user
let AUDIT_LOGS = [
  { id: 'LOG-101', timestamp: '2026-09-16 09:31 AM', actor: 'System AI Engine', action: 'GRIEVANCE_TRIAGED', targetId: 'DL-2026-W14-0892', details: 'Autoclassified as Critical Biological Hazard, routed to DJB' },
  { id: 'LOG-102', timestamp: '2026-09-16 10:15 AM', actor: 'Er. Sanjay Sharma', action: 'DISPATCH_APPROVED', targetId: 'DL-2026-W14-0892', details: 'Emergency repair clamp squad mobilized to Mother Dairy junction' }
];

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
  return notif;
}

// Seed grievances storage
let GRIEVANCES_DB = [
  {
    id: "DL-2026-W14-0892",
    title: "Contaminated Drinking Water & Main Supply Pipe Leakage",
    descriptionRaw: "Bhai pichle 3 din se hamare Sector 14, Pocket 2 mein naali ka ganda badbudaar paani supply mein mix hoke aa raha hai. Bacche bimaar pad rahe hain, jaldi theek karwao please near Mother Dairy.",
    languageDetected: "Hinglish / Hindi (Confidence 98%)",
    category: "Water Supply & Contamination",
    department: "Delhi Jal Board (DJB)",
    officerName: "Er. Sanjay Sharma (AEE)",
    location: {
      ward: "Ward 14 (Rohini Sector 14)",
      area: "Pocket 2, Near Mother Dairy Booth",
      city: "New Delhi",
      pincode: "110085",
      lat: 28.7189,
      lng: 77.1265
    },
    urgency: "CRITICAL",
    urgencyScore: 94,
    status: "IN_PROGRESS",
    createdAt: "2026-09-16 09:30 AM",
    slaDeadline: "2026-09-17 06:00 PM",
    slaHoursLeft: 16,
    clusterId: "CL-W14-WATER-03",
    clusterTitle: "Ward 14 Sector 14 Main Pipeline Fracture Cluster",
    clusterCount: 18,
    upvotes: 42,
    citizenId: "USR-CITIZEN-01",
    citizenName: "Aditya Verma",
    citizenPhone: "+91 98712-XXXXX",
    evidence: {
      hasPhoto: true,
      photoUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=600&q=80',
      hasAudio: true,
      audioTranscript: 'Voice intake: Bhai pichle 3 din se hamare Sector 14 mein ganda paani aa raha hai...'
    },
    informationRequests: [],
    reopenedDispute: null,
    timeline: [
      { stage: "Submitted", time: "Sep 16, 09:30 AM", detail: "Complaint submitted via Voice-to-Grievance (Hinglish)", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 09:31 AM", detail: "Autoclassified as Critical Biological Hazard, routed to DJB", status: "completed" },
      { stage: "Cluster Merged", time: "Sep 16, 09:35 AM", detail: "Merged into Cluster CL-W14-WATER-03 (18 citizen complaints linked)", status: "completed" },
      { stage: "Officer Assigned", time: "Sep 16, 10:15 AM", detail: "Assigned to AEE Sanjay Sharma; Rapid team mobilized", status: "completed" },
      { stage: "Field Repair", time: "Sep 16, 02:40 PM", detail: "Excavation and clamp installation currently active", status: "in_progress" }
    ]
  },
  {
    id: "DL-2026-W08-0419",
    title: "Deep Road Cave-in / Dangerous Pothole Near Traffic Junction",
    descriptionRaw: "Moolchand flyover ke neeche Lajpat Nagar wali road pe bohot bada gaddha ho gaya hai barish ke baad. 2 scooter gir chuke hain aaj subah. Accidents ho rahe hain bar bar!",
    languageDetected: "Hinglish (Confidence 97%)",
    category: "Roads & Infrastructure",
    department: "Public Works Department (PWD)",
    officerName: "Er. Rajesh K. Meena",
    location: {
      ward: "Ward 8 (Lajpat Nagar / Moolchand)",
      area: "Ring Road, Moolchand Underpass Entry",
      city: "New Delhi",
      pincode: "110024",
      lat: 28.5684,
      lng: 77.2341
    },
    urgency: "HIGH",
    urgencyScore: 88,
    status: "TRIAGED",
    createdAt: "2026-09-16 11:20 AM",
    slaDeadline: "2026-09-18 11:00 AM",
    slaHoursLeft: 38,
    clusterId: "CL-W08-ROAD-01",
    clusterCount: 7,
    upvotes: 29,
    citizenId: "USR-CITIZEN-02",
    citizenName: "Pooja Malhotra",
    citizenPhone: "+91 98101-XXXXX",
    evidence: { hasPhoto: true, photoUrl: null, hasAudio: false },
    informationRequests: [],
    reopenedDispute: null,
    timeline: [
      { stage: "Submitted", time: "Sep 16, 11:20 AM", detail: "Photo + location pin submitted by commuter", status: "completed" },
      { stage: "AI Triage & DNA Generated", time: "Sep 16, 11:21 AM", detail: "Computer vision confirmed severe cavity on arterial road", status: "completed" }
    ]
  },
  {
    id: "DL-2026-W22-0112",
    title: "Overflowing Garbage Dump & Solid Waste Burning",
    descriptionRaw: "Sector 6 main market ke saamne open kude ka dher hai, 5 din se MCD ka dumper nahi aaya. Kal raat ko kisi ne aag laga di jisse bohot zyaada toxic smoke ho gaya hai.",
    languageDetected: "Hinglish (Confidence 99%)",
    category: "Sanitation & Solid Waste",
    department: "Municipal Corporation of Delhi (MCD)",
    officerName: "Dr. K. S. Tyagi (Sanitary Inspector)",
    location: {
      ward: "Ward 22 (Mayur Vihar Ph-1)",
      area: "Sector 6 DDA Market Complex",
      city: "New Delhi",
      pincode: "110091",
      lat: 28.6012,
      lng: 77.2982
    },
    urgency: "HIGH",
    urgencyScore: 82,
    status: "RESOLVED",
    createdAt: "2026-09-15 08:15 AM",
    slaDeadline: "2026-09-16 08:00 PM",
    slaHoursLeft: 0,
    clusterId: "CL-W22-SAN-09",
    clusterCount: 11,
    upvotes: 35,
    citizenId: "USR-CITIZEN-03",
    citizenName: "Gurpreet Singh",
    citizenPhone: "+91 99532-XXXXX",
    evidence: { hasPhoto: true, photoUrl: null, hasAudio: false },
    informationRequests: [],
    reopenedDispute: null,
    timeline: [
      { stage: "Submitted", time: "Sep 15, 08:15 AM", detail: "Citizen logged complaint", status: "completed" },
      { stage: "Resolved & Closed", time: "Sep 15, 03:00 PM", detail: "Two 12MT trucks loaded; lime powder scrubbed", status: "completed" }
    ]
  }
];

// ============================================================================
// Authentication & Authorization Middleware
// ============================================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Access token missing' });
  }

  const user = SESSIONS[token];
  if (!user) {
    return res.status(403).json({ error: 'Forbidden: Invalid or expired session token' });
  }

  req.user = user;
  next();
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions. Current role: ${req.user?.role || 'None'}` 
      });
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
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    service: 'JanSahayk Civic Intelligence API',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// ============================================================================
// Auth Endpoints
// ============================================================================

// 1. Register Citizen (or staff by admin)
app.post('/api/auth/register', (req, res) => {
  const { name, email, password, phone, ward, pincode } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Name, Email, and Password are required.' });
  }

  const existing = USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const newUser = {
    id: `USR-CITIZEN-${Date.now()}`,
    name,
    email,
    password,
    role: 'citizen',
    phone: phone || '+91 98000-00000',
    ward: ward || 'Ward 14 (Rohini Sector 14)',
    pincode: pincode || '110085',
    verified: true
  };

  USERS.push(newUser);
  const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  SESSIONS[token] = newUser;

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: newUser.name,
    action: 'CITIZEN_REGISTERED',
    targetId: newUser.id,
    details: `Citizen registered in ${newUser.ward}`
  });

  const { password: _, ...safeUser } = newUser;
  res.status(201).json({ token, user: safeUser });
});

// 2. Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required.' });
  }

  const user = USERS.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password credentials.' });
  }

  const token = `token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
  SESSIONS[token] = user;

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: user.name,
    action: 'USER_LOGIN',
    targetId: user.id,
    details: `Logged in with role: ${user.role}`
  });

  const { password: _, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

// 3. Current Authenticated Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const { password: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// 4. Logout
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  delete SESSIONS[token];
  res.json({ success: true, message: 'Logged out successfully.' });
});

// ============================================================================
// Grievances Endpoints (Role Protected)
// ============================================================================

// Get Grievances (Filtered by role & access)
app.get('/api/grievances', (req, res) => {
  // Public listing or authenticated filter
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const user = SESSIONS[token];

  if (!user) {
    // Return all public / non-sensitive fields
    return res.json({ grievances: GRIEVANCES_DB });
  }

  if (user.role === 'citizen') {
    // Return citizen's own plus public ward issues
    return res.json({ grievances: GRIEVANCES_DB });
  } else if (user.role === 'officer') {
    // Return grievances matching officer's department or unassigned
    const officerDept = user.department;
    const filtered = GRIEVANCES_DB.filter(g => !officerDept || g.department === officerDept || g.department.includes(officerDept.split(' ')[0]));
    return res.json({ grievances: filtered.length > 0 ? filtered : GRIEVANCES_DB });
  } else {
    // Dept Admin and Super Admin get complete database
    return res.json({ grievances: GRIEVANCES_DB });
  }
});

// Create Grievance (Citizen or Admin)
app.post('/api/grievances', authenticateToken, requireRole(['citizen', 'super_admin']), async (req, res) => {
  const { title, description, category, department, location, urgency, urgencyScore, evidence } = req.body;
  
  if (!description) {
    return res.status(400).json({ error: 'Grievance description is required.' });
  }

  const newId = `DL-2026-W${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}`;
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
    status: 'TRIAGED',
    createdAt: 'Just now',
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

  // Run through multi-agent orchestrator pipeline
  const orchestration = await orchestrator.processComplaint(newGrievance);

  GRIEVANCES_DB.unshift(newGrievance);
  db.saveComplaint(newGrievance);

  AUDIT_LOGS.unshift({
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

  res.status(201).json({ success: true, grievance: newGrievance, incident: orchestration.incident, cluster: orchestration.cluster });
});

// Direct Public Complaints API (Used for test suite and external reporting)
app.post('/api/complaints', async (req, res) => {
  const { text, description, title, location, category, citizenName, citizenId, ward, lat, lng } = req.body;
  const content = text || description;
  if (!content) return res.status(400).json({ error: 'Complaint text or description is required.' });

  const newId = `DL-2026-W${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}`;
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
    status: 'INGESTED'
  };

  const orchestration = await orchestrator.processComplaint(complaintPayload);
  GRIEVANCES_DB.unshift(complaintPayload);

  res.status(201).json({
    success: true,
    complaint: orchestration.complaint,
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

  AUDIT_LOGS.unshift({
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

// Officer resolves grievance with evidence upload
app.post('/api/grievances/:id/resolve', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { resolutionNotes, resolutionPhotoUrl } = req.body;

  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  item.status = 'RESOLVED';
  item.resolvedAt = new Date().toLocaleTimeString();
  item.resolutionNotes = resolutionNotes || 'Field team completed replacement and pressure testing.';
  item.resolutionPhotoUrl = resolutionPhotoUrl || null;

  item.timeline.push({
    stage: 'Resolved & Verified',
    time: 'Just now',
    detail: resolutionNotes || 'Work order completed by field division.',
    status: 'completed'
  });

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'GRIEVANCE_RESOLVED',
    targetId: id,
    details: resolutionNotes
  });

  createNotification({
    userRole: 'citizen',
    title: 'Grievance Resolved — Action Completed',
    message: `Officer ${req.user.name} marked ticket ${id} as RESOLVED: "${resolutionNotes || 'Field work completed'}"`,
    grievanceId: id,
    link: `/citizen/${id}`,
    type: 'RESOLVED'
  });

  res.json({ success: true, grievance: item });
});

// Formal Workflow Status Transitions (Submitted -> AI Analysed -> Assigned -> Under Review -> Information Required -> In Progress -> Escalated -> Resolved -> Closed)
app.post('/api/grievances/:id/transition-status', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { newStatus, reason } = req.body;

  const validStatuses = ['SUBMITTED', 'AI_ANALYSED', 'ASSIGNED', 'UNDER_REVIEW', 'INFORMATION_REQUIRED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'CLOSED'];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: `Invalid status. Must be one of [${validStatuses.join(', ')}]` });
  }

  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  const previousStatus = item.status;
  item.status = newStatus;

  if (!item.statusHistory) item.statusHistory = [];
  const historyEntry = {
    transitionId: `TR-${Date.now()}`,
    previousStatus,
    newStatus,
    actor: req.user.name,
    role: req.user.role,
    designation: req.user.designation || 'Municipal Authority',
    timestamp: new Date().toLocaleTimeString(),
    date: '2026-09-16',
    reason: reason || `Status transitioned to ${newStatus}`
  };
  item.statusHistory.push(historyEntry);

  item.timeline.push({
    stage: newStatus.replace(/_/g, ' '),
    time: 'Just now',
    detail: reason || `Workflow progressed from ${previousStatus} to ${newStatus} by ${req.user.name}`,
    status: newStatus === 'RESOLVED' || newStatus === 'CLOSED' ? 'completed' : 'in_progress'
  });

  AUDIT_LOGS.unshift({
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString(),
    actor: req.user.name,
    action: 'STATUS_TRANSITION',
    targetId: id,
    details: `${previousStatus} -> ${newStatus} (Reason: ${reason || 'Operational update'})`
  });

  createNotification({
    userRole: 'citizen',
    title: `Status: ${newStatus.replace(/_/g, ' ')}`,
    message: `Grievance ${id} updated to ${newStatus}. ${reason || ''}`,
    grievanceId: id,
    link: `/citizen/${id}`,
    type: 'STATUS_UPDATE'
  });

  res.json({ success: true, grievance: item, transition: historyEntry });
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

  AUDIT_LOGS.unshift({
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

  AUDIT_LOGS.unshift({
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

  AUDIT_LOGS.unshift({
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

  AUDIT_LOGS.unshift({
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
app.post('/api/grievances/:id/recommendation-action', authenticateToken, requireRole(['officer', 'dept_admin', 'super_admin']), (req, res) => {
  const { id } = req.params;
  const { action, modifiedAction, rejectionReason } = req.body;
  const item = GRIEVANCES_DB.find(g => g.id === id);
  if (!item) return res.status(404).json({ error: 'Grievance not found.' });

  if (!item.recommendationDecisions) item.recommendationDecisions = [];
  item.recommendationDecisions.push({
    action,
    officer: req.user.name,
    timestamp: new Date().toLocaleTimeString(),
    modifiedAction: modifiedAction || null,
    rejectionReason: rejectionReason || null
  });

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

  AUDIT_LOGS.unshift({
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

// Department Admin Analytics
app.get('/api/admin/analytics', authenticateToken, requireRole(['dept_admin', 'super_admin']), (req, res) => {
  const total = GRIEVANCES_DB.length;
  const resolved = GRIEVANCES_DB.filter(g => g.status === 'RESOLVED').length;
  const active = total - resolved;
  const critical = GRIEVANCES_DB.filter(g => g.urgency === 'CRITICAL' && g.status !== 'RESOLVED').length;
  const disputed = GRIEVANCES_DB.filter(g => g.status === 'DISPUTE_REOPENED').length;

  res.json({
    metrics: {
      totalGrievances: total,
      activeGrievances: active,
      resolvedGrievances: resolved,
      criticalUrgency: critical,
      reopenedDisputes: disputed,
      avgSlaHours: '38.4 Hours',
      slaComplianceRate: '94.2%'
    },
    departments: DEPARTMENTS
  });
});

// Super Admin Users Management
app.get('/api/admin/users', authenticateToken, requireRole(['super_admin']), (req, res) => {
  const safeUsers = USERS.map(({ password: _, ...u }) => u);
  res.json({ users: safeUsers });
});

// Super Admin Audit Logs
app.get('/api/admin/audit-logs', authenticateToken, requireRole(['super_admin']), (req, res) => {
  res.json({ auditLogs: AUDIT_LOGS });
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

// Get Notifications for Current User
app.get('/api/notifications', authenticateToken, (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  const relevant = NOTIFICATIONS_DB.filter(n => {
    if (userRole === 'super_admin') return true;
    if (n.userId && n.userId === userId) return true;
    if (n.userRole && n.userRole === userRole) return true;
    if (userRole === 'dept_admin' && n.userRole === 'officer') return true;
    return false;
  });

  res.json({
    notifications: relevant,
    unreadCount: relevant.filter(n => !n.read).length
  });
});

// Mark single notification as read
app.post('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  const item = NOTIFICATIONS_DB.find(n => n.id === id);
  if (item) {
    item.read = true;
  }
  res.json({ success: true, notification: item });
});

// Mark all notifications as read for current user
app.post('/api/notifications/mark-all-read', authenticateToken, (req, res) => {
  const userRole = req.user.role;
  const userId = req.user.id;

  NOTIFICATIONS_DB.forEach(n => {
    if (userRole === 'super_admin' || (n.userId && n.userId === userId) || (n.userRole && n.userRole === userRole)) {
      n.read = true;
    }
  });

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
      { date: "14 Sept", time: "11:00 AM", stage: "Formal Complaint Wave", desc: "12 formal citizen grievances submitted. AI Incident Engine aggregates signals into Civic Incident INC-2026-DEL-01.", count: 18, source: "Incident Engine" },
      { date: "15 Sept", time: "02:20 PM", stage: "Geographic Spread Detected", desc: "Seepage crossed jurisdictional ward boundary from Ward 12 into Ward 14 Pocket 2.", count: 26, source: "Geographic Engine" },
      { date: "16 Sept", time: "04:45 PM", stage: "Cross-Department Linkage", desc: "PWD received 3 road depression reports along the identical pipeline corridor. MCD reported drain backflow.", count: 32, source: "Cross-Dept Detector" },
      { date: "17 Sept", time: "09:00 AM", stage: "Escalation to GROWING Stage", desc: "Signal velocity reached +240%. High public distress triggers multi-department supervisory alert.", count: 37, source: "Escalation Engine" }
    ],
    spreadGeo: [
      { step: "Day 1 (Sep 12)", ward: "Ward 12 (Origin)", lat: 28.7160, lng: 77.1230, radiusMeters: 140, signalCount: 2, label: "Initial weak signal at pipeline valve pit", color: "#10B981" },
      { step: "Day 3 (Sep 14)", ward: "Ward 12 & Ward 14 (Pocket 1)", lat: 28.7175, lng: 77.1248, radiusMeters: 420, signalCount: 18, label: "Subsurface spread to Pocket 1 residential loop", color: "#F59E0B" },
      { step: "Day 5 (Sep 16-17)", ward: "Ward 12, 13 & 14 (Arterial Corridor)", lat: 28.7190, lng: 77.1270, radiusMeters: 920, signalCount: 37, label: "Full corridor impact: drinking water + road dip + drain backflow", color: "#EF4444" }
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

// Real-time Server-Sent Events (SSE) Stream
app.get('/api/intelligence/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  orchestrator.addSSEClient(res);
  res.write(`event: connected\ndata: ${JSON.stringify({ status: 'connected', time: new Date().toISOString() })}\n\n`);

  req.on('close', () => {
    orchestrator.removeSSEClient(res);
  });
});

// GET all civic incidents (Real DB)
app.get('/api/intelligence/incidents', (req, res) => {
  const incidents = db.getIncidents();
  res.json({
    incidents,
    total: incidents.length
  });
});

// GET single civic incident by ID (Real DB)
app.get('/api/intelligence/incidents/:id', (req, res) => {
  const { id } = req.params;
  const incident = db.getIncidentById(id);
  if (!incident) return res.status(404).json({ error: 'Civic Incident not found.' });
  res.json({ incident });
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
// Production Static Bundle Serving (SPA Fallback)
// ============================================================================

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`JanSahayk Express API Server running on port ${PORT}`);
});


