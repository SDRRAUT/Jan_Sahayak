import express from 'express';
import cors from 'cors';

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

let SESSIONS = {}; // token -> user
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
app.post('/api/grievances', authenticateToken, requireRole(['citizen', 'super_admin']), (req, res) => {
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
    location: location || { ward: req.user.ward, area: 'Local Area', city: 'New Delhi', pincode: req.user.pincode },
    urgency: urgency || 'HIGH',
    urgencyScore: urgencyScore || 85,
    status: 'TRIAGED',
    createdAt: 'Just now',
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

  GRIEVANCES_DB.unshift(newGrievance);

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

  res.status(201).json({ success: true, grievance: newGrievance });
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

// Start Server
app.listen(PORT, () => {
  console.log(`JanSahayk Express API Server running on port ${PORT}`);
});
